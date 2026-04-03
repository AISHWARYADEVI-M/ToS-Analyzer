from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_tos, classifier
import pdfplumber
import io
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ToS Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (development)
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str | None = None
    text: str | None = None

class ExplainRequest(BaseModel):
    sentence: str
    category: str

@app.on_event("startup")
async def startup_event():
    """Warm up the model on startup"""
    logger.info("Warming up the classifier model...")
    try:
        # Test the classifier with a dummy sentence to load the model
        classifier("This is a test sentence about data sharing.", 
                  ["data sharing with third parties"], multi_label=False)
        logger.info("✅ Model loaded successfully")
    except Exception as e:
        logger.error(f"⚠️ Model loading issue (will retry on first request): {e}")

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.url and not req.text:
        raise HTTPException(status_code=400, detail="Provide a URL or raw text.")
    try:
        logger.info(f"Analyzing {'URL' if req.url else 'text'}...")
        result = analyze_tos(url=req.url, raw_text=req.text)
        logger.info(f"Analysis complete. Found {len(result['flagged_sentences'])} flagged clauses.")
        return result
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        logger.info(f"Processing PDF: {file.filename}")
        contents = await file.read()
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text = "\n".join(
                page.extract_text() for page in pdf.pages if page.extract_text()
            )
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        logger.info(f"Extracted {len(text)} characters from PDF")
        result = analyze_tos(raw_text=text)
        logger.info(f"Analysis complete. Found {len(result['flagged_sentences'])} flagged clauses.")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF analysis failed: {str(e)}")

@app.post("/explain")
async def explain(req: ExplainRequest):
    """Generate plain English explanation for a specific clause"""
    if not req.sentence:
        raise HTTPException(status_code=400, detail="Provide a sentence to explain.")
    
    try:
        from analyzer import generate_plain_english
        explanation = generate_plain_english(req.sentence, req.category)
        return {"explanation": explanation}
    except Exception as e:
        logger.error(f"Explanation error: {e}")
        raise HTTPException(status_code=500, detail=f"Could not explain: {str(e)}")

@app.get("/health")
def health():
    return {"status": "ok", "model": "loaded"}