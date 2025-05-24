import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      
      <div>{children}</div>
    </div>
  );
}
