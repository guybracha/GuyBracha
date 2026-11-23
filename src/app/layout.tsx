import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, DM_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import { asset } from "@/data/projects";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url + "/"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Portfolio of Guy Bracha — graphic designer and illustrator specialising in casual game art, monetization visuals, branding, character design and comic art.",
  icons: { icon: asset("/contents/britain.webp") },
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    images: [asset("/thumbs/art/compassCrew.webp")],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
