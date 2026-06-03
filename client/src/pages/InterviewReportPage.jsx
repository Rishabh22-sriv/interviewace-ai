import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewService } from '../services';
import { ArrowLeft, BarChart3, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Clock, Award } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewReportPage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(0);

  useEffect(() => {
    interviewService.getReport(id)
      .then(res => setInterview(res.data.interview))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <LoadingSpinner size="lg" text="Loading report..." />
    </div>
  );

  if (!interview) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ color: '#64748B' }}>Interview not found</p>
      <Link to="/dashboard/history" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>
        <ArrowLeft size={16} /> Back to History
      </Link>
    </div>
  );

  const getColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#6366F1' : s >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <Link to="/dashboard/history" style={{ color: '#64748B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>
            Interview Report
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-purple">{interview.type.replace(/-/g, ' ')}</span>
            <span className="badge badge-green">{interview.difficulty}</span>
            <span style={{ color: '#64748B', fontSize: 13 }}>
              {new Date(interview.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static"
        style={{ padding: 28, marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Award size={20} style={{ color: '#7C3AED' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Overall Performance</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center' }}>
          {/* Big Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: getColor(interview.overallScores?.overall || 0), lineHeight: 1 }}>
              {interview.overallScores?.overall || 0}
            </div>
            <p style={{ color: '#64748B', fontSize: 13 }}>Overall Score</p>
          </div>

          {/* Score Bars */}
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Communication', value: interview.overallScores?.communication },
              { label: 'Technical Accuracy', value: interview.overallScores?.technicalAccuracy },
              { label: 'Confidence', value: interview.overallScores?.confidence },
              { label: 'Grammar', value: interview.overallScores?.grammar },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#94A3B8', fontSize: 13 }}>{label}</span>
                  <span style={{ color: getColor(value || 0), fontWeight: 700, fontSize: 14 }}>{value || 0}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${value || 0}%` }}
                    style={{ background: getColor(value || 0), boxShadow: `0 0 10px ${getColor(value || 0)}60` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Questions', value: interview.totalQuestions },
          { label: 'Answered', value: interview.questions?.filter(q => q.isEvaluated).length || 0 },
          { label: 'Duration', value: interview.duration ? `${Math.round(interview.duration / 60)}m` : 'N/A' },
          { label: 'Input Method', value: interview.inputMethod || 'text', style: { textTransform: 'capitalize' } },
        ].map(({ label, value, style }) => (
          <div key={label} className="glass-card-static" style={{ padding: 16, textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: 12, marginBottom: 4 }}>{label}</p>
            <p style={{ color: '#F8FAFC', fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0, ...style }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Question by Question */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={18} style={{ color: '#7C3AED' }} /> Question Breakdown
        </h2>

        {interview.questions?.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-static"
            style={{ marginBottom: 12, overflow: 'hidden' }}
          >
            {/* Question Header */}
            <button
              onClick={() => setExpandedQ(expandedQ === i ? -1 : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: q.isEvaluated ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {q.isEvaluated ? (
                  <CheckCircle size={15} style={{ color: '#10B981' }} />
                ) : (
                  <AlertCircle size={15} style={{ color: '#6366F1' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{q.question}</p>
              </div>
              {q.isEvaluated && (
                <span style={{ color: getColor(q.scores?.overall || 0), fontWeight: 800, fontSize: 16, flexShrink: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {q.scores?.overall || 0}%
                </span>
              )}
              {expandedQ === i ? <ChevronUp size={16} style={{ color: '#64748B', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: '#64748B', flexShrink: 0 }} />}
            </button>

            {/* Expanded Content */}
            {expandedQ === i && q.isEvaluated && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                style={{ borderTop: '1px solid rgba(99,102,241,0.1)', padding: '20px 20px 20px' }}
              >
                {/* Answer */}
                {q.answer && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: '#6366F1', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>YOUR ANSWER</p>
                    <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, background: 'rgba(15,23,42,0.4)', padding: '12px 14px', borderRadius: 8, margin: 0 }}>
                      {q.answer}
                    </p>
                  </div>
                )}

                {/* Scores */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Communication', value: q.scores?.communication },
                    { label: 'Technical', value: q.scores?.technicalAccuracy },
                    { label: 'Confidence', value: q.scores?.confidence },
                    { label: 'Grammar', value: q.scores?.grammar },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(15,23,42,0.4)', borderRadius: 8 }}>
                      <p style={{ color: '#64748B', fontSize: 10, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                      <p style={{ color: getColor(value || 0), fontWeight: 800, fontSize: 18, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{value || 0}</p>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                {q.feedback?.strengths?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ color: '#10B981', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>✅ Strengths</p>
                    {q.feedback.strengths.map((s, j) => (
                      <p key={j} style={{ color: '#94A3B8', fontSize: 13, margin: '0 0 4px' }}>• {s}</p>
                    ))}
                  </div>
                )}
                {q.feedback?.improvements?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 Improvements</p>
                    {q.feedback.improvements.map((imp, j) => (
                      <p key={j} style={{ color: '#94A3B8', fontSize: 13, margin: '0 0 4px' }}>• {imp}</p>
                    ))}
                  </div>
                )}
                {q.feedback?.sampleAnswer && (
                  <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: 14 }}>
                    <p style={{ color: '#A5B4FC', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📝 Model Answer</p>
                    <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{q.feedback.sampleAnswer}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewReportPage;
