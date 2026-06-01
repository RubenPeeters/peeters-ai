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
    published: true,
  },
  contact: {
    paths: { en: '/contact', nl: '/nl/contact' },
    navLabel: { en: 'Contact', nl: 'Contact' },
    published: true,
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
  projects: ProjectsCopy;
  contact: ContactCopy;
};

type ProjectsCopy = {
  title: string;
  intro: string;
  labels: { repo: string; demo: string };
  more: string;
};

type ContactCopy = {
  title: string;
  intro: string;
  emailLabel: string;
  elsewhere: string;
  links: { github: string; scholar: string };
  students: {
    eyebrow: string;
    title: string;
    body: string;
  };
};

function joinTagline(parts: TaglineParts): string {
  return `${parts.pre}${parts.em}${parts.post}`;
}

const enTagline: TaglineParts = {
  pre: 'PhD researcher at KU Leuven. I work on knowledge graphs and multimodal ML, ',
  em: 'mostly',
  post: ' for cultural heritage.',
};

const nlTagline: TaglineParts = {
  pre: 'Doctoraatsonderzoeker aan KU Leuven. Ik werk op kennisgrafen en multimodale ML, ',
  em: 'vooral',
  post: ' voor cultureel erfgoed.',
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
      'I’m a PhD candidate at KU Leuven, working on knowledge graphs and multimodal ML for cultural heritage.',
    currently: 'Currently — building ArtKB and writing the next paper.',
    paragraphs: [
      'My work also reaches into data interoperability in human biomonitoring studies.',
      'I trained as an industrial engineer (information science) before moving into research.',
      'Outside the PhD I build small side projects in Python and TypeScript — sports analytics, chess, real-estate notebooks, the occasional web app.',
      'Happy to hear from students looking for a thesis topic, collaborators on knowledge-graph or cultural-heritage work, and anyone with an interesting dataset.',
    ],
  },
  research: {
    title: 'Research',
    intro:
      'Most of my research is on knowledge graphs and multimodal ML for cultural heritage, with some work on data interoperability in human biomonitoring.',
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
  projects: {
    title: 'Projects',
    intro:
      'Side projects — mostly excuses to try something new in Python and TypeScript.',
    labels: { repo: 'Repo', demo: 'Live' },
    more: 'More on GitHub',
  },
  contact: {
    title: 'Contact',
    intro:
      'Email is the fastest way to reach me — I usually reply within a day or two.',
    emailLabel: 'ruben@fampeeters.be',
    elsewhere: 'Elsewhere',
    links: { github: 'GitHub', scholar: 'Google Scholar' },
    students: {
      eyebrow: 'For students',
      title: 'Looking for a thesis topic?',
      body:
        'If you’re interested in knowledge graphs, multimodal ML, or cultural-heritage data, send a short email about what you’d like to work on and we’ll find a fit.',
    },
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
      'Ik ben doctoraatsonderzoeker aan KU Leuven en werk op kennisgrafen en multimodale ML voor cultureel erfgoed.',
    currently:
      'Op dit moment — bouw ik aan ArtKB en schrijf ik aan het volgende artikel.',
    paragraphs: [
      'Mijn werk raakt ook aan data-interoperabiliteit in human-biomonitoring-studies.',
      'Ik studeerde industrieel ingenieur (informatica) voordat ik in onderzoek terechtkwam.',
      'Naast het doctoraat bouw ik kleine bijprojecten in Python en TypeScript — sportanalytics, schaak, vastgoednotebooks, af en toe een webapp.',
      'Studenten op zoek naar een thesisonderwerp, mogelijke collaborators rond kennisgrafen of cultureel erfgoed, en iedereen met een interessante dataset — hoor ik graag van.',
    ],
  },
  research: {
    title: 'Onderzoek',
    intro:
      'Mijn onderzoek gaat vooral over kennisgrafen en multimodale ML voor cultureel erfgoed, met wat werk rond data-interoperabiliteit in human biomonitoring.',
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
  projects: {
    title: 'Projecten',
    intro:
      'Bijprojecten — vooral excuses om iets nieuws te proberen in Python en TypeScript.',
    labels: { repo: 'Repo', demo: 'Live' },
    more: 'Meer op GitHub',
  },
  contact: {
    title: 'Contact',
    intro:
      'Een e-mail is de snelste manier om me te bereiken — meestal antwoord ik binnen één à twee dagen.',
    emailLabel: 'ruben@fampeeters.be',
    elsewhere: 'Elders',
    links: { github: 'GitHub', scholar: 'Google Scholar' },
    students: {
      eyebrow: 'Voor studenten',
      title: 'Op zoek naar een thesisonderwerp?',
      body:
        'Heb je interesse in kennisgrafen, multimodale ML of data rond cultureel erfgoed? Stuur een korte mail met waar je aan zou willen werken, dan vinden we wel iets dat past.',
    },
  },
};

export const strings: Record<Locale, Strings> = { en, nl };

export function t(locale: Locale): Strings {
  return strings[locale];
}
