# 🚀 How to Upload ToS Analyzer to GitHub

Your project is ready to upload! Git is not currently installed. Follow these steps:

## ⚠️ IMPORTANT: Install Git First

1. **Download Git:**
   - Open https://git-scm.com/download/win
   - Click the download button (downloads Git-2.x.x-64-bit.exe)
   - Wait for download to complete

2. **Install Git:**
   - Find the downloaded `.exe` file in your Downloads folder
   - Double-click it
   - Click through all prompts with **NEXT** buttons
   - Accept all default options
   - Click **INSTALL**
   - Click **FINISH**

3. **Important - Restart Your Terminal:**
   - Close all PowerShell, Command Prompt, or Git Bash windows
   - **Open a NEW PowerShell** (Windows key → type "PowerShell" → Enter)
   - This step is critical - the old terminal won't have git in PATH

4. **Verify Git Works:**
   ```powershell
   git --version
   ```
   Should show: `git version 2.x.x.windows.1`

✅ **Only proceed to Step 2 once you see the git version above!**

---

## ⚡ Quick Option: Use Automated Script

**Instead of running all steps manually**, use the automated script:

1. Navigate to project folder: `C:\Users\AISHWARYA\OneDrive\Desktop\TOS_Analyser>`
2. Double-click `upload-to-github.bat`
3. Follow the prompts
4. Enter your GitHub Personal Access Token when prompted

The script handles:
- ✅ Git initialization
- ✅ Adding all files
- ✅ Creating commit
- ✅ Adding remote
- ✅ Pushing to GitHub

⏭️ **OR follow manual steps below:**

---

## Step 1A: Configure Git (After Installation)

## Step 1A: Configure Git (After Installation)

Open PowerShell and run:
```powershell
git config --global user.name "Your Name Here"
git config --global user.email "your.email@gmail.com"
```

Replace with your actual name and email.

---

## Step 2: Initialize Git Repository

Navigate to your project folder and run:
```powershell
cd C:\Users\AISHWARYA\OneDrive\Desktop\TOS_Analyser>
git init
```

## Step 3: Add All Files

```powershell
git add .
```

## Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit: ToS Red Flag Analyzer with Chrome Extension"
```

## Step 5: Add Remote Repository

```powershell
git remote add origin https://github.com/AISHWARYADEVI-M/ToS-Analyzer.git
```

## Step 6: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

If prompted for authentication:
- **Username**: AISHWARYADEVI-M
- **Password**: Use your GitHub Personal Access Token (not your password)
  - Create a PAT at: https://github.com/settings/tokens
  - Select `repo` scope
  - Copy and paste the token as the password

---

## 📦 What Gets Uploaded

Your GitHub repository will contain:

```
tos-analyzer/
├── README.md                                  # Main documentation
├── .gitignore                                 # Ignore rules
├── backend/
│   ├── main.py                               # FastAPI app with /analyze and /explain
│   ├── analyzer.py                           # NLP analysis logic
│   ├── requirements.txt                      # Python dependencies
│   ├── generate_icons.py                     # (Optional - icons generated)
│   └── myenv/                                # (Ignored - local venv)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                          # React main component
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── RiskBadge.jsx
│   │       ├── VerdictCard.jsx
│   │       ├── CategoryPills.jsx
│   │       └── HighlightedSentences.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── chrome-extension/
│   ├── manifest.json                        # Manifest V3 config
│   ├── content.js                           # Extension logic
│   ├── sidebar.css                          # Sidebar styling
│   ├── README.md
│   ├── SETUP.md
│   ├── EXTENSION_FEATURES.md
│   ├── generate_icons.py                    # Icon script
│   └── icons/
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
├── start-dev.bat                            # Windows startup script
├── start-dev.sh                             # macOS/Linux startup script
└── GITHUB_UPLOAD.md                         # This file
```

---

## ✅ Verify Upload

After pushing, verify everything is on GitHub:
1. Go to https://github.com/AISHWARYADEVI-M/ToS-Analyzer
2. Click "Code" and verify all files are there
3. Star 🌟 your own repo!

---

## 🔄 Future Updates

After initial upload, to push changes:

```powershell
cd C:\Users\AISHWARYA\OneDrive\Desktop\TOS_Analyser>
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 📝 Create a GitHub Release

To create a release version:

```powershell
git tag -a v1.0.0 -m "Initial Release - ToS Red Flag Analyzer"
git push origin v1.0.0
```

Then go to GitHub → Releases → Create release from tag

---

## 🆘 Troubleshooting

**"fatal: could not read Username"**
- You need a GitHub Personal Access Token
- https://github.com/settings/tokens → Generate new token
- Select `repo` scope
- Use this as your password (not your GitHub password)

**"remote already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/AISHWARYADEVI-M/ToS-Analyzer.git
```

**"failed to push some refs"**
- There might be conflicts
- Pull first: `git pull origin main`
- Then try pushing again

**Files not showing up**
- Check `.gitignore` - some files might be excluded
- Run `git add -f filename` to force add
- Commit and push again

---

## 📚 GitHub Repo Structure Tips

Once uploaded, consider adding to your README:

1. **Badges** (at top):
   ```markdown
   ![License](https://img.shields.io/badge/license-MIT-blue)
   ![Python](https://img.shields.io/badge/python-3.9%2B-blue)
   ![React](https://img.shields.io/badge/react-18-blue)
   ```

2. **Table of Contents** (in README.md):
   - Features
   - Installation
   - Quick Start
   - Architecture
   - API Endpoints
   - Chrome Extension Setup
   - License

3. **Screenshots** (in GitHub):
   - Add screenshots of the web app
   - Add screenshot of the Chrome extension sidebar

---

Happy uploading! 🚀
