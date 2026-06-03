import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Zap, ArrowRight, User, Mail, Lock,
  Check, Shield, Rocket, Brain, BarChart3, Mic, Star
} from 'lucide-react';

const perks = [
  { icon: Brain, text: '5 AI interview types', desc: 'HR, Technical, Behavioral & more' },
  { icon: Mic, text: 'Voice interview mode', desc: 'Speak your answers naturally' },
  { icon: BarChart3, text: 'Performance tracking', desc: 'Radar, area & line charts' },
  { icon: Shield, text: 'Completely free to start', desc: 'No credit card required' },
];

const SignupPanel = () => (
  <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(124,58,237,0.12) 100%)', borderRight: '1px solid rgba(99,102,241,0.12)', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(124,58,237,0.5)' }}>
          <Zap size={20} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterviewAce AI</span>
      </Link>

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Rocket size={11} style={{ color: '#10B981' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Free Forever Plan Available</span>
        </div>
      </div>

      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        Start Practicing.<br />
        <span className="gradient-text">Start Winning.</span>
      </h2>
      <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.75, marginBottom: 44, maxWidth: 400 }}>
        Join 50,000+ students preparing smarter with AI-powered mock interviews, instant feedback, and resume analysis.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 44 }}>
        {perks.map(({ icon: Icon, text, desc }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color: '#67E8F9' }} />
            </div>
            <div>
              <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 14, margin: 0 }}>{text}</p>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>{desc}</p>
            </div>
            <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={10} style={{ color: '#10B981' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial snippet */}
      <div style={{ padding: '18px 22px', background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 16 }}>
        <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
        </div>
        <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 10px' }}>
          "The resume analyzer gave me a 92/100 ATS score. My profile now gets 3x more recruiter responses!"
        </p>
        <p style={{ color: '#475569', fontSize: 12, margin: 0, fontWeight: 600 }}>— Anjali Patel, Data Scientist at Microsoft</p>
      </div>
    </div>
  </div>
);

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, touchedFields }, watch } = useForm({ mode: 'onChange' });
  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Welcome to InterviewAce AI! 🎉 Your journey starts now.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!passwordValue) return { label: '', color: 'transparent', width: '0%' };
    if (passwordValue.length < 6) return { label: 'Weak', color: '#EF4444', width: '25%' };
    if (passwordValue.length < 8 || !/[A-Z]/.test(passwordValue)) return { label: 'Fair', color: '#F59E0B', width: '50%' };
    if (!/[0-9]/.test(passwordValue) && !/[^a-zA-Z0-9]/.test(passwordValue)) return { label: 'Good', color: '#06B6D4', width: '75%' };
    return { label: 'Strong', color: '#10B981', width: '100%' };
  };
  const strength = passwordStrength();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#050B18', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07), transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <style>{`@media (min-width: 1024px) { .signup-panel-wrapper { display: flex !important; } }`}</style>
      <div className="signup-panel-wrapper" style={{ display: 'none', flex: 1, maxWidth: 560 }}>
        <SignupPanel />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
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
            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>Create your account</h1>
            <p style={{ color: '#64748B', fontSize: 14 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: '#A78BFA', fontWeight: 600 }}>Sign in →</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input id="signup-name" className="input-field" style={{ paddingLeft: 42 }} placeholder="John Doe"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
                {touchedFields.name && !errors.name && (
                  <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} style={{ color: '#10B981' }} />
                  </div>
                )}
              </div>
              {errors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input id="signup-email" type="email" className="input-field" style={{ paddingLeft: 42 }} placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
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
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 42, paddingRight: 44 }} placeholder="Minimum 8 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength bar */}
              {passwordValue && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, background: 'rgba(99,102,241,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} transition={{ duration: 0.4 }}
                      style={{ height: '100%', background: strength.color, borderRadius: 100 }} />
                  </div>
                  <p style={{ color: strength.color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>Password strength: {strength.label}</p>
                </div>
              )}
              {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" id="signup-submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, marginTop: 4 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Creating Account...
                </span>
              ) : (<>Create Free Account <ArrowRight size={17} /></>)}
            </button>

            <p style={{ color: '#334155', fontSize: 11, textAlign: 'center', lineHeight: 1.7 }}>
              By signing up, you agree to our{' '}
              <a href="#" style={{ color: '#A78BFA' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: '#A78BFA' }}>Privacy Policy</a>
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            <Shield size={12} style={{ color: '#334155' }} />
            <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>Free forever · No credit card · Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
