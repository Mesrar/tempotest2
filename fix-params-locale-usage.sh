#!/bin/bash

# Script pour corriger les problèmes d'utilisation de params.locale dans Next.js 15

# Fonction pour mettre à jour les fichiers
update_file() {
  local file=$1
  local temp_file="${file}.temp"
  
  # Vérifier si le fichier contient déjà "const { locale } = await params;"
  if grep -q "const { locale } = await params;" "$file"; then
    echo "Le fichier $file a déjà été corrigé, ignoré."
    return
  fi
  
  # Remplacer "params: { locale }," par "params," et ajouter "const { locale } = await params;"
  awk '
  BEGIN { modified = 0; }
  {
    if ($0 ~ /export default (async )?function [A-Za-z0-9_]+\({/) {
      print $0;
      in_function_def = 1;
    } 
    else if (in_function_def && $0 ~ /params: { locale },/) {
      gsub(/params: { locale },/, "params,");
      print $0;
      modified = 1;
    }
    else if (in_function_def && modified && $0 ~ /\) {/) {
      print $0;
      print "  const { locale } = await params;";
      in_function_def = 0;
      modified = 0;
    }
    else {
      print $0;
    }
  }
  ' "$file" > "$temp_file"
  
  # Vérifier si des modifications ont été effectuées
  if diff -q "$file" "$temp_file" > /dev/null; then
    echo "Aucune modification nécessaire pour $file"
    rm "$temp_file"
  else
    mv "$temp_file" "$file"
    echo "Fichier mis à jour: $file"
  fi
}

# Trouver tous les fichiers qui contiennent "params: { locale },"
find /workspaces/tempotest2/src/app -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "params: { locale }" | while read -r file; do
  echo "Traitement du fichier: $file"
  update_file "$file"
done

echo "Terminé: vérification et correction des fichiers."
