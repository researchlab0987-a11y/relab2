import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc, orderBy, query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Publication } from '../types';

const emptyPub = (): Omit<Publication, 'id' | 'createdAt'> => ({
  title: '', authors: '', journal: '', year: new Date().getFullYear(),
  abstract: '', url: '', doi: '', type: 'published', tags: [],
});

const ManagePublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Publication | Omit<Publication, 'id' | 'createdAt'> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'ongoing' | 'published'>('all');

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'publications'), orderBy('year', 'desc')));
    setPublications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Publication)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await addDoc(collection(db, 'publications'), {
          ...modal.data,
          createdAt: new Date().toISOString(),
        });
      } else {
        const { id, ...data } = modal.data as Publication;
        await updateDoc(doc(db, 'publications', id), data as any);
      }
      setModal(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Publication) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await deleteDoc(doc(db, 'publications', p.id));
    load();
  };

  const filtered = publications.filter((p) => filterType === 'all' || p.type === filterType);

  const setField = (k: string, v: any) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [k]: v } } : null);

  const inp = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none';
  const inpStyle = { borderColor: '#e5e7eb' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>Manage Publications</h2>
          <p className="text-sm text-gray-500 mt-1">{publications.length} publications total</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', data: emptyPub() })}
          className="text-sm font-bold px-5 py-2.5 rounded-xl text-white border-none cursor-pointer"
          style={{ background: 'var(--color-primary)' }}
        >
          + Add Publication
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'ongoing', 'published'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className="text-sm font-semibold px-4 py-1.5 rounded-xl border cursor-pointer capitalize"
            style={{
              background: filterType === t ? 'var(--color-primary)' : 'white',
              color: filterType === t ? 'white' : '#374151',
              borderColor: filterType === t ? 'var(--color-primary)' : '#e5e7eb',
            }}
          >
            {t} ({t === 'all' ? publications.length : publications.filter((p) => p.type === t).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border flex items-start gap-4" style={{ borderColor: '#e5e7eb', borderLeft: `4px solid ${p.type === 'ongoing' ? '#f59e0b' : '#2563eb'}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: p.type === 'ongoing' ? '#fef3c7' : '#dbeafe', color: p.type === 'ongoing' ? '#92400e' : '#1e40af' }}>
                    {p.type}
                  </span>
                  <span className="text-xs text-gray-400">{p.year}</span>
                </div>
                <p className="font-bold text-gray-900 text-sm leading-snug">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.authors}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-secondary)' }}>{p.journal}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setModal({ mode: 'edit', data: p })}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-white cursor-pointer border-none"
                  style={{ background: 'var(--color-primary)' }}
                >Edit</button>
                <button
                  onClick={() => remove(p)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-white cursor-pointer border-none"
                  style={{ background: '#ef4444' }}
                >Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No publications found.</p>}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--color-primary)' }}>
              <h3 className="text-white font-black text-lg">{modal.mode === 'add' ? 'Add Publication' : 'Edit Publication'}</h3>
              <button onClick={() => setModal(null)} className="text-white text-2xl bg-transparent border-none cursor-pointer">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                <input className={inp} style={inpStyle} value={(modal.data as any).title} onChange={(e) => setField('title', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Authors</label>
                <input className={inp} style={inpStyle} value={(modal.data as any).authors} onChange={(e) => setField('authors', e.target.value)} placeholder="Rahman, M.R., Siddiqui, A., ..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Journal / Venue</label>
                  <input className={inp} style={inpStyle} value={(modal.data as any).journal} onChange={(e) => setField('journal', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
                  <input type="number" className={inp} style={inpStyle} value={(modal.data as any).year} onChange={(e) => setField('year', +e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                  <select className={inp} style={inpStyle} value={(modal.data as any).type} onChange={(e) => setField('type', e.target.value)}>
                    <option value="published">Published</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">DOI</label>
                  <input className={inp} style={inpStyle} value={(modal.data as any).doi} onChange={(e) => setField('doi', e.target.value)} placeholder="10.1000/xyz123" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL</label>
                <input type="url" className={inp} style={inpStyle} value={(modal.data as any).url} onChange={(e) => setField('url', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Abstract</label>
                <textarea rows={4} className={inp} style={{ ...inpStyle, resize: 'vertical' }} value={(modal.data as any).abstract} onChange={(e) => setField('abstract', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (comma separated)</label>
                <input className={inp} style={inpStyle}
                  value={((modal.data as any).tags ?? []).join(', ')}
                  onChange={(e) => setField('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(null)} className="text-sm font-semibold px-5 py-2 rounded-xl border cursor-pointer" style={{ borderColor: '#d1d5db', background: 'white', color: '#374151' }}>Cancel</button>
                <button onClick={save} disabled={saving} className="text-sm font-bold px-6 py-2 rounded-xl text-white disabled:opacity-60 border-none cursor-pointer" style={{ background: 'var(--color-primary)' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePublications;
