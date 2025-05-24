import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Configuration Supabase avec la clé service pour les opérations admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Protection basique (remplacez par votre propre logique d'authentification)
    if (password !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Début de l\'exécution des migrations...');
    
    // Lire les fichiers de migration
    const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const results = [];

    for (const file of migrationFiles) {
      try {
        console.log(`📄 Traitement de ${file}...`);
        const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        // Exécuter le SQL via la fonction de service Supabase
        const { data, error } = await supabaseAdmin
          .from('_migrations')
          .select('*')
          .eq('name', file)
          .single();

        if (data) {
          console.log(`⏭️ Migration ${file} déjà appliquée, ignorée`);
          results.push({ file, status: 'already_applied' });
          continue;
        }

        // Exécuter le SQL directement
        const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', {
          sql: sqlContent
        });

        if (sqlError) {
          console.error(`❌ Erreur SQL pour ${file}:`, sqlError);
          results.push({ file, status: 'error', error: sqlError.message });
          continue;
        }

        // Marquer comme appliquée
        await supabaseAdmin
          .from('_migrations')
          .insert({ name: file, applied_at: new Date().toISOString() });

        console.log(`✅ Migration ${file} appliquée avec succès`);
        results.push({ file, status: 'success' });

      } catch (error) {
        console.error(`💥 Erreur lors de ${file}:`, error);
        results.push({ file, status: 'error', error: (error as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migrations terminées',
      results
    });

  } catch (error) {
    console.error('💥 Erreur générale:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'exécution des migrations',
      details: (error as Error).message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Migration API endpoint. Use POST with password parameter.',
    example: '/api/admin/migrate?password=admin123'
  });
}
