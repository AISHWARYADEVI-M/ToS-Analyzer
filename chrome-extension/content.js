/**
 * ToS Guard - Content Script
 * Detects Terms of Service pages and shows AI-powered privacy analysis in a sidebar
 */

const TOS_KEYWORDS = [
  'terms of service',
  'terms of use',
  'terms and conditions',
  'privacy policy'
];

const TOS_URL_PATTERNS = ['/terms', '/tos', '/legal', '/privacy'];

const API_URL = 'http://localhost:8000/analyze';
const EXPLAIN_URL = 'http://localhost:8000/explain';

let sidebarState = {
  isOpen: false,
  isAnalyzing: false,
  data: null
};

/**
 * Check if current page is a Terms of Service page
 */
function isToSPage() {
  // Check page title
  const title = document.title.toLowerCase();
  if (TOS_KEYWORDS.some(kw => title.includes(kw))) {
    return true;
  }

  // Check URL
  const url = window.location.href.toLowerCase();
  if (TOS_URL_PATTERNS.some(pattern => url.includes(pattern))) {
    return true;
  }

  // Check h1 and h2 tags
  const headings = document.querySelectorAll('h1, h2');
  for (const heading of headings) {
    const text = heading.textContent.toLowerCase();
    if (TOS_KEYWORDS.some(kw => text.includes(kw))) {
      return true;
    }
  }

  return false;
}

/**
 * Extract text from page
 */
function extractPageText() {
  return document.body.innerText.slice(0, 6000);
}

/**
 * Analyze ToS text using the backend API
 */
async function analyzeToS(text) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('ToS Analysis error:', error);
    throw error;
  }
}

/**
 * Get plain English explanation for a clause
 */
async function explainClause(sentence, category) {
  try {
    const response = await fetch(EXPLAIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sentence, category })
    });

    if (!response.ok) {
      throw new Error(`Explain error: ${response.status}`);
    }

    const data = await response.json();
    return data.explanation || 'Unable to explain this clause.';
  } catch (error) {
    console.error('Clause explanation error:', error);
    return 'Unable to explain this clause.';
  }
}

/**
 * Create and inject sidebar into the page
 */
function injectSidebar() {
  // Check if sidebar already exists
  if (document.getElementById('tos-sidebar')) {
    return;
  }

  const sidebar = document.createElement('div');
  sidebar.id = 'tos-sidebar';

  // Header with new design
  const header = document.createElement('div');
  header.id = 'tos-sidebar-header';
  header.innerHTML = `
    <div id="tos-sidebar-branding">
      <div id="tos-sidebar-logo">🛡️</div>
      <div id="tos-sidebar-title-group">
        <h2 id="tos-sidebar-title">ToS Guard</h2>
        <p id="tos-sidebar-subtitle">AI Privacy Scanner</p>
      </div>
    </div>
    <button id="tos-sidebar-close">✕</button>
  `;

  // Content area
  const content = document.createElement('div');
  content.id = 'tos-sidebar-content';

  // Loading state
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'tos-sidebar-loading';
  loadingDiv.innerHTML = `
    <div class="tos-spinner"></div>
    <div id="tos-sidebar-loading-text">Scanning Terms of Service...</div>
  `;
  content.appendChild(loadingDiv);

  sidebar.appendChild(header);
  sidebar.appendChild(content);

  // Add to page
  document.body.appendChild(sidebar);

  // Allow browser to render sidebar
  setTimeout(() => {
    sidebar.classList.add('open');
  }, 10);

  // Setup close button
  document.getElementById('tos-sidebar-close').addEventListener('click', closeSidebar);

  // Start analysis
  analyzePageToS(content);
}

/**
 * Analyze the current page's ToS
 */
async function analyzePageToS(contentDiv) {
  try {
    sidebarState.isAnalyzing = true;

    const text = extractPageText();
    if (!text.trim()) {
      throw new Error('Could not extract text from this page.');
    }

    const result = await analyzeToS(text);
    sidebarState.data = result;

    // Get explanations for all clauses in parallel
    if (result.flagged_sentences && result.flagged_sentences.length > 0) {
      const clausesToExplain = result.flagged_sentences.slice(0, 10);
      const explanationPromises = clausesToExplain.map(clause =>
        explainClause(clause.sentence, clause.category)
      );

      try {
        const explanations = await Promise.all(explanationPromises);
        clausesToExplain.forEach((clause, index) => {
          clause.explanation = explanations[index];
        });
      } catch (e) {
        console.warn('Error fetching some explanations:', e);
        // Continue anyway, explanations may be partially populated
      }
    }

    renderResults(contentDiv, result);
  } catch (error) {
    console.error('Analysis failed:', error);
    renderError(contentDiv, error.message);
  } finally {
    sidebarState.isAnalyzing = false;
  }
}

/**
 * Render analysis results in sidebar
 */
function renderResults(contentDiv, data) {
  contentDiv.innerHTML = '';

  // Risk Banner with circular score
  const banner = document.createElement('div');
  banner.id = 'tos-sidebar-risk-banner';
  const riskClass = data.overall_risk.color === 'red' ? 'high-risk' 
                   : data.overall_risk.color === 'yellow' ? 'medium-risk' 
                   : 'low-risk';
  banner.className = riskClass;

  banner.innerHTML = `
    <div class="tos-banner-left">
      <div class="tos-risk-label">Risk Level</div>
      <div class="tos-risk-text">${data.overall_risk.label}</div>
    </div>
    <div class="tos-score-circle">
      <div class="tos-score-number">${data.overall_risk.score}</div>
      <div class="tos-score-label">/ 100</div>
    </div>
  `;
  contentDiv.appendChild(banner);

  // Verdict
  if (data.verdict) {
    const verdict = document.createElement('div');
    verdict.id = 'tos-sidebar-verdict';
    verdict.className = riskClass;
    verdict.textContent = data.verdict;
    contentDiv.appendChild(verdict);
  }

  // Categories Section
  if (data.categories && data.categories.length > 0) {
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'tos-section-header';
    categoryHeader.textContent = 'Risk Categories';
    contentDiv.appendChild(categoryHeader);

    const categoryContainer = document.createElement('div');
    categoryContainer.id = 'tos-sidebar-categories';

    const categoryEmoji = {
      'data sharing with third parties': '📤',
      'payment and billing': '💳',
      'account deletion': '🗑️',
      'data retention': '💾',
      'third-party tracking': '👁️',
      'auto-renewal subscription': '🔁'
    };

    for (const cat of data.categories) {
      const pill = document.createElement('div');
      pill.className = 'tos-category-pill';
      pill.innerHTML = `
        <span class="tos-category-emoji">${categoryEmoji[cat.category] || '⚠️'}</span>
        <span>${cat.category}</span>
        <span class="tos-category-count">${cat.count}</span>
      `;
      categoryContainer.appendChild(pill);
    }

    contentDiv.appendChild(categoryContainer);
  }

  // Flagged Clauses Section
  if (data.flagged_sentences && data.flagged_sentences.length > 0) {
    const clauseHeader = document.createElement('div');
    clauseHeader.className = 'tos-section-header';
    clauseHeader.textContent = `Flagged Clauses (${data.flagged_sentences.length})`;
    contentDiv.appendChild(clauseHeader);

    const clauseContainer = document.createElement('div');
    clauseContainer.id = 'tos-sidebar-clauses';

    // Limit to 10 clauses to keep sidebar clean
    const clausesToShow = data.flagged_sentences.slice(0, 10);

    for (const clause of clausesToShow) {
      const card = document.createElement('div');
      const riskClass = clause.risk === 'high' ? 'high-risk' : 'medium-risk';
      card.className = `tos-clause-card ${riskClass}`;

      const riskLabel = clause.risk === 'high' ? '🔴 High Risk' : '🟡 Medium Risk';

      card.innerHTML = `
        <div class="tos-clause-header">
          <div class="tos-clause-badge ${riskClass}">${riskLabel}</div>
          <div class="tos-clause-category">${clause.category}</div>
        </div>
        
        <div class="tos-plain-english-section">
          <div class="tos-plain-english-header">
            <span class="tos-plain-label">
              <span>📝</span>
              <span>Plain English</span>
            </span>
            <span class="tos-toggle-arrow">▼</span>
          </div>
          <div class="tos-plain-english-box">${escapeHtml(clause.explanation || 'Loading explanation...')}</div>
          <button class="tos-toggle-btn" data-clause-id="${clausesToShow.indexOf(clause)}">Show original text</button>
          <div class="tos-original-text">${escapeHtml(clause.sentence)}</div>
        </div>
      `;

      // Add toggle functionality
      const toggleBtn = card.querySelector('.tos-toggle-btn');
      const originalText = card.querySelector('.tos-original-text');
      const headerDiv = card.querySelector('.tos-plain-english-header');

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        originalText.classList.toggle('visible');
        toggleBtn.textContent = originalText.classList.contains('visible') ? 'Hide original text' : 'Show original text';
      });

      headerDiv.addEventListener('click', () => {
        headerDiv.classList.toggle('collapsed');
      });

      clauseContainer.appendChild(card);
    }

    contentDiv.appendChild(clauseContainer);
  }

  // No clauses message
  if (!data.flagged_sentences || data.flagged_sentences.length === 0) {
    const noClausesMsg = document.createElement('div');
    noClausesMsg.style.cssText = 'text-align: center; color: #6b7280; font-size: 13px; padding: 20px;';
    noClausesMsg.textContent = '✓ No significant red flags detected.';
    contentDiv.appendChild(noClausesMsg);
  }

  // Footer
  const footer = document.createElement('div');
  footer.id = 'tos-sidebar-footer';
  footer.textContent = 'Powered by ToS Guard AI';
  contentDiv.parentElement.appendChild(footer);
}

/**
 * Render error state
 */
function renderError(contentDiv, errorMessage) {
  contentDiv.innerHTML = `
    <div id="tos-sidebar-error">
      <div id="tos-sidebar-error-icon">⚠️</div>
      <div id="tos-sidebar-error-text">Could not analyze this page.</div>
      <button id="tos-sidebar-retry-btn">Retry</button>
    </div>
  `;

  document.getElementById('tos-sidebar-retry-btn').addEventListener('click', () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'tos-sidebar-loading';
    loadingDiv.innerHTML = `
      <div class="tos-spinner"></div>
      <div id="tos-sidebar-loading-text">Scanning Terms of Service...</div>
    `;
    contentDiv.innerHTML = '';
    contentDiv.appendChild(loadingDiv);
    analyzePageToS(contentDiv);
  });
}

/**
 * Close the sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('tos-sidebar');
  if (sidebar) {
    sidebar.classList.add('collapsed');
    setTimeout(() => {
      sidebar.remove();
      sidebarState.isOpen = false;
    }, 350);
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Main initialization
 */
function init() {
  // Only run if this is a ToS page
  if (!isToSPage()) {
    return;
  }

  console.log('[ToS Guard] Terms of Service page detected');

  // Wait for page to fully load, then inject sidebar
  setTimeout(() => {
    injectSidebar();
    sidebarState.isOpen = true;
  }, 1500);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
