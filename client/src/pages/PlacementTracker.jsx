import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Edit2, Trash2, Search, LayoutGrid, List,
  Building2, MapPin, Calendar, DollarSign, ExternalLink,
  FileText, ChevronDown, TrendingUp, CheckCircle2, XCircle,
  Clock, Star, Filter, BarChart2, Award, Target, Briefcase
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

/* ------------------------------------------------------------------ */
/* CONSTANTS                                                            */
/* ------------------------------------------------------------------ */
const STATUSES = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const STATUS_CONFIG = {
  Applied:              { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', badgeClass: 'badge-cyan' },
  Shortlisted:          { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.28)', badgeClass: 'badge-yellow' },
  'Interview Scheduled':{ color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.28)', badgeClass: 'badge-purple' },
  Selected:             { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.28)', badgeClass: 'badge-green' },
  Rejected:             { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)',  badgeClass: 'badge-red' },
};

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#7C3AED', '#10B981', '#EF4444'];

const EMPTY_FORM = {
  company: '', role: '', package: '', location: '',
  applicationDate: '', interviewDate: '', status: 'Applied',
  notes: '', jobUrl: '',
};

const DEMO_DATA = [
  { id: 1, company: 'Google', role: 'SDE-II', package: '45 LPA', location: 'Bangalore', applicationDate: '2024-01-15', interviewDate: '2024-02-01', status: 'Interview Scheduled', notes: 'Leetcode prep ongoing', jobUrl: 'https://careers.google.com' },
  { id: 2, company: 'Microsoft', role: 'Software Engineer', package: '38 LPA', location: 'Hyderabad', applicationDate: '2024-01-10', interviewDate: '', status: 'Shortlisted', notes: 'Referral from college alumni', jobUrl: '' },
  { id: 3, company: 'Amazon', role: 'SDE-I', package: '32 LPA', location: 'Bangalore', applicationDate: '2024-01-05', interviewDate: '', status: 'Applied', notes: '', jobUrl: 'https://amazon.jobs' },
  { id: 4, company: 'Flipkart', role: 'Backend Engineer', package: '28 LPA', location: 'Bangalore', applicationDate: '2023-12-20', interviewDate: '', status: 'Selected', notes: 'Offer letter received!', jobUrl: '' },
  { id: 5, company: 'Infosys', role: 'System Engineer', package: '8 LPA', location: 'Pune', applicationDate: '2023-12-10', interviewDate: '', status: 'Rejected', notes: 'Need to improve communication', jobUrl: '' },
];

/* ------------------------------------------------------------------ */
/* SUB COMPONENTS                                                       */
/* ------------------------------------------------------------------ */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Applied'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 11px', borderRadius: 100, fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.6px',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {status === 'Selected' && <CheckCircle2 size={9} />}
      {status === 'Rejected' && <XCircle size={9} />}
      {status}
    </span>
  );
};

const StatCard = ({ icon: Icon, title, value, color, gradient, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', damping: 20 }}
    className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, background: gradient, borderRadius: '0 0 0 100%', opacity: 0.4 }} />
    <div style={{ width: 44, height: 44, borderRadius: 13, background: gradient, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
      <Icon size={20} style={{ color }} />
    </div>
    <p style={{ color: '#475569', fontSize: 12, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
    <p style={{ color: '#F1F5F9', fontSize: 30, fontWeight: 900, fontFamily: 'Outfit', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
  </motion.div>
);

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0D1627', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ color: payload[0].payload.fill, fontWeight: 700, fontSize: 14 }}>{payload[0].name}</p>
        <p style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 18, fontFamily: 'Outfit', margin: 0 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* ADD/EDIT MODAL                                                       */
/* ------------------------------------------------------------------ */
const CompanyModal = ({ entry, onClose, onSave }) => {
  const [form, setForm] = useState(entry || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.role.trim()) e.role = 'Role is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={errors[key] ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
      />
      {errors[key] && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25 }}
          style={{
            background: 'linear-gradient(135deg, rgba(13,22,39,0.98), rgba(17,30,53,0.98))',
            border: '1px solid rgba(99,102,241,0.22)', borderRadius: 24,
            padding: 36, maxWidth: 620, width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)',
          }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 4 }}>
                {entry ? 'Edit Application' : 'Add Application'}
              </h2>
              <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Track your job application progress</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('Company Name *', 'company', 'text', 'e.g. Google')}
              {field('Role / Position *', 'role', 'text', 'e.g. Software Engineer')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('Package (CTC)', 'package', 'text', 'e.g. 24 LPA')}
              {field('Location', 'location', 'text', 'e.g. Bangalore')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('Application Date', 'applicationDate', 'date')}
              {field('Interview Date', 'interviewDate', 'date')}
            </div>

            {/* Status Select */}
            <div>
              <label className="label">Status</label>
              <select className="select-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {field('Job URL', 'jobUrl', 'url', 'https://...')}

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea className="input-field" rows={3} placeholder="Add any notes about this application..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ resize: 'vertical', minHeight: 80 }} />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '11px 24px', fontSize: 14 }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '11px 24px', fontSize: 14 }}>
                <CheckCircle2 size={15} /> {entry ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* KANBAN CARD                                                          */
/* ------------------------------------------------------------------ */
const KanbanCard = ({ entry, onEdit, onDelete }) => {
  const cfg = STATUS_CONFIG[entry.status];
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3, boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.color}20` }}
      style={{
        background: 'rgba(13,22,39,0.9)', border: `1px solid ${cfg.border}`,
        borderRadius: 16, padding: '18px 20px', cursor: 'default',
        transition: 'box-shadow 0.2s',
        borderLeft: `3px solid ${cfg.color}`,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={15} style={{ color: cfg.color }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#F1F5F9', margin: 0, fontFamily: 'Outfit' }}>{entry.company}</p>
              <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>{entry.role}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => onEdit(entry)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
            <Edit2 size={12} />
          </button>
          <button onClick={() => onDelete(entry.id)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {entry.package && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <DollarSign size={11} style={{ color: '#10B981' }} />
          <span style={{ color: '#10B981', fontSize: 12, fontWeight: 700 }}>{entry.package}</span>
        </div>
      )}
      {entry.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <MapPin size={11} style={{ color: '#64748B' }} />
          <span style={{ color: '#64748B', fontSize: 12 }}>{entry.location}</span>
        </div>
      )}
      {entry.applicationDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={11} style={{ color: '#475569' }} />
          <span style={{ color: '#475569', fontSize: 11 }}>{new Date(entry.applicationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      )}
      {entry.notes && (
        <p style={{ color: '#475569', fontSize: 11, marginTop: 8, fontStyle: 'italic', borderTop: '1px solid rgba(99,102,241,0.08)', paddingTop: 8, lineHeight: 1.5 }}>
          "{entry.notes}"
        </p>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* DELETE CONFIRM                                                       */
/* ------------------------------------------------------------------ */
const DeleteConfirm = ({ onConfirm, onCancel, company }) => (
  <AnimatePresence>
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{ background: '#0D1627', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Trash2 size={26} style={{ color: '#EF4444' }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Delete Application?</h3>
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Remove <strong style={{ color: '#94A3B8' }}>{company}</strong> from your tracker? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onCancel} className="btn-secondary" style={{ padding: '10px 24px', fontSize: 14 }}>Cancel</button>
          <button onClick={onConfirm} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
const PlacementTracker = () => {
  const [entries, setEntries] = useState(DEMO_DATA);
  const [view, setView] = useState('kanban'); // 'kanban' | 'table'
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  /* ── Derived ── */
  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = !search || e.company.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || e.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [entries, search, filterStatus]);

  const stats = useMemo(() => ({
    total: entries.length,
    shortlisted: entries.filter(e => e.status === 'Shortlisted').length,
    selected: entries.filter(e => e.status === 'Selected').length,
    rejected: entries.filter(e => e.status === 'Rejected').length,
  }), [entries]);

  const pieData = useMemo(() => {
    return STATUSES.map((s, i) => ({ name: s, value: entries.filter(e => e.status === s).length, fill: PIE_COLORS[i] })).filter(d => d.value > 0);
  }, [entries]);

  /* ── Handlers ── */
  const handleSave = (form) => {
    if (editEntry) {
      setEntries(prev => prev.map(e => e.id === editEntry.id ? { ...form, id: e.id } : e));
    } else {
      setEntries(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
    setEditEntry(null);
  };

  const handleEdit = (entry) => { setEditEntry(entry); setShowModal(true); };
  const handleDeleteConfirm = () => { setEntries(prev => prev.filter(e => e.id !== deleteId)); setDeleteId(null); };

  const kanbanCols = STATUSES.map(s => ({ status: s, items: filtered.filter(e => e.status === s) }));

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 48 }}>

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(99,102,241,0.1))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={20} style={{ color: '#A78BFA' }} />
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>
                Placement <span className="gradient-text">Tracker</span>
              </h1>
            </div>
            <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>Track all your job applications in one place</p>
          </div>
          <button onClick={() => { setEditEntry(null); setShowModal(true); }} className="btn-primary" style={{ fontSize: 14, padding: '11px 22px' }}>
            <Plus size={16} /> Add Application
          </button>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 28 }}>
        <StatCard icon={Target} title="Total Applied" value={stats.total} color="#7C3AED" gradient="linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.05))" delay={0.1} />
        <StatCard icon={Star}   title="Shortlisted"   value={stats.shortlisted} color="#F59E0B" gradient="linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))" delay={0.15} />
        <StatCard icon={Award}  title="Selected"      value={stats.selected}    color="#10B981" gradient="linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.05))" delay={0.2} />
        <StatCard icon={XCircle} title="Rejected"     value={stats.rejected}    color="#EF4444" gradient="linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.05))" delay={0.25} />
      </div>

      {/* ── Search & Filters ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="input-field" placeholder="Search company or role..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40, paddingTop: 11, paddingBottom: 11, fontSize: 14 }} />
        </div>
        {/* Status Filter */}
        <div style={{ position: 'relative' }}>
          <Filter size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ paddingLeft: 32, paddingTop: 11, paddingBottom: 11, fontSize: 14, minWidth: 180 }}>
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 4, gap: 4 }}>
          {[['kanban', LayoutGrid], ['table', List]].map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: view === v ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.15))' : 'transparent',
              color: view === v ? '#C4B5FD' : '#475569',
              transition: 'all 0.2s',
            }}>
              <Icon size={14} /> {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <AnimatePresence mode="wait">
        {view === 'kanban' ? (
          <motion.div key="kanban" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            {filtered.length === 0 ? (
              <EmptyState onAdd={() => setShowModal(true)} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, overflowX: 'auto' }}>
                {kanbanCols.map(({ status, items }) => {
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status} style={{ minWidth: 230 }}>
                      {/* Column Header */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                        padding: '10px 14px', background: cfg.bg, border: `1px solid ${cfg.border}`,
                        borderRadius: 12,
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                        <span style={{ color: cfg.color, fontWeight: 700, fontSize: 13, flex: 1 }}>{status}</span>
                        <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{items.length}</span>
                      </div>
                      {/* Cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <AnimatePresence>
                          {items.length === 0 ? (
                            <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(99,102,241,0.1)', borderRadius: 12, color: '#334155', fontSize: 13 }}>
                              No applications
                            </div>
                          ) : items.map(e => (
                            <KanbanCard key={e.id} entry={e} onEdit={handleEdit} onDelete={setDeleteId} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="glass-card-static" style={{ padding: 0, overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <EmptyState onAdd={() => setShowModal(true)} />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                      {['Company', 'Role', 'Package', 'Location', 'App. Date', 'Interview', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '16px 18px', textAlign: 'left', color: '#475569', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((e, i) => (
                        <motion.tr key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: '1px solid rgba(99,102,241,0.07)', transition: 'background 0.15s' }}
                          onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                          onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Building2 size={14} style={{ color: '#A78BFA' }} />
                              </div>
                              <span style={{ fontWeight: 700, color: '#F1F5F9', fontSize: 14 }}>{e.company}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: 13 }}>{e.role}</td>
                          <td style={{ padding: '14px 18px', color: '#10B981', fontWeight: 700, fontSize: 13 }}>{e.package || '—'}</td>
                          <td style={{ padding: '14px 18px', color: '#64748B', fontSize: 13 }}>{e.location || '—'}</td>
                          <td style={{ padding: '14px 18px', color: '#475569', fontSize: 12 }}>
                            {e.applicationDate ? new Date(e.applicationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569', fontSize: 12 }}>
                            {e.interviewDate ? new Date(e.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                          </td>
                          <td style={{ padding: '14px 18px' }}><StatusBadge status={e.status} /></td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <button onClick={() => handleEdit(e)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, cursor: 'pointer', color: '#A78BFA', fontSize: 12, fontWeight: 600 }}>
                                <Edit2 size={11} /> Edit
                              </button>
                              <button onClick={() => setDeleteId(e.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, cursor: 'pointer', color: '#EF4444', fontSize: 12, fontWeight: 600 }}>
                                <Trash2 size={11} />
                              </button>
                              {e.jobUrl && (
                                <a href={e.jobUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '5px', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 8, color: '#06B6D4' }}>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Analytics Section ── */}
      {entries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card-static" style={{ padding: 28, marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={18} style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Outfit', margin: 0, letterSpacing: '-0.02em' }}>Application Analytics</h2>
              <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Status distribution of your applications</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STATUSES.map((s, i) => {
                const count = entries.filter(e => e.status === s).length;
                const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ color: '#94A3B8', fontSize: 13, flex: 1 }}>{s}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 5, borderRadius: 100, background: 'rgba(99,102,241,0.1)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6, duration: 0.8 }}
                          style={{ height: '100%', background: PIE_COLORS[i], borderRadius: 100 }} />
                      </div>
                      <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13, width: 28, textAlign: 'right' }}>{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Modals ── */}
      {showModal && <CompanyModal entry={editEntry} onClose={() => { setShowModal(false); setEditEntry(null); }} onSave={handleSave} />}
      {deleteId && <DeleteConfirm company={entries.find(e => e.id === deleteId)?.company} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteId(null)} />}
    </div>
  );
};

/* ── Empty State ── */
const EmptyState = ({ onAdd }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    style={{ textAlign: 'center', padding: '72px 24px' }}>
    <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
      <Briefcase size={38} style={{ color: '#334155' }} />
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 10 }}>No Applications Yet</h3>
    <p style={{ color: '#475569', fontSize: 14, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
      Start tracking your placement journey. Add your first job application and stay organized!
    </p>
    <button onClick={onAdd} className="btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
      <Plus size={16} /> Add First Application
    </button>
  </motion.div>
);

export default PlacementTracker;
