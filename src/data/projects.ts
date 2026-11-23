import imageMeta from "./image-meta.json";

export type Category = "Branding" | "Illustration" | "UI / Web" | "Pop Art" | "Graphics";

export type Artwork = {
  src: string;
  title: string;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: Category;
  summary: string;
  description: string;
  role: string;
  tools: string[];
  cover: string;
  /** CSS colour used as the project's accent on cards and its page. */
  accent: string;
  images: Artwork[];
  links?: ProjectLink[];
};

const art = (src: string, title: string): Artwork => ({ src: `/contents/${src}`, title });

export const projects: Project[] = [
  {
    slug: "karina",
    title: "Karina Printed Shirts",
    year: "2025",
    category: "Branding",
    summary: "Brand identity, ads and merchandise for a custom-print business.",
    description:
      "As in-house designer and webmaster I built Karina's visual language end-to-end: the logo system, seasonal ad campaigns, product mock-ups for shirts, vests and branded kits, and the layout of karina.co.il.",
    role: "Brand designer & webmaster",
    tools: ["Illustrator", "Photoshop", "React"],
    cover: "/contents/winter.webp",
    accent: "#ff5a36",
    images: [
      art("winter.webp", "Winter campaign"),
      art("quality.webp", "Quality campaign"),
      art("vest.webp", "Safety vest campaign"),
      art("table2.webp", "Branded merchandise kit"),
    ],
    links: [
      { label: "Visit karina.co.il", href: "https://karina.co.il/" },
      {
        label: "Website layout (PDF)",
        href: "https://drive.google.com/file/d/1sW__DYzzqa-BrEpqCpdO4exhOch4tUVd/view?usp=sharing",
      },
    ],
  },
  {
    slug: "compass-alliance",
    title: "Compass Alliance",
    year: "2024 — 2025",
    category: "Illustration",
    summary: "An original superhero universe: characters, logo, ID system and website.",
    description:
      "Compass Alliance is my long-running world-building project — a full roster of original heroes with their own visual identity, team insignia, character ID cards and a companion website built in Astro.",
    role: "Creator, character designer & developer",
    tools: ["Illustrator", "Photoshop", "Astro", "GSAP"],
    cover: "/contents/art/compassCrew.webp",
    accent: "#2f6bff",
    images: [
      art("art/compassCrew.webp", "Compass Crew"),
      art("Ca_Logo.webp", "Compass Alliance logo"),
      art("compassAlliance_idENG.webp", "Member ID sheet"),
      art("CAgif-min.gif", "Member roster (animated)"),
      art("union.webp", "The Union"),
      art("council.webp", "The Council"),
    ],
    links: [
      { label: "Compass World site", href: "https://guybracha.github.io/compass-world-astro/" },
      {
        label: "Alliance ID (PDF)",
        href: "https://drive.google.com/file/d/1UNIIW9tsDc-oYbhl9OLRehTIkG6Kjxzh/view?usp=sharing",
      },
    ],
  },
  {
    slug: "kiss-website",
    title: "KISS — Website Concept",
    year: "2023",
    category: "UI / Web",
    summary: "Final-project UI design for a fictional KISS band website.",
    description:
      "Five full-page artboards covering home, discography, tour dates, gallery and merch — exploring a dark rock-and-roll layout with strong typographic hierarchy.",
    role: "UI / UX designer",
    tools: ["Photoshop", "Illustrator"],
    cover: "/contents/graphics/kiss/artboard1.webp",
    accent: "#e8c547",
    images: [1, 2, 3, 4, 5].map((n) =>
      art(`graphics/kiss/artboard${n}.webp`, `Artboard 0${n}`),
    ),
    links: [
      {
        label: "Full layouts (PDF)",
        href: "https://drive.google.com/file/d/17M7uU-hGodQUmQAzP0XjegojsCFrojP-/view?usp=sharing",
      },
    ],
  },
  {
    slug: "justice-league-vector",
    title: "Justice League Vector",
    year: "2022",
    category: "Illustration",
    summary: "A large-format fan tribute drawn entirely in vector.",
    description:
      "A wide group shot built shape by shape in Illustrator — an exercise in clean vector rendering, colour flats and composing a crowded scene.",
    role: "Illustrator",
    tools: ["Illustrator"],
    cover: "/contents/jl.webp",
    accent: "#d6343b",
    images: [art("jl.webp", "Justice League vector fanart")],
    links: [
      {
        label: "View PDF",
        href: "https://drive.google.com/file/d/1cXdjy0K3r8Sd0uBAzOUunlVcsFRLljew/view?usp=sharing",
      },
    ],
  },
  {
    slug: "pop-art",
    title: "Pop Art Series",
    year: "Ongoing",
    category: "Pop Art",
    summary: "Posterised, high-contrast takes on film, music and comics icons.",
    description:
      "A series of limited-palette pop-art pieces — reducing photos and comic panels to bold flat tones and halftone-style contrast.",
    role: "Illustrator",
    tools: ["Photoshop", "Illustrator"],
    cover: "/contents/popart/justice-league-of-america-gold.webp",
    accent: "#ffb400",
    images: [
      art("popart/justice-league-of-america.webp", "Justice League of America"),
      art("popart/justice-league-of-america-gold.webp", "Justice League of America — Gold"),
      art("popart/jla-jsa.webp", "JLA / JSA"),
      art("popart/compass-alliance-1.webp", "Compass Alliance I"),
      art("popart/compass-alliance-2.webp", "Compass Alliance II"),
      art("popart/amadeus.webp", "Amadeus"),
      art("popart/donnie-darko.webp", "Donnie Darko"),
      art("popart/svika-pick.webp", "Svika Pick"),
      art("popart/yael-shelbia.webp", "Yael Shelbia"),
    ],
  },
  {
    slug: "educational-tv",
    title: "Educational TV at 60",
    year: "2026",
    category: "Graphics",
    summary: "Anniversary posters celebrating 60 years of Israeli Educational Television.",
    description:
      "Two commemorative posters marking 1966 — 2026, weaving archive imagery, a retro TV set and a rainbow motif into a nostalgic Hebrew-language layout.",
    role: "Poster designer",
    tools: ["Photoshop"],
    cover: "/contents/educational1996.webp",
    accent: "#3a49c9",
    images: [
      art("educational1996.webp", "1966 — 2026"),
      art("educationalPoster.webp", "60 years of Educational TV"),
    ],
  },
  {
    slug: "illustration",
    title: "Illustration & Comics",
    year: "2021 — Now",
    category: "Illustration",
    summary: "Comic pages, character pieces and editorial illustrations.",
    description:
      "A selection of personal and commissioned drawings — superhero ensembles, landscapes, tributes and gag comics.",
    role: "Illustrator & comic artist",
    tools: ["Photoshop"],
    cover: "/contents/art/powerpoint.webp",
    accent: "#19a974",
    images: [
      art("art/powerpoint.webp", "PowerPoint!"),
      art("art/allStarSpectrumMan.webp", "All Star Spectrum Man"),
      art("art/aWiderCircle.webp", "A Wider Circle"),
      art("art/youngAndAmbitious.webp", "Young and Ambitious"),
      art("art/UniteColShade.webp", "Unite Colour and Shade"),
      art("art/hanukkah.webp", "Hanukkah"),
      art("art/arizona.webp", "Arizona"),
      art("art/jimHenson.webp", "Jim Henson"),
      art("art/longTomorrow.webp", "Long Tomorrow"),
      art("art/Disney.webp", "Disney"),
      art("art/pirates.webp", "Pirates"),
      art("art/stoneMask.webp", "Stone Mask"),
      art("jetix.webp", "Let My Jetix Go"),
      art("lovesickAlex.webp", "Lovesick Alex"),
      art("backpage.webp", "Back page"),
    ],
  },
  {
    slug: "icons-and-symbols",
    title: "Icons & Symbols",
    year: "2022 — 2024",
    category: "Graphics",
    summary: "Vector marks, emblems and typographic experiments.",
    description:
      "Small-format vector work: emblems, flags, abstract marks and type studies — the building blocks of larger identity systems.",
    role: "Graphic designer",
    tools: ["Illustrator"],
    cover: "/contents/britain.webp",
    accent: "#e3325f",
    images: [
      art("britain.webp", "Emblem"),
      art("il.webp", "Pattern study"),
      art("flag.webp", "Flag"),
      art("bubbles.webp", "Bubbles"),
      art("star.webp", "Star"),
      art("textEnv.webp", "Smile, Enjoy, Life"),
      art("Asset3.webp", "Gradient mark"),
    ],
  },
];

export const categories: Category[] = ["Branding", "Illustration", "UI / Web", "Pop Art", "Graphics"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

type Meta = {
  width: number;
  height: number;
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
};

const metaMap = imageMeta as Record<string, Meta>;

export function getImageMeta(src: string): Meta {
  const m = metaMap[src];
  if (!m) throw new Error(`Missing image metadata for ${src} — run "npm run thumbs".`);
  return m;
}

/** Prefix a public path with the configured basePath. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
