import re
import requests
from bs4 import BeautifulSoup
from transformers import pipeline

# Load model once at startup (cached after first run)
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

CATEGORIES = [
    "data sharing with third parties",
    "payment and billing",
    "account deletion",
    "data retention",
    "third-party tracking",
    "auto-renewal subscription",
]

# Keywords that bump up risk
HIGH_RISK_KEYWORDS = [
    "share", "sell", "third parties", "partners", "advertisers",
    "track", "monitor", "collect", "retain", "store indefinitely",
    "auto-renew", "non-refundable", "arbitration", "waive",
    "irrevocable", "perpetual license",
]

MEDIUM_RISK_KEYWORDS = [
    "may", "could", "at our discretion", "without notice",
    "cancel", "suspend", "modify", "update", "change",
]

# Which categories are inherently high-risk
HIGH_RISK_CATEGORIES = {
    "data sharing with third parties",
    "third-party tracking",
    "auto-renewal subscription",
}

MEDIUM_RISK_CATEGORIES = {
    "payment and billing",
    "account deletion",
    "data retention",
}


def scrape_url(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()
    return " ".join(soup.get_text(separator=" ").split())


def split_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    # Keep sentences that are long enough to be meaningful
    return [s.strip() for s in sentences if len(s.strip()) > 40]


def get_risk_level(sentence: str, top_category: str) -> str:
    s = sentence.lower()
    if any(kw in s for kw in HIGH_RISK_KEYWORDS) or top_category in HIGH_RISK_CATEGORIES:
        return "high"
    if any(kw in s for kw in MEDIUM_RISK_KEYWORDS) or top_category in MEDIUM_RISK_CATEGORIES:
        return "medium"
    return "low"


def compute_overall_score(flagged: list[dict]) -> dict:
    high = sum(1 for s in flagged if s["risk"] == "high")
    medium = sum(1 for s in flagged if s["risk"] == "medium")
    total = len(flagged)

    if total == 0:
        return {"label": "Low Risk", "color": "green", "score": 0}

    score = (high * 2 + medium * 1) / (total * 2)  # 0–1

    if score >= 0.5:
        return {"label": "High Risk", "color": "red", "score": round(score * 100)}
    elif score >= 0.25:
        return {"label": "Medium Risk", "color": "yellow", "score": round(score * 100)}
    else:
        return {"label": "Low Risk", "color": "green", "score": round(score * 100)}


def generate_verdict(overall_risk: dict, flagged: list[dict], categories: list[dict]) -> str:
    """Generate a human-readable verdict summary of the ToS."""
    score = overall_risk["score"]
    high_count = sum(1 for s in flagged if s["risk"] == "high")
    medium_count = sum(1 for s in flagged if s["risk"] == "medium")
    total_flagged = len(flagged)
    
    if overall_risk["label"] == "High Risk":
        verdict = f"⚠️ WARNING: This Terms of Service contains {high_count} concerning clauses and may not be user-friendly."
        if "data sharing with third parties" in [c["category"] for c in categories]:
            verdict += " Your data may be shared with third parties."
        if "auto-renewal subscription" in [c["category"] for c in categories]:
            verdict += " Be careful of auto-renewal traps."
        if "third-party tracking" in [c["category"] for c in categories]:
            verdict += " Your activity is likely tracked."
        verdict += " Read the highlighted sections carefully before agreeing."
    
    elif overall_risk["label"] == "Medium Risk":
        verdict = f"⚠️ CAUTION: This ToS has {medium_count} moderate concerns worth reviewing."
        if high_count > 0:
            verdict = f"⚠️ CAUTION: This ToS has {high_count} high-risk and {medium_count} medium-risk clauses."
        verdict += " Check the flagged sections before accepting."
    
    else:  # Low Risk
        verdict = "✅ GOOD NEWS: This Terms of Service appears relatively fair and transparent."
        if total_flagged == 0:
            verdict += " No significant red flags detected."
        else:
            verdict += f" Only minor concerns found ({total_flagged} clause)."
    
    return verdict


def generate_plain_english(sentence: str, category: str = "") -> str:
    """Generate a plain English explanation of a legal clause."""
    sent_lower = sentence.lower()
    
    # Data sharing patterns
    if "share" in sent_lower and ("third" in sent_lower or "partner" in sent_lower or "advertiser" in sent_lower):
        return "This means the company can share your personal information with other companies or partners. They may use your data for advertising, analytics, or other purposes."
    
    if "data retention" in sent_lower or "retain" in sent_lower and "data" in sent_lower:
        return "This describes how long the company will keep your data. They reserve the right to store your information even after you leave."
    
    # Auto-renewal patterns  
    if "auto-renew" in sent_lower or ("renew" in sent_lower and "automatic" in sent_lower):
        return "Your subscription will automatically renew and charge you unless you manually cancel it. Make sure to disable auto-renewal if you don't want to be charged."
    
    if "cancel" in sent_lower and "subscription" in sent_lower:
        return "This explains how to cancel your subscription. Check if cancellation is easy to do or requires multiple steps."
    
    # Tracking patterns
    if "track" in sent_lower or "monitoring" in sent_lower or "analytics" in sent_lower:
        return "The company monitors your activity on the website or app. This data is collected to improve services, create targeted ads, and understand user behavior."
    
    if "cookie" in sent_lower or "pixel" in sent_lower:
        return "The company uses tracking technology (cookies, pixels) to follow your activity. This allows them to recognize you across websites and show targeted ads."
    
    # Legal liability patterns
    if "arbitration" in sent_lower:
        return "Instead of going to court, disputes will be resolved through private arbitration. This typically favors the company and limits your legal options."
    
    if "waive" in sent_lower or "disclaim" in sent_lower:
        return "The company is giving up liability or responsibility for certain things. This means they won't be fully responsible if something goes wrong."
    
    if "class action" in sent_lower:
        return "You agree not to join class action lawsuits against the company. This limits your legal recourse and the company's accountability."
    
    # Account/billing patterns
    if "suspend" in sent_lower or "terminate" in sent_lower:
        return "The company can disable or delete your account under certain conditions. They have the right to remove your access without much notice."
    
    if "non-refundable" in sent_lower:
        return "Once you pay for something, you cannot get your money back. The company keeps the payment even if you change your mind."
    
    if "fee" in sent_lower and "change" in sent_lower:
        return "The company can change their pricing or add new fees at any time. You may be charged more in the future."
    
    # Permission patterns
    if "permission" in sent_lower or "consent" in sent_lower:
        return "By using this service, you give the company permission to do certain things with your data or account. Make sure you understand what you're agreeing to."
    
    if "may" in sent_lower or "at our discretion" in sent_lower:
        return "The company has the freedom to make decisions. They can do this if they choose, without specific rules or restrictions."
    
    # Default explanation for unknowns
    return f"This clause mentions important terms. The service reserves certain rights that could affect your privacy, payments, or legal protections. Read carefully before agreeing."


def analyze_tos(url: str = None, raw_text: str = None) -> dict:
    # 1. Get text
    text = raw_text if raw_text else scrape_url(url)

    # 2. Split into sentences, cap at 80 for speed
    sentences = split_sentences(text)[:80]

    if not sentences:
        raise ValueError("Could not extract meaningful text.")

    # 3. Classify each sentence
    flagged = []
    category_counts = {cat: 0 for cat in CATEGORIES}

    for sentence in sentences:
        result = classifier(sentence, CATEGORIES, multi_label=False)
        top_category = result["labels"][0]
        top_score = result["scores"][0]

        # Only flag if model is reasonably confident
        if top_score < 0.4:
            continue

        risk = get_risk_level(sentence, top_category)

        # Only surface medium/high sentences
        if risk in ("medium", "high"):
            flagged.append({
                "sentence": sentence,
                "category": top_category,
                "confidence": round(top_score, 2),
                "risk": risk,
            })
            category_counts[top_category] += 1

    # 4. Sort: high first, then medium
    risk_order = {"high": 0, "medium": 1, "low": 2}
    flagged.sort(key=lambda x: risk_order[x["risk"]])

    # 5. Category summary (only categories that appeared)
    categories_found = [
        {"category": cat, "count": count}
        for cat, count in category_counts.items()
        if count > 0
    ]
    categories_found.sort(key=lambda x: -x["count"])

    # 6. Generate overall verdict
    overall_risk = compute_overall_score(flagged)
    verdict = generate_verdict(overall_risk, flagged, categories_found)

    return {
        "overall_risk": overall_risk,
        "verdict": verdict,
        "flagged_sentences": flagged,
        "categories": categories_found,
        "total_sentences_analyzed": len(sentences),
    }
