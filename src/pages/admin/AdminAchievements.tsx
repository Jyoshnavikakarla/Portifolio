import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type Achievement } from '@/lib/supabase';

type AchievementForm = {
  title: string;
  description: string;
  sort_order: number;
};

const EMPTY_FORM: AchievementForm = {
  title: '',
  description: '',
  sort_order: 0,
};

export function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    const { data } = await supabase.from('achievements').select('*').order('sort_order');
    setAchievements(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setForm({
      title: achievement.title,
      description: achievement.description,
      sort_order: achievement.sort_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      sort_order: form.sort_order,
    };

    if (editingId) {
      await supabase.from('achievements').update(payload).eq('id', editingId);
    } else {
      await supabase.from('achievements').insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    fetchAchievements();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('achievements').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchAchievements();
  };

  const moveAchievement = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...achievements].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const achievement = sorted[idx];
    const swapAchievement = sorted[swapIdx];
    await Promise.all([
      supabase.from('achievements').update({ sort_order: swapAchievement.sort_order }).eq('id', achievement.id),
      supabase.from('achievements').update({ sort_order: achievement.sort_order }).eq('id', swapAchievement.id),
    ]);
    fetchAchievements();
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your achievements.</p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white font-semibold text-sm rounded-lg hover:bg-[#4f46e5] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-zinc-500">No achievements found. Click "Add Achievement" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveAchievement(achievement.id, 'up')}
                  className="p-1 text-zinc-600 hover:text-white"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveAchievement(achievement.id, 'down')}
                  className="p-1 text-zinc-600 hover:text-white"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white">{achievement.title}</h3>
                <p className="text-xs text-zinc-500 truncate">{achievement.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(achievement.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                  placeholder="Achievement title"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors resize-none"
                  placeholder="Description"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white font-semibold text-sm rounded-lg hover:bg-[#4f46e5] transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? 'Save Changes' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="glass rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Achievement?</h3>
            <p className="text-sm text-zinc-400 mb-6">This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
