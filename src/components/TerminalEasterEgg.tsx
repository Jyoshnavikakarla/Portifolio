import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import type { Project, Certificate, SocialLinks, SiteSettings } from '@/lib/supabase';

type Props = {
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLinks | null;
  siteSettings: SiteSettings | null;
};

type Entry = { type: 'input' | 'output'; text: string };

export function TerminalEasterEgg({ projects, certificates, socialLinks, siteSettings }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Entry[]>([
    { type: 'output', text: 'JKV.LAB Terminal v2.0 — Type "help" for commands.' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const output: string[] = [];

    switch (trimmed) {
      case 'help':
        output.push('Available commands:');
        output.push('  about       — Navigate to About section');
        output.push('  skills      — Navigate to Skills section');
        output.push('  projects    — Navigate to Projects section');
        output.push('  certificates — Navigate to Certificates section');
        output.push('  resume      — Navigate to Resume section');
        output.push('  contact     — Navigate to Contact section');
        output.push('  hire_jyoshnavi — Navigate to Contact section');
        output.push('  clear       — Clear terminal');
        output.push('  exit        — Close terminal');
        break;
      case 'about':
        output.push('→ Navigating to About section...');
        setTimeout(() => scrollToSection('#about'), 300);
        break;
      case 'skills':
        output.push('→ Navigating to Skills section...');
        setTimeout(() => scrollToSection('#skills'), 300);
        break;
      case 'projects':
        output.push('→ Navigating to Projects section...');
        setTimeout(() => scrollToSection('#projects'), 300);
        break;
      case 'certificates':
        output.push('→ Navigating to Certificates section...');
        setTimeout(() => scrollToSection('#certifications'), 300);
        break;
      case 'resume':
        output.push('→ Navigating to Resume section...');
        setTimeout(() => scrollToSection('#resume'), 300);
        break;
      case 'contact':
      case 'hire_jyoshnavi':
        output.push('→ Navigating to Contact section...');
        setTimeout(() => scrollToSection('#contact'), 300);
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'exit':
        setOpen(false);
        return;
      case 'whoami':
        output.push('Jyoshnavi K V — Computer Science Engineer & Full-Stack Developer');
        break;
      case 'ls':
        output.push('about/  skills/  projects/  certifications/  resume/  contact/');
        break;
      default:
        output.push(`Command not found: ${trimmed}. Type "help" for available commands.`);
    }

    setHistory((prev) => [
      { type: 'input', text: trimmed },
      ...output.map((t) => ({ type: 'output' as const, text: t })),
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[150] p-3 glass-strong rounded-xl text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all group"
        aria-label="Open terminal"
        title="Open terminal"
      >
        <TerminalIcon className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-[200] w-[90vw] max-w-md glass-strong rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0c0c11]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs font-mono text-zinc-500 ml-2">jkv@lab: ~</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
              {history.map((entry, i) => (
                <div
                  key={i}
                  className={entry.type === 'input' ? 'text-indigo-400' : 'text-zinc-400'}
                >
                  {entry.type === 'input' ? `$ ${entry.text}` : entry.text}
                </div>
              ))}
              <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-2">
                <span className="text-indigo-400">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-zinc-300 outline-none font-mono text-xs"
                  placeholder="Type a command..."
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
