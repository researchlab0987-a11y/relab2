import React, { useState } from 'react';
import type { Publication } from '../types';

interface Props {
  publication: Publication;
}

const PublicationCard: React.FC<Props> = ({ publication: p }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border"
      style={{ borderColor: '#e5e7eb', borderLeft: `4px solid var(--color-${p.type === 'ongoing' ? 'accent' : 'secondary'})` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: p.type === 'ongoing' ? '#fef3c7' : '#dbeafe',
                color: p.type === 'ongoing' ? '#92400e' : '#1e40af',
              }}
            >
              {p.type === 'ongoing' ? 'Ongoing' : 'Published'}
            </span>
            <span className="text-xs text-gray-400">{p.year}</span>
            {p.tags?.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                {t}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noreferrer" className="no-underline hover:underline" style={{ color: 'var(--color-primary)' }}>
                {p.title}
              </a>
            ) : p.title}
          </h3>

          <p className="text-sm text-gray-600 mb-1">{p.authors}</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>{p.journal}</p>

          {p.doi && (
            <p className="text-xs text-gray-400 mt-1">DOI: {p.doi}</p>
          )}

          {p.abstract && (
            <>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-2 text-xs font-semibold bg-transparent border-none cursor-pointer p-0"
                style={{ color: 'var(--color-secondary)' }}
              >
                {expanded ? '▲ Hide Abstract' : '▼ Show Abstract'}
              </button>
              {expanded && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed border-t pt-2" style={{ borderColor: '#e5e7eb' }}>
                  {p.abstract}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;
