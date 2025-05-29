#!/bin/bash

REPO="Mesrar/tempotest2"
CSV_FILE="backlog.csv"

echo "🏷️  Creating labels first..."

# Create Epic labels
gh label create "Candidate Profile Management" --color "0052CC" --description "Features related to candidate profile management" --repo "$REPO" 2>/dev/null || echo "Label 'Candidate Profile Management' already exists"
gh label create "Job Search & Matching" --color "1D76DB" --description "Features related to job search and matching" --repo "$REPO" 2>/dev/null || echo "Label 'Job Search & Matching' already exists"
gh label create "Tool Rental for Candidates" --color "0E8A16" --description "Features related to tool rental for candidates" --repo "$REPO" 2>/dev/null || echo "Label 'Tool Rental for Candidates' already exists"
gh label create "Training & Upskilling" --color "FBCA04" --description "Features related to training and upskilling" --repo "$REPO" 2>/dev/null || echo "Label 'Training & Upskilling' already exists"
gh label create "Notifications & Communication" --color "F9D0C4" --description "Features related to notifications and communication" --repo "$REPO" 2>/dev/null || echo "Label 'Notifications & Communication' already exists"
gh label create "Financial Tools for Candidates" --color "006B75" --description "Features related to financial tools for candidates" --repo "$REPO" 2>/dev/null || echo "Label 'Financial Tools for Candidates' already exists"
gh label create "Mobile & Offline Support" --color "7057FF" --description "Features related to mobile and offline support" --repo "$REPO" 2>/dev/null || echo "Label 'Mobile & Offline Support' already exists"
gh label create "Company Profile & Multi-User Access" --color "D73A4A" --description "Features related to company profile and multi-user access" --repo "$REPO" 2>/dev/null || echo "Label 'Company Profile & Multi-User Access' already exists"
gh label create "Job Posting & Management" --color "B60205" --description "Features related to job posting and management" --repo "$REPO" 2>/dev/null || echo "Label 'Job Posting & Management' already exists"
gh label create "Tool Rental for Companies" --color "0E8A16" --description "Features related to tool rental for companies" --repo "$REPO" 2>/dev/null || echo "Label 'Tool Rental for Companies' already exists"
gh label create "Worker Management" --color "5319E7" --description "Features related to worker management" --repo "$REPO" 2>/dev/null || echo "Label 'Worker Management' already exists"
gh label create "Analytics & Reporting" --color "E4E669" --description "Features related to analytics and reporting" --repo "$REPO" 2>/dev/null || echo "Label 'Analytics & Reporting' already exists"
gh label create "Communication Tools" --color "FEF2C0" --description "Features related to communication tools" --repo "$REPO" 2>/dev/null || echo "Label 'Communication Tools' already exists"
gh label create "Integrations & Compliance" --color "BFD4F2" --description "Features related to integrations and compliance" --repo "$REPO" 2>/dev/null || echo "Label 'Integrations & Compliance' already exists"
gh label create "Shared Features" --color "C2E0C6" --description "Features that are shared across the platform" --repo "$REPO" 2>/dev/null || echo "Label 'Shared Features' already exists"

# Create Priority labels
gh label create "High" --color "D73A4A" --description "High priority" --repo "$REPO" 2>/dev/null || echo "Label 'High' already exists"
gh label create "Medium" --color "FBCA04" --description "Medium priority" --repo "$REPO" 2>/dev/null || echo "Label 'Medium' already exists"
gh label create "Low" --color "0E8A16" --description "Low priority" --repo "$REPO" 2>/dev/null || echo "Label 'Low' already exists"

echo "✅ Labels created!"
echo ""
echo "📝 Creating issues..."

# Use Python to properly parse CSV and create issues
python3 << 'EOF'
import csv
import subprocess
import sys

def create_issue(epic, issue_id, user_story, priority):
    title = user_story.strip()
    body = f"""**Epic:** {epic.strip()}  
**Issue ID:** {issue_id.strip()}  
**Priority:** {priority.strip()}

---

{title}"""

    # Create the issue using gh CLI
    cmd = [
        'gh', 'issue', 'create',
        '--repo', 'Mesrar/tempotest2',
        '--title', title,
        '--body', body,
        '--label', f"{epic.strip()},{priority.strip()}"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✓ Created: {title[:50]}...")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed: {title[:50]}...")
        print(f"  Error: {e.stderr}")
        return False

# Read and process CSV
try:
    with open('backlog.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        created = 0
        failed = 0
        
        for row in reader:
            epic = row['Epic']
            issue_id = row['Issue ID']
            user_story = row['User Story']
            priority = row['Priority']
            
            if create_issue(epic, issue_id, user_story, priority):
                created += 1
            else:
                failed += 1
        
        print(f"\n📊 Summary:")
        print(f"✓ Created: {created} issues")
        print(f"✗ Failed: {failed} issues")
        
except FileNotFoundError:
    print("Error: backlog.csv file not found!")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
EOF

echo "🎉 Done!"