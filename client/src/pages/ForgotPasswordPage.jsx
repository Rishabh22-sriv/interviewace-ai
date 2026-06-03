import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { authService } from '../services';
import toast from 'react-hot-toast';
import { Zap, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '40px 16px' }}>
      <AnimatedBackground opacity={0.6} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
                <Zap size={22} color="white" fill="white" />
              </div>
            </Link>
          </div>

          <div className="glass-card-static" style={{ padding: 40 }}>
            {!sent ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Mail size={26} style={{ color: '#7C3AED' }} />
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>Forgot Password?</h1>
                  <p style={{ color: '#64748B', fontSize: 14 }}>Enter your email and we'll send a reset link</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                      <input
                        id="forgot-email"
                        type="email"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                        placeholder="you@example.com"
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                      />
                    </div>
                    {errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                    {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={16} /></>}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle size={60} style={{ color: '#10B981', margin: '0 auto 16px', display: 'block' }} />
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 12 }}>Check Your Email</h2>
                <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>
                  We've sent a password reset link to your email. The link expires in 15 minutes.
                </p>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" style={{ color: '#64748B', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
