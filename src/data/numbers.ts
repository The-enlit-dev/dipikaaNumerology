/**
 * Traditional meanings of the numbers 1–9 and the master numbers 11, 22, 33.
 *
 * These interpretations summarise the qualities classically associated with
 * each number in Western (Pythagorean) numerology. They are written for
 * self-reflection and entertainment, in plain, encouraging language, and are
 * deliberately phrased as tendencies ("often", "may") rather than facts.
 *
 * `positions` explains how the same number reads in each part of a chart —
 * a 7 as a Life Path feels different from a 7 as a Soul Urge.
 *
 * To edit wording, change the text here: every page, the results dashboard and
 * the PDF report read from this one file.
 */

import type { CoreNumberKey } from '../lib/numerology/calculate';

export type PositionKey = Exclude<CoreNumberKey, 'personalYear'>;

export interface NumberMeaning {
  number: number;
  /** Short archetype name, e.g. "The Pioneer". */
  title: string;
  keywords: string[];
  /** What the number represents — one or two sentences. */
  essence: string;
  /** Personality characteristics traditionally associated with it. */
  traits: string;
  strengths: string[];
  challenges: string[];
  relationships: string;
  career: string;
  /** Fields and roles traditionally associated with the number. */
  careerPaths: string[];
  growth: string[];
  /** A question to sit with. */
  reflection: string;
  /** How the number reads in each core position. */
  positions: Record<PositionKey, string>;
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    title: 'The Pioneer',
    keywords: ['Independence', 'Initiative', 'Originality', 'Courage'],
    essence:
      'One is the number of beginnings — the first step, the spark, the single point from which everything else grows. It represents individuality and the will to create something of your own.',
    traits:
      'People strongly influenced by 1 are traditionally described as self-starters: decisive, original and happiest when they can lead rather than follow. There is often a quiet determination here, a wish to prove what you can do on your own terms.',
    strengths: [
      'Takes initiative without waiting for permission',
      'Original thinker with fresh ideas',
      'Courageous in the face of uncertainty',
      'Focused and determined once a goal is set',
    ],
    challenges: [
      'Impatience with slower people or processes',
      'Stubbornness, or difficulty asking for help',
      'Can come across as self-focused when under pressure',
      'Self-criticism when progress feels too slow',
    ],
    relationships:
      'In relationships, 1 tends to be loyal, protective and generous with encouragement — but also needs space and respect for its independence. The best partnerships for a 1 energy are ones where both people have their own goals and cheer each other on, rather than one person steering.',
    career:
      'One thrives where it can take ownership: starting things, setting direction, or working with a high degree of autonomy. Repetitive roles with little room for initiative can feel confining.',
    careerPaths: ['Entrepreneurship', 'Leadership and management', 'Invention and design', 'Freelance or independent work', 'Sport and competitive fields'],
    growth: [
      'Practise asking for input before deciding — leadership is stronger when it listens.',
      'Notice when independence turns into isolation, and let people in.',
      'Celebrate small wins instead of waiting for the finish line.',
    ],
    reflection: 'Where in my life am I waiting for permission that I could simply give myself?',
    positions: {
      lifePath:
        'As a Life Path, 1 suggests a journey about learning to stand on your own feet — developing confidence, self-reliance and the courage to go first. Life often seems to place you in situations where you must make your own decisions.',
      expression:
        'As your Expression number, 1 points to natural talents for leadership, invention and getting things started. You may express yourself most fully when you are trusted to take the lead.',
      soulUrge:
        'As your Soul Urge, 1 reveals an inner longing for independence and achievement — a deep wish to be your own person and to make a mark that is unmistakably yours.',
      personality:
        'As your Personality number, 1 colours the first impression you give: others may see you as confident, capable and self-assured, someone who knows where they are going.',
      birthday:
        'Born on a 1 day, you are said to carry a special gift for initiative — an ability to begin things and to stay determined when others hesitate.',
    },
  },

  2: {
    number: 2,
    title: 'The Peacemaker',
    keywords: ['Harmony', 'Partnership', 'Sensitivity', 'Diplomacy'],
    essence:
      'Two is the number of relationship — the moment one becomes two and learns to cooperate. It represents balance, receptivity and the quiet strength of bringing people together.',
    traits:
      'Two is traditionally gentle, perceptive and attuned to the moods of others. People with strong 2 energy often notice what others miss, prefer collaboration to competition, and have a gift for making others feel heard.',
    strengths: [
      'Deep empathy and emotional intelligence',
      'Talent for mediation and finding middle ground',
      'Patient, considerate and tactful',
      'Strong intuition about people',
    ],
    challenges: [
      'Over-sensitivity to criticism',
      'Putting others’ needs so far ahead that your own disappear',
      'Indecision, especially when someone may be disappointed',
      'Avoiding necessary conflict',
    ],
    relationships:
      'Relationships are where 2 shines. It is loving, attentive and devoted, and it values closeness and emotional honesty. The lesson is balance: a partnership works best when the 2 speaks up for its own needs as warmly as it supports others.',
    career:
      'Two does well in roles built on cooperation, care and attention to detail. It is often the steady, trusted presence that holds a team together, even if it does not seek the spotlight.',
    careerPaths: ['Counselling and coaching', 'Mediation and human resources', 'Teaching and caregiving', 'Music and the arts', 'Assistant, partner or support roles'],
    growth: [
      'Treat your own needs as part of the harmony you are trying to create.',
      'Practise saying “no” kindly — it is a form of honesty.',
      'Trust your intuition, then let yourself act on it.',
    ],
    reflection: 'Whose peace am I protecting — and is my own included?',
    positions: {
      lifePath:
        'As a Life Path, 2 suggests a journey of cooperation, patience and partnership. Your growth often comes through relationships, and through learning that gentleness is a real strength.',
      expression:
        'As your Expression number, 2 points to talents for diplomacy, listening and teamwork. You may bring out the best in others and create calm in tense situations.',
      soulUrge:
        'As your Soul Urge, 2 reveals a heart that longs for love, closeness and harmony — to feel truly connected and to live in peace with the people around you.',
      personality:
        'As your Personality number, 2 suggests others experience you as approachable, kind and easy to be with — someone they instinctively trust.',
      birthday:
        'Born on a 2 day, you are said to have a gift for sensing what others feel and for bringing people together.',
    },
  },

  3: {
    number: 3,
    title: 'The Communicator',
    keywords: ['Expression', 'Creativity', 'Joy', 'Imagination'],
    essence:
      'Three is the number of creative expression — two coming together to make something new. It represents communication, imagination and the joy of being fully alive.',
    traits:
      'Three is traditionally warm, witty and expressive. People with strong 3 energy often have a way with words, a lively imagination and an optimism that lifts the room. They need outlets for self-expression to feel like themselves.',
    strengths: [
      'Natural communicator — spoken, written or artistic',
      'Optimistic and encouraging',
      'Imaginative and quick to see possibilities',
      'Brings lightness and humour to others',
    ],
    challenges: [
      'Scattering energy across too many projects',
      'Hiding real feelings behind charm or humour',
      'Moods that swing with how appreciated you feel',
      'Self-doubt about whether your voice matters',
    ],
    relationships:
      'Three is affectionate, playful and sociable, and it brings fun and warmth to relationships. It values partners who enjoy conversation and who appreciate its ideas. Depth comes when the 3 lets others see the feelings beneath the sparkle.',
    career:
      'Three flourishes wherever communication and creativity matter. Work that silences its voice or offers no variety can drain it quickly.',
    careerPaths: ['Writing and media', 'Performing arts', 'Design and visual arts', 'Marketing and communications', 'Teaching and public speaking'],
    growth: [
      'Choose a few projects and see them through — focus amplifies talent.',
      'Share what you truly feel, not only what is entertaining.',
      'Create for its own sake, not just for applause.',
    ],
    reflection: 'What would I create if no one ever saw it?',
    positions: {
      lifePath:
        'As a Life Path, 3 suggests a journey of self-expression — learning to trust your voice, your creativity and your capacity for joy, and sharing them with the world.',
      expression:
        'As your Expression number, 3 points to natural gifts with words, art and ideas. You may inspire others simply by expressing what you see and feel.',
      soulUrge:
        'As your Soul Urge, 3 reveals an inner longing to create, to communicate and to enjoy life — to be seen and appreciated for who you really are.',
      personality:
        'As your Personality number, 3 suggests you come across as charming, lively and fun — someone people enjoy being around.',
      birthday:
        'Born on a 3 day, you are said to carry a gift for expression, imagination and lifting other people’s spirits.',
    },
  },

  4: {
    number: 4,
    title: 'The Builder',
    keywords: ['Stability', 'Discipline', 'Reliability', 'Structure'],
    essence:
      'Four is the number of foundations — the four corners of a square, the four seasons, the solid ground. It represents order, effort and the patience to build something that lasts.',
    traits:
      'Four is traditionally practical, dependable and hard-working. People with strong 4 energy prefer a plan to guesswork, honour their commitments and take quiet pride in work done properly.',
    strengths: [
      'Exceptionally reliable and trustworthy',
      'Organised, methodical and thorough',
      'Patient with long-term goals',
      'Grounded and realistic',
    ],
    challenges: [
      'Rigidity, or resistance to sudden change',
      'Working so hard that rest gets forgotten',
      'Being overly cautious with new ideas',
      'Frustration when others are less careful',
    ],
    relationships:
      'Four shows love through loyalty and action: being there, keeping promises, building a secure life together. It values honesty and consistency. Relationships deepen when the 4 also makes space for spontaneity and open emotional expression.',
    career:
      'Four excels where structure, accuracy and persistence are rewarded. It is often the person who turns an idea into a working system.',
    careerPaths: ['Engineering and architecture', 'Finance and accounting', 'Project management and operations', 'Skilled trades and craftsmanship', 'Law and administration'],
    growth: [
      'Build rest and play into the plan — they are part of what lasts.',
      'Experiment with one small change at a time to grow comfortable with the new.',
      'Remember that “good enough” is sometimes exactly right.',
    ],
    reflection: 'What am I building — and does it still reflect who I am becoming?',
    positions: {
      lifePath:
        'As a Life Path, 4 suggests a journey about building — stability, skill, security and a life with strong roots — through steady, patient effort.',
      expression:
        'As your Expression number, 4 points to talents for organisation, practical problem-solving and seeing tasks through to completion.',
      soulUrge:
        'As your Soul Urge, 4 reveals a deep wish for security, order and a sense that life rests on solid ground.',
      personality:
        'As your Personality number, 4 suggests others see you as dependable, sensible and steady — the person they call when something needs to be done right.',
      birthday:
        'Born on a 4 day, you are said to have a gift for discipline and for turning plans into something real.',
    },
  },

  5: {
    number: 5,
    title: 'The Adventurer',
    keywords: ['Freedom', 'Change', 'Curiosity', 'Versatility'],
    essence:
      'Five sits at the centre of the numbers 1 to 9 — the turning point, the crossroads. It represents freedom, movement and learning through experience and the senses.',
    traits:
      'Five is traditionally curious, adaptable and energetic. People with strong 5 energy love variety, travel and new ideas, and they tend to learn best by doing. Routine can feel like a cage.',
    strengths: [
      'Highly adaptable and resourceful',
      'Curious, open-minded and quick to learn',
      'Persuasive and engaging with people',
      'Brave about change and new experiences',
    ],
    challenges: [
      'Restlessness or difficulty committing',
      'Impulsiveness, especially when bored',
      'Overindulgence in pleasures or stimulation',
      'Leaving things unfinished when the novelty fades',
    ],
    relationships:
      'Five brings excitement, spontaneity and fun to relationships. It needs a partner who respects its need for freedom and who enjoys growing and exploring together. Trust grows when the 5 discovers that commitment can be a shared adventure rather than a limit.',
    career:
      'Five thrives in dynamic environments with variety, movement and people. Fixed routines and narrow roles can leave it feeling restless.',
    careerPaths: ['Travel and tourism', 'Sales and public relations', 'Journalism and media', 'Entrepreneurship', 'Events, hospitality and performance'],
    growth: [
      'Find freedom inside commitment — depth is its own adventure.',
      'Pause before big impulsive decisions; let excitement settle into clarity.',
      'Finish one meaningful thing before starting the next.',
    ],
    reflection: 'Am I moving towards something, or only away from something?',
    positions: {
      lifePath:
        'As a Life Path, 5 suggests a journey of freedom and experience — learning to embrace change, to use freedom wisely, and to grow through everything life offers.',
      expression:
        'As your Expression number, 5 points to versatility, quick thinking and a talent for connecting with all kinds of people.',
      soulUrge:
        'As your Soul Urge, 5 reveals a longing for freedom, adventure and variety — to experience as much of life as possible.',
      personality:
        'As your Personality number, 5 suggests you come across as lively, interesting and adventurous — someone with stories to tell.',
      birthday:
        'Born on a 5 day, you are said to have a gift for adaptability and for thriving when circumstances change.',
    },
  },

  6: {
    number: 6,
    title: 'The Nurturer',
    keywords: ['Love', 'Responsibility', 'Care', 'Harmony'],
    essence:
      'Six is the number of the heart and the home. It represents love, responsibility, beauty and the wish to care for others and make the world more harmonious.',
    traits:
      'Six is traditionally warm, responsible and protective. People with strong 6 energy are often the ones others lean on — generous with time and advice, with a strong sense of fairness and an eye for beauty.',
    strengths: [
      'Caring, loyal and generous',
      'Strong sense of responsibility',
      'Creates warmth, comfort and beauty',
      'Wise counsel for friends and family',
    ],
    challenges: [
      'Taking on other people’s burdens as your own',
      'Perfectionism about yourself or loved ones',
      'Giving advice or help that was not asked for',
      'Neglecting your own needs',
    ],
    relationships:
      'Six is devoted and nurturing, and family and close bonds are often central to its life. It loves deeply and gives generously. Relationships thrive when the 6 allows others to care for it too, and accepts people as they are rather than as they could be.',
    career:
      'Six is drawn to work that helps, heals, teaches or beautifies. It does its best work when it feels its effort genuinely improves someone’s life.',
    careerPaths: ['Healthcare and healing', 'Teaching and childcare', 'Counselling and social work', 'Interior, fashion and visual design', 'Hospitality and community work'],
    growth: [
      'Care for yourself with the same tenderness you give others.',
      'Offer support, then trust people to find their own way.',
      'Let imperfect things — and people — be loved as they are.',
    ],
    reflection: 'Who looks after me — and do I let them?',
    positions: {
      lifePath:
        'As a Life Path, 6 suggests a journey of love and responsibility — learning to care for others without losing yourself, and creating harmony wherever you go.',
      expression:
        'As your Expression number, 6 points to talents for nurturing, teaching, counselling and making spaces and people feel cared for.',
      soulUrge:
        'As your Soul Urge, 6 reveals a heart that longs for loving relationships, a harmonious home and the sense of being needed.',
      personality:
        'As your Personality number, 6 suggests others see you as warm, trustworthy and comforting — a natural source of support.',
      birthday:
        'Born on a 6 day, you are said to carry a gift for compassion, responsibility and bringing people a sense of home.',
    },
  },

  7: {
    number: 7,
    title: 'The Seeker',
    keywords: ['Wisdom', 'Introspection', 'Analysis', 'Spirituality'],
    essence:
      'Seven is the number of inner knowing — the seven days of reflection, the search beneath the surface. It represents wisdom, analysis and the quest for truth and meaning.',
    traits:
      'Seven is traditionally thoughtful, private and perceptive. People with strong 7 energy want to understand how things really work, often need solitude to recharge, and may be drawn to philosophy, science or spirituality.',
    strengths: [
      'Deep thinker with sharp analytical skills',
      'Strong intuition and inner wisdom',
      'Independent, discerning and principled',
      'Calm presence in a crisis',
    ],
    challenges: [
      'Withdrawing or seeming distant',
      'Over-analysing instead of trusting feelings',
      'Scepticism that makes it hard to trust others',
      'Perfectionism about knowledge — never feeling “ready”',
    ],
    relationships:
      'Seven loves deeply but selectively. It values meaningful conversation, honesty and a partner who respects its need for quiet. Closeness grows as the 7 learns to share its inner world, trusting that it will be understood.',
    career:
      'Seven excels where depth, research and expertise are valued. It often prefers mastering a subject to managing people.',
    careerPaths: ['Research and science', 'Technology and data', 'Philosophy, writing and academia', 'Spiritual or holistic practice', 'Investigation and analysis'],
    growth: [
      'Balance solitude with connection — share what you discover.',
      'Let intuition and intellect work together, not in competition.',
      'Trust that you know enough to begin.',
    ],
    reflection: 'What do I already know deep down that I have not yet allowed myself to trust?',
    positions: {
      lifePath:
        'As a Life Path, 7 suggests a journey of seeking — towards knowledge, self-understanding and faith in something deeper than the surface of life.',
      expression:
        'As your Expression number, 7 points to talents for research, analysis and insight. You may see patterns and truths that others overlook.',
      soulUrge:
        'As your Soul Urge, 7 reveals an inner longing for understanding, peace and time to reflect — to find answers that feel genuinely true.',
      personality:
        'As your Personality number, 7 suggests you come across as composed, intelligent and a little mysterious — someone with hidden depths.',
      birthday:
        'Born on a 7 day, you are said to carry a gift for insight, intuition and getting to the heart of things.',
    },
  },

  8: {
    number: 8,
    title: 'The Achiever',
    keywords: ['Ambition', 'Authority', 'Abundance', 'Mastery'],
    essence:
      'Eight is the number of power and balance — its shape echoes infinity and the flow between the material and the spiritual. It represents achievement, leadership and mastery of the practical world.',
    traits:
      'Eight is traditionally ambitious, capable and confident. People with strong 8 energy tend to think big, organise well and are not afraid of responsibility or authority.',
    strengths: [
      'Strategic, efficient and goal-oriented',
      'Natural authority and good judgement',
      'Resilient after setbacks',
      'Skilled with resources, money and organisation',
    ],
    challenges: [
      'Measuring worth through success or status',
      'Workaholism, or difficulty switching off',
      'Being controlling under stress',
      'Impatience with inefficiency',
    ],
    relationships:
      'Eight is protective, generous and loyal, and it often shows love by providing and planning for the future. It respects strong, capable partners. Relationships deepen when the 8 leaves work at the door and shares softness as well as strength.',
    career:
      'Eight is suited to positions of responsibility where it can build, lead and see measurable results.',
    careerPaths: ['Business and executive leadership', 'Finance and investment', 'Law and governance', 'Real estate and development', 'Running an organisation'],
    growth: [
      'Define success in terms of meaning, not only results.',
      'Use influence generously — lift others as you rise.',
      'Rest is productive: schedule it like an important meeting.',
    ],
    reflection: 'If I already had enough, what would I choose to do with my power?',
    positions: {
      lifePath:
        'As a Life Path, 8 suggests a journey of achievement and balance — learning to handle authority, resources and success wisely and with integrity.',
      expression:
        'As your Expression number, 8 points to talents for leadership, management and making ambitious plans real.',
      soulUrge:
        'As your Soul Urge, 8 reveals an inner drive to achieve, to be recognised and to create lasting security and abundance.',
      personality:
        'As your Personality number, 8 suggests you come across as strong, competent and successful — someone others take seriously.',
      birthday:
        'Born on an 8 day, you are said to have a gift for organisation, judgement and handling responsibility.',
    },
  },

  9: {
    number: 9,
    title: 'The Humanitarian',
    keywords: ['Compassion', 'Idealism', 'Wisdom', 'Completion'],
    essence:
      'Nine is the last of the single digits and holds a little of every number before it. It represents completion, compassion and a wide, generous view of humanity.',
    traits:
      'Nine is traditionally idealistic, warm-hearted and broad-minded. People with strong 9 energy often care about the bigger picture — fairness, beauty, the wellbeing of others — and may feel like an “old soul”.',
    strengths: [
      'Compassionate and generous',
      'Wise, tolerant and open-minded',
      'Creative and artistic sensibility',
      'Inspires others with vision and idealism',
    ],
    challenges: [
      'Difficulty letting go of the past',
      'Giving until depleted',
      'Disappointment when people fall short of ideals',
      'Keeping personal feelings at a distance',
    ],
    relationships:
      'Nine loves generously and accepts others easily, though it may share its own needs less readily. It values partners with heart and principles. Relationships flourish when the 9 lets someone care for it personally, not only the world.',
    career:
      'Nine thrives in work with a larger purpose — helping, teaching, creating or serving a cause it believes in.',
    careerPaths: ['Non-profit and humanitarian work', 'The arts', 'Healing and counselling', 'Teaching and education', 'Law, diplomacy and advocacy'],
    growth: [
      'Practise graceful endings — letting go makes room for what is next.',
      'Give from fullness, not from emptiness.',
      'Let your own needs be part of your compassion.',
    ],
    reflection: 'What am I ready to release so that something new can begin?',
    positions: {
      lifePath:
        'As a Life Path, 9 suggests a journey of compassion and completion — learning to serve something larger than yourself and to let go with grace.',
      expression:
        'As your Expression number, 9 points to talents for inspiring, healing and creating — often with a message that reaches many people.',
      soulUrge:
        'As your Soul Urge, 9 reveals a longing to make a difference and to see a kinder, fairer world.',
      personality:
        'As your Personality number, 9 suggests you come across as gracious, generous and wise — someone with a big heart.',
      birthday:
        'Born on a 9 day, you are said to carry a gift for compassion, understanding and seeing the bigger picture.',
    },
  },

  11: {
    number: 11,
    title: 'The Illuminator',
    keywords: ['Intuition', 'Inspiration', 'Insight', 'Sensitivity'],
    essence:
      'Eleven is the first master number — a doubled 1 that reduces to 2. It represents heightened intuition, spiritual insight and the ability to inspire others, carried with the sensitivity of the 2.',
    traits:
      'Eleven is traditionally described as highly intuitive, idealistic and inspired, with an inner voice that can be remarkably accurate. People with strong 11 energy often feel things intensely and may sense that they are here to inspire or illuminate.',
    strengths: [
      'Powerful intuition and perception',
      'Inspires others through ideas and example',
      'Visionary, creative and idealistic',
      'Deep empathy and spiritual awareness',
    ],
    challenges: [
      'Nervous tension and emotional overwhelm',
      'Self-doubt about living up to high ideals',
      'Impracticality when inspiration outruns planning',
      'Sensitivity to harsh environments',
    ],
    relationships:
      'Eleven seeks soul-deep connection and is extremely attuned to partners. It needs gentleness, understanding and a calm, grounded home. Balance comes from meeting its own sensitivity with patience and self-care.',
    career:
      'Eleven is drawn to work that inspires, guides or uplifts — often using its intuition directly.',
    careerPaths: ['Counselling and spiritual guidance', 'Teaching and inspirational speaking', 'Creative and visionary arts', 'Healing professions', 'Invention and innovation'],
    growth: [
      'Ground inspiration with simple daily routines.',
      'Trust your intuition while staying kind to your doubts.',
      'Protect your energy — rest and quiet are essential, not optional.',
    ],
    reflection: 'When I trust my inner voice completely, what does it tell me?',
    positions: {
      lifePath:
        'As a Life Path, 11 suggests a journey of illumination — learning to trust your intuition and to share your insight in ways that inspire others. Traditionally, master Life Paths are said to grow into their full potential with maturity, often working through the gentler lessons of 2 first.',
      expression:
        'As your Expression number, 11 points to gifts of inspiration, intuition and vision — an ability to light the way for others.',
      soulUrge:
        'As your Soul Urge, 11 reveals a longing for spiritual meaning and for using your sensitivity to uplift the world around you.',
      personality:
        'As your Personality number, 11 suggests you come across as inspiring, refined and a little otherworldly — people may sense something special in your presence.',
      birthday:
        'Born on the 11th or 29th, you are said to carry a gift for intuition and inspiration — the master number 11.',
    },
  },

  22: {
    number: 22,
    title: 'The Master Builder',
    keywords: ['Vision', 'Achievement', 'Practical idealism', 'Legacy'],
    essence:
      'Twenty-two is often called the most powerful of the master numbers — a doubled 2 that reduces to 4. It represents the rare combination of great vision and the practical ability to build it in the real world.',
    traits:
      'Twenty-two is traditionally described as ambitious in the best sense: able to dream on a large scale while remaining disciplined and grounded. People with strong 22 energy may feel drawn to create something that lasts beyond themselves.',
    strengths: [
      'Turns big visions into practical plans',
      'Exceptional organisational ability',
      'Disciplined, capable and steady',
      'Thinks in terms of legacy and long-term impact',
    ],
    challenges: [
      'Pressure from very high expectations',
      'Feeling overwhelmed by the size of a vision',
      'Becoming controlling or overworked',
      'Doubting whether the dream is achievable',
    ],
    relationships:
      'Twenty-two is loyal, supportive and dependable, and it often builds a stable life for those it loves. It needs a partner who understands its purpose and helps it slow down and enjoy the present.',
    career:
      'Twenty-two thrives on large, meaningful projects — work that serves many people or creates lasting structures.',
    careerPaths: ['Architecture and engineering', 'Leading organisations or institutions', 'International business', 'Public service and policy', 'Large-scale social or environmental projects'],
    growth: [
      'Break great visions into calm, achievable steps.',
      'Share leadership — you do not have to build alone.',
      'Remember that the people around you are part of the legacy.',
    ],
    reflection: 'What would I build if I believed it could truly last?',
    positions: {
      lifePath:
        'As a Life Path, 22 suggests a journey of building something significant — combining vision with practical mastery. Traditionally, its full potential unfolds with time, often after working through the steady lessons of 4.',
      expression:
        'As your Expression number, 22 points to rare talents for organisation and large-scale achievement — making ideals concrete.',
      soulUrge:
        'As your Soul Urge, 22 reveals a deep wish to create something of lasting value that benefits many people.',
      personality:
        'As your Personality number, 22 suggests you come across as capable, composed and powerful — someone who can be trusted with big things.',
      birthday:
        'Born on the 22nd, you are said to carry the master number 22 — a gift for turning big ideas into practical reality.',
    },
  },

  33: {
    number: 33,
    title: 'The Master Teacher',
    keywords: ['Compassion', 'Healing', 'Guidance', 'Selfless love'],
    essence:
      'Thirty-three is the rarest master number — 11 and 22 combined, reducing to 6. It represents compassionate guidance, healing and a love that seeks to uplift others.',
    traits:
      'Thirty-three is traditionally described as deeply caring, wise and devoted to the wellbeing of others. People with strong 33 energy may feel called to teach, heal or nurture on a wide scale, often leading through kindness rather than authority.',
    strengths: [
      'Profound compassion and patience',
      'Natural teacher, healer and guide',
      'Creative and emotionally wise',
      'Uplifts others through encouragement',
    ],
    challenges: [
      'Self-sacrifice to the point of exhaustion',
      'Carrying the emotional weight of others',
      'Perfectionism and very high standards',
      'Difficulty setting boundaries',
    ],
    relationships:
      'Thirty-three loves unconditionally and is deeply devoted to family and friends. It needs relationships where care flows both ways, and partners who help it remember its own needs.',
    career:
      'Thirty-three is drawn to vocations of teaching, healing and service, as well as creative work that carries a meaningful message.',
    careerPaths: ['Teaching and mentoring', 'Healing and therapeutic work', 'Counselling and pastoral care', 'Arts with a social message', 'Community and humanitarian leadership'],
    growth: [
      'Practise boundaries as an act of love, not rejection.',
      'Let your own healing come first — it strengthens what you give.',
      'Release the need to be perfect in order to be helpful.',
    ],
    reflection: 'What would it look like to receive the same care I offer others?',
    positions: {
      lifePath:
        'As a Life Path, 33 suggests a journey of compassionate service — learning to guide and heal others while caring for yourself. It is traditionally considered the rarest Life Path, often expressed through the nurturing lessons of 6 first.',
      expression:
        'As your Expression number, 33 points to gifts for teaching, healing and inspiring others through love and example.',
      soulUrge:
        'As your Soul Urge, 33 reveals a heart that longs to ease suffering and bring comfort and wisdom to others.',
      personality:
        'As your Personality number, 33 suggests you come across as gentle, wise and deeply caring — a source of comfort.',
      birthday:
        'The Birthday number cannot be 33, as no month has a 33rd day.',
    },
  },
};

export const ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

export function meaningFor(n: number): NumberMeaning {
  const meaning = NUMBER_MEANINGS[n];
  if (!meaning) throw new Error(`No meaning defined for number ${n}`);
  return meaning;
}
