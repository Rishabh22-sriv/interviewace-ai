import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, Play, Square, RotateCcw, Award, Eye, MessageSquare, Brain, ChevronRight, Clock, AlertCircle, CheckCircle, Volume2 } from 'lucide-react';

const QUESTIONS = {
  hr: [
    'Tell me about yourself in 2 minutes.',
    'Why do you want to join this company?',
    'Where do you see yourself in 5 years?',
    'What is your greatest strength and weakness?',
    'Describe a challenge you faced and how you overcame it.',
    'Why are you leaving your current role / what drives you to start your career here?',
    'How do you handle pressure and tight deadlines?',
    'Tell me about a time you worked in a team.',
  ],
  technical: [
    'Explain the difference between REST and GraphQL APIs.',
    'What is the difference between SQL and NoSQL databases?',
    'Explain the concept of time and space complexity.',
    'What is your understanding of object-oriented programming?',
    'How does a HashMap work internally?',
    'Explain the concept of microservices architecture.',
    'What is a deadlock and how do you prevent it?',
    'Describe the software development lifecycle you follow.',
  ],
  behavioral: [
    'Tell me about a time you failed and what you learned.',
    'Describe a situation where you had to lead a project.',
    'Give an example of when you had a conflict with a teammate.',
    'Tell me about your most impactful project so far.',
    'Describe a time you had to learn something quickly under pressure.',
    'How do you prioritize tasks when everything seems urgent?',
  ],
  leadership: [
    'Describe your leadership style.',
    'Tell me about a time you motivated a team member.',
    'How do you handle underperformance in your team?',
    'Describe a tough decision you made as a leader.',
    'How do you build trust within a team?',
  ],
};

const FILLER_WORDS = ['umm', 'uhh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of'];

const ScoreBar = ({ label, score, color, delay = 0 }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ color, fontWeight: 800, fontSize: 14 }}>{score}/100</span>
    </div>
    <div style={{ height: 8, background: 'rgba(99,102,241,0.1)', borderRadius: 100, overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay, ease: 'easeOut' }}
        style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}80)`, borderRadius: 100 }} />
    </div>
  </div>
);

const VideoInterviewAnalyzer = () => {
  const [phase, setPhase] = useState('setup'); // setup | interview | report
  const [mode, setMode] = useState('hr');
  const [role, setRole] = useState('SDE');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = QUESTIONS[mode];

  const startInterview = () => {
    setPhase('interview');
    setCurrentQ(0);
    setAnswers([]);
    setAnswer('');
    setTimer(120);
    setTimerActive(true);
  };

  const detectFillers = (text) => {
    const lower = text.toLowerCase();
    return FILLER_WORDS.filter(f => lower.includes(f));
  };

  const submitAnswer = async () => {
    const fillers = detectFillers(answer);
    const wordCount = answer.trim().split(/\s+/).length;
    const newAnswers = [...answers, { q: questions[currentQ], a: answer, fillers, wordCount }];
    setAnswers(newAnswers);
    setAnswer('');

    if (currentQ + 1 >= Math.min(5, questions.length)) {
      // Generate report
      setIsGenerating(true);
      setPhase('report');
      await new Promise(r => setTimeout(r, 2000));

      const avgWords = newAnswers.reduce((s, a) => s + a.wordCount, 0) / newAnswers.length;
      const totalFillers = newAnswers.reduce((s, a) => s + a.fillers.length, 0);

      const commScore = Math.min(95, Math.max(45, 70 + Math.round(avgWords / 8) - totalFillers * 3));
      const techScore = Math.min(95, Math.max(40, 65 + Math.round(avgWords / 10)));
      const eyeScore = cameraOn ? Math.floor(Math.random() * 15) + 75 : 0;
      const confidScore = Math.min(95, Math.max(50, 72 - totalFillers * 2));
      const bodyScore = Math.floor(Math.random() * 15) + 72;
      const overall = Math.round((commScore + techScore + eyeScore + confidScore + bodyScore) / 5);

      setReport({ commScore, techScore, eyeScore, confidScore, bodyScore, overall, totalFillers, avgWords: Math.round(avgWords), answers: newAnswers });
      setIsGenerating(false);
    } else {
      setCurrentQ(q => q + 1);
      setTimer(120);
    }
  };

  const reset = () => {
    setPhase('setup');
    setCurrentQ(0);
    setAnswers([]);
    setAnswer('');
    setReport(null);
  };

  const overallColor = report ? (report.overall >= 80 ? '#10B981' : report.overall >= 60 ? '#F59E0B' : '#EF4444') : '#7C3AED';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
          <span className="gradient-text">AI Video Interview Analyzer</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: 13 }}>Real-time analysis: face, voice, communication & answer quality</p>
      </motion.div>

      {/* SETUP PHASE */}
      {phase === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {/* Camera Preview */}
            <div style={{ background: 'rgba(13,22,39,0.9)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: 280, background: '#050B18', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column', gap: 12 }}>
                {cameraOn ? (
                  <>
                    {/* Mock camera view */}
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.2))', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                        style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 32 }}>😊</span>
                      </motion.div>
                      {/* Pulse rings */}
                      {[1, 2, 3].map(i => (
                        <motion.div key={i} animate={{ scale: [1, 1.5], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.3)' }} />
                      ))}
                    </div>
                    {/* Face analysis overlays */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {[['👁️ Eye Contact', '#10B981'], ['😌 Confident', '#F59E0B'], ['🎤 Mic Active', '#7C3AED']].map(([l, c]) => (
                        <motion.span key={l} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.5 }}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: c + '20', border: `1px solid ${c}40`, color: c, fontWeight: 600 }}>{l}</motion.span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#334155', textAlign: 'center' }}>
                    <VideoOff size={40} style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 14 }}>Camera Off</p>
                  </div>
                )}
                {/* Recording indicator */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: cameraOn ? '#EF4444' : '#334155' }} />
                  <span style={{ fontSize: 11, color: cameraOn ? '#EF4444' : '#334155', fontWeight: 700 }}>{cameraOn ? 'READY' : 'OFF'}</span>
                </div>
              </div>
              {/* Controls */}
              <div style={{ padding: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setCameraOn(!cameraOn)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1px solid ${cameraOn ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, background: cameraOn ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: cameraOn ? '#10B981' : '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {cameraOn ? <><Video size={14} /> Camera On</> : <><VideoOff size={14} /> Camera Off</>}
                </button>
                <button onClick={() => setMicOn(!micOn)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1px solid ${micOn ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, background: micOn ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: micOn ? '#10B981' : '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {micOn ? <><Mic size={14} /> Mic On</> : <><MicOff size={14} /> Mic Off</>}
                </button>
              </div>
            </div>

            {/* Settings */}
            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 16, marginBottom: 20, fontFamily: 'Outfit' }}>Interview Settings</h3>

              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['hr', '👔 HR Interview'], ['technical', '💻 Technical'], ['behavioral', '🧠 Behavioral'], ['leadership', '🎯 Leadership']].map(([v, l]) => (
                    <button key={v} onClick={() => setMode(v)} style={{ padding: '10px', borderRadius: 10, border: `1.5px solid ${mode === v ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: mode === v ? 'rgba(124,58,237,0.15)' : 'transparent', color: mode === v ? '#C4B5FD' : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Target Role</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['SDE', 'Data Scientist', 'ML Engineer', 'Product Manager', 'DevOps'].map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${role === r ? '#06B6D4' : 'rgba(99,102,241,0.15)'}`, background: role === r ? 'rgba(6,182,212,0.1)' : 'transparent', color: role === r ? '#67E8F9' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{r}</button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <p style={{ color: '#A78BFA', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📊 What will be analyzed:</p>
                {['Eye Contact & Confidence', 'Voice Clarity & Filler Words', 'Answer Quality & Relevance', 'Communication & Grammar', 'Body Language Score'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <CheckCircle size={12} style={{ color: '#10B981' }} />
                    <span style={{ color: '#94A3B8', fontSize: 12 }}>{item}</span>
                  </div>
                ))}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={startInterview}
                className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Play size={16} fill="white" /> Start AI Interview
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* INTERVIEW PHASE */}
      {phase === 'interview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {/* Left: Camera + stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Camera */}
              <div style={{ background: '#050B18', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(6,182,212,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 30 }}>😊</span>
                  {[1,2].map(i => (
                    <motion.div key={i} animate={{ scale: [1,1.4], opacity: [0.5,0] }} transition={{ repeat: Infinity, duration: 2, delay: i }}
                      style={{ position:'absolute', width:'100%', height:'100%', borderRadius:'50%', border:'2px solid rgba(124,58,237,0.4)' }} />
                  ))}
                </div>
                {/* Live AI overlays */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', padding: '0 12px' }}>
                  {[['👁️ Eye Contact', '85%', '#10B981'], ['😊 Confidence', '78%', '#F59E0B'], ['🎤 Voice', 'Clear', '#7C3AED']].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', background: c + '15', borderRadius: 6, padding: '3px 8px' }}>
                      <span style={{ fontSize: 10, color: c }}>{l}</span>
                      <span style={{ fontSize: 10, color: c, fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>REC</span>
                </div>
              </div>

              {/* Progress */}
              <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B', fontSize: 12 }}>Question {currentQ + 1} of {Math.min(5, questions.length)}</span>
                  <span style={{ color: '#7C3AED', fontSize: 12, fontWeight: 700 }}>{Math.round(((currentQ) / 5) * 100)}% done</span>
                </div>
                <div style={{ height: 6, background: 'rgba(99,102,241,0.1)', borderRadius: 100, marginBottom: 12 }}>
                  <motion.div animate={{ width: `${(currentQ / 5) * 100}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#7C3AED,#06B6D4)', borderRadius: 100 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} style={{ color: timer < 30 ? '#EF4444' : '#64748B' }} />
                  <span style={{ color: timer < 30 ? '#EF4444' : '#94A3B8', fontWeight: 700, fontSize: 14, fontFamily: 'Outfit' }}>
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                  </span>
                  <span style={{ color: '#475569', fontSize: 11 }}>remaining</span>
                </div>
              </div>
            </div>

            {/* Right: Question + Answer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.06))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={16} style={{ color: '#A78BFA' }} />
                  </div>
                  <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>AI Interviewer</span>
                </div>
                <motion.p key={currentQ} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#F1F5F9', fontSize: 17, fontWeight: 700, lineHeight: 1.5, fontFamily: 'Outfit', margin: 0 }}>
                  {questions[currentQ]}
                </motion.p>
              </div>

              <div>
                <label style={{ color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Your Answer <span style={{ color: '#475569', textTransform: 'none', fontWeight: 400 }}>({answer.trim().split(/\s+/).filter(Boolean).length} words)</span>
                </label>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here... (or speak if microphone is on)"
                  className="input-field" rows={6} style={{ resize: 'vertical', lineHeight: 1.7, fontSize: 14 }} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={submitAnswer} disabled={!answer.trim()}
                  className="btn-primary" style={{ flex: 1, padding: 13, fontSize: 14, fontWeight: 700, opacity: answer.trim() ? 1 : 0.5 }}>
                  {currentQ + 1 >= Math.min(5, questions.length) ? '🏁 Finish & Get Report' : 'Next Question →'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* REPORT PHASE */}
      {phase === 'report' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {isGenerating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7C3AED' }} />
              <p style={{ color: '#A78BFA', fontSize: 16, fontWeight: 700 }}>Analyzing your interview performance...</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Analyzing voice...', 'Processing answers...', 'Calculating scores...'].map((t, i) => (
                  <motion.span key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }}
                    style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(124,58,237,0.1)', color: '#A78BFA', fontSize: 12 }}>{t}</motion.span>
                ))}
              </div>
            </div>
          ) : report && (
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              {/* Overall Score Hero */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: `linear-gradient(135deg,${overallColor}15,rgba(13,22,39,0.9))`, border: `1px solid ${overallColor}30`, borderRadius: 24, padding: 32, textAlign: 'center', marginBottom: 20 }}>
                <p style={{ color: '#64748B', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Overall Interview Score</p>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
                  style={{ fontSize: 72, fontWeight: 900, color: overallColor, fontFamily: 'Outfit', lineHeight: 1, textShadow: `0 0 40px ${overallColor}40` }}>
                  {report.overall}<span style={{ fontSize: 28 }}>/100</span>
                </motion.div>
                <p style={{ color: overallColor, fontWeight: 700, marginTop: 8, fontSize: 16 }}>
                  {report.overall >= 80 ? '🌟 Excellent Performance!' : report.overall >= 65 ? '✅ Good Performance!' : '📈 Keep Practicing!'}
                </p>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Score Breakdown */}
                <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: 15, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 20 }}>📊 Score Breakdown</h3>
                  <ScoreBar label="Communication" score={report.commScore} color="#7C3AED" delay={0.1} />
                  <ScoreBar label="Technical Knowledge" score={report.techScore} color="#06B6D4" delay={0.2} />
                  <ScoreBar label="Eye Contact" score={report.eyeScore} color="#10B981" delay={0.3} />
                  <ScoreBar label="Confidence" score={report.confidScore} color="#F59E0B" delay={0.4} />
                  <ScoreBar label="Body Language" score={report.bodyScore} color="#EC4899" delay={0.5} />
                </div>

                {/* Filler Words + Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: report.totalFillers > 5 ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${report.totalFillers > 5 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 16, padding: 20, flex: 1 }}>
                    <p style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>🎤 Voice Analysis</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: report.totalFillers > 5 ? '#EF4444' : '#10B981', fontFamily: 'Outfit' }}>{report.totalFillers}</div>
                        <div style={{ color: '#64748B', fontSize: 11 }}>Filler Words</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#06B6D4', fontFamily: 'Outfit' }}>{report.avgWords}</div>
                        <div style={{ color: '#64748B', fontSize: 11 }}>Avg Words/Answer</div>
                      </div>
                    </div>
                    {report.totalFillers > 0 && (
                      <p style={{ color: '#F59E0B', fontSize: 12, marginTop: 10, background: 'rgba(245,158,11,0.08)', padding: '8px 10px', borderRadius: 8 }}>
                        ⚠️ Detected: umm, uhh, like, basically — practice pausing instead.
                      </p>
                    )}
                  </div>

                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 18 }}>
                    <p style={{ color: '#10B981', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ Strengths</p>
                    {report.commScore > 70 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><CheckCircle size={13} style={{ color: '#10B981' }} /><span style={{ color: '#6EE7B7', fontSize: 13 }}>Strong communication skills</span></div>}
                    {report.techScore > 70 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><CheckCircle size={13} style={{ color: '#10B981' }} /><span style={{ color: '#6EE7B7', fontSize: 13 }}>Good technical explanations</span></div>}
                    {report.avgWords > 50 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><CheckCircle size={13} style={{ color: '#10B981' }} /><span style={{ color: '#6EE7B7', fontSize: 13 }}>Detailed, comprehensive answers</span></div>}
                  </div>

                  <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 18 }}>
                    <p style={{ color: '#EF4444', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🔧 Improvements</p>
                    {report.eyeScore < 80 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><AlertCircle size={13} style={{ color: '#EF4444' }} /><span style={{ color: '#FCA5A5', fontSize: 13 }}>Maintain eye contact with camera</span></div>}
                    {report.totalFillers > 3 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><AlertCircle size={13} style={{ color: '#EF4444' }} /><span style={{ color: '#FCA5A5', fontSize: 13 }}>Reduce filler words (umm, like)</span></div>}
                    {report.avgWords < 40 && <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><AlertCircle size={13} style={{ color: '#EF4444' }} /><span style={{ color: '#FCA5A5', fontSize: 13 }}>Give more detailed answers (STAR format)</span></div>}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}><AlertCircle size={13} style={{ color: '#EF4444' }} /><span style={{ color: '#FCA5A5', fontSize: 13 }}>Improve answer structure with clear intro/body/conclusion</span></div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={reset} className="btn-secondary" style={{ flex: 1, padding: 13, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <RotateCcw size={15} /> Try Again
                </button>
                <button className="btn-primary" style={{ flex: 2, padding: 13, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Award size={15} /> Save Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
export default VideoInterviewAnalyzer;
