"use client";

import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "./language-switcher";

export default function Footer() {
  const { locale } = useTranslation();
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
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#features")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#pricing")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("/dashboard")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("/for-employers")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  For Employers
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("/for-workers")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  For Workers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Logistics Blog
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Labor Law Guide
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Staffing Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Compliance
                </Link>
              </li>
              <li>
                <Link
                  href={localePath("#")}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Moroccan Labor Laws
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} LogiStaff Morocco. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
