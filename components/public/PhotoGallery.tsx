"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Photo {
  url: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const open = (i: number) => {
    setCurrent(i);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, prev, next]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* ── Grid ──────────────────────────────────────────── */}
      <div className="relative mb-8">
        {photos.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-sm overflow-hidden">
            <div
              className="md:col-span-2 md:row-span-2 relative h-72 md:h-full cursor-pointer"
              onClick={() => open(0)}
            >
              <Image
                src={photos[0].url}
                alt={photos[0].alt}
                fill
                priority
                className="object-cover hover:brightness-90 transition-[filter] duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {photos.slice(1, 5).map((photo, i) => (
              <div
                key={i}
                className="relative h-52 cursor-pointer"
                onClick={() => open(i + 1)}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:brightness-90 transition-[filter] duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 25vw, 400px"
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="relative h-64 sm:h-96 lg:h-[520px] rounded-sm overflow-hidden cursor-pointer"
            onClick={() => open(0)}
          >
            <Image
              src={photos[0].url}
              alt={photos[0].alt}
              fill
              priority
              className="object-cover hover:brightness-90 transition-[filter] duration-300"
              sizes="100vw"
            />
          </div>
        )}

        {/* Show all button */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#1c1c19] text-xs font-semibold px-4 py-2.5 rounded border border-[#e6e2dd] hover:bg-white shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Show all {photos.length} photo{photos.length !== 1 ? "s" : ""}
        </button>
      </div>

      {/* ── Lightbox ──────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          style={{ userSelect: "none" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <span className="text-white/60 text-sm tabular-nums">
              {current + 1} / {photos.length}
            </span>
            <button
              onClick={close}
              aria-label="Close"
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image + side arrows */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
            }}
          >
            {/* Prev */}
            {photos.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="relative w-full h-full" style={{ padding: "0 56px" }}>
              <Image
                key={current}
                src={photos[current].url}
                alt={photos[current].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Next */}
            {photos.length > 1 && (
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 sm:right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Dots */}
          {photos.length > 1 && (
            <div className="flex-shrink-0 py-4 px-4 overflow-x-auto">
              <div className="flex justify-center items-center gap-1.5 min-w-max mx-auto">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Photo ${i + 1}`}
                    className={`rounded-full flex-shrink-0 transition-all duration-200 ${
                      i === current
                        ? "w-2.5 h-2.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/35 hover:bg-white/65"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
