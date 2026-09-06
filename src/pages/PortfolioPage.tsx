import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Hero } from '@/components/public/Hero';
import { About } from '@/components/public/About';
import { Skills } from '@/components/public/Skills';
import { Projects } from '@/components/public/Projects';
import { Certifications } from '@/components/public/Certifications';
import { Education } from '@/components/public/Education';
import { Achievements } from '@/components/public/Achievements';
import { Resume } from '@/components/public/Resume';
import { Contact } from '@/components/public/Contact';
import { CinematicIntro } from '@/components/CinematicIntro';
import { CustomCursor } from '@/components/CustomCursor';
import { TerminalEasterEgg } from '@/components/TerminalEasterEgg';
import { supabase, type Project, type Certificate, type Achievement, type Education as EducationType, type SocialLinks, type SiteSettings } from '@/lib/supabase';

export function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [education, setEducation] = useState<EducationType[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('jkv-intro-seen');
    if (!seen) setShowIntro(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.allSettled([
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('certificates').select('*').order('sort_order'),
        supabase.from('achievements').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order'),
        supabase.from('social_links').select('*').maybeSingle(),
        supabase.from('site_settings').select('*').maybeSingle(),
      ]);

      const [p, c, a, e, s, ss] = results;
      if (p.status === 'fulfilled') setProjects(p.value.data || []);
      if (c.status === 'fulfilled') setCertificates(c.value.data || []);
      if (a.status === 'fulfilled') setAchievements(a.value.data || []);
      if (e.status === 'fulfilled') setEducation(e.value.data || []);
      if (s.status === 'fulfilled') setSocialLinks(s.value.data as SocialLinks | null);
      if (ss.status === 'fulfilled') setSiteSettings(ss.value.data as SiteSettings | null);

      if (results.some((r) => r.status === 'rejected')) {
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('jkv-intro-seen', 'true');
    setShowIntro(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500 font-mono">Loading JKV.LAB...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center p-6">
        <div className="glass-strong rounded-xl p-8 text-center max-w-md">
          <p className="text-zinc-400 mb-2">Unable to load portfolio content.</p>
          <p className="text-sm text-zinc-600 mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {showIntro && <CinematicIntro onEnter={handleEnter} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: showIntro ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-[#07070a]"
      >
        <Navbar />
        <main>
          <Hero socialLinks={socialLinks} siteSettings={siteSettings} />
          <About />
          <Skills />
          <Projects projects={projects} />
          <Certifications certificates={certificates} />
          <Education education={education} />
          <Achievements achievements={achievements} />
          <Resume siteSettings={siteSettings} />
          <Contact socialLinks={socialLinks} />
        </main>
        <Footer socialLinks={socialLinks} />
        <TerminalEasterEgg
          projects={projects}
          certificates={certificates}
          socialLinks={socialLinks}
          siteSettings={siteSettings}
        />
      </motion.div>
    </>
  );
}
