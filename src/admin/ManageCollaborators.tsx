import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import CloudinaryUpload from '../components/CloudinaryUpload';
import type { CollaboratorProfile, CollaboratorPublication, CloudinaryUploadResult } from '../types';

const ManageCollaborators: React.FC = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CollaboratorProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'collaborators'), orderBy('order', 'asc')));
    setCollaborators(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CollaboratorProfile)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (c: CollaboratorProfile) => {
    await updateDoc(doc(db, 'collaborators', c.id), { isActive: !c.isActive });
    load();
  };

  const remove = async (c: CollaboratorProfile) => {
    if (!window.confirm(`Remove ${c.name} from collaborators? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'collaborators', c.id));
    load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, ...data } = editing;
      await updateDoc(doc(db, 'collaborators', id), data as any);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (editing) return <EditForm collaborator={editing} onChange={setEditing} onSave={saveEdit} onCancel={() => setEditing(null)} saving={saving} />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>Manage Collaborators</h2>
        <p className="text-sm text-gray-500 mt-1">{collaborators.length} collaborators total</p>
      </div>

      <div className="flex flex-col gap-3">
        {collaborators.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e5e7eb' }}>
            {c.photo ? (
              <img src={c.photo} alt={c.name} className="rounded-full object-cover flex-shrink-0" style={{ width: 50, height: 50 }} />
            ) : (
              <div className="rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
                style={{ width: 50, height: 50, background: 'var(--color-primary)' }}>
                {c.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.designation} · {c.affiliation}</p>
              <p className="text-xs text-gray-400">{c.publications?.length ?? 0} publications listed</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{
                  background: c.isActive ? '#dcfce7' : '#fee2e2',
                  color: c.isActive ? '#166534' : '#991b1b',
                }}
              >
                {c.isActive ? 'Visible' : 'Hidden'}
              </span>
              <button
                onClick={() => toggleActive(c)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer"
                style={{ borderColor: '#d1d5db', background: 'white', color: '#374151' }}
              >
                {c.isActive ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => setEditing(c)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white cursor-pointer border-none"
                style={{ background: 'var(--color-primary)' }}
              >
                Edit
              </button>
              <button
                onClick={() => remove(c)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white cursor-pointer border-none"
                style={{ background: '#ef4444' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Edit Form ──────────────────────────────────────────────────
const EditForm: React.FC<{
  collaborator: CollaboratorProfile;
  onChange: (c: CollaboratorProfile) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}> = ({ collaborator: c, onChange, onSave, onCancel, saving }) => {
  const set = (k: keyof CollaboratorProfile, v: any) => onChange({ ...c, [k]: v });

  const updatePub = (i: number, k: keyof CollaboratorPublication, v: string | number) => {
    const pubs = [...(c.publications ?? [])];
    pubs[i] = { ...pubs[i], [k]: v };
    set('publications', pubs);
  };

  const addPub = () =>
    set('publications', [
      ...(c.publications ?? []),
      { id: Date.now().toString(), title: '', journal: '', year: new Date().getFullYear(), url: '' },
    ]);

  const removePub = (i: number) =>
    set('publications', (c.publications ?? []).filter((_, idx) => idx !== i));

  const inp = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none';
  const inpStyle = { borderColor: '#e5e7eb' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>Edit: {c.name}</h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="text-sm font-semibold px-5 py-2 rounded-xl border cursor-pointer"
            style={{ borderColor: '#d1d5db', background: 'white', color: '#374151' }}>Cancel</button>
          <button onClick={onSave} disabled={saving} className="text-sm font-bold px-5 py-2 rounded-xl text-white disabled:opacity-60 cursor-pointer border-none"
            style={{ background: 'var(--color-primary)' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {([['name', 'Name'], ['designation', 'Designation'], ['affiliation', 'Affiliation'], ['linkedin', 'LinkedIn'], ['orcid', 'ORCID'], ['scholar', 'Google Scholar'], ['researchgate', 'ResearchGate'], ['facebook', 'Facebook']] as const).map(([k, label]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
              <input className={inp} style={inpStyle} value={(c as any)[k] ?? ''} onChange={(e) => set(k as any, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio</label>
          <textarea rows={5} className={inp} style={{ ...inpStyle, resize: 'vertical' }}
            value={c.bio ?? ''} onChange={(e) => set('bio', e.target.value)} />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Research Interests (comma separated)
          </label>
          <input className={inp} style={inpStyle}
            value={(c.researchInterests ?? []).join(', ')}
            onChange={(e) => set('researchInterests', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        </div>

        <CloudinaryUpload
          label="Profile Photo"
          currentUrl={c.photo}
          onUpload={(r: CloudinaryUploadResult) => set('photo', r.secure_url)}
        />

        {/* Publications */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-700">Publications</label>
            <button onClick={addPub} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-secondary)' }}>+ Add</button>
          </div>
          {(c.publications ?? []).map((p, i) => (
            <div key={p.id} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <input className={`${inp} col-span-2`} style={inpStyle} placeholder="Title" value={p.title} onChange={(e) => updatePub(i, 'title', e.target.value)} />
              <input className={inp} style={inpStyle} placeholder="Journal" value={p.journal} onChange={(e) => updatePub(i, 'journal', e.target.value)} />
              <div className="flex gap-1">
                <input className={inp} style={inpStyle} placeholder="Year" type="number" value={p.year} onChange={(e) => updatePub(i, 'year', +e.target.value)} />
                <button onClick={() => removePub(i)} className="text-red-400 bg-transparent border-none cursor-pointer text-lg leading-none">×</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
          <label className="text-sm font-semibold text-gray-700">Visibility</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={c.isActive} onChange={(e) => set('isActive', e.target.checked)} />
            <span className="text-sm text-gray-600">Show on Collaborators page</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ManageCollaborators;
