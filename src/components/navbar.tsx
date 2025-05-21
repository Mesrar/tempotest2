import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { TruckIcon } from "lucide-react";
import UserProfile from "./user-profile";
import LanguageSwitcher from "./language-switcher";
import { Locale } from "@/lib/i18n";

export default async function Navbar({ locale = "en" }: { locale?: Locale }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Helper function to prepend locale to URL
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href={localePath("/")}
          prefetch
          className="text-xl font-bold flex items-center"
        >
          <TruckIcon className="h-6 w-6 mr-2 text-blue-600" />
          <span>LogiStaff</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href={localePath("/#features")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Features
          </Link>
          <Link
            href={localePath("/#pricing")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Pricing
          </Link>
          <Link
            href={localePath("/for-employers")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            For Employers
          </Link>
          <Link
            href={localePath("/for-workers")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            For Workers
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />

          {user ? (
            <>
              <Link
                href={localePath("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href={localePath("/sign-in")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href={localePath("/sign-up")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
