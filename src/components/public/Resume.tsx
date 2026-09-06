import { motion } from 'framer-motion';
import { FileDown, Eye, FileText } from 'lucide-react';
import type { SiteSettings } from '@/lib/supabase';

export function Resume({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const resumeUrl = siteSettings?.resume_url || '';

  return (
    <section id="resume" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid-fine opacity-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            07 / Resume
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">RESUME</h2>
          <p className="mt-3 text-zinc-400 max-w-xl">
            Explore my experience, projects and technical background.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 glass rounded-2xl p-8 sm:p-12 text-center"
        >
          <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6">
            <FileText className="w-10 h-10" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {resumeUrl ? (
              <>
                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/20"
                >
                  <FileDown className="w-4 h-4" />
                  DOWNLOAD RESUME
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass glass-hover text-white font-semibold text-sm rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                  VIEW RESUME
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass text-zinc-600 font-semibold text-sm rounded-lg cursor-not-allowed">
                  <FileDown className="w-4 h-4" />
                  RESUME COMING SOON
                </div>
                <p className="text-xs text-zinc-600">
                  The resume will be available once uploaded through the admin dashboard.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
