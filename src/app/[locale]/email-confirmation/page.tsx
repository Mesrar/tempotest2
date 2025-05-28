import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmailConfirmationPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmailConfirmationPage({
  params,
  searchParams,
}: EmailConfirmationPageProps) {
  const { locale } = await params;
  const { email } = await searchParams;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard
  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  const userEmail = email as string || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icône de succès */}
        <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {locale === 'fr' ? 'Vérifiez votre email' : 
           locale === 'ar' ? 'تحقق من بريدك الإلكتروني' : 
           'Check your email'}
        </h1>

        {/* Message principal */}
        <div className="mb-6 text-gray-600">
          <Mail className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <p className="mb-4">
            {locale === 'fr' ? 
              'Nous avons envoyé un lien de vérification à :' : 
              locale === 'ar' ? 
              'لقد أرسلنا رابط التحقق إلى:' :
              'We\'ve sent a verification link to:'}
          </p>
          {userEmail && (
            <p className="font-semibold text-gray-900 mb-4 break-all">
              {userEmail}
            </p>
          )}
          <p className="text-sm">
            {locale === 'fr' ? 
              'Cliquez sur le lien dans l\'email pour activer votre compte.' : 
              locale === 'ar' ? 
              'انقر على الرابط في البريد الإلكتروني لتفعيل حسابك.' :
              'Click the link in the email to activate your account.'}
          </p>
        </div>

        {/* Instructions supplémentaires */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            {locale === 'fr' ? 
              'Si vous ne voyez pas l\'email, vérifiez votre dossier spam ou courrier indésirable.' : 
              locale === 'ar' ? 
              'إذا لم تجد البريد الإلكتروني، تحقق من مجلد الرسائل غير المرغوب فيها.' :
              'If you don\'t see the email, check your spam or junk folder.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Bouton de retour à la connexion */}
          <Link
            href={`/${locale}/sign-in`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === 'fr' ? 'Retour à la connexion' : 
             locale === 'ar' ? 'العودة إلى تسجيل الدخول' : 
             'Back to sign in'}
          </Link>

          {/* Lien pour renvoyer l'email */}
          <Link
            href={`/${locale}/sign-up`}
            className="inline-block w-full px-4 py-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            {locale === 'fr' ? 'Renvoyer l\'email de vérification' : 
             locale === 'ar' ? 'إعادة إرسال بريد التحقق الإلكتروني' : 
             'Resend verification email'}
          </Link>
        </div>

        {/* Note sur l'expiration */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {locale === 'fr' ? 
              'Le lien de vérification expire dans 24 heures.' : 
              locale === 'ar' ? 
              'ينتهي صلاحية رابط التحقق خلال 24 ساعة.' :
              'The verification link expires in 24 hours.'}
          </p>
        </div>
      </div>
    </div>
  );
}
