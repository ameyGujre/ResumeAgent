const API_BASE = "http://localhost:8000"; // Update this when deploying

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("resumeInput");
  const file = fileInput.files[0];
  const statusDiv = document.getElementById("status");

  statusDiv.textContent = "";
  statusDiv.className = "";

  if (!file) {
    statusDiv.textContent = "Please select a PDF resume.";
    statusDiv.className = "error";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/upload-resume`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      statusDiv.textContent = data.message || "✅ Resume uploaded successfully.";
      statusDiv.className = "success";
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    statusDiv.textContent = "❌ Upload failed. Please try again.";
    statusDiv.className = "error";
  }
});
