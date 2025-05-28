import SimpleAuthTest from "@/components/simple-auth-test";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

interface SimpleAuthPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function SimpleAuthPage({ params }: SimpleAuthPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Test Authentification Simple</h1>
        <SimpleAuthTest />
      </div>
    </div>
  );
}
