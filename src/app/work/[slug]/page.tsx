import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery, type GalleryItem } from "@/components/Gallery";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { asset, getImageMeta, getProject, projects } from "@/data/projects";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [asset(getImageMeta(project.cover).thumb)],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  const nextCover = getImageMeta(next.cover);

  const items: GalleryItem[] = project.images.map((img) => {
    const m = getImageMeta(img.src);
    return { ...img, thumb: m.thumb, thumbWidth: m.thumbWidth, thumbHeight: m.thumbHeight };
  });

  return (
    <article style={{ "--accent": project.accent } as React.CSSProperties}>
      <header className="project-hero">
        <div className="container">
          <Link href="/#work" className="back-link">
            <ArrowRight /> All work
          </Link>
          <span className="eyebrow">
            {project.category} · {project.year}
          </span>
          <h1 className="project-title">{project.title}</h1>
          <div className="project-intro">
            <div>
              <p className="project-desc">{project.description}</p>
              {project.links && (
                <div className="project-links">
                  {project.links.map((l) => (
                    <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                      {l.label} <ArrowUpRight />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <dl className="project-meta">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>{project.tools.join(" · ")}</dd>
              </div>
              <div>
                <dt>Pieces</dt>
                <dd>{project.images.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <div className="container">
        <Gallery items={items} />
      </div>

      <section className="next-project">
        <div className="container">
          <Link href={`/work/${next.slug}/`} className="next-link">
            <div>
              <span className="eyebrow">Next project</span>
              <h2>{next.title}</h2>
            </div>
            <div className="next-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(nextCover.thumb)} alt="" width={nextCover.thumbWidth} height={nextCover.thumbHeight} loading="lazy" />
            </div>
          </Link>
        </div>
      </section>
    </article>
  );
}
