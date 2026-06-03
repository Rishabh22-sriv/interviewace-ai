import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService, interviewService } from '../services';
import {
  MessageSquare, FileText, BarChart3, TrendingUp, Plus,
  Clock, Award, Target, Zap, ArrowRight, Brain, Mic,
  Star, ChevronRight, Activity, Flame, Trophy, CheckCircle2,
  Sun, Moon, Coffee, Sunset
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';

/* ------------------------------------------------------------------ */
/* GREETING                                                             */
/* ------------------------------------------------------------------ */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: Sun, color: '#F59E0B' };
  if (h < 17) return { text: 'Good afternoon', icon: Coffee, color: '#06B6D4' };
  if (h < 20) return { text: 'Good evening', icon: Sunset, color: '#EC4899' };
  return { text: 'Good night', icon: Moon, color: '#A78BFA' };
};

/* ------------------------------------------------------------------ */
/* ANIMATED STAT CARD                                                   */
/* ------------------------------------------------------------------ */
const StatCard = ({ icon: Icon, title, value, change, color, gradient, delay }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', damping: 20 }}
    className="stat-card shimmer" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 110, height: 110, background: gradient, borderRadius: '0 0 0 100%', opacity: 0.4 }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} style={{ color }} />
      </div>
      {change !== undefined && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.2, type: 'spring' }}
          style={{ fontSize: 12, fontWeight: 700, color: change >= 0 ? '#10B981' : '#EF4444', background: change >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${change >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, padding: '3px 9px', borderRadius: 100 }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </motion.span>
      )}
    </div>
    <p style={{ color: '#475569', fontSize: 12, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
    <p style={{ color: '#F1F5F9', fontSize: 32, fontWeight: 900, fontFamily: 'Outfit', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* QUICK ACTION                                                         */
/* ------------------------------------------------------------------ */
const QuickAction = ({ to, icon: Icon, title, description, color, badge }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.97 }}
      style={{ padding: '16px 18px', background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>{title}</p>
        <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>{description}</p>
      </div>
      {badge && <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: 100 }}>{badge}</span>}
      <ChevronRight size={15} style={{ color: '#334155', flexShrink: 0 }} />
    </motion.div>
  </Link>
);

/* ------------------------------------------------------------------ */
/* CUSTOM TOOLTIP                                                       */
/* ------------------------------------------------------------------ */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0D1627', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ color: '#64748B', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 700, fontSize: 15, margin: 0, fontFamily: 'Outfit' }}>
            {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* TIPS                                                                 */
/* ------------------------------------------------------------------ */
const tips = [
  "Use the STAR method for behavioral questions: Situation, Task, Action, Result.",
  "In technical interviews, think out loud — interviewers want to hear your reasoning process.",
  "Quantify your achievements: 'reduced latency by 40%' beats 'improved performance'.",
  "Research the company before HR interviews. Show you understand their mission.",
  "For system design, always clarify requirements and scale before jumping to solutions.",
  "Practice answering in under 2 minutes — concise, structured answers score highest.",
];

/* ------------------------------------------------------------------ */
/* DASHBOARD PAGE                                                       */
/* ------------------------------------------------------------------ */
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex] = useState(() => Math.floor(Math.random() * tips.length));
  const greeting = getGreeting();
  const GreetIcon = greeting.icon;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, analyticsRes, historyRes] = await Promise.all([
          userService.getProfile(),
          userService.getAnalytics(),
          interviewService.getHistory({ limit: 5 }),
        ]);
        setStats(profileRes.data.stats);
        setAnalytics(analyticsRes.data.analytics);
        setRecentInterviews(historyRes.data.interviews || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#6366F1';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getTypeBadge = (type) => {
    const map = { hr: 'badge-purple', technical: 'badge-cyan', aptitude: 'badge-green', 'system-design': 'badge-yellow', behavioral: 'badge-red' };
    return map[type] || 'badge-purple';
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Welcome Banner ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ marginBottom: 32, padding: '28px 32px', background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <GreetIcon size={18} style={{ color: greeting.color }} />
            <p style={{ color: '#64748B', fontSize: 14, margin: 0, fontWeight: 500 }}>{greeting.text}</p>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 900, fontFamily: 'Outfit', marginBottom: 4, letterSpacing: '-0.02em' }}>
            {greeting.text}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}!</span> 👋
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/dashboard/interview" className="btn-primary" style={{ fontSize: 15 }}>
          <Plus size={17} /> Start Interview
        </Link>
      </motion.div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
          <StatCard icon={MessageSquare} title="Total Interviews" value={stats?.totalInterviews || 0} change={12} color="#7C3AED" gradient="linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.05))" delay={0.1} />
          <StatCard icon={Award} title="Average Score" value={`${stats?.averageScore || 0}%`} change={8} color="#06B6D4" gradient="linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.05))" delay={0.15} />
          <StatCard icon={FileText} title="Resume ATS Score" value={`${stats?.resumeScore || 0}%`} change={5} color="#10B981" gradient="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))" delay={0.2} />
          <StatCard icon={TrendingUp} title="Improvement" value={`+${stats?.improvementRate || 0}%`} color="#F59E0B" gradient="linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))" delay={0.25} />
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, marginBottom: 24 }} className="grid-cols-1 xl:grid-cols-[1fr_300px]">

        {/* Performance Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card-static" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 3, letterSpacing: '-0.02em' }}>Weekly Performance</h2>
              <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Your interview scores over the last 7 weeks</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100 }}>
              <Activity size={12} style={{ color: '#10B981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>Live</span>
            </div>
          </div>
          {analytics?.weeklyPerformance?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={analytics.weeklyPerformance}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" />
                <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#7C3AED" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#7C3AED', strokeWidth: 0, r: 4 }} activeDot={{ r: 7, fill: '#A78BFA', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={28} style={{ color: '#334155' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#475569', fontSize: 14, marginBottom: 12 }}>Complete interviews to see your performance chart</p>
                <Link to="/dashboard/interview" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: 13 }}>
                  <Plus size={14} /> Start First Interview
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 14, letterSpacing: '-0.01em' }}>Quick Start</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <QuickAction to="/dashboard/interview" icon={Brain} title="AI Mock Interview" description="Text-based practice session" color="#7C3AED" />
              <QuickAction to="/dashboard/interview?voice=true" icon={Mic} title="Voice Interview" description="Practice speaking your answers" color="#06B6D4" badge="NEW" />
              <QuickAction to="/dashboard/resume" icon={FileText} title="Resume Analyzer" description="Get ATS score & feedback" color="#10B981" />
              <QuickAction to="/dashboard/analytics" icon={BarChart3} title="Analytics" description="Track your progress" color="#F59E0B" />
            </div>
          </div>

          {/* AI Tip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ padding: 22, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.05))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent)', filter: 'blur(20px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={13} style={{ color: '#A78BFA' }} />
              </div>
              <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.5px' }}>AI TIP OF THE DAY</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.75, margin: 0, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
              "{tips[tipIndex]}"
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Recent Interviews ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card-static" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 3 }}>Recent Interviews</h2>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Your latest AI mock interview sessions</p>
          </div>
          <Link to="/dashboard/history" style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recentInterviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <MessageSquare size={32} style={{ color: '#334155' }} />
            </div>
            <p style={{ color: '#475569', marginBottom: 20, fontSize: 15 }}>No interviews yet. Start your first AI mock interview!</p>
            <Link to="/dashboard/interview" className="btn-primary" style={{ display: 'inline-flex' }}>
              <Plus size={16} /> Start Interview
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((interview, i) => (
                  <motion.tr key={interview._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <td>
                      <span className={`badge ${getTypeBadge(interview.type)}`}>
                        {interview.type.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: '#94A3B8', fontWeight: 500 }}>{interview.difficulty}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: getScoreColor(interview.overallScores?.overall || 0), fontFamily: 'Outfit', fontSize: 15 }}>
                          {interview.overallScores?.overall || 0}%
                        </span>
                        {interview.overallScores?.overall >= 80 && <Trophy size={13} style={{ color: '#F59E0B' }} />}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${interview.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>
                        {interview.status === 'completed' && <CheckCircle2 size={10} />}
                        {interview.status}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: 13 }}>
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/dashboard/report/${interview._id}`}
                        style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        View Report <ChevronRight size={12} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
