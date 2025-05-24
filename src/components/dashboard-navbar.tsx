'use client'

import Link from 'next/link'
import { useSupabase } from '@/context/supabase-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { UserCircle, Home, BriefcaseIcon, Building2Icon, SettingsIcon, LogOutIcon, MenuIcon, Bell } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Locale } from '@/lib/i18n'
import LanguageSwitcher from './language-switcher'
import { cn } from '@/lib/utils'

interface DashboardNavbarProps {
  locale: Locale
  dict: any
  userRole?: 'candidate' | 'employer'
  userName?: string
  userAvatar?: string
}

export default function DashboardNavbar({ 
  locale, 
  dict, 
  userRole = 'candidate', 
  userName = "Utilisateur",
  userAvatar
}: DashboardNavbarProps) {
  const supabase = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()

  const navLinks = userRole === 'candidate' 
    ? [
        { href: `/${locale}/dashboard/candidate`, label: dict.dashboard.candidateDashboard, icon: <Home className="h-5 w-5" /> },
        { href: `/${locale}/dashboard/jobs`, label: dict.dashboard.jobOffers, icon: <BriefcaseIcon className="h-5 w-5" /> },
      ]
    : [
        { href: `/${locale}/dashboard`, label: dict.dashboard.dashboard, icon: <Home className="h-5 w-5" /> },
        { href: `/${locale}/dashboard/jobs`, label: dict.dashboard.jobs, icon: <BriefcaseIcon className="h-5 w-5" /> },
        { href: `/${locale}/dashboard/candidates`, label: dict.dashboard.candidates, icon: <Building2Icon className="h-5 w-5" /> },
      ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-background py-3">
      <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} prefetch className="text-xl font-bold">
            LogiStaff
          </Link>

          {/* Desktop navigation */}
          {!isMobile && (
            <div className="flex items-center ml-6 space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>

          <LanguageSwitcher />
          
          {/* Mobile menu button */}
          {isMobile && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar>
                        {userAvatar && <AvatarImage src={userAvatar} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {userRole === 'candidate' ? dict.dashboard.candidateAccount : dict.dashboard.employerAccount}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex flex-col gap-1 py-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-2 py-2 rounded-md text-sm",
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-auto border-t py-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive" 
                      onClick={handleSignOut}
                    >
                      <LogOutIcon className="h-5 w-5 mr-2" />
                      {dict.auth.signOut}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                <Avatar className="h-6 w-6">
                  {userAvatar && <AvatarImage src={userAvatar} />}
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/profile`}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  {dict.dashboard.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/settings`}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  {dict.dashboard.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                {dict.auth.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
