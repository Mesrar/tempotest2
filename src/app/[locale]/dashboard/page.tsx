import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import TranslatedDashboard from "@/components/translated-dashboard";
import { UserRole } from "@/utils/rbac";

export default async function Dashboard({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }
  
  // Récupérer le rôle de l'utilisateur depuis les métadonnées
  const userRole = user.user_metadata?.role as UserRole || 'company';

  // Initialisation des variables avec des valeurs par défaut
  let jobs: Array<any> = [];
  let activeJobsCount = 0;
  let applicantsCount = 0;
  
  console.log("User Role:", userRole);
  console.log("User ID:", user.id);
  console.log("User Metadata:", user.user_metadata);
  
  // Au lieu de vérifier l'existence des tables, nous allons simplement tenter
  // d'exécuter les requêtes et gérer les erreurs qui pourraient survenir

  // Charger les données appropriées en fonction du rôle de l'utilisateur
  if (userRole === 'company') {
    try {
      // Pour les entreprises: offres d'emploi publiées et candidatures reçues
      const { data: companyJobs, error } = await supabase
        .from("job_postings")
        .select("id, title, status, created_at, required_skills")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
  
      // Log pour débogage
      console.log("Company Jobs Query:", { companyJobs, error, userId: user.id });

      if (error) {
        console.error("Error fetching company jobs:", error);
      } else {          // Récupérer le nombre de jobs actifs (uniquement si la première requête a réussi)
        const { count: activeCount, error: activeError } = await supabase
          .from("job_postings")
          .select("*", { count: "exact", head: true })
          .eq("company_id", user.id)
          .eq("status", "active");
        
        // Si aucun résultat avec le filtre status=active, essayer sans ce filtre
        if (activeCount === 0 || activeError) {
          console.log("No active jobs found with status='active', trying without status filter");
          
          const { count: totalCount } = await supabase
            .from("job_postings")
            .select("*", { count: "exact", head: true })
            .eq("company_id", user.id);
            
          console.log("Total jobs count without status filter:", totalCount);
          
          if (totalCount && totalCount > 0) {
            activeJobsCount = totalCount;
          }
        } else {
          activeJobsCount = activeCount || 0;
        }
        
        // Transformation des données
        if (companyJobs) {
          jobs = companyJobs.map(job => ({
            ...job,
            skills: job.required_skills // Adapter au champ attendu dans l'interface
          }));
        }
        
        // Log pour débogage
        console.log("Company Jobs Data:", { jobs, activeJobsCount });
      
        // Essayer de récupérer les candidatures
        try {
          // D'abord récupérer les IDs des offres d'emploi de l'entreprise
          const { data: jobIds } = await supabase
            .from("job_postings")
            .select("id")
            .eq("company_id", user.id);
          
          // Ensuite compter les candidatures pour ces offres
          if (jobIds && jobIds.length > 0) {
            const jobIdArray = jobIds.map(job => job.id);
            
            const { count, error } = await supabase
              .from("job_candidates")
              .select("*", { count: "exact", head: true })
              .in("job_id", jobIdArray);
            
            applicantsCount = count || 0;
            
            // Log pour débogage
            console.log("Company Applicants Count:", { 
              applicantsCount, 
              error
            });
          }
        } catch (candidatesError) {
          console.error("Error fetching candidates:", candidatesError);
        }
      }
    } catch (error) {
      console.error("Error in company dashboard data loading:", error);
    }

    // Note: Cette section est maintenant traitée dans le bloc conditionnel jobPostingsExist
  } else {
    try {
      // Pour le personnel: offres d'emploi disponibles auxquelles postuler
      const { data: staffJobs, error } = await supabase
        .from("job_postings")
        .select("id, title, status, created_at, required_skills")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);
        
      // Log pour débogage
      console.log("Staff Jobs Query:", { staffJobs, error });
      
      if (error) {
        console.error("Error fetching staff jobs:", error);
      } else {
        // Récupérer le nombre d'offres actives disponibles
        const { count: availableCount, error: availableError } = await supabase
          .from("job_postings")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");
        
        // Si aucun résultat avec le filtre status=active, essayer sans ce filtre
        if (availableCount === 0 || availableError) {
          console.log("No active jobs found with status='active', trying without status filter for staff");
          
          const { count: totalCount } = await supabase
            .from("job_postings")
            .select("*", { count: "exact", head: true });
            
          console.log("Total jobs count without status filter for staff:", totalCount);
          
          if (totalCount && totalCount > 0) {
            activeJobsCount = totalCount;
          }
        } else {
          activeJobsCount = availableCount || 0;
        }
        
        // Transformation des données pour les adapter à l'interface Job
        if (staffJobs) {
          jobs = staffJobs.map(job => ({
            ...job,
            skills: job.required_skills // Adapter au champ attendu dans l'interface
          }));
        }
        
        // Log pour débogage
        console.log("Staff Jobs Data:", { jobs, activeJobsCount });
        
        // Essayer de récupérer les candidatures
        try {
          // Récupérer le nombre de candidatures que l'utilisateur a effectuées
          const { count: appliedCount, error: appliedError } = await supabase
            .from("job_candidates")
            .select("*", { count: "exact", head: true })
            .eq("candidate_id", user.id);
          
          applicantsCount = appliedCount || 0;
          
          // Log pour débogage
          console.log("Staff Applications Count:", { 
            applicantsCount, 
            appliedError
          });
        } catch (candidatesError) {
          console.error("Error fetching staff applications:", candidatesError);
        }
      }
    } catch (error) {
      console.error("Error in staff dashboard data loading:", error);
    }
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <TranslatedDashboard 
        locale={locale}
        activeJobsCount={activeJobsCount}
        applicantsCount={applicantsCount}
        jobs={jobs}
        userRole={userRole}
        userId={user.id}
      />
    </SubscriptionCheck>
  );
}
