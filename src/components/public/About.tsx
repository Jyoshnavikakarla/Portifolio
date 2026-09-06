import { motion } from 'framer-motion';
import { GraduationCap, Calendar, FolderGit2, Award } from 'lucide-react';

const STATS = [
  { value: '9.36', label: 'CGPA', icon: Award },
  { value: '2027', label: 'Expected Graduation', icon: Calendar },
  { value: '3', label: 'Technical Projects', icon: FolderGit2 },
];

const DETAILS = [
  { icon: GraduationCap, label: 'Field', value: 'Computer Science Engineering' },
  { icon: Calendar, label: 'Graduation', value: 'Expected 2027' },
  { icon: Award, label: 'CGPA', value: '9.36 / 10' },
];

export function About() {
  return (
    <section id="about" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid-fine opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            01 / About
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            ABOUT THE ENGINEER
          </h2>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass glass-hover rounded-xl p-6 text-center group"
              >
                <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                <p className="text-3xl sm:text-4xl font-bold text-white font-mono">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-xl p-6 sm:p-8"
          >
            <p className="text-zinc-300 text-lg leading-relaxed mb-4">
              Jyoshnavi is a Computer Science Engineering student with foundational expertise in
              full-stack web development, computer vision, and core computer science concepts.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Currently pursuing a B.E. in Computer Science at Garden City University, Bangalore,
              with a CGPA of 9.36/10. Focused on building practical, real-world applications — from
              real-time crisis coordination platforms to computer vision tools.
            </p>

            <div className="mt-6 space-y-2.5">
              {DETAILS.map((detail) => (
                <div key={detail.label} className="flex items-center gap-3 text-sm">
                  <detail.icon className="w-4 h-4 text-indigo-500/70" />
                  <span className="text-zinc-500 w-28">{detail.label}</span>
                  <span className="text-zinc-300">{detail.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
