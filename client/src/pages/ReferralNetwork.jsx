import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Star,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  X,
  Send,
  Award,
  GitBranch,
  Zap,
  UserCheck,
  Plus,
  Filter,
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  MapPin,
  Link2,
  FileText,
  MessageSquare,
} from 'lucide-react';

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#050B18',
  glass: 'rgba(13,22,39,0.80)',
  glassBorder: 'rgba(124,58,237,0.18)',
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  cyan: '#06B6D4',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  blue: '#3B82F6',
  textPrimary: '#F1F5FF',
  textSecondary: '#94A3B8',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REFERRERS = [
  {
    id: 1,
    name: 'Amit Sharma',
    anonymous: false,
    company: 'Google',
    role: 'SDE III',
    xp: 450,
    spots: 3,
    avatar: 'AS',
    avatarColor: 'from-purple-500 to-cyan-500',
    tags: ['Backend', 'System Design', 'DSA'],
  },
  {
    id: 2,
    name: 'Preethi Kumar',
    anonymous: false,
    company: 'Amazon',
    role: 'SDE II',
    xp: 380,
    spots: 2,
    avatar: 'PK',
    avatarColor: 'from-cyan-500 to-blue-500',
    tags: ['Frontend', 'React', 'AWS'],
  },
  {
    id: 3,
    name: 'Rahul Verma',
    anonymous: false,
    company: 'Microsoft',
    role: 'SWE',
    xp: 290,
    spots: 1,
    avatar: 'RV',
    avatarColor: 'from-green-500 to-cyan-500',
    tags: ['Cloud', 'Azure', 'C#'],
  },
  {
    id: 4,
    name: 'Anonymous',
    anonymous: true,
    company: 'Flipkart',
    role: 'SDE',
    xp: 220,
    spots: 2,
    avatar: '??',
    avatarColor: 'from-yellow-500 to-orange-500',
    tags: ['E-Commerce', 'Java', 'Microservices'],
  },
  {
    id: 5,
    name: 'Neha Joshi',
    anonymous: false,
    company: 'Zomato',
    role: 'Backend Engineer',
    xp: 310,
    spots: 4,
    avatar: 'NJ',
    avatarColor: 'from-red-500 to-pink-500',
    tags: ['Node.js', 'MongoDB', 'Redis'],
  },
  {
    id: 6,
    name: 'Aryan Gupta',
    anonymous: false,
    company: 'Swiggy',
    role: 'SDE II',
    xp: 180,
    spots: 1,
    avatar: 'AG',
    avatarColor: 'from-orange-500 to-yellow-500',
    tags: ['Golang', 'Kafka', 'gRPC'],
  },
  {
    id: 7,
    name: 'Anonymous',
    anonymous: true,
    company: 'Paytm',
    role: 'ML Engineer',
    xp: 260,
    spots: 2,
    avatar: '??',
    avatarColor: 'from-blue-500 to-purple-500',
    tags: ['ML', 'Python', 'PyTorch'],
  },
  {
    id: 8,
    name: 'Kavya Reddy',
    anonymous: false,
    company: 'Infosys',
    role: 'Tech Lead',
    xp: 150,
    spots: 5,
    avatar: 'KR',
    avatarColor: 'from-teal-500 to-green-500',
    tags: ['Leadership', 'Java', 'Spring Boot'],
  },
];

const MY_REQUESTED = [
  { id: 1, company: 'Google', role: 'SDE III', referrer: 'Amit Sharma', status: 'Pending', date: 'Jun 1, 2026' },
  { id: 2, company: 'Amazon', role: 'SDE II', referrer: 'Preethi Kumar', status: 'Accepted', date: 'May 28, 2026' },
  { id: 3, company: 'Microsoft', role: 'SWE', referrer: 'Rahul Verma', status: 'Referred', date: 'May 20, 2026' },
];

const MY_OFFERED = [
  { id: 1, company: 'Flipkart', role: 'SDE', candidate: 'Rohan Mehta', status: 'Hired', date: 'Apr 15, 2026' },
  { id: 2, company: 'Swiggy', role: 'SDE II', candidate: 'Sneha Patel', status: 'Pending', date: 'Jun 2, 2026' },
];

const COMPANIES = ['All', 'Google', 'Amazon', 'Microsoft', 'Flipkart', 'Zomato', 'Swiggy', 'Paytm', 'Infosys'];
const ROLES = ['All', 'SDE', 'SDE II', 'SDE III', 'SWE', 'Backend Engineer', 'ML Engineer', 'Tech Lead'];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  icon: Clock,        label: 'Pending' },
  Accepted: { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)',  icon: CheckCircle2, label: 'Accepted' },
  Referred: { color: '#7C3AED', bg: 'rgba(124,58,237,0.15)', icon: BadgeCheck,   label: 'Referred' },
  Hired:    { color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: Award,        label: 'Hired 🎉' },
  Rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)',  icon: XCircle,      label: 'Rejected' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 12px',
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 12,
        fontWeight: 600,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

// ─── XP Bar ───────────────────────────────────────────────────────────────────
function XPBar({ xp }) {
  const max = 500;
  const pct = Math.min((xp / max) * 100, 100);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.textSecondary }}>Trust Score</span>
        <span style={{ fontSize: 11, color: C.purpleLight, fontWeight: 700 }}>{xp} XP</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(124,58,237,0.15)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{
            height: '100%',
            borderRadius: 99,
            background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hover = true, ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: `0 20px 60px rgba(124,58,237,0.18)` } : {}}
      style={{
        background: C.glass,
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 20,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ─── Referrer Card ────────────────────────────────────────────────────────────
function ReferrerCard({ referrer, onRequest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6, boxShadow: `0 24px 64px rgba(124,58,237,0.22)` }}
      style={{
        background: C.glass,
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 20,
        backdropFilter: 'blur(20px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: `linear-gradient(135deg, ${referrer.anonymous ? '#374151' : C.purple}, ${referrer.anonymous ? '#4B5563' : C.cyan})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff',
          flexShrink: 0, boxShadow: `0 8px 24px rgba(124,58,237,0.3)`,
        }}>
          {referrer.anonymous ? <Shield size={22} color="#9CA3AF" /> : referrer.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            {referrer.anonymous ? 'Anonymous' : referrer.name}
            {!referrer.anonymous && <BadgeCheck size={14} color={C.cyan} />}
          </div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>
            {referrer.role} @ <span style={{ color: C.purpleLight, fontWeight: 600 }}>{referrer.company}</span>
          </div>
        </div>
        <div style={{
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 10, padding: '4px 10px',
          fontSize: 12, color: C.green, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Zap size={11} />
          {referrer.spots} spot{referrer.spots > 1 ? 's' : ''}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {referrer.tags.map(tag => (
          <span key={tag} style={{
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 8, padding: '3px 10px', fontSize: 11,
            color: C.purpleLight, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      {/* XP */}
      <XPBar xp={referrer.xp} />

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onRequest(referrer)}
        style={{
          background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
          border: 'none', borderRadius: 12, padding: '11px 0',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: `0 8px 24px rgba(124,58,237,0.35)`,
        }}
      >
        <Send size={14} /> Request Referral
      </motion.button>
    </motion.div>
  );
}

// ─── Request Modal ────────────────────────────────────────────────────────────
function RequestModal({ referrer, onClose }) {
  const [form, setForm] = useState({ resume: '', linkedin: '', why: '', role: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(5,11,24,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          background: 'rgba(13,22,39,0.98)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 24, padding: 32,
          width: '100%', maxWidth: 520,
          boxShadow: '0 40px 120px rgba(124,58,237,0.3)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'rgba(255,255,255,0.07)', border: 'none',
            borderRadius: 10, width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: C.textSecondary,
          }}
        ><X size={16} /></button>

        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 56, marginBottom: 16 }}
            >🚀</motion.div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginBottom: 8 }}>Request Sent!</div>
            <div style={{ color: C.textSecondary, fontSize: 14 }}>
              Your referral request has been sent to{' '}
              <span style={{ color: C.purpleLight }}>{referrer.anonymous ? 'Anonymous' : referrer.name}</span>.
            </div>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 6 }}>
                Request Referral
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary }}>
                Requesting from <span style={{ color: C.purpleLight, fontWeight: 600 }}>
                  {referrer.anonymous ? 'Anonymous' : referrer.name}
                </span> · {referrer.role} @ {referrer.company}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'role', label: 'Role Applying For', placeholder: 'e.g. SDE II, Backend Engineer', icon: Briefcase },
                { key: 'resume', label: 'Resume Link', placeholder: 'https://drive.google.com/...', icon: FileText },
                { key: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/...', icon: Link2 },
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                    <Icon size={12} /> {label}
                  </label>
                  <input
                    required
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12,
                      padding: '11px 14px', color: C.textPrimary, fontSize: 14,
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <MessageSquare size={12} /> Why do you want this referral?
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.why}
                  onChange={e => setForm(p => ({ ...p, why: e.target.value }))}
                  placeholder="Briefly explain why you're a great fit and why you want to join this company..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12,
                    padding: '11px 14px', color: C.textPrimary, fontSize: 14,
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                  border: 'none', borderRadius: 13, padding: '13px 0',
                  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 10px 30px rgba(124,58,237,0.4)`, marginTop: 4,
                }}
              >
                <Send size={15} /> Send Request
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Tab: Find Referrals ──────────────────────────────────────────────────────
function FindReferrals() {
  const [company, setCompany] = useState('All');
  const [role, setRole] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = REFERRERS.filter(r =>
    (company === 'All' || r.company === company) &&
    (role === 'All' || r.role === role) &&
    (search === '' || r.company.toLowerCase().includes(search.toLowerCase()) || r.role.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Filters */}
      <GlassCard style={{ padding: '20px 24px', marginBottom: 24 }} hover={false}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.textSecondary }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, company, role..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12,
                padding: '10px 14px 10px 40px', color: C.textPrimary, fontSize: 14,
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>
          {[
            { label: 'Company', value: company, setter: setCompany, options: COMPANIES },
            { label: 'Role', value: role, setter: setRole, options: ROLES },
          ].map(({ label, value, setter, options }) => (
            <div key={label} style={{ position: 'relative', flex: '1 1 140px' }}>
              <Filter size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textSecondary, pointerEvents: 'none' }} />
              <select
                value={value}
                onChange={e => setter(e.target.value)}
                style={{
                  appearance: 'none', width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12,
                  padding: '10px 36px 10px 34px', color: C.textPrimary, fontSize: 14,
                  outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {options.map(o => <option key={o} value={o} style={{ background: '#0D1627' }}>{o === 'All' ? `All ${label}s` : o}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.textSecondary, pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Count */}
      <div style={{ marginBottom: 18, color: C.textSecondary, fontSize: 13, fontWeight: 500 }}>
        Showing <span style={{ color: C.purpleLight, fontWeight: 700 }}>{filtered.length}</span> referrer{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <ReferrerCard referrer={r} onRequest={setSelected} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: C.textSecondary }}>
            <Search size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>No referrers found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <RequestModal referrer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Tab: Offer Referrals ─────────────────────────────────────────────────────
function OfferReferrals() {
  const [form, setForm] = useState({
    company: '', roles: '', requirements: '', conditions: '', spots: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ company: '', roles: '', requirements: '', conditions: '', spots: '' });
    }, 2500);
  };

  const fields = [
    { key: 'company', label: 'Your Company', placeholder: 'e.g. Google, Amazon, Microsoft...', icon: Building2, type: 'input' },
    { key: 'roles', label: 'Open Roles', placeholder: 'e.g. SDE II, Backend Engineer, ML Engineer...', icon: Briefcase, type: 'input' },
    { key: 'requirements', label: 'Requirements', placeholder: 'e.g. 2+ years experience, strong DSA, system design...', icon: CheckCircle2, type: 'textarea' },
    { key: 'conditions', label: 'Conditions / Notes', placeholder: 'e.g. Only for candidates with 7+ CGPA, no notices...', icon: MessageSquare, type: 'textarea' },
    { key: 'spots', label: 'Available Spots', placeholder: 'e.g. 3', icon: UserCheck, type: 'input' },
  ];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <GlassCard style={{ padding: 36 }} hover={false}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 12px 32px rgba(124,58,237,0.4)`,
          }}>
            <GitBranch size={26} color="#fff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginBottom: 6 }}>Offer a Referral</div>
          <div style={{ fontSize: 13, color: C.textSecondary }}>Help someone land their dream job. List your referral spots.</div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.green, marginBottom: 8 }}>Referral Listed!</div>
              <div style={{ fontSize: 13, color: C.textSecondary }}>Candidates can now discover and request referrals from you.</div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                    <Icon size={12} color={C.purpleLight} /> {label}
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      required
                      rows={3}
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(124,58,237,0.22)', borderRadius: 12,
                        padding: '11px 14px', color: C.textPrimary, fontSize: 14,
                        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : (
                    <input
                      required
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(124,58,237,0.22)', borderRadius: 12,
                        padding: '11px 14px', color: C.textPrimary, fontSize: 14,
                        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  )}
                </div>
              ))}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                  border: 'none', borderRadius: 13, padding: '14px 0',
                  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 10px 30px rgba(124,58,237,0.35)`, marginTop: 6,
                }}
              >
                <Plus size={16} /> List My Referral Spots
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

// ─── Tab: My Referrals ────────────────────────────────────────────────────────
function MyReferrals() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Requested */}
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowRight size={17} color={C.cyan} /> Referrals I Requested
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MY_REQUESTED.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 4 }}
              style={{
                background: C.glass, border: `1px solid ${C.glassBorder}`,
                borderRadius: 16, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: `linear-gradient(135deg, ${C.purple}55, ${C.cyan}33)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Building2 size={18} color={C.purpleLight} />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>{r.company}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
                  {r.role} · Via <span style={{ color: C.purpleLight }}>{r.referrer}</span> · {r.date}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Offered */}
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch size={17} color={C.green} /> Referrals I Offered
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MY_OFFERED.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              whileHover={{ x: 4 }}
              style={{
                background: C.glass, border: `1px solid ${C.glassBorder}`,
                borderRadius: 16, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: `linear-gradient(135deg, ${C.green}33, ${C.cyan}22)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <UserCheck size={18} color={C.green} />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>{r.company} — {r.role}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
                  Candidate: <span style={{ color: C.cyan }}>{r.candidate}</span> · {r.date}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, boxShadow: `0 20px 60px ${color}28` }}
      style={{
        background: C.glass, border: `1px solid ${C.glassBorder}`,
        borderRadius: 20, padding: '24px 28px',
        backdropFilter: 'blur(20px)', flex: '1 1 160px',
        display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary }}>{value}</div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReferralNetwork() {
  const [tab, setTab] = useState('find');

  const tabs = [
    { key: 'find',   label: 'Find Referrals',  icon: Search },
    { key: 'offer',  label: 'Offer Referrals', icon: Plus },
    { key: 'mine',   label: 'My Referrals',    icon: UserCheck },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.textPrimary,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: '0 0 80px',
    }}>
      {/* Ambient background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '55%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '50%', height: '50%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 12px 36px rgba(124,58,237,0.45)`,
            }}>
              <GitBranch size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, letterSpacing: '-0.5px',
                background: `linear-gradient(135deg, ${C.textPrimary}, ${C.purpleLight})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Referral Network
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSecondary }}>
                Connect with insiders. Fast-track your applications. Land your dream role.
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ marginLeft: 'auto' }}
            >
              <Sparkles size={28} color={C.purpleLight} />
            </motion.div>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatCard icon={Users}    value="1,284" label="Active Referrers"     color={C.purple} delay={0.1} />
          <StatCard icon={TrendingUp} value="486"  label="Successful Referrals" color={C.cyan}   delay={0.18} />
          <StatCard icon={Building2} value="89"    label="Companies Covered"    color={C.green}  delay={0.26} />
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'rgba(13,22,39,0.7)', borderRadius: 16, padding: 6, border: `1px solid ${C.glassBorder}`, width: 'fit-content' }}>
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <motion.button
                key={key}
                onClick={() => setTab(key)}
                whileHover={{ scale: active ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: active ? `linear-gradient(135deg, ${C.purple}, ${C.cyan}99)` : 'transparent',
                  border: active ? 'none' : '1px solid transparent',
                  borderRadius: 12, padding: '10px 20px',
                  color: active ? '#fff' : C.textSecondary,
                  fontWeight: active ? 700 : 500, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7,
                  boxShadow: active ? `0 6px 20px rgba(124,58,237,0.35)` : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                <Icon size={14} /> {label}
              </motion.button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'find'  && <FindReferrals />}
            {tab === 'offer' && <OfferReferrals />}
            {tab === 'mine'  && <MyReferrals />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
