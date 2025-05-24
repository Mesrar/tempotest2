import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import { CandidateReviews } from "@/components/candidate-dashboard/CandidateReviews";

export default async function TranslatedReviewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  // Mock reviews for demo purposes
  const mockReviews = [
    {
      id: "rev1",
      reviewer: {
        name: "Karim Bennani",
        company: "LogiTrans Maroc",
        position: "Responsable Logistique",
      },
      rating: 5,
      comment: "Mohammed est un excellent travailleur, très ponctuel et attentif aux détails. Il a géré notre équipe de manutentionnaires avec efficacité.",
      date: new Date(2023, 3, 15),
      missionName: "Gestion d'entrepôt - LogiMaroc"
    },
    {
      id: "rev2",
      reviewer: {
        name: "Fatima Zahra",
        company: "MedLogistics",
        position: "Directrice des Opérations",
      },
      rating: 4,
      comment: "Bon travail sur l'inventaire de fin de mois. A respecté les délais et a été précis dans son travail.",
      date: new Date(2023, 1, 22),
      missionName: "Inventaire - MedLogistics"
    },
    {
      id: "rev3",
      reviewer: {
        name: "Ahmed Tazi",
        company: "FastLog",
        position: "Superviseur d'Entrepôt",
      },
      rating: 5,
      comment: "Mohammed a montré une excellente aptitude à travailler sous pression. Il a coordonné l'équipe efficacement pendant la période de haute activité.",
      date: new Date(2022, 11, 10),
      missionName: "Gestion de distribution - FastLog"
    }
  ];

  const mockReferences = [
    {
      id: "ref1",
      name: "Hassan Alami",
      company: "TransLog Maroc",
      position: "Directeur Général",
      email: "h.alami@translog.ma",
      phone: "+212 661234567",
      message: "J'ai travaillé avec Mohammed pendant 2 ans. C'est un professionnel dévoué et compétent que je recommande sans hésitation."
    },
    {
      id: "ref2",
      name: "Laila Benziane",
      company: "GlobalLog",
      position: "Responsable RH",
      email: "l.benziane@globallog.ma",
      phone: "+212 662345678",
      message: "Mohammed est un employé exemplaire qui a fait preuve d'un grand professionnalisme lors de sa mission chez nous. Je le recommande pour tout poste en logistique."
    }
  ];

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Évaluations et Références</h1>
          <p className="text-muted-foreground">
            Consultez vos évaluations et références professionnelles
          </p>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto px-4">
        <CandidateReviews
          reviews={mockReviews}
          references={mockReferences}
        />
      </div>
    </main>
  );
}
