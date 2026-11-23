"use client";

import { useState } from "react";
import { asset, type Artwork } from "@/data/projects";
import { Lightbox, type LightboxItem } from "./Lightbox";

export type GalleryItem = Artwork & LightboxItem & { thumbWidth: number; thumbHeight: number };

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="gallery" data-count={Math.min(items.length, 3)}>
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className="gallery-item"
            onClick={() => setIndex(i)}
            aria-label={`Open “${item.title}” full size`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(item.thumb)}
              width={item.thumbWidth}
              height={item.thumbHeight}
              alt={item.title}
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
            />
            <span className="gallery-caption">
              <span>{item.title}</span>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </span>
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
      )}
    </>
  );
}
