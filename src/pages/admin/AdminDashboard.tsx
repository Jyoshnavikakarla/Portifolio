import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Award, Star, Mail, ArrowRight, Link2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, certificates: 0, featured: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [projectsRes, certsRes, featuredRes, messagesRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        certificates: certsRes.count || 0,
        featured: featuredRes.count || 0,
        messages: messagesRes.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderGit2, href: '/admin/dashboard/projects', color: 'text-[#6366f1]' },
    { label: 'Total Certificates', value: stats.certificates, icon: Award, href: '/admin/dashboard/certificates', color: 'text-blue-400' },
    { label: 'Featured Projects', value: stats.featured, icon: Star, href: '/admin/dashboard/projects', color: 'text-yellow-400' },
    { label: 'Unread Messages', value: stats.messages, icon: Mail, href: '/admin/dashboard/messages', color: 'text-purple-400' },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your portfolio content.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.href}
                className="glass glass-hover rounded-xl p-6 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{card.label}</p>
              </Link>
            ))}
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link
                to="/admin/dashboard/projects"
                className="flex items-center gap-2 px-4 py-3 glass glass-hover rounded-lg text-sm text-zinc-300"
              >
                <FolderGit2 className="w-4 h-4 text-[#6366f1]" />
                Manage Projects
              </Link>
              <Link
                to="/admin/dashboard/certificates"
                className="flex items-center gap-2 px-4 py-3 glass glass-hover rounded-lg text-sm text-zinc-300"
              >
                <Award className="w-4 h-4 text-blue-400" />
                Manage Certificates
              </Link>
              <Link
                to="/admin/dashboard/social"
                className="flex items-center gap-2 px-4 py-3 glass glass-hover rounded-lg text-sm text-zinc-300"
              >
                <Link2 className="w-4 h-4 text-purple-400" />
                Update Social Links
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
