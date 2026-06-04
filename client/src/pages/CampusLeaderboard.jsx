import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, TrendingUp, TrendingDown, Minus,
  Code2, Brain, Briefcase, Filter, ChevronDown,
  Flame, Star, Zap, Award, Users, BarChart2,
  Search, Crown
} from 'lucide-react';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lb-root {
    min-height: 100vh;
    background: #050B18;
    font-family: 'Inter', sans-serif;
    color: #E2E8F0;
    padding: 24px;
    overflow-x: hidden;
  }

  .glass {
    background: rgba(13,22,39,0.85);
    border: 1px solid rgba(124,58,237,0.18);
    border-radius: 16px;
    backdrop-filter: blur(18px);
  }

  .glass-light {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    backdrop-filter: blur(12px);
  }

  .lb-header { max-width: 1200px; margin: 0 auto 32px; }

  .lb-title {
    font-size: 2.4rem;
    font-weight: 800;
    background: linear-gradient(135deg, #7C3AED, #06B6D4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lb-subtitle { color: #94A3B8; margin-top: 6px; font-size: 0.95rem; }

  .stats-row {
    display: flex;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto 28px;
    flex-wrap: wrap;
  }

  .stat-card {
    flex: 1;
    min-width: 140px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .stat-num { font-size: 1.5rem; font-weight: 800; }
  .stat-label { font-size: 0.78rem; color: #64748B; margin-top: 2px; }

  .filters-bar {
    max-width: 1200px;
    margin: 0 auto 28px;
    padding: 18px 24px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(124,58,237,0.25);
    border-radius: 10px;
    color: #E2E8F0;
    padding: 8px 14px;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }
  .filter-select:hover { border-color: #7C3AED; }

  .filter-label {
    font-size: 0.8rem;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tabs-row {
    max-width: 1200px;
    margin: 0 auto 28px;
    display: flex;
    gap: 6px;
    background: rgba(13,22,39,0.6);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 6px;
    width: fit-content;
  }

  .tab-btn {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #64748B;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #7C3AED, #5B21B6);
    color: #fff;
    box-shadow: 0 4px 15px rgba(124,58,237,0.35);
  }

  /* Podium */
  .podium-section {
    max-width: 1200px;
    margin: 0 auto 32px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .podium-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #94A3B8;
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
  }

  .podium-container {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    justify-content: center;
    width: 100%;
    height: 260px;
  }

  .podium-place {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .podium-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.2rem;
    color: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  .podium-name { font-size: 0.85rem; font-weight: 600; text-align: center; max-width: 100px; }
  .podium-college { font-size: 0.72rem; color: #64748B; text-align: center; max-width: 100px; }
  .podium-score { font-size: 0.9rem; font-weight: 700; }

  .podium-block {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 12px 0 0;
    width: 120px;
    font-size: 2rem;
    position: relative;
  }

  .podium-rank-label {
    position: absolute;
    top: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
  }

  /* Table */
  .table-section {
    max-width: 1200px;
    margin: 0 auto 24px;
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: 60px 1fr 180px 120px 100px 120px 100px 80px;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .table-row {
    display: grid;
    grid-template-columns: 60px 1fr 180px 120px 100px 120px 100px 80px;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    align-items: center;
    transition: background 0.2s;
  }

  .table-row:hover { background: rgba(124,58,237,0.06); }
  .table-row.my-rank {
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.35);
    border-radius: 10px;
    margin: 4px 8px;
  }

  .rank-cell {
    font-size: 1rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rank-num {
    color: #64748B;
    font-size: 0.9rem;
  }

  .player-cell { display: flex; align-items: center; gap: 12px; }

  .player-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .player-name { font-size: 0.9rem; font-weight: 600; }
  .player-you { font-size: 0.7rem; color: #7C3AED; font-weight: 600; }

  .cell-text { font-size: 0.82rem; color: #94A3B8; }
  .cell-score { font-size: 0.95rem; font-weight: 700; }
  .cell-xp { font-size: 0.82rem; color: #06B6D4; font-weight: 600; }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .change-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .change-up { color: #10B981; }
  .change-down { color: #EF4444; }
  .change-same { color: #64748B; }

  /* Your rank sticky */
  .your-rank-banner {
    max-width: 1200px;
    margin: 0 auto 32px;
    padding: 20px 24px;
    border: 1px solid rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .your-rank-label {
    font-size: 0.85rem;
    color: #7C3AED;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .your-rank-num {
    font-size: 2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #7C3AED, #06B6D4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .your-rank-info { flex: 1; }
  .your-rank-detail { font-size: 0.82rem; color: #64748B; margin-top: 2px; }

  @media (max-width: 900px) {
    .table-header, .table-row {
      grid-template-columns: 50px 1fr 120px 80px 80px;
    }
    .table-header > *:nth-child(4),
    .table-header > *:nth-child(5),
    .table-header > *:nth-child(7),
    .table-header > *:nth-child(8),
    .table-row > *:nth-child(4),
    .table-row > *:nth-child(5),
    .table-row > *:nth-child(7),
    .table-row > *:nth-child(8) { display: none; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const avatarColors = [
  'linear-gradient(135deg,#7C3AED,#4F46E5)',
  'linear-gradient(135deg,#06B6D4,#0891B2)',
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
  'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  'linear-gradient(135deg,#EC4899,#DB2777)',
  'linear-gradient(135deg,#14B8A6,#0D9488)',
  'linear-gradient(135deg,#F97316,#EA580C)',
  'linear-gradient(135deg,#6366F1,#4F46E5)',
];

const allStudents = [
  { id:1,  name:'Arjun Mehta',    college:'IIT Bombay',      branch:'CSE', year:4, pts:2840, dsaSolved:1182, interviewScore:98, readiness:99, badge:'🏆 Top Performer', badgeColor:'rgba(251,191,36,0.15)', badgeText:'#FBBF24', xp:14200, change:2 },
  { id:2,  name:'Priya Sharma',   college:'IIT Delhi',       branch:'CSE', year:3, pts:2710, dsaSolved:1095, interviewScore:95, readiness:97, badge:'🔥 Streak 45',     badgeColor:'rgba(249,115,22,0.15)', badgeText:'#F97316', xp:13550, change:-1 },
  { id:3,  name:'Rohit Kumar',    college:'NIT Trichy',      branch:'CSE', year:4, pts:2650, dsaSolved:1040, interviewScore:93, readiness:95, badge:'⚡ Rising Star',   badgeColor:'rgba(6,182,212,0.15)',  badgeText:'#06B6D4', xp:13250, change:1 },
  { id:4,  name:'Sneha Patel',    college:'IIT Madras',      branch:'CSE', year:4, pts:2590, dsaSolved:986,  interviewScore:91, readiness:94, badge:'⭐ Expert',       badgeColor:'rgba(124,58,237,0.15)', badgeText:'#7C3AED', xp:12950, change:0 },
  { id:5,  name:'Vikram Singh',   college:'BITS Pilani',     branch:'CSE', year:3, pts:2510, dsaSolved:940,  interviewScore:89, readiness:92, badge:'🎯 Focused',      badgeColor:'rgba(16,185,129,0.15)', badgeText:'#10B981', xp:12550, change:3 },
  { id:6,  name:'Ananya Rao',     college:'IIT Kharagpur',   branch:'IT',  year:4, pts:2460, dsaSolved:902,  interviewScore:87, readiness:90, badge:'💡 Creative',     badgeColor:'rgba(6,182,212,0.15)',  badgeText:'#06B6D4', xp:12300, change:-2 },
  { id:7,  name:'Karan Gupta',    college:'IIIT Hyderabad',  branch:'CSE', year:3, pts:2380, dsaSolved:860,  interviewScore:85, readiness:88, badge:'🚀 Grinder',      badgeColor:'rgba(239,68,68,0.15)',  badgeText:'#EF4444', xp:11900, change:1 },
  { id:8,  name:'Divya Nair',     college:'IIT Bombay',      branch:'IT',  year:4, pts:2310, dsaSolved:820,  interviewScore:83, readiness:86, badge:'⭐ Expert',       badgeColor:'rgba(124,58,237,0.15)', badgeText:'#7C3AED', xp:11550, change:-1 },
  { id:9,  name:'Aditya Joshi',   college:'NIT Warangal',    branch:'CSE', year:4, pts:2250, dsaSolved:782,  interviewScore:81, readiness:84, badge:'🔥 Streak 30',    badgeColor:'rgba(249,115,22,0.15)', badgeText:'#F97316', xp:11250, change:0 },
  { id:10, name:'Meera Iyer',     college:'IIT Roorkee',     branch:'CSE', year:3, pts:2190, dsaSolved:748,  interviewScore:79, readiness:82, badge:'💪 Consistent',   badgeColor:'rgba(16,185,129,0.15)', badgeText:'#10B981', xp:10950, change:2 },
  { id:11, name:'Rahul Verma',    college:'VIT Vellore',     branch:'CSE', year:4, pts:2120, dsaSolved:710,  interviewScore:77, readiness:80, badge:'📈 Improving',    badgeColor:'rgba(6,182,212,0.15)',  badgeText:'#06B6D4', xp:10600, change:-3 },
  { id:12, name:'Pooja Menon',    college:'IIT Guwahati',    branch:'CSE', year:4, pts:2060, dsaSolved:672,  interviewScore:75, readiness:78, badge:'🎯 Focused',      badgeColor:'rgba(16,185,129,0.15)', badgeText:'#10B981', xp:10300, change:1 },
  { id:13, name:'Suresh Reddy',   college:'BITS Goa',        branch:'CSE', year:3, pts:1990, dsaSolved:634,  interviewScore:73, readiness:76, badge:'⚡ Rising Star',   badgeColor:'rgba(6,182,212,0.15)',  badgeText:'#06B6D4', xp:9950,  change:0 },
  { id:14, name:'Kavita Kapoor',  college:'IIT Delhi',       branch:'ECE', year:4, pts:1930, dsaSolved:598,  interviewScore:71, readiness:74, badge:'💡 Creative',     badgeColor:'rgba(139,92,246,0.15)', badgeText:'#8B5CF6', xp:9650,  change:-1 },
  { id:15, name:'You (Rishi)',    college:'IIIT Bangalore',  branch:'CSE', year:3, pts:1870, dsaSolved:562,  interviewScore:69, readiness:72, badge:'🚀 Grinder',      badgeColor:'rgba(124,58,237,0.15)', badgeText:'#7C3AED', xp:9350,  change:4,  isMe: true },
  { id:16, name:'Nikhil Sharma',  college:'NIT Surathkal',   branch:'CSE', year:4, pts:1810, dsaSolved:528,  interviewScore:67, readiness:70, badge:'📈 Improving',    badgeColor:'rgba(6,182,212,0.15)',  badgeText:'#06B6D4', xp:9050,  change:-2 },
  { id:17, name:'Swati Gupta',    college:'IIT Bombay',      branch:'CSE', year:2, pts:1750, dsaSolved:494,  interviewScore:65, readiness:68, badge:'🌟 Prodigy',      badgeColor:'rgba(251,191,36,0.15)', badgeText:'#FBBF24', xp:8750,  change:5 },
  { id:18, name:'Aman Tiwari',    college:'DTU Delhi',       branch:'CSE', year:4, pts:1690, dsaSolved:460,  interviewScore:63, readiness:66, badge:'💪 Consistent',   badgeColor:'rgba(16,185,129,0.15)', badgeText:'#10B981', xp:8450,  change:0 },
  { id:19, name:'Riya Shah',      college:'IIT Madras',      branch:'IT',  year:3, pts:1620, dsaSolved:426,  interviewScore:61, readiness:64, badge:'⭐ Active',       badgeColor:'rgba(124,58,237,0.15)', badgeText:'#7C3AED', xp:8100,  change:-1 },
  { id:20, name:'Dev Patel',      college:'IIIT Delhi',      branch:'CSE', year:4, pts:1560, dsaSolved:500,  interviewScore:59, readiness:62, badge:'🎯 Focused',      badgeColor:'rgba(16,185,129,0.15)', badgeText:'#10B981', xp:7800,  change:2 },
];

const getMedalEmoji = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const podiumColors = {
  1: { bg: 'linear-gradient(180deg,#F59E0B22,#F59E0B08)', border: '#F59E0B', height: 140, ring: '#FBBF24' },
  2: { bg: 'linear-gradient(180deg,#94A3B822,#94A3B808)', border: '#94A3B8', height: 110, ring: '#CBD5E1' },
  3: { bg: 'linear-gradient(180deg,#CD7C2422,#CD7C2408)', border: '#CD7C24', height: 90, ring: '#D97706' },
};

const tabConfig = [
  { id: 'coding',    label: 'Coding Rank',    icon: Code2,    color: '#7C3AED' },
  { id: 'interview', label: 'Interview Rank',  icon: Brain,    color: '#06B6D4' },
  { id: 'placement', label: 'Placement Rank',  icon: Briefcase,color: '#10B981' },
];

const getScore = (student, tab) => {
  if (tab === 'coding')    return `${student.dsaSolved} solved`;
  if (tab === 'interview') return `${student.interviewScore}/100`;
  if (tab === 'placement') return `${student.readiness}%`;
  return student.pts;
};

const getScoreNum = (student, tab) => {
  if (tab === 'coding')    return student.dsaSolved;
  if (tab === 'interview') return student.interviewScore;
  if (tab === 'placement') return student.readiness;
  return student.pts;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CampusLeaderboard() {
  const [activeTab, setActiveTab] = useState('coding');
  const [filters, setFilters] = useState({ college: 'All', branch: 'All', year: 'All', period: 'All Time' });

  const sorted = useMemo(() => {
    let list = [...allStudents];
    if (filters.branch !== 'All') list = list.filter(s => s.branch === filters.branch);
    if (filters.year !== 'All')   list = list.filter(s => s.year === parseInt(filters.year));
    return list.sort((a, b) => getScoreNum(b, activeTab) - getScoreNum(a, activeTab));
  }, [activeTab, filters]);

  const top3 = sorted.slice(0, 3);
  const me = sorted.find(s => s.isMe);
  const myRank = sorted.findIndex(s => s.isMe) + 1;

  const getInitials = (name) => {
    if (name.startsWith('You')) return 'ME';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lb-root">

        {/* Header */}
        <motion.div
          className="lb-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#7C3AED,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Trophy size={24} color="#fff" />
            </div>
            <div>
              <h1 className="lb-title">Campus Leaderboard</h1>
              <p className="lb-subtitle">Track your rank among the best engineering students nationwide</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label:'Total Students', value:'48,290', icon: Users,    color:'#7C3AED', bg:'rgba(124,58,237,0.15)' },
            { label:'Colleges Listed', value:'312',   icon: Award,    color:'#06B6D4', bg:'rgba(6,182,212,0.15)'  },
            { label:'Top Scorers',     value:'1,200', icon: Crown,    color:'#F59E0B', bg:'rgba(245,158,11,0.15)' },
            { label:'Avg XP Earned',   value:'6,840', icon: BarChart2,color:'#10B981', bg:'rgba(16,185,129,0.15)' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="glass stat-card"
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          className="glass filters-bar"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.2 }}
        >
          <span className="filter-label"><Filter size={14} /> Filters:</span>
          {[
            { key:'branch', label:'Branch', options:['All','CSE','IT','ECE','Others'] },
            { key:'year',   label:'Year',   options:['All','1','2','3','4'] },
            { key:'period', label:'Period', options:['All Time','Monthly','Weekly'] },
          ].map(f => (
            <div key={f.key} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <select
                className="filter-select"
                value={filters[f.key]}
                onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
              >
                {f.options.map(o => <option key={o} value={o}>{f.label !== 'Year' ? o : o === 'All' ? 'All Years' : `Year ${o}`}</option>)}
              </select>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="tabs-row">
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        {top3.length >= 3 && (
          <motion.div
            className="glass podium-section"
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3 }}
          >
            <div className="podium-title">
              <Crown size={18} color="#F59E0B" />
              Top 3 Podium
            </div>

            <div className="podium-container">
              {[1, 0, 2].map((idx, pos) => {
                const rank = idx + 1;
                const student = top3[idx];
                const pc = podiumColors[rank];
                const heights = [110, 140, 90];
                const blockH = heights[pos];

                return (
                  <motion.div
                    key={rank}
                    className="podium-place"
                    initial={{ opacity:0, y:40 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: 0.4 + pos * 0.15, type:'spring', stiffness:80 }}
                  >
                    {rank === 1 && (
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 8, 0] }}
                        transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}
                        style={{ fontSize:'1.8rem', marginBottom:'-4px' }}
                      >
                        👑
                      </motion.div>
                    )}

                    <div
                      className="podium-avatar"
                      style={{
                        background: avatarColors[idx % avatarColors.length],
                        width: rank === 1 ? '72px' : '60px',
                        height: rank === 1 ? '72px' : '60px',
                        fontSize: rank === 1 ? '1.3rem' : '1rem',
                        border: `3px solid ${pc.ring}`,
                        boxShadow: `0 0 20px ${pc.ring}55`,
                      }}
                    >
                      {getInitials(student.name)}
                    </div>

                    <div>
                      <div className="podium-name">{student.name}</div>
                      <div className="podium-college">{student.college}</div>
                      <div className="podium-score" style={{ color: pc.border, textAlign:'center' }}>
                        {getScore(student, activeTab)}
                      </div>
                    </div>

                    <motion.div
                      className="podium-block"
                      style={{
                        height: `${blockH}px`,
                        background: pc.bg,
                        border: `1px solid ${pc.border}44`,
                        boxShadow: `0 -4px 20px ${pc.border}22`,
                      }}
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + pos * 0.15, duration: 0.6, ease:'easeOut' }}
                    >
                      <span className="podium-rank-label">{getMedalEmoji(rank)} #{rank}</span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Your Rank Banner */}
        {me && (
          <motion.div
            className="your-rank-banner"
            initial={{ opacity:0, scale:0.97 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.5 }}
          >
            <div style={{ textAlign:'center' }}>
              <div className="your-rank-label"><Star size={14} /> Your Rank</div>
              <div className="your-rank-num">#{myRank}</div>
            </div>
            <div style={{ width:'1px', height:'48px', background:'rgba(124,58,237,0.3)' }} />
            <div className="your-rank-info">
              <div style={{ fontWeight:700, fontSize:'1rem' }}>{me.name}</div>
              <div className="your-rank-detail">{me.college} · {me.branch} · Year {me.year}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'0.75rem', color:'#64748B' }}>Score</div>
              <div style={{ fontSize:'1.4rem', fontWeight:800, color:'#7C3AED' }}>{getScore(me, activeTab)}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'0.75rem', color:'#64748B' }}>XP</div>
              <div style={{ fontSize:'1.2rem', fontWeight:700, color:'#06B6D4' }}>{me.xp.toLocaleString()}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'0.75rem', color:'#64748B' }}>Change</div>
              <div className={`change-cell ${me.change > 0 ? 'change-up' : me.change < 0 ? 'change-down' : 'change-same'}`} style={{ justifyContent:'center', fontSize:'1rem' }}>
                {me.change > 0 ? <TrendingUp size={16}/> : me.change < 0 ? <TrendingDown size={16}/> : <Minus size={16}/>}
                {me.change !== 0 ? Math.abs(me.change) : '—'}
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="glass table-section"
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }}
            transition={{ duration:0.3 }}
          >
            <div className="table-header">
              <div>Rank</div>
              <div>Student</div>
              <div>College</div>
              <div>Branch/Yr</div>
              <div>Score</div>
              <div>Badge</div>
              <div>XP</div>
              <div>Change</div>
            </div>

            {sorted.map((student, i) => {
              const rank = i + 1;
              const medal = getMedalEmoji(rank);
              return (
                <motion.div
                  key={student.id}
                  className={`table-row ${student.isMe ? 'my-rank' : ''}`}
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.6), duration:0.3 }}
                >
                  {/* Rank */}
                  <div className="rank-cell">
                    {medal ? (
                      <span style={{ fontSize:'1.3rem' }}>{medal}</span>
                    ) : (
                      <span className="rank-num">#{rank}</span>
                    )}
                  </div>

                  {/* Player */}
                  <div className="player-cell">
                    <div
                      className="player-avatar"
                      style={{ background: avatarColors[i % avatarColors.length] }}
                    >
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <div className="player-name">{student.name}</div>
                      {student.isMe && <div className="player-you">That's you!</div>}
                    </div>
                  </div>

                  {/* College */}
                  <div className="cell-text" style={{ fontSize:'0.8rem' }}>{student.college}</div>

                  {/* Branch/Year */}
                  <div className="cell-text">{student.branch} · Y{student.year}</div>

                  {/* Score */}
                  <div className="cell-score" style={{ color: activeTab === 'coding' ? '#7C3AED' : activeTab === 'interview' ? '#06B6D4' : '#10B981' }}>
                    {getScore(student, activeTab)}
                  </div>

                  {/* Badge */}
                  <div>
                    <span
                      className="badge-pill"
                      style={{ background: student.badgeColor, color: student.badgeText, border: `1px solid ${student.badgeText}44` }}
                    >
                      {student.badge}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="cell-xp">{student.xp.toLocaleString()} XP</div>

                  {/* Change */}
                  <div className={`change-cell ${student.change > 0 ? 'change-up' : student.change < 0 ? 'change-down' : 'change-same'}`}>
                    {student.change > 0 ? <TrendingUp size={14}/> : student.change < 0 ? <TrendingDown size={14}/> : <Minus size={14}/>}
                    {student.change !== 0 ? Math.abs(student.change) : '—'}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div style={{ height: 40 }} />
      </div>
    </>
  );
}
