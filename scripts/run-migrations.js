#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase - vous devrez fournir ces valeurs
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '❌');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(migrationFile) {
  try {
    console.log(`📄 Lecture de ${migrationFile}...`);
    const sqlContent = fs.readFileSync(migrationFile, 'utf8');
    
    console.log(`🚀 Exécution de la migration ${path.basename(migrationFile)}...`);
    
    // Diviser le SQL en instructions individuelles (simplification)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('sql', { query: statement + ';' });
        if (error) {
          console.error(`❌ Erreur lors de l'exécution:`, error);
          throw error;
        }
      }
    }
    
    console.log(`✅ Migration ${path.basename(migrationFile)} terminée avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de la migration ${migrationFile}:`, error);
    throw error;
  }
}

async function main() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  try {
    console.log('🔍 Recherche des migrations...');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('ℹ️ Aucune migration trouvée');
      return;
    }
    
    console.log(`📋 ${files.length} migration(s) trouvée(s):`);
    files.forEach(file => console.log(`  - ${file}`));
    
    for (const file of files) {
      await runMigration(path.join(migrationsDir, file));
    }
    
    console.log('🎉 Toutes les migrations ont été appliquées avec succès !');
    
  } catch (error) {
    console.error('💥 Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
