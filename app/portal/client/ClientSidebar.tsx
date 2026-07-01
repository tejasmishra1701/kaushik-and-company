"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  IconLayoutDashboard,
  IconLogout,
  IconScale,
} from "@tabler/icons-react";

const navItems = [
  { label: "My Cases", href: "/portal/client", icon: IconLayoutDashboard },
];

export default function ClientSidebar({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/portal/login");
  };

  return (
    <aside className="flex w-64 flex-col border-r border-[#1e1e1e] bg-[#080808]">
      {/* Logo */}
      <div className="border-b border-[#1e1e1e] px-6 py-6">
        <div className="flex items-center gap-2">
          <IconScale size={18} className="text-[#c9a84c]" />
          <div>
            <div className="font-serif text-sm text-white">Kaushik &amp; Company</div>
            <div className="text-[10px] uppercase tracking-widest text-silver-dim">
              Client Portal
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6">
        <div className="mb-3 px-3 text-[10px] uppercase tracking-widest text-silver-dim">
          Navigation
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#1a1a1a] text-white"
                      : "text-silver-dim hover:bg-[#111111] hover:text-silver"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="client-nav-indicator"
                      className="ml-auto h-1 w-1 rounded-full bg-[#c9a84c]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="border-t border-[#1e1e1e] px-4 py-4">
        <div className="mb-3">
          <div className="text-xs font-medium text-silver">{userName}</div>
          <div className="mt-0.5 truncate text-[10px] text-silver-dim">
            {userEmail}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs text-silver-dim transition-colors hover:bg-[#111111] hover:text-silver"
        >
          <IconLogout size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
