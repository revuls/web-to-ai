# Web to AI Context (Pro)

A Chrome extension designed to extract clean, readable content from web pages and convert it into Markdown format, optimized for providing context to Large Language Models (LLMs) and Artificial Intelligence.

## Key Features

*   **Clean Content Extraction**: Automatically removes ads, navigation menus, footers, and other unnecessary elements using `Readability.js`.
*   **Markdown Conversion**: Transforms clean HTML content into a structured, easy-to-read Markdown format with `Turndown.js`.
*   **Useful Metadata**: Automatically includes the page title, source URL, author, extraction date, and site summary.
*   **Easy to Use**: Copy content to the clipboard or download it as a `.md` file with a single click.

## Technologies Used

*   **Manifest V3**: Built on the latest version of the Chrome Extensions Manifest for enhanced security and performance.
*   **Readability.js**: The Mozilla library used for Firefox's "Reader View".
*   **Turndown.js**: A robust engine for converting HTML to Markdown.

## Installation (Developer Mode)

Since this is a custom extension, you can install it in your Chrome browser (or Chromium-based browser) by following these steps:

1.  Clone or download this repository to your computer.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Toggle the **"Developer mode"** switch in the top right corner.
4.  Click the **"Load unpacked"** button.
5.  Select the root folder of this project (`web-to-ai`).

Done! The extension should now appear in your toolbar.

## Usage

1.  Navigate to the web page you want to process.
2.  Click the **Web to AI Context** extension icon in the toolbar.
3.  A popup window will open with two options:
    *   **Copy to Clipboard**: Copies all content in Markdown format to the clipboard.
    *   **Download .md**: Downloads the content as a `.md` file to your computer.

## Project Structure

*   `manifest.json`: Extension configuration.
*   `popup.html` / `popup.js`: User Interface for the popup window.
*   `content.js`: Main script injected into the page to extract and process content.
*   `lib/`: Third-party libraries (`Readability.js`, `turndown.js`).
