/**
 * The nine-year Personal Year cycle, Personal Months and karmic lessons.
 *
 * Traditional themes, written as gentle guidance for reflection. Nothing here
 * predicts specific events — each year simply carries a characteristic "tone".
 */

export interface PersonalYearMeaning {
  number: number;
  title: string;
  keywords: string[];
  overview: string;
  /** General themes for the year. */
  themes: string[];
  /** Areas that tend to flow well. */
  opportunities: string[];
  /** Things to be mindful of. */
  mindful: string[];
  /** Reflection points for the year. */
  reflections: string[];
  /** A short line used when previewing this year as "next year". */
  preview: string;
}

export const PERSONAL_YEARS: Record<number, PersonalYearMeaning> = {
  1: {
    number: 1,
    title: 'A Year of New Beginnings',
    keywords: ['Fresh start', 'Initiative', 'Independence'],
    overview:
      'A 1 Personal Year opens a brand-new nine-year cycle. Traditionally it is a time for planting seeds: starting projects, making decisions about direction and stepping forward with courage. What you begin now is said to set the tone for years to come.',
    themes: ['Starting something new', 'Clarifying what you want next', 'Building confidence and self-reliance'],
    opportunities: ['New projects, roles or ventures', 'Taking the lead', 'Fresh habits and a new outlook'],
    mindful: ['Impatience when results take time', 'Doing everything alone', 'Hesitating so long that the moment passes'],
    reflections: [
      'What do I want the next nine years to be about?',
      'Which first step have I been postponing?',
      'Where can I trust myself more?',
    ],
    preview: 'a fresh start and the opening of a new nine-year cycle',
  },
  2: {
    number: 2,
    title: 'A Year of Patience & Partnership',
    keywords: ['Cooperation', 'Patience', 'Relationships'],
    overview:
      'After the momentum of a 1 year, a 2 Personal Year slows the pace. The seeds have been planted and now need time below the surface. Traditionally this is a year for relationships, diplomacy and attention to detail — progress comes through cooperation rather than force.',
    themes: ['Partnerships and collaboration', 'Patience while things develop', 'Emotional awareness and sensitivity'],
    opportunities: ['Deepening close relationships', 'Teamwork and agreements', 'Refining plans and details'],
    mindful: ['Over-sensitivity', 'Impatience with slow progress', 'Losing your own voice to keep the peace'],
    reflections: [
      'Which relationships deserve more of my attention?',
      'Where can I practise patience instead of pushing?',
      'How can I ask for support?',
    ],
    preview: 'a gentler pace, with partnerships and patience in focus',
  },
  3: {
    number: 3,
    title: 'A Year of Expression & Joy',
    keywords: ['Creativity', 'Social life', 'Self-expression'],
    overview:
      'A 3 Personal Year is traditionally light, expressive and social. What took root in the past two years begins to show above ground. It is a favourable time for creativity, communication, friendships and enjoying life — and for sharing your voice more openly.',
    themes: ['Creative projects and self-expression', 'Friendship and social connection', 'Optimism and enjoyment'],
    opportunities: ['Writing, art, speaking or any creative outlet', 'Meeting new people', 'Celebrations and play'],
    mindful: ['Scattering energy across too many things', 'Overspending on fun', 'Avoiding deeper feelings'],
    reflections: [
      'What brings me genuine joy?',
      'What would I like to express or create this year?',
      'Who lifts my spirits — and how can I spend more time with them?',
    ],
    preview: 'creativity, social connection and a lighter, more expressive energy',
  },
  4: {
    number: 4,
    title: 'A Year of Foundations',
    keywords: ['Work', 'Discipline', 'Structure'],
    overview:
      'A 4 Personal Year is the year to build. Traditionally it asks for focus, organisation and steady effort, laying solid foundations for the future. It may feel more demanding than a 3 year, but the work done now tends to bring lasting security.',
    themes: ['Practical goals and hard work', 'Organising home, finances and health', 'Discipline and routine'],
    opportunities: ['Building skills and systems', 'Getting finances and paperwork in order', 'Healthy routines'],
    mindful: ['Overwork and fatigue', 'Rigidity', 'Frustration when progress feels slow'],
    reflections: [
      'What foundations do I want to strengthen?',
      'Which routines would truly support me?',
      'Where am I building on solid ground — and where on sand?',
    ],
    preview: 'focused work and the building of solid foundations',
  },
  5: {
    number: 5,
    title: 'A Year of Change & Freedom',
    keywords: ['Change', 'Adventure', 'Freedom'],
    overview:
      'A 5 Personal Year sits at the midpoint of the cycle and traditionally brings movement, variety and change. After the structure of the 4 year, life may open up: travel, new experiences and unexpected opportunities. Flexibility is your greatest ally.',
    themes: ['Change and new experiences', 'Freedom and personal growth', 'Adapting to the unexpected'],
    opportunities: ['Travel and exploration', 'Learning something new', 'Saying yes to opportunity'],
    mindful: ['Impulsive decisions', 'Restlessness', 'Overindulgence'],
    reflections: [
      'What change am I ready to welcome?',
      'Where do I feel restricted, and why?',
      'How can I stay grounded while life moves quickly?',
    ],
    preview: 'movement, variety and welcome change',
  },
  6: {
    number: 6,
    title: 'A Year of Love & Responsibility',
    keywords: ['Home', 'Family', 'Commitment'],
    overview:
      'A 6 Personal Year turns attention towards home, family, relationships and responsibility. Traditionally it is a year of nurturing — caring for others and being cared for — and of commitments that deepen bonds. Beauty and harmony in your surroundings matter more than usual.',
    themes: ['Home and family life', 'Commitment in relationships', 'Service and responsibility'],
    opportunities: ['Strengthening relationships', 'Improving your home', 'Supporting and teaching others'],
    mindful: ['Taking on too much for others', 'Perfectionism', 'Neglecting your own needs'],
    reflections: [
      'Who needs my care — and how do I care for myself?',
      'What would make my home feel more harmonious?',
      'Which commitments truly reflect my values?',
    ],
    preview: 'home, relationships and caring responsibilities',
  },
  7: {
    number: 7,
    title: 'A Year of Reflection',
    keywords: ['Introspection', 'Study', 'Inner growth'],
    overview:
      'A 7 Personal Year is traditionally quieter and more inward. It invites rest, reflection, study and spiritual growth. Rather than pushing outward for results, this is a year to understand yourself more deeply and trust your intuition.',
    themes: ['Self-reflection and inner work', 'Study, research and learning', 'Rest and renewal'],
    opportunities: ['Learning or specialising', 'Meditation, journaling and spiritual practice', 'Time alone to think clearly'],
    mindful: ['Isolation', 'Overthinking', 'Forcing outcomes that need time'],
    reflections: [
      'What is my intuition trying to tell me?',
      'What do I want to understand more deeply?',
      'Where do I need more stillness?',
    ],
    preview: 'a quieter, reflective year for inner growth and study',
  },
  8: {
    number: 8,
    title: 'A Year of Achievement',
    keywords: ['Ambition', 'Recognition', 'Abundance'],
    overview:
      'An 8 Personal Year is traditionally a year of harvest and personal power. The effort and understanding of earlier years may now be rewarded with progress, recognition or improved finances. It favours ambition, decisive action and stepping into authority — with integrity.',
    themes: ['Career and financial goals', 'Leadership and authority', 'Reaping what you have sown'],
    opportunities: ['Promotions, business growth or investments', 'Taking charge of goals', 'Recognition for your work'],
    mindful: ['Workaholism', 'Power struggles', 'Measuring worth only by results'],
    reflections: [
      'What does success genuinely mean to me?',
      'Where am I ready to claim my authority?',
      'How can I use what I gain for good?',
    ],
    preview: 'ambition, progress and the rewards of earlier effort',
  },
  9: {
    number: 9,
    title: 'A Year of Completion',
    keywords: ['Release', 'Compassion', 'Closure'],
    overview:
      'A 9 Personal Year closes the nine-year cycle. Traditionally it is a time to complete, release and let go of what no longer fits — clearing space for the new beginning that the next 1 year brings. Compassion, generosity and forgiveness are especially meaningful now.',
    themes: ['Endings and completion', 'Letting go and forgiveness', 'Generosity and service'],
    opportunities: ['Finishing projects', 'Decluttering — physically and emotionally', 'Helping others'],
    mindful: ['Clinging to what is ending', 'Starting major new ventures too soon', 'Emotional exhaustion'],
    reflections: [
      'What am I ready to release?',
      'What has the past nine years taught me?',
      'Who or what do I need to forgive — including myself?',
    ],
    preview: 'completion, release and preparing for a new cycle',
  },
};

/** One-line themes for the twelve Personal Months. */
export const PERSONAL_MONTHS: Record<number, { keyword: string; hint: string }> = {
  1: { keyword: 'Begin', hint: 'Start something and take initiative.' },
  2: { keyword: 'Cooperate', hint: 'Be patient and nurture relationships.' },
  3: { keyword: 'Express', hint: 'Create, socialise and share your ideas.' },
  4: { keyword: 'Build', hint: 'Focus, organise and work steadily.' },
  5: { keyword: 'Change', hint: 'Stay flexible and welcome the new.' },
  6: { keyword: 'Nurture', hint: 'Attend to home, family and care.' },
  7: { keyword: 'Reflect', hint: 'Slow down, rest and look inward.' },
  8: { keyword: 'Achieve', hint: 'Act decisively on goals and finances.' },
  9: { keyword: 'Release', hint: 'Complete, let go and clear space.' },
};

/**
 * Karmic lessons — digits missing from the letters of a name are traditionally
 * read as qualities to develop consciously during this lifetime.
 */
export const KARMIC_LESSONS: Record<number, string> = {
  1: 'Developing confidence, independence and the courage to stand up for yourself.',
  2: 'Learning patience, cooperation and sensitivity to others’ feelings.',
  3: 'Expressing yourself freely and trusting your creativity and voice.',
  4: 'Building discipline, order and steady, practical habits.',
  5: 'Embracing change, adaptability and healthy freedom.',
  6: 'Accepting responsibility and nurturing close relationships.',
  7: 'Cultivating faith, introspection and trust in your inner wisdom.',
  8: 'Gaining confidence with money, authority and personal power.',
  9: 'Growing in compassion, tolerance and a wider perspective.',
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
