/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to personalise the website.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything about Dipikaa herself (biography, background, contact details,
 *  consultation information) lives here so it can be changed without touching
 *  any page code.
 *
 *  IMPORTANT: none of Dipikaa's personal or professional details have been
 *  invented. Every field below that describes her is intentionally left as
 *  `null` (or an empty list) until she supplies the real information.
 *
 *  How empty fields behave:
 *   • While `showPlaceholders` is true, each empty field is shown on the page as
 *     a clearly-marked dashed "to be added" box, so it is obvious what is missing.
 *   • Set `showPlaceholders` to false before launch: empty fields are then simply
 *     hidden, and the pages still read naturally.
 *   • `npm run build` prints a list of every field that is still empty.
 */

export interface ContactChannel {
  /** e.g. "Email", "Phone", "WhatsApp", "Instagram" */
  label: string;
  /** Text shown to visitors, e.g. "hello@example.com" */
  value: string;
  /** Optional link, e.g. "mailto:hello@example.com", "tel:+91…", "https://wa.me/…" */
  href?: string;
}

export interface Offering {
  title: string;
  description: string;
  /** Optional, e.g. "60 minutes · online". Leave out if not applicable. */
  details?: string;
}

export interface SiteConfig {
  /** Public URL of the site (no trailing slash). Used for SEO, sitemap and social cards. */
  url: string;
  /** Brand name shown in the header, title tags and the PDF report. */
  name: string;
  /** Short tagline used in the header area and social previews. */
  tagline: string;
  /** Default meta description for search engines. */
  description: string;
  /** Show dashed placeholders for missing content (turn off before launch). */
  showPlaceholders: boolean;

  about: {
    /** Path to a portrait inside /public, e.g. "/images/dipikaa.jpg". null = elegant monogram. */
    portrait: string | null;
    portraitAlt: string;
    /** One-sentence introduction shown at the top of the About page and on the home page. */
    intro: string | null;
    /** Her story, one paragraph per entry. */
    story: string[];
    /** Training, qualifications, years of practice — only real, verifiable facts. */
    background: string[];
    /** How she approaches a reading, in her own words. */
    approach: string[];
    /** An optional personal quote. */
    quote: string | null;
  };

  consultations: {
    /** Short introduction to personal readings / appointments. */
    intro: string | null;
    /** Types of readings or services she offers. */
    offerings: Offering[];
    /** Booking link (Calendly, Google Calendar appointment page, etc.). */
    bookingUrl: string | null;
    bookingLabel: string;
  };

  contact: {
    /** Email address for enquiries. Also used for the "send by email" fallback of the form. */
    email: string | null;
    /** Other ways to reach her (phone, WhatsApp, Instagram …). */
    channels: ContactChannel[];
    /** City / region, or "Online worldwide", etc. */
    location: string | null;
    /** Availability / response time, e.g. "Mon–Sat, 10am–6pm IST". */
    hours: string | null;
    /**
     * Optional form endpoint that accepts a POST of form data and returns 2xx
     * (e.g. a free Formspree / Web3Forms / Netlify Forms endpoint).
     * If null, the enquiry form opens the visitor's email app with the message
     * pre-filled, addressed to `email`.
     */
    formEndpoint: string | null;
  };

  social: ContactChannel[];
}

export const site: SiteConfig = {
  url: 'https://dipikaa-numerology.example',
  name: 'Dipikaa',
  tagline: 'Numerology for self-reflection',
  description:
    'Discover your Life Path, Expression, Soul Urge, Personality, Birthday and Personal Year numbers with a free, private numerology calculator and a beautifully written personal reading.',
  showPlaceholders: true,

  about: {
    portrait: null,
    portraitAlt: 'Portrait of Dipikaa',
    intro: null,
    story: [],
    background: [],
    approach: [],
    quote: null,
  },

  consultations: {
    intro: null,
    offerings: [],
    bookingUrl: null,
    bookingLabel: 'Book a consultation',
  },

  contact: {
    email: null,
    channels: [],
    location: null,
    hours: null,
    formEndpoint: null,
  },

  social: [],
};

/** Lists every Dipikaa-specific field that is still empty (printed during the build). */
export function missingContent(config: SiteConfig = site): string[] {
  const missing: string[] = [];
  if (config.url.includes('.example')) missing.push('url (the real domain)');
  if (!config.about.intro) missing.push('about.intro');
  if (!config.about.story.length) missing.push('about.story');
  if (!config.about.background.length) missing.push('about.background');
  if (!config.about.approach.length) missing.push('about.approach');
  if (!config.about.portrait) missing.push('about.portrait (optional)');
  if (!config.consultations.intro) missing.push('consultations.intro');
  if (!config.consultations.offerings.length) missing.push('consultations.offerings');
  if (!config.consultations.bookingUrl) missing.push('consultations.bookingUrl (optional)');
  if (!config.contact.email) missing.push('contact.email');
  if (!config.contact.location) missing.push('contact.location (optional)');
  if (!config.contact.hours) missing.push('contact.hours (optional)');
  return missing;
}
