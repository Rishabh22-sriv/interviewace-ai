import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, GitBranch, Link2, Search, CheckCircle, TrendingUp,
  AlertCircle, Star, Code2, Eye, Briefcase, Cpu, BarChart3,
  ChevronRight, Zap, Target, Award, Layers
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// â”€â”€â”€ Animated Gauge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BigGauge = ({ score, label, size = 200 }) => {
  const r = size / 2 - 18;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#7C3AED' : score >= 50 ? '#F59E0B' : '#EF4444';
  const qual = score >= 80 ? 'Excellent' : score >= 65 ? 'Great' : score >= 50 ? 'Good' : 'Needs Work';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(124,58,237,0.08)" strokeWidth={14} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={14} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - score / 100) }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ fontSize: size === 200 ? 52 : 32, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}
          >{score}</motion.span>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4 }}>{label || '/100'}</span>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ color, fontWeight: 800, fontSize: 18, marginTop: 8, fontFamily: 'Outfit, sans-serif' }}
      >{qual}</motion.p>
    </div>
  );
};

// â”€â”€â”€ Animated Progress Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ScoreBar = ({ label, score, color, icon: Icon, delay = 0 }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Icon && <Icon size={15} style={{ color }} />}
        <span style={{ color: '#CBD5E1', fontSize: 14, fontWeight: 600 }}>{label}</span>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        style={{ color, fontWeight: 800, fontSize: 16, fontFamily: 'Outfit, sans-serif' }}
      >{score}/100</motion.span>
    </div>
    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        style={{ height: '100%', background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 8, boxShadow: `0 0 8px ${color}50` }}
      />
    </div>
  </div>
);

// â”€â”€â”€ Loading Steps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const steps = ['Fetching URLs', 'Analyzing Design', 'Analyzing Code', 'Generating Report'];

const LoadingOverlay = ({ step }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(5,11,24,0.85)',
      backdropFilter: 'blur(12px)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
  >
    <div style={{ background: 'rgba(13,22,39,0.95)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 24, padding: '48px 56px', textAlign: 'center', maxWidth: 440, width: '90%' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ width: 72, height: 72, margin: '0 auto 28px', background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(124,58,237,0.4)' }}
      >
        <Cpu size={32} style={{ color: '#7C3AED' }} />
      </motion.div>
      <h3 style={{ color: '#E2E8F0', fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>Analyzing Your Portfolio</h3>
      <p style={{ color: '#7C3AED', fontWeight: 700, fontSize: 15, marginBottom: 32 }}>{steps[step]}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: i < step ? '#10B981' : i === step ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${i < step ? '#10B981' : i === step ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {i < step
                ? <CheckCircle size={14} style={{ color: '#fff' }} />
                : i === step
                  ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} />
                  : null}
            </div>
            <span style={{ color: i <= step ? '#E2E8F0' : '#475569', fontSize: 13, fontWeight: i === step ? 700 : 500 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// â”€â”€â”€ Mock Data Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const generateMockData = (portfolioUrl, githubUrl, linkedinUrl) => {
  const allProvided = portfolioUrl && githubUrl && linkedinUrl;
  const twoProvided = [portfolioUrl, githubUrl, linkedinUrl].filter(Boolean).length >= 2;
  const base = allProvided ? 82 : twoProvided ? 71 : 58;
  const jitter = () => Math.floor(Math.random() * 10) - 5;

  return {
    overall: base + jitter(),
    design: Math.min(100, base + 5 + jitter()),
    projectQuality: Math.min(100, base - 2 + jitter()),
    recruiterAppeal: Math.min(100, base + 8 + jitter()),
    technicalDepth: Math.min(100, base - 5 + jitter()),
    github: {
      repos: 34, stars: 127, contributions: 892,
      languages: [
        { name: 'JavaScript', value: 38, color: '#F7DF1E' },
        { name: 'TypeScript', value: 27, color: '#3178C6' },
        { name: 'Python', value: 18, color: '#3776AB' },
        { name: 'CSS', value: 11, color: '#264DE4' },
        { name: 'Other', value: 6, color: '#475569' },
      ],
    },
    projects: [
      { name: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', score: 88, stars: 47 },
      { name: 'AI Chat Application', tech: 'Next.js, OpenAI, PostgreSQL', score: 92, stars: 83 },
      { name: 'DevOps Dashboard', tech: 'Vue.js, Docker, Kubernetes', score: 76, stars: 31 },
      { name: 'Portfolio Website', tech: 'React, Framer Motion', score: 84, stars: 19 },
      { name: 'CLI Productivity Tool', tech: 'Python, Click, Rich', score: 71, stars: 12 },
    ],
    strengths: [
      'Strong visual design consistency across all projects',
      'Well-documented GitHub repositories with clear READMEs',
      'Diverse technology stack showing adaptability',
      'Active contribution history demonstrating dedication',
    ],
    improvements: [
      'Add case studies with problem-solution narratives',
      'Include project metrics and business impact numbers',
      'Optimize portfolio website load time (currently 4.2s)',
      'Add testimonials or endorsements from collaborators',
    ],
    recruiterPerspective: "Your portfolio presents a strong technical foundation with clear project variety. The clean design and active GitHub activity signal a passionate developer. However, recruiters at top companies want to see *impact* â€” quantify results (e.g., \"reduced load time by 60%\") and add brief case studies to each project to stand out from 90% of candidates.",
    actionItems: [
      { priority: 'Critical', item: 'Add metrics to all 5 projects (users, performance gains, etc.)', color: '#EF4444' },
      { priority: 'High', item: 'Write 2-3 sentence case studies for top 3 projects', color: '#F59E0B' },
      { priority: 'High', item: 'Add a professional headshot and personal brand statement', color: '#F59E0B' },
      { priority: 'Medium', item: 'Optimize images and enable lazy loading for portfolio site', color: '#7C3AED' },
      { priority: 'Medium', item: 'Create a dedicated "Skills" page with proficiency levels', color: '#7C3AED' },
      { priority: 'Low', item: 'Add dark/light mode toggle to portfolio website', color: '#06B6D4' },
    ],
  };
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PortfolioReview = () => {
  const [form, setForm] = useState({ portfolioUrl: '', githubUrl: '', linkedinUrl: '', description: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    if (!form.portfolioUrl && !form.githubUrl) return;
    setAnalyzing(true);
    setStep(0);
    setData(null);
    for (let i = 0; i < 4; i++) {
      await new Promise(r => setTimeout(r, 520));
      setStep(i);
    }
    await new Promise(r => setTimeout(r, 400));
    setData(generateMockData(form.portfolioUrl, form.githubUrl, form.linkedinUrl));
    setAnalyzing(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px 13px 44px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#E2E8F0',
    fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 60 }}>
      <AnimatePresence>{analyzing && <LoadingOverlay step={step} />}</AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} style={{ color: '#7C3AED' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
              AI <span style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfolio Review</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0, marginTop: 2 }}>Get an expert AI analysis of your portfolio, GitHub & LinkedIn presence</p>
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 32, marginBottom: 32, backdropFilter: 'blur(12px)' }}
      >
        <h2 style={{ color: '#E2E8F0', fontSize: 18, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>Enter Your Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {[
            { key: 'portfolioUrl', icon: Globe, placeholder: 'https://yourportfolio.com', label: 'Portfolio URL *', color: '#7C3AED' },
            { key: 'githubUrl', icon: Github, placeholder: 'https://github.com/username', label: 'GitHub URL *', color: '#06B6D4' },
            { key: 'linkedinUrl', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', label: 'LinkedIn URL (optional)', color: '#0EA5E9' },
          ].map(({ key, icon: Icon, placeholder, label, color }) => (
            <div key={key} style={{ position: 'relative' }}>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color, pointerEvents: 'none' }} />
                <input
                  style={inputStyle}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>
          ))}
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Brief Description (optional)</label>
            <input
              style={{ ...inputStyle, paddingLeft: 16 }}
              placeholder="e.g. Full-stack developer with 3 years experience..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7C3AED'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={!form.portfolioUrl && !form.githubUrl}
          style={{
            marginTop: 24, padding: '14px 36px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16,
            fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            opacity: (!form.portfolioUrl && !form.githubUrl) ? 0.5 : 1,
          }}
        >
          <Search size={18} /> Analyze with AI
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

            {/* Overall Score + Sub Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 20 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '36px 24px', textAlign: 'center', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Portfolio Score</span>
                <BigGauge score={data.overall} label="/100" size={200} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 32, backdropFilter: 'blur(12px)' }}
              >
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>Score Breakdown</h3>
                <ScoreBar label="Design Quality" score={data.design} color="#7C3AED" icon={Eye} delay={0.2} />
                <ScoreBar label="Project Quality" score={data.projectQuality} color="#06B6D4" icon={Code2} delay={0.4} />
                <ScoreBar label="Recruiter Appeal" score={data.recruiterAppeal} color="#10B981" icon={Briefcase} delay={0.6} />
                <ScoreBar label="Technical Depth" score={data.technicalDepth} color="#F59E0B" icon={Cpu} delay={0.8} />
              </motion.div>
            </div>

            {/* GitHub Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20, padding: 28, marginBottom: 20, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <Github size={20} style={{ color: '#06B6D4' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif', margin: 0 }}>GitHub Statistics</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: 20 }}>
                {[
                  { label: 'Total Repos', value: data.github.repos, color: '#7C3AED' },
                  { label: 'Total Stars', value: data.github.stars, color: '#F59E0B' },
                  { label: 'Contributions', value: data.github.contributions, color: '#10B981' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 36, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}
                    >{value.toLocaleString()}</motion.div>
                    <div style={{ color: '#64748B', fontSize: 12, fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  </div>
                ))}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
                  <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Top Languages</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <PieChart>
                      <Pie data={data.github.languages} dataKey="value" cx="50%" cy="50%" outerRadius={46} strokeWidth={0}>
                        {data.github.languages.map((l, i) => <Cell key={i} fill={l.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0D1627', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 11 }} formatter={(v, n) => [`${v}%`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Projects + Strengths/Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Code2 size={18} style={{ color: '#7C3AED' }} />
                  <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Detected Projects</h3>
                </div>
                {data.projects.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < data.projects.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Code2 size={16} style={{ color: '#7C3AED' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 13, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>{p.tech}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: p.score >= 85 ? '#10B981' : p.score >= 70 ? '#7C3AED' : '#F59E0B', fontFamily: 'Outfit, sans-serif' }}>{p.score}</div>
                      <div style={{ color: '#475569', fontSize: 10 }}>â­ {p.stars}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Strengths & Improvements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: 22, backdropFilter: 'blur(12px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Star size={16} style={{ color: '#10B981' }} />
                    <h3 style={{ color: '#10B981', fontWeight: 700, fontSize: 14, margin: 0 }}>Strengths</h3>
                  </div>
                  {data.strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#94A3B8' }}>
                      <CheckCircle size={13} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                      {s}
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 22, backdropFilter: 'blur(12px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <AlertCircle size={16} style={{ color: '#EF4444' }} />
                    <h3 style={{ color: '#EF4444', fontWeight: 700, fontSize: 14, margin: 0 }}>Areas to Improve</h3>
                  </div>
                  {data.improvements.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#94A3B8' }}>
                      <AlertCircle size={13} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
                      {s}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Recruiter Perspective */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 28, marginBottom: 20, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Eye size={18} style={{ color: '#06B6D4' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Recruiter Perspective</h3>
                <span style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>What a recruiter sees</span>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: 1.9, fontSize: 14, margin: 0 }}>{data.recruiterPerspective}</p>
            </motion.div>

            {/* Action Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 28, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Target size={18} style={{ color: '#7C3AED' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Prioritized Action Items</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.actionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: `${item.color}08`, border: `1px solid ${item.color}20`, borderRadius: 12 }}
                  >
                    <span style={{ background: `${item.color}20`, color: item.color, fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.priority}</span>
                    <span style={{ color: '#CBD5E1', fontSize: 13, flex: 1 }}>{item.item}</span>
                    <ChevronRight size={14} style={{ color: '#475569', flexShrink: 0 }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioReview;

