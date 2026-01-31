function getPageContent() {
  // 1. Create a clone of the document
  // It is vital to clone the document so that Readability can modify
  // and clean it without affecting the page you are visually viewing.
  const documentClone = document.cloneNode(true);

  // 2. Use Readability to extract the main content
  // This removes navbars, ads, footers, etc.
  const article = new Readability(documentClone).parse();

  if (!article) {
    return null;
  }

  // 3. Configure Turndown to convert HTML to Markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx', // Uses # for titles instead of underline
    codeBlockStyle: 'fenced' // Uses ``` for code blocks
  });

  // 4. Convert clean content to Markdown
  const markdownBody = turndownService.turndown(article.content);

  // 5. Build the final result with useful metadata for AI
  const date = new Date().toLocaleDateString();

  const finalMarkdown = `
# ${article.title}

**Source:** ${window.location.href}
**Author:** ${article.byline || 'Unknown'}
**Extraction Date:** ${date}
**Site Summary:** ${article.excerpt || 'Not available'}

---

${markdownBody}
`;

  return { markdown: finalMarkdown, title: article.title };
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    const result = getPageContent();

    if (result) {
      sendResponse({ markdown: result.markdown, title: result.title });
    } else {
      sendResponse({ markdown: "Could not identify the main content of this page.", title: "Error" });
    }
  }
});