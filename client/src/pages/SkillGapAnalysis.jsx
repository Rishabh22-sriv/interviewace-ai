import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, XCircle, ArrowRight, BookOpen, Award, Zap } from 'lucide-react';

const ROLE_SKILLS = {
  frontend: { required: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Git', 'REST APIs', 'Responsive Design'], goodToHave: ['Next.js', 'Redux', 'Testing (Jest)', 'Webpack/Vite', 'Figma', 'GraphQL'], certs: ['Meta Frontend Dev Certificate', 'Google UX Design', 'AWS Cloud Practitioner'], projects: ['Portfolio Website', 'E-Commerce App with React', 'Real-time Dashboard with Charts'] },
  backend: { required: ['Node.js/Python/Java', 'SQL/PostgreSQL', 'REST API Design', 'Authentication (JWT)', 'Git', 'MongoDB', 'Linux Basics'], goodToHave: ['Docker', 'Redis', 'Kafka/RabbitMQ', 'AWS/GCP', 'Microservices', 'gRPC'], certs: ['AWS Developer Associate', 'MongoDB Associate Dev', 'Node.js Certified Developer'], projects: ['RESTful Blog API', 'URL Shortener with Analytics', 'Microservices E-Commerce Backend'] },
  fullstack: { required: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB/SQL', 'Git', 'REST APIs', 'Authentication'], goodToHave: ['TypeScript', 'Docker', 'Redis', 'AWS', 'Next.js', 'Testing'], certs: ['Meta Full-Stack Developer', 'MERN Stack by Udemy', 'AWS Cloud Practitioner'], projects: ['Full-Stack E-Commerce', 'Real-Time Chat App', 'SaaS Dashboard with Auth'] },
  datascientist: { required: ['Python', 'Pandas/NumPy', 'Scikit-learn', 'SQL', 'Statistics', 'Data Visualization', 'Machine Learning'], goodToHave: ['TensorFlow/PyTorch', 'Spark', 'Tableau', 'Airflow', 'Cloud ML (AWS SageMaker)'], certs: ['Google Data Analytics Certificate', 'IBM Data Science Professional', 'Kaggle Competitions'], projects: ['Customer Churn Prediction', 'Sales Forecasting Dashboard', 'NLP Sentiment Analyzer'] },
  aiengineer: { required: ['Python', 'PyTorch/TensorFlow', 'Linear Algebra', 'Statistics', 'NLP Basics', 'ML Algorithms', 'Git'], goodToHave: ['LLM Fine-tuning', 'MLOps (MLflow)', 'Hugging Face', 'Docker', 'CUDA', 'LangChain'], certs: ['Deep Learning Specialization (Coursera)', 'Hugging Face NLP Course', 'MLOps Specialization'], projects: ['LLM-Powered Chatbot', 'Image Classification API', 'Recommendation Engine'] },
  cybersecurity: { required: ['Networking (TCP/IP)', 'Linux', 'Python Scripting', 'Web Security (OWASP)', 'Kali Linux', 'Nmap'], goodToHave: ['Metasploit', 'Burp Suite', 'Splunk', 'Cloud Security', 'Forensics'], certs: ['CompTIA Security+', 'CEH', 'OSCP'], projects: ['Vulnerability Scanner', 'Home Security Lab', 'SIEM Dashboard (ELK Stack)'] },
};

const ALL_SKILLS = [...new Set(Object.values(ROLE_SKILLS).flatMap(r => [...r.required, ...r.goodToHave]))].sort();

const ROADMAP_STEPS = {
  frontend: ['Week 1-2: Master HTML5 semantics and CSS Grid/Flexbox', 'Week 3-4: Deep dive into JavaScript ES6+', 'Month 2: React fundamentals + hooks + state management', 'Month 3: TypeScript + Next.js + testing', 'Month 4: Build portfolio projects + deploy'],
  backend: ['Week 1-2: Master SQL + PostgreSQL fundamentals', 'Week 3-4: Node.js/Express REST API design', 'Month 2: Authentication, MongoDB, Docker basics', 'Month 3: Redis, message queues, microservices', 'Month 4: AWS deployment + CI/CD'],
  fullstack: ['Week 1-2: HTML/CSS/JavaScript refresh', 'Week 3-4: React components and hooks', 'Month 2: Node.js backend + MongoDB', 'Month 3: Connect frontend and backend + auth', 'Month 4: Deploy full-stack apps'],
  datascientist: ['Week 1-2: Python + Pandas + NumPy mastery', 'Week 3-4: Statistics + probability foundations', 'Month 2: ML algorithms with Scikit-learn', 'Month 3: Deep learning + TensorFlow/PyTorch', 'Month 4: Kaggle competitions + portfolio'],
  aiengineer: ['Week 1-2: Advanced Python + linear algebra review', 'Week 3-4: PyTorch basics + neural networks', 'Month 2: NLP + Transformers + Hugging Face', 'Month 3: LLM fine-tuning + prompt engineering', 'Month 4: MLOps + model deployment'],
  cybersecurity: ['Week 1-2: Networking fundamentals + Linux', 'Week 3-4: Ethical hacking with Kali Linux', 'Month 2: Web security + OWASP Top 10', 'Month 3: Network security + CTF challenges', 'Month 4: Certifications (Security+, CEH)'],
};

const ROLE_LABELS = { frontend: 'Frontend Developer', backend: 'Backend Developer', fullstack: 'Full Stack Developer', datascientist: 'Data Scientist', aiengineer: 'AI Engineer', cybersecurity: 'Cyber Security Engineer' };

const SkillGapAnalysis = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = s => setMySkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const analyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const req = ROLE_SKILLS[role];
    const haveReq = req.required.filter(s => mySkills.some(ms => ms.toLowerCase().includes(s.toLowerCase().split('/')[0]) || s.toLowerCase().includes(ms.toLowerCase())));
    const missingReq = req.required.filter(s => !haveReq.includes(s));
    const haveGood = req.goodToHave.filter(s => mySkills.some(ms => s.toLowerCase().includes(ms.toLowerCase())));
    const missingGood = req.goodToHave.filter(s => !haveGood.includes(s));
    const match = Math.round(((haveReq.length / req.required.length) * 100));
    setResult({ haveReq, missingReq, haveGood, missingGood, match, role, req });
    setStep(3);
    setLoading(false);
  };

  const roleList = [
    { id: 'frontend', icon: '🌐', label: 'Frontend Developer', desc: 'React, UI/UX, TypeScript' },
    { id: 'backend', icon: '⚙️', label: 'Backend Developer', desc: 'Node.js, APIs, Databases' },
    { id: 'fullstack', icon: '🔄', label: 'Full Stack Developer', desc: 'MERN, Next.js, Cloud' },
    { id: 'datascientist', icon: '📊', label: 'Data Scientist', desc: 'Python, ML, Statistics' },
    { id: 'aiengineer', icon: '🤖', label: 'AI Engineer', desc: 'LLMs, PyTorch, MLOps' },
    { id: 'cybersecurity', icon: '🛡️', label: 'Cyber Security', desc: 'Pentesting, Networks, Certs' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
          <span className="gradient-text">Skill Gap Analysis</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: 13 }}>Find the gap between your skills and industry requirements</p>
      </motion.div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, maxWidth: 500 }}>
        {[['1', 'Select Role'], ['2', 'Your Skills'], ['3', 'Analysis']].map(([n, l], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#10B981' : step === i + 1 ? '#7C3AED' : 'rgba(99,102,241,0.1)', border: `2px solid ${step >= i + 1 ? (step > i + 1 ? '#10B981' : '#7C3AED') : 'rgba(99,102,241,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= i + 1 ? 'white' : '#475569', fontSize: 13, fontWeight: 700 }}>{step > i + 1 ? '✓' : n}</div>
              <span style={{ color: step === i + 1 ? '#F1F5F9' : '#475569', fontSize: 13, fontWeight: step === i + 1 ? 700 : 400 }}>{l}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#10B981' : 'rgba(99,102,241,0.1)', marginLeft: 8 }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Role */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
            {roleList.map((r, i) => (
              <motion.button key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}
                onClick={() => { setRole(r.id); setStep(2); }}
                style={{ padding: 22, borderRadius: 16, border: `1.5px solid ${role === r.id ? '#7C3AED' : 'rgba(99,102,241,0.12)'}`, background: 'rgba(13,22,39,0.8)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon}</div>
                <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: 'Outfit' }}>{r.label}</p>
                <p style={{ color: '#64748B', fontSize: 12 }}>{r.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 16, fontFamily: 'Outfit' }}>Select your current skills</h3>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '6px 12px', color: '#64748B', fontSize: 12, cursor: 'pointer' }}>← Back</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {ALL_SKILLS.map(s => (
                <button key={s} onClick={() => toggleSkill(s)} style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${mySkills.includes(s) ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: mySkills.includes(s) ? 'rgba(124,58,237,0.15)' : 'transparent', color: mySkills.includes(s) ? '#C4B5FD' : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={analyze} disabled={loading || mySkills.length === 0}
              className="btn-primary" style={{ padding: '13px 28px', fontSize: 14, fontWeight: 700, opacity: mySkills.length === 0 ? 0.5 : 1 }}>
              {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Zap size={16} /></motion.div> Analyzing...</> : <><Target size={15} /> Analyze My Skills</>}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Match score */}
          <div style={{ background: 'rgba(13,22,39,0.8)', border: `1px solid ${result.match >= 70 ? 'rgba(16,185,129,0.25)' : result.match >= 40 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 20, padding: 24, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: result.match >= 70 ? '#10B981' : result.match >= 40 ? '#F59E0B' : '#EF4444', fontFamily: 'Outfit', lineHeight: 1 }}>{result.match}%</div>
              <div style={{ color: '#64748B', fontSize: 12 }}>Skill Match</div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: 'Outfit' }}>{ROLE_LABELS[result.role]} Match Analysis</p>
              <p style={{ color: '#64748B', fontSize: 13, marginBottom: 10 }}>You have {result.haveReq.length}/{result.req.required.length} required skills. Missing {result.missingReq.length} critical skills.</p>
              <div style={{ height: 8, background: 'rgba(99,102,241,0.1)', borderRadius: 100 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${result.match}%` }} transition={{ duration: 1 }}
                  style={{ height: '100%', background: result.match >= 70 ? 'linear-gradient(90deg,#10B981,#059669)' : result.match >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' : 'linear-gradient(90deg,#EF4444,#DC2626)', borderRadius: 100 }} />
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '8px 14px', color: '#64748B', fontSize: 12, cursor: 'pointer' }}>Try Another Role</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Skills you have */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 20 }}>
              <p style={{ color: '#10B981', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>✅ Skills You Have ({result.haveReq.length})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.haveReq.map(s => <span key={s} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7', fontSize: 12, fontWeight: 600 }}>✓ {s}</span>)}
              </div>
            </div>
            {/* Missing critical */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 20 }}>
              <p style={{ color: '#EF4444', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>❌ Missing Critical Skills ({result.missingReq.length})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.missingReq.map(s => <span key={s} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: 12, fontWeight: 600 }}>✗ {s}</span>)}
              </div>
            </div>
          </div>

          {/* Roadmap + Projects + Certs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
              <p style={{ color: '#A78BFA', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🗺️ Learning Roadmap</p>
              {(ROADMAP_STEPS[result.role] || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: '#A78BFA', fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
              <p style={{ color: '#67E8F9', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>💡 Suggested Projects</p>
              {result.req.projects.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <ArrowRight size={12} style={{ color: '#06B6D4', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
              <p style={{ color: '#FCD34D', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🏆 Get Certified</p>
              {result.req.certs.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Award size={12} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default SkillGapAnalysis;
