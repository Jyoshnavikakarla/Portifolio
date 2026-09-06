import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Star, Search, Loader2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type Project } from '@/lib/supabase';
import { uploadFile } from '@/lib/upload';

type ProjectForm = {
  title: string;
  slug: string;
  description: string;
  long_description: string;
  technologies: string;
  features: string;
  github_url: string;
  live_url: string;
  image_url: string;
  featured: boolean;
  category: string;
  sort_order: number;
};

const EMPTY_FORM: ProjectForm = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  technologies: '',
  features: '',
  github_url: '',
  live_url: '',
  image_url: '',
  featured: false,
  category: 'Web Application',
  sort_order: 0,
};

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      slug: project.slug || '',
      description: project.description,
      long_description: project.long_description || '',
      technologies: project.technologies.join(', '),
      features: project.features.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || '',
      featured: project.featured,
      category: project.category,
      sort_order: project.sort_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || null,
      description: form.description,
      long_description: form.long_description || null,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      image_url: form.image_url || null,
      featured: form.featured,
      category: form.category,
      sort_order: form.sort_order,
    };

    if (editingId) {
      await supabase.from('projects').update(payload).eq('id', editingId);
    } else {
      await supabase.from('projects').insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('projects').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const { url, error } = await uploadFile(file, 'project-images', setUploadProgress);
    if (error) {
      alert(error);
    } else if (url) {
      setForm({ ...form, image_url: url });
    }
    setUploading(false);
  };

  const moveProject = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((p) => p.id === id);
    if (idx < 0) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const project = sorted[idx];
    const swapProject = sorted[swapIdx];

    await Promise.all([
      supabase.from('projects').update({ sort_order: swapProject.sort_order }).eq('id', project.id),
      supabase.from('projects').update({ sort_order: project.sort_order }).eq('id', swapProject.id),
    ]);
    fetchProjects();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-colors";

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your portfolio projects.</p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-zinc-500">No projects found. Click "Add Project" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <div key={project.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveProject(project.id, 'up')}
                  className="p-1 text-zinc-600 hover:text-white"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveProject(project.id, 'down')}
                  className="p-1 text-zinc-600 hover:text-white"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {project.image_url ? (
                  <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-600">{project.sort_order}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white truncate">{project.title}</h3>
                  {project.featured && (
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{project.category}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(project.id)}
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
          <div className="glass-strong rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0c0c11]/95 backdrop-blur p-6 border-b border-white/5 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Project' : 'Add Project'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Project title" />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Slug (URL identifier)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="disaster-response" />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Short description" />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Long Description</label>
                <textarea rows={4} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Extended project description for the detail modal" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Technologies (comma-separated)</label>
                  <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className={inputClass} placeholder="React.js, Node.js, MongoDB" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} placeholder="Web Application" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Key Features (comma-separated)</label>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={inputClass} placeholder="Feature 1, Feature 2, Feature 3" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">GitHub URL</label>
                  <input type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Live Demo URL</label>
                  <input type="url" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Project Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-lg text-sm text-zinc-300 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploading && (
                    <div className="flex-1">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
                {form.image_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                    <button type="button" onClick={() => setForm({ ...form, image_url: '' })} className="text-xs text-red-400 hover:underline">Remove</button>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-indigo-500" />
                    <span className="text-sm text-zinc-300">Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="glass-strong rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-sm text-zinc-400 mb-6">This action cannot be undone. The project will be permanently removed.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
