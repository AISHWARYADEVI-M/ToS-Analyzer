# Chrome Extension Setup Guide

## 🎯 Quick Start

Your Chrome Extension for the ToS Analyzer is ready to use!

### Step 1: Ensure Backend is Running
```bash
cd backend
start-dev.bat
```
The backend should be running on `http://localhost:8000`

### Step 2: Load Extension into Chrome

1. Open Chrome
2. Navigate to **`chrome://extensions/`**
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `chrome-extension` folder from this project
6. The extension should appear with a blue icon ✓

### Step 3: Test on a ToS Page

Visit any Terms of Service page:
- https://www.instagram.com/legal/terms/
- https://www.github.com/site/terms
- https://www.google.com/policies/terms/

After 1-2 seconds, a **dark sidebar will slide in from the right side** showing:
- Risk score (0-100)
- Overall verdict
- Risk categories
- Flagged clauses

---

## 📁 Extension Files

```
chrome-extension/
├── manifest.json          ✓ Manifest V3 config
├── content.js             ✓ Auto-detection + Analysis logic
├── sidebar.css            ✓ Sidebar styles (fully scoped)
├── generate_icons.py      ✓ Icon generation script (already run)
├── icons/
│   ├── icon-16.png        ✓ Toolbar icon (16x16)
│   ├── icon-48.png        ✓ Toolbar icon (48x48)
│   └── icon-128.png       ✓ Toolbar icon (128x128)
├── README.md              ✓ Extension documentation
└── SETUP.md               ✓ This file
```

---

## 🔍 How It Works

### Auto-Detection
The extension detects ToS pages by checking:
- **Page title** contains: "terms of service", "terms of use", "terms and conditions", "privacy policy"
- **URL** contains: `/terms`, `/tos`, `/legal`, `/privacy`
- **Headings** (h1/h2) contain those keywords

### Analysis Flow
```
ToS Page Detected
    ↓
Extract Text (first 6000 chars)
    ↓
POST to http://localhost:8000/analyze
    ↓
Backend analyzes with AI model
    ↓
Sidebar renders results
```

### Sidebar Features
- 🔴 **Risk Badge** — Shows score and color-coded risk level
- 💬 **Verdict** — AI-generated summary of main concerns
- 🏷️ **Categories** — Which risk categories were found
- ⚠️ **Flagged Clauses** — Up to 10 risky sentences
- ✕ **Close Button** — Collapses sidebar with smooth animation

---

## ⚙️ Customization

### Change Sidebar Width
Edit `sidebar.css`:
```css
#tos-sidebar {
  width: 360px; /* Change this value */
}
```

### Change Auto-Detection Keywords
Edit `content.js`:
```javascript
const TOS_KEYWORDS = [
  'terms of service',
  'terms of use',
  'terms and conditions',
  'privacy policy'
  // Add more keywords here
];

const TOS_URL_PATTERNS = ['/terms', '/tos', '/legal', '/privacy'];
```

### Change Backend URL
Edit `content.js`:
```javascript
const API_URL = 'http://localhost:8000/analyze';
```

### Change Colors
Edit `sidebar.css`:
```css
#tos-sidebar-badge.high-risk { border-color: #ef4444; } /* High = Red */
#tos-sidebar-badge.medium-risk { border-color: #eab308; } /* Med = Yellow */
#tos-sidebar-badge.low-risk { border-color: #22c55e; } /* Low = Green */
```

---

## 🐛 Debugging

### Check if Extension is Working
1. Open DevTools (`F12`)
2. Go to **Console** tab
3. Visit a ToS page
4. Look for: `[ToS Analyzer] Terms of Service page detected`

### Check Extension Status
1. Go to `chrome://extensions/`
2. Find "ToS Red Flag Analyzer"
3. Check if it's enabled (toggle should be blue)
4. Look for any error messages

### Common Issues

**❌ Sidebar doesn't appear**
- Not on a ToS page? Check the auto-detection rules
- Check console (F12) for `[ToS Analyzer]` messages
- Backend running on localhost:8000? Start with `start-dev.bat`
- Clear extension: disable and enable again

**❌ "Could not analyze this page" error**
- Backend not running? Start it first
- Check `http://localhost:8000/health` in browser
- Large page? Extension only extracts first 6000 characters
- Console may show more details (F12 → Console)

**❌ Sidebar breaks page layout**
- Clear browser cache (Ctrl+Shift+Delete)
- Reload extension (chrome://extensions → reload)
- Try on a different ToS page
- Check browser console for CSS errors

**❌ Extension disappeared**
- Chrome auto-disabled it? Check chrome://extensions/
- Re-enable and reload page
- Try loading unpacked again

---

## 📊 Performance

| Operation | Time |
|---|---|
| ToS page detection | Instant |
| Text extraction | <100ms |
| API analysis | 2-5 sec (first), 1-2 sec (subsequent) |
| Sidebar render | <100ms |
| **Total time** | **~3-5 seconds** |

The backend caches the AI model, so subsequent analyses are much faster.

---

## 🔒 Security & Privacy

✅ **No data logging** — Analysis only sent to your local backend  
✅ **No external services** — Everything runs offline  
✅ **No CDN imports** — Pure vanilla JS  
✅ **CSS scoped** — Prevents style injection attacks  
✅ **HTML escaped** — Prevents XSS attacks  

---

## 🎨 Customization Examples

### Dark Mode (Already Applied)
The sidebar uses a dark theme with:
- Background: `#0f0f0f` (near-black)
- Text: `#f1f1f1` (near-white)
- Accents: Red/Yellow/Green for risk levels

### Adjust Auto-Detection Delay
In `content.js`:
```javascript
setTimeout(() => {
  injectSidebar();
}, 1500); // Change from 1500ms to your preferred delay
```

### Limit Displayed Clauses
In `content.js`:
```javascript
const clausesToShow = data.flagged_sentences.slice(0, 10); // Change 10 to any number
```

---

## 📱 Browser Support

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave (Chromium-based)
- ✅ Opera (Chromium-based)

---

## 📝 Notes for Users

- The extension **only runs on ToS pages** — it won't interfere with other websites
- **No data is collected or stored** — analysis is private
- **Backend must be running** — extension calls your local API
- **Fast on repeat analysis** — AI model is cached after first use

---

## 🚀 Next Steps

1. **Start the backend**: `start-dev.bat`
2. **Load the extension**: chrome://extensions/ → Load unpacked
3. **Test it**: Visit any ToS page
4. **Customize**: Edit CSS/JS to your preferences

---

## 📞 Support

Check these files for more help:
- [README.md](README.md) — Full extension documentation
- [manifest.json](manifest.json) — Manifest V3 config
- [content.js](content.js) — Source code with comments
- [sidebar.css](sidebar.css) — All CSS styling

Happy analyzing! 🎯
