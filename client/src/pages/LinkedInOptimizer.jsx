import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Briefcase, Search, CheckCircle, AlertCircle, Star, Zap,
  User, FileText, Hash, Edit3,
  Calendar, ChevronDown, ChevronUp, Lightbulb, ToggleLeft, ToggleRight
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// â”€â”€â”€ Score Ring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ScoreRing = ({ score, size = 160, label }) => {
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#7C3AED' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(124,58,237,0.08)" strokeWidth={12} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="url(#ringGrad)" strokeWidth={12} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - score / 100) }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: 40, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}
          >{score}</motion.span>
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>/100</span>
        </div>
      </div>
      {label && <p style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600, marginTop: 8 }}>{label}</p>}
    </div>
  );
};

// â”€â”€â”€ Chip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Chip = ({ label, color, bg }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
    background: bg || `${color}15`, border: `1px solid ${color}30`,
    borderRadius: 20, color, fontSize: 12, fontWeight: 600, margin: '3px',
  }}>{label}</span>
);

// â”€â”€â”€ Section Analysis Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SectionCard = ({ icon: Icon, title, score, color, children, delay = 0 }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ background: 'rgba(13,22,39,0.8)', border: `1px solid ${color}20`, borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(12px)', marginBottom: 14 }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} style={{ color }} />
          </div>
          <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color, fontWeight: 900, fontSize: 20, fontFamily: 'Outfit, sans-serif' }}>{score}</span>
          {open ? <ChevronUp size={16} style={{ color: '#475569' }} /> : <ChevronDown size={16} style={{ color: '#475569' }} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 22px 22px' }}>
              <div style={{ height: 1, background: `${color}15`, marginBottom: 18 }} />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// â”€â”€â”€ Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Toggle = ({ value, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
    <span style={{ color: '#CBD5E1', fontSize: 14, fontWeight: 600 }}>{label}</span>
    <button onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
      {value
        ? <ToggleRight size={32} style={{ color: '#7C3AED' }} />
        : <ToggleLeft size={32} style={{ color: '#475569' }} />}
    </button>
  </div>
);

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const generateLinkedInData = (form) => {
  const base = form.hasPhoto && form.hasFeatured ? 74 : form.hasPhoto ? 68 : 59;
  const connBonus = form.connections > 500 ? 8 : form.connections > 200 ? 4 : 0;
  return {
    overallScore: Math.min(100, base + connBonus + Math.floor(Math.random() * 8)),
    sections: {
      headline: {
        score: 72,
        current: form.headline || 'Software Engineer at XYZ',
        suggested: 'Full-Stack Engineer | React Â· Node.js Â· AWS | Building scalable products that users love',
        tips: ['Add specific technologies', 'Include your value proposition', 'Mention impact or specialty'],
      },
      about: {
        score: 65,
        wordCount: form.aboutText.split(' ').filter(Boolean).length,
        targetWords: 300,
        missingKeywords: ['problem-solving', 'cross-functional', 'agile', 'stakeholder', 'metrics-driven'],
        tone: 'Somewhat formal. Add more personality and first-person narrative.',
      },
      skills: {
        score: 81,
        matched: 73,
        missing: ['System Design', 'Cloud Architecture', 'CI/CD Pipelines', 'GraphQL', 'Redis'],
        top: form.skills.split(',').slice(0, 5).map(s => s.trim()).filter(Boolean),
      },
      experience: {
        score: 68,
        bulletQuality: 62,
        actionVerbUsage: 55,
        suggestions: ['Start bullets with strong verbs (Led, Built, Increased)', 'Add quantifiable results', 'Include team size & scope'],
      },
      photo: {
        score: form.hasPhoto ? 95 : 40,
        impact: form.hasPhoto ? '+15% profile views' : 'Profiles with photos get 21Ã— more views',
      },
    },
    missingKeywords: ['open to work', 'top voice', 'hiring', 'B2B', 'SaaS', 'leadership', 'mentorship', 'product roadmap'],
    suggestedHeadlines: [
      'Full-Stack Engineer | React Â· Node.js Â· AWS | 3Ã— Startup Veteran Building Products @ Scale',
      'Software Engineer crafting high-performance web apps | Open to Exciting Roles in 2025',
      'Building the future, one commit at a time | React Â· TypeScript Â· Cloud | 500K+ Users Served',
    ],
    aboutTemplate: `I'm a passionate software engineer with ${form.experienceCount || 3}+ years of experience building scalable, user-centric products. I thrive in fast-paced environments where I can own features end-to-end â€” from ideation to deployment.

My expertise includes [your core stack], and I've had the privilege of working with teams that impact [users/revenue/industry]. I believe great software is born from clear thinking, clean code, and relentless iteration.

Currently ${form.profileUrl ? 'open to' : 'exploring'} opportunities where I can contribute to meaningful products and grow alongside brilliant teammates.

Let's connect if you're building something great! ðŸš€`,
    postIdeas: [
      { topic: 'Lessons from building my first open-source project', type: 'Story', icon: 'ðŸ“–' },
      { topic: '5 TypeScript patterns that changed how I write code', type: 'Technical', icon: 'ðŸ’»' },
      { topic: 'What I wish I knew before my first tech interview', type: 'Tips', icon: 'ðŸŽ¯' },
    ],
    completeness: [
      { item: 'Profile photo', done: form.hasPhoto },
      { item: 'Custom headline', done: !!form.headline },
      { item: 'About section (300+ words)', done: form.aboutText.split(' ').length >= 300 },
      { item: 'Featured section', done: form.hasFeatured },
      { item: '5+ skills listed', done: form.skills.split(',').length >= 5 },
      { item: '500+ connections', done: form.connections >= 500 },
      { item: '3+ work experiences', done: form.experienceCount >= 3 },
      { item: 'Education details', done: true },
      { item: 'Recommendations received (3+)', done: false },
      { item: 'Creator mode enabled', done: false },
    ],
  };
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LinkedInOptimizer = () => {
  const [form, setForm] = useState({
    profileUrl: '', headline: '', aboutText: '', skills: 'React, Node.js, Python, AWS, TypeScript',
    experienceCount: 3, connections: 350, hasPhoto: true, hasFeatured: false,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedHeadline, setSelectedHeadline] = useState(null);
  const [editableAbout, setEditableAbout] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);

  const handleOptimize = async () => {
    setAnalyzing(true);
    setData(null);
    setLoadProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 40));
      setLoadProgress(i);
    }
    const result = generateLinkedInData(form);
    setEditableAbout(result.aboutTemplate);
    setData(result);
    setAnalyzing(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#E2E8F0',
    fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(124,58,237,0.2))', border: '1px solid rgba(14,165,233,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link2 size={24} style={{ color: '#0EA5E9' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
              LinkedIn <span style={{ background: 'linear-gradient(135deg, #0EA5E9, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Optimizer</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0, marginTop: 2 }}>AI-powered profile optimization to 10Ã— your visibility and recruiter responses</p>
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 20, padding: 32, marginBottom: 28, backdropFilter: 'blur(12px)' }}
      >
        <h2 style={{ color: '#E2E8F0', fontSize: 17, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 22 }}>Your LinkedIn Profile</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>LinkedIn URL (optional)</label>
            <input style={inputStyle} placeholder="https://linkedin.com/in/yourprofile" value={form.profileUrl} onChange={e => setForm(p => ({ ...p, profileUrl: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Current Headline</label>
            <input style={inputStyle} placeholder="e.g. Software Engineer at Google" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>About Section</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              placeholder="Paste your current About section..."
              value={form.aboutText}
              onChange={e => setForm(p => ({ ...p, aboutText: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Skills (comma separated)</label>
            <input style={inputStyle} placeholder="React, Node.js, Python..." value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Experiences</label>
              <input type="number" style={inputStyle} value={form.experienceCount} onChange={e => setForm(p => ({ ...p, experienceCount: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Connections</label>
              <input type="number" style={inputStyle} value={form.connections} onChange={e => setForm(p => ({ ...p, connections: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div>
            <Toggle label="Profile Photo" value={form.hasPhoto} onChange={v => setForm(p => ({ ...p, hasPhoto: v }))} />
          </div>
          <div>
            <Toggle label="Featured Section" value={form.hasFeatured} onChange={v => setForm(p => ({ ...p, hasFeatured: v }))} />
          </div>
        </div>

        {analyzing && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#94A3B8', fontSize: 12 }}>Analyzing profile...</span>
              <span style={{ color: '#7C3AED', fontSize: 12, fontWeight: 700 }}>{loadProgress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', borderRadius: 4, width: `${loadProgress}%` }} />
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(14,165,233,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOptimize}
          disabled={analyzing}
          style={{
            padding: '14px 36px', background: 'linear-gradient(135deg, #0EA5E9, #7C3AED)',
            border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16,
            fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            opacity: analyzing ? 0.7 : 1,
          }}
        >
          <Zap size={18} /> {analyzing ? 'Optimizing...' : 'Optimize My Profile'}
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Score Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(124,58,237,0.08))',
                border: '1px solid rgba(14,165,233,0.25)', borderRadius: 22,
                padding: 32, marginBottom: 20, backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: 40,
              }}
            >
              <ScoreRing score={data.overallScore} label="LinkedIn Strength" />
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#E2E8F0', fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
                  {data.overallScore >= 80 ? 'ðŸ”¥ Outstanding Profile!' : data.overallScore >= 65 ? 'âœ¨ Strong Profile' : 'âš¡ Needs Optimization'}
                </h2>
                <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  Your LinkedIn profile scores <strong style={{ color: '#0EA5E9' }}>{data.overallScore}/100</strong>. Recruiters spend an average of <strong style={{ color: '#E2E8F0' }}>6 seconds</strong> on your profile. Here's how to make those seconds count.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Completeness', val: `${data.completeness.filter(c => c.done).length}/10`, color: '#10B981' },
                    { label: 'Missing Keywords', val: data.missingKeywords.length, color: '#EF4444' },
                    { label: 'Improvement Areas', val: 5, color: '#F59E0B' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                      <div style={{ color: '#64748B', fontSize: 11, fontWeight: 600 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Section Analysis */}
            <h3 style={{ color: '#E2E8F0', fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 16 }}>Section-by-Section Analysis</h3>

            <SectionCard icon={Edit3} title="Headline" score={`${data.sections.headline.score}/100`} color="#7C3AED" delay={0.2}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 14 }}>
                  <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Current</p>
                  <p style={{ color: '#CBD5E1', fontSize: 13, margin: 0 }}>{data.sections.headline.current}</p>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: 14 }}>
                  <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Suggested âœ¨</p>
                  <p style={{ color: '#10B981', fontSize: 13, margin: 0, fontWeight: 500 }}>{data.sections.headline.suggested}</p>
                </div>
              </div>
              {data.sections.headline.tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#94A3B8' }}>
                  <span style={{ color: '#7C3AED' }}>â†’</span> {t}
                </div>
              ))}
            </SectionCard>

            <SectionCard icon={FileText} title="About Section" score={`${data.sections.about.score}/100`} color="#06B6D4" delay={0.3}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(6,182,212,0.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#06B6D4', fontFamily: 'Outfit, sans-serif' }}>{data.sections.about.wordCount}</div>
                  <div style={{ color: '#64748B', fontSize: 11 }}>Current Words</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#10B981', fontFamily: 'Outfit, sans-serif' }}>{data.sections.about.targetWords}</div>
                  <div style={{ color: '#64748B', fontSize: 11 }}>Target Words</div>
                </div>
              </div>
              <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 12 }}><strong style={{ color: '#06B6D4' }}>Tone:</strong> {data.sections.about.tone}</p>
              <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 8 }}><strong style={{ color: '#E2E8F0' }}>Missing Keywords:</strong></p>
              <div>{data.sections.about.missingKeywords.map(k => <Chip key={k} label={k} color="#EF4444" />)}</div>
            </SectionCard>

            <SectionCard icon={Hash} title="Skills" score={`${data.sections.skills.score}/100`} color="#10B981" delay={0.4}>
              <div style={{ marginBottom: 12 }}>
                <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 6 }}><strong style={{ color: '#10B981' }}>{data.sections.skills.matched}%</strong> matched with industry standards</p>
                <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 8 }}>Your skills: {data.sections.skills.top.map(s => <Chip key={s} label={s} color="#10B981" />)}</p>
                <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 8 }}>Top missing: {data.sections.skills.missing.map(s => <Chip key={s} label={s} color="#EF4444" />)}</p>
              </div>
            </SectionCard>

            <SectionCard icon={Briefcase} title="Experience" score={`${data.sections.experience.score}/100`} color="#F59E0B" delay={0.5}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'Bullet Quality', val: `${data.sections.experience.bulletQuality}%` },
                  { label: 'Action Verbs', val: `${data.sections.experience.actionVerbUsage}%` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: 'rgba(245,158,11,0.1)', borderRadius: 10, padding: '10px 16px' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B', fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                    <div style={{ color: '#64748B', fontSize: 11 }}>{label}</div>
                  </div>
                ))}
              </div>
              {data.sections.experience.suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#94A3B8' }}>
                  <Lightbulb size={13} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} /> {s}
                </div>
              ))}
            </SectionCard>

            <SectionCard icon={User} title="Profile Photo" score={`${data.sections.photo.score}/100`} color={form.hasPhoto ? '#10B981' : '#EF4444'} delay={0.6}>
              <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>
                <span style={{ color: form.hasPhoto ? '#10B981' : '#EF4444', fontWeight: 700 }}>Impact: </span>
                {data.sections.photo.impact}
              </p>
            </SectionCard>

            {/* Missing Keywords */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 24, marginBottom: 20, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Hash size={18} style={{ color: '#EF4444' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>High-Value SEO Keywords Missing</h3>
              </div>
              <div>{data.missingKeywords.map(k => <Chip key={k} label={k} color="#EF4444" />)}</div>
            </motion.div>

            {/* Suggested Headlines */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 24, marginBottom: 20, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Star size={18} style={{ color: '#7C3AED' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>3 Optimized Headline Options</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.suggestedHeadlines.map((h, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedHeadline(i)}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      padding: '14px 18px', textAlign: 'left', background: selectedHeadline === i ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedHeadline === i ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 12, color: '#E2E8F0', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: selectedHeadline === i ? '#7C3AED' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: selectedHeadline === i ? '#fff' : '#475569' }}>{i + 1}</span>
                    {h}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Suggested About */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20, padding: 24, marginBottom: 20, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <FileText size={18} style={{ color: '#06B6D4' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Suggested About Template</h3>
                <span style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>Editable</span>
              </div>
              <textarea
                value={editableAbout}
                onChange={e => setEditableAbout(e.target.value)}
                style={{ width: '100%', minHeight: 160, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 12, color: '#CBD5E1', fontSize: 13, lineHeight: 1.8, resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
              />
            </motion.div>

            {/* Post Ideas + Completeness */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Calendar size={18} style={{ color: '#7C3AED' }} />
                  <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Weekly Post Ideas</h3>
                </div>
                {data.postIdeas.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{p.icon}</span>
                    <div>
                      <p style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600, margin: '0 0 3px' }}>{p.topic}</p>
                      <span style={{ background: 'rgba(124,58,237,0.15)', color: '#7C3AED', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{p.type}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CheckCircle size={18} style={{ color: '#10B981' }} />
                  <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Profile Completeness</h3>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{data.completeness.filter(c => c.done).length}/10</span>
                </div>
                {data.completeness.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    {c.done
                      ? <CheckCircle size={15} style={{ color: '#10B981', flexShrink: 0 }} />
                      : <AlertCircle size={15} style={{ color: '#EF4444', flexShrink: 0 }} />}
                    <span style={{ color: c.done ? '#94A3B8' : '#CBD5E1', fontSize: 13, fontWeight: c.done ? 400 : 500 }}>{c.item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkedInOptimizer;


