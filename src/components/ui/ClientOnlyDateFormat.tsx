'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientOnlyDateFormatProps {
  date: Date;
  formatString?: string;
  fallback?: string;
}

export function ClientOnlyDateFormat({ 
  date, 
  formatString = "d MMM yyyy", 
  fallback = "..." 
}: ClientOnlyDateFormatProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{fallback}</span>;
  }

  return <span>{format(date, formatString, { locale: fr })}</span>;
}
