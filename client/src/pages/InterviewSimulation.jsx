import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Building, ChevronRight, Play, CheckCircle, XCircle,
  Clock, Brain, Code, Users, MessageSquare, DollarSign, Trophy,
  AlertCircle, Star, TrendingUp, ArrowRight, RotateCcw, FileText
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const JOB_ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'ML Engineer', 'Product Manager', 'DevOps Engineer', 'UI/UX Designer'];
const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Swiggy', 'Zomato', 'Meesho'];
const LEVELS = ['Fresher', 'Mid-Level', 'Senior'];

const MCQ_QUESTIONS = [
  { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: 1 },
  { q: 'Which React hook manages side effects?', options: ['useState', 'useEffect', 'useContext', 'useRef'], correct: 1 },
  { q: 'What does SQL JOIN operation do?', options: ['Deletes rows', 'Combines table data', 'Creates an index', 'Sorts output data'], correct: 1 },
];

const TECH_QUESTIONS = [
  'Explain the difference between == and === in JavaScript.',
  'What is closure in programming? Give a real-world example.',
  'How does the event loop work in Node.js?',
  'What is REST API and what are its core principles?',
  'Explain Big O notation with at least two examples.',
];

const MANAGERIAL_QUESTIONS = [
  'Describe a time you led a project under extremely tight deadlines.',
  'How do you handle conflicts between team members?',
  'What is your approach to learning new technologies quickly?',
];

const HR_QUESTIONS = [
  'What are your salary expectations for this role?',
  'Where do you see yourself professionally in 5 years?',
];

const STAGE_FEEDBACK = {
  resume: { score: 78, pass: true, feedback: 'Your resume shows a strong technical background with relevant projects. The formatting is clean and ATS-friendly. Consider quantifying your achievements with metrics.' },
  assessment: { maxScore: 90 },
  technical: { scorePerQ: 16 },
  managerial: { scorePerQ: 30 },
  hr: { scorePerQ: 45 },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

const CircularTimer = ({ seconds, maxSeconds, color = '#7C3AED', size = 80 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = seconds / maxSeconds;
  const dash = pct * circ;
  const urgent = seconds <= 10;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={urgent ? '#EF4444' : color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ - dash}
          strokeLinecap="round"
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size > 70 ? 18 : 13, fontWeight: 800, color: urgent ? '#EF4444' : '#F1F5F9', fontFamily: 'Outfit, sans-serif' }}>
          {seconds}s
        </span>
      </div>
    </div>
  );
};

const RadarChart = ({ scores }) => {
  const cx = 150, cy = 150, r = 110;
  const labels = ['Resume', 'Assessment', 'Technical', 'Managerial', 'HR'];
  const angles = labels.map((_, i) => (2 * Math.PI * i) / labels.length - Math.PI / 2);
  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = labels.map((l, i) => {
    const val = (scores[l.toLowerCase()] || 0) / 100;
    return toXY(angles[i], r * val);
  });
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <svg width={300} height={300} viewBox="0 0 300 300">
      {gridLevels.map(lvl => {
        const pts = angles.map(a => toXY(a, r * lvl)).map(p => `${p.x},${p.y}`).join(' ');
        return <polygon key={lvl} points={pts} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth={1} />;
      })}
      {angles.map((a, i) => {
        const end = toXY(a, r);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(99,102,241,0.2)" strokeWidth={1} />;
      })}
      <motion.polygon
        points={polygonPoints} fill="rgba(124,58,237,0.2)" stroke="#7C3AED" strokeWidth={2.5}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {dataPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={5} fill="#7C3AED"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }} />
      ))}
      {labels.map((l, i) => {
        const pos = toXY(angles[i], r + 22);
        return (
          <text key={l} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fill="#94A3B8" fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">
            {l}
          </text>
        );
      })}
    </svg>
  );
};

const StepIndicator = ({ steps, current }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
    {steps.map((s, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              animate={{ scale: active ? 1.15 : 1 }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? '#10B981' : active ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'rgba(13,22,39,0.8)',
                border: `2px solid ${done ? '#10B981' : active ? '#7C3AED' : 'rgba(99,102,241,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 0 20px rgba(124,58,237,0.5)' : 'none',
                zIndex: 1, flexShrink: 0,
              }}
            >
              {done ? <CheckCircle size={16} color="white" /> : <s.icon size={15} color={active ? 'white' : '#475569'} />}
            </motion.div>
            {i < steps.length - 1 && (
              <div style={{ width: 2, height: 40, background: done ? '#10B981' : 'rgba(99,102,241,0.15)', margin: '2px 0' }} />
            )}
          </div>
          <div style={{ paddingLeft: 14, paddingTop: 6, paddingBottom: i < steps.length - 1 ? 30 : 0 }}>
            <p style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: done ? '#10B981' : active ? '#F1F5F9' : '#475569', margin: 0, lineHeight: 1.3 }}>{s.label}</p>
            {active && <p style={{ fontSize: 11, color: '#7C3AED', margin: '2px 0 0', fontWeight: 600 }}>In Progress</p>}
            {done && <p style={{ fontSize: 11, color: '#10B981', margin: '2px 0 0', fontWeight: 600 }}>Completed</p>}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Landing ─────────────────────────────────────────────────────────────────

const Landing = ({ onStart }) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [level, setLevel] = useState('Fresher');

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, marginBottom: 20 }}>
          <Briefcase size={13} color="#A78BFA" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1.2 }}>Full Hiring Process Simulator</span>
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 12, lineHeight: 1.15 }}>
          Real <span className="gradient-text">Interview</span> Simulation
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
          Experience the complete hiring pipeline — from resume screening to final HR round — with AI-powered feedback at every stage.
        </p>
      </div>

      <div className="glass-card-static" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label className="label">Job Role</label>
            <select className="select-field" value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Select a role...</option>
              {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Target Company</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input-field" placeholder="e.g., Google, Infosys..."
                value={company} onChange={e => setCompany(e.target.value)}
                list="companies-list"
              />
              <datalist id="companies-list">{COMPANIES.map(c => <option key={c} value={c} />)}</datalist>
            </div>
          </div>
        </div>

        <div>
          <label className="label" style={{ marginBottom: 12 }}>Experience Level</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)} style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: `2px solid ${level === l ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`,
                background: level === l ? 'rgba(124,58,237,0.12)' : 'rgba(13,22,39,0.5)',
                color: level === l ? '#C4B5FD' : '#94A3B8', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                boxShadow: level === l ? '0 0 20px rgba(124,58,237,0.2)' : 'none',
              }}>
                {l === 'Fresher' ? '🌱' : l === 'Mid-Level' ? '⚡' : '🚀'} {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { icon: FileText, label: 'Resume Screening', color: '#06B6D4' },
          { icon: Code, label: 'Online Assessment', color: '#7C3AED' },
          { icon: Brain, label: 'Technical Round', color: '#10B981' },
          { icon: Users, label: 'Managerial Round', color: '#F59E0B' },
          { icon: MessageSquare, label: 'HR Round', color: '#EC4899' },
          { icon: Trophy, label: 'Final Result', color: '#A78BFA' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <s.icon size={16} color={s.color} />
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <motion.button
        id="start-simulation-btn"
        className="btn-primary"
        onClick={() => { if (role && company) onStart({ role, company, level }); }}
        disabled={!role || !company}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        style={{ width: '100%', padding: '18px', fontSize: 17, justifyContent: 'center', borderRadius: 16 }}
      >
        <Play size={20} /> Launch Full Simulation
      </motion.button>
      {(!role || !company) && <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 10 }}>Please select a role and company to begin</p>}
    </motion.div>
  );
};

// ─── Step 1: Resume Screening ─────────────────────────────────────────────────

const ResumeScreening = ({ config, onComplete }) => {
  const [phase, setPhase] = useState('scanning'); // scanning | result
  const [timer, setTimer] = useState(30);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setPhase('result');
          return 0;
        }
        setProgress(((30 - t + 1) / 30) * 100);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const feedback = STAGE_FEEDBACK.resume;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#06B6D4,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Resume Screening</h2>
          <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>AI is analyzing your profile for {config.role} at {config.company}</p>
        </div>
        {phase === 'scanning' && <div style={{ marginLeft: 'auto' }}><CircularTimer seconds={timer} maxSeconds={30} color="#06B6D4" /></div>}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'scanning' ? (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card-static" style={{ padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <motion.div
                animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#06B6D4,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}
              >
                <Brain size={30} color="white" />
              </motion.div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px' }}>AI is scanning your resume...</p>
              <p style={{ color: '#94A3B8', fontSize: 13 }}>Checking ATS compatibility, skills match, and profile strength</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              {['Parsing resume structure...', 'Matching skills to job requirements...', 'Checking ATS keywords...', 'Evaluating project relevance...'].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ delay: i * 0.7 + 0.3, duration: 0.4 }}>
                    <CheckCircle size={15} color="#10B981" />
                  </motion.div>
                  <span style={{ color: '#94A3B8', fontSize: 13 }}>{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <motion.div className="progress-fill" style={{ height: 8, background: 'linear-gradient(90deg,#06B6D4,#7C3AED)' }}
                animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-static" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                style={{ width: 64, height: 64, borderRadius: '50%', background: feedback.pass ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#EF4444,#DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${feedback.pass ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                {feedback.pass ? <CheckCircle size={30} color="white" /> : <XCircle size={30} color="white" />}
              </motion.div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: feedback.pass ? '#10B981' : '#EF4444', margin: 0 }}>
                  Resume {feedback.pass ? 'Passed ✓' : 'Rejected ✗'}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: 13, margin: '4px 0 0' }}>Screening complete — Score: {feedback.score}/100</p>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 36, fontWeight: 900, color: feedback.pass ? '#10B981' : '#EF4444', fontFamily: 'Outfit, sans-serif' }}>{feedback.score}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: 18, marginBottom: 20 }}>
              <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{feedback.feedback}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
              {[{ label: 'ATS Score', val: 82, color: '#06B6D4' }, { label: 'Skill Match', val: 75, color: '#7C3AED' }, { label: 'Profile Strength', val: 78, color: '#10B981' }].map(m => (
                <div key={m.label} style={{ textAlign: 'center', padding: '14px 12px', background: 'rgba(13,22,39,0.5)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.1)' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}%</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => onComplete({ stage: 'resume', score: feedback.score, passed: feedback.pass })}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Continue to Online Assessment <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Step 2: Online Assessment ─────────────────────────────────────────────────

const OnlineAssessment = ({ onComplete }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [scores, setScores] = useState([]);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setTimer(60);
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit(null, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [qIdx]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [qIdx]);

  const handleSubmit = (sel, timeUp = false) => {
    clearInterval(intervalRef.current);
    const s = sel !== null ? sel : selected;
    const correct = s === MCQ_QUESTIONS[qIdx].correct;
    setAnswered(true);
    const newScore = correct ? 30 : 0;
    const newScores = [...scores, newScore];
    setTimeout(() => {
      if (qIdx < MCQ_QUESTIONS.length - 1) {
        setQIdx(qIdx + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const total = newScores.reduce((a, b) => a + b, 0);
        onComplete({ stage: 'assessment', score: total, passed: total >= 60 });
      }
    }, 1500);
    setScores(old => [...old, newScore]);
  };

  const q = MCQ_QUESTIONS[qIdx];

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7C3AED,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Code size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Online Assessment</h2>
          <p style={{ color: '#94A3B8', fontSize: 13, margin: '2px 0 0' }}>Question {qIdx + 1} of {MCQ_QUESTIONS.length}</p>
        </div>
        <CircularTimer seconds={timer} maxSeconds={60} color="#7C3AED" size={72} />
      </div>

      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: `${((qIdx) / MCQ_QUESTIONS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <div className="glass-card-static" style={{ padding: 28, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(124,58,237,0.15)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#A78BFA', whiteSpace: 'nowrap', marginTop: 2 }}>Q{qIdx + 1}</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9', margin: 0, lineHeight: 1.6 }}>{q.q}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {q.options.map((opt, i) => {
              let bg = 'rgba(13,22,39,0.6)', border = 'rgba(99,102,241,0.12)', color = '#94A3B8';
              if (answered) {
                if (i === q.correct) { bg = 'rgba(16,185,129,0.12)'; border = '#10B981'; color = '#6EE7B7'; }
                else if (i === selected && i !== q.correct) { bg = 'rgba(239,68,68,0.1)'; border = '#EF4444'; color = '#FCA5A5'; }
              } else if (selected === i) { bg = 'rgba(124,58,237,0.12)'; border = '#7C3AED'; color = '#C4B5FD'; }
              return (
                <motion.button key={i} whileHover={!answered ? { scale: 1.01 } : {}} whileTap={!answered ? { scale: 0.99 } : {}}
                  onClick={() => !answered && setSelected(i)}
                  style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color, cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answered && i === q.correct && <CheckCircle size={16} color="#10B981" style={{ marginLeft: 'auto' }} />}
                  {answered && i === selected && i !== q.correct && <XCircle size={16} color="#EF4444" style={{ marginLeft: 'auto' }} />}
                </motion.button>
              );
            })}
          </div>

          {!answered && (
            <button className="btn-primary" onClick={() => handleSubmit(selected)} disabled={selected === null}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Submit Answer
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Step 3–5: Text Round ─────────────────────────────────────────────────────

const TextRound = ({ title, icon: Icon, color, questions, onComplete, stageKey, maxPerQ }) => {
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);
  const [timer, setTimer] = useState(120);
  const intervalRef = useRef(null);

  const mockFeedback = [
    'Good structured answer. You demonstrated clear thinking and relevant examples.',
    'Well articulated. Consider adding more specific metrics or outcomes next time.',
    'Solid response. Your knowledge comes through — try to be more concise.',
    'Strong technical depth shown. Practice explaining complex concepts in simpler terms.',
    'Great use of examples. Your communication style is professional and clear.',
  ];

  useEffect(() => {
    setTimer(120);
    intervalRef.current = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(intervalRef.current); return 0; } return t - 1; }), 1000);
    return () => clearInterval(intervalRef.current);
  }, [qIdx]);

  const handleSubmit = () => {
    clearInterval(intervalRef.current);
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.min(maxPerQ, Math.round(maxPerQ * Math.min(1, wordCount / 40) * (0.7 + Math.random() * 0.3)));
    setScores(old => [...old, score]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
      setAnswer('');
      setSubmitted(false);
    } else {
      const total = [...scores].reduce((a, b) => a + b, 0);
      onComplete({ stage: stageKey, score: Math.round(total / questions.length * (100 / maxPerQ)), passed: true });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${color},${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{title}</h2>
          <p style={{ color: '#94A3B8', fontSize: 13, margin: '2px 0 0' }}>Question {qIdx + 1} of {questions.length}</p>
        </div>
        <CircularTimer seconds={timer} maxSeconds={120} color={color} size={72} />
      </div>

      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: `${(qIdx / questions.length) * 100}%`, background: `linear-gradient(90deg,${color},${color}88)` }} />
      </div>

      <div className="glass-card-static" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ background: `rgba(124,58,237,0.1)`, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#A78BFA', whiteSpace: 'nowrap', marginTop: 2 }}>Q{qIdx + 1}</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9', margin: 0, lineHeight: 1.65 }}>{questions[qIdx]}</p>
        </div>
        <textarea
          className="input-field" value={answer} onChange={e => setAnswer(e.target.value)}
          disabled={submitted} placeholder="Type your detailed answer here... (be specific and use examples)"
          style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.7 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ color: '#475569', fontSize: 12 }}>{answer.split(/\s+/).filter(Boolean).length} words</span>
          {!submitted && (
            <button className="btn-primary" onClick={handleSubmit} disabled={answer.trim().length < 10} style={{ padding: '10px 22px' }}>
              Submit Answer
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <CheckCircle size={18} color="#10B981" />
              <span style={{ fontWeight: 700, color: '#F1F5F9', fontSize: 15 }}>AI Feedback</span>
              <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: color, fontFamily: 'Outfit, sans-serif' }}>
                {scores[scores.length - 1]}/{maxPerQ}
              </div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {mockFeedback[qIdx % mockFeedback.length]}
              </p>
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              {qIdx < questions.length - 1 ? <>Next Question <ArrowRight size={15} /></> : 'Complete Round →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Step 6: Final Result ─────────────────────────────────────────────────────

const FinalResult = ({ config, stageResults, onRestart }) => {
  const stages = ['resume', 'assessment', 'technical', 'managerial', 'hr'];
  const scores = {};
  stageResults.forEach(r => { scores[r.stage] = r.score || 0; });
  const avgScore = Math.round(stages.reduce((acc, s) => acc + (scores[s] || 0), 0) / stages.length);
  const isOffer = avgScore >= 65;

  const radarScores = {
    resume: scores.resume || 0,
    assessment: scores.assessment || 0,
    technical: scores.technical || 0,
    managerial: scores.managerial || 0,
    hr: scores.hr || 0,
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 660 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          style={{ width: 88, height: 88, borderRadius: '50%', background: isOffer ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#EF4444,#DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 0 50px ${isOffer ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` }}
        >
          {isOffer ? <Trophy size={42} color="white" /> : <AlertCircle size={42} color="white" />}
        </motion.div>
        <h1 style={{ fontSize: 34, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 10 }}>
          {isOffer ? <>Congratulations! <span style={{ color: '#10B981' }}>Offer Extended! 🎉</span></> : <>Better Luck Next Time <span style={{ color: '#EF4444' }}>Rejected ✗</span></>}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>
          {isOffer ? `You performed excellently in the ${config.role} interview at ${config.company}!` : `You narrowly missed the cutoff. Keep practicing and apply again!`}
        </p>
        <div style={{ display: 'inline-block', marginTop: 16, padding: '10px 28px', borderRadius: 100, background: isOffer ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${isOffer ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: isOffer ? '#10B981' : '#EF4444', fontFamily: 'Outfit, sans-serif' }}>{avgScore}</span>
          <span style={{ color: '#94A3B8', fontSize: 18 }}>/100</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card-static" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#F1F5F9' }}>Performance Radar</h3>
          <RadarChart scores={radarScores} />
        </div>
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Stage Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stages.map((s) => {
              const sc = scores[s] || 0;
              const color = sc >= 70 ? '#10B981' : sc >= 50 ? '#F59E0B' : '#EF4444';
              return (
                <div key={s}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#94A3B8', fontSize: 13, textTransform: 'capitalize' }}>{s === 'hr' ? 'HR' : s}</span>
                    <span style={{ color, fontWeight: 700, fontSize: 13 }}>{sc}/100</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${sc}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="#7C3AED" /> Improvement Tips
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['Practice STAR method for behavioral questions', 'Quantify your achievements with numbers', 'Research company culture before interviews', 'Prepare 3-4 strong examples from past projects', 'Practice coding problems daily on LeetCode', 'Work on explaining technical concepts clearly'].map((tip, i) => (
            <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Star size={12} color="#7C3AED" style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-primary" onClick={onRestart} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <RotateCcw size={16} /> Try Again
        </button>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <TrendingUp size={16} /> View Insights
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Resume Screening', icon: FileText },
  { label: 'Online Assessment', icon: Code },
  { label: 'Technical Round', icon: Brain },
  { label: 'Managerial Round', icon: Users },
  { label: 'HR Round', icon: MessageSquare },
  { label: 'Final Result', icon: Trophy },
];

const InterviewSimulation = () => {
  const [phase, setPhase] = useState('landing'); // landing | simulation
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState(null);
  const [stageResults, setStageResults] = useState([]);

  const handleStart = (cfg) => { setConfig(cfg); setPhase('simulation'); };

  const handleStageComplete = (result) => {
    setStageResults(old => [...old, result]);
    setCurrentStep(s => s + 1);
  };

  const handleRestart = () => { setPhase('landing'); setCurrentStep(0); setConfig(null); setStageResults([]); };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px' }}>
        <AnimatePresence mode="wait">
          {phase === 'landing' ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing onStart={handleStart} />
            </motion.div>
          ) : (
            <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, maxWidth: 900, margin: '0 auto' }}>
              {/* Stepper sidebar */}
              <div className="glass-card-static" style={{ padding: 24, alignSelf: 'start', position: 'sticky', top: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>SIMULATION</p>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>{config?.role}</p>
                  <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>{config?.company} • {config?.level}</p>
                </div>
                <StepIndicator steps={STEPS} current={currentStep} />
              </div>

              {/* Main content */}
              <div style={{ minWidth: 0 }}>
                <AnimatePresence mode="wait">
                  {currentStep === 0 && <ResumeScreening key="resume" config={config} onComplete={handleStageComplete} />}
                  {currentStep === 1 && <OnlineAssessment key="assessment" onComplete={handleStageComplete} />}
                  {currentStep === 2 && <TextRound key="technical" title="Technical Round" icon={Brain} color="#7C3AED" questions={TECH_QUESTIONS} onComplete={handleStageComplete} stageKey="technical" maxPerQ={20} />}
                  {currentStep === 3 && <TextRound key="managerial" title="Managerial Round" icon={Users} color="#F59E0B" questions={MANAGERIAL_QUESTIONS} onComplete={handleStageComplete} stageKey="managerial" maxPerQ={33} />}
                  {currentStep === 4 && <TextRound key="hr" title="HR Round" icon={MessageSquare} color="#EC4899" questions={HR_QUESTIONS} onComplete={handleStageComplete} stageKey="hr" maxPerQ={50} />}
                  {currentStep === 5 && <FinalResult key="result" config={config} stageResults={stageResults} onRestart={handleRestart} />}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewSimulation;
