import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  Zap, Brain, Mic, BarChart3, Shield, Star, ChevronDown, Play,
  Check, ArrowRight, Users, Award, TrendingUp, MessageSquare,
  FileText, Target, Sparkles, Globe, Cpu, Clock, ChevronRight,
  Bot, Rocket, Timer, Quote, X, Plus, Minus
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* AURORA BACKGROUND                                                    */
/* ------------------------------------------------------------------ */
const AuroraBackground = () => (
  <div className="aurora-bg">
    <div className="aurora-blob aurora-blob-1" />
    <div className="aurora-blob aurora-blob-2" />
    <div className="aurora-blob aurora-blob-3" />
  </div>
);

/* ------------------------------------------------------------------ */
/* ANIMATED COUNTER HOOK                                                */
/* ------------------------------------------------------------------ */
const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration, start]);

  return { count, startCounting: () => setStarted(true) };
};

/* ------------------------------------------------------------------ */
/* TYPEWRITER HOOK                                                      */
/* ------------------------------------------------------------------ */
const useTypewriter = (words, speed = 80, deleteSpeed = 50, pause = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1));
        if (text === word) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(word.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
        }
      }
    }, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return text;
};

/* ------------------------------------------------------------------ */
/* HERO SECTION                                                         */
/* ------------------------------------------------------------------ */
const roles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Full Stack Dev', 'ML Engineer', 'System Designer'];

const HeroSection = () => {
  const typedText = useTypewriter(roles);

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: 110, paddingBottom: 80, overflow: 'hidden' }}>
      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="grid-cols-1 lg:grid-cols-2">

          {/* Left Content */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="section-tag" style={{ marginBottom: 28 }}>
                <Sparkles size={11} /> Powered by Google Gemini AI
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
              Get hired as a<br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span className="gradient-text-aurora">{typedText}</span>
                <span style={{ borderRight: '3px solid #7C3AED', marginLeft: 2, animation: 'typing-cursor 0.8s ease-in-out infinite' }}>&nbsp;</span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.75, marginBottom: 44, maxWidth: 500 }}>
              InterviewAce AI runs realistic mock interviews, scores your resume with ATS precision, and delivers instant feedback — so you walk into every interview with absolute confidence.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
              <Link to="/signup" className="btn-primary" style={{ fontSize: 16, padding: '15px 32px' }}>
                Start Free Today <ArrowRight size={17} />
              </Link>
              <button className="btn-secondary" style={{ fontSize: 16, padding: '15px 28px' }}
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play size={16} /> See It Live
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: Users, value: '50K+', label: 'Students' },
                { icon: Award, value: '94%', label: 'Placement Rate' },
                { icon: Star, value: '4.9★', label: 'Avg Rating' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <p style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 17, margin: 0, fontFamily: 'Outfit' }}>{value}</p>
                    <p style={{ color: '#475569', fontSize: 11, margin: 0, letterSpacing: '0.5px' }}>{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — AI Card Visual */}
          <motion.div initial={{ opacity: 0, scale: 0.85, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, type: 'spring', damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

            {/* Floating Cards */}
            {[
              { top: '-5%', left: '-8%', icon: Brain, text: 'AI Evaluation', sub: 'Real-time scoring', delay: 0.9, color: '#7C3AED' },
              { top: '55%', right: '-8%', icon: Mic, text: 'Voice Analysis', sub: 'Speech recognition', delay: 1.1, color: '#06B6D4' },
              { bottom: '-2%', left: '8%', icon: BarChart3, text: 'Performance AI', sub: 'Detailed analytics', delay: 1.3, color: '#10B981' },
            ].map(({ icon: Icon, text, sub, delay, color, ...pos }) => (
              <motion.div key={text}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: 'spring', damping: 15 }}
                className="float-element"
                style={{ position: 'absolute', ...pos, background: 'rgba(13,22,39,0.92)', backdropFilter: 'blur(20px)', border: `1px solid ${color}30`, borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}20`, zIndex: 5 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p style={{ color: '#F1F5F9', fontSize: 13, fontWeight: 700, margin: 0 }}>{text}</p>
                  <p style={{ color: '#64748B', fontSize: 11, margin: 0 }}>{sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Central Orb */}
            <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #7C3AED 0%, #6366F1 45%, #06B6D4 100%)', animation: 'orb-float 6s ease-in-out infinite', boxShadow: '0 0 120px rgba(124,58,237,0.6), 0 0 240px rgba(99,102,241,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.28), transparent 70%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={72} color="rgba(255,255,255,0.92)" />
              </div>
              <motion.div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1.5px dashed rgba(99,102,241,0.35)' }} animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
              <motion.div style={{ position: 'absolute', inset: -38, borderRadius: '50%', border: '1px dashed rgba(6,182,212,0.2)' }} animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', color: '#334155', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}>
          <p style={{ fontSize: 11, letterSpacing: '1px', color: '#334155' }}>SCROLL</p>
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* LIVE STATS                                                           */
/* ------------------------------------------------------------------ */
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const interviews = useCounter(2000000, 2500);
  const users = useCounter(50000, 2000);
  const placement = useCounter(94, 1500);
  const rating = useCounter(49, 1800);

  useEffect(() => {
    if (isInView) {
      interviews.startCounting();
      users.startCounting();
      placement.startCounting();
      rating.startCounting();
    }
  }, [isInView]);

  const stats = [
    { value: `${(interviews.count / 1000000).toFixed(1)}M+`, label: 'Interviews Completed', icon: MessageSquare, color: '#7C3AED' },
    { value: `${(users.count / 1000).toFixed(0)}K+`, label: 'Active Students', icon: Users, color: '#06B6D4' },
    { value: `${placement.count}%`, label: 'Placement Success', icon: Award, color: '#10B981' },
    { value: `${(rating.count / 10).toFixed(1)}★`, label: 'Average Rating', icon: Star, color: '#F59E0B' },
  ];

  return (
    <section id="stats" ref={ref} style={{ padding: '80px 0', borderTop: '1px solid rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.08)', position: 'relative' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center', padding: '40px 20px', borderRight: i < stats.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}14`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon size={24} style={{ color }} />
              </div>
              <p style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, fontFamily: 'Outfit', margin: '0 0 6px', color: '#F1F5F9' }}>{value}</p>
              <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* MARQUEE (TRUSTED BY)                                                 */
/* ------------------------------------------------------------------ */
const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Vercel', 'Airbnb', 'Uber', 'Spotify', 'Adobe'];

const MarqueeSection = () => {
  const doubled = [...companies, ...companies];
  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container-custom" style={{ marginBottom: 24 }}>
        <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Trusted by students interviewing at
        </p>
      </div>
      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((c, i) => (
            <span key={i} className="marquee-item">
              {c}
              {i < doubled.length - 1 && <span className="marquee-separator">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* BENTO FEATURES GRID                                                  */
/* ------------------------------------------------------------------ */
const features = [
  { icon: Brain, title: 'AI Mock Interviews', description: 'Practice with 5 types: HR, Technical, Aptitude, System Design, and Behavioral. Powered by Google Gemini with context-aware questions at 3 difficulty levels.', color: '#7C3AED', size: 'large', tag: 'Core Feature' },
  { icon: Mic, title: 'Voice Interviews', description: 'Answer naturally using your voice. Speech-to-text captures every word, and AI evaluates your confidence, clarity, and fluency.', color: '#06B6D4', size: 'small', tag: 'Voice AI' },
  { icon: FileText, title: 'Resume ATS Analyzer', description: 'Upload your PDF resume and get an ATS score, missing skill detection, grammar corrections, and role-specific improvement recommendations.', color: '#10B981', size: 'small', tag: 'Resume AI' },
  { icon: BarChart3, title: 'Performance Analytics', description: 'Track your growth over time with Radar, Area, and Line charts. See your Communication, Technical, Confidence, and Grammar trends.', color: '#F59E0B', size: 'large', tag: 'Analytics' },
  { icon: Cpu, title: 'Instant AI Feedback', description: 'Get detailed per-question feedback: strengths, weaknesses, improvements, and a model sample answer — delivered in seconds.', color: '#6366F1', size: 'small', tag: 'AI Feedback' },
  { icon: Shield, title: 'Full Interview History', description: 'Every session saved. Filter, compare, and revisit reports anytime to track your improvement journey over weeks and months.', color: '#EC4899', size: 'small', tag: 'History' },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding">
    <div className="container-custom">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 72 }}>
        <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
          <Zap size={11} /> Everything You Need to Win
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 18 }}>
          AI Tools Built for <span className="gradient-text">Interview Success</span>
        </h2>
        <p style={{ color: '#64748B', maxWidth: 580, margin: '0 auto', fontSize: 17, lineHeight: 1.7 }}>
          One platform with every tool you need to prepare smarter, practice deeper, and land your dream role faster.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
        {features.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bento-card"
            style={{
              gridColumn: f.size === 'large' ? 'span 7' : 'span 5',
              ...(i % 2 === 0 && f.size === 'small' ? { gridColumn: 'span 5' } : {}),
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${f.color}12`, border: `1px solid ${f.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={26} style={{ color: f.color }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: f.color, background: `${f.color}14`, border: `1px solid ${f.color}28`, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.5px' }}>{f.tag}</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>{f.title}</h3>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.75 }}>{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* INTERACTIVE DEMO                                                     */
/* ------------------------------------------------------------------ */
const demoQuestions = {
  hr: 'Tell me about yourself and why you are interested in this role.',
  technical: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
  behavioral: 'Describe a time when you had to work with a difficult team member. How did you handle it?',
  aptitude: 'If a train travels 60 miles/hour, how long will it take to cover 150 miles?',
  'system-design': 'Design a URL shortening service like bit.ly. Consider scalability and high availability.',
};

const demoScores = {
  hr: { communication: 91, technicalAccuracy: 72, confidence: 88, grammar: 94, overall: 86 },
  technical: { communication: 84, technicalAccuracy: 89, confidence: 79, grammar: 92, overall: 86 },
  behavioral: { communication: 95, technicalAccuracy: 70, confidence: 91, grammar: 93, overall: 87 },
  aptitude: { communication: 82, technicalAccuracy: 96, confidence: 85, grammar: 90, overall: 88 },
  'system-design': { communication: 88, technicalAccuracy: 92, confidence: 83, grammar: 91, overall: 89 },
};

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [typing, setTyping] = useState('');
  const [showScores, setShowScores] = useState(false);
  const tabs = ['hr', 'technical', 'behavioral', 'aptitude', 'system-design'];

  useEffect(() => {
    setTyping('');
    setShowScores(false);
    const q = demoQuestions[activeTab];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyping(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(interval);
        setTimeout(() => setShowScores(true), 800);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [activeTab]);

  const scores = demoScores[activeTab];

  return (
    <section id="demo" style={{ padding: '112px 0' }}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
            <Play size={11} /> Live Demo
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 16 }}>
            Watch <span className="gradient-text">InterviewAce AI</span> in Action
          </h2>
          <p style={{ color: '#64748B', fontSize: 16 }}>Select an interview type and see the AI generate questions and evaluate answers instantly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-static" style={{ overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 2, padding: '20px 20px 0', borderBottom: '1px solid rgba(99,102,241,0.1)', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '10px 18px', borderRadius: '10px 10px 0 0', background: activeTab === tab ? 'rgba(99,102,241,0.12)' : 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent', color: activeTab === tab ? '#A78BFA' : '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap', transition: 'all 0.2s', fontFamily: 'Inter' }}>
                {tab.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          <div style={{ padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Question */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <p style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, margin: 0 }}>AI Interviewer</p>
                  <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>InterviewAce Gemini</p>
                </div>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 14, padding: '18px 22px', minHeight: 100 }}>
                <p style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                  {typing}
                  <span style={{ borderRight: '2px solid #7C3AED', marginLeft: 1, animation: 'typing-cursor 0.8s ease-in-out infinite' }}>&nbsp;</span>
                </p>
              </div>
            </div>

            {/* AI Score */}
            <AnimatePresence mode="wait">
              {showScores && (
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart3 size={18} color="white" />
                    </div>
                    <div>
                      <p style={{ color: '#6EE7B7', fontSize: 12, fontWeight: 700, margin: 0 }}>AI Evaluation</p>
                      <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>Instant analysis</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {scores.overall}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(scores).filter(([k]) => k !== 'overall').map(([label, score]) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: '#64748B', fontSize: 12, textTransform: 'capitalize' }}>{label.replace(/([A-Z])/g, ' $1')}</span>
                          <span style={{ color: '#F1F5F9', fontSize: 12, fontWeight: 700 }}>{score}%</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* HOW IT WORKS — VERTICAL TIMELINE                                     */
/* ------------------------------------------------------------------ */
const steps = [
  { number: '01', title: 'Create Your Free Account', description: 'Sign up in under 60 seconds. No credit card required. Access all core features immediately.', icon: Users, color: '#7C3AED' },
  { number: '02', title: 'Choose Interview Type & Level', description: 'Select from HR, Technical, Aptitude, System Design, or Behavioral interviews at Easy, Medium, or Hard difficulty.', icon: Target, color: '#6366F1' },
  { number: '03', title: 'Practice with AI Interviewer', description: 'Answer questions via typing or voice. Gemini AI generates context-aware questions tailored to your role and difficulty.', icon: Brain, color: '#06B6D4' },
  { number: '04', title: 'Get Instant AI Feedback', description: 'Receive detailed scores for Communication, Technical Accuracy, Confidence, and Grammar. Review strengths, weaknesses, and model answers.', icon: TrendingUp, color: '#10B981' },
];

const HowItWorks = () => (
  <section id="how-it-works" style={{ padding: '112px 0', background: 'rgba(5,11,24,0.5)' }}>
    <div className="container-custom">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 80 }}>
        <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
          <Clock size={11} /> Simple Process
        </div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 16 }}>
          From Zero to <span className="gradient-text">Interview Ready</span>
        </h2>
        <p style={{ color: '#64748B', fontSize: 16 }}>Four simple steps to accelerate your preparation.</p>
      </motion.div>

      <div style={{ maxWidth: 800, margin: '0 auto' }} className="timeline-container">
        <div className="timeline-line" />
        {steps.map((step, i) => (
          <motion.div key={step.number} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="timeline-item">
            <div className="timeline-dot" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`, boxShadow: `0 0 30px ${step.color}60` }}>
              <step.icon size={26} color="white" />
            </div>
            <div className="glass-card" style={{ flex: 1, padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: '1.5px' }}>STEP {step.number}</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* TESTIMONIALS CAROUSEL                                                */
/* ------------------------------------------------------------------ */
const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Google', avatar: 'PS', rating: 5, company: 'google', text: 'InterviewAce AI completely transformed my interview preparation. The AI feedback was incredibly detailed and actionable. I got placed at Google within 3 months of using it!' },
  { name: 'Rahul Gupta', role: 'Backend Engineer at Amazon', avatar: 'RG', rating: 5, company: 'amazon', text: 'The technical interview module is phenomenal. It asked me exactly the right difficulty level of questions and the feedback helped me identify my weak spots instantly.' },
  { name: 'Anjali Patel', role: 'Data Scientist at Microsoft', avatar: 'AP', rating: 5, company: 'microsoft', text: 'The resume analyzer gave me a 92/100 ATS score after implementing its suggestions. My profile started getting way more recruiter responses!' },
  { name: 'Kunal Mehta', role: 'Frontend Dev at Stripe', avatar: 'KM', rating: 5, company: 'stripe', text: 'Voice interview feature is a game changer. Practicing speaking my answers and getting confidence scores helped me immensely during actual interviews.' },
  { name: 'Sneha Reddy', role: 'ML Engineer at Meta', avatar: 'SR', rating: 5, company: 'meta', text: 'As someone with interview anxiety, having a judgment-free AI practice partner was exactly what I needed. My confidence grew 10x over just 2 months.' },
  { name: 'Arjun Singh', role: 'Full Stack at Netflix', avatar: 'AS', rating: 5, company: 'netflix', text: 'The behavioral interview prep is excellent. STAR method feedback helped me structure answers perfectly. I landed my dream job on the first attempt!' },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: '112px 0' }}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
            <Star size={11} /> Success Stories
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 16 }}>
            Students Who <span className="gradient-text">Got the Job</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: 16 }}>Real people. Real results. Real dream jobs.</p>
        </motion.div>

        {/* Featured Testimonial */}
        <div style={{ maxWidth: 760, margin: '0 auto 48px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="glass-card" style={{ padding: '48px 56px', textAlign: 'center', position: 'relative' }}>
              <Quote size={48} style={{ color: 'rgba(124,58,237,0.2)', margin: '0 auto 24px' }} />
              <p style={{ fontSize: 18, color: '#CBD5E1', lineHeight: 1.8, marginBottom: 36, fontStyle: 'italic' }}>
                "{testimonials[current].text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>{testimonials[current].avatar}</span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>{testimonials[current].name}</p>
                  <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>{testimonials[current].role}</p>
                </div>
                <div style={{ marginLeft: 16, display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 100, background: i === current ? '#7C3AED' : 'rgba(99,102,241,0.25)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
        </div>

        {/* Grid of testimonials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="glass-card" style={{ padding: 28, cursor: 'pointer' }} onClick={() => setCurrent(i)}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                ))}
              </div>
              <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.text.substring(0, 100)}..."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>{t.avatar}</span>
                </div>
                <div>
                  <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 13, margin: 0 }}>{t.name}</p>
                  <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* PRICING                                                              */
/* ------------------------------------------------------------------ */
const plans = [
  {
    name: 'Free', price: { monthly: '$0', annual: '$0' }, period: 'forever',
    description: 'Get started with AI interview practice',
    features: ['5 AI Interviews/month', 'Basic feedback', 'Text-based answers', '1 Resume analysis/month', '7-day interview history'],
    cta: 'Get Started Free', featured: false, color: '#475569',
  },
  {
    name: 'Pro', price: { monthly: '$19', annual: '$15' }, period: 'month',
    description: 'Everything you need to ace interviews',
    features: ['Unlimited AI Interviews', 'Advanced AI feedback', 'Voice interviews', 'Unlimited resume analysis', 'Full analytics dashboard', 'Unlimited history', 'Priority AI responses', 'All 5 interview types'],
    cta: 'Start Pro Trial', featured: true, color: '#7C3AED',
  },
  {
    name: 'Team', price: { monthly: '$49', annual: '$39' }, period: 'month',
    description: 'For study groups and bootcamps',
    features: ['Everything in Pro', 'Up to 5 members', 'Team analytics', 'Shared question bank', 'Admin dashboard', 'Custom topics', 'Priority support', 'PDF report export'],
    cta: 'Start Team Trial', featured: false, color: '#06B6D4',
  },
];

const PricingSection = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
            <Zap size={11} /> Simple Pricing
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 16 }}>
            Invest in Your <span className="gradient-text">Career Success</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: 16, marginBottom: 32 }}>Start free. Upgrade when you're ready. Cancel anytime.</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 100, padding: '6px 8px' }}>
            <button onClick={() => setAnnual(false)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: !annual ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'transparent', color: !annual ? 'white' : '#64748B' }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: annual ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'transparent', color: annual ? 'white' : '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual
              <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.2)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '1px 7px', borderRadius: 100 }}>Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ position: 'relative' }}>
              {plan.featured && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7C3AED, #6366F1)', color: 'white', fontSize: 12, fontWeight: 700, padding: '5px 18px', borderRadius: 100, whiteSpace: 'nowrap', zIndex: 1, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                  ✨ Most Popular
                </div>
              )}
              <div className={plan.featured ? 'glow-card' : 'glass-card'} style={{ padding: '36px 32px', height: '100%', border: plan.featured ? 'none' : undefined }}>
                {plan.featured && <div style={{ position: 'absolute', inset: 1, background: 'rgba(13,22,39,0.9)', borderRadius: 19, backdropFilter: 'blur(20px)' }} />}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Outfit', color: '#F1F5F9', lineHeight: 1 }}>
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.period !== 'forever' && <span style={{ color: '#475569', fontSize: 14 }}>/{plan.period}</span>}
                  </div>
                  <p style={{ color: '#475569', fontSize: 13, marginBottom: 28 }}>{plan.description}</p>
                  <Link to="/signup" className={plan.featured ? 'btn-primary' : 'btn-secondary'}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}>
                    {plan.cta} <ArrowRight size={16} />
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${plan.featured ? '#7C3AED' : plan.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={11} style={{ color: plan.featured ? '#A78BFA' : plan.color }} />
                        </div>
                        <span style={{ color: '#94A3B8', fontSize: 13 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* FAQ ACCORDION                                                        */
/* ------------------------------------------------------------------ */
const faqs = [
  { q: 'Is InterviewAce AI completely free to use?', a: 'Yes! The Free plan gives you 5 AI mock interviews and 1 resume analysis per month with no credit card required. You can upgrade to Pro or Team for unlimited access.' },
  { q: 'What types of interviews does it support?', a: 'We support 5 interview types: HR/Soft Skills, Technical/Coding, Aptitude/Logical Reasoning, System Design, and Behavioral (STAR method). Each at Easy, Medium, or Hard difficulty.' },
  { q: 'How accurate is the AI feedback compared to real interviewers?', a: 'Our AI is powered by Google Gemini, one of the most advanced language models available. The feedback covers Communication, Technical Accuracy, Confidence, and Grammar — all areas real interviewers assess.' },
  { q: 'Can I practice voice interviews?', a: 'Absolutely! The Voice Interview mode uses your microphone and speech-to-text technology to capture your spoken answers, which are then evaluated by the AI exactly like typed answers.' },
  { q: 'How does the Resume ATS Analyzer work?', a: 'Upload your PDF resume and our AI scans it for ATS compatibility, missing keywords, grammar issues, skill gaps, and role-specific improvements — giving you an ATS score out of 100.' },
  { q: 'Can I access my past interviews and reports?', a: 'Yes! All your interviews and reports are saved indefinitely (Free plan: 7 days, Pro/Team: unlimited). You can filter by type, difficulty, and date.' },
  { q: 'Is my data private and secure?', a: 'All data is encrypted in transit and at rest. We use JWT authentication and never share your personal information or interview data with third parties.' },
  { q: 'How do I become an admin or create a team?', a: 'Sign up normally, then upgrade to the Team plan to access the admin dashboard. You can invite up to 5 members and view team-wide analytics.' },
];

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: '112px 0', background: 'rgba(5,11,24,0.5)' }}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>
            <MessageSquare size={11} /> FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 16 }}>
            Questions? <span className="gradient-text">We've Got Answers</span>
          </h2>
        </motion.div>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass-card" style={{ padding: '20px 28px', cursor: 'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: open === i ? '#A78BFA' : '#F1F5F9', transition: 'color 0.2s', margin: 0 }}>{faq.q}</h3>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: open === i ? 'rgba(124,58,237,0.2)' : 'rgba(99,102,241,0.08)', border: `1px solid ${open === i ? 'rgba(124,58,237,0.4)' : 'rgba(99,102,241,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  {open === i ? <Minus size={14} style={{ color: '#A78BFA' }} /> : <Plus size={14} style={{ color: '#64748B' }} />}
                </div>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                    style={{ color: '#64748B', fontSize: 14, lineHeight: 1.75, marginTop: 14, marginBottom: 0, overflow: 'hidden' }}>
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* CTA BANNER                                                           */
/* ------------------------------------------------------------------ */
const CTASection = () => (
  <section style={{ padding: '100px 0' }}>
    <div className="container-custom">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(99,102,241,0.12) 50%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 24 }}>
            <Rocket size={11} /> Start Your Journey Today
          </div>
          <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', marginBottom: 20, maxWidth: 700, margin: '0 auto 20px' }}>
            Your Dream Job Is One <span className="gradient-text">Interview Away</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 17, marginBottom: 44, maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Join 50,000+ students who used InterviewAce AI to prepare smarter, build confidence, and land top-tier roles.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
              Get Started Free — No Card Needed <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-neon" style={{ fontSize: 16, padding: '16px 32px' }}>
              Sign In
            </Link>
          </div>
          <p style={{ color: '#334155', fontSize: 13, marginTop: 24 }}>✓ Free forever plan &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Cancel anytime</p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* FOOTER                                                               */
/* ------------------------------------------------------------------ */
const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ borderTop: '1px solid rgba(99,102,241,0.1)', padding: '72px 0 40px' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 56, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}>
                <Zap size={20} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterviewAce AI</span>
            </Link>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.75, marginBottom: 24, maxWidth: 320 }}>
              AI-powered interview preparation platform helping students land their dream jobs at top tech companies worldwide.
            </p>
            {/* Newsletter */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', background: 'rgba(5,11,24,0.7)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, color: '#F1F5F9', fontSize: 13, outline: 'none', fontFamily: 'Inter' }} />
              <button className="btn-primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 10 }}>Subscribe</button>
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Demo', 'Changelog'] },
            { title: 'Resources', links: ['Documentation', 'Blog', 'Interview Tips', 'ATS Guide'] },
            { title: 'Company', links: ['About', 'Careers', 'Privacy Policy', 'Terms of Service'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {col.links.map((link) => (
                  <a key={link} href="#" style={{ color: '#475569', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.target.style.color = '#A78BFA')}
                    onMouseLeave={(e) => (e.target.style.color = '#475569')}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(99,102,241,0.08)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: '#334155', fontSize: 13 }}>© {new Date().getFullYear()} InterviewAce AI. All rights reserved.</p>
          <p style={{ color: '#334155', fontSize: 13 }}>Built with ❤️ using React + Google Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
const LandingPage = () => (
  <div style={{ position: 'relative', minHeight: '100vh' }}>
    <AuroraBackground />
    <Navbar />
    <main style={{ position: 'relative', zIndex: 1 }}>
      <HeroSection />
      <StatsSection />
      <MarqueeSection />
      <FeaturesSection />
      <DemoSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
