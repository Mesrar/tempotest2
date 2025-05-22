import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { UserRole } from "@/utils/rbac";

interface ProfilePageProps {
  params: { locale: Locale };
}

export default async function ProfilePage({ params: { locale } }: ProfilePageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Récupérer le rôle de l'utilisateur depuis les métadonnées
  const userRole = user.user_metadata?.role as UserRole || 'company';

  // Récupérer les informations supplémentaires de l'utilisateur
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profil Utilisateur</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                <span className="text-xl font-bold">
                  {userData?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </span>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">{userData?.name || "Utilisateur"}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userRole === 'staff' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {userRole === 'staff' ? 'Personnel' : 'Entreprise/Client'}
                  </span>
                </div>
              </div>
            </div>
            
            <hr className="my-4" />
            
            {userRole === 'staff' ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Informations de Profil Personnel</h3>
                <p className="text-gray-500">
                  Complétez votre profil pour augmenter vos chances de trouver des missions adaptées à vos compétences.
                </p>
                
                {/* Ici, vous pouvez ajouter un formulaire pour éditer le profil personnel */}
                <div className="mt-4">
                  <a 
                    href={`/${locale}/dashboard/profile/edit`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Compléter mon profil
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Informations de l'Entreprise</h3>
                <p className="text-gray-500">
                  Complétez les informations de votre entreprise pour faciliter le processus de publication d'offres d'emploi.
                </p>
                
                {/* Ici, vous pouvez ajouter un formulaire pour éditer le profil de l'entreprise */}
                <div className="mt-4">
                  <a 
                    href={`/${locale}/dashboard/company/edit`} 
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Compléter le profil de l'entreprise
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Section spécifique au rôle */}
          {userRole === 'staff' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-lg mb-4">Expérience et Compétences</h3>
              <p className="text-gray-500 mb-4">
                Ajoutez votre expérience professionnelle et vos compétences pour améliorer votre visibilité auprès des employeurs.
              </p>
              
              {/* Ici, vous pouvez ajouter des sections pour les compétences et l'expérience */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={`/${locale}/dashboard/profile/skills`} className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50">
                  <h4 className="font-medium">Compétences</h4>
                  <p className="text-sm text-gray-500">Gérer vos compétences logistiques</p>
                </a>
                <a href={`/${locale}/dashboard/profile/experience`} className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50">
                  <h4 className="font-medium">Expérience</h4>
                  <p className="text-sm text-gray-500">Ajouter votre expérience professionnelle</p>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-lg mb-4">Paramètres de l'Entreprise</h3>
              <p className="text-gray-500 mb-4">
                Gérez les paramètres de votre entreprise et les préférences de recrutement.
              </p>
              
              {/* Ici, vous pouvez ajouter des sections pour les paramètres de l'entreprise */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={`/${locale}/dashboard/company/settings`} className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50">
                  <h4 className="font-medium">Paramètres</h4>
                  <p className="text-sm text-gray-500">Gérer les paramètres de l'entreprise</p>
                </a>
                <a href={`/${locale}/dashboard/billing`} className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50">
                  <h4 className="font-medium">Facturation</h4>
                  <p className="text-sm text-gray-500">Gérer les abonnements et factures</p>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </SubscriptionCheck>
  );
}
