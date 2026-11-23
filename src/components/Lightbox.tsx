"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "@/data/projects";
import { ArrowRight, Close, Minus, Plus } from "./Icons";

export type LightboxItem = { src: string; thumb: string; title: string };

type Props = {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const MIN = 1;
const MAX = 4;

export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const item = items[index];
  const count = items.length;
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const swipe = useRef<number | null>(null);

  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (dir: number) => {
      if (count < 2) return;
      onIndex((index + dir + count) % count);
    },
    [count, index, onIndex],
  );

  // Reset zoom + loading state whenever the image changes; preload neighbours.
  useEffect(() => {
    reset();
    setLoaded(false);
    for (const d of [-1, 1]) {
      const n = items[(index + d + count) % count];
      if (n) new Image().src = asset(n.src);
    }
  }, [index, items, count, reset]);

  // Keyboard, scroll lock and focus management.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") setScale((s) => Math.min(MAX, s + 0.5));
      else if (e.key === "-") setScale((s) => Math.max(MIN, s - 0.5));
      else if (e.key === "0") reset();
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [go, onClose, reset]);

  useEffect(() => {
    if (scale === 1) setPos({ x: 0, y: 0 });
  }, [scale]);

  const onWheel = (e: React.WheelEvent) => {
    setScale((s) => Math.min(MAX, Math.max(MIN, s * (e.deltaY < 0 ? 1.15 : 1 / 1.15))));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y, moved: false };
    swipe.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (scale > 1) setPos({ x: d.px + dx / scale, y: d.py + dy / scale });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (scale === 1 && swipe.current !== null) {
      const dx = e.clientX - swipe.current;
      if (Math.abs(dx) > 60) return go(dx < 0 ? 1 : -1);
    }
    if (!d.moved && e.target instanceof HTMLImageElement) {
      // Click toggles zoom, centred on the clicked point.
      if (scale > 1) return reset();
      const r = e.target.getBoundingClientRect();
      setScale(2.5);
      setPos({ x: r.width / 2 - (e.clientX - r.left), y: r.height / 2 - (e.clientY - r.top) });
    } else if (!d.moved && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!item) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${item.title}`}
      tabIndex={-1}
    >
      <div className="lb-bar">
        <span aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="lb-tools">
          <button className="lb-btn" type="button" onClick={() => setScale((s) => Math.max(MIN, s - 0.5))} aria-label="Zoom out">
            <Minus />
          </button>
          <button className="lb-btn" type="button" onClick={() => setScale((s) => Math.min(MAX, s + 0.5))} aria-label="Zoom in">
            <Plus />
          </button>
          <button className="lb-btn" type="button" onClick={onClose} aria-label="Close viewer">
            <Close />
          </button>
        </div>
      </div>

      <div
        className="lb-stage"
        data-zoomed={scale > 1}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {/* Show the thumbnail instantly, swap to the full-resolution file once loaded. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={asset(loaded ? item.src : item.thumb)}
          alt={item.title}
          draggable={false}
          style={{ transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)` }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(item.src)}
          alt=""
          hidden
          onLoad={() => setLoaded(true)}
        />
        {count > 1 && (
          <>
            <button className="lb-btn lb-nav lb-prev" type="button" onClick={() => go(-1)} aria-label="Previous image">
              <ArrowRight />
            </button>
            <button className="lb-btn lb-nav lb-next" type="button" onClick={() => go(1)} aria-label="Next image">
              <ArrowRight />
            </button>
          </>
        )}
      </div>

      <div className="lb-caption">
        {item.title}
        <span className="lb-hint">Click to zoom · drag to pan · ← → to browse · Esc to close</span>
      </div>
    </div>,
    document.body,
  );
}
