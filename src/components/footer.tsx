"use client";

import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "./language-switcher";
import { useT } from "@/lib/translations";

export default function Footer() {
  const { locale } = useTranslation();
  const { t } = useT();
  const currentYear = new Date().getFullYear();

  // Helper function to prepend locale to URL
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Platform Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#features")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("common.features")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#pricing")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("common.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("/dashboard")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("common.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.careers")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.press")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.logisticsBlog")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.laborLawGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.staffingTips")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.compliance")}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t("footer.moroccanLaborLaws")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} LogiStaff Morocco. {t("footer.allRightsReserved")}
          </div>

          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-blue-600"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
