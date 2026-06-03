import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Zap, ArrowRight, Mail, Lock,
  Brain, Mic, BarChart3, Shield, Check, Star, Bot
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* AUTH LAYOUT FEATURE PANEL                                            */
/* ------------------------------------------------------------------ */
const features = [
  { icon: Brain, text: 'AI Mock Interviews', desc: '5 interview types, 3 difficulty levels' },
  { icon: Mic, text: 'Voice Analysis', desc: 'Real-time speech evaluation' },
  { icon: BarChart3, text: 'Performance Analytics', desc: 'Detailed progress tracking' },
  { icon: Shield, text: 'Secure & Private', desc: 'End-to-end encrypted data' },
];

const stats = [
  { value: '50K+', label: 'Students' },
  { value: '94%', label: 'Success Rate' },
  { value: '4.9★', label: 'Rating' },
];

const AuthPanel = () => (
  <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)', borderRight: '1px solid rgba(99,102,241,0.12)', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    {/* Bg orbs */}
    <div style={{ position: 'absolute', top: -120, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(124,58,237,0.5)' }}>
          <Zap size={20} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterviewAce AI</span>
      </Link>

      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        Ace Every Interview<br />
        <span className="gradient-text">with AI Power</span>
      </h2>
      <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.75, marginBottom: 44, maxWidth: 400 }}>
        Practice mock interviews, analyze your resume, and get instant AI feedback — all in one platform.
      </p>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 48 }}>
        {features.map(({ icon: Icon, text, desc }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 14, margin: 0 }}>{text}</p>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>{desc}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={10} style={{ color: '#10B981' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 28, padding: '20px 24px', background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 16 }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Outfit', color: '#F1F5F9', margin: 0 }}>{value}</p>
            <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.16)', borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
        </div>
        <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
          "I got placed at Google within 3 months of using InterviewAce AI. The feedback was exactly what I needed."
        </p>
        <p style={{ color: '#475569', fontSize: 12, marginTop: 8, margin: '8px 0 0', fontWeight: 600 }}>— Priya Sharma, SDE at Google</p>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* LOGIN PAGE                                                           */
/* ------------------------------------------------------------------ */
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, touchedFields } } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      toast.success(`Welcome back, ${result.user.name}! 👋`);
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#050B18', position: 'relative', overflow: 'hidden' }}>
      {/* Aurora background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Feature Panel — hidden on mobile */}
      <div style={{ display: 'none' }} className="hidden lg:flex" >
        <AuthPanel />
      </div>
      <div style={{ flex: 1 }} className="lg:hidden" />

      {/* The feature panel (visible on large screens via CSS workaround) */}
      <style>{`@media (min-width: 1024px) { .auth-panel-wrapper { display: flex !important; } .auth-form-fill { flex: 1; } }`}</style>
      <div className="auth-panel-wrapper" style={{ display: 'none', flex: 1, maxWidth: 560 }}>
        <AuthPanel />
      </div>

      {/* Right — Form */}
      <div className="auth-form-fill" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="lg:hidden">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
                <Zap size={19} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterviewAce AI</span>
            </Link>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ color: '#64748B', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Create one free →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input id="login-email" type="email" className="input-field" style={{ paddingLeft: 42 }} placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
                {touchedFields.email && !errors.email && (
                  <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} style={{ color: '#10B981' }} />
                  </div>
                )}
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label className="label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ color: '#A78BFA', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input id="login-password" type={showPassword ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 42, paddingRight: 44 }} placeholder="Your password"
                  {...register('password', { required: 'Password is required' })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" id="login-submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, marginTop: 4 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Signing In...
                </span>
              ) : (<>Sign In <ArrowRight size={17} /></>)}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={15} style={{ color: '#A78BFA', flexShrink: 0 }} />
              <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
                <strong style={{ color: '#94A3B8' }}>New here?</strong> Register a free account to explore all AI interview features.
              </p>
            </div>
          </div>

          {/* Security badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            <Shield size={12} style={{ color: '#334155' }} />
            <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>Secured by JWT authentication · Data encrypted at rest</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
