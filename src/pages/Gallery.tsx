import React, { useCallback, useEffect, useState } from "react";
import { useGallery, useSiteContent } from "../firebase/hooks";
import type { GalleryItem } from "../types";

const Gallery: React.FC = () => {
  const { gallery, loading } = useGallery();
  const { content } = useSiteContent();
  const [lightbox, setLightbox] = useState<number | null>(null); // index in gallery array

  // ── Keyboard navigation ───────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) =>
          i !== null ? Math.min(i + 1, gallery.length - 1) : null,
        );
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i !== null ? Math.max(i - 1, 0) : null));
    },
    [lightbox, gallery.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const currentItem = lightbox !== null ? gallery[lightbox] : null;

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-20 text-center px-4"
        style={{ background: "var(--color-primary)" }}
      >
        {content["gallery.bannerUrl"] && (
          <img
            src={content["gallery.bannerUrl"]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.45)" }}
          />
        )}
        <div className="relative z-10">
          <h1
            className="font-black text-white mb-4"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {content["gallery.pageTitle"] ?? "Gallery"}
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {content["gallery.pageSubtitle"] ??
              "Moments, milestones, and memories from the lab."}
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        {loading ? (
          <div className="flex justify-center py-24">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--color-primary)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-400 text-lg font-semibold">
              No images yet.
            </p>
            <p className="text-gray-300 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div
            style={{
              columns: "3 280px",
              columnGap: "16px",
            }}
          >
            {gallery.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightbox(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && currentItem && (
        <Lightbox
          item={currentItem}
          index={lightbox}
          total={gallery.length}
          onClose={() => setLightbox(null)}
          onPrev={() =>
            setLightbox((i) => (i !== null ? Math.max(i - 1, 0) : 0))
          }
          onNext={() =>
            setLightbox((i) =>
              i !== null ? Math.min(i + 1, gallery.length - 1) : 0,
            )
          }
        />
      )}
    </div>
  );
};

// ── Gallery Card ───────────────────────────────────────────────
const GalleryCard: React.FC<{
  item: GalleryItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        marginBottom: 16,
        breakInside: "avoid",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.18)"
          : "0 4px 14px rgba(0,0,0,0.08)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {imgErr ? (
        <div
          className="flex items-center justify-center text-gray-400 text-sm font-medium"
          style={{
            height: 200,
            background: "#f3f4f6",
            borderRadius: 16,
          }}
        >
          Image unavailable
        </div>
      ) : (
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={() => setImgErr(true)}
          style={{
            width: "100%",
            display: "block",
            borderRadius: 16,
          }}
        />
      )}

      {/* Hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "16px",
        }}
      >
        <p className="text-white font-black text-sm leading-snug">
          {item.title}
        </p>
        {item.description && (
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {item.description}
          </p>
        )}
        <div
          className="mt-2 text-xs font-bold"
          style={{ color: "var(--color-accent)" }}
        >
          Click to view →
        </div>
      </div>
    </div>
  );
};

// ── Lightbox ───────────────────────────────────────────────────
const Lightbox: React.FC<{
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ item, index, total, onClose, onPrev, onNext }) => {
  const [imgErr, setImgErr] = useState(false);

  // Reset imgErr when item changes
  useEffect(() => setImgErr(false), [item.id]);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 flex items-center justify-center rounded-full border-none cursor-pointer"
        style={{
          width: 44,
          height: 44,
          background: "rgba(255,255,255,0.12)",
          color: "white",
          fontSize: 22,
          zIndex: 10,
        }}
      >
        ×
      </button>

      {/* Counter */}
      <div
        className="absolute top-5 left-1/2 text-xs font-bold px-3 py-1.5 rounded-full"
        style={{
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {index + 1} / {total}
      </div>

      {/* Prev arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={isFirst}
        className="absolute left-4 flex items-center justify-center rounded-full border-none cursor-pointer disabled:opacity-20"
        style={{
          width: 48,
          height: 48,
          background: "rgba(255,255,255,0.12)",
          color: "white",
          fontSize: 22,
          zIndex: 10,
        }}
      >
        ‹
      </button>

      {/* Image container */}
      <div
        className="relative flex flex-col items-center px-20"
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {imgErr ? (
          <div
            className="flex items-center justify-center text-gray-400 rounded-2xl"
            style={{ width: 400, height: 300, background: "#1f2937" }}
          >
            Image unavailable
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImgErr(true)}
            style={{
              maxWidth: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          />
        )}

        {/* Caption */}
        <div className="mt-5 text-center" style={{ maxWidth: 560 }}>
          <p
            className="text-white font-black text-lg leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item.title}
          </p>
          {item.description && (
            <p
              className="text-sm mt-1.5"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Dot indicators */}
        {total <= 20 && (
          <div className="flex gap-1.5 mt-5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === index ? 20 : 6,
                  height: 6,
                  borderRadius: 99,
                  background:
                    i === index
                      ? "var(--color-accent)"
                      : "rgba(255,255,255,0.25)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Next arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={isLast}
        className="absolute right-4 flex items-center justify-center rounded-full border-none cursor-pointer disabled:opacity-20"
        style={{
          width: 48,
          height: 48,
          background: "rgba(255,255,255,0.12)",
          color: "white",
          fontSize: 22,
          zIndex: 10,
        }}
      >
        ›
      </button>
    </div>
  );
};

export default Gallery;
