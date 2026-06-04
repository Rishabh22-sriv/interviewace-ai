import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Globe, GitBranch, Link2, Award, TrendingUp,
  ChevronDown, ChevronUp, Zap, Star, Users, Target,
  Share2, Download, CheckCircle, BarChart3, Layers
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

// â”€â”€â”€ Central Score Display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CentralScore = ({ score, animating }) => {
  const r = 88;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#7C3AED' : '#F59E0B';

  return (
    <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
      <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="centralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer decorative rings */}
        <circle cx={110} cy={110} r={104} fill="none" stroke="rgba(124,58,237,0.06)" strokeWidth={1} strokeDasharray="4 6" />
        <circle cx={110} cy={110} r={96} fill="none" stroke="rgba(124,58,237,0.04)" strokeWidth={1} />
        {/* Track */}
        <circle cx={110} cy={110} r={r} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth={14} />
        {/* Score arc */}
        <motion.circle
          cx={110} cy={110} r={r}
          fill="none" stroke="url(#centralGrad)" strokeWidth={14} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: animating ? circ : circ * (1 - score / 100) }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          filter="url(#glow)"
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: animating ? 0 : 1, scale: animating ? 0.3 : 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div style={{ fontSize: 64, fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1, background: 'linear-gradient(135deg, #7C3AED, #06B6D4, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>{score}</div>
          <div style={{ fontSize: 14, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>/100</div>
        </motion.div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Quadrant Score Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const QuadScore = ({ label, score, color, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    style={{
      background: `${color}08`, border: `1px solid ${color}25`,
      borderRadius: 18, padding: '24px 20px', textAlign: 'center',
    }}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div style={{ fontSize: 42, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{score}</div>
    <div style={{ color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>/100</div>
    <div style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600, marginTop: 8 }}>{label}</div>
    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginTop: 12 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, delay: delay + 0.3 }}
        style={{ height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 4 }}
      />
    </div>
  </motion.div>
);

// â”€â”€â”€ Accordion Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Accordion = ({ icon: Icon, title, color, badge, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: 'rgba(13,22,39,0.8)', border: `1px solid ${color}20`, borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(12px)', marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} style={{ color }} />
          </div>
          <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif' }}>{title}</span>
          {badge && <span style={{ background: `${color}20`, color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{badge}</span>}
        </div>
        {open ? <ChevronUp size={16} style={{ color: '#475569' }} /> : <ChevronDown size={16} style={{ color: '#475569' }} />}
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
    </div>
  );
};

const archetypes = [
  { type: 'The Technical Expert', emoji: 'âš™ï¸', description: 'Your profile screams deep technical mastery. Recruiters see you as an invaluable technical contributor.', trigger: (s) => s.github > s.linkedin && s.github > s.portfolio },
  { type: 'The Builder', emoji: 'ðŸ”¨', description: 'Strong project portfolio with visible deliverables. Recruiters see someone who ships real products.', trigger: (s) => s.portfolio > s.resume && s.portfolio > s.linkedin },
  { type: 'The Creator', emoji: 'ðŸŽ¨', description: 'Visual storytelling & design-forward presence. Your brand stands out aesthetically from the crowd.', trigger: (s) => s.portfolio > s.github && s.resume > 75 },
  { type: 'The Strategic Connector', emoji: 'ðŸ¤', description: 'Strong LinkedIn presence with great personal narrative. Recruiters love your communication style.', trigger: (s) => s.linkedin > s.github && s.linkedin > s.portfolio },
  { type: 'The Well-Rounded Pro', emoji: 'ðŸŒŸ', description: 'Balanced strength across all dimensions. You appeal to a wide range of recruiters and roles.', trigger: () => true },
];

const getBrandArchetype = (scores) => {
  return archetypes.find(a => a.trigger(scores)) || archetypes[archetypes.length - 1];
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PersonalBrandingScore = () => {
  const [inputs, setInputs] = useState({
    resumeScore: 72, resumeAts: 68,
    portfolioUrl: '',
    githubUser: '',
    linkedinUrl: '',
  });
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);

  const handleCalculate = async () => {
    setCalculating(true);
    setData(null);
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(r => setTimeout(r, 55));
      setProgress(i);
    }
    const hasPortfolio = !!inputs.portfolioUrl;
    const hasGithub = !!inputs.githubUser;
    const hasLinkedin = !!inputs.linkedinUrl;

    const resumeScore = inputs.resumeScore || 72;
    const portfolioScore = hasPortfolio ? Math.floor(68 + Math.random() * 22) : Math.floor(45 + Math.random() * 20);
    const githubScore = hasGithub ? Math.floor(74 + Math.random() * 18) : Math.floor(38 + Math.random() * 22);
    const linkedinScore = hasLinkedin ? Math.floor(70 + Math.random() * 20) : Math.floor(42 + Math.random() * 22);
    const overall = Math.floor((resumeScore + portfolioScore + githubScore + linkedinScore) / 4);
    const scores = { resume: resumeScore, portfolio: portfolioScore, github: githubScore, linkedin: linkedinScore };

    setData({
      overall,
      scores,
      radarData: [
        { dimension: 'Resume', value: resumeScore },
        { dimension: 'Portfolio', value: portfolioScore },
        { dimension: 'GitHub', value: githubScore },
        { dimension: 'LinkedIn', value: linkedinScore },
      ],
      avgScore: 61,
      top10Score: 88,
      recruiterMagnetism: Math.floor((overall * 0.95) + (hasPortfolio ? 3 : 0) + (hasGithub ? 2 : 0)),
      archetype: getBrandArchetype(scores),
      recommendations: [
        { text: 'Add quantifiable impact metrics to your top 3 resume bullets', priority: '#EF4444', category: 'Resume' },
        { text: 'Write 2-3 project case studies with problem â†’ solution â†’ impact', priority: '#EF4444', category: 'Portfolio' },
        { text: 'Pin 6 best repositories with detailed READMEs on GitHub', priority: '#F59E0B', category: 'GitHub' },
        { text: 'Optimize LinkedIn headline with role + technologies + value prop', priority: '#F59E0B', category: 'LinkedIn' },
        { text: 'Request 3 LinkedIn recommendations from past colleagues', priority: '#7C3AED', category: 'LinkedIn' },
        { text: 'Contribute to 2-3 open source projects in your domain', priority: '#7C3AED', category: 'GitHub' },
        { text: 'Post weekly technical content on LinkedIn for 4 weeks', priority: '#06B6D4', category: 'Branding' },
        { text: 'Add a professional headshot across all platforms consistently', priority: '#06B6D4', category: 'Branding' },
      ],
      github: {
        repos: hasGithub ? 34 : 0,
        stars: hasGithub ? 127 : 0,
        streak: hasGithub ? 23 : 0,
        prs: hasGithub ? 47 : 0,
      },
    });
    setCalculating(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, color: '#E2E8F0',
    fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(16,185,129,0.2))', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={26} style={{ color: '#7C3AED' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
              Personal <span style={{ background: 'linear-gradient(135deg, #7C3AED, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Branding Score</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0, marginTop: 2 }}>The ultimate unified score measuring your professional digital presence</p>
          </div>
        </div>
      </motion.div>

      {/* Input Sections (Accordion style) */}
      <div style={{ marginBottom: 24 }}>
        <Accordion icon={FileText} title="Resume" color="#7C3AED" badge="Quick scan" defaultOpen>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>ATS Score (0-100)</label>
              <input type="number" min={0} max={100} style={inputStyle} value={inputs.resumeScore} onChange={e => setInputs(p => ({ ...p, resumeScore: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Design Score (0-100)</label>
              <input type="number" min={0} max={100} style={inputStyle} value={inputs.resumeAts} onChange={e => setInputs(p => ({ ...p, resumeAts: parseInt(e.target.value) || 0 }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: '10px 20px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, color: '#A78BFA', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <FileText size={15} /> Upload Resume (PDF) â€” Quick Score
              </motion.button>
            </div>
          </div>
        </Accordion>

        <Accordion icon={Globe} title="Portfolio" color="#06B6D4">
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Portfolio URL</label>
            <input style={inputStyle} placeholder="https://yourportfolio.com" value={inputs.portfolioUrl} onChange={e => setInputs(p => ({ ...p, portfolioUrl: e.target.value }))} />
          </div>
        </Accordion>

        <Accordion icon={Github} title="GitHub" color="#10B981">
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>GitHub Username</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="e.g. johndoe" value={inputs.githubUser} onChange={e => setInputs(p => ({ ...p, githubUser: e.target.value }))} />
              <motion.button
                whileHover={{ scale: 1.04 }}
                style={{ padding: '10px 18px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10B981', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Fetch Stats
              </motion.button>
            </div>
            {inputs.githubUser && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {[{ label: '34 Repos', color: '#7C3AED' }, { label: '127 â˜…', color: '#F59E0B' }, { label: '892 Contributions', color: '#10B981' }].map(({ label, color }) => (
                  <span key={label} style={{ background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{label}</span>
                ))}
              </div>
            )}
          </div>
        </Accordion>

        <Accordion icon={Linkedin} title="LinkedIn" color="#F97316">
          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>LinkedIn Profile URL</label>
            <input style={inputStyle} placeholder="https://linkedin.com/in/username" value={inputs.linkedinUrl} onChange={e => setInputs(p => ({ ...p, linkedinUrl: e.target.value }))} />
          </div>
        </Accordion>
      </div>

      {/* Calculate Button */}
      <motion.div style={{ marginBottom: 32 }}>
        {calculating && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#94A3B8', fontSize: 13 }}>Calculating your branding score...</span>
              <span style={{ color: '#7C3AED', fontSize: 13, fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4, #10B981)', borderRadius: 6, width: `${progress}%` }} />
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCalculate}
          disabled={calculating}
          style={{
            width: '100%', padding: '18px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4, #10B981)',
            border: 'none', borderRadius: 16, color: '#fff', fontWeight: 800, fontSize: 18,
            fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            opacity: calculating ? 0.7 : 1,
          }}
        >
          <Zap size={22} /> {calculating ? 'Calculating...' : 'Calculate My Branding Score'}
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Hero Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06), rgba(16,185,129,0.06))',
                border: '1px solid rgba(124,58,237,0.25)', borderRadius: 24, padding: '40px 32px',
                marginBottom: 24, backdropFilter: 'blur(16px)', textAlign: 'center',
              }}
            >
              <p style={{ color: '#7C3AED', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 24 }}>Your Personal Branding Score</p>
              <CentralScore score={data.overall} animating={false} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{ color: '#94A3B8', fontSize: 15, marginTop: 20, lineHeight: 1.6 }}
              >
                You rank in the <strong style={{ color: data.overall >= data.top10Score ? '#10B981' : '#7C3AED' }}>
                  {data.overall >= data.top10Score ? 'top 10%' : data.overall >= data.avgScore ? 'top 35%' : 'top 50%'}
                </strong> of candidates in your field
              </motion.p>
            </motion.div>

            {/* 4 Quadrant Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              <QuadScore label="Resume Score" score={data.scores.resume} color="#7C3AED" icon={FileText} delay={0.2} />
              <QuadScore label="Portfolio Score" score={data.scores.portfolio} color="#06B6D4" icon={Globe} delay={0.3} />
              <QuadScore label="GitHub Score" score={data.scores.github} color="#10B981" icon={Github} delay={0.4} />
              <QuadScore label="LinkedIn Score" score={data.scores.linkedin} color="#F97316" icon={Linkedin} delay={0.5} />
            </div>

            {/* Radar Chart + Industry Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 28, backdropFilter: 'blur(12px)' }}
              >
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', marginBottom: 20 }}>Brand Radar</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={data.radarData}>
                    <PolarGrid stroke="rgba(124,58,237,0.15)" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Your Score" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} />
                    <Tooltip contentStyle={{ background: '#0D1627', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Industry Comparison */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 20, padding: 22, backdropFilter: 'blur(12px)', flex: 1 }}
                >
                  <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 14, fontFamily: 'Outfit, sans-serif', marginBottom: 18 }}>Industry Comparison</h3>
                  {[
                    { label: 'Your Score', val: data.overall, color: '#7C3AED' },
                    { label: 'Industry Average', val: data.avgScore, color: '#64748B' },
                    { label: 'Top 10%', val: data.top10Score, color: '#10B981' },
                  ].map(({ label, val, color }, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>{label}</span>
                        <span style={{ color, fontWeight: 800, fontSize: 14, fontFamily: 'Outfit, sans-serif' }}>{val}</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 1.2, delay: 0.6 + i * 0.1 }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${color}70, ${color})`, borderRadius: 4 }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Recruiter Magnetism */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(245,158,11,0.06))', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, padding: 22, backdropFilter: 'blur(12px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Zap size={16} style={{ color: '#F97316' }} />
                    <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 14, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Recruiter Magnetism</h3>
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#F97316', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{data.recruiterMagnetism}%</div>
                  <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 6 }}>Probability a recruiter will reach out after viewing your profile</p>
                </motion.div>
              </div>
            </div>

            {/* Branding Archetype */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))',
                border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: 28,
                marginBottom: 24, backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 52, lineHeight: 1 }}>{data.archetype.emoji}</div>
                <div>
                  <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 4 }}>Your Branding Archetype</p>
                  <h3 style={{ color: '#E2E8F0', fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: '0 0 8px' }}>{data.archetype.type}</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{data.archetype.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 20, padding: 28, marginBottom: 24, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Target size={18} style={{ color: '#7C3AED' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif', margin: 0 }}>8 Actionable Recommendations</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {data.recommendations.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.07 }}
                    style={{ display: 'flex', gap: 12, padding: '14px 16px', background: `${r.priority}08`, border: `1px solid ${r.priority}20`, borderRadius: 12, alignItems: 'flex-start' }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: r.priority, flexShrink: 0, fontFamily: 'Outfit, sans-serif', lineHeight: 1, marginTop: 2 }}>{i + 1}</span>
                    <div>
                      <span style={{ background: `${r.priority}20`, color: r.priority, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, display: 'inline-block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{r.category}</span>
                      <p style={{ color: '#CBD5E1', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Share Branding Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Share2 size={18} style={{ color: '#10B981' }} />
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Share Your Branding Card</h3>
              </div>
              {/* Mock share card preview */}
              <div style={{
                background: 'linear-gradient(135deg, #0D1627, #1a0a3e)',
                border: '1px solid rgba(124,58,237,0.4)', borderRadius: 16,
                padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24,
                maxWidth: 560, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent)', pointerEvents: 'none' }} />
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 28 }}>{data.archetype.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#7C3AED', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4 }}>Personal Branding Score â€” InterviewAce AI</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, #7C3AED, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{data.overall}</span>
                    <span style={{ color: '#475569', fontSize: 16 }}>/100</span>
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: 12 }}>{data.archetype.type}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[{ label: 'R', val: data.scores.resume, color: '#7C3AED' }, { label: 'P', val: data.scores.portfolio, color: '#06B6D4' }, { label: 'G', val: data.scores.GitBranch, color: '#10B981' }, { label: 'L', val: data.scores.Link2, color: '#F97316' }].map(({ label, val, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#475569', fontSize: 10, fontWeight: 700, width: 12 }}>{label}</span>
                      <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 2 }} />
                      </div>
                      <span style={{ color, fontSize: 10, fontWeight: 700 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <motion.button whileHover={{ scale: 1.04 }} style={{ padding: '10px 22px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10B981', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Share2 size={14} /> Share Card
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} style={{ padding: '10px 22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94A3B8', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={14} /> Download PNG
                </motion.button>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalBrandingScore;

