import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import type { Education as EducationType } from '@/lib/supabase';

export function Education({ education }: { education: EducationType[] }) {
  const sorted = [...education].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="education" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            05 / Education
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">EDUCATION TIMELINE</h2>
        </motion.div>

        {education.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center mt-12">
            <GraduationCap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No education entries yet.</p>
          </div>
        ) : (
          <div className="mt-12 relative">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-white/10 to-transparent" />

            <div className="space-y-6">
              {sorted.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative pl-12 sm:pl-16"
                >
                  <div className="absolute left-2.5 sm:left-5 top-6 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-[#07070a]" />

                  <div className="glass glass-hover rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="w-4 h-4 text-zinc-600" />
                        {edu.institution}
                      </div>
                      {edu.graduation_year && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="w-4 h-4 text-zinc-600" />
                          {edu.graduation_year}
                        </div>
                      )}
                      {edu.score && (
                        <div className="flex items-center gap-2 text-sm text-indigo-400 font-mono">
                          <Award className="w-4 h-4" />
                          {edu.score}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
