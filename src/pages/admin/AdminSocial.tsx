import { useEffect, useState } from 'react';
import { Loader2, Check, Plus, Trash2, Github, Linkedin, Mail } from 'lucide-react';
import { supabase, type SocialLinks } from '@/lib/supabase';

export function AdminSocial() {
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [otherLinks, setOtherLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase.from('social_links').select('*').maybeSingle();
      if (data) {
        setLinks(data as SocialLinks);
        setGithub(data.github_url || '');
        setLinkedin(data.linkedin_url || '');
        setEmail(data.email || '');
        setOtherLinks(data.other_links || []);
      }
      setLoading(false);
    }
    fetchLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const payload = {
      github_url: github || null,
      linkedin_url: linkedin || null,
      email: email || null,
      other_links: otherLinks.filter((l) => l.label && l.url),
      updated_at: new Date().toISOString(),
    };

    if (links) {
      await supabase.from('social_links').update(payload).eq('id', links.id);
    } else {
      await supabase.from('social_links').insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <h1 className="text-2xl font-bold text-white">Social Links</h1>
        <p className="mt-1 text-sm text-zinc-500">Update your social and professional links.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">GitHub URL</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">LinkedIn URL</label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Other Professional Links</label>
          <div className="space-y-2">
            {otherLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...otherLinks];
                    updated[idx] = { ...link, label: e.target.value };
                    setOtherLinks(updated);
                  }}
                  className="w-32 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                  placeholder="Label"
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...otherLinks];
                    updated[idx] = { ...link, url: e.target.value };
                    setOtherLinks(updated);
                  }}
                  className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366f1]/40 transition-colors"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => setOtherLinks(otherLinks.filter((_, i) => i !== idx))}
                  className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOtherLinks([...otherLinks, { label: '', url: '' }])}
              className="flex items-center gap-1.5 text-xs text-[#6366f1] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Link
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white font-semibold text-sm rounded-lg hover:bg-[#4f46e5] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </button>
          {saved && <span className="text-sm text-[#6366f1]">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
