import React, { useState } from 'react';
import {
  addDoc, deleteDoc, doc, collection, serverTimestamp, updateDoc, increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useComments } from '../firebase/hooks';
import { useAuth } from '../context/AuthContext';
import type { Comment } from '../types';

interface Props {
  ideaId: string;
}

const CommentSection: React.FC<Props> = ({ ideaId }) => {
  const { comments, loading } = useComments(ideaId);
  const { appUser, role } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canComment = role === 'collaborator' || role === 'admin';

  const submit = async () => {
    if (!text.trim() || !appUser) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        ideaId,
        authorId: appUser.uid,
        authorName: appUser.name,
        authorPhoto: '',    // populated from collaborator profile if needed
        content: text.trim(),
        createdAt: new Date().toISOString(),
      });
      // Increment comment count on the idea
      await updateDoc(doc(db, 'researchIdeas', ideaId), {
        commentCount: increment(1),
      });
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (comment: Comment) => {
    if (!window.confirm('Delete this comment?')) return;
    await deleteDoc(doc(db, 'comments', comment.id));
    await updateDoc(doc(db, 'researchIdeas', ideaId), {
      commentCount: increment(-1),
    });
  };

  const canDelete = (comment: Comment) =>
    role === 'admin' || appUser?.uid === comment.authorId;

  return (
    <div>
      <h3 className="font-black text-xl mb-6" style={{ color: 'var(--color-primary)' }}>
        Comments ({comments.length})
      </h3>

      {/* Comment Input */}
      {canComment ? (
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6" style={{ borderColor: '#e5e7eb' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            rows={3}
            className="w-full text-sm resize-none outline-none text-gray-700"
            style={{ border: 'none', fontFamily: 'var(--font-body)' }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submit}
              disabled={submitting || !text.trim()}
              className="text-sm font-bold px-4 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ background: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic mb-6 p-4 bg-gray-50 rounded-lg">
          Only collaborators can post comments.
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              canDelete={canDelete(c)}
              onDelete={() => deleteComment(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  canDelete: boolean;
  onDelete: () => void;
}> = ({ comment, canDelete, onDelete }) => {
  const initials = comment.authorName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: '#f0f0f0' }}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {comment.authorPhoto ? (
          <img
            src={comment.authorPhoto}
            alt={comment.authorName}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 36, height: 36 }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ width: 36, height: 36, background: 'var(--color-primary)' }}
          >
            {initials}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="text-sm font-bold text-gray-800">{comment.authorName}</span>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            {canDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer p-0 font-semibold"
              >
                Delete
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
