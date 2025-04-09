from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ollama_client import call_llm
import logging
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Resume Evaluation API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your extension origin
    allow_credentials=True,
    allow_methods=["*"],  # Important to allow OPTIONS and POST
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



RESUME_DIR = "resume"
RESUME_PATH = os.path.join(RESUME_DIR, "resume.pdf")
os.makedirs(RESUME_DIR, exist_ok=True)


# Request model
class JobDescriptionInput(BaseModel):
    job_description: str

# POST endpoint: evaluate resume
@app.post("/evaluate", summary="Evaluate resume against job description")
async def evaluate_resume(input_data: JobDescriptionInput):
    try:
        if not os.path.exists(RESUME_PATH):
            raise FileNotFoundError("resume.pdf not found in resume folder.")
        
        logger.info("Evaluating resume.")
        result = call_llm(input_data.job_description)
        return {"success": True, "data": result}
    except FileNotFoundError as fnf_error:
        logger.error(f"Resume file not found: {fnf_error}")
        raise HTTPException(status_code=404, detail=str(fnf_error))
    except Exception as e:
        logger.exception("Error during evaluation.")
        raise HTTPException(status_code=500, detail="Internal server error.")
    


# POST endpoint: upload resume PDF
@app.post("/upload-resume", summary="Upload resume PDF file")
async def upload_resume(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        # Save new file as resume.pdf (overwrite)
        with open(RESUME_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"Uploaded resume saved to: {RESUME_PATH}")
        return JSONResponse(status_code=200, content={"success": True, "message": "Resume uploaded successfully as resume.pdf."})
    
    except Exception as e:
        logger.exception("Error uploading resume.")
        raise HTTPException(status_code=500, detail="Failed to upload resume. Please try again.")
