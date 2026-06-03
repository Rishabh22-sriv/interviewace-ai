import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../services';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Activity, Target, Brain } from 'lucide-react';
import { SkeletonCard } from '../components/LoadingSpinner';

const COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600, fontSize: 13, margin: '2px 0' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAnalytics()
      .then(res => setAnalytics(res.data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div className="skeleton h-8 w-48 rounded mb-2" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={6} />)}
        </div>
      </div>
    );
  }

  const hasData = analytics?.totalInterviews > 0;

  // Build radar data from latest skills
  const latestSkills = analytics?.skillsGrowth?.[analytics.skillsGrowth.length - 1];
  const radarData = latestSkills ? [
    { subject: 'Communication', value: latestSkills.communication, fullMark: 100 },
    { subject: 'Technical', value: latestSkills.technical, fullMark: 100 },
    { subject: 'Confidence', value: latestSkills.confidence, fullMark: 100 },
    { subject: 'Grammar', value: latestSkills.grammar, fullMark: 100 },
  ] : [];

  const EmptyChart = ({ message }) => (
    <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <BarChart3 size={40} style={{ color: '#334155' }} />
      <p style={{ color: '#475569', fontSize: 14, textAlign: 'center' }}>{message}</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
          Performance <span className="gradient-text">Analytics</span>
        </h1>
        <p style={{ color: '#64748B' }}>
          {hasData
            ? `Tracking ${analytics.totalInterviews} interviews • Average score: ${analytics.averageScore}%`
            : 'Complete your first interview to see analytics'}
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Interviews', value: analytics?.totalInterviews || 0, icon: Activity, color: '#7C3AED' },
          { label: 'Average Score', value: `${analytics?.averageScore || 0}%`, icon: Target, color: '#06B6D4' },
          { label: 'Best Score', value: analytics?.skillsGrowth?.length > 0 ? `${Math.max(...analytics.skillsGrowth.map(s => s.communication))}%` : '0%', icon: TrendingUp, color: '#10B981' },
          { label: 'Skill Growth', value: analytics?.skillsGrowth?.length >= 2 ? `+${Math.max(0, analytics.skillsGrowth[analytics.skillsGrowth.length-1].communication - analytics.skillsGrowth[0].communication)}` : '0', icon: Brain, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p style={{ color: '#64748B', fontSize: 12, marginBottom: 4 }}>{label}</p>
            <p style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 20 }}>
        {/* Weekly Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>Weekly Performance</h3>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Overall interview scores per week</p>
          {hasData && analytics.weeklyPerformance?.some(w => w.score > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.weeklyPerformance}>
                <defs>
                  <linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#7C3AED" strokeWidth={2} fill="url(#wkGrad)" dot={{ fill: '#7C3AED', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyChart message="Complete interviews to see weekly performance" />}
        </motion.div>

        {/* Skills Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>Skills Overview</h3>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Your current skill levels</p>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(99,102,241,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Radar name="Skills" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <EmptyChart message="Skills radar will appear after your first interview" />}
        </motion.div>

        {/* Skill Growth Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>Skill Growth Over Time</h3>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Trends across all interviews</p>
          {analytics?.skillsGrowth?.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.skillsGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="interview" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="communication" name="Communication" stroke="#7C3AED" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="technical" name="Technical" stroke="#06B6D4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="grammar" name="Grammar" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyChart message="Complete 2+ interviews to see growth trends" />}
        </motion.div>

        {/* Interview Types Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>Interview Types</h3>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Distribution of interview categories</p>
          {analytics?.typeBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={analytics.typeBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {analytics.typeBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart message="Interview type distribution will appear here" />}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
