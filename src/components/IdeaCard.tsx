import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResearchIdea } from '../types';

interface Props {
  idea: ResearchIdea;
}

const IdeaCard: React.FC<Props> = ({ idea }) => {
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();

  const initials = idea.authorName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={() => navigate(`/research-ideas/${idea.id}`)}
      className="bg-white rounded-xl p-6 shadow-sm border cursor-pointer group"
      style={{ borderColor: '#e5e7eb', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        (e.currentTarget as HTMLDivElement).style.transform = '';
      }}
    >
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        {idea.authorPhoto && !imgErr ? (
          <img
            src={idea.authorPhoto}
            alt={idea.authorName}
            onError={() => setImgErr(true)}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 38, height: 38 }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ width: 38, height: 38, background: 'var(--color-primary)' }}
          >
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-gray-800">{idea.authorName}</p>
          <p className="text-xs text-gray-400">
            {new Date(idea.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <h3
        className="font-black text-lg leading-snug mb-3 group-hover:underline"
        style={{ color: 'var(--color-primary)' }}
      >
        {idea.title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
        {idea.shortDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {idea.tags?.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#eff6ff', color: '#1d4ed8' }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-3 border-t" style={{ borderColor: '#f0f0f0' }}>
        <span>💬 {idea.commentCount ?? 0} comments</span>
        <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Read more →</span>
      </div>
    </div>
  );
};

export default IdeaCard;
