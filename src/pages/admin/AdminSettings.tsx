import { useEffect, useState } from 'react';
import { Loader2, Check, Upload, FileText, Eye, FileDown } from 'lucide-react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { uploadFile } from '@/lib/upload';

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').maybeSingle();
      if (data) {
        setSettings(data as SiteSettings);
        setResumeUrl(data.resume_url || '');
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const payload = {
      resume_url: resumeUrl || null,
      updated_at: new Date().toISOString(),
    };

    if (settings) {
      await supabase.from('site_settings').update(payload).eq('id', settings.id);
    } else {
      await supabase.from('site_settings').insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fileExt = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    setUploadProgress(10);
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    setUploadProgress(80);
    const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(filePath);
    setUploadProgress(100);
    setResumeUrl(urlData.publicUrl);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage site-wide settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Resume File</label>
          <p className="text-xs text-zinc-600 mb-3">
            Upload your resume (PDF, JPG, or PNG). This will be used for the download and view buttons on the public portfolio.
          </p>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-lg text-sm text-zinc-300 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Resume
              <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={handleResumeUpload} className="hidden" />
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

          {resumeUrl && (
            <div className="mt-3 flex items-center gap-3 p-3 glass rounded-lg">
              <FileText className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
              <span className="text-sm text-zinc-300 truncate flex-1">Resume uploaded</span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setResumeUrl('')}
                className="text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Or paste resume URL</label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white font-semibold text-sm rounded-lg hover:bg-[#4f46e5] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Settings
          </button>
          {saved && <span className="text-sm text-[#6366f1]">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
