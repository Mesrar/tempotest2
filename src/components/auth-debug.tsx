"use client";

import { useSupabase } from "@/context/supabase-provider";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function AuthDebugComponent() {
  const supabase = useSupabase();
  const { user, profile, loading, error } = useCurrentStaff();
  const [authState, setAuthState] = useState<string>("checking...");

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthState(`Error: ${error.message}`);
        } else if (session?.user) {
          setAuthState(`Authenticated: ${session.user.email}`);
        } else {
          setAuthState("Not authenticated");
        }
      } catch (err) {
        setAuthState(`Exception: ${err}`);
      }
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth debug - Event:', event, 'Session:', session?.user?.email);
      if (session?.user) {
        setAuthState(`Authenticated: ${session.user.email}`);
      } else {
        setAuthState("Not authenticated");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInTestUser = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      if (error) {
        console.error('Sign in error:', error);
      }
    } catch (err) {
      console.error('Sign in exception:', err);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (err) {
      console.error('Sign out exception:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Authentification Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>État Auth Session:</strong> {authState}
          </div>
          
          <div>
            <strong>useCurrentStaff - Loading:</strong> {loading ? "Oui" : "Non"}
          </div>
          
          <div>
            <strong>useCurrentStaff - User:</strong> {user ? `${user.email} (${user.id})` : "Aucun"}
          </div>
          
          <div>
            <strong>useCurrentStaff - Profile:</strong> {profile ? `${profile.full_name} (${profile.id})` : "Aucun"}
          </div>
          
          {error && (
            <div className="text-red-600">
              <strong>Erreur:</strong> {error.message}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={signInTestUser} variant="outline">
              Se connecter (test)
            </Button>
            <Button onClick={signOut} variant="outline">
              Se déconnecter
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Ce composant aide à débugger les problèmes d'authentification Supabase.</p>
            <p>Variables d'env: URL = {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "❌"}, KEY = {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "❌"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
