# Code your interviews — IART self-guided tutorial

A static website (HTML, CSS, JavaScript; no build step, no tracking, nothing saved) that teaches
Year 1 students to code interview transcripts with five themes: needs, goals, motivations,
behaviour and context. Built from the IART Interactive Realities design system.

## Put it online (GitHub Pages)

1. Create a repository and upload everything in this folder (keep the folder structure).
2. Repository **Settings > Pages > Build and deployment**: source **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. After a minute the guide is live at `https://<your-username>.github.io/<repository-name>/`.
4. Put that link in Brightspace, and keep the PDF codebook there as well in case the site is unreachable.

## Before you release it

- [ ] Add the BUas logo: `assets/logos/buas-black.png` (black version only).
- [ ] If you add the logo, regenerate the PDF: open `codebook.html` in Chrome, Print, destination **Save as PDF**, paper A4, margins Default, **Background graphics on**, save as `downloads/IART_Codebook_one-page.pdf`.
- [ ] Test the Word route yourself with a one-minute recording: Home > Dictate > Transcribe > Upload audio. Check that Dutch is in the language list, and how the inserted transcript looks with timestamps.
- [ ] Check the Brightspace wording ("Download the consent form from Brightspace") matches where you upload it.
- [ ] Add one line to the consent form: recordings and transcripts are stored and transcribed using Microsoft OneDrive and Word.
- [ ] Open the page on a phone and on a laptop, and try Print.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole tutorial (one page, section menu on the left, or across the top on phones) |
| `codebook.html` | The one-page codebook, built to print on a single A4 |
| `downloads/IART_Codebook_one-page.pdf` | The codebook as a PDF (linked from the guide) |
| `css/styles.css` | Design tokens, components and print rules |
| `js/script.js` | Menu highlighting, show/hide codes, click-to-code practice, copy prompt, checklist, print |
| `assets/fonts/` | Sniglet, Nunito and Caveat, self-hosted (SIL Open Font License; licences included) |
| `assets/logos/` | Put `buas-black.png` here |

## Editing the content

- **Practice excerpt (Jonas):** each coded line in `index.html` has `data-key` (the right codes, comma-separated, e.g. `behaviour,context,star`) and `data-note` (the explanation shown after checking). The highlighted parts are `<span class="seg" data-t="..." data-tag="...">`.
- **Worked example (Mila):** the same `seg` spans, always visible unless students hide them.
- **Theme colours:** `--t-need`, `--t-goal`, `--t-motivation`, `--t-behaviour`, `--t-context` at the top of `css/styles.css`.
- **Translation prompt:** the text in `#prompt-text` is what the copy button copies.
