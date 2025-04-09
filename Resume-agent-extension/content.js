const API_BASE = "http://localhost:8000"; // Update when deployed

function insertButton() {
    const jobTitleDiv = document.querySelector(".t-24.job-details-jobs-unified-top-card__job-title");
  
    if (!jobTitleDiv || document.getElementById("analyze-btn")) return;
  
    const analyzeBtn = document.createElement("button");
    analyzeBtn.id = "analyze-btn";
    analyzeBtn.innerHTML = `
      <span class="btn-text">✨ Analyze Resume</span>
      <span class="loader" style="display: none; margin-left: 8px;">
        <div class="spinner"></div>
      </span>
    `;
    analyzeBtn.style.cssText = `
      margin-top: 10px;
      padding: 8px 16px;
      background: linear-gradient(90deg, #845ec2, #d65db1);
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    `;
  
    analyzeBtn.onclick = async () => {
      const jdContainer = document.querySelector(".jobs-description__container");
      if (!jdContainer) {
        alert("Job description not found!");
        return;
      }
  
      const loader = analyzeBtn.querySelector(".loader");
      loader.style.display = "inline-flex";
      analyzeBtn.disabled = true;
  
      const jobDescription = jdContainer.innerText.trim();
      try {
        const res = await fetch(`${API_BASE}/evaluate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ job_description: jobDescription })
        });
  
        const result = await res.json();
  
        if (result.success && result.data) {
          createEvaluationPanel(result.data, jdContainer);
        } else {
          alert("Evaluation failed.");
        }
      } catch (error) {
        alert("Error calling evaluation API.");
        console.error(error);
      } finally {
        loader.style.display = "none";
        analyzeBtn.disabled = false;
      }
    };
  
    jobTitleDiv.parentElement.appendChild(analyzeBtn);
  }

function createEvaluationPanel(data, jdContainer) {
  const existing = document.getElementById("resume-eval-panel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "resume-eval-panel";

  panel.innerHTML = `
  <div class="panel-header">
    <h2>✨ Resume Match Insights</h2>
    <button id="close-panel-btn">&times;</button>
  </div>

  <div class="accordion">
    ${generateAccordionItem("✅ Matched Skills", data.matched_skills, "green")}
    ${generateAccordionItem("❌ Missing Skills", data.missing_skills, "red")}
    ${generateAccordionItem("💡 Suggested Skills", data.suggested_skills)}
    ${generateAccordionItem("📋 Resume Tips", data.resume_analysis)}
    ${generateAccordionItem("📌 ATS Keywords", data.ats_tips)}
  </div>

  <p style="font-size: small; color: white; text-align: right; margin-top: 10px;">
    powered by Gemma3
  </p>
`;


  const style = document.createElement("style");
  style.innerHTML = `
    #resume-eval-panel {
      background: linear-gradient(90deg, rgb(132, 94, 194), rgb(214, 93, 177));
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      padding: 20px;
      margin-bottom: 24px;
      font-family: 'Segoe UI', sans-serif;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .panel-header h2 {
      font-size: 18px;
      color: white;
    }

    #close-panel-btn {
      background: none;
      border: none;
      font-size: 22px;
      color: #999;
      cursor: pointer;
    }

    .accordion-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .accordion-header {
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: ##fdfcff;
      color: black;
    }

    .accordion-header.green { color: #2e7d32; }
    .accordion-header.red { color: #c62828; }

    .accordion-body {
      padding: 10px 16px;
      display: none;
      font-size: 14px;
      color: #333;
    }

    .accordion-item.active .accordion-body {
      display: block;
    }

    .accordion-item.active .accordion-header::after {
      transform: rotate(90deg);
    }

    .accordion-header::after {
      content: "▶";
      font-size: 12px;
      transition: transform 0.2s ease;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #fff;
      border-top: 2px solid #d65db1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
    .accordion-body div {
    margin-bottom: 8px; /* or use padding */
    }
  `;
  document.head.appendChild(style);

  jdContainer.parentElement.insertBefore(panel, jdContainer);

  document.getElementById("close-panel-btn").onclick = () => panel.remove();

  // Handle accordion toggle
  document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("active");
    });
  });
}

function generateAccordionItem(title, content, colorClass = "") {
  return `
    <div class="accordion-item">
      <div class="accordion-header ${colorClass}">${title}</div>
      <div class="accordion-body">${content}</div>
    </div>

  `;
}

window.addEventListener("load", () => {
  setTimeout(insertButton, 2000);
});
