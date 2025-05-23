import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./rtl.css"; // Import des styles spécifiques pour RTL
import "./rtl-extras.css"; // Styles RTL supplémentaires
import I18nProvider from "@/components/i18n-provider";
import { SupabaseProvider } from "@/context/supabase-provider";
import { Locale } from "@/lib/i18n";
import "@/lib/check-env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tempo - Modern SaaS Starter",
  description: "A modern full-stack starter template powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale: Locale = "en"; // Default locale for root layout

  return (
    <html
      lang={locale}
      dir={locale === "ar" as any ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <I18nProvider initialLocale={locale as Locale}>
          <SupabaseProvider>
            {children}
            <TempoInit />
          </SupabaseProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
