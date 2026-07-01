-- ================================================================
-- RLS FIX — Run this in your Supabase SQL Editor
-- The original policies caused infinite recursion because
-- checking admin status required reading the profiles table,
-- which itself required the admin RLS check to pass.
-- 
-- Fix: Use a SECURITY DEFINER function that bypasses RLS
-- ================================================================

-- Step 1: Create a helper function that reads the current user's role
-- SECURITY DEFINER means it runs as the function owner (postgres),
-- bypassing RLS and avoiding the infinite recursion.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid()
$$;

-- Step 2: Drop ALL old recursive policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Step 3: Drop ALL old recursive policies on cases
DROP POLICY IF EXISTS "Admins can do everything on cases" ON public.cases;
DROP POLICY IF EXISTS "Clients can view their own cases" ON public.cases;

-- Step 4: Drop ALL old recursive policies on documents
DROP POLICY IF EXISTS "Admins can do everything on documents" ON public.documents;
DROP POLICY IF EXISTS "Clients can view documents for their cases" ON public.documents;

-- Step 5: Drop ALL old recursive policies on messages
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can send messages to any case" ON public.messages;
DROP POLICY IF EXISTS "Clients can view messages for their cases" ON public.messages;
DROP POLICY IF EXISTS "Clients can send messages to their own cases" ON public.messages;

-- ================================================================
-- Step 6: Re-create all policies using get_my_role() (no recursion)
-- ================================================================

-- Profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.get_my_role() = 'admin');

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.get_my_role() = 'admin');

-- Cases
CREATE POLICY "Admins can do everything on cases"
ON public.cases FOR ALL TO authenticated
USING (public.get_my_role() = 'admin')
WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Clients can view their own cases"
ON public.cases FOR SELECT TO authenticated
USING (client_id = auth.uid());

-- Documents
CREATE POLICY "Admins can do everything on documents"
ON public.documents FOR ALL TO authenticated
USING (public.get_my_role() = 'admin')
WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Clients can view documents for their cases"
ON public.documents FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id AND cases.client_id = auth.uid()
  )
);

-- Messages
CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT TO authenticated
USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can send messages to any case"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Clients can view messages for their cases"
ON public.messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = messages.case_id AND cases.client_id = auth.uid()
  )
);

CREATE POLICY "Clients can send messages to their own cases"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = messages.case_id AND cases.client_id = auth.uid()
  ) AND sender_id = auth.uid()
);

-- ================================================================
-- Storage policies (if not already set)
-- ================================================================
DROP POLICY IF EXISTS "Admins have full access to case-documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Clients can download documents from case-documents bucket" ON storage.objects;

CREATE POLICY "Admins have full access to case-documents bucket"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'case-documents' AND public.get_my_role() = 'admin'
)
WITH CHECK (
  bucket_id = 'case-documents' AND public.get_my_role() = 'admin'
);

CREATE POLICY "Clients can download documents from case-documents bucket"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'case-documents' AND
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id::text = (string_to_array(name, '/'))[1]
      AND cases.client_id = auth.uid()
  )
);


-- ================================================================
-- ADDITIONAL MIGRATIONS
-- Run this block AFTER the main schema is applied.
-- ================================================================

-- Add next_hearing_date to cases table (for sorting)
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS next_hearing_date DATE;

-- Create case_updates table (full definition, safe to re-run)
CREATE TABLE IF NOT EXISTS public.case_updates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  update_type  TEXT NOT NULL DEFAULT 'general',
  posted_by    TEXT NOT NULL DEFAULT 'Admin',
  hearing_date DATE,
  court_name   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies for case_updates
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything on case_updates" ON public.case_updates;
CREATE POLICY "Admins can do everything on case_updates"
ON public.case_updates FOR ALL TO authenticated
USING (public.get_my_role() = 'admin')
WITH CHECK (public.get_my_role() = 'admin');

DROP POLICY IF EXISTS "Clients can view updates for their cases" ON public.case_updates;
CREATE POLICY "Clients can view updates for their cases"
ON public.case_updates FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_updates.case_id
      AND cases.client_id = auth.uid()
  )
);

-- Enable realtime for messages and case_updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.case_updates;
