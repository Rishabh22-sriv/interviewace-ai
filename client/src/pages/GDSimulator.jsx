import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Clock, Send, Users, Trophy, TrendingUp,
  Mic, BarChart3, CheckCircle, Star, ChevronRight, RotateCcw
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const GD_TOPICS = [
  { id: 0, title: 'AI in Education', emoji: '🤖', tag: 'Technology', color: '#7C3AED' },
  { id: 1, title: 'Climate Change & Sustainability', emoji: '🌍', tag: 'Environment', color: '#10B981' },
  { id: 2, title: 'Social Media Impact on Society', emoji: '📱', tag: 'Society', color: '#EC4899' },
  { id: 3, title: 'Work from Home Culture', emoji: '🏠', tag: 'Work Life', color: '#06B6D4' },
  { id: 4, title: 'Cryptocurrency & Future Finance', emoji: '₿', tag: 'Finance', color: '#F59E0B' },
  { id: 5, title: 'Gender Equality in Technology', emoji: '⚖️', tag: 'Society', color: '#8B5CF6' },
  { id: 6, title: 'Electric Vehicles Revolution', emoji: '⚡', tag: 'Technology', color: '#06B6D4' },
  { id: 7, title: 'Mental Health in the Workplace', emoji: '🧠', tag: 'Health', color: '#10B981' },
  { id: 8, title: 'Startups vs Corporations', emoji: '🚀', tag: 'Business', color: '#F59E0B' },
  { id: 9, title: 'Space Exploration Priority', emoji: '🚀', tag: 'Science', color: '#7C3AED' },
];

const AI_PARTICIPANTS = [
  { name: 'Priya', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)', initials: 'P' },
  { name: 'Alex', color: '#7C3AED', bg: 'rgba(124,58,237,0.15)', initials: 'A' },
  { name: 'Sarah', color: '#10B981', bg: 'rgba(16,185,129,0.15)', initials: 'S' },
  { name: 'Raj', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', initials: 'R' },
];

const TOPIC_SCRIPTS = {
  0: [ // AI in Education
    { speaker: 0, text: 'AI can personalize learning for each student, adapting to their unique pace and learning style. This has the potential to be truly revolutionary for global education.' },
    { speaker: 1, text: 'However, we must address the equity issue. If AI education tools remain expensive, they will widen the digital divide rather than narrow it.' },
    { speaker: 2, text: 'I believe AI can handle routine teaching tasks like drilling and assessment, freeing teachers to focus on mentorship, critical thinking, and emotional development.' },
    { speaker: 3, text: 'The fundamental question is whether AI can replace the human connection in learning. I believe it cannot — AI should augment teachers, not replace them.' },
    { speaker: 0, text: 'Research shows that personalized tutoring improves outcomes by 2 standard deviations. AI can deliver this at scale for millions of students simultaneously.' },
    { speaker: 2, text: 'We should also consider teacher training. Most educators today lack the skills to effectively integrate AI tools into their pedagogy.' },
    { speaker: 1, text: 'Data privacy is a critical concern too. Student data collected by AI systems could be misused if proper regulatory frameworks are not in place.' },
  ],
  1: [
    { speaker: 0, text: 'Climate change is the defining crisis of our generation. We have already exceeded the 1.1°C warming threshold and must act with unprecedented urgency.' },
    { speaker: 2, text: 'Renewable energy adoption is accelerating — solar costs have dropped 90% in a decade. The economic argument for sustainability is now stronger than ever.' },
    { speaker: 3, text: 'Developing nations cannot be asked to sacrifice growth for climate goals that wealthy nations created. We need technology transfer and green financing.' },
    { speaker: 1, text: 'Individual actions matter but systemic change is essential. Carbon pricing mechanisms and corporate accountability are the levers that will drive real change.' },
    { speaker: 0, text: 'The IPCC report is clear — we have less than 10 years to cut emissions by 45% to limit warming to 1.5°C. Policy action must match the science.' },
    { speaker: 2, text: 'Green jobs are a massive economic opportunity. The clean energy sector could create 65 million new jobs globally by 2030 according to ILO estimates.' },
  ],
  2: [
    { speaker: 1, text: 'Social media has democratized information and given voice to marginalized communities. The Arab Spring would not have happened without Twitter and Facebook.' },
    { speaker: 0, text: 'But the mental health crisis among teenagers is directly correlated with social media usage. Facebook\'s own research showed Instagram harmed body image for teen girls.' },
    { speaker: 3, text: 'Misinformation spreads 6 times faster than truth on social media. This is an existential threat to democracy and public health, as we saw with COVID.' },
    { speaker: 2, text: 'Regulation is necessary but must be carefully designed. We need transparency in algorithms, age verification, and stronger data privacy protections.' },
    { speaker: 1, text: 'Social commerce is transforming economies, especially in India. Platforms like ShareChat and Meesho are enabling rural entrepreneurship at scale.' },
    { speaker: 0, text: 'The attention economy model is fundamentally broken. Platforms profit from outrage and addiction — their incentives are misaligned with societal wellbeing.' },
  ],
  3: [
    { speaker: 2, text: 'WFH has proven that productivity does not require physical presence. Microsoft\'s study found productivity actually increased for many roles during remote work.' },
    { speaker: 3, text: 'However, collaboration and innovation suffer. Spontaneous conversations in offices led to breakthroughs that are impossible to replicate on video calls.' },
    { speaker: 0, text: 'Work-life balance has improved for many, but the boundaries have also blurred. Many remote workers report working longer hours and feeling always "on."' },
    { speaker: 1, text: 'Hybrid work is the pragmatic solution. 3 days in office, 2 remote gives the best of both worlds and is what most employees actually prefer.' },
    { speaker: 2, text: 'Real estate savings from reduced office space could be redirected to employee benefits and salaries, creating a win-win for companies and employees.' },
    { speaker: 3, text: 'Junior employees especially need in-person mentorship. WFH disproportionately disadvantages those early in their careers who need observational learning.' },
  ],
};

// fallback for topics without scripts
const getScript = (topicId) => TOPIC_SCRIPTS[topicId] || TOPIC_SCRIPTS[0];

// ─── Circular Timer ───────────────────────────────────────────────────────────

const CircularTimer = ({ seconds, maxSeconds = 600 }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const pct = seconds / maxSeconds;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const urgent = seconds < 60;
  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <motion.circle
          cx={65} cy={65} r={r} fill="none"
          stroke={urgent ? '#EF4444' : '#7C3AED'}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - pct * circ}
          animate={{ strokeDashoffset: circ - pct * circ }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: urgent ? '#EF4444' : '#F1F5F9', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
        <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>remaining</span>
      </div>
    </div>
  );
};

// ─── Topic Selection ──────────────────────────────────────────────────────────

const TopicSelect = ({ onSelect }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 820, margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, marginBottom: 18 }}>
        <Users size={13} color="#A78BFA" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1.2 }}>AI Group Discussion</span>
      </div>
      <h1 style={{ fontSize: 38, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 12, lineHeight: 1.15 }}>
        Choose Your <span className="gradient-text">GD Topic</span>
      </h1>
      <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
        Debate with 4 AI participants in a realistic group discussion. Your leadership, communication, and argument quality will be scored.
      </p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
      {GD_TOPICS.map((t) => (
        <motion.button
          key={t.id} id={`gd-topic-${t.id}`}
          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(t)}
          style={{ padding: '20px 22px', borderRadius: 16, border: `1px solid rgba(99,102,241,0.12)`, background: 'rgba(13,22,39,0.75)', backdropFilter: 'blur(20px)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${t.color}18`, border: `1px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {t.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>{t.title}</div>
            <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, background: `${t.color}18`, border: `1px solid ${t.color}30`, fontSize: 10, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: 0.8 }}>{t.tag}</div>
          </div>
          <ChevronRight size={18} color="#475569" />
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ─── Discussion Room ──────────────────────────────────────────────────────────

const DiscussionRoom = ({ topic, onEnd }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(600);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [speakTime, setSpeakTime] = useState([0, 0, 0, 0]);
  const [userSpeaks, setUserSpeaks] = useState(0);
  const [ended, setEnded] = useState(false);
  const chatRef = useRef(null);
  const scriptRef = useRef(getScript(topic.id));
  const scriptIdxRef = useRef(0);
  const timerRef = useRef(null);
  const aiTimerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(aiTimerRef.current); setEnded(true); return 0; }
        return t - 1;
      });
    }, 1000);
    scheduleNextAI();
    return () => { clearInterval(timerRef.current); clearInterval(aiTimerRef.current); };
  }, []);

  const scheduleNextAI = () => {
    const delay = 6000 + Math.random() * 6000;
    aiTimerRef.current = setTimeout(() => {
      const script = scriptRef.current;
      if (scriptIdxRef.current < script.length) {
        const line = script[scriptIdxRef.current];
        const p = AI_PARTICIPANTS[line.speaker];
        setSpeakingIdx(line.speaker);
        setMessages(m => [...m, { id: Date.now(), type: 'ai', speaker: line.speaker, name: p.name, text: line.text, color: p.color }]);
        setSpeakTime(st => { const n = [...st]; n[line.speaker] += 8; return n; });
        scriptIdxRef.current++;
        setTimeout(() => setSpeakingIdx(null), 3000);
        scheduleNextAI();
      }
    }, delay);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSpeak = () => {
    if (!userInput.trim()) return;
    setMessages(m => [...m, { id: Date.now(), type: 'user', text: userInput }]);
    setUserSpeaks(s => s + 1);
    setUserInput('');
  };

  if (ended) return <ResultScreen topic={topic} userSpeaks={userSpeaks} speakTime={speakTime} messages={messages} onRestart={onEnd} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 4px' }}>{topic.title}</h2>
          <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>Group Discussion — 10 Minutes</p>
        </div>
        <CircularTimer seconds={timer} maxSeconds={600} />
        <button className="btn-danger" onClick={() => { clearInterval(timerRef.current); clearInterval(aiTimerRef.current); setEnded(true); }} style={{ padding: '10px 18px', fontSize: 13 }}>
          End Discussion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Participants */}
        <div className="glass-card-static" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Participants</p>
          {AI_PARTICIPANTS.map((p, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.bg, border: `2px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: p.color }}>
                    {p.initials}
                  </div>
                  {speakingIdx === i && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${p.color}` }}
                    />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>AI Participant</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(99,102,241,0.1)', borderRadius: 10 }}>
                  <motion.div style={{ height: 4, borderRadius: 10, background: p.color }} animate={{ width: `${Math.min(100, (speakTime[i] / 60) * 100)}%` }} transition={{ duration: 0.5 }} />
                </div>
                <span style={{ fontSize: 10, color: '#475569', whiteSpace: 'nowrap' }}>{speakTime[i]}s</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 14, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '2px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>
                You
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>You</div>
                <div style={{ fontSize: 10, color: '#7C3AED' }}>{userSpeaks} contributions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="glass-card-static" style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
              <span style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600 }}>💬 Group Discussion Started — Topic: "{topic.title}"</span>
            </motion.div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16, x: msg.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  style={{ display: 'flex', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}
                >
                  {msg.type === 'ai' && (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: AI_PARTICIPANTS[msg.speaker].bg, border: `2px solid ${AI_PARTICIPANTS[msg.speaker].color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: AI_PARTICIPANTS[msg.speaker].color, flexShrink: 0 }}>
                      {AI_PARTICIPANTS[msg.speaker].initials}
                    </div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    {msg.type === 'ai' && <div style={{ fontSize: 11, color: AI_PARTICIPANTS[msg.speaker].color, fontWeight: 700, marginBottom: 4 }}>{msg.name}</div>}
                    <div style={{
                      padding: '12px 16px', borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.type === 'user' ? 'linear-gradient(135deg,#7C3AED,#6366F1)' : 'rgba(13,22,39,0.8)',
                      border: msg.type === 'ai' ? `1px solid ${AI_PARTICIPANTS[msg.speaker].color}25` : 'none',
                      color: msg.type === 'user' ? 'white' : '#E2E8F0',
                      fontSize: 13, lineHeight: 1.65,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {speakingIdx !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: AI_PARTICIPANTS[speakingIdx].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: AI_PARTICIPANTS[speakingIdx].color }}>
                  {AI_PARTICIPANTS[speakingIdx].initials}
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: AI_PARTICIPANTS[speakingIdx].color }} animate={{ y: [0, -6, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />)}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', gap: 10 }}>
            <input
              className="input-field"
              placeholder="Make your point... (press Enter to speak)"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSpeak()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={handleSpeak} style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
              <Send size={15} /> Speak
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Result Screen ────────────────────────────────────────────────────────────

const ResultScreen = ({ topic, userSpeaks, speakTime, onRestart }) => {
  const participation = Math.min(10, userSpeaks * 2 + 3);
  const leadership = 6 + Math.floor(Math.random() * 4);
  const communication = 7 + Math.floor(Math.random() * 3);
  const argQuality = 6 + Math.floor(Math.random() * 4);
  const overall = Math.round((participation + leadership + communication + argQuality) / 4 * 10);

  const metrics = [
    { label: 'Leadership', value: leadership, max: 10, color: '#7C3AED' },
    { label: 'Participation', value: participation, max: 10, color: '#06B6D4' },
    { label: 'Communication', value: communication, max: 10, color: '#10B981' },
    { label: 'Argument Quality', value: argQuality, max: 10, color: '#F59E0B' },
    { label: 'Points Made', value: userSpeaks, max: 10, color: '#EC4899', suffix: ' pts' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 50px rgba(124,58,237,0.4)' }}>
          <Trophy size={42} color="white" />
        </motion.div>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 10 }}>
          Discussion <span className="gradient-text">Complete!</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 14 }}>Topic: {topic.title}</p>
        <div style={{ display: 'inline-block', marginTop: 16 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }}
            style={{ fontSize: 72, fontWeight: 900, fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {overall}
          </motion.div>
          <div style={{ color: '#94A3B8', fontSize: 16 }}>/ 100 GD Score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={15} color="#7C3AED" /> Score Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {metrics.map((m) => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#94A3B8', fontSize: 13 }}>{m.label}</span>
                  <span style={{ color: m.color, fontWeight: 700, fontSize: 13 }}>{m.value}{m.suffix || `/${m.max}`}</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" style={{ background: m.color }} initial={{ width: 0 }} animate={{ width: `${(m.value / m.max) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card-static" style={{ padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} /> Strengths Observed
            </h3>
            {['Clear and confident communication', 'Listened actively to others\' points', 'Made relevant topic contributions'].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Star size={11} color="#10B981" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="glass-card-static" style={{ padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} /> Improvement Areas
            </h3>
            {['Speak more frequently to boost participation', 'Build on and reference others\' points', 'Use data and statistics to support arguments'].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Star size={11} color="#F59E0B" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-primary" onClick={onRestart} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <RotateCcw size={15} /> Try Another Topic
        </button>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <MessageSquare size={15} /> Share Results
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const GDSimulator = () => {
  const [phase, setPhase] = useState('select'); // select | discuss
  const [topic, setTopic] = useState(null);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px' }}>
        <AnimatePresence mode="wait">
          {phase === 'select' && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TopicSelect onSelect={(t) => { setTopic(t); setPhase('discuss'); }} />
            </motion.div>
          )}
          {phase === 'discuss' && topic && (
            <motion.div key="discuss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DiscussionRoom topic={topic} onEnd={() => { setPhase('select'); setTopic(null); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GDSimulator;
