import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewService } from '../services';
import { History, Filter, Trash2, BarChart3, MessageSquare, ChevronRight, Search } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const InterviewHistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('all');

  const fetchInterviews = async (p = 1) => {
    setLoading(true);
    try {
      const res = await interviewService.getHistory({ page: p, limit: 10 });
      setInterviews(res.data.interviews || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error('Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInterviews(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this interview? This cannot be undone.')) return;
    try {
      await interviewService.delete(id);
      toast.success('Interview deleted');
      fetchInterviews(page);
    } catch {
      toast.error('Failed to delete interview');
    }
  };

  const filtered = filter === 'all' ? interviews : interviews.filter(i => i.type === filter || i.status === filter);

  const getScoreColor = (score) => score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444';
  const getTypeBadge = (type) => {
    const map = { hr: 'badge-purple', technical: 'badge-cyan', aptitude: 'badge-green', 'system-design': 'badge-yellow', behavioral: 'badge-red' };
    return map[type] || 'badge-purple';
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
            Interview <span className="gradient-text">History</span>
          </h1>
          <p style={{ color: '#64748B' }}>{pagination.total || 0} total interviews</p>
        </div>
        <Link to="/dashboard/interview" className="btn-primary" style={{ display: 'inline-flex', padding: '11px 22px' }}>
          + New Interview
        </Link>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'hr', 'technical', 'aptitude', 'system-design', 'behavioral', 'completed', 'in-progress'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              border: `1px solid ${filter === f ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`,
              background: filter === f ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: filter === f ? '#A5B4FC' : '#64748B',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {f.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Interview List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <LoadingSpinner size="lg" text="Loading interviews..." />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MessageSquare size={48} style={{ color: '#334155', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: '#64748B', fontSize: 16, marginBottom: 16 }}>No interviews found</p>
          <Link to="/dashboard/interview" className="btn-primary" style={{ display: 'inline-flex' }}>
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((interview, i) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card-static"
              style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
            >
              {/* Score Ring */}
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `conic-gradient(${getScoreColor(interview.overallScores?.overall || 0)} ${interview.overallScores?.overall || 0}%, rgba(99,102,241,0.1) 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                position: 'relative',
              }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: getScoreColor(interview.overallScores?.overall || 0) }}>
                    {interview.overallScores?.overall || 0}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span className={`badge ${getTypeBadge(interview.type)}`}>{interview.type.replace(/-/g, ' ')}</span>
                  <span className={`badge ${interview.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{interview.status}</span>
                  <span style={{ color: '#64748B', fontSize: 12, textTransform: 'capitalize' }}>• {interview.difficulty}</span>
                </div>
                <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
                  {interview.totalQuestions} questions • {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {interview.topic && interview.topic !== 'General' && ` • ${interview.topic}`}
                </p>
              </div>

              {/* Scores */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'Comm', value: interview.overallScores?.communication },
                  { label: 'Tech', value: interview.overallScores?.technicalAccuracy },
                  { label: 'Conf', value: interview.overallScores?.confidence },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <p style={{ color: '#64748B', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ color: getScoreColor(value || 0), fontWeight: 700, fontSize: 14, margin: 0 }}>{value || 0}%</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {interview.status === 'completed' && (
                  <Link
                    to={`/dashboard/report/${interview._id}`}
                    className="btn-ghost"
                    style={{ fontSize: 13, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <BarChart3 size={14} /> Report
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(interview._id)}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 8, borderRadius: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn-ghost"
            style={{ padding: '8px 16px' }}
          >
            Previous
          </button>
          <span style={{ padding: '8px 16px', color: '#94A3B8', fontSize: 14, display: 'flex', alignItems: 'center' }}>
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="btn-ghost"
            style={{ padding: '8px 16px' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewHistoryPage;
