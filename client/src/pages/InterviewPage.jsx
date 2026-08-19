import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewService } from '../services';
import toast from 'react-hot-toast';
import {
  Brain, Mic, MessageSquare, Code, Target, Users,
  ChevronRight, Play, Settings, Zap, Clock, BarChart3,
  CheckCircle, Send, AlertTriangle, RefreshCw, Info
} from 'lucide-react';

// ─────────────────────────────────────────────
// TOPIC SUGGESTIONS per interview type
// ─────────────────────────────────────────────

const TOPIC_SUGGESTIONS = {
  technical: [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js',
    'Python', 'Java', 'C++', 'SQL', 'MongoDB',
    'DSA', 'System Design', 'DBMS', 'OS', 'Computer Networks',
    'TypeScript', 'Git', 'Docker', 'REST APIs', 'GraphQL',
  ],
  aptitude: ['Quantitative', 'Logical Reasoning', 'Verbal', 'Data Interpretation', 'Puzzles'],
  'system-design': [
    'Design a URL Shortener', 'Design WhatsApp', 'Design Netflix',
    'Design Twitter', 'Design a Payment System', 'Design a Cache System',
    'Design an API Rate Limiter', 'Design a Notification System',
  ],
  hr: ['Leadership', 'Teamwork', 'Conflict Resolution', 'Career Goals', 'Work Ethic'],
  behavioral: ['STAR Method', 'Problem Solving', 'Leadership', 'Failure Stories', 'Achievements'],
};

const interviewTypes = [
  { id: 'technical', label: 'Technical', description: 'Coding, concepts, domain knowledge', icon: Code, color: '#06B6D4', gradient: 'rgba(6,182,212,0.12)', requiresTopic: true },
  { id: 'hr', label: 'HR Interview', description: 'Culture fit, soft skills, background', icon: Users, color: '#7C3AED', gradient: 'rgba(124,58,237,0.12)', requiresTopic: false },
  { id: 'behavioral', label: 'Behavioral', description: 'STAR method, situational questions', icon: MessageSquare, color: '#EC4899', gradient: 'rgba(236,72,153,0.12)', requiresTopic: false },
  { id: 'aptitude', label: 'Aptitude', description: 'Logical reasoning, problem solving', icon: Brain, color: '#10B981', gradient: 'rgba(16,185,129,0.12)', requiresTopic: false },
  { id: 'system-design', label: 'System Design', description: 'Architecture, scalability, design', icon: Settings, color: '#F59E0B', gradient: 'rgba(245,158,11,0.12)', requiresTopic: false },
];

// ─────────────────────────────────────────────
// Step 1: Setup
// ─────────────────────────────────────────────

const SetupStep = ({ onStart }) => {
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState(5);
  const [topic, setTopic] = useState('');
  const [inputMethod, setInputMethod] = useState('text');
  const [loading, setLoading] = useState(false);

  const selectedType = interviewTypes.find(t => t.id === type);
  const suggestions = TOPIC_SUGGESTIONS[type] || [];

  const handleStart = async () => {
    if (!type) return toast.error('Please select an interview type');
    
    // Enforce topic for technical interviews
    if (type === 'technical' && !topic.trim()) {
      return toast.error('Please select or enter a topic for Technical interviews (e.g., "HTML", "Python")');
    }
    
    setLoading(true);
    try {
      const res = await interviewService.start({ 
        type, 
        difficulty, 
        totalQuestions: questions, 
        topic: topic.trim(),
      });
      onStart(res.data.interview, inputMethod);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate interview. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
            Set Up Your <span className="gradient-text">AI Interview</span>
          </h1>
          <p style={{ color: '#64748B' }}>Configure your practice session and let AI generate tailored questions</p>
        </div>

        {/* Interview Type */}
        <div className="glass-card-static" style={{ padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={18} style={{ color: '#7C3AED' }} /> Select Interview Type
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {interviewTypes.map((t) => (
              <button
                key={t.id}
                id={`type-${t.id}`}
                onClick={() => { setType(t.id); setTopic(''); }}
                style={{
                  padding: '16px 12px',
                  borderRadius: 12,
                  border: `2px solid ${type === t.id ? t.color : 'rgba(99,102,241,0.12)'}`,
                  background: type === t.id ? t.gradient : 'rgba(15,23,42,0.4)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <t.icon size={22} style={{ color: type === t.id ? t.color : '#475569' }} />
                <p style={{ color: type === t.id ? '#E2E8F0' : '#94A3B8', fontSize: 13, fontWeight: 600, margin: 0 }}>{t.label}</p>
                <p style={{ color: '#64748B', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{t.description}</p>
                {t.requiresTopic && (
                  <span style={{ fontSize: 10, color: t.color, fontWeight: 700, background: `${t.color}15`, padding: '2px 7px', borderRadius: 10, border: `1px solid ${t.color}30` }}>Topic Required</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selection — shown when type is selected */}
        <AnimatePresence>
          {type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card-static"
              style={{ padding: 24, marginBottom: 20, overflow: 'hidden' }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎯 {selectedType?.requiresTopic ? (
                  <><span style={{ color: '#EF4444' }}>*</span> Select Topic <span style={{ color: '#64748B', fontSize: 12, fontWeight: 400 }}>(required for Technical)</span></>
                ) : (
                  <>Select Topic <span style={{ color: '#64748B', fontSize: 12, fontWeight: 400 }}>(optional — adds focus)</span></>
                )}
              </h3>
              
              {/* Quick-select chips */}
              {suggestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => setTopic(s)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: `1px solid ${topic === s ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`,
                        background: topic === s ? 'rgba(124,58,237,0.15)' : 'rgba(15,23,42,0.4)',
                        color: topic === s ? '#C4B5FD' : '#64748B',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: topic === s ? 600 : 400,
                        transition: 'all 0.15s',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {topic === s && '✓ '}{s}
                    </button>
                  ))}
                </div>
              )}
              
              <input
                className="input-field"
                placeholder={type === 'technical' ? 'Or type a custom topic (e.g., "React Hooks", "Binary Trees")' : 'Optional: type a specific focus area'}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ fontSize: 14 }}
              />
              
              {type === 'technical' && topic && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                  <span style={{ color: '#10B981', fontSize: 12, fontWeight: 600 }}>AI will generate strictly {topic}-specific questions</span>
                </div>
              )}
              
              {type === 'technical' && !topic && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
                  <span style={{ color: '#F59E0B', fontSize: 12 }}>Select a topic above to ensure accurate, focused questions</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Difficulty */}
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} style={{ color: '#F59E0B' }} /> Difficulty
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'easy', label: 'Easy', emoji: '🟢', desc: 'Fundamentals & basics' },
                { id: 'medium', label: 'Medium', emoji: '🟡', desc: 'Practical understanding' },
                { id: 'hard', label: 'Hard', emoji: '🔴', desc: 'Advanced & edge cases' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${difficulty === d.id ? '#6366F1' : 'rgba(99,102,241,0.12)'}`,
                    background: difficulty === d.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: difficulty === d.id ? '#A5B4FC' : '#64748B',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {d.emoji} {d.label}
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: '#475569', marginTop: 2 }}>{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} style={{ color: '#06B6D4' }} /> Questions: {questions}
            </h3>
            <input
              type="range"
              min="3"
              max="15"
              value={questions}
              onChange={(e) => setQuestions(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7C3AED', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: '#64748B', fontSize: 12 }}>3 (Quick)</span>
              <span style={{ color: '#64748B', fontSize: 12 }}>15 (Full)</span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              ~{questions * 3} min estimated
            </p>
          </div>

          {/* Input Method */}
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mic size={16} style={{ color: '#EC4899' }} /> Answer Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'text', label: '⌨️ Text Input', desc: 'Type your answers' },
                { id: 'voice', label: '🎙️ Voice Input', desc: 'Speak your answers' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setInputMethod(m.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${inputMethod === m.id ? '#EC4899' : 'rgba(99,102,241,0.12)'}`,
                    background: inputMethod === m.id ? 'rgba(236,72,153,0.08)' : 'transparent',
                    color: inputMethod === m.id ? '#F9A8D4' : '#64748B',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {m.label}<br />
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#475569' }}>{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          id="start-interview-btn"
          className="btn-primary"
          onClick={handleStart}
          disabled={loading || !type || (type === 'technical' && !topic.trim())}
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Generating AI Questions...
            </span>
          ) : (
            <><Play size={20} /> Start Interview Session</>
          )}
        </button>
        
        {type === 'technical' && !topic.trim() && (
          <p style={{ textAlign: 'center', color: '#F59E0B', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <AlertTriangle size={14} /> Please select a topic to enable the start button
          </p>
        )}
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Voice Recorder Hook
// ─────────────────────────────────────────────

const useVoiceRecorder = (onTranscript) => {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useState(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let finalTranscript = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interim += transcript;
      }
      onTranscript(finalTranscript + interim);
    };
    recognition.start();
    recognitionRef[1](recognition);
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef[0]) { recognitionRef[0].stop(); recognitionRef[1](null); }
    setRecording(false);
  };

  return { recording, startRecording, stopRecording };
};

// ─────────────────────────────────────────────
// Step 2: Interview Session
// ─────────────────────────────────────────────

const InterviewSession = ({ interview, inputMethod, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());
  const [completing, setCompleting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { recording, startRecording, stopRecording } = useVoiceRecorder((text) => setAnswer(text));

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;
  const progress = (currentIndex / interview.questions.length) * 100;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please provide an answer before submitting');
    if (answer.trim().length < 10) return toast.error('Please provide a more detailed answer (at least 10 characters)');
    
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await interviewService.submitAnswer({
        interviewId: interview.id,
        questionIndex: currentIndex,
        answer: answer.trim(),
        inputMethod,
      });
      setEvaluation(res.data.evaluation);
      setAnswers([...answers, { question: currentQuestion.question, answer, evaluation: res.data.evaluation }]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to evaluate answer. Please try again.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setCompleting(true);
      try {
        const duration = Math.round((Date.now() - startTime) / 1000);
        const res = await interviewService.complete(interview.id, { duration });
        toast.success('Interview completed! 🎉');
        onComplete(interview.id, res.data);
      } catch {
        toast.error('Failed to finalize interview.');
      } finally {
        setCompleting(false);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setEvaluation(null);
      setSubmitError(null);
    }
  };

  const getScoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#6366F1' : s >= 40 ? '#F59E0B' : '#EF4444';
  const getScoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Work';

  // Score display mapping (rename for honest display)
  const scoreItems = [
    { label: 'Communication', key: 'communication', desc: 'Clarity and structure of your answer' },
    { label: 'Technical Accuracy', key: 'technicalAccuracy', desc: `Correctness for ${interview.topic}` },
    { label: 'Relevance', key: 'relevance', desc: 'How directly you answered the question' },
    { label: 'Completeness', key: 'completeness', desc: 'Key concepts covered' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#94A3B8', fontSize: 14 }}>Question {currentIndex + 1} of {interview.questions.length}</span>
          <span style={{ color: '#64748B', fontSize: 12, marginLeft: 10 }}>
            {interview.topic && `• ${interview.topic}`}
          </span>
        </div>
        <span style={{ color: '#A5B4FC', fontSize: 13, fontWeight: 600 }}>
          {interview.type.replace(/-/g, ' ').toUpperCase()} • {interview.difficulty.toUpperCase()}
        </span>
      </div>
      
      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card-static"
        style={{ padding: 28, marginBottom: 20 }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Brain size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#A5B4FC', fontSize: 12, fontWeight: 600, margin: '0 0 6px' }}>
              AI INTERVIEWER — {interview.topic ? interview.topic.toUpperCase() : interview.type.toUpperCase()}
            </p>
            <p style={{ color: '#E2E8F0', fontSize: 16, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
              {currentQuestion.question}
            </p>
          </div>
        </div>
        
        {currentQuestion.hint && !evaluation && (
          <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'rgba(99,102,241,0.06)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.12)', marginTop: 12 }}>
            <Info size={14} style={{ color: '#818CF8', flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: '#818CF8', fontSize: 12 }}>Hint: {currentQuestion.hint}</span>
          </div>
        )}
      </motion.div>

      {/* Answer Area */}
      {!evaluation && (
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600, margin: 0 }}>Your Answer</p>
            {inputMethod === 'voice' && (
              <div style={{ display: 'flex', gap: 8 }}>
                {!recording ? (
                  <button onClick={startRecording} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mic size={14} /> Start Recording
                  </button>
                ) : (
                  <button onClick={stopRecording} style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8, border: '1px solid #EF4444', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                    Stop Recording
                  </button>
                )}
              </div>
            )}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={inputMethod === 'voice' ? 'Your speech will appear here...' : 'Type your answer in detail. The more specific you are, the better the evaluation.'}
            className="input-field"
            style={{ minHeight: 140, resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}
          />

          {submitError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={14} style={{ color: '#EF4444' }} />
              <span style={{ color: '#FCA5A5', fontSize: 13 }}>{submitError}</span>
              <button onClick={handleSubmitAnswer} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span style={{ color: '#475569', fontSize: 12 }}>{answer.length} characters</span>
            <button
              id="submit-answer-btn"
              className="btn-primary"
              onClick={handleSubmitAnswer}
              disabled={submitting || !answer.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px' }}
            >
              {submitting ? (
                <>
                  <motion.div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Evaluating...
                </>
              ) : (
                <><Send size={15} /> Submit Answer</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI Evaluation Results */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-static"
            style={{ padding: 28, marginBottom: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <CheckCircle size={20} style={{ color: '#10B981' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0 }}>AI Evaluation</h3>
              <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: getScoreColor(evaluation.scores?.overall), fontFamily: 'Outfit, sans-serif' }}>
                {evaluation.scores?.overall || 0}/100
              </span>
            </div>

            {/* Score Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              {scoreItems.map(({ label, key, desc }) => {
                const score = evaluation.scores?.[key] ?? 0;
                return (
                  <div key={key} style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>{label}</span>
                      <span style={{ color: getScoreColor(score), fontWeight: 700, fontSize: 14 }}>{score} <span style={{ fontSize: 10, color: getScoreColor(score) }}>({getScoreLabel(score)})</span></span>
                    </div>
                    <span style={{ color: '#475569', fontSize: 11, display: 'block', marginBottom: 6 }}>{desc}</span>
                    <div className="progress-bar">
                      <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${score}%` }} style={{ background: getScoreColor(score) }} transition={{ duration: 0.8, delay: 0.1 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strengths */}
            {evaluation.feedback?.strengths?.length > 0 && (
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <p style={{ color: '#6EE7B7', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ What you did well</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {evaluation.feedback.strengths.map((s, i) => (
                    <li key={i} style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {evaluation.feedback?.weaknesses?.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <p style={{ color: '#FCA5A5', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚠️ What you missed or could improve</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {evaluation.feedback.weaknesses.map((w, i) => (
                    <li key={i} style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Concepts */}
            {evaluation.feedback?.missingConcepts?.length > 0 && (
              <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <p style={{ color: '#FCD34D', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 Key concepts to include</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {evaluation.feedback.missingConcepts.map((c, i) => (
                    <span key={i} style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#FCD34D', fontSize: 12 }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Model Answer */}
            {evaluation.feedback?.sampleAnswer && (
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <p style={{ color: '#A5B4FC', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📖 Model Answer</p>
                <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{evaluation.feedback.sampleAnswer}</p>
              </div>
            )}

            <button
              id="next-question-btn"
              className="btn-primary"
              onClick={handleNext}
              disabled={completing}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
            >
              {completing ? 'Completing...' : isLastQuestion ? '🎉 Complete Interview' : <>Next Question <ChevronRight size={16} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// Step 3: Results
// ─────────────────────────────────────────────

const ResultsView = ({ interviewId, results }) => {
  const navigate = useNavigate();
  const scores = results?.overallScores || {};
  const summary = results?.summary;

  const getReadinessColor = (level) => {
    const map = { 'Ready': '#10B981', 'Almost Ready': '#6366F1', 'Needs Practice': '#F59E0B', 'Significant Work Needed': '#EF4444' };
    return map[level] || '#64748B';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}
    >
      <div style={{ marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
        >
          <CheckCircle size={40} color="white" />
        </motion.div>
        <h1 style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
          Interview <span className="gradient-text">Completed!</span>
        </h1>
        <p style={{ color: '#64748B' }}>Your performance analysis based on actual answers</p>
      </div>

      {/* Overall Score */}
      <div className="glass-card-static" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ fontSize: 72, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: scores.overall >= 70 ? '#10B981' : scores.overall >= 50 ? '#F59E0B' : '#EF4444', marginBottom: 8 }}>
          {scores.overall || 0}
        </div>
        <p style={{ color: '#64748B', marginBottom: 24 }}>Overall Score (out of 100)</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, textAlign: 'left' }}>
          {[
            { label: 'Communication', value: scores.communication },
            { label: 'Technical Accuracy', value: scores.technicalAccuracy },
            { label: 'Relevance', value: scores.confidence }, // stored as confidence for compat
            { label: 'Completeness', value: scores.grammar }, // stored as grammar for compat
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94A3B8', fontSize: 13 }}>{label}</span>
                <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{value || 0}%</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${value || 0}%` }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 20, textAlign: 'left' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>AI Assessment</h3>
          <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{summary.executiveSummary}</p>
          {summary.readinessLevel && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: `${getReadinessColor(summary.readinessLevel)}15`, border: `1px solid ${getReadinessColor(summary.readinessLevel)}30` }}>
              <span style={{ color: getReadinessColor(summary.readinessLevel), fontWeight: 700, fontSize: 13 }}>{summary.readinessLevel}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={() => navigate(`/dashboard/report/${interviewId}`)} className="btn-primary" style={{ padding: '13px 28px' }}>
          <BarChart3 size={16} /> View Full Report
        </button>
        <button onClick={() => window.location.reload()} className="btn-secondary" style={{ padding: '13px 28px' }}>
          <Play size={16} /> New Interview
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main Interview Module
// ─────────────────────────────────────────────

const InterviewPage = () => {
  const [step, setStep] = useState('setup');
  const [interviewData, setInterviewData] = useState(null);
  const [inputMethod, setInputMethod] = useState('text');
  const [results, setResults] = useState(null);
  const [completedId, setCompletedId] = useState(null);

  const handleStart = (interview, method) => {
    setInterviewData(interview);
    setInputMethod(method);
    setStep('session');
  };

  const handleComplete = (id, data) => {
    setCompletedId(id);
    setResults(data);
    setStep('results');
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 'setup' && <SetupStep key="setup" onStart={handleStart} />}
        {step === 'session' && (
          <InterviewSession key="session" interview={interviewData} inputMethod={inputMethod} onComplete={handleComplete} />
        )}
        {step === 'results' && (
          <ResultsView key="results" interviewId={completedId} results={results} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;
