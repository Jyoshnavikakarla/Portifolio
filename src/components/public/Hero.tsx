import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, FileDown, Terminal } from 'lucide-react';
import type { SocialLinks, SiteSettings } from '@/lib/supabase';

const HERO_SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'OpenCV'];

const TERMINAL_LINES = [
  { label: 'system.status', value: '"online"', color: 'text-green-400' },
  { label: 'projects.loaded', value: '3', color: 'text-indigo-400' },
  { label: 'curiosity.level', value: '"high"', color: 'text-indigo-400' },
  { label: 'mode', value: '"building"', color: 'text-indigo-400' },
];

export function Hero({
  socialLinks,
  siteSettings,
}: {
  socialLinks: SocialLinks | null;
  siteSettings: SiteSettings | null;
}) {
  const [typedLines, setTypedLines] = useState<number>(0);

  const github = socialLinks?.github_url || '';
  const linkedin = socialLinks?.linkedin_url || '';
  const email = socialLinks?.email || '';
  const resumeUrl = siteSettings?.resume_url || '';

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setTypedLines(i + 1), 300 + i * 400));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-12 bg-grid overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070a] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-zinc-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Available for opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
              JYOSHNAVI K V
            </h1>
            <p className="text-lg sm:text-xl text-indigo-400 font-medium mb-4 font-mono">
              Computer Science Engineer
              <span className="text-zinc-600 mx-2">|</span>
              Full-Stack Developer
            </p>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Building practical web applications, real-time systems and computer vision solutions.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {HERO_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-mono text-zinc-300 glass rounded-full border border-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/20"
              >
                VIEW PROJECTS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass glass-hover text-white font-semibold text-sm rounded-lg"
                >
                  <FileDown className="w-4 h-4" />
                  DOWNLOAD RESUME
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass text-zinc-600 font-semibold text-sm rounded-lg cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  RESUME COMING SOON
                </button>
              )}

              <div className="flex items-center gap-2 ml-1">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 glass glass-hover text-zinc-400 hover:text-white rounded-lg"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 glass glass-hover text-zinc-400 hover:text-white rounded-lg"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="p-2.5 glass glass-hover text-zinc-400 hover:text-white rounded-lg"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0c0c11]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5 ml-2 text-xs text-zinc-500 font-mono">
                  <Terminal className="w-3 h-3" />
                  jkv@lab: system
                </div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed min-h-[260px]">
                <div className="text-zinc-600 mb-3">{'>'} initializing system...</div>
                {TERMINAL_LINES.slice(0, typedLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 mb-1.5"
                  >
                    <span className="text-zinc-500">{line.label}</span>
                    <span className="text-zinc-600">=</span>
                    <span className={line.color}>{line.value}</span>
                  </motion.div>
                ))}
                {typedLines >= TERMINAL_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    <span className="text-green-400">{'>'} </span>
                    <span className="text-zinc-500">system ready</span>
                    <span className="inline-block w-2 h-4 bg-indigo-500 animate-blink ml-1" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
