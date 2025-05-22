import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./rtl.css"; // Import des styles spécifiques pour RTL
import "./rtl-extras.css"; // Styles RTL supplémentaires
import I18nProvider from "@/components/i18n-provider";
import { Locale } from "@/lib/i18n";
import "@/lib/check-env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tempo - Modern SaaS Starter",
  description: "A modern full-stack starter template powered by Next.js",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: Locale };
}>) {
  const locale = params.locale || "en";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <I18nProvider initialLocale={locale as Locale}>
          {children}
          <TempoInit />
        </I18nProvider>
      </body>
    </html>
  );
}
