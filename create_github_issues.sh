#!/bin/bash

REPO="Mesrar/tempotest2"
CSV_FILE="backlog.csv"

# Skip header row, handle commas inside quotes
tail -n +2 "$CSV_FILE" | while IFS=, read -r EPIC ISSUE_ID USER_STORY PRIORITY _; do
  # Remove quotes and trim whitespace
  TITLE=$(echo "$USER_STORY" | sed 's/^"\(.*\)"$/\1/' | xargs)
  EPIC_LABEL=$(echo "$EPIC" | xargs)
  PRIORITY_LABEL=$(echo "$PRIORITY" | xargs)
  BODY="**Epic:** $EPIC  
**Issue ID:** $ISSUE_ID  
**Priority:** $PRIORITY"

  echo "Creating issue: $TITLE"
  gh issue create \
    --repo "$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --label "$EPIC_LABEL,$PRIORITY_LABEL"
done