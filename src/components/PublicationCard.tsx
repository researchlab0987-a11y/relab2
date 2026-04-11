import React, { useState } from "react";
import type { Publication } from "../types";

interface Props {
  publication: Publication;
}

const PublicationCard: React.FC<Props> = ({ publication: p }) => {
  const [expanded, setExpanded] = useState(false);
  const isOngoing = p.type === "ongoing";

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderLeft: `3px solid ${isOngoing ? "#d97706" : "var(--color-primary)"}`,
        borderRadius: 8,
        padding: "18px 22px",
      }}
    >
      {/* Top row: type + year + tags */}
      <div className="flex items-center flex-wrap gap-2 mb-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            background: isOngoing ? "#fffbeb" : "#f0f4ff",
            color: isOngoing ? "#b45309" : "#3730a3",
            border: `1px solid ${isOngoing ? "#fde68a" : "#c7d2fe"}`,
          }}
        >
          {isOngoing ? "Ongoing" : "Published"}
        </span>
        <span className="text-xs text-gray-400 font-medium">{p.year}</span>
        {p.tags?.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3
        className="text-base font-bold leading-snug mb-1.5"
        style={{ color: "var(--color-primary)", lineHeight: 1.45 }}
      >
        {!isOngoing && p.url ? (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
            style={{ color: "var(--color-primary)", textDecoration: "none" }}
          >
            {p.title}
          </a>
        ) : (
          p.title
        )}
      </h3>

      {/* Authors */}
      {p.authors && (
        <p className="text-sm text-gray-600 mb-1">{p.authors}</p>
      )}

      {/* Journal + DOI inline */}
      <div className="flex items-center flex-wrap gap-3 mb-2">
        {p.journal && (
          <span className="text-sm font-medium text-gray-700 italic">
            {p.journal}
          </span>
        )}
        {p.doi && (
          <a
            href={`https://doi.org/${p.doi}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium no-underline hover:underline"
            style={{ color: "var(--color-secondary)" }}
          >
            DOI: {p.doi}
          </a>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 mt-2">
        {!isOngoing && p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold no-underline px-3 py-1.5 rounded"
            style={{
              background: "var(--color-primary)",
              color: "white",
              border: "none",
            }}
          >
            Read Paper →
          </a>
        )}
        {p.abstract && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-semibold bg-transparent border-none cursor-pointer p-0"
            style={{ color: "#64748b" }}
          >
            {expanded ? "Hide Abstract ▲" : "Show Abstract ▼"}
          </button>
        )}
      </div>

      {/* Abstract */}
      {expanded && p.abstract && (
        <div
          className="mt-3 pt-3 text-sm text-gray-600 leading-relaxed"
          style={{ borderTop: "1px solid #e2e8f0", lineHeight: 1.75 }}
        >
          {p.abstract}
        </div>
      )}
    </div>
  );
};

export default PublicationCard;
