"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Skill {
  id: string;
  name: string;
  category: string;
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    async function fetchSkills() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('name');

        if (error) throw error;
        
        setSkills(data);
        
        // Extraire les catégories uniques
        const uniqueCategories = Array.from(new Set(data.map((skill: Skill) => skill.category)));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  /**
   * Fonction pour suggérer des compétences basées sur une recherche
   */
  const suggestSkills = (search: string, limit: number = 5): Skill[] => {
    if (!search || search.length < 2) return [];
    
    const searchLower = search.toLowerCase();
    return skills
      .filter(skill => 
        skill.name.toLowerCase().includes(searchLower) ||
        skill.category.toLowerCase().includes(searchLower)
      )
      .slice(0, limit);
  };

  /**
   * Fonction pour obtenir les compétences par catégorie
   */
  const getSkillsByCategory = (category: string): Skill[] => {
    return skills.filter(skill => skill.category === category);
  };

  return {
    skills,
    categories,
    loading,
    error,
    suggestSkills,
    getSkillsByCategory
  };
}
