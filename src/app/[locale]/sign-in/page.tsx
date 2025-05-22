import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { Locale } from "@/lib/i18n";
import TranslatedSignIn from "@/components/translated-sign-in";

interface LoginProps {
  params: { locale: Locale };
  searchParams: Promise<Message>;
}

export default async function LocalizedSignInPage({ 
  params: { locale }, 
  searchParams 
}: LoginProps) {
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
      <TranslatedSignIn locale={locale} signInAction={signInAction} />
    </>
  );
}
