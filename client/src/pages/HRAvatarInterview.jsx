import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, MessageSquare, Users, Code, Target, Star,
  CheckCircle, ChevronRight, RotateCcw, BarChart3,
  TrendingUp, Lightbulb, Award, Mic, Send
} from 'lucide-react';

// ─── Question Banks ───────────────────────────────────────────────────────────

const QUESTION_BANKS = {
  HR: [
    'Tell me about yourself and your professional background.',
    'Why are you interested in this specific role?',
    'What are your three greatest professional strengths?',
    'What is your biggest weakness, and how are you actively working on it?',
    'Where do you see yourself professionally in the next 5 years?',
    'Why are you considering leaving your current position?',
    'Describe your ideal work environment and team culture.',
    'How do you handle high-pressure situations and tight deadlines?',
    'What motivates you to do your very best work each day?',
    'Do you prefer working independently or as part of a team? Why?',
    'What are your salary expectations for this role?',
    'How would your closest colleagues describe working with you?',
    'Tell me about a significant professional challenge you overcame.',
    'What do you know about our company and what we stand for?',
    'Why should we choose you over other equally qualified candidates?',
    'What is your current notice period?',
    'Do you have any questions you would like to ask us?',
    'Describe your preferred working and communication style.',
    'What is your greatest professional achievement to date?',
    'How do you prioritize your tasks when everything feels urgent?',
  ],
  Technical: [
    'Explain the key differences between REST and GraphQL APIs.',
    'Walk me through your experience and approach to system design.',
    'How do you systematically approach debugging a complex production issue?',
    'Explain the SOLID principles and give a practical example of each.',
    'What design patterns have you used in production, and when did they help?',
    'How do you ensure and maintain code quality across a team?',
    'Describe your experience with CI/CD pipelines and DevOps practices.',
    'How do you identify and resolve database performance bottlenecks?',
    'Explain the pros and cons of microservices architecture.',
    'What security measures do you implement when designing APIs?',
  ],
  Behavioral: [
    'Tell me about a time you failed at something important. What did you learn?',
    'Describe a situation where you had to collaborate with a very difficult colleague.',
    'Give me a concrete example of when you demonstrated leadership initiative.',
    'Tell me about a time you successfully met an extremely tight deadline.',
    'Describe a situation where you had to quickly learn a completely new technology or skill.',
    'Tell me about a time you respectfully disagreed with your manager. How did it resolve?',
    'Describe the project you are most proud of and why it was successful.',
    'Tell me about a time you proactively helped a struggling colleague succeed.',
    'Give an example of when you solved a problem in a creative or unconventional way.',
    'Describe a time you received difficult feedback. How did you respond and grow from it?',
  ],
  Leadership: [
    'How do you rebuild motivation in a team that is experiencing low morale?',
    'Describe your core leadership philosophy and how it shapes your decisions.',
    'How do you handle a team member who is consistently underperforming?',
    'Tell me about a time you successfully drove significant organizational change.',
    'How do you make confident decisions when facing uncertainty or incomplete data?',
    'How do you approach mentoring and developing junior team members?',
    'What specific strategies do you use to build trust within your team?',
    'Tell me about a time you had to deliver a decision your team did not agree with.',
    'How do you align your team\'s day-to-day goals with the company\'s broader vision?',
    'Describe your approach to conflict resolution when two strong team members disagree.',
  ],
};

const MODES = ['HR', 'Technical', 'Behavioral', 'Leadership'];
const ROLES = ['SDE', 'Data', 'Product', 'Design', 'Marketing'];

const MODE_ICONS = { HR: Users, Technical: Code, Behavioral: MessageSquare, Leadership: Target };
const MODE_COLORS = { HR: '#7C3AED', Technical: '#06B6D4', Behavioral: '#10B981', Leadership: '#F59E0B' };

const MODEL_ANSWERS = [
  {
    q: 'Tell me about yourself and your professional background.',
    ans: 'A strong answer follows the Present-Past-Future formula: Start with your current role and key achievements, briefly mention relevant past experience, then connect it to why you\'re excited about this specific opportunity. Keep it to 90 seconds and end with a question-hook.',
  },
  {
    q: 'What is your biggest weakness, and how are you actively working on it?',
    ans: 'Choose a genuine weakness that is not critical for the role. Show self-awareness and demonstrate active improvement steps. For example: "I historically over-engineered solutions. I now set strict time-box constraints for design decisions and check with teammates before implementing complex abstractions."',
  },
  {
    q: 'Why should we choose you over other equally qualified candidates?',
    ans: 'Focus on 2-3 unique value propositions: specific skills that overlap perfectly with the role, a relevant achievement with measurable impact, and your cultural fit. End with genuine enthusiasm for the company\'s mission. Avoid generic phrases like "I\'m a hard worker."',
  },
];

// ─── Typing Effect ────────────────────────────────────────────────────────────

const useTyping = (text, speed = 18) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const HRAvatar = ({ speaking, mode }) => {
  const color = MODE_COLORS[mode] || '#7C3AED';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Pulsing rings */}
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[1, 2, 3].map(ring => (
          <motion.div
            key={ring}
            animate={speaking ? { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] } : { scale: [1, 1.2, 1], opacity: [0.3, 0.05, 0.3] }}
            transition={{ repeat: Infinity, duration: speaking ? 1.2 : 2.5, delay: ring * (speaking ? 0.3 : 0.7), ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 120 + ring * 26, height: 120 + ring * 26, borderRadius: '50%', border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}40` }}
          />
        ))}
        {/* Main avatar circle */}
        <motion.div
          animate={{ boxShadow: speaking ? [`0 0 40px ${color}70`, `0 0 80px ${color}40`, `0 0 40px ${color}70`] : [`0 0 30px ${color}40`, `0 0 50px ${color}20`, `0 0 30px ${color}40`] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: 120, height: 120, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}88, #06B6D4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}
        >
          <Brain size={52} color="white" strokeWidth={1.5} />
        </motion.div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 4px', color: '#F1F5F9' }}>Alex AI</h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 100, background: `${color}18`, border: `1px solid ${color}40` }}>
          <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.8 }}>{mode} Interviewer</span>
        </div>
        {speaking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
            {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: color }} animate={{ y: [0, -8, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── Score Ring ───────────────────────────────────────────────────────────────

const ScoreRing = ({ score, size = 140 }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#10B981' : score >= 55 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ fontSize: size > 120 ? 34 : 24, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
          {score}
        </motion.span>
        <span style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
};

// ─── Summary Screen ───────────────────────────────────────────────────────────

const SummaryScreen = ({ answers, mode, onRetry, onChangeMode }) => {
  const score = Math.round(answers.reduce((acc, a) => acc + (a.score || 60), 0) / answers.length);
  const level = score >= 80 ? { label: 'Excellent', color: '#10B981' } : score >= 65 ? { label: 'Good', color: '#7C3AED' } : score >= 50 ? { label: 'Average', color: '#F59E0B' } : { label: 'Needs Work', color: '#EF4444' };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: '0 auto', padding: '0 8px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
          <Award size={40} color="white" />
        </motion.div>
        <h1 style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
          Interview <span className="gradient-text">Complete!</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 14 }}>{mode} Interview — {answers.length} Questions Answered</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card-static" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <ScoreRing score={score} />
          <div style={{ padding: '6px 18px', borderRadius: 100, background: `${level.color}18`, border: `1px solid ${level.color}40` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: level.color }}>{level.label}</span>
          </div>
        </div>
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={15} color="#7C3AED" /> Performance Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Communication Clarity', val: 65 + Math.floor(Math.random() * 30), color: '#7C3AED' },
              { label: 'Answer Depth', val: 55 + Math.floor(Math.random() * 35), color: '#06B6D4' },
              { label: 'Confidence Level', val: 60 + Math.floor(Math.random() * 30), color: '#10B981' },
              { label: 'Relevance of Answers', val: 65 + Math.floor(Math.random() * 30), color: '#F59E0B' },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>{m.label}</span>
                  <span style={{ color: m.color, fontWeight: 700, fontSize: 12 }}>{m.val}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" style={{ background: m.color }} initial={{ width: 0 }} animate={{ width: `${m.val}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="glass-card-static" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={14} /> Key Strengths
          </h3>
          {['Clear and structured responses', 'Good use of specific examples', 'Confident and professional tone'].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Star size={11} color="#10B981" style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
        <div className="glass-card-static" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} /> Improve Next Time
          </h3>
          {['Use the STAR format more consistently', 'Quantify achievements with numbers', 'Keep answers under 2 minutes each'].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Star size={11} color="#F59E0B" style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={15} color="#F59E0B" /> Model Answers for Improvement
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MODEL_ANSWERS.slice(0, 2).map((m, i) => (
            <div key={i} style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 16 }}>
              <p style={{ color: '#F1F5F9', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Q: {m.q}</p>
              <p style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>{m.ans}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-primary" onClick={onRetry} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <RotateCcw size={15} /> Try Again
        </button>
        <button className="btn-secondary" onClick={onChangeMode} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <ChevronRight size={15} /> Different Mode
        </button>
      </div>
    </motion.div>
  );
};

// ─── Interview Session ────────────────────────────────────────────────────────

const InterviewSession = ({ mode, role, onComplete }) => {
  const [qIdx, setQIdx] = useState(0);
  const [questions] = useState(() => {
    const bank = QUESTION_BANKS[mode] || QUESTION_BANKS.HR;
    return [...bank].sort(() => Math.random() - 0.5).slice(0, 10);
  });
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState('question'); // question | answered
  const [avatarSpeaking, setAvatarSpeaking] = useState(true);
  const [answers, setAnswers] = useState([]);
  const chatRef = useRef(null);

  const currentQ = questions[qIdx];
  const color = MODE_COLORS[mode];
  const { displayed, done } = useTyping(currentQ, 20);

  useEffect(() => {
    setAvatarSpeaking(true);
    const t = setTimeout(() => setAvatarSpeaking(false), currentQ.length * 22 + 500);
    return () => clearTimeout(t);
  }, [qIdx, currentQ]);

  useEffect(() => {
    setMessages([{ id: 0, type: 'ai', text: currentQ }]);
    setAnswer('');
    setPhase('question');
  }, [qIdx]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.round(Math.min(100, 40 + wordCount * 1.5 + Math.random() * 20));
    const newAnswer = { question: currentQ, answer, score };
    setAnswers(a => [...a, newAnswer]);

    const followUps = [
      'That\'s a great insight! Could you elaborate on how you measured success in that situation?',
      'Interesting perspective. What specific steps did you take to achieve that outcome?',
      'I appreciate the depth of your answer. What would you do differently with hindsight?',
      'Good point. How did stakeholders react, and what did you learn from their feedback?',
    ];
    const followUp = followUps[qIdx % followUps.length];

    setMessages(m => [
      ...m,
      { id: Date.now(), type: 'user', text: answer },
      { id: Date.now() + 1, type: 'ai-follow', text: followUp },
    ]);
    setPhase('answered');
    setAnswer('');
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(q => q + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start', maxWidth: 940, margin: '0 auto' }}>
      {/* Left: Avatar panel */}
      <div className="glass-card-static" style={{ padding: 28, position: 'sticky', top: 24 }}>
        <HRAvatar speaking={avatarSpeaking} mode={mode} />
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>Q{qIdx + 1}/10</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 16 }}>
            <motion.div className="progress-fill" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} animate={{ width: `${((qIdx + (phase === 'answered' ? 1 : 0)) / 10) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: `${color}12`, border: `1px solid ${color}25` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.8 }}>Role: {role}</span>
          </div>
        </div>
      </div>

      {/* Right: Chat panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div className="glass-card-static" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Question display */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(99,102,241,0.1)', background: `${color}08` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={17} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 6px' }}>ALEX AI — {mode.toUpperCase()} QUESTION {qIdx + 1}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9', margin: 0, lineHeight: 1.65 }}>{displayed}{!done && <span style={{ display: 'inline-block', width: 2, height: 16, background: color, marginLeft: 2, animation: 'blink 1s step-end infinite' }} />}</p>
              </div>
            </div>
          </div>

          {/* Chat history */}
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', maxHeight: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence>
              {messages.slice(1).map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10, x: msg.type === 'user' ? 20 : -20 }} animate={{ opacity: 1, y: 0, x: 0 }}
                  style={{ display: 'flex', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                  {msg.type !== 'user' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Brain size={13} color="white" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '78%', padding: '10px 14px',
                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.type === 'user' ? `linear-gradient(135deg,${color},${color}cc)` : 'rgba(13,22,39,0.8)',
                    border: msg.type !== 'user' ? '1px solid rgba(99,102,241,0.15)' : 'none',
                    color: '#E2E8F0', fontSize: 13, lineHeight: 1.6,
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
            {phase === 'question' ? (
              <>
                <textarea
                  className="input-field"
                  placeholder="Type your answer here... Be specific and use real examples."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
                  style={{ minHeight: 100, resize: 'none', lineHeight: 1.65, marginBottom: 10 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#475569', fontSize: 11 }}>Ctrl+Enter to submit • {answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <button className="btn-primary" onClick={handleSubmit} disabled={answer.trim().length < 5} style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Send size={14} /> Submit Answer
                  </button>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={15} color="#10B981" />
                    <span style={{ color: '#94A3B8', fontSize: 13 }}>Answer recorded</span>
                  </div>
                  <button className="btn-primary" onClick={handleNext} style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {qIdx < questions.length - 1 ? <><ChevronRight size={14} /> Next</> : <><Award size={14} /> Finish</>}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const HRAvatarInterview = () => {
  const [phase, setPhase] = useState('setup'); // setup | interview | summary
  const [mode, setMode] = useState('HR');
  const [role, setRole] = useState('SDE');
  const [answers, setAnswers] = useState([]);

  const handleComplete = (ans) => { setAnswers(ans); setPhase('summary'); };
  const handleRetry = () => { setAnswers([]); setPhase('interview'); };
  const handleChangeMode = () => { setAnswers([]); setPhase('setup'); };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px' }}>
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ maxWidth: 700, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, marginBottom: 18 }}>
                  <Mic size={13} color="#A78BFA" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1.2 }}>AI Avatar Interview</span>
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 10, lineHeight: 1.15 }}>
                  Interview with <span className="gradient-text">Alex AI</span>
                </h1>
                <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
                  Practice with our AI interviewer for real-time feedback. 10 questions, personalized by mode and role.
                </p>
              </div>

              <div className="glass-card-static" style={{ padding: 28, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Select Interview Mode</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
                  {MODES.map(m => {
                    const Icon = MODE_ICONS[m];
                    const col = MODE_COLORS[m];
                    const active = mode === m;
                    return (
                      <button key={m} id={`mode-${m.toLowerCase()}`} onClick={() => setMode(m)}
                        style={{ padding: '16px 10px', borderRadius: 12, border: `2px solid ${active ? col : 'rgba(99,102,241,0.12)'}`, background: active ? `${col}15` : 'rgba(13,22,39,0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, boxShadow: active ? `0 0 20px ${col}30` : 'none' }}>
                        <Icon size={20} color={active ? col : '#475569'} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#F1F5F9' : '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{m}</span>
                      </button>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Select Your Role</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      style={{ padding: '9px 18px', borderRadius: 100, border: `1px solid ${role === r ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: role === r ? 'rgba(124,58,237,0.12)' : 'rgba(13,22,39,0.5)', cursor: 'pointer', color: role === r ? '#C4B5FD' : '#94A3B8', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('interview')}
                style={{ width: '100%', padding: '17px', fontSize: 16, justifyContent: 'center', borderRadius: 14 }}
              >
                <Brain size={19} /> Start Interview with Alex AI
              </motion.button>
            </motion.div>
          )}

          {phase === 'interview' && (
            <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InterviewSession mode={mode} role={role} onComplete={handleComplete} />
            </motion.div>
          )}

          {phase === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SummaryScreen answers={answers} mode={mode} onRetry={handleRetry} onChangeMode={handleChangeMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HRAvatarInterview;
