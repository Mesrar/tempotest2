import AuthDebugComponent from "@/components/auth-debug";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

interface AuthDebugPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AuthDebugPage({ params }: AuthDebugPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Debug Authentification</h1>
        <AuthDebugComponent />
      </div>
    </div>
  );
}
