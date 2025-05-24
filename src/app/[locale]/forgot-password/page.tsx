import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { Locale } from "@/lib/i18n";
import { forgotPasswordAction } from "@/app/actions";
import TranslatedForgotPassword from "@/components/translated-forgot-password";

interface ForgotPasswordProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Message>;
}

export default async function LocalizedForgotPasswordPage({
  params,
  searchParams
}: ForgotPasswordProps) {
  const { locale } = await params;
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar locale={locale} />
      <TranslatedForgotPassword locale={locale} forgotPasswordAction={forgotPasswordAction} />
    </>
  );
}
