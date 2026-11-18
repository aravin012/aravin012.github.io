# aravin012.github.io

Personal resume website for **Aravindan P** — Senior Software Engineer.

Live at: https://aravin012.github.io

## Stack
- Vanilla HTML5 / CSS3 / JavaScript (no frameworks)
- Font Awesome 6 icons
- Google Fonts (Inter + JetBrains Mono)
- Hosted on GitHub Pages

## Features
- Dark / Light theme toggle (persisted in localStorage)
- Typewriter hero title
- Animated counters
- Scroll-triggered section animations
- Fully responsive (mobile-first)
- Accessible (ARIA roles, skip link, keyboard nav)
- Print-friendly styles
- Formal document studio: two-column one-page resume, detailed two-page resume, and customizable cover letter
- A4 PDF printing and editable Word (.docx) downloads from the same content

## Local Development
Just open `index.html` in a browser — no build step required.

Open `resume.html` to select a document. Enter a recipient, company, and role for the cover letter, then use **Print / Save as PDF** (A4, browser headers/footers off) or **Download Word**. Word generation loads the `docx` and `JSZip` browser libraries from jsDelivr, so an internet connection is required for DOCX export.

To check document pagination and Word output, run `python verify_exports.py` with Playwright, pypdf, and python-docx installed. The check also measures Word page counts when Microsoft Word automation is available on Windows.

## Updating LinkedIn from your logged-in Chrome tab

`linkedin-update.js` is a Chrome DevTools Snippet for your own profile. It updates the headline, appends the framework description to About and the Zinnia experience, and adds `https://github.com/aravin012` as a website when an empty website field is available. It checks for existing wording so reruns do not duplicate it. LinkedIn frequently changes its page structure: any editor the script cannot identify is skipped and reported in the Console.

1. Open `https://www.linkedin.com/in/aravindan-pathirasamy-b56708a7/` in the Chrome session where you are logged in.
2. Press **F12**, open **Sources → Snippets**, create a new snippet, and paste the entire contents of `linkedin-update.js` into it.
3. Press **Ctrl+Enter** to run it and confirm the prompts. Review the Console table for `saved`, `already current`, or `SKIPPED` beside each section.
4. Refresh the profile and check all four sections. For a skipped website field, add the GitHub link manually through **Contact info → Edit contact info → Add website**.

No password, cookie, or access token is stored by the snippet.
