export type ProjectLink = { label: string; href: string };

export type Project = {
  title: string;
  year?: string;
  category: "UI / Web Design" | "Web Development" | "Game Development";
  summary: string;
  stack: string[];
  /** CSS colour used as the project's accent on its card. */
  accent: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    title: "Karina.co.il",
    year: "2025",
    category: "UI / Web Design",
    summary:
      "Website layout, UI and visual identity for Karina Printed Shirts — designed and maintained as the company's in-house designer and webmaster.",
    stack: ["UI / UX", "Branding", "React", "Bootstrap"],
    accent: "#ff5a36",
    links: [
      { label: "Live site", href: "https://karina.co.il/" },
      {
        label: "Layout (PDF)",
        href: "https://drive.google.com/file/d/1sW__DYzzqa-BrEpqCpdO4exhOch4tUVd/view?usp=sharing",
      },
    ],
  },
  {
    title: "KISS — Website Concept",
    year: "2023",
    category: "UI / Web Design",
    summary:
      "Final-project UI design for a fictional KISS band website: home, discography, tour dates, gallery and merch pages with a dark rock-and-roll layout.",
    stack: ["UI Design", "Photoshop", "Illustrator"],
    accent: "#e8c547",
    links: [
      {
        label: "Layouts (PDF)",
        href: "https://drive.google.com/file/d/17M7uU-hGodQUmQAzP0XjegojsCFrojP-/view?usp=sharing",
      },
    ],
  },
  {
    title: "Compass World",
    year: "2024 — 2025",
    category: "Web Development",
    summary:
      "A content-driven website designed and built from scratch, rebuilt in v2 with Astro, MDX and GSAP animations.",
    stack: ["Astro", "GSAP", "MDX", "TypeScript"],
    accent: "#2f6bff",
    links: [
      { label: "Live site (v2)", href: "https://guybracha.github.io/compass-world-astro/" },
      {
        label: "Layouts (PDF)",
        href: "https://drive.google.com/file/d/1UNIIW9tsDc-oYbhl9OLRehTIkG6Kjxzh/view?usp=sharing",
      },
    ],
  },
  {
    title: "Comixiad",
    category: "Web Development",
    summary: "A full-stack web platform for publishing and reading comics.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    accent: "#19a974",
    links: [{ label: "Live site", href: "https://comixiad.com" }],
  },
  {
    title: "Underwater Adventure",
    category: "Game Development",
    summary: "A small arcade game written in Python, published on itch.io.",
    stack: ["Python", "turtle"],
    accent: "#3a49c9",
    links: [{ label: "Play on itch.io", href: "https://guy-bracha.itch.io/underwater-adventure" }],
  },
];

/** Prefix a public path with the configured basePath. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
