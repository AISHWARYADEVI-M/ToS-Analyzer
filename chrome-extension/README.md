# ToS Red Flag Analyzer - Chrome Extension

A Manifest V3 Chrome extension that automatically detects Terms of Service pages and shows an AI-powered risk analysis sidebar.

## Features

✅ **Auto-Detection** — Detects ToS pages by title, URL, and headings  
✅ **Instant Analysis** — Extracts text and analyzes within seconds  
✅ **Risk Scoring** — Shows overall risk (Low/Medium/High) with score  
✅ **Detailed Verdict** — Human-readable summary of ToS risks  
✅ **Risk Categories** — Displays which categories have issues  
✅ **Flagged Clauses** — Shows risky sentences with context  
✅ **Dark Theme** — Clean, non-intrusive sidebar  
✅ **No External Libraries** — Vanilla JS only, lightweight  

## Setup

### Prerequisites
1. Backend API running on `http://localhost:8000` (start with `start-dev.bat`)

### Installation

1. **Load the extension into Chrome**
   - Open: `chrome://extensions/`
   - Enable "Developer mode" (top-right corner)
   - Click "Load unpacked"
   - Select this `chrome-extension/` folder

2. **Grant permissions** when prompted

3. **Test it**
   - Visit any Terms of Service page (e.g., `instagram.com/legal/terms/`)
   - The sidebar should auto-detect and appear in 1-2 seconds

## File Structure

```
chrome-extension/
├── manifest.json         # Manifest V3 configuration
├── content.js            # Main content script (detection, analysis, UI)
├── sidebar.css           # Sidebar styles (fully scoped)
├── generate_icons.py     # Icon generation script
├── icons/
│   ├── icon-16.png       # Extension icon (16x16)
│   ├── icon-48.png       # Extension icon (48x48)
│   └── icon-128.png      # Extension icon (128x128)
└── README.md             # This file
```

## How It Works

### 1. Auto-Detection
The extension checks if a page is a ToS by looking for:
- Page title containing: "terms of service", "terms of use", "terms and conditions", "privacy policy"
- URL containing: `/terms`, `/tos`, `/legal`, `/privacy`
- H1/H2 headings containing those keywords

### 2. Text Extraction
- Extracts text from `document.body.innerText` (first 6000 characters)
- Automatically triggered on ToS pages

### 3. API Analysis
- POSTs text to `http://localhost:8000/analyze`
- Gets back risk score, verdict, categories, and flagged clauses

### 4. Sidebar Injection
- Injects a fixed sidebar (360px wide) on the right side
- Slides in from the right with smooth animation
- Shows loading → results or error states

### 5. Display Results
- **Risk Badge** — Overall score and color-coded risk level
- **Verdict** — Human-readable summary of main concerns
- **Categories** — Pills showing which risk categories were detected
- **Flagged Clauses** — Up to 10 risky sentences with details
- **Close Button** — Collapses sidebar with X button

## Sidebar UI States

### Loading
Shows a spinner and "Analyzing Terms of Service..." message

### Results
Displays:
- Risk badge (🔴 High / 🟡 Medium / 🟢 Low) with score/100
- Verdict (AI-generated summary)
- Risk categories found
- Flagged clauses (max 10)

### Error
Shows error message with "Retry" button if analysis fails

## CSS Scoping

All styles are scoped under `#tos-sidebar { }` to prevent CSS conflicts with the host website:
```css
#tos-sidebar { ... }
#tos-sidebar-header { ... }
#tos-sidebar-content { ... }
/* etc. */
```

This ensures the extension never breaks the layout or styling of ToS pages.

## Permissions

- `activeTab` — Access the current tab
- `scripting` — Run content scripts
- `storage` — Store user preferences (for future use)
- `host_permissions` — Access `http://localhost:8000/*` (backend API)

## Testing

### Test Pages
- https://www.instagram.com/legal/terms/
- https://www.amazon.com/gp/help/customer/display.html/ref=footer_tos
- https://www.google.com/policies/terms/
- https://www.github.com/site/terms
- Any page with "terms" in the URL or title

### Debugging
Open the browser console (F12) to see:
- `[ToS Analyzer] Terms of Service page detected` — Detection worked
- API errors and analysis progress

### Troubleshooting

**Sidebar doesn't appear:**
- Check if you're on a ToS page (see auto-detection rules above)
- Open console (F12) to verify detection message
- Ensure backend is running on `http://localhost:8000`

**"Could not analyze this page" error:**
- Backend not running? Start it with `start-dev.bat`
- CORS issues? Check backend has localhost:8000 allowed
- Page text extraction failed? Check the console for errors

**Sidebar breaks page layout:**
- Clear browser cache and reload
- Unload and reload the extension
- Check if other extensions are conflicting

## Customization

### Change Colors
Edit `sidebar.css` to change the risk colors:
```css
#tos-sidebar-badge.high-risk { border-color: #ef4444; } /* Red */
#tos-sidebar-badge.medium-risk { border-color: #eab308; } /* Yellow */
#tos-sidebar-badge.low-risk { border-color: #22c55e; } /* Green */
```

### Adjust Sidebar Width
In `sidebar.css`, change:
```css
width: 360px; /* Change to your preferred width */
```

### Change Auto-Detection Rules
Edit `content.js` to modify keywords and URL patterns:
```javascript
const TOS_KEYWORDS = [
  'terms of service',
  'terms of use',
  // Add more...
];

const TOS_URL_PATTERNS = ['/terms', '/tos', '/legal', '/privacy'];
```

### Change Backend URL
In `content.js`:
```javascript
const API_URL = 'http://your-backend-url:8000/analyze';
```

## Performance Notes

- **First analysis:** ~2-5 seconds (backend warming up)
- **Subsequent analyses:** ~1-2 seconds (model cached)
- **Text extraction:** Instant
- **Sidebar render:** <100ms

## Browser Support

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Security

- ✅ No data logging or analytics
- ✅ All analysis happens locally or on your backend
- ✅ No external CDN imports or third-party libraries
- ✅ HTML escaping prevents XSS attacks
- ✅ CSS scoping prevents style injection

## License

MIT

---

**Need help?** Check the backend logs and browser console for debugging info.
