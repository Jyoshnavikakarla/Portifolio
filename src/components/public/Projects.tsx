import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  ExternalLink,
  X,
  Star,
  FolderGit2,
  Check,
  AlertTriangle,
  MapPin,
  Shield,
  Database,
  Activity,
  Search,
  Film,
} from 'lucide-react';
import type { Project, Architecture } from '@/lib/supabase';
import { DrawingCanvas } from './DrawingCanvas';

export function Projects({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="projects" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            03 / Experiments
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            EXPERIMENTS / PROJECTS
          </h2>
        </motion.div>

        {projects.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center mt-12">
            <FolderGit2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No experiments yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-12 space-y-24">
            {sorted.map((project, idx) => (
              <ProjectEnvironment
                key={project.id}
                project={project}
                index={idx}
                onView={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectEnvironment({
  project,
  index,
  onView,
}: {
  project: Project;
  index: number;
  onView: () => void;
}) {
  const slug = project.slug || '';
  const isCrisis = slug.includes('disaster') || index === 0;
  const isCV = slug.includes('drawing') || slug.includes('webcam') || index === 1;
  const isMedia = slug.includes('movie') || slug.includes('finder') || index === 2;

  if (isCrisis) return <CrisisControlEnv project={project} onView={onView} />;
  if (isCV) return <ComputerVisionEnv project={project} onView={onView} />;
  return <MediaStationEnv project={project} onView={onView} />;
}

function ProjectHeader({ project, onView, envLabel }: { project: Project; onView: () => void; envLabel: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/5">
          {envLabel}
        </span>
        <span className="text-xs text-zinc-600 font-mono">{project.category}</span>
        {project.featured && (
          <span className="flex items-center gap-1 text-xs text-yellow-500/80">
            <Star className="w-3 h-3" />
            Featured
          </span>
        )}
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{project.title}</h3>
      <p className="text-zinc-400 leading-relaxed max-w-2xl mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-mono text-zinc-400 bg-white/[0.03] rounded border border-white/5"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onView}
          className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          VIEW PROJECT
        </button>
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
            GITHUB
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            LIVE DEMO
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ArchitectureFlow({ architecture }: { architecture: Architecture | null }) {
  if (!architecture) return null;
  const maxLevel = Math.max(...architecture.nodes.map((n) => n.level));

  return (
    <div className="glass rounded-xl p-6">
      <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wide mb-4">Architecture</h4>
      <div className="space-y-2">
        {Array.from({ length: maxLevel + 1 }, (_, level) => {
          const nodes = architecture.nodes.filter((n) => n.level === level);
          return (
            <div key={level} className="flex items-center gap-3">
              {level > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-indigo-500/30" />
                  <span className="text-indigo-500/50 text-xs">↓</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="px-3 py-1.5 text-xs font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CrisisControlEnv({ project, onView }: { project: Project; onView: () => void }) {
  const alerts = [
    { x: 25, y: 30, label: 'Flood Zone', severity: 'critical' },
    { x: 65, y: 45, label: 'Relief Camp', severity: 'safe' },
    { x: 45, y: 65, label: 'Alert: Sector 7', severity: 'warning' },
    { x: 80, y: 25, label: 'Response Team', severity: 'active' },
  ];

  return (
    <div>
      <ProjectHeader project={project} onView={onView} envLabel="CRISIS CONTROL" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2 glass rounded-xl p-6 relative overflow-hidden min-h-[280px] bg-grid-fine">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-zinc-400">LIVE MAP — DISASTER ZONE</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          <div className="relative h-[200px]">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${alert.x}%`, top: `${alert.y}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-yellow-500' :
                    alert.severity === 'safe' ? 'bg-green-500' : 'bg-indigo-500'
                  } animate-pulse`}
                />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                  {alert.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-zinc-400">AUTH FLOW</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-zinc-500">
              <div>User → <span className="text-indigo-400">JWT</span></div>
              <div>JWT → <span className="text-indigo-400">Protected API</span></div>
              <div>API → <span className="text-indigo-400">Dashboard</span></div>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-zinc-400">DATA LAYER</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-zinc-500">
              <div>React → <span className="text-indigo-400">Backend/API</span></div>
              <div>API → <span className="text-emerald-400">MongoDB</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-4">
        <ArchitectureFlow architecture={project.architecture} />
      </div>
    </div>
  );
}

function ComputerVisionEnv({ project, onView }: { project: Project; onView: () => void }) {
  return (
    <div>
      <ProjectHeader project={project} onView={onView} envLabel="COMPUTER VISION LAB" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid lg:grid-cols-2 gap-4"
      >
        <DrawingCanvas />

        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-zinc-400">PROCESSING PIPELINE</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-zinc-500">
              <div>Webcam → <span className="text-indigo-400">Frame Capture</span></div>
              <div>Frame → <span className="text-indigo-400">OpenCV</span></div>
              <div>OpenCV → <span className="text-indigo-400">NumPy Processing</span></div>
              <div>NumPy → <span className="text-indigo-400">Drawing Overlay</span></div>
            </div>
          </div>

          {project.features.length > 0 && (
            <div className="glass rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 mb-3 block">FEATURES</span>
              <div className="grid grid-cols-2 gap-1.5">
                {project.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Check className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MediaStationEnv({ project, onView }: { project: Project; onView: () => void }) {
  return (
    <div>
      <ProjectHeader project={project} onView={onView} envLabel="MEDIA STATION" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid lg:grid-cols-2 gap-4"
      >
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-zinc-400">SEARCH INTERFACE</span>
          </div>
          <div className="relative">
            <input
              type="text"
              disabled
              placeholder="Search for movies..."
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-zinc-400 placeholder-zinc-600"
            />
            <Film className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[2/3] glass rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-zinc-700" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-600 font-mono text-center">
            Demo state — connect OMDB API key in admin settings
          </p>
        </div>

        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-zinc-400">DATA FLOW</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-zinc-500">
              <div>Search → <span className="text-indigo-400">OMDB API</span></div>
              <div>API → <span className="text-indigo-400">Response</span></div>
              <div>Response → <span className="text-indigo-400">Render</span></div>
            </div>
          </div>

          {project.features.length > 0 && (
            <div className="glass rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 mb-3 block">FEATURES</span>
              <div className="grid grid-cols-2 gap-1.5">
                {project.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Check className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="glass-strong rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 glass-strong px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-indigo-400">{project.category}</span>
            <h2 className="text-xl font-bold text-white">{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-48 glass rounded-xl flex items-center justify-center">
              <FolderGit2 className="w-12 h-12 text-zinc-700" />
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Overview</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">{project.description}</p>
          </div>

          {project.long_description && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Detailed Description</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{project.long_description}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono text-zinc-300 bg-white/5 rounded border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Key Features</h4>
              <ul className="space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ArchitectureFlow architecture={project.architecture} />

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {!project.github_url && !project.live_url && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <AlertTriangle className="w-4 h-4" />
                Links will be available once added through the admin dashboard.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
