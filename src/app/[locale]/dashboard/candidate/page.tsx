import CandidateDashboard from "@/components/candidate-dashboard/CandidateDashboard";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

export default async function CandidateDashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Assurez-vous que toute la fonction est asynchrone
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{(dict.dashboard as any)?.candidateDashboard || "Tableau de bord"}</h1>
          <p className="text-muted-foreground">Gérez votre profil et vos opportunités de missions</p>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto">
        <CandidateDashboard />
      </div>
    </main>
  );
}
