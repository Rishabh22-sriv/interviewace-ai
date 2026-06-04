import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, FileText, BarChart3, Clock, User, Settings,
  Code2, BookOpen, Brain, Target, Map, Lightbulb, Building2, Users, Briefcase,
  Bell, X, LogOut, ChevronDown, ChevronRight, Zap, Star, ListChecks,
  TrendingUp, IndianRupee, Video, Mic, Search, Gift, Trophy, Database,
  HeartHandshake, GitMerge, Cpu, Activity, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { to: '/dashboard/interview', icon: MessageSquare, label: 'AI Interviews' },
      { to: '/dashboard/resume', icon: FileText, label: 'Resume Analyzer' },
      { to: '/dashboard/resume-builder', icon: ListChecks, label: 'Resume Builder' },
      { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/dashboard/history', icon: Clock, label: 'Interview History' },
    ],
  },
  {
    label: 'PRACTICE',
    items: [
      { to: '/dashboard/dsa', icon: Code2, label: 'DSA Hub' },
      { to: '/dashboard/coding', icon: Cpu, label: 'Coding Practice' },
      { to: '/dashboard/study', icon: BookOpen, label: 'Study Assistant' },
    ],
  },
  {
    label: 'CAREER TOOLS',
    items: [
      { to: '/dashboard/placement', icon: Target, label: 'Placement Tracker' },
      { to: '/dashboard/roadmap', icon: Map, label: 'Career Roadmap' },
      { to: '/dashboard/projects', icon: Lightbulb, label: 'Project Ideas' },
      { to: '/dashboard/companies', icon: Building2, label: 'Company Hub' },
    ],
  },
  {
    label: 'AI PREDICTORS',
    items: [
      { to: '/dashboard/placement-predictor', icon: Brain, label: 'Placement Predictor', badge: 'AI' },
      { to: '/dashboard/skill-gap', icon: Activity, label: 'Skill Gap Analysis', badge: 'AI' },
      { to: '/dashboard/salary-predictor', icon: IndianRupee, label: 'Salary Predictor', badge: 'AI' },
    ],
  },
  {
    label: 'ADVANCED',
    items: [
      { to: '/dashboard/video-interview', icon: Video, label: 'Video Interview AI', badge: '🔥' },
      { to: '/dashboard/gd-simulator', icon: Mic, label: 'GD Simulator' },
    ],
  },
  {
    label: 'EXPLORE',
    items: [
      { to: '/dashboard/community', icon: Users, label: 'Community' },
      { to: '/dashboard/jobs', icon: Briefcase, label: 'Jobs & Internships' },
      { to: '/dashboard/interview-experiences', icon: Database, label: 'Interview DB' },
      { to: '/dashboard/mentorship', icon: HeartHandshake, label: 'Mentorship' },
      { to: '/dashboard/referrals', icon: GitMerge, label: 'Referral Network' },
      { to: '/dashboard/leaderboard', icon: Trophy, label: 'Campus Board' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { to: '/dashboard/profile', icon: User, label: 'Profile' },
      { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (label) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div style={{
      width: 240,
      height: '100vh',
      background: 'rgba(5, 11, 24, 0.98)',
      borderRight: '1px solid rgba(99, 102, 241, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(99,102,241,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
              <Zap size={18} style={{ color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 18, background: 'linear-gradient(135deg,#A78BFA,#67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterviewAce</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, display: 'none' }} className="lg:hidden">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(99,102,241,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(99,102,241,0.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.1)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</p>
            <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>Student</p>
          </div>
          <Star size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => {
          const isCollapsed = collapsedGroups[group.label];
          return (
            <div key={group.label} style={{ marginBottom: 6 }}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '5px 8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 4 }}
              >
                <span style={{ color: '#334155', fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{group.label}</span>
                {isCollapsed ? <ChevronRight size={12} style={{ color: '#334155' }} /> : <ChevronDown size={12} style={{ color: '#334155' }} />}
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          padding: '8px 10px',
                          borderRadius: 10,
                          marginBottom: 2,
                          textDecoration: 'none',
                          background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                          border: isActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                          color: isActive ? '#C4B5FD' : '#64748B',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: 13,
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        })}
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon size={15} style={{ flexShrink: 0, color: isActive ? '#A78BFA' : '#475569' }} />
                            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                            {item.badge && (
                              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 10, background: item.badge === '🔥' ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.15)', color: item.badge === '🔥' ? '#EF4444' : '#A78BFA', border: `1px solid ${item.badge === '🔥' ? 'rgba(239,68,68,0.25)' : 'rgba(124,58,237,0.25)'}`, flexShrink: 0 }}>
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <motion.div layoutId="activeNav" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: '60%', background: 'linear-gradient(180deg,#7C3AED,#6366F1)', borderRadius: '0 2px 2px 0' }} />
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(99,102,241,0.08)', flexShrink: 0 }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.05)', color: '#94A3B8', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FCA5A5'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}>
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, width: 240 }} className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49, backdropFilter: 'blur(4px)' }} className="lg:hidden" />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, width: 240 }} className="lg:hidden">
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
