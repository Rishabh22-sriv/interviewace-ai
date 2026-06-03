import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await authService.resetPassword(token, data.password);
      if (result.data?.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired.');
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
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Lock size={26} style={{ color: '#7C3AED' }} />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>Reset Password</h1>
              <p style={{ color: '#64748B', fontSize: 14 }}>Create a strong new password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingLeft: 42, paddingRight: 44 }}
                    placeholder="Minimum 8 characters"
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingLeft: 42 }}
                    placeholder="Confirm new password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === watch('password') || 'Passwords do not match',
                    })}
                  />
                </div>
                {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {loading ? 'Resetting...' : <>Reset Password <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
