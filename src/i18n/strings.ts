export type Locale = 'en' | 'nl';

export const LOCALES: Locale[] = ['en', 'nl'];
export const DEFAULT_LOCALE: Locale = 'en';

export type RouteKey = 'home' | 'about' | 'research' | 'projects' | 'contact';

type RouteDef = {
  paths: Record<Locale, string>;
  navLabel: Record<Locale, string>;
  published: boolean;
};

/*
  Single source of truth for routes and their per-locale slugs.
  Add a new section here once it ships; flip `published: true` to expose it in the nav.
*/
export const routes: Record<RouteKey, RouteDef> = {
  home: {
    paths: { en: '/', nl: '/nl/' },
    navLabel: { en: 'Home', nl: 'Home' },
    published: false,
  },
  about: {
    paths: { en: '/about', nl: '/nl/over-mij' },
    navLabel: { en: 'About', nl: 'Over mij' },
    published: true,
  },
  research: {
    paths: { en: '/research', nl: '/nl/onderzoek' },
    navLabel: { en: 'Research', nl: 'Onderzoek' },
    published: true,
  },
  projects: {
    paths: { en: '/projects', nl: '/nl/projecten' },
    navLabel: { en: 'Projects', nl: 'Projecten' },
    published: false,
  },
  contact: {
    paths: { en: '/contact', nl: '/nl/contact' },
    navLabel: { en: 'Contact', nl: 'Contact' },
    published: false,
  },
};

export function pathFor(routeKey: RouteKey, locale: Locale): string {
  return routes[routeKey].paths[locale];
}

export function publishedNavRoutes(): RouteKey[] {
  return (Object.keys(routes) as RouteKey[]).filter(
    (k) => k !== 'home' && routes[k].published,
  );
}

type TaglineParts = {
  pre: string;
  em: string;
  post: string;
};

type AboutCopy = {
  title: string;
  intro: string;
  currently: string;
  paragraphs: string[];
};

type ResearchCopy = {
  title: string;
  intro: string;
  themeLabels: Record<'cultural-heritage' | 'knowledge-graphs' | 'biomonitoring' | 'network-security', string>;
  statusLabels: Record<'published' | 'accepted' | 'preprint', string>;
  authors: string;
  readLink: { doi: string; pdf: string; scholar: string; url: string };
  scholarLink: string;
};

type Strings = {
  siteName: string;
  eyebrow: string;
  tagline: string;
  taglineParts: TaglineParts;
  langSwitch: {
    label: string;
    en: string;
    nl: string;
  };
  footer: {
    builtWith: string;
    source: string;
  };
  about: AboutCopy;
  research: ResearchCopy;
};

function joinTagline(parts: TaglineParts): string {
  return `${parts.pre}${parts.em}${parts.post}`;
}

const enTagline: TaglineParts = {
  pre: 'PhD researcher in Belgium. I work at the ',
  em: 'seams',
  post: ' between machine learning, knowledge graphs, and the messy data of the real world.',
};

const nlTagline: TaglineParts = {
  pre: 'Doctoraatsonderzoeker in België. Ik werk op de ',
  em: 'naden',
  post: ' tussen machine learning, kennisgrafen en de rommelige data van de echte wereld.',
};

const en: Strings = {
  siteName: 'Ruben Peeters',
  eyebrow: 'PhD candidate · KU Leuven',
  taglineParts: enTagline,
  tagline: joinTagline(enTagline),
  langSwitch: { label: 'Language', en: 'EN', nl: 'NL' },
  footer: { builtWith: 'Built with Astro.', source: 'Source on GitHub' },
  about: {
    title: 'About',
    intro:
      'I’m a PhD candidate at KU Leuven. My work sits at two intersections: making cultural-heritage collections searchable through multimodal knowledge graphs, and helping human-biomonitoring studies share data without losing meaning along the way.',
    currently: 'Currently — refining a multimodal knowledge base for cultural heritage and writing up the next paper.',
    paragraphs: [
      'I trained as an industrial engineer in information science before moving into research. The shift didn’t feel like a jump so much as a zoom-in: the same questions about how data flows through systems, asked at a different angle.',
      'Outside the PhD I build small things to learn from — sports analytics, chess engines, real-estate dashboards. The throughline is the same as the day job: take messy, real-world data and find a shape that lets you ask new questions of it.',
      'I’m always happy to talk to students looking for a thesis topic, collaborators on knowledge-graph or cultural-heritage work, and anyone with an interesting dataset and a question they can’t quite get to.',
    ],
  },
  research: {
    title: 'Research',
    intro:
      'Selected papers and talks. Most live at the intersection of knowledge graphs, multimodal machine learning, and cultural heritage; one thread runs through human biomonitoring data.',
    themeLabels: {
      'cultural-heritage': 'Cultural heritage',
      'knowledge-graphs': 'Knowledge graphs',
      biomonitoring: 'Biomonitoring',
      'network-security': 'Network security',
    },
    statusLabels: {
      published: 'Published',
      accepted: 'Accepted',
      preprint: 'Preprint',
    },
    authors: 'Authors',
    readLink: { doi: 'DOI', pdf: 'PDF', scholar: 'Scholar', url: 'Link' },
    scholarLink: 'Full list on Google Scholar',
  },
};

const nl: Strings = {
  siteName: 'Ruben Peeters',
  eyebrow: 'Doctoraatsonderzoeker · KU Leuven',
  taglineParts: nlTagline,
  tagline: joinTagline(nlTagline),
  langSwitch: { label: 'Taal', en: 'EN', nl: 'NL' },
  footer: { builtWith: 'Gemaakt met Astro.', source: 'Broncode op GitHub' },
  about: {
    title: 'Over mij',
    intro:
      'Ik ben doctoraatsonderzoeker aan KU Leuven. Mijn werk bevindt zich op twee snijvlakken: cultureel-erfgoedcollecties doorzoekbaar maken via multimodale kennisgrafen, en human-biomonitoring-studies helpen om data te delen zonder dat betekenis onderweg verloren gaat.',
    currently:
      'Op dit moment — verfijn ik een multimodale kennisbasis voor cultureel erfgoed en schrijf ik aan het volgende artikel.',
    paragraphs: [
      'Ik studeerde als industrieel ingenieur informatica voordat ik in onderzoek terechtkwam. De overstap voelde minder als een sprong dan als een inzoomen: dezelfde vragen over hoe data door systemen stroomt, vanuit een andere hoek.',
      'Naast het doctoraat bouw ik kleine projecten om bij te leren — sportanalytics, schaakengines, vastgoeddashboards. De rode draad is steeds dezelfde: rommelige, echte data nemen en er een vorm voor vinden waarmee je nieuwe vragen kunt stellen.',
      'Ik praat graag met studenten op zoek naar een thesisonderwerp, met mogelijke collaborators rond kennisgrafen of cultureel erfgoed, en met iedereen die een interessante dataset heeft en een vraag waar ze niet helemaal bij komen.',
    ],
  },
  research: {
    title: 'Onderzoek',
    intro:
      'Een selectie van papers en lezingen. Het meeste bevindt zich op het snijvlak van kennisgrafen, multimodale machine learning en cultureel erfgoed; één lijn loopt door human-biomonitoring-data.',
    themeLabels: {
      'cultural-heritage': 'Cultureel erfgoed',
      'knowledge-graphs': 'Kennisgrafen',
      biomonitoring: 'Biomonitoring',
      'network-security': 'Netwerkbeveiliging',
    },
    statusLabels: {
      published: 'Verschenen',
      accepted: 'Aanvaard',
      preprint: 'Preprint',
    },
    authors: 'Auteurs',
    readLink: { doi: 'DOI', pdf: 'PDF', scholar: 'Scholar', url: 'Link' },
    scholarLink: 'Volledige lijst op Google Scholar',
  },
};

export const strings: Record<Locale, Strings> = { en, nl };

export function t(locale: Locale): Strings {
  return strings[locale];
}
