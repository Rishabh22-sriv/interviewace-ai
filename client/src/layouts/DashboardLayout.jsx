import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="lg:ml-[240px]"
      >
        {/* Top Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(10, 15, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8,
              padding: 8,
              color: '#A5B4FC',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            className="lg:hidden"
          >
            <Menu size={18} />
          </button>

          {/* Search bar */}
          <div
            style={{
              flex: 1,
              maxWidth: 400,
              position: 'relative',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#475569',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: 8,
                padding: '8px 12px 8px 36px',
                color: '#94A3B8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 8,
                padding: 8,
                color: '#64748B',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 6,
                  height: 6,
                  background: '#7C3AED',
                  borderRadius: '50%',
                }}
              />
            </button>

            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                border: '2px solid rgba(99,102,241,0.3)',
              }}
            >
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '32px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
