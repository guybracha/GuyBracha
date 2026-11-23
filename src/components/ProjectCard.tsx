import Link from "next/link";
import { asset, getImageMeta, type Project } from "@/data/projects";
import { ArrowRight } from "./Icons";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const cover = getImageMeta(project.cover);
  return (
    <Link
      href={`/work/${project.slug}/`}
      className="card"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      <div className="card-media">
        <span className="card-tag">{project.category}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(cover.thumb)}
          width={cover.thumbWidth}
          height={cover.thumbHeight}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3 className="card-title">{project.title}</h3>
          <span className="card-year">{project.year}</span>
        </div>
        <p className="card-summary">{project.summary}</p>
        <span className="card-arrow">
          View project · {project.images.length} {project.images.length === 1 ? "piece" : "pieces"}
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}
