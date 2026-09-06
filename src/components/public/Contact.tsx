import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { SocialLinks } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Contact({ socialLinks }: { socialLinks: SocialLinks | null }) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const github = socialLinks?.github_url || '';
  const linkedin = socialLinks?.linkedin_url || '';
  const email = socialLinks?.email || '';

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            08 / Contact
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            LET'S BUILD SOMETHING MEANINGFUL.
          </h2>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <p className="text-zinc-400 leading-relaxed mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be
              part of your vision. Feel free to reach out.
            </p>

            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 glass glass-hover rounded-xl p-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono">EMAIL</p>
                  <p className="text-sm text-white">{email}</p>
                </div>
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 glass glass-hover rounded-xl p-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono">LINKEDIN</p>
                  <p className="text-sm text-white truncate">{linkedin}</p>
                </div>
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 glass glass-hover rounded-xl p-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono">GITHUB</p>
                  <p className="text-sm text-white truncate">{github}</p>
                </div>
              </a>
            )}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass rounded-xl p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5 font-mono">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-colors"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5 font-mono">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-colors"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-mono">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-colors"
                placeholder="What's this about?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-mono">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-colors resize-none"
                placeholder="Your message..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SENDING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SEND MESSAGE
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-sm text-indigo-400">
                <CheckCircle className="w-4 h-4" />
                Message sent successfully. I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                Something went wrong. Please try again or email directly.
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
