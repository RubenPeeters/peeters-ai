export type Locale = 'en' | 'nl';

export const LOCALES: Locale[] = ['en', 'nl'];
export const DEFAULT_LOCALE: Locale = 'en';

type Strings = {
  siteName: string;
  tagline: string;
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

export const strings: Record<Locale, Strings> = {
  en: {
    siteName: 'Ruben Peeters',
    tagline:
      'PhD researcher in Belgium. I work at the seams between machine learning, knowledge graphs, and the messy data of the real world.',
    nav: {
      about: 'About',
      research: 'Research',
      projects: 'Projects',
      contact: 'Contact',
    },
    langSwitch: {
      label: 'Language',
      en: 'EN',
      nl: 'NL',
    },
    footer: {
      builtWith: 'Built with Astro.',
      source: 'Source on GitHub',
    },
  },
  nl: {
    siteName: 'Ruben Peeters',
    tagline:
      'Doctoraatsonderzoeker in België. Ik werk op de naden tussen machine learning, kennisgrafen en de rommelige data van de echte wereld.',
    nav: {
      about: 'Over mij',
      research: 'Onderzoek',
      projects: 'Projecten',
      contact: 'Contact',
    },
    langSwitch: {
      label: 'Taal',
      en: 'EN',
      nl: 'NL',
    },
    footer: {
      builtWith: 'Gemaakt met Astro.',
      source: 'Broncode op GitHub',
    },
  },
};

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
