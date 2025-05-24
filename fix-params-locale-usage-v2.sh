#!/bin/bash

# Script pour corriger les problèmes d'utilisation de params.locale dans Next.js 15

# Rechercher tous les fichiers qui contiennent "params: { locale }"
FILES=$(grep -l "params: { locale }" $(find /workspaces/tempotest2/src/app -name "*.tsx" -o -name "*.ts"))

for file in $FILES; do
  echo "Traitement du fichier: $file"
  
  # Vérifier si le fichier est déjà corrigé
  if grep -q "const { locale } = await params;" "$file"; then
    echo "  Déjà corrigé, ignoré."
    continue
  fi
  
  # Appliquer les corrections
  sed -i 's/params: { locale },/params,/g' "$file"
  
  # Ajouter la ligne qui attend les params après la définition de la fonction
  if grep -q "export default async function" "$file"; then
    # Trouver l'accolade ouvrante après la définition de la fonction
    line_number=$(grep -n -A 3 "export default async function" "$file" | grep -m 1 "{$" | cut -d'-' -f1)
    
    if [ -n "$line_number" ]; then
      next_line=$((line_number + 1))
      sed -i "${next_line}i\\  const { locale } = await params;" "$file"
      echo "  Corrigé avec succès."
    else
      echo "  Impossible de trouver l'endroit pour insérer la ligne, vérification manuelle requise."
    fi
  elif grep -q "async function" "$file"; then
    # Pour les fonctions async qui ne sont pas export default
    line_number=$(grep -n -A 3 "async function" "$file" | grep -m 1 "{$" | cut -d'-' -f1)
    
    if [ -n "$line_number" ]; then
      next_line=$((line_number + 1))
      sed -i "${next_line}i\\  const { locale } = await params;" "$file"
      echo "  Corrigé avec succès."
    else
      echo "  Impossible de trouver l'endroit pour insérer la ligne, vérification manuelle requise."
    fi
  else
    echo "  Structure non reconnue, vérification manuelle requise."
  fi
done

echo "Terminé. Vérifiez manuellement les fichiers si nécessaire."
