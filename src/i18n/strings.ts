export type Locale = 'en' | 'nl';

export const LOCALES: Locale[] = ['en', 'nl'];
export const DEFAULT_LOCALE: Locale = 'en';

export type RouteKey = 'home' | 'about' | 'research' | 'projects' | 'blog' | 'cv' | 'contact';

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
    paths: { en: '/', nl: '/nl' },
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
  blog: {
    paths: { en: '/blog', nl: '/nl/blog' },
    navLabel: { en: 'Blog', nl: 'Blog' },
    published: true,
  },
  cv: {
    paths: { en: '/cv', nl: '/nl/cv' },
    navLabel: { en: 'CV', nl: 'CV' },
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

type TimelineEntry = {
  period: string;
  title: string;
  subtitle: string;
  note?: string;
};

type SkillGroup = {
  category: string;
  items: string;
};

type AboutCopy = {
  title: string;
  intro: string;
  currently: string;
  paragraphs: string[];
  educationHeading: string;
  education: TimelineEntry[];
  backgroundHeading: string;
  backgroundParagraphs: string[];
  philosophyHeading: string;
  philosophyParagraph: string;
  interestsHeading: string;
  interests: string[];
  skillsHeading: string;
  skills: SkillGroup[];
};

type Theme = 'cultural-heritage' | 'knowledge-graphs' | 'biomonitoring' | 'network-security';

type ResearchCopy = {
  title: string;
  intro: string;
  themesHeading: string;
  themeLabels: Record<Theme, string>;
  themeDescriptions: Record<Theme, string>;
  featuredHeading: string;
  statusLabels: Record<'published' | 'accepted' | 'preprint', string>;
  authors: string;
  readLink: { doi: string; pdf: string; scholar: string; url: string };
  citeButton: string;
  copiedLabel: string;
  citeBibtex: string;
  citeApa: string;
  citeRis: string;
  scholarLink: string;
};

type GraphCopy = {
  centerName: string;
  ariaLabel: string;
  listFallbackHeading: string;
  eyebrow: string;
  intro: string;
  hint: string;
  loading: string;
  loadError: string;
  dataLink: string;
  fallbackIntro: string;
  controls: {
    zoomIn: string;
    zoomOut: string;
    reset: string;
  };
  categories: Record<string, string>;
};

type BlogCopy = {
  title: string;
  intro: string;
  readMore: string;
  publishedOn: string;
  updatedOn: string;
  tagLabel: string;
  noPosts: string;
  backToIndex: string;
};

type CVCopy = {
  title: string;
  intro: string;
  downloadLabel: string;
  educationHeading: string;
  experienceHeading: string;
  experience: TimelineEntry[];
  skillsHeading: string;
  publicationsHeading: string;
  languagesHeading: string;
  languages: string[];
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
  graph: GraphCopy;
  about: AboutCopy;
  research: ResearchCopy;
  projects: ProjectsCopy;
  blog: BlogCopy;
  cv: CVCopy;
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
  collaborationHeading: string;
  collaborationBody: string;
  elsewhere: string;
  links: { github: string; scholar: string; linkedin: string; orcid: string };
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
  graph: {
    centerName: 'Ruben Peeters',
    ariaLabel: "Ruben Peeters' interactive personal knowledge graph.",
    listFallbackHeading: 'Explore the site',
    eyebrow: 'Knowledge graph · portfolio',
    intro:
      'Research, software, and side projects are connected here as one explorable knowledge graph.',
    hint: 'Drag nodes, scroll to zoom, or select a highlighted section.',
    loading: 'Building the graph from RDF…',
    loadError: 'The graph could not be loaded. Use the section links instead.',
    dataLink: 'View the RDF data',
    fallbackIntro: 'The graph becomes a direct list on smaller screens.',
    controls: {
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      reset: 'Reset view',
    },
    categories: {
      person: 'Person',
      organization: 'Organization',
      role: 'Role',
      skill: 'Skill',
      technology: 'Technology',
      topic: 'Research theme',
      project: 'Research project',
      'side-project': 'Side project',
      publication: 'Publication',
      value: 'Value',
      section: 'Site section',
    },
  },
  about: {
    title: 'About',
    intro:
      'I\'m a PhD candidate at KU Leuven, working on knowledge graphs and multimodal ML for cultural heritage.',
    currently: 'Currently — building ArtKB and writing the next paper.',
    paragraphs: [
      'My work sits at the intersection of knowledge representation and machine learning — building systems that make heterogeneous data more findable, interoperable, and reusable.',
      'Before the PhD, I spent two years as a research software engineer at VITO, working on data interoperability for environmental health studies. That experience shaped how I think about real-world data problems.',
    ],
    educationHeading: 'Education',
    education: [
      {
        period: '2024 – present',
        title: 'PhD Researcher',
        subtitle: 'KU Leuven',
        note: 'Knowledge graphs and multimodal ML for cultural heritage',
      },
      {
        period: '2020 – 2022',
        title: 'MSc Industrial Engineering — Information Science',
        subtitle: 'Ghent University (UGent)',
      },
      {
        period: '2016 – 2020',
        title: 'BSc Industrial Engineering — Information Science',
        subtitle: 'Ghent University (UGent)',
      },
    ],
    backgroundHeading: 'Background',
    backgroundParagraphs: [
      'I studied industrial engineering with a focus on information science at Ghent University, where I first got interested in how structured data can bridge different systems and domains.',
      'After graduating, I joined VITO as a research software engineer, building tools for data harmonisation in human biomonitoring studies across European research consortia. That work taught me that the gap between data and usable knowledge is where the hardest and most impactful problems live.',
      'In May 2024, I started a PhD at KU Leuven to focus on that gap full-time — specifically at the intersection of knowledge graphs, multimodal machine learning, and cultural heritage.',
    ],
    philosophyHeading: 'What drives the work',
    philosophyParagraph:
      'I believe that structured, open knowledge is the prerequisite for AI that is genuinely useful in complex domains. Models need context, not just data — and knowledge graphs are how you give them that context. My goal is to build systems where domain expertise and machine intelligence reinforce each other.',
    interestsHeading: 'Outside the lab',
    interests: [
      'Chess — mostly online, occasionally over the board',
      'Sports — both playing and overanalysing the data',
      'Gaming — from strategy to story-driven',
    ],
    skillsHeading: 'Tools & technologies',
    skills: [
      { category: 'Languages', items: 'Python, TypeScript, Java, SPARQL' },
      { category: 'Semantic Web', items: 'RDF, OWL, SHACL, Linked Data, Comunica' },
      { category: 'ML & Data', items: 'PyTorch, Hugging Face, pandas, Jupyter' },
      { category: 'Web', items: 'Astro, D3.js, Node.js' },
    ],
  },
  research: {
    title: 'Research',
    intro:
      'Most of my research is on knowledge graphs and multimodal ML for cultural heritage, with some work on data interoperability in human biomonitoring.',
    themesHeading: 'Research themes',
    themeLabels: {
      'cultural-heritage': 'Cultural heritage',
      'knowledge-graphs': 'Knowledge graphs',
      biomonitoring: 'Biomonitoring',
      'network-security': 'Network security',
    },
    themeDescriptions: {
      'cultural-heritage':
        'Heritage institutions hold vast collections of digitised objects — paintings, manuscripts, archaeological finds — that are rich in meaning but often poorly connected. I work on making that cultural knowledge more discoverable and reusable, using knowledge graphs to link objects across collections and multimodal ML to bridge the gap between visual content and structured metadata.',
      'knowledge-graphs':
        'Knowledge graphs provide a principled way to represent, integrate, and query heterogeneous knowledge. My work focuses on building and using KGs that combine domain expertise with data-driven methods — from ontology design and linked data publishing to knowledge-enhanced retrieval and recommendation.',
      biomonitoring:
        'Human biomonitoring studies generate complex datasets across multiple European research consortia. During my time at VITO, I worked on improving the interoperability of these datasets — harmonising variables, aligning vocabularies, and building tools that let researchers query across study boundaries.',
      'network-security':
        'My master\'s thesis explored deep reinforcement learning for network intrusion detection. While my focus has since shifted, this work gave me a solid grounding in applied ML and a lasting interest in how intelligent agents can operate in adversarial environments.',
    },
    featuredHeading: 'Highlights',
    statusLabels: {
      published: 'Published',
      accepted: 'Accepted',
      preprint: 'Preprint',
    },
    authors: 'Authors',
    readLink: { doi: 'DOI', pdf: 'PDF', scholar: 'Scholar', url: 'Link' },
    citeButton: 'Cite',
    copiedLabel: 'Copied!',
    citeBibtex: 'BibTeX',
    citeApa: 'APA',
    citeRis: 'RIS',
    scholarLink: 'Full list on Google Scholar',
  },
  projects: {
    title: 'Projects',
    intro:
      'Side projects — mostly excuses to try something new in Python and TypeScript.',
    labels: { repo: 'Repo', demo: 'Live' },
    more: 'More on GitHub',
  },
  blog: {
    title: 'Blog',
    intro: 'Occasional writing on research, tools, and things I find interesting.',
    readMore: 'Read more',
    publishedOn: 'Published',
    updatedOn: 'Updated',
    tagLabel: 'Tags',
    noPosts: 'No posts yet — check back soon.',
    backToIndex: 'All posts',
  },
  cv: {
    title: 'CV',
    intro: 'Education, experience, and skills at a glance.',
    downloadLabel: 'Print / save as PDF',
    educationHeading: 'Education',
    experienceHeading: 'Experience',
    experience: [
      {
        period: '2024 – present',
        title: 'PhD Researcher',
        subtitle: 'KU Leuven',
        note: 'Knowledge graphs and multimodal ML for cultural heritage',
      },
      {
        period: '2022 – 2024',
        title: 'Research Software Engineer',
        subtitle: 'VITO',
        note: 'Data interoperability for human biomonitoring studies',
      },
    ],
    skillsHeading: 'Skills',
    publicationsHeading: 'Selected publications',
    languagesHeading: 'Languages',
    languages: ['Dutch (native)', 'English (fluent)', 'French'],
  },
  contact: {
    title: 'Contact',
    intro:
      'Email is the fastest way to reach me — I usually reply within a day or two.',
    emailLabel: 'ruben@fampeeters.be',
    collaborationHeading: 'Open to collaboration',
    collaborationBody:
      'I\'m always interested in hearing from people working on knowledge graphs, cultural heritage, or data interoperability. Whether it\'s a research partnership, an open-source project, or a consulting question — feel free to reach out.',
    elsewhere: 'Elsewhere',
    links: { github: 'GitHub', scholar: 'Google Scholar', linkedin: 'LinkedIn', orcid: 'ORCID' },
    students: {
      eyebrow: 'For students',
      title: 'Looking for a thesis topic?',
      body:
        'If you\'re interested in knowledge graphs, multimodal ML, or cultural-heritage data, send a short email about what you\'d like to work on and we\'ll find a fit.',
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
  graph: {
    centerName: 'Ruben Peeters',
    ariaLabel: 'De interactieve persoonlijke kennisgraaf van Ruben Peeters.',
    listFallbackHeading: 'Verken de site',
    eyebrow: 'Kennisgraaf · portfolio',
    intro:
      'Onderzoek, software en bijprojecten komen hier samen in één verkenbare kennisgraaf.',
    hint: 'Sleep knopen, scroll om te zoomen of kies een uitgelichte sectie.',
    loading: 'De graaf wordt opgebouwd uit RDF…',
    loadError: 'De graaf kon niet worden geladen. Gebruik de sectielinks.',
    dataLink: 'Bekijk de RDF-data',
    fallbackIntro: 'Op kleinere schermen wordt de graaf een rechtstreekse lijst.',
    controls: {
      zoomIn: 'Inzoomen',
      zoomOut: 'Uitzoomen',
      reset: 'Weergave herstellen',
    },
    categories: {
      person: 'Persoon',
      organization: 'Organisatie',
      role: 'Rol',
      skill: 'Vaardigheid',
      technology: 'Technologie',
      topic: 'Onderzoeksthema',
      project: 'Onderzoeksproject',
      'side-project': 'Bijproject',
      publication: 'Publicatie',
      value: 'Waarde',
      section: 'Sitesectie',
    },
  },
  about: {
    title: 'Over mij',
    intro:
      'Ik ben doctoraatsonderzoeker aan KU Leuven en werk op kennisgrafen en multimodale ML voor cultureel erfgoed.',
    currently:
      'Op dit moment — bouw ik aan ArtKB en schrijf ik aan het volgende artikel.',
    paragraphs: [
      'Mijn werk bevindt zich op het kruispunt van kennisrepresentatie en machine learning — systemen bouwen die heterogene data vindbaarder, interoperabeler en herbruikbaarder maken.',
      'Voor het doctoraat werkte ik twee jaar als research software engineer bij VITO, rond data-interoperabiliteit voor milieugezondheidsonderzoek. Die ervaring heeft mijn kijk op echte dataproblemen gevormd.',
    ],
    educationHeading: 'Opleiding',
    education: [
      {
        period: '2024 – heden',
        title: 'Doctoraatsonderzoeker',
        subtitle: 'KU Leuven',
        note: 'Kennisgrafen en multimodale ML voor cultureel erfgoed',
      },
      {
        period: '2020 – 2022',
        title: 'MSc Industrieel Ingenieur — Informatica',
        subtitle: 'Universiteit Gent (UGent)',
      },
      {
        period: '2016 – 2020',
        title: 'BSc Industrieel Ingenieur — Informatica',
        subtitle: 'Universiteit Gent (UGent)',
      },
    ],
    backgroundHeading: 'Achtergrond',
    backgroundParagraphs: [
      'Ik studeerde industrieel ingenieur met focus op informatica aan de Universiteit Gent, waar ik voor het eerst interesse kreeg in hoe gestructureerde data verschillende systemen en domeinen kan verbinden.',
      'Na mijn studies ging ik aan de slag bij VITO als research software engineer, waar ik tools bouwde voor dataharmonisatie in human-biomonitoring-studies over Europese onderzoeksconsortia heen. Dat werk leerde me dat de kloof tussen data en bruikbare kennis de plek is waar de moeilijkste en meest impactvolle problemen zitten.',
      'In mei 2024 begon ik een doctoraat aan KU Leuven om me voltijds op die kloof te richten — specifiek op het snijvlak van kennisgrafen, multimodale machine learning en cultureel erfgoed.',
    ],
    philosophyHeading: 'Wat het werk drijft',
    philosophyParagraph:
      'Ik geloof dat gestructureerde, open kennis de voorwaarde is voor AI die echt nuttig is in complexe domeinen. Modellen hebben context nodig, niet alleen data — en kennisgrafen zijn hoe je ze die context geeft. Mijn doel is systemen bouwen waar domeinexpertise en machine-intelligentie elkaar versterken.',
    interestsHeading: 'Buiten het labo',
    interests: [
      'Schaken — vooral online, af en toe aan het bord',
      'Sport — zowel beoefenen als de data overanalyseren',
      'Gaming — van strategie tot verhalend',
    ],
    skillsHeading: 'Tools & technologieën',
    skills: [
      { category: 'Talen', items: 'Python, TypeScript, Java, SPARQL' },
      { category: 'Semantisch Web', items: 'RDF, OWL, SHACL, Linked Data, Comunica' },
      { category: 'ML & Data', items: 'PyTorch, Hugging Face, pandas, Jupyter' },
      { category: 'Web', items: 'Astro, D3.js, Node.js' },
    ],
  },
  research: {
    title: 'Onderzoek',
    intro:
      'Mijn onderzoek gaat vooral over kennisgrafen en multimodale ML voor cultureel erfgoed, met wat werk rond data-interoperabiliteit in human biomonitoring.',
    themesHeading: 'Onderzoeksthema\'s',
    themeLabels: {
      'cultural-heritage': 'Cultureel erfgoed',
      'knowledge-graphs': 'Kennisgrafen',
      biomonitoring: 'Biomonitoring',
      'network-security': 'Netwerkbeveiliging',
    },
    themeDescriptions: {
      'cultural-heritage':
        'Erfgoedinstellingen beheren enorme collecties van gedigitaliseerde objecten — schilderijen, manuscripten, archeologische vondsten — die rijk zijn aan betekenis maar vaak slecht verbonden. Ik werk eraan om die culturele kennis vindbaarder en herbruikbaarder te maken, met kennisgrafen om objecten over collecties heen te verbinden en multimodale ML om de kloof tussen visuele inhoud en gestructureerde metadata te overbruggen.',
      'knowledge-graphs':
        'Kennisgrafen bieden een principiële manier om heterogene kennis te representeren, integreren en bevragen. Mijn werk richt zich op het bouwen en gebruiken van KG\'s die domeinexpertise combineren met datagedreven methoden — van ontologie-ontwerp en linked-data-publicatie tot kennisverrijkte retrieval en aanbevelingssystemen.',
      biomonitoring:
        'Human-biomonitoring-studies genereren complexe datasets over meerdere Europese onderzoeksconsortia heen. Tijdens mijn tijd bij VITO werkte ik aan het verbeteren van de interoperabiliteit van deze datasets — variabelen harmoniseren, vocabularia aligneren, en tools bouwen die onderzoekers over studiegrenzen heen laten zoeken.',
      'network-security':
        'Mijn masterproef verkende deep reinforcement learning voor netwerkinbraakdetectie. Hoewel mijn focus sindsdien verschoven is, gaf dit werk me een stevige basis in toegepaste ML en een blijvende interesse in hoe intelligente agenten kunnen opereren in vijandige omgevingen.',
    },
    featuredHeading: 'Uitgelicht',
    statusLabels: {
      published: 'Verschenen',
      accepted: 'Aanvaard',
      preprint: 'Preprint',
    },
    authors: 'Auteurs',
    readLink: { doi: 'DOI', pdf: 'PDF', scholar: 'Scholar', url: 'Link' },
    citeButton: 'Citeer',
    copiedLabel: 'Gekopieerd!',
    citeBibtex: 'BibTeX',
    citeApa: 'APA',
    citeRis: 'RIS',
    scholarLink: 'Volledige lijst op Google Scholar',
  },
  projects: {
    title: 'Projecten',
    intro:
      'Bijprojecten — vooral excuses om iets nieuws te proberen in Python en TypeScript.',
    labels: { repo: 'Repo', demo: 'Live' },
    more: 'Meer op GitHub',
  },
  blog: {
    title: 'Blog',
    intro: 'Af en toe schrijven over onderzoek, tools en dingen die me interesseren.',
    readMore: 'Lees meer',
    publishedOn: 'Gepubliceerd',
    updatedOn: 'Bijgewerkt',
    tagLabel: 'Tags',
    noPosts: 'Nog geen berichten — kijk binnenkort nog eens.',
    backToIndex: 'Alle berichten',
  },
  cv: {
    title: 'CV',
    intro: 'Opleiding, ervaring en vaardigheden in een oogopslag.',
    downloadLabel: 'Afdrukken / opslaan als PDF',
    educationHeading: 'Opleiding',
    experienceHeading: 'Ervaring',
    experience: [
      {
        period: '2024 – heden',
        title: 'Doctoraatsonderzoeker',
        subtitle: 'KU Leuven',
        note: 'Kennisgrafen en multimodale ML voor cultureel erfgoed',
      },
      {
        period: '2022 – 2024',
        title: 'Research Software Engineer',
        subtitle: 'VITO',
        note: 'Data-interoperabiliteit voor human-biomonitoring-studies',
      },
    ],
    skillsHeading: 'Vaardigheden',
    publicationsHeading: 'Geselecteerde publicaties',
    languagesHeading: 'Talen',
    languages: ['Nederlands (moedertaal)', 'Engels (vloeiend)', 'Frans'],
  },
  contact: {
    title: 'Contact',
    intro:
      'Een e-mail is de snelste manier om me te bereiken — meestal antwoord ik binnen één à twee dagen.',
    emailLabel: 'ruben@fampeeters.be',
    collaborationHeading: 'Open voor samenwerking',
    collaborationBody:
      'Ik hoor altijd graag van mensen die werken aan kennisgrafen, cultureel erfgoed of data-interoperabiliteit. Of het nu gaat om een onderzoekspartnerschap, een open-source-project of een consultingvraag — neem gerust contact op.',
    elsewhere: 'Elders',
    links: { github: 'GitHub', scholar: 'Google Scholar', linkedin: 'LinkedIn', orcid: 'ORCID' },
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
