import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BarChart3,
  History,
  User,
  Settings,
  LogOut,
  Zap,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/interview', icon: MessageSquare, label: 'AI Interviews' },
  { to: '/dashboard/resume', icon: FileText, label: 'Resume Analyzer' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/history', icon: History, label: 'Interview History' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '8px 8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              flexShrink: 0,
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 15,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #A5B4FC, #67E8F9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            InterviewAce
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            display: 'none',
            padding: 4,
          }}
          className="lg:hidden"
          id="sidebar-close-btn"
        >
          <X size={18} />
        </button>
      </div>

      {/* User Info */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(99,102,241,0.05)',
          borderRadius: 12,
          marginBottom: 20,
          border: '1px solid rgba(99,102,241,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#F8FAFC', fontWeight: 600, fontSize: 13, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ color: '#64748B', fontSize: 11, margin: 0, textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 8px 8px', margin: 0 }}>
          Main Menu
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
                color: isActive ? '#A5B4FC' : '#64748B',
                background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.08))' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} style={{ color: isActive ? '#7C3AED' : '#475569', flexShrink: 0 }} />
                  {label}
                  {isActive && (
                    <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#6366F1' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div style={{ height: 1, background: 'rgba(99,102,241,0.1)', margin: '16px 8px' }} />
            <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 8px 8px', margin: 0 }}>
              Administration
            </p>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  color: isActive ? '#FDE68A' : '#64748B',
                  background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} style={{ color: isActive ? '#F59E0B' : '#475569', flexShrink: 0 }} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* Logout */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: 240,
          minHeight: '100vh',
          background: 'rgba(10, 15, 30, 0.98)',
          borderRight: '1px solid rgba(99, 102, 241, 0.1)',
          padding: '24px 12px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
        }}
        className="hidden lg:block"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 48,
              }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: 260,
                height: '100vh',
                background: 'rgba(10, 15, 30, 0.99)',
                borderRight: '1px solid rgba(99, 102, 241, 0.15)',
                padding: '24px 12px',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 49,
                overflowY: 'auto',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
