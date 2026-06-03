import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import toast from 'react-hot-toast';
import { Bell, Moon, Trash2, Shield, AlertTriangle, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
  >
    {enabled
      ? <ToggleRight size={32} style={{ color: '#7C3AED' }} />
      : <ToggleLeft size={32} style={{ color: '#475569' }} />
    }
  </button>
);

const SettingRow = ({ icon: Icon, title, description, control, color = '#64748B' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(99,102,241,0.07)', gap: 16 }}>
    <div style={{ display: 'flex', gap: 14, flex: 1 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{title}</p>
        <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>{description}</p>
      </div>
    </div>
    {control}
  </div>
);

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return toast.error('Please type DELETE to confirm');
    setDeletingAccount(true);
    try {
      await userService.deleteAccount();
      await logout();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
          <span className="gradient-text">Settings</span>
        </h1>
        <p style={{ color: '#64748B' }}>Manage your preferences and account settings</p>
      </div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>Preferences</h3>
        <SettingRow
          icon={Bell}
          title="Push Notifications"
          description="Receive alerts for interview reminders and tips"
          color="#7C3AED"
          control={<Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />}
        />
        <SettingRow
          icon={Bell}
          title="Email Updates"
          description="Receive weekly performance summaries via email"
          color="#06B6D4"
          control={<Toggle enabled={emailUpdates} onToggle={() => setEmailUpdates(!emailUpdates)} />}
        />
        <SettingRow
          icon={Moon}
          title="Dark Mode"
          description="Dark mode is always active for the best experience"
          color="#8B5CF6"
          control={<span className="badge badge-purple">Always On</span>}
        />
      </motion.div>

      {/* Privacy & Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>Privacy & Security</h3>
        <SettingRow
          icon={Shield}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          color="#10B981"
          control={
            <button className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 4 }}>
              Enable <ChevronRight size={14} />
            </button>
          }
        />
        <SettingRow
          icon={Shield}
          title="Data Export"
          description="Download all your interview data and reports"
          color="#F59E0B"
          control={
            <button className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 4 }}>
              Export <ChevronRight size={14} />
            </button>
          }
        />
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: 24,
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#FCA5A5', fontFamily: 'Outfit, sans-serif' }}>
          ⚠️ Danger Zone
        </h3>
        <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 20 }}>
          These actions are permanent and cannot be undone
        </p>
        <button
          id="delete-account-btn"
          onClick={() => setShowDeleteModal(true)}
          className="btn-danger"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Trash2 size={16} /> Delete My Account
        </button>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={28} style={{ color: '#EF4444' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>Delete Account</h3>
              <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7 }}>
                This will permanently delete your account, all interviews, resume analyses, and data. <strong>This cannot be undone.</strong>
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Type <strong>DELETE</strong> to confirm</label>
              <input
                className="input-field"
                placeholder="DELETE"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                style={{ borderColor: 'rgba(239,68,68,0.3)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deletingAccount}
                style={{
                  flex: 1,
                  background: deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.9)' : 'rgba(239,68,68,0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px',
                  fontWeight: 600,
                  cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {deletingAccount ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
