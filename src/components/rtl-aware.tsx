"use client";

import { ReactNode } from "react";
import { useTranslation } from "@/lib/i18n";

type RtlAwareProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  [key: string]: any; // Pour permettre toutes les props HTML
};

/**
 * Composant qui gère automatiquement les ajustements RTL
 * Utiliser ce composant pour envelopper du contenu sensible à la directionnalité
 */
export function RtlAware({ children, className = "", ...props }: RtlAwareProps) {
  const { locale } = useTranslation();
  const isRtl = locale === "ar";
  
  return (
    <div 
      className={`rtl-aware ${isRtl ? "rtl" : "ltr"} ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Composant pour les icônes qui doivent être inversées en mode RTL
 */
export function RtlIcon({ children, className = "", ...props }: RtlAwareProps) {
  const { locale } = useTranslation();
  const isRtl = locale === "ar";
  
  return (
    <span className={`inline-flex ${isRtl ? "rtl-mirror" : ""} ${className}`} {...props}>
      {children}
    </span>
  );
}

/**
 * Composant pour les boutons avec icônes sensibles à la directionnalité
 */
export function RtlButton({
  children,
  className = "",
  iconPosition = "right", // "left" | "right"
  ...props
}: RtlAwareProps & { iconPosition?: "left" | "right" }) {
  const { locale } = useTranslation();
  const isRtl = locale === "ar";
  
  // Inversion de la position de l'icône en mode RTL
  const effectiveIconPosition = isRtl 
    ? (iconPosition === "left" ? "right" : "left") 
    : iconPosition;
  
  return (
    <button 
      className={`flex items-center ${effectiveIconPosition === "right" ? "flex-row" : "flex-row-reverse"} ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Hook personnalisé pour obtenir des classes conditionnelles basées sur la direction
 */
export function useRtlClasses() {
  const { locale } = useTranslation();
  const isRtl = locale === "ar";
  
  function getFlexDirection(defaultDirection = "row") {
    if (defaultDirection === "row") {
      return isRtl ? "flex-row-reverse" : "flex-row";
    } else {
      return defaultDirection; // column reste column
    }
  }
  
  function getTextAlignment(defaultAlign = "left") {
    if (defaultAlign === "left") {
      return isRtl ? "text-right" : "text-left";
    } else if (defaultAlign === "right") {
      return isRtl ? "text-left" : "text-right";
    }
    return defaultAlign; // center reste center
  }
  
  function getMarginClass(size: number, direction: "left" | "right") {
    if (direction === "left") {
      return isRtl ? `mr-${size}` : `ml-${size}`;
    } else {
      return isRtl ? `ml-${size}` : `mr-${size}`;
    }
  }
  
  return { 
    isRtl, 
    getFlexDirection, 
    getTextAlignment, 
    getMarginClass,
    marginStart: (size: number) => isRtl ? `mr-${size}` : `ml-${size}`,
    marginEnd: (size: number) => isRtl ? `ml-${size}` : `mr-${size}`,
    paddingStart: (size: number) => isRtl ? `pr-${size}` : `pl-${size}`,
    paddingEnd: (size: number) => isRtl ? `pl-${size}` : `pr-${size}`,
    textAlign: isRtl ? "text-right" : "text-left",
    flexRowClass: isRtl ? "flex-row-reverse" : "flex-row",
  };
}
