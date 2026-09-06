import { useState } from 'react';
import { motion } from 'framer-motion';

type SkillNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  category: 'core' | 'frontend' | 'backend' | 'tool';
  description: string;
  usedIn: string[];
};

type SkillEdge = { from: string; to: string };

const NODES: SkillNode[] = [
  { id: 'jyoshnavi', label: 'JYOSHNAVI', x: 50, y: 50, category: 'core' as const, description: 'Computer Science Engineering student and full-stack developer.', usedIn: [] },
  { id: 'python', label: 'Python', x: 20, y: 25, category: 'core' as const, description: 'General-purpose programming, scripting, and computer vision work.', usedIn: ['Live Drawing on Webcam Feed'] },
  { id: 'javascript', label: 'JavaScript', x: 80, y: 25, category: 'frontend' as const, description: 'Frontend and backend web development with modern ES6+ syntax.', usedIn: ['Disaster Response Coordination Platform', 'Movie Finder Application'] },
  { id: 'react', label: 'React', x: 88, y: 50, category: 'frontend' as const, description: 'Component-based frontend development with hooks and state management.', usedIn: ['Disaster Response Coordination Platform', 'Movie Finder Application'] },
  { id: 'node', label: 'Node.js', x: 80, y: 75, category: 'backend' as const, description: 'Server-side JavaScript runtime for building REST APIs and backends.', usedIn: ['Disaster Response Coordination Platform'] },
  { id: 'mongodb', label: 'MongoDB', x: 55, y: 85, category: 'backend' as const, description: 'NoSQL document database for flexible, scalable data storage.', usedIn: ['Disaster Response Coordination Platform'] },
  { id: 'opencv', label: 'OpenCV', x: 15, y: 55, category: 'tool' as const, description: 'Computer vision library for image processing and real-time video analysis.', usedIn: ['Live Drawing on Webcam Feed'] },
  { id: 'numpy', label: 'NumPy', x: 30, y: 80, category: 'tool' as const, description: 'Numerical computing library for array operations and data processing.', usedIn: ['Live Drawing on Webcam Feed'] },
  { id: 'sql', label: 'SQL', x: 45, y: 15, category: 'tool' as const, description: 'Relational database queries for data retrieval and management.', usedIn: [] },
  { id: 'git', label: 'Git', x: 65, y: 15, category: 'tool' as const, description: 'Version control for tracking changes and collaborative development.', usedIn: [] },
];

const EDGES: SkillEdge[] = [
  { from: 'jyoshnavi', to: 'python' },
  { from: 'jyoshnavi', to: 'javascript' },
  { from: 'jyoshnavi', to: 'react' },
  { from: 'jyoshnavi', to: 'node' },
  { from: 'jyoshnavi', to: 'mongodb' },
  { from: 'jyoshnavi', to: 'opencv' },
  { from: 'jyoshnavi', to: 'numpy' },
  { from: 'jyoshnavi', to: 'sql' },
  { from: 'jyoshnavi', to: 'git' },
  { from: 'python', to: 'opencv' },
  { from: 'python', to: 'numpy' },
  { from: 'javascript', to: 'react' },
  { from: 'javascript', to: 'node' },
  { from: 'node', to: 'mongodb' },
];

const CATEGORY_COLORS: Record<string, string> = {
  core: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
  frontend: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
  backend: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  tool: 'text-zinc-400 border-zinc-600/40 bg-zinc-700/10',
};

export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);

  const connectedIds = new Set<string>();
  if (hovered) {
    EDGES.forEach((edge) => {
      if (edge.from === hovered) connectedIds.add(edge.to);
      if (edge.to === hovered) connectedIds.add(edge.from);
    });
  }

  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) : null;

  const isEdgeActive = (edge: SkillEdge) =>
    hovered && (edge.from === hovered || edge.to === hovered);

  return (
    <section id="skills" className="relative section-padding bg-[#07070a] border-t border-white/5">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            02 / Skills
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            INTERACTIVE SKILL NETWORK
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Hover over any technology to explore connections and see where it's used.
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-4 sm:p-6 aspect-square sm:aspect-[4/3] relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {EDGES.map((edge, i) => {
                  const from = NODES.find((n) => n.id === edge.from)!;
                  const to = NODES.find((n) => n.id === edge.to)!;
                  const active = isEdgeActive(edge);
                  return (
                    <line
                      key={i}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={active ? 'rgba(129, 140, 248, 0.6)' : 'rgba(255, 255, 255, 0.06)'}
                      strokeWidth={active ? 0.4 : 0.2}
                      strokeDasharray={active ? '0' : '1'}
                    />
                  );
                })}
              </svg>

              {NODES.map((node) => {
                const isHovered = hovered === node.id;
                const isConnected = connectedIds.has(node.id);
                const isDimmed = hovered && !isHovered && !isConnected;
                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap transition-all ${
                        CATEGORY_COLORS[node.category]
                      } ${
                        isHovered ? 'scale-110 shadow-lg z-10' : ''
                      } ${
                        isDimmed ? 'opacity-30' : ''
                      } ${isConnected && !isHovered ? 'ring-1 ring-indigo-500/30' : ''}`}
                      data-cursor="hover"
                    >
                      {node.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <motion.div
              key={hovered || 'default'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-xl p-6 sticky top-24"
            >
              {hoveredNode ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2 h-2 rounded-full ${
                      hoveredNode.category === 'core' ? 'bg-indigo-500' :
                      hoveredNode.category === 'frontend' ? 'bg-blue-500' :
                      hoveredNode.category === 'backend' ? 'bg-emerald-500' :
                      'bg-zinc-500'
                    }`} />
                    <h3 className="text-lg font-bold text-white font-mono">{hoveredNode.label}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {hoveredNode.description}
                  </p>
                  {hoveredNode.usedIn.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Used in</p>
                      <div className="space-y-1.5">
                        {hoveredNode.usedIn.map((project) => (
                          <div key={project} className="flex items-center gap-2 text-sm text-indigo-400">
                            <span className="w-1 h-1 rounded-full bg-indigo-500" />
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white font-mono mb-3">SKILL NETWORK</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    Hover over any node in the network to see its connections, description, and the
                    projects where it's used.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-zinc-400">Core / Central</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-zinc-400">Frontend</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-zinc-400">Backend</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-zinc-500" />
                      <span className="text-zinc-400">Tools</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
