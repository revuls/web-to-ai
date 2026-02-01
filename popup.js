document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');

  const tokenCountFn = document.getElementById('tokenCount');

  // Generic function to request markdown from the active tab
  function getMarkdown(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extract" }, (response) => {
        if (response && response.markdown) {
          const estimatedTokens = Math.ceil(response.markdown.length / 4);
          tokenCountFn.innerText = `~${estimatedTokens} tokens`;
          callback(response.markdown, tabs[0].title, estimatedTokens);
        } else {
          status.innerText = "Error extracting content.";
        }
      });
    });
  }

  // Copy Logic
  copyBtn.addEventListener('click', () => {
    getMarkdown((markdown, title, tokens) => {
      navigator.clipboard.writeText(markdown).then(() => {
        status.innerText = "Copied to clipboard!";
        saveToHistory(markdown, title, tokens);
        setTimeout(() => status.innerText = "", 2000);
      });
    });
  });

  // Download Logic
  downloadBtn.addEventListener('click', () => {
    getMarkdown((markdown, title, tokens) => {
      saveToHistory(markdown, title, tokens);
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

  // History Logic
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const HISTORY_KEY = 'web_to_ai_history';

  function loadHistory() {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveToHistory(markdown, title, tokenCount) {
    const history = loadHistory();
    const newItem = {
      id: Date.now(),
      title: title || 'Untitled',
      markdown: markdown,
      tokenCount: tokenCount || 0,
      timestamp: new Date().toLocaleString()
    };

    // Prepend new item
    history.unshift(newItem);

    // Optional: Limit history size (e.g. 50 items)
    if (history.length > 50) {
      history.pop();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const history = loadHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
      clearHistoryBtn.style.display = 'none';
      historyList.innerHTML = '<div style="text-align:center; color:#999; font-size:11px; padding:10px;">No history yet.</div>';
      return;
    }

    clearHistoryBtn.style.display = 'block';

    history.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';

      const tokensText = item.tokenCount ? ` (~${item.tokenCount} tokens)` : '';

      el.innerHTML = `
        <div class="history-item-header">
          <div class="history-title" title="${item.title}">${item.title}</div>
          <div class="history-actions">
            <button class="btn-small btn-recopy" data-id="${item.id}" title="Copy again">Copy</button>
            <button class="btn-small btn-delete" data-id="${item.id}" title="Delete">X</button>
          </div>
        </div>
        <div class="history-meta">${item.timestamp}${tokensText}</div>
      `;
      historyList.appendChild(el);
    });
  }

  function deleteItem(id) {
    let history = loadHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  }

  function copyFromHistory(id) {
    const history = loadHistory();
    const item = history.find(i => i.id === id);
    if (item) {
      navigator.clipboard.writeText(item.markdown).then(() => {
        status.innerText = "Copied from history!";
        setTimeout(() => status.innerText = "", 2000);
      });
    }
  }

  // Event Listeners for History
  clearHistoryBtn.addEventListener('click', clearHistory);

  historyList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      deleteItem(id);
    } else if (e.target.classList.contains('btn-recopy')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      copyFromHistory(id);
    }
  });

  // Initial Render
  renderHistory();

});