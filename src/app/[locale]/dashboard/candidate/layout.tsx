import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import DashboardNavbar from "@/components/dashboard-navbar";
import { MobileNavBar } from "@/components/candidate-dashboard/MobileNavBar";

export default async function CandidateDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="pb-16 sm:pb-0">
      <DashboardNavbar 
        locale={locale} 
        dict={dict} 
        userRole="candidate"
        userName="Mohammed Alaoui"
      />
      <div>{children}</div>
      <MobileNavBar locale={locale} />
    </div>
  );
}
