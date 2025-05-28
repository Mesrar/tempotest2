'use client';

import { useState, useEffect } from 'react';
import { ClientOnlyDateFormat } from '@/components/ui/ClientOnlyDateFormat';

export function HydrationTest() {
  const [mounted, setMounted] = useState(false);
  const testDate = new Date('2025-05-27T10:00:00Z');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Test d'Hydratation - Formatage de Date</h3>
      <div className="space-y-2">
        <p>
          <strong>Rendu côté serveur :</strong> 
          {!mounted ? "..." : "Rendu côté client"}
        </p>
        <p>
          <strong>Date formatée :</strong> 
          <ClientOnlyDateFormat date={testDate} formatString="d MMM yyyy" />
        </p>
        <p>
          <strong>Date formatée complète :</strong> 
          <ClientOnlyDateFormat date={testDate} formatString="PPP" />
        </p>
        <p className="text-sm text-gray-600">
          Si cette section s'affiche sans erreur d'hydratation dans la console, 
          le problème a été résolu !
        </p>
      </div>
    </div>
  );
}
