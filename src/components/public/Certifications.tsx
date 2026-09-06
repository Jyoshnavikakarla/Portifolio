import { motion } from 'framer-motion';
import { Award, ExternalLink, FileText, Clock, FolderOpen } from 'lucide-react';
import type { Certificate } from '@/lib/supabase';

export function Certifications({ certificates }: { certificates: Certificate[] }) {
  const sorted = [...certificates].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="certifications" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid-fine opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            04 / Archive
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">JKV ARCHIVE</h2>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Certified credentials and professional certifications.
          </p>
        </motion.div>

        {certificates.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center mt-12">
            <Award className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No certificates in the archive yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass glass-hover rounded-xl p-5 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white leading-snug">{cert.name}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">{cert.issuing_organization}</p>
                  </div>
                </div>

                {cert.date && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {cert.date}
                  </div>
                )}

                {cert.description && (
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">
                    {cert.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  {cert.image_url ? (
                    <a
                      href={cert.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      OPEN
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-600 bg-white/[0.02] rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      COMING SOON
                    </span>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      VERIFY
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
