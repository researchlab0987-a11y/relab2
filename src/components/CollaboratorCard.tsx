import React, { useState } from 'react';
import type { CollaboratorProfile } from '../types';

interface Props {
  collaborator: CollaboratorProfile;
  onClick?: () => void;
}

const CollaboratorCard: React.FC<Props> = ({ collaborator: c, onClick }) => {
  const [imgErr, setImgErr] = useState(false);

  const initials = c.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group"
      style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Photo header */}
      <div
        className="flex items-center justify-center py-8"
        style={{ background: 'var(--color-primary)' }}
      >
        {c.photo && !imgErr ? (
          <img
            src={c.photo}
            alt={c.name}
            onError={() => setImgErr(true)}
            className="rounded-full object-cover border-4 border-white"
            style={{ width: 120, height: 120 }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-white font-black text-3xl border-4 border-white"
            style={{ width: 120, height: 120, background: 'var(--color-secondary)' }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 text-center">
        <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{c.name}</h3>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-secondary)' }}>
          {c.designation}
        </p>
        <p className="text-xs text-gray-500 mb-3">{c.affiliation}</p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{c.bio}</p>

        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {c.linkedin && (
            <a href={c.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold px-2 py-1 rounded no-underline"
              style={{ background: '#0a66c2', color: 'white' }}>in</a>
          )}
          {c.scholar && (
            <a href={c.scholar} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold px-2 py-1 rounded no-underline"
              style={{ background: '#4285f4', color: 'white' }}>GS</a>
          )}
          {c.orcid && (
            <a href={c.orcid} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold px-2 py-1 rounded no-underline"
              style={{ background: '#a6ce39', color: 'white' }}>ID</a>
          )}
        </div>

        <div
          className="mt-4 text-xs font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          View Full Profile →
        </div>
      </div>
    </div>
  );
};

export default CollaboratorCard;
