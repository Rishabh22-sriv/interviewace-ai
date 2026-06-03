import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Camera, Save, Award, MessageSquare, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });

  const { register: regPassword, handleSubmit: submitPassword, watch, reset: resetPassword, formState: { errors: passErrors } } = useForm();

  useEffect(() => {
    userService.getProfile().then(res => setStats(res.data.stats)).catch(() => {});
  }, []);

  const onUpdateProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(data);
      updateUser({ name: res.data.user.name, email: res.data.user.email });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onUpdatePassword = async (data) => {
    setSavingPassword(true);
    try {
      await userService.updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const onDropPhoto = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const res = await userService.uploadProfilePicture(formData);
      updateUser({ profilePicture: res.data.profilePicture });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload picture');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropPhoto,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
          My <span className="gradient-text">Profile</span>
        </h1>
        <p style={{ color: '#64748B' }}>Manage your account information and password</p>
      </div>

      {/* Profile Picture */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>Profile Picture</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            {...getRootProps()}
            style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
          >
            <input {...getInputProps()} id="profile-picture-input" />
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid rgba(99,102,241,0.3)', position: 'relative' }}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>{user?.name?.charAt(0)?.toUpperCase()}</span>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <Camera size={20} color="white" />
              </div>
            </div>
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              </div>
            )}
          </div>
          <div>
            <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 16, margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>{user?.name}</p>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 12px', textTransform: 'capitalize' }}>{user?.role}</p>
            <p style={{ color: '#475569', fontSize: 12 }}>Click photo to upload • JPG, PNG, WebP • Max 5MB</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
            {[
              { icon: MessageSquare, label: 'Interviews', value: stats.totalInterviews, color: '#7C3AED' },
              { icon: Award, label: 'Avg Score', value: `${stats.averageScore}%`, color: '#06B6D4' },
              { icon: TrendingUp, label: 'Resume ATS', value: `${stats.resumeScore}%`, color: '#10B981' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 8px', background: 'rgba(15,23,42,0.4)', borderRadius: 10 }}>
                <Icon size={18} style={{ color, margin: '0 auto 6px', display: 'block' }} />
                <p style={{ color: '#F8FAFC', fontWeight: 800, fontSize: 18, margin: '0 0 2px', fontFamily: 'Outfit, sans-serif' }}>{value}</p>
                <p style={{ color: '#64748B', fontSize: 11, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>Personal Information</h3>
        <form onSubmit={submitProfile(onUpdateProfile)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input className="input-field" style={{ paddingLeft: 42 }} {...regProfile('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
            </div>
            {profileErrors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{profileErrors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input type="email" className="input-field" style={{ paddingLeft: 42 }} {...regProfile('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            </div>
            {profileErrors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{profileErrors.email.message}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={savingProfile} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
            {savingProfile ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>Change Password</h3>
        <form onSubmit={submitPassword(onUpdatePassword)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input type="password" className="input-field" style={{ paddingLeft: 42 }} placeholder="Current password" {...regPassword('currentPassword', { required: 'Current password is required' })} />
            </div>
            {passErrors.currentPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="label">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input type="password" className="input-field" style={{ paddingLeft: 42 }} placeholder="Min 8 characters" {...regPassword('newPassword', { required: 'New password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            </div>
            {passErrors.newPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input type="password" className="input-field" style={{ paddingLeft: 42 }} placeholder="Confirm new password" {...regPassword('confirmPassword', { required: 'Please confirm password', validate: val => val === watch('newPassword') || 'Passwords do not match' })} />
            </div>
            {passErrors.confirmPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passErrors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="btn-secondary" disabled={savingPassword} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
            {savingPassword ? 'Updating...' : <><Lock size={16} /> Update Password</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
