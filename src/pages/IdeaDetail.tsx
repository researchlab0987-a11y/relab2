import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import CommentSection from '../components/CommentSection';
import type { ResearchIdea } from '../types';

const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<ResearchIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'researchIdeas', id)).then((snap) => {
      if (snap.exists()) setIdea({ id: snap.id, ...snap.data() } as ResearchIdea);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!idea) return (
    <div className="text-center py-24">
      <p className="text-gray-400 text-lg">Idea not found.</p>
      <button onClick={() => navigate('/research-ideas')} className="mt-4 text-sm font-bold bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-secondary)' }}>
        ← Back to Ideas
      </button>
    </div>
  );

  const initials = idea.authorName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/research-ideas')}
            className="text-sm font-bold mb-6 bg-transparent border-none cursor-pointer block"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            ← Back to Research Ideas
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags?.map((t) => (
              <span
                key={t}
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                {t}
              </span>
            ))}
          </div>

          <h1
            className="text-white font-black leading-tight mb-6"
            style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontFamily: 'var(--font-heading)' }}
          >
            {idea.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3">
            {idea.authorPhoto && !imgErr ? (
              <img
                src={idea.authorPhoto}
                alt={idea.authorName}
                onError={() => setImgErr(true)}
                className="rounded-full object-cover"
                style={{ width: 44, height: 44 }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center text-white text-sm font-black"
                style={{ width: 44, height: 44, background: 'var(--color-secondary)' }}
              >
                {initials}
              </div>
            )}
            <div>
              <p className="text-white font-bold text-sm">{idea.authorName}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Posted{' '}
                {new Date(idea.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
                {idea.updatedAt !== idea.createdAt && (
                  <> · Updated {new Date(idea.updatedAt).toLocaleDateString()}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8" style={{ borderColor: '#e5e7eb' }}>
              <h2
                className="font-black text-xl mb-5"
                style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
              >
                Description
              </h2>
              <p
                className="text-gray-700 leading-relaxed text-base"
                style={{ whiteSpace: 'pre-line' }}
              >
                {idea.fullDescription}
              </p>
            </div>

            {/* Comments */}
            {id && <CommentSection ideaId={id} />}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--color-primary)' }}>
                About this Idea
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Posted by</p>
                  <p className="font-semibold text-gray-800">{idea.authorName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-gray-700">
                    {new Date(idea.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Comments</p>
                  <p className="text-gray-700">{idea.commentCount ?? 0}</p>
                </div>
                {idea.tags?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#eff6ff', color: '#1d4ed8' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
