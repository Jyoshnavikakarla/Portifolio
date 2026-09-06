export const SKILLS_DATA = {
  programming: [
    { name: 'Python', level: 'Intermediate', description: 'General-purpose programming, scripting, and computer vision work.' },
    { name: 'JavaScript', level: 'Intermediate', description: 'Frontend and backend web development with modern ES6+ syntax.' },
    { name: 'SQL', level: 'Basic', description: 'Relational database queries for data retrieval and management.' },
    { name: 'HTML5', level: 'Intermediate', description: 'Semantic markup and structuring of web content.' },
    { name: 'CSS3', level: 'Intermediate', description: 'Styling, responsive layouts, and modern visual effects.' },
  ],
  frameworks: [
    { name: 'React.js', level: 'Intermediate', description: 'Component-based frontend development with hooks and state management.' },
    { name: 'Node.js', level: 'Basic', description: 'Server-side JavaScript runtime for building REST APIs and backends.' },
    { name: 'OpenCV', level: 'Basic', description: 'Computer vision library for image processing and real-time video analysis.' },
    { name: 'NumPy', level: 'Basic', description: 'Numerical computing library for array operations and data processing.' },
  ],
  tools: [
    { name: 'MongoDB', level: 'Basic', description: 'NoSQL document database for flexible, scalable data storage.' },
    { name: 'Git', level: 'Intermediate', description: 'Version control for tracking changes and collaborative development.' },
    { name: 'GitHub', level: 'Intermediate', description: 'Cloud-based hosting for Git repositories and project collaboration.' },
    { name: 'VS Code', level: 'Intermediate', description: 'Primary code editor with extensions for development workflow.' },
    { name: 'Balsamiq', level: 'Basic', description: 'Wireframing tool for creating low-fidelity UI mockups and prototypes.' },
  ],
  core: [
    { name: 'Data Structures & Algorithms', level: 'Intermediate', description: 'Fundamental CS concepts for efficient problem-solving and code optimization.' },
    { name: 'OOP', level: 'Intermediate', description: 'Object-oriented programming principles: encapsulation, inheritance, polymorphism.' },
    { name: 'DBMS', level: 'Intermediate', description: 'Database management systems design, normalization, and query optimization.' },
    { name: 'Operating Systems', level: 'Basic', description: 'Process management, memory allocation, and system resource concepts.' },
    { name: 'Computer Networks', level: 'Basic', description: 'Network protocols, architecture, and data communication fundamentals.' },
  ],
};

export const HERO_SKILLS = ['Python', 'JavaScript', 'React.js', 'Node.js', 'MongoDB', 'OpenCV', 'SQL'];

export const SKILL_CATEGORIES = [
  { key: 'programming', label: 'Programming', icon: 'Code2' },
  { key: 'frameworks', label: 'Frameworks & Libraries', icon: 'Layers' },
  { key: 'tools', label: 'Databases & Tools', icon: 'Database' },
  { key: 'core', label: 'Core Computer Science', icon: 'Cpu' },
] as const;
