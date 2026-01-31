document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');

  // Generic function to request markdown from the active tab
  function getMarkdown(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extract" }, (response) => {
        if (response && response.markdown) {
          callback(response.markdown, tabs[0].title);
        } else {
          status.innerText = "Error extracting content.";
        }
      });
    });
  }

  // Copy Logic
  copyBtn.addEventListener('click', () => {
    getMarkdown((markdown) => {
      navigator.clipboard.writeText(markdown).then(() => {
        status.innerText = "Copied to clipboard!";
        setTimeout(() => status.innerText = "", 2000);
      });
    });
  });

  // Download Logic
  downloadBtn.addEventListener('click', () => {
    getMarkdown((markdown, title) => {
      // Clean filename
      const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".md";

      // Create a blob and download it
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      status.innerText = "File downloaded.";
    });
  });
});