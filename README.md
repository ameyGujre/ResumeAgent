
# 🧠Resume Analyzer Agent (Powered by Gemma3)

Tired of copy-pasting every job description from LinkedIn into ChatGPT just to ask what’s missing in your resume?  
**Resume Ranker** is a personal AI **Agent** that reviews your resume based on job descriptions **inside LinkedIn itself**. No tab switching. No manual prompts. Just insights, directly on the site.

This project uses **Gemma3**, running locally via [Ollama](https://ollama.com), to analyze job descriptions and compare them with your resume, providing tailored feedback for:
- ✅ Matched Skills  
- ❌ Missing Skills  
- 💡 Suggested Improvements  
- 📋 ATS Tips  
- 📌 Resume Suggestions

---
---

## ⚙️ Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Ollama](https://ollama.com/)
- Chrome browser

---

## 🚀 Getting Started

### 1. Install Ollama and Run Gemma3

Install Ollama and pull the **Gemm3:4b** model:

https://ollama.com/library/gemma3

---

### 2. Set Up Python Environment

```bash
python -m venv venv
venv\Scripts\activate  #windows
pip install -r requirements.txt
```

---

### 3. 🌐 Load the Chrome Extension

1. Open **Chrome** and go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **"Load unpacked"**
4. Select the `Resume-agent-extension` folder from this project

---

### 4. Run the Backend

```bash
uvicorn main:app --reload
```

This starts a local API server at `http://localhost:8000`.

---

> You should now see an **✨ Analyze Resume** button directly on LinkedIn job pages.

---

## 💬 Contribute or Feedback

If you found this useful or have suggestions, feel free to create an issue or PR!  
Also open to feedback, ideas, and cool collaborations!

---

## 🧠 Powered By

- [Gemma 3B](https://ai.google.dev/gemma)
- [Ollama](https://ollama.com)

