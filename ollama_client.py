import logging
from typing import Dict

from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_ollama.llms import OllamaLLM

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Evaluation(BaseModel):
    matched_skills: str = Field(
        description="List all skills that are **present in both** the resume and the job description. Return as a comma-separated list."
    )
    missing_skills: str = Field(
        description="Identify skills that are **required in the job description but are not found in the resume**. Return as a comma-separated list."
    )
    suggested_skills: str = Field(
        description="Suggest additional skills that are not explicitly mentioned in the job description but are commonly useful for this type of role. Return as a comma-separated list."
    )
    resume_analysis: str = Field(
        description="Provide a paragraph of 3 to 4 bullet points suggesting how the resume can be improved or tailored better for this specific job description.MUST USE <br> tag for new line, for text formatting."
    )
    ats_tips: str = Field(
        description="List important keywords from the job description that should be included in the resume to improve its performance in Applicant Tracking Systems (ATS). Return as a comma-separated list."
    )




def load_resume_text(resume_path: str) -> str:
    """
    Extract text content from a PDF resume using PyPDFLoader.
    """
    try:
        loader = PyPDFLoader(resume_path)
        return " ".join([page.page_content for page in loader.lazy_load()])
    except Exception as e:
        logger.error(f"Failed to load or parse resume PDF: {e}")
        raise


def call_llm(job_description: str) -> Dict[str, str]:
    """
    Invokes the LLM to analyze the resume against a job description.
    
    Args:
     job_description: gets job description from the front end 
    
    Returns:
        response_json: A json response of defined pydantic schema
    """
    try:
        
        resume_path = "resume/resume.pdf"
        resume_text = load_resume_text(resume_path)

        parser = PydanticOutputParser(pydantic_object=Evaluation)
        template = f"""You are an expert resume analyst. A user has provided their resume and a job description they are interested in. 
                        Your task is to evaluate the resume against the job description and provide insights in the following structured format.

                        User's Resume:
                        {resume_text}

                        Here is the Job Description:
                        {{job_description}}

                        Make sure to respond in the below output format:
                        {{format_instructions}}
                    """

        prompt = PromptTemplate(
            template=template,
            input_variables=["job_description"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        llm = OllamaLLM(model="gemma3:4b", temperature=0.4)
        chain = prompt | llm | parser

        response = chain.invoke({
            "job_description": job_description
        })

        logger.info("LLM call completed successfully.")
        return response.model_dump()

    except Exception as e:
        logger.exception("LLM analysis failed.")
        return {
            "error": str(e),
            "matched_skills": "",
            "missing_skills": "",
            "suggested_skills": "",
            "resume_analysis": "",
            "ats_tips": ""
        }


