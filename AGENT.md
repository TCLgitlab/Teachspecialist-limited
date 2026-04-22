# CV Parser Agent

An automated agent that parses CVs and scores applicants against job requirements. Runs every 30 minutes via GitHub Actions.

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Every 30 minutes:                                    │
│                                                         │
│  1. Finds unparsed applications in Firebase         │
│  2. Sends CV URLs to Affinda API                     │
│  3. Parses CV data (skills, experience, education)   │
│  4. Calculates score (0-100)                        │
│  5. Writes results back to Firebase                  │
│  6. HR Dashboard shows scores + suggestions          │
└─────────────────────────────────────────────────────────┘
```

## Features

| Feature | Description |
|---------|-------------|
| Auto-detect | Finds all unparsed applications |
| CV Parsing | Extracts skills, experience, education |
| Skill Matching | Matches against job requirements |
| Scoring | 0-100 based on multiple factors |
| Suggestions | Strong Match / Review / Pass |
| Error Handling | Marks failed parses for manual review |

## Scoring Logic

| Category | Max Points | How It Works |
|----------|-----------|-------------|
| Required Skills | 30 | 10 pts per matching skill |
| Bonus Skills | 10 | 5 pts per bonus skill |
| Experience | 30 | 10 pts per year (max 3) |
| Education | 20 | Full match = 20 pts |
| Location | 10 | Match = 10 pts |
| **TOTAL** | **100** | |

### Suggestions

| Score | Suggestion |
|-------|-----------|
| 80-100 | Strong Match ✅ |
| 60-79 | Review 📋 |
| Below 60 | Pass ❌ |

## Setup Instructions

### Step 1: Get Affinda API Key

1. Go to: https://www.affinda.com
2. Log in and go to **Settings** → **API Keys**
3. Copy your API key

### Step 2: Add API Key to GitHub Secrets

1. Go to your GitHub repository: https://github.com/Tofee/AI/settings/secrets
2. Click **New repository secret**
3. Name: `AFFINDA_API_KEY`
4. Value: Your Affinda API key
5. Click **Add secret**

### Step 3: Verify GitHub Actions is Enabled

1. Go to: https://github.com/Tofee/AI/actions
2. The workflow should be listed and enabled
3. The schedule will run automatically every 30 minutes

### Step 4: Add Job Requirements (Optional)

The agent will use default requirements if not set. To customize:

1. Go to Firebase Console: https://console.firebase.google.com/project/techspecialist-careers/firestore
2. Create collection: `jobs`
3. Add document for each job title:

```json
{
  "title": "Software Engineer",
  "requirements": {
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "bonusSkills": ["Python", "AWS", "Docker"],
    "minExperience": 2,
    "requiredEducation": "Computer Science",
    "locationPreference": "Nigeria"
  }
}
```

## Manual Run

### Option 1: Run locally

```bash
AFFINDA_API_KEY=your_key node agent.js
```

### Option 2: Trigger via GitHub

1. Go to: https://github.com/Tofee/AI/actions
2. Click on **CV Parser Agent**
3. Click **Run workflow**
4. Click **Run workflow** again

## Output

After each run, the following fields are added to each application in Firebase:

```json
{
  "parsed": true,
  "parsedAt": "2024-01-15T10:30:00Z",
  "agentScore": 85,
  "agentSuggestion": "Strong Match",
  "agentSuggestionIcon": "✅",
  "matchedSkills": ["React", "JavaScript"],
  "bonusSkills": ["Node.js"],
  "experienceYears": 5,
  "parsedData": {
    "skills": ["React", "JavaScript", "Node.js"],
    "experience": [...],
    "education": [...],
    "summary": "..."
  }
}
```

## View Results

1. Go to HR Dashboard: https://techspecialist-careers.web.app/admin/applications
2. Expand any application
3. See **AI Agent Analysis** panel with score, skills matched, and suggestion

## Troubleshooting

### Agent not running?

1. Check GitHub Actions: https://github.com/Tofee/AI/actions
2. Check for any failed workflow runs
3. Check the logs for errors

### CV parsing failing?

1. Check the error message in Firebase document
2. Verify Affinda API key is correct
3. Verify CV URL is publicly accessible
4. Check Affinda free tier limit (50 CVs/month)

### Score showing 0?

1. Add job requirements to Firestore
2. Or check that CV was successfully parsed

## Cost

| Service | Free Tier | Cost |
|---------|----------|------|
| GitHub Actions | 2,000 min/month | Free |
| Affinda | 50 CVs/month | Free |
| Firebase reads | 50K/day | Free |

For ~50 applications/month: **Free**

## Support

For issues or questions, check:
- GitHub Actions logs
- Firebase documents
- Affinda dashboard