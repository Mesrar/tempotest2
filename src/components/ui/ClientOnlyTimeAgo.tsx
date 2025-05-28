'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientOnlyTimeAgoProps {
  date: Date;
  fallback?: string;
}

export function ClientOnlyTimeAgo({ 
  date, 
  fallback = "..." 
}: ClientOnlyTimeAgoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{fallback}</span>;
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 60) {
    return <span>Il y a {diffInMinutes} minute{diffInMinutes > 1 ? 's' : ''}</span>;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return <span>Il y a {hours} heure{hours > 1 ? 's' : ''}</span>;
  } else {
    return <span>{format(date, "d MMMM", { locale: fr })}</span>;
  }
}
