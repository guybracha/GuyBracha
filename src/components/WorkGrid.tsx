"use client";

import { useState } from "react";
import { categories, projects, type Category } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function WorkGrid() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const options = ["All" as const, ...categories].filter(
    (c) => c === "All" || projects.some((p) => p.category === c),
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by discipline">
        {options.map((c) => (
          <button
            key={c}
            type="button"
            className="filter"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
            <span className="count">
              {c === "All" ? projects.length : projects.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>
      <div
        className="work-grid"
        data-filtered={filter !== "All"}
        style={{ marginTop: 32 }}
        aria-live="polite"
      >
        {shown.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} />
        ))}
      </div>
    </>
  );
}
