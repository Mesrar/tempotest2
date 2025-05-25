'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/context/supabase-provider'
import { useCurrentStaff } from '@/hooks/useCurrentStaff'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TestResults {
  connection: string | null
  auth: string | null
  data: string | null
}

export default function SupabaseTestComponent() {
  const supabase = useSupabase()
  const { profile, loading, error } = useCurrentStaff()
  const [testResults, setTestResults] = useState<TestResults>({
    connection: null,
    auth: null,
    data: null
  })

  useEffect(() => {
    async function runTests() {
      // Test 1: Connexion Supabase
      try {
        const { data, error } = await supabase.from('candidate_profiles').select('*').limit(1)
        setTestResults((prev: TestResults) => ({
          ...prev,
          connection: error ? `❌ Erreur: ${error.message}` : '✅ Connexion réussie'
        }))
      } catch (err) {
        setTestResults((prev: TestResults) => ({
          ...prev,
          connection: `❌ Erreur de connexion: ${err}`
        }))
      }

      // Test 2: État d'authentification
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setTestResults((prev: TestResults) => ({
          ...prev,
          auth: session ? '✅ Utilisateur connecté' : '⚠️ Pas d\'utilisateur connecté'
        }))
      } catch (err) {
        setTestResults((prev: TestResults) => ({
          ...prev,
          auth: `❌ Erreur d'auth: ${err}`
        }))
      }

      // Test 3: Hook useCurrentStaff
      setTestResults((prev: TestResults) => ({
        ...prev,
        data: loading ? '⏳ Chargement...' : error ? `❌ Erreur: ${error}` : profile ? '✅ Données récupérées' : '⚠️ Pas de données'
      }))
    }

    runTests()
  }, [supabase, profile, loading, error])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Chargement de l'intégration Supabase...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🧪 Test d'Intégration Supabase</h1>
      
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-semibold text-gray-700">Connexion à la base de données</h3>
          <p className="text-sm">{testResults.connection || '⏳ Test en cours...'}</p>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-semibold text-gray-700">État d'authentification</h3>
          <p className="text-sm">{testResults.auth || '⏳ Test en cours...'}</p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-semibold text-gray-700">Hook useCurrentStaff</h3>
          <p className="text-sm">{testResults.data || '⏳ Test en cours...'}</p>
        </div>

        {profile && (
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-700">Données du candidat</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-gray-700 mb-2">Instructions pour tester :</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Vérifiez que la connexion à Supabase fonctionne</li>
          <li>2. Connectez-vous avec un compte test si nécessaire</li>
          <li>3. Vérifiez que les données du candidat sont récupérées</li>
          <li>4. Visitez /fr/dashboard/candidate pour voir l'intégration complète</li>
        </ol>
        
        <div className="mt-4">
          <Button 
            onClick={() => window.location.href = '/fr/dashboard/candidate'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🚀 Aller au Dashboard Candidat
          </Button>
        </div>
      </div>
    </div>
  )
}
