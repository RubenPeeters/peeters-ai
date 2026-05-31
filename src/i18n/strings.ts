export type Locale = 'en' | 'nl';

export const LOCALES: Locale[] = ['en', 'nl'];
export const DEFAULT_LOCALE: Locale = 'en';

type TaglineParts = {
  pre: string;
  em: string;
  post: string;
};

type Strings = {
  siteName: string;
  eyebrow: string;
  tagline: string;
  taglineParts: TaglineParts;
  nav: {
    about: string;
    research: string;
    projects: string;
    contact: string;
  };
  langSwitch: {
    label: string;
    en: string;
    nl: string;
  };
  footer: {
    builtWith: string;
    source: string;
  };
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
  nav: { about: 'About', research: 'Research', projects: 'Projects', contact: 'Contact' },
  langSwitch: { label: 'Language', en: 'EN', nl: 'NL' },
  footer: { builtWith: 'Built with Astro.', source: 'Source on GitHub' },
};

const nl: Strings = {
  siteName: 'Ruben Peeters',
  eyebrow: 'Doctoraatsonderzoeker · KU Leuven',
  taglineParts: nlTagline,
  tagline: joinTagline(nlTagline),
  nav: { about: 'Over mij', research: 'Onderzoek', projects: 'Projecten', contact: 'Contact' },
  langSwitch: { label: 'Taal', en: 'EN', nl: 'NL' },
  footer: { builtWith: 'Gemaakt met Astro.', source: 'Broncode op GitHub' },
};

export const strings: Record<Locale, Strings> = { en, nl };

export function t(locale: Locale): Strings {
  return strings[locale];
}

export function pathFor(locale: Locale, path: string = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (locale === DEFAULT_LOCALE) {
    return clean ? `/${clean}` : '/';
  }
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
