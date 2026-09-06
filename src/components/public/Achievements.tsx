import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Achievement } from '@/lib/supabase';

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  const sorted = [...achievements].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="achievements" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            06 / Achievements
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">ACHIEVEMENTS</h2>
        </motion.div>

        {achievements.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center mt-12">
            <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No achievements added yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {sorted.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass glass-hover rounded-xl p-6 flex gap-4"
              >
                <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">{achievement.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
