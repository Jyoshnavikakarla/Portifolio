import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, Loader2, Upload, ExternalLink, FileText } from 'lucide-react';
import { supabase, type Certificate } from '@/lib/supabase';
import { uploadFile } from '@/lib/upload';

type CertForm = {
  name: string;
  issuing_organization: string;
  date: string;
  image_url: string;
  credential_url: string;
  description: string;
  sort_order: number;
};

const EMPTY_FORM: CertForm = {
  name: '',
  issuing_organization: '',
  date: '',
  image_url: '',
  credential_url: '',
  description: '',
  sort_order: 0,
};

export function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const fetchCerts = useCallback(async () => {
    const { data } = await supabase.from('certificates').select('*').order('sort_order');
    setCertificates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setForm({
      name: cert.name,
      issuing_organization: cert.issuing_organization,
      date: cert.date || '',
      image_url: cert.image_url || '',
      credential_url: cert.credential_url || '',
      description: cert.description || '',
      sort_order: cert.sort_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      issuing_organization: form.issuing_organization,
      date: form.date || null,
      image_url: form.image_url || null,
      credential_url: form.credential_url || null,
      description: form.description || null,
      sort_order: form.sort_order,
    };

    if (editingId) {
      await supabase.from('certificates').update(payload).eq('id', editingId);
    } else {
      await supabase.from('certificates').insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    fetchCerts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('certificates').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchCerts();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const { url, error } = await uploadFile(file, 'certificates', setUploadProgress);
    if (error) {
      alert(error);
    } else if (url) {
      setForm({ ...form, image_url: url });
    }
    setUploading(false);
  };

  const filtered = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuing_organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your certifications and credentials.</p>
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
          Add Certificate
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          placeholder="Search certificates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-zinc-500">No certificates found. Click "Add Certificate" to create one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cert) => (
            <div key={cert.id} className="glass rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {cert.image_url ? (
                    <img src={cert.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <FileText className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white truncate">{cert.name}</h3>
                  <p className="text-xs text-zinc-500 truncate">{cert.issuing_organization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                {cert.image_url && (
                  <a
                    href={cert.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="View certificate"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg transition-colors"
                    title="Verify credential"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors ml-auto"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(cert.id)}
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
          <div className="glass rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#18181b]/95 backdrop-blur p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Certificate' : 'Add Certificate'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Certificate Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                  placeholder="Certificate name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Issuing Organization *</label>
                  <input
                    required
                    value={form.issuing_organization}
                    onChange={(e) => setForm({ ...form, issuing_organization: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Date</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                    placeholder="e.g., June 2025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors resize-none"
                  placeholder="Brief description of the certification"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Certificate File (PDF, JPG, PNG)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-lg text-sm text-zinc-300 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload File
                    <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {uploading && (
                    <div className="flex-1">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#6366f1] transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
                {form.image_url && (
                  <div className="mt-2 flex items-center gap-3">
                    {form.image_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                      <img src={form.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-white/5 rounded-lg">
                        <FileText className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: '' })}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Credential / Verification URL</label>
                <input
                  type="url"
                  value={form.credential_url}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                  placeholder="https://verify.example.com/..."
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
                  {editingId ? 'Save Changes' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="glass rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Certificate?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              This action cannot be undone. The certificate will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
