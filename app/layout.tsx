import type { Metadata } from "next";
import { Inter, EB_Garamond, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Kaushik & Company | Advocates & Legal Consultants, Gurugram",
  description:
    "Kaushik & Company is a law firm based in Civil Lines, Gurugram, practising before the Punjab & Haryana High Court, Delhi High Court, and the District Courts of the NCR.",
  openGraph: {
    title: "Kaushik & Company | Advocates & Legal Consultants, Gurugram",
    description:
      "Kaushik & Company is a law firm based in Civil Lines, Gurugram, practising before the Punjab & Haryana High Court, Delhi High Court, and the District Courts of the NCR.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, ebGaramond.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}