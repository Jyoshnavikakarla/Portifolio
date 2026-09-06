import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'INITIALIZING JKV.LAB...', delay: 0 },
  { text: 'Loading skills........ ✓', delay: 400 },
  { text: 'Loading projects...... ✓', delay: 700 },
  { text: 'Loading experiments.... ✓', delay: 1000 },
  { text: 'Loading archive........ ✓', delay: 1300 },
  { text: 'SYSTEM READY', delay: 1700 },
];

export function CinematicIntro({ onEnter }: { onEnter: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showEnter, setShowEnter] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          if (!skipped) setVisibleLines(i + 1);
        }, line.delay)
      );
    });
    timers.push(
      setTimeout(() => {
        if (!skipped) setShowEnter(true);
      }, 2100)
    );
    return () => timers.forEach(clearTimeout);
  }, [skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setVisibleLines(BOOT_LINES.length);
    setShowEnter(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#07070a] bg-grid flex items-center justify-center"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSkip}
          className="text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors"
        >
          SKIP INTRO →
        </button>
      </div>

      <div className="w-full max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono text-indigo-400 tracking-widest">JKV.LAB v2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Jyoshnavi K V
          </h1>
        </motion.div>

        <div className="font-mono text-sm space-y-1.5 min-h-[180px]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={
                line.text === 'SYSTEM READY'
                  ? 'text-indigo-400 font-semibold'
                  : 'text-zinc-500'
              }
            >
              {line.text === 'SYSTEM READY' ? (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {line.text}
                </span>
              ) : (
                <span>{'>'} {line.text}</span>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showEnter && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onClick={onEnter}
              className="mt-8 group relative px-8 py-3.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg overflow-hidden hover:bg-indigo-500 transition-colors"
            >
              <span className="relative z-10 flex items-center gap-2 font-mono tracking-wide">
                ENTER THE LAB
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
