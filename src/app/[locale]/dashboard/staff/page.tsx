import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { UserRole, requireStaffRole } from "@/utils/rbac";

interface StaffDashboardProps {
  params: { locale: Locale };
}

export default async function StaffDashboard({ params: { locale } }: StaffDashboardProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Vérifier que l'utilisateur a le rôle staff
  try {
    await requireStaffRole(locale);
  } catch {
    // Si l'utilisateur n'a pas le rôle staff, cette page redirigera automatiquement
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">Espace Personnel</h1>
            <p className="text-gray-600 mb-4">
              Bienvenue dans votre espace personnel LogiStaff. Consultez les missions disponibles et gérez votre profil.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-blue-800 mb-2">Note importante</h2>
              <p className="text-blue-600 text-sm">
                Cette page n'est accessible qu'aux utilisateurs ayant le rôle "Staff". 
                Si vous voyez cette page, c'est que vous avez les autorisations appropriées.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Missions disponibles pour vous</h2>
            
            {/* Ici, vous pouvez ajouter une liste des missions disponibles pour le staff */}
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Opérateur de chariot élévateur</h3>
                    <p className="text-sm text-gray-500 mt-1">Casablanca - 3 jours</p>
                    <div className="flex gap-1 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Transport
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Manutention
                      </span>
                    </div>
                  </div>
                  <a 
                    href={`/${locale}/dashboard/jobs/apply/1`} 
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                  >
                    Postuler
                  </a>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Préparateur de commandes</h3>
                    <p className="text-sm text-gray-500 mt-1">Tanger - 1 semaine</p>
                    <div className="flex gap-1 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Logistique
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Entrepôt
                      </span>
                    </div>
                  </div>
                  <a 
                    href={`/${locale}/dashboard/jobs/apply/2`} 
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                  >
                    Postuler
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <a 
                href={`/${locale}/dashboard/jobs/available`} 
                className="text-blue-600 font-medium hover:underline"
              >
                Voir toutes les missions disponibles →
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Complétez votre profil</h2>
            <p className="text-gray-600 mb-4">
              Plus votre profil est complet, plus vous avez de chances d'être sélectionné pour des missions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium mb-1">Compétences</h3>
                <p className="text-sm text-gray-500">Ajoutez vos compétences techniques</p>
                <a 
                  href={`/${locale}/dashboard/profile/skills`}
                  className="text-blue-600 text-sm font-medium hover:underline block mt-2"
                >
                  Modifier →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium mb-1">Expérience</h3>
                <p className="text-sm text-gray-500">Ajoutez votre expérience professionnelle</p>
                <a 
                  href={`/${locale}/dashboard/profile/experience`}
                  className="text-blue-600 text-sm font-medium hover:underline block mt-2"
                >
                  Modifier →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium mb-1">Disponibilité</h3>
                <p className="text-sm text-gray-500">Indiquez vos périodes de disponibilité</p>
                <a 
                  href={`/${locale}/dashboard/profile/availability`}
                  className="text-blue-600 text-sm font-medium hover:underline block mt-2"
                >
                  Modifier →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}