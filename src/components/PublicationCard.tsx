import React, { useState } from "react";
import type { Publication } from "../types";

interface Props {
  publication: Publication;
}

const PublicationCard: React.FC<Props> = ({ publication: p }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isOngoing = p.type === "ongoing";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 10px 32px rgba(0,0,0,0.11)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Colored left stripe + top row */}
      <div
        style={{
          borderLeft: `5px solid ${isOngoing ? "var(--color-accent)" : "var(--color-secondary)"}`,
          padding: "20px 22px 0 22px",
        }}
      >
        {/* Top metadata row */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          {/* Type badge */}
          <span
            className="text-xs font-black px-3 py-1 rounded-full"
            style={{
              background: isOngoing ? "#fef3c7" : "#dbeafe",
              color: isOngoing ? "#92400e" : "#1e40af",
              letterSpacing: "0.3px",
            }}
          >
            {isOngoing ? "🔬 Ongoing" : "✅ Published"}
          </span>

          {/* Year */}
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "#f3f4f6", color: "#374151" }}
          >
            {p.year}
          </span>

          {/* Tags */}
          {p.tags?.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-black text-base leading-snug mb-2"
          style={{
            color: "var(--color-primary)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.4,
          }}
        >
          {p.title}
        </h3>

        {/* Authors */}
        {p.authors && (
          <p className="text-sm text-gray-600 mb-1.5 leading-relaxed">
            <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide mr-1">
              Authors:
            </span>
            {p.authors}
          </p>
        )}

        {/* Journal */}
        {p.journal && (
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--color-secondary)" }}
          >
            📖 {p.journal}
          </p>
        )}
      </div>

      {/* Bottom action row */}
      <div
        className="flex items-center flex-wrap gap-2 px-5 py-3 border-t"
        style={{
          borderColor: "#f3f4f6",
          background: hovered ? "#fafafa" : "white",
          transition: "background 0.2s",
        }}
      >
        {/* DOI */}
        {p.doi && (
          <a
            href={`https://doi.org/${p.doi}`}
            target="_blank"
            rel="noreferrer"
            className="no-underline text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #e5e7eb",
            }}
          >
            <span>🔗</span> DOI
          </a>
        )}

        {/* Paper link — only for published */}
        {!isOngoing && p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="no-underline text-xs font-black px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            <span>📄</span> Read Paper
          </a>
        )}

        {/* Abstract toggle */}
        {p.abstract && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-bold bg-transparent border-none cursor-pointer flex items-center gap-1"
            style={{ color: "var(--color-secondary)", marginLeft: "auto" }}
          >
            {expanded ? "▲ Hide Abstract" : "▼ Show Abstract"}
          </button>
        )}
      </div>

      {/* Abstract expand */}
      {expanded && p.abstract && (
        <div
          className="px-5 pb-5 pt-1"
          style={{
            borderLeft: `5px solid ${isOngoing ? "var(--color-accent)" : "var(--color-secondary)"}`,
          }}
        >
          <div
            className="rounded-xl p-4 text-sm text-gray-700 leading-relaxed"
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              lineHeight: 1.75,
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
              Abstract
            </span>
            {p.abstract}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationCard;
