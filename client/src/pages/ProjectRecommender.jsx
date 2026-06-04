import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Star, ExternalLink, Filter, ChevronRight, Zap, TrendingUp, Code } from 'lucide-react';

const SKILLS_OPTIONS = ['React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB', 'SQL', 'Machine Learning', 'HTML/CSS', 'TypeScript', 'Next.js', 'Express.js', 'Django', 'Flutter'];

const PROJECTS_DB = {
  beginner: [
    { name: 'To-Do App with Local Storage', desc: 'Build a task manager with CRUD operations, local storage persistence, and a clean UI.', tech: ['HTML', 'CSS', 'JavaScript'], time: '1-2 days', outcomes: ['DOM manipulation', 'Local Storage API', 'UI design basics'], category: 'web', link: 'https://github.com/search?q=todo+app+javascript' },
    { name: 'Portfolio Website', desc: 'Create your own personal portfolio with sections: About, Projects, Skills, Contact.', tech: ['HTML', 'CSS', 'JavaScript'], time: '2-3 days', outcomes: ['Responsive design', 'CSS animations', 'Professional layout'], category: 'web', link: 'https://github.com/search?q=portfolio+website' },
    { name: 'Weather App', desc: 'Fetch and display real-time weather data using OpenWeatherMap free API.', tech: ['JavaScript', 'API', 'CSS'], time: '1-2 days', outcomes: ['Fetch API', 'JSON data handling', 'API integration'], category: 'web', link: 'https://github.com/search?q=weather+app+javascript' },
    { name: 'Calculator App', desc: 'Build a functional calculator with keyboard support and history feature.', tech: ['React', 'CSS'], time: '1 day', outcomes: ['React state management', 'Event handling', 'Component design'], category: 'react', link: 'https://github.com/search?q=calculator+react' },
    { name: 'Quiz App', desc: 'Multiple-choice quiz with timer, score tracking, and result summary.', tech: ['React', 'JavaScript'], time: '2 days', outcomes: ['State management', 'Conditional rendering', 'Timer logic'], category: 'react', link: 'https://github.com/search?q=quiz+app+react' },
    { name: 'Student Grade Calculator', desc: 'CLI/web tool to calculate GPA, grade predictions, and academic progress.', tech: ['Python', 'Tkinter'], time: '1 day', outcomes: ['Python basics', 'Functions', 'File I/O'], category: 'python', link: 'https://github.com/search?q=grade+calculator+python' },
  ],
  intermediate: [
    { name: 'Full-Stack Blog Platform', desc: 'Blog with user auth, CRUD posts, comments, tags, and Markdown support.', tech: ['React', 'Node.js', 'MongoDB', 'Express'], time: '1-2 weeks', outcomes: ['REST API design', 'JWT auth', 'MERN stack', 'CRUD operations'], category: 'fullstack', link: 'https://github.com/search?q=blog+mern+stack' },
    { name: 'E-Commerce Store', desc: 'Online shop with product listings, cart, checkout, and admin panel.', tech: ['React', 'Node.js', 'MongoDB', 'Stripe'], time: '2-3 weeks', outcomes: ['Payment integration', 'State management', 'Admin dashboard', 'Complex data models'], category: 'fullstack', link: 'https://github.com/search?q=ecommerce+react+node' },
    { name: 'Real-Time Chat App', desc: 'WhatsApp-like chat with rooms, real-time messages, and online status.', tech: ['React', 'Socket.io', 'Node.js', 'MongoDB'], time: '1-2 weeks', outcomes: ['WebSockets', 'Real-time communication', 'Room management', 'Event-driven architecture'], category: 'fullstack', link: 'https://github.com/search?q=chat+app+socket.io+react' },
    { name: 'Movie Recommendation System', desc: 'ML model that recommends movies based on user preferences using collaborative filtering.', tech: ['Python', 'Scikit-learn', 'Pandas', 'Flask'], time: '1-2 weeks', outcomes: ['Machine learning basics', 'Data preprocessing', 'Recommendation algorithms', 'Model deployment'], category: 'ml', link: 'https://github.com/search?q=movie+recommendation+python' },
    { name: 'URL Shortener Service', desc: 'Build Bitly-like service with analytics, QR codes, and custom aliases.', tech: ['Node.js', 'MongoDB', 'Redis', 'React'], time: '1 week', outcomes: ['System design concepts', 'Caching with Redis', 'Analytics tracking', 'QR generation'], category: 'backend', link: 'https://github.com/search?q=url+shortener+nodejs' },
    { name: 'Job Board Platform', desc: 'Job listing site where companies post jobs and candidates apply.', tech: ['Next.js', 'PostgreSQL', 'Prisma'], time: '2 weeks', outcomes: ['Next.js SSR', 'SQL databases', 'ORM usage', 'File uploads'], category: 'fullstack', link: 'https://github.com/search?q=job+board+nextjs' },
  ],
  advanced: [
    { name: 'AI Interview Prep Platform', desc: 'Like InterviewAce — AI-powered mock interviews, resume analysis, roadmap generator.', tech: ['React', 'Node.js', 'MongoDB', 'Google Gemini AI'], time: '4-6 weeks', outcomes: ['AI API integration', 'Complex state management', 'Full-stack architecture', 'Cloud deployment'], category: 'ai', link: 'https://github.com/search?q=interview+prep+ai' },
    { name: 'DevOps CI/CD Pipeline', desc: 'Automated pipeline with GitHub Actions, Docker, Kubernetes deployment.', tech: ['Docker', 'GitHub Actions', 'AWS', 'Kubernetes'], time: '3-4 weeks', outcomes: ['DevOps practices', 'Container orchestration', 'Cloud infrastructure', 'Automation'], category: 'devops', link: 'https://github.com/search?q=cicd+pipeline+github+actions' },
    { name: 'Microservices Social Network', desc: 'Twitter-like app built with microservices — auth service, post service, notification service.', tech: ['Node.js', 'React', 'RabbitMQ', 'Docker', 'MongoDB'], time: '4-6 weeks', outcomes: ['Microservices architecture', 'Message queues', 'Service communication', 'Distributed systems'], category: 'backend', link: 'https://github.com/search?q=microservices+social+media' },
    { name: 'Stock Market Dashboard', desc: 'Real-time stock tracking with ML price prediction and portfolio management.', tech: ['Python', 'React', 'TensorFlow', 'WebSocket'], time: '3-4 weeks', outcomes: ['LSTM time-series prediction', 'Real-time data streaming', 'Financial data visualization', 'ML model training'], category: 'ml', link: 'https://github.com/search?q=stock+prediction+python+ml' },
    { name: 'Blockchain Voting System', desc: 'Secure decentralized voting using Ethereum smart contracts.', tech: ['Solidity', 'Web3.js', 'React', 'Ethereum'], time: '4-6 weeks', outcomes: ['Smart contract development', 'Blockchain concepts', 'Cryptography basics', 'Decentralized apps'], category: 'blockchain', link: 'https://github.com/search?q=blockchain+voting+solidity' },
    { name: 'Computer Vision Security System', desc: 'Face recognition attendance system + anomaly detection using OpenCV.', tech: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'React'], time: '3-5 weeks', outcomes: ['Computer vision', 'CNN models', 'Image processing', 'Model optimization'], category: 'ai', link: 'https://github.com/search?q=face+recognition+opencv+python' },
  ]
};

const LEVEL_COLORS = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };
const LEVEL_BG = { beginner: 'rgba(16,185,129,0.12)', intermediate: 'rgba(245,158,11,0.12)', advanced: 'rgba(239,68,68,0.12)' };

const ProjectCard = ({ project, level, index }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      style={{ background: 'rgba(13,22,39,0.8)', border: `1px solid ${LEVEL_COLORS[level]}25`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', transition: 'all 0.25s' }}
      whileHover={{ borderColor: `${LEVEL_COLORS[level]}50`, y: -3 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: LEVEL_BG[level], border: `1px solid ${LEVEL_COLORS[level]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Folder size={16} style={{ color: LEVEL_COLORS[level] }} />
        </div>
        <button onClick={() => setSaved(!saved)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Star size={16} style={{ color: saved ? '#F59E0B' : '#475569', fill: saved ? '#F59E0B' : 'none' }} />
        </button>
      </div>

      <div>
        <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 15, marginBottom: 6, fontFamily: 'Outfit' }}>{project.name}</h3>
        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>{project.desc}</p>
      </div>

      {/* Tech Stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tech.map(t => (
          <span key={t} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '3px 9px', color: '#A5B4FC', fontSize: 11, fontWeight: 600 }}>{t}</span>
        ))}
      </div>

      {/* Learning Outcomes */}
      <div style={{ flex: 1 }}>
        <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>You'll Learn:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {project.outcomes.map(o => (
            <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={11} style={{ color: LEVEL_COLORS[level], flexShrink: 0 }} />
              <span style={{ color: '#94A3B8', fontSize: 12 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(99,102,241,0.08)' }}>
        <span style={{ color: '#64748B', fontSize: 12 }}>⏱ {project.time}</span>
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: LEVEL_BG[level], border: `1px solid ${LEVEL_COLORS[level]}30`, borderRadius: 8, padding: '6px 12px', color: LEVEL_COLORS[level], fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          Start Building <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ProjectRecommender = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [level, setLevel] = useState('');
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleGenerate = async () => {
    if (!level) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setProjects(PROJECTS_DB);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
          <span className="gradient-text">Project Recommender</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>AI-curated projects based on your skills and experience level</p>
      </motion.div>

      {!projects ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 32 }}>
          {/* Skills */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#94A3B8', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 12 }}>Your Skills (select multiple)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS_OPTIONS.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  style={{ padding: '7px 14px', borderRadius: 9, border: `1.5px solid ${selectedSkills.includes(skill) ? '#7C3AED' : 'rgba(99,102,241,0.2)'}`, background: selectedSkills.includes(skill) ? 'rgba(124,58,237,0.15)' : 'rgba(99,102,241,0.04)', color: selectedSkills.includes(skill) ? '#C4B5FD' : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ color: '#94A3B8', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 12 }}>Experience Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[{ id: 'beginner', label: '🌱 Beginner', desc: '0-6 months' }, { id: 'intermediate', label: '🚀 Intermediate', desc: '6mo-2 years' }, { id: 'advanced', label: '⚡ Advanced', desc: '2+ years' }].map(l => (
                <button key={l.id} onClick={() => setLevel(l.id)}
                  style={{ padding: '14px 10px', borderRadius: 12, border: `1.5px solid ${level === l.id ? LEVEL_COLORS[l.id] : 'rgba(99,102,241,0.15)'}`, background: level === l.id ? LEVEL_BG[l.id] : 'rgba(99,102,241,0.04)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{l.label.split(' ')[0]}</div>
                  <div style={{ color: level === l.id ? LEVEL_COLORS[l.id] : '#64748B', fontWeight: 600, fontSize: 14 }}>{l.label.split(' ')[1]}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!level || loading} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700, opacity: !level ? 0.5 : 1 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap size={16} /></motion.div>
                Finding Best Projects...
              </div>
            ) : (
              <><Code size={15} /> Find My Projects</>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} style={{ color: '#7C3AED' }} />
              <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16 }}>18 Projects Recommended for You</span>
            </div>
            <button onClick={() => { setProjects(null); setLevel(''); }} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
              ← Change Preferences
            </button>
          </div>

          {['beginner', 'intermediate', 'advanced'].map(lvl => (
            <div key={lvl} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ padding: '4px 14px', borderRadius: 20, background: LEVEL_BG[lvl], border: `1px solid ${LEVEL_COLORS[lvl]}30`, color: LEVEL_COLORS[lvl], fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{lvl}</span>
                <span style={{ color: '#475569', fontSize: 13 }}>{PROJECTS_DB[lvl].length} projects</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {PROJECTS_DB[lvl].map((p, i) => <ProjectCard key={i} project={p} level={lvl} index={i} />)}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectRecommender;
