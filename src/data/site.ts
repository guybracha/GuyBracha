export const site = {
  name: "Guy Bracha",
  role: "Graphic Designer & Illustrator",
  tagline:
    "Bold visuals for games, brands and stories — from monetization banners to entire superhero universes.",
  location: "Herzliya, Israel",
  email: "guy.bracha@gmail.com",
  linkedin: "https://www.linkedin.com/in/guy-bracha-b44b34244/",
  github: "https://github.com/guybracha",
  cv: "/contents/Guy_Bracha_CV.pdf",
  portrait: "/contents/profile.webp",
  url: "https://guybracha.github.io/GuyBracha",
  quote: { text: "Everything starts with an idea.", author: "Earl Nightingale" },
};

export const disciplines = [
  "Character Design",
  "Casual Game Art",
  "Monetization Visuals",
  "Brand Identity",
  "Comic Art",
  "UI Layouts",
  "Pop Art",
  "World Building",
];

export const strengths = [
  {
    title: "Monetization & Live Ops",
    body: "High-converting promo banners, icons and pop-ups tuned to casual-game aesthetics.",
  },
  {
    title: "Branding & Merchandise",
    body: "Cohesive identities and production-ready assets — from logo to printed shirt.",
  },
  {
    title: "Engineer's Workflow",
    body: "A software-engineering background means clean, structured files and smooth hand-offs to developers.",
  },
];

export const tools = [
  "Photoshop",
  "Illustrator",
  "InDesign",
  "Midjourney",
  "ChatGPT",
  "GitHub Copilot",
  "HTML / CSS / React",
];

export const influences = [
  "David Lynch",
  "Terry Gilliam",
  "Brian De Palma",
  "Naruto",
  "Fullmetal Alchemist",
  "JoJo's Bizarre Adventure",
];

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  body: string;
};

export const experience: TimelineItem[] = [
  {
    period: "2025 — Now",
    title: "Webmaster & Graphic Designer",
    org: "Karina Printed Shirts",
    body: "Led the visual identity, website UI/UX, commercial graphics, marketing assets and merchandise branding.",
  },
  {
    period: "2021 — 2022",
    title: "Cyber Security Analyst",
    org: "Cellcom",
    body: "Worked in a highly structured, high-responsibility environment ensuring operational consistency.",
  },
  {
    period: "2017 — 2019",
    title: "National Service",
    org: "Access Israel NGO",
    body: "Coordinated complex logistics and built data systems that cut inventory errors by 30%.",
  },
];

export const education: TimelineItem[] = [
  {
    period: "2022 — 2025",
    title: "Diploma in Software Engineering",
    org: "Ariel Technical College",
    body: "Asset integration, development pipelines and object-oriented structure.",
  },
  {
    period: "Ongoing",
    title: "Design Frameworks",
    org: "Self-directed & courses",
    body: "Typography, visual hierarchy, vector rendering and commercial layout systems.",
  },
];

export const codeProjects = [
  { title: "Comixiad", stack: "React · Node · MongoDB", href: "https://comixiad.com" },
  { title: "Karina.co.il", stack: "React · Bootstrap", href: "https://karina.co.il" },
  {
    title: "Compass World v2",
    stack: "Astro · GSAP · MDX",
    href: "https://guybracha.github.io/compass-world-astro/",
  },
  {
    title: "Underwater Adventure",
    stack: "Python game",
    href: "https://guy-bracha.itch.io/underwater-adventure",
  },
];
