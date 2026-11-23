import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./Icons";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="card" style={{ "--card-accent": project.accent } as React.CSSProperties}>
      <div className="card-head">
        <span className="card-tag">{project.category}</span>
        <span className="card-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3 className="card-title">{project.title}</h3>
          {project.year && <span className="card-year">{project.year}</span>}
        </div>
        <p className="card-summary">{project.summary}</p>
        <ul className="card-stack" aria-label="Tools and technologies">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="card-links">
          {project.links.map((l) => (
            <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ArrowUpRight />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
