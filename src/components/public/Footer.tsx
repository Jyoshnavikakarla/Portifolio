import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Lock } from 'lucide-react';
import type { SocialLinks } from '@/lib/supabase';

export function Footer({ socialLinks }: { socialLinks: SocialLinks | null }) {
  const github = socialLinks?.github_url || '';
  const linkedin = socialLinks?.linkedin_url || '';
  const email = socialLinks?.email || '';

  return (
    <footer className="border-t border-white/5 bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white font-mono">
              JKV<span className="text-indigo-500">.LAB</span>
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Building, learning and solving problems through code.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass glass-hover text-zinc-400 hover:text-white" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass glass-hover text-zinc-400 hover:text-white" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="p-2.5 rounded-lg glass glass-hover text-zinc-400 hover:text-white" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            )}
            <Link to="/admin" className="p-2.5 rounded-lg glass glass-hover text-zinc-500 hover:text-indigo-400" aria-label="Admin Dashboard">
              <Lock className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-zinc-600">
            &copy; 2026 Jyoshnavi K V. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
