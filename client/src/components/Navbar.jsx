import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Zap, ChevronRight, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? '12px 0' : '20px 0', background: scrolled ? 'rgba(5, 11, 24, 0.94)' : 'transparent', backdropFilter: scrolled ? 'blur(28px)' : 'none', borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.1)' : 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <div className="container-custom">
        <div className="between-flex">

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.5)', flexShrink: 0 }}>
              <Zap size={19} color="white" fill="white" />
            </motion.div>
            <span style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              InterviewAce AI
            </span>
          </Link>

          {/* Desktop Nav — only on landing page */}
          {isLanding && (
            <div style={{ display: 'none', alignItems: 'center', gap: 2 }} className="hidden md:flex">
              {navLinks.map(({ href, label }) => (
                <button key={href} onClick={() => scrollTo(href)}
                  style={{ padding: '8px 14px', background: 'transparent', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 9, transition: 'all 0.2s', fontFamily: 'Inter' }}
                  onMouseEnter={(e) => { e.target.style.color = '#F1F5F9'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent'; }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Auth Actions */}
          <div style={{ display: 'none', alignItems: 'center', gap: 10 }} className="hidden md:flex">
            {isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                </div>
                <Link to="/dashboard" className="btn-primary" style={{ padding: '9px 18px', fontSize: 14 }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#64748B', fontSize: 14, fontWeight: 500, padding: '9px 16px', borderRadius: 9, transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#F1F5F9')}
                  onMouseLeave={(e) => (e.target.style.color = '#64748B')}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, padding: '8px 10px', color: '#A78BFA', cursor: 'pointer', display: 'flex' }}
            className="md:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(99,102,241,0.1)', marginTop: 16, paddingTop: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
                {isLanding && navLinks.map(({ href, label }) => (
                  <button key={href} onClick={() => scrollTo(href)}
                    style={{ textAlign: 'left', padding: '12px 16px', background: 'transparent', border: 'none', color: '#64748B', fontSize: 15, fontWeight: 500, borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>Sign In</Link>
                    <Link to="/signup" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>Get Started Free</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
