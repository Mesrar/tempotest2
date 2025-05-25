// Hook mock pour remplacer useCurrentStaff pendant les tests
import { useState, useEffect } from 'react';
import { mockData } from '@/components/candidate-dashboard/mockDataService';

export function useMockCurrentStaff() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Convertir les expériences du format DB vers le format UI
  const convertedExperiences = mockData.experiences.map(exp => ({
    id: exp.id,
    title: exp.title,
    company: exp.company,
    location: exp.location,
    startDate: exp.start_date,
    endDate: exp.end_date,
    isCurrent: exp.is_current,
    description: exp.description,
    technologies: exp.technologies || []
  }));

  return {
    user: mockData.currentUser,
    profile: mockData.candidateProfile,
    experiences: convertedExperiences,
    loading,
    error
  };
}
