import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1] || "fr";

  return {
    title: locale === "fr" 
      ? "Évaluations et Références | LogiStaff" 
      : locale === "ar" 
        ? "التقييمات والمراجع | LogiStaff" 
        : "Reviews and References | LogiStaff",
    description: locale === "fr"
      ? "Consultez vos évaluations et références professionnelles sur la plateforme LogiStaff."
      : locale === "ar"
        ? "اطلع على تقييماتك والمراجع المهنية على منصة LogiStaff."
        : "View your reviews and professional references on the LogiStaff platform."
  };
}

export default function Metadata() {
  return null;
}
