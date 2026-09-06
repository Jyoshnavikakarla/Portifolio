import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'placeholder',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type ArchitectureNode = {
  id: string;
  label: string;
  level: number;
};

export type ArchitectureConnection = {
  from: string;
  to: string;
};

export type Architecture = {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
};

export type Project = {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  long_description: string | null;
  technologies: string[];
  features: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: string;
  sort_order: number;
  architecture: Architecture | null;
  created_at: string;
};

export type Certificate = {
  id: string;
  name: string;
  issuing_organization: string;
  date: string | null;
  image_url: string | null;
  credential_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  graduation_year: string | null;
  score: string | null;
  sort_order: number;
  created_at: string;
};

export type SocialLinks = {
  id: string;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  other_links: { label: string; url: string }[];
};

export type SiteSettings = {
  id: string;
  resume_url: string | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
