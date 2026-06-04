import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Zap, Star, ChevronRight, BarChart3 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const COMPANY_DATA = {
  high: { companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'], color: '#10B981' },
  mid: { companies: ['Flipkart', 'Swiggy', 'Zomato', 'Razorpay', 'CRED'], color: '#F59E0B' },
  low: { companies: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL'], color: '#06B6D4' },
};

const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Java', 'C++', 'DSA', 'System Design', 'SQL', 'MongoDB', 'Machine Learning', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Git'];

const IMPROVEMENTS = {
  resume: 'Improve your resume with quantified achievements and ATS-friendly formatting.',
  coding: 'Practice 50+ LeetCode problems focusing on Dynamic Programming and Graphs.',
  interview: 'Do 10+ mock interviews on InterviewAce to improve confidence.',
  communication: 'Record yourself answering behavioral questions and improve clarity.',
  projects: 'Add 2 more impactful projects with GitHub links and live demos.',
};

const calcProbability = (scores, cgpa, tier, projects, skills) => {
  const avg = (scores.resume + scores.coding + scores.interview + scores.communication) / 4;
  const tierBonus = tier === 'tier1' ? 12 : tier === 'tier2' ? 5 : 0;
  const projBonus = Math.min(projects * 2, 14);
  const skillBonus = Math.min(skills.length * 1.5, 12);
  const cgpaBonus = cgpa >= 8.5 ? 8 : cgpa >= 7.5 ? 4 : cgpa >= 6.5 ? 1 : -3;
  return Math.min(97, Math.max(18, Math.round(avg * 0.7 + tierBonus + projBonus + skillBonus + cgpaBonus)));
};

const ScoreSlider = ({ label, value, onChange, color = '#7C3AED' }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <label style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{label}</label>
      <span style={{ color, fontWeight: 800, fontSize: 15, fontFamily: 'Outfit' }}>{value}</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={e => onChange(+e.target.value)}
      style={{ width: '100%', accentColor: color, cursor: 'pointer', height: 6 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', fontSize: 10, marginTop: 2 }}>
      <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
    </div>
  </div>
);

const ProbabilityGauge = ({ value }) => {
  const color = value >= 75 ? '#10B981' : value >= 50 ? '#F59E0B' : '#EF4444';
  const circumference = 2 * Math.PI * 70;
  const strokeDash = (value / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="12" />
          <motion.circle cx="90" cy="90" r="70" fill="none" stroke={color} strokeWidth="12"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ fontSize: 40, fontWeight: 900, color, fontFamily: 'Outfit', lineHeight: 1 }}>{value}%</motion.span>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Placement Chance</span>
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color, padding: '5px 16px', borderRadius: 20, background: color + '15', border: `1px solid ${color}30` }}>
        {value >= 80 ? '🌟 Excellent Profile' : value >= 60 ? '✅ Good Profile' : value >= 40 ? '⚠️ Average Profile' : '📚 Needs Improvement'}
      </span>
    </div>
  );
};

const PlacementPredictor = () => {
  const [scores, setScores] = useState({ resume: 65, coding: 60, interview: 55, communication: 70 });
  const [cgpa, setCgpa] = useState(7.5);
  const [tier, setTier] = useState('tier2');
  const [projects, setProjects] = useState(3);
  const [selectedSkills, setSelectedSkills] = useState(['React', 'DSA', 'Python']);
  const [experience, setExperience] = useState('fresher');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = s => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const analyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    const prob = calcProbability(scores, cgpa, tier, projects, selectedSkills);
    const companies = prob >= 75 ? COMPANY_DATA.high.companies.slice(0, 3) : prob >= 50 ? COMPANY_DATA.mid.companies.slice(0, 3) : COMPANY_DATA.low.companies.slice(0, 3);
    const weak = Object.entries(scores).filter(([, v]) => v < 70).map(([k]) => k);
    const strong = Object.entries(scores).filter(([, v]) => v >= 75).map(([k]) => k);
    setResult({ prob, companies, weak, strong });
    setLoading(false);
  };

  const radarData = [
    { subject: 'Resume', value: scores.resume },
    { subject: 'Coding', value: scores.coding },
    { subject: 'Interview', value: scores.interview },
    { subject: 'Communication', value: scores.communication },
    { subject: 'Projects', value: Math.min(100, projects * 12) },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={22} style={{ color: '#A78BFA' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', margin: 0 }}>
              <span className="gradient-text">AI Placement Predictor</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>Enter your profile details to predict placement probability</p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '600px', gap: 24, justifyContent: result ? 'stretch' : 'center' }}>
        {/* INPUT FORM */}
        <motion.div layout style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 24, color: '#F1F5F9' }}>📊 Your Profile</h2>

          <ScoreSlider label="Resume Score" value={scores.resume} onChange={v => setScores(s => ({ ...s, resume: v }))} color="#7C3AED" />
          <ScoreSlider label="Coding Score" value={scores.coding} onChange={v => setScores(s => ({ ...s, coding: v }))} color="#06B6D4" />
          <ScoreSlider label="Interview Score" value={scores.interview} onChange={v => setScores(s => ({ ...s, interview: v }))} color="#10B981" />
          <ScoreSlider label="Communication Score" value={scores.communication} onChange={v => setScores(s => ({ ...s, communication: v }))} color="#F59E0B" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>CGPA</label>
              <input type="number" min="0" max="10" step="0.1" value={cgpa} onChange={e => setCgpa(+e.target.value)}
                className="input-field" style={{ padding: '9px 12px', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Projects</label>
              <input type="number" min="0" max="20" value={projects} onChange={e => setProjects(+e.target.value)}
                className="input-field" style={{ padding: '9px 12px', fontSize: 14 }} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>College Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[['tier1', 'IIT/NIT/BITS'], ['tier2', 'Tier 2'], ['tier3', 'Tier 3']].map(([v, l]) => (
                <button key={v} onClick={() => setTier(v)} style={{ padding: '8px', borderRadius: 10, border: `1.5px solid ${tier === v ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: tier === v ? 'rgba(124,58,237,0.15)' : 'transparent', color: tier === v ? '#C4B5FD' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SKILLS_LIST.map(s => (
                <button key={s} onClick={() => toggleSkill(s)} style={{ padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${selectedSkills.includes(s) ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: selectedSkills.includes(s) ? 'rgba(124,58,237,0.15)' : 'transparent', color: selectedSkills.includes(s) ? '#C4B5FD' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={analyze} disabled={loading}
            className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Zap size={16} /></motion.div> Analyzing...</> : <><Brain size={16} /> Predict with AI</>}
          </motion.button>
        </motion.div>

        {/* RESULTS */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Gauge */}
              <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <ProbabilityGauge value={result.prob} />
                <div style={{ width: '100%' }}>
                  <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>Top Matching Companies</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {result.companies.map((c, i) => (
                      <motion.div key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 1 }}
                        style={{ padding: '7px 16px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#A5B4FC', fontSize: 13, fontWeight: 700 }}>
                        🏢 {c}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 20, height: 220 }}>
                <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Profile Radar</p>
                <ResponsiveContainer width="100%" height="85%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(99,102,241,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Radar dataKey="value" stroke="#7C3AED" fill="rgba(124,58,237,0.2)" strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#0D1627', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Strong/Weak Areas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 16 }}>
                  <p style={{ color: '#10B981', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ Strong Areas</p>
                  {result.strong.length > 0 ? result.strong.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <CheckCircle size={13} style={{ color: '#10B981' }} />
                      <span style={{ color: '#6EE7B7', fontSize: 13, textTransform: 'capitalize' }}>{s}</span>
                    </div>
                  )) : <p style={{ color: '#475569', fontSize: 12 }}>Improve scores above 75 to unlock</p>}
                </div>
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 16 }}>
                  <p style={{ color: '#EF4444', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>⚠️ Focus Areas</p>
                  {result.weak.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <AlertCircle size={13} style={{ color: '#EF4444' }} />
                      <span style={{ color: '#FCA5A5', fontSize: 13, textTransform: 'capitalize' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 18 }}>
                <p style={{ color: '#A78BFA', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💡 Personalized Suggestions</p>
                {result.weak.slice(0, 3).map(k => (
                  <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                    <ChevronRight size={14} style={{ color: '#7C3AED', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ color: '#94A3B8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{IMPROVEMENTS[k] || `Improve your ${k} skills with targeted practice.`}</p>
                  </div>
                ))}
                {result.prob < 80 && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                    <ChevronRight size={14} style={{ color: '#7C3AED', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>Build 2 more real-world projects with proper documentation and deploy them online.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default PlacementPredictor;
