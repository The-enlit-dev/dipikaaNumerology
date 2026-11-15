# Dipikaa — Numerology

A premium, interactive numerology website. Visitors enter their name and date of birth and receive a personal Pythagorean numerology reading — six core numbers, in-depth interpretations, an overall profile, Personal Year guidance and a downloadable PDF report.

Everything is calculated **in the visitor's browser**. There is no server, database, account system or paid API.

## Pages

| Page | Path | What it does |
| --- | --- | --- |
| Home | `/` | Introduction, quick reading form, overview of the numbers |
| Your Reading | `/calculator/` | The calculator and full results dashboard |
| Learn Numerology | `/understanding-numerology/` | Beginner's guide with live worked examples and FAQ |
| Number Meanings | `/meanings/`, `/meanings/1/` … `/meanings/33/` | One SEO page per number |
| About Dipikaa | `/about/` | Built entirely from `src/config/site.ts` |
| Contact | `/contact/` | Contact details, appointments, enquiry form |
| Privacy & disclaimer | `/privacy/` | How data is handled, nature of readings |

## The reading

- **Six core numbers:** Life Path, Expression (Destiny), Soul Urge (Heart's Desire), Personality, Birthday, Personal Year
- **Visuals:** circular number rings, a "number constellation" plotting the chart on the nine-point wheel, nine-year cycle track, month-by-month Personal Months, name letter breakdown and inclusion grid
- **Interpretations for each number:** what it represents, character, strengths, challenges, relationships, career, growth and a reflection question
- **Overall profile:** a deterministic synthesis (repeated numbers, master numbers, number families, inner vs outer self, karmic lessons)
- **Personal Year:** themes, opportunities, things to be mindful of, monthly guide, reflection points, a look ahead to the next year, and arrows to explore other years
- **Transparency:** every number has a "How it was calculated" panel showing the arithmetic
- **Report:** a multi-page PDF generated in the browser, plus a print stylesheet
- **Session memory:** recent readings are kept in `sessionStorage` (cleared when the tab closes; "Forget my details now" clears them at once)

## Before going live — personalise the site

All of Dipikaa's details live in **`src/config/site.ts`**. None of them were invented: every personal field starts empty.

1. Set `url` to the real domain (used for SEO, the sitemap and social cards).
2. Fill in `about` (intro, story, background, approach, an optional quote and portrait).
   - Put a portrait in `public/images/` and set `portrait: '/images/your-photo.jpg'`.
3. Fill in `consultations` (intro, offerings, optional booking link).
4. Fill in `contact` (email, other channels, location, hours).
   - With only an `email`, the enquiry form opens the visitor's email app with the message pre-filled.
   - To receive enquiries without the visitor's email app, set `formEndpoint` to a form service URL (e.g. a free Formspree or Web3Forms endpoint).
5. Set `showPlaceholders: false`. Any field still empty is then hidden instead of shown as a dashed "to be added" box.

`npm run build` prints a checklist of every field that is still empty.

The interpretation text is in `src/data/` (`numbers.ts`, `cycles.ts`, `positions.ts`). Edit it there and the website, results dashboard and PDF all update together.

## Calculation method

The engine is in `src/lib/numerology/` and every formula is documented in the code.

- **Letters:** the Pythagorean chart, A=1 … I=9, J=1 … R=9, S=1 … Z=8. Accents are removed; names must use Latin letters.
- **Reduction:** add digits until 1–9, **stopping at the master numbers 11, 22 and 33**.
- **Components first:** month, day and year, and each separate name, are reduced on their own before being added. This lets hidden master numbers appear.
- **Life Path:** reduce(month) + reduce(day) + reduce(year), then reduce. If adding every digit at once would give a different answer, the reading says so.
- **Birthday:** the day of birth, reduced (11, 22 and 29 → 11 stay master numbers).
- **Expression / Soul Urge / Personality:** all letters / vowels / consonants of the full birth name.
- **Y:** a consonant when it comes before a vowel (Maya, Priya), otherwise a vowel (Lynn, Vijay). Visitors can override this.
- **Personal Year:** reduce(birth month) + reduce(birth day) + reduce(calendar year), reduced to 1–9. A total that passes through 11 or 22 is shown as a master undertone. Years run January to December.

Verified examples (in `tests/numerology.test.ts`) include the widely published 18 November 1979 → Life Path 1 (11 + 9 + 8 = 28 → 10 → 1), master Life Paths 11, 22 and 33, "John Smith" (Expression 8, Soul Urge 6, Personality 11), Y handling, accents and date validation.

## Development

Requires Node 18.20+ (Node 20 or 22 recommended).

```bash
npm install
```

```bash
npm run dev       # local dev server at http://localhost:4321
```

```bash
npm test          # unit tests for the engine, interpretations and PDF
```

```bash
npm run build     # type-check + static build into dist/
```

```bash
npm run preview   # serve the production build locally
```

### Project structure

```
src/
  config/site.ts            ← Dipikaa's details (edit me)
  config/navigation.ts      ← menu items
  data/                     ← interpretation text (numbers, cycles, positions)
  lib/numerology/           ← calculation engine, validation, profile synthesis
  lib/report/pdf.ts         ← PDF report (loaded only when requested)
  lib/session.ts            ← privacy-friendly session memory
  islands/                  ← interactive Preact components (calculator, results)
  components/               ← static Astro components (header, footer, visuals)
  layouts/BaseLayout.astro  ← SEO tags, structured data, page shell
  pages/                    ← one file per page
  styles/global.css         ← design tokens and base styles
tests/                      ← Vitest tests
```

## Deployment

The build output in `dist/` is a fully static site, so it can be hosted for free on Netlify, Vercel, Cloudflare Pages or GitHub Pages.

- **Build command:** `npm run build`
- **Output directory:** `dist`

There are no environment variables to set.

## Disclaimer

Readings are based on traditional numerology and are offered for entertainment and self-reflection. They are not scientific predictions and are not a substitute for professional advice.
