import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewService } from '../services';
import toast from 'react-hot-toast';
import {
  Brain, Mic, MessageSquare, Code, Target, Users,
  ChevronRight, Play, Settings, Zap, Clock, BarChart3,
  CheckCircle, Send, StopCircle, Volume2, VolumeX
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// ---- Step 1: Interview Setup ----
const interviewTypes = [
  { id: 'hr', label: 'HR Interview', description: 'Soft skills, culture fit, background', icon: Users, color: '#7C3AED', gradient: 'rgba(124,58,237,0.12)' },
  { id: 'technical', label: 'Technical', description: 'Coding, algorithms, data structures', icon: Code, color: '#06B6D4', gradient: 'rgba(6,182,212,0.12)' },
  { id: 'aptitude', label: 'Aptitude', description: 'Logical reasoning, problem solving', icon: Brain, color: '#10B981', gradient: 'rgba(16,185,129,0.12)' },
  { id: 'system-design', label: 'System Design', description: 'Architecture, scalability, design', icon: Settings, color: '#F59E0B', gradient: 'rgba(245,158,11,0.12)' },
  { id: 'behavioral', label: 'Behavioral', description: 'STAR method, situational questions', icon: MessageSquare, color: '#EC4899', gradient: 'rgba(236,72,153,0.12)' },
];

const SetupStep = ({ onStart }) => {
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState(5);
  const [topic, setTopic] = useState('');
  const [inputMethod, setInputMethod] = useState('text');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!type) return toast.error('Please select an interview type');
    setLoading(true);
    try {
      const res = await interviewService.start({ type, difficulty, totalQuestions: questions, topic });
      onStart(res.data.interview, inputMethod);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate interview. Check your API key.');
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
                onClick={() => setType(t.id)}
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
              </button>
            ))}
          </div>
        </div>

        {/* Options Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Difficulty */}
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} style={{ color: '#F59E0B' }} /> Difficulty
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${difficulty === d ? '#6366F1' : 'rgba(99,102,241,0.12)'}`,
                    background: difficulty === d ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: difficulty === d ? '#A5B4FC' : '#64748B',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d.charAt(0).toUpperCase() + d.slice(1)}
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

        {/* Topic */}
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Specific Topic <span style={{ color: '#475569', fontWeight: 400, fontSize: 13 }}>(optional)</span>
          </h3>
          <input
            className="input-field"
            placeholder="e.g., React.js, Machine Learning, Java, Leadership..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Start Button */}
        <button
          id="start-interview-btn"
          className="btn-primary"
          onClick={handleStart}
          disabled={loading || !type}
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
      </motion.div>
    </div>
  );
};

// ---- Voice Recorder Hook ----
const useVoiceRecorder = (onTranscript) => {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useState(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser. Please use Chrome.');
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
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      onTranscript(finalTranscript + interim);
    };

    recognition.start();
    recognitionRef[1](recognition);
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef[0]) {
      recognitionRef[0].stop();
      recognitionRef[1](null);
    }
    setRecording(false);
  };

  return { recording, startRecording, stopRecording };
};

// ---- Step 2: Interview Session ----
const InterviewSession = ({ interview, inputMethod, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());
  const [completing, setCompleting] = useState(false);

  const { recording, startRecording, stopRecording } = useVoiceRecorder((text) => setAnswer(text));

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;
  const progress = ((currentIndex) / interview.questions.length) * 100;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please provide an answer');
    setSubmitting(true);
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
      toast.error('Failed to evaluate answer. Please try again.');
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
    }
  };

  const getScoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#6366F1' : s >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#94A3B8', fontSize: 14 }}>Question {currentIndex + 1} of {interview.questions.length}</span>
          <span style={{ color: '#A5B4FC', fontSize: 14, fontWeight: 600 }}>{interview.type.replace(/-/g, ' ').toUpperCase()} • {interview.difficulty.toUpperCase()}</span>
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
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
          <div>
            <p style={{ color: '#A5B4FC', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>AI INTERVIEWER</p>
            <p style={{ color: '#E2E8F0', fontSize: 16, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{currentQuestion.question}</p>
          </div>
        </div>
      </motion.div>

      {/* Answer Area */}
      {!evaluation && (
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600, margin: 0 }}>Your Answer</p>
            {inputMethod === 'voice' && (
              <div style={{ display: 'flex', gap: 8 }}>
                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Mic size={14} /> Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="btn-danger"
                    style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <div className="recording-pulse" />
                    Stop Recording
                  </button>
                )}
              </div>
            )}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={inputMethod === 'voice' ? 'Your speech will appear here as you speak...' : 'Type your answer here. Be detailed and specific...'}
            className="input-field"
            style={{ minHeight: 140, resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}
          />

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
            </div>

            {/* Score Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Communication', key: 'communication' },
                { label: 'Technical Accuracy', key: 'technicalAccuracy' },
                { label: 'Confidence', key: 'confidence' },
                { label: 'Grammar', key: 'grammar' },
              ].map(({ label, key }) => {
                const score = evaluation.scores?.[key] || 0;
                return (
                  <div key={key} style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#94A3B8', fontSize: 12 }}>{label}</span>
                      <span style={{ color: getScoreColor(score), fontWeight: 700, fontSize: 14 }}>{score}</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        style={{ background: getScoreColor(score) }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {evaluation.feedback?.strengths?.length > 0 && (
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: 16 }}>
                  <p style={{ color: '#6EE7B7', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Strengths</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {evaluation.feedback.strengths.map((s, i) => (
                      <li key={i} style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {evaluation.feedback?.weaknesses?.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 16 }}>
                  <p style={{ color: '#FCA5A5', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚠️ Improvements</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {evaluation.feedback.weaknesses.map((w, i) => (
                      <li key={i} style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sample Answer */}
            {evaluation.feedback?.sampleAnswer && (
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <p style={{ color: '#A5B4FC', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 Model Answer</p>
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

// ---- Step 3: Results ----
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
        <p style={{ color: '#64748B' }}>Here's your AI-powered performance analysis</p>
      </div>

      {/* Overall Score */}
      <div className="glass-card-static" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ fontSize: 72, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: scores.overall >= 70 ? '#10B981' : scores.overall >= 50 ? '#F59E0B' : '#EF4444', marginBottom: 8 }}>
          {scores.overall || 0}
        </div>
        <p style={{ color: '#64748B', marginBottom: 24 }}>Overall Score</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, textAlign: 'left' }}>
          {[
            { label: 'Communication', value: scores.communication },
            { label: 'Technical Accuracy', value: scores.technicalAccuracy },
            { label: 'Confidence', value: scores.confidence },
            { label: 'Grammar', value: scores.grammar },
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

// ---- Main Interview Module ----
const InterviewPage = () => {
  const [step, setStep] = useState('setup'); // setup | session | results
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
