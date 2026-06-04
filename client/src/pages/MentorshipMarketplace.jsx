import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Clock,
  Users,
  Video,
  FileText,
  MessageSquare,
  Compass,
  Filter,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  DollarSign,
  Heart,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

// ─── Color palette ────────────────────────────────────────────────────────────
const BG = '#050B18';
const GLASS = 'rgba(13,22,39,0.80)';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';
const GREEN = '#10B981';

// ─── Mentor data ──────────────────────────────────────────────────────────────
const MENTORS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    title: 'Software Engineer L5',
    company: 'Google',
    experience: 6,
    expertise: ['System Design', 'DSA', 'Go', 'Kubernetes'],
    rating: 4.9,
    sessions: 312,
    price: 800,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
    sessionTypes: ['1:1 Call', 'Mock Interview', 'Career Guidance'],
    role: 'SWE',
    bio: 'Cracked Google twice. Passionate about helping engineers land top-tier roles.',
  },
  {
    id: 2,
    name: 'Priya Menon',
    title: 'SDE II',
    company: 'Amazon',
    experience: 5,
    expertise: ['Java', 'AWS', 'Microservices', 'DSA'],
    rating: 4.8,
    sessions: 217,
    price: 600,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#EC4899,#F59E0B)',
    sessionTypes: ['1:1 Call', 'Resume Review', 'Mock Interview'],
    role: 'SDE',
    bio: 'Amazon leadership principles expert. Helped 100+ engineers ace behavioral rounds.',
  },
  {
    id: 3,
    name: 'Arjun Kapoor',
    title: 'Principal Engineer',
    company: 'Microsoft',
    experience: 9,
    expertise: ['Architecture', 'C#', 'Azure', 'Team Leadership'],
    rating: 5.0,
    sessions: 489,
    price: 1200,
    free: false,
    available: false,
    gradient: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
    sessionTypes: ['1:1 Call', 'Career Guidance', 'Mock Interview'],
    role: 'Principal',
    bio: 'Principal Eng with 9 years at Microsoft. Specialises in senior/staff transitions.',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    title: 'Software Engineer',
    company: 'Meta',
    experience: 4,
    expertise: ['React', 'GraphQL', 'Python', 'System Design'],
    rating: 4.7,
    sessions: 143,
    price: 0,
    free: true,
    available: true,
    gradient: 'linear-gradient(135deg,#10B981,#06B6D4)',
    sessionTypes: ['1:1 Call', 'Resume Review', 'Career Guidance'],
    role: 'SWE',
    bio: 'Giving back to the community. Let\'s crack Meta together — for free!',
  },
  {
    id: 5,
    name: 'Vikram Nair',
    title: 'Tech Lead',
    company: 'Flipkart',
    experience: 7,
    expertise: ['Scala', 'Kafka', 'System Design', 'DSA'],
    rating: 4.8,
    sessions: 278,
    price: 700,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    sessionTypes: ['1:1 Call', 'Mock Interview', 'Career Guidance'],
    role: 'Tech Lead',
    bio: 'Led teams of 20+ at Flipkart. Expert in e-commerce architecture.',
  },
  {
    id: 6,
    name: 'Ananya Singh',
    title: 'Data Scientist',
    company: 'Netflix',
    experience: 5,
    expertise: ['ML', 'Python', 'Spark', 'A/B Testing'],
    rating: 4.9,
    sessions: 196,
    price: 900,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#EF4444,#7C3AED)',
    sessionTypes: ['1:1 Call', 'Resume Review', 'Career Guidance'],
    role: 'Data Science',
    bio: 'Building recommendation systems at Netflix. DS interview specialist.',
  },
  {
    id: 7,
    name: 'Rohan Mehta',
    title: 'Founder (ex-Google)',
    company: 'StealthAI',
    experience: 8,
    expertise: ['Startups', 'Product', 'System Design', 'Leadership'],
    rating: 4.9,
    sessions: 401,
    price: 1500,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#06B6D4,#10B981)',
    sessionTypes: ['1:1 Call', 'Career Guidance', 'Mock Interview'],
    role: 'Founder',
    bio: 'Ex-Google, now building AI startup. Mentor for engineers going entrepreneur.',
  },
  {
    id: 8,
    name: 'Pooja Iyer',
    title: 'Backend Engineer',
    company: 'Zomato',
    experience: 3,
    expertise: ['Node.js', 'PostgreSQL', 'Redis', 'DSA'],
    rating: 4.6,
    sessions: 87,
    price: 0,
    free: true,
    available: true,
    gradient: 'linear-gradient(135deg,#F97316,#FBBF24)',
    sessionTypes: ['1:1 Call', 'Resume Review', 'Mock Interview'],
    role: 'SDE',
    bio: 'New mentor, passionate about helping freshers break into product companies.',
  },
  {
    id: 9,
    name: 'Karthik Rao',
    title: 'SDE II',
    company: 'Swiggy',
    experience: 4,
    expertise: ['Java', 'Spring Boot', 'MySQL', 'System Design'],
    rating: 4.7,
    sessions: 154,
    price: 500,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
    sessionTypes: ['1:1 Call', 'Mock Interview', 'Resume Review'],
    role: 'SDE',
    bio: 'Swiggy backend specialist. Cracked 8 FAANG interviews before settling at Swiggy.',
  },
  {
    id: 10,
    name: 'Divya Patel',
    title: 'ML Engineer',
    company: 'Paytm',
    experience: 5,
    expertise: ['ML', 'TensorFlow', 'Python', 'FinTech'],
    rating: 4.8,
    sessions: 203,
    price: 750,
    free: false,
    available: false,
    gradient: 'linear-gradient(135deg,#0EA5E9,#7C3AED)',
    sessionTypes: ['1:1 Call', 'Career Guidance', 'Resume Review'],
    role: 'Data Science',
    bio: 'ML practitioner in fintech. Specialises in fraud detection and risk models.',
  },
  {
    id: 11,
    name: 'Aditya Kumar',
    title: 'Technical Architect',
    company: 'TCS',
    experience: 10,
    expertise: ['Enterprise Arch', 'Java', 'DevOps', 'Cloud'],
    rating: 4.6,
    sessions: 334,
    price: 0,
    free: true,
    available: true,
    gradient: 'linear-gradient(135deg,#14B8A6,#3B82F6)',
    sessionTypes: ['1:1 Call', 'Career Guidance', 'Resume Review'],
    role: 'Architect',
    bio: '10 years in enterprise. Guides engineers transitioning from service to product.',
  },
  {
    id: 12,
    name: 'Meera Joshi',
    title: 'Senior Developer',
    company: 'Accenture',
    experience: 6,
    expertise: ['React', 'Node.js', 'AWS', 'Agile'],
    rating: 4.7,
    sessions: 178,
    price: 400,
    free: false,
    available: true,
    gradient: 'linear-gradient(135deg,#F472B6,#FB923C)',
    sessionTypes: ['1:1 Call', 'Resume Review', 'Career Guidance'],
    role: 'SDE',
    bio: 'Full-stack developer with experience in large enterprise and consulting projects.',
  },
];

const TRENDING = MENTORS.filter((m) => m.rating >= 4.8).slice(0, 3);

const SESSION_TYPE_ICONS = {
  '1:1 Call': Video,
  'Resume Review': FileText,
  'Mock Interview': MessageSquare,
  'Career Guidance': Compass,
};

const ROLES = ['All', 'SWE', 'SDE', 'Tech Lead', 'Principal', 'Data Science', 'Founder', 'Architect'];
const COMPANIES = ['All', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Flipkart', 'Netflix', 'Zomato', 'Swiggy', 'Paytm', 'TCS', 'Accenture', 'StealthAI'];
const EXP_RANGES = ['All', '0–3 yrs', '4–6 yrs', '7–10 yrs', '10+ yrs'];
const RATING_OPTS = ['All', '4.5+', '4.8+', '5.0'];
const PRICE_OPTS = ['All', 'Free', 'Paid'];
const AVAIL_OPTS = ['All', 'Available Now'];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= Math.round(rating) ? '#FBBF24' : 'transparent'}
          stroke={s <= Math.round(rating) ? '#FBBF24' : 'rgba(255,255,255,0.2)'}
        />
      ))}
    </div>
  );
}

function SelectDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 10, padding: '8px 14px', color: value !== 'All' ? PURPLE : 'rgba(255,255,255,0.6)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}
      >
        {value !== 'All' ? value : label}
        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              position: 'absolute', top: 44, left: 0, zIndex: 200,
              background: 'rgba(13,22,39,0.97)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 12, padding: 6, minWidth: 160,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 12px', borderRadius: 8, fontSize: 13,
                  color: opt === value ? PURPLE : 'rgba(255,255,255,0.75)',
                  background: opt === value ? 'rgba(124,58,237,0.15)' : 'transparent',
                  cursor: 'pointer', border: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = opt === value ? 'rgba(124,58,237,0.15)' : 'transparent'}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ mentor, onClose }) {
  const [step, setStep] = useState(1); // 1=details, 2=success
  const [selectedType, setSelectedType] = useState(mentor.sessionTypes[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const canConfirm = selectedDate && selectedSlot;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(5,11,24,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{
          background: 'rgba(13,22,39,0.95)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 24,
          padding: '32px',
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(124,58,237,0.2), 0 32px 64px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Book a Session</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>with {mentor.name}</p>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Mentor mini card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: mentor.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                  {initials(mentor.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{mentor.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{mentor.title} @ {mentor.company}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: mentor.free ? GREEN : CYAN }}>{mentor.free ? 'Free' : `₹${mentor.price}`}</div>
                  {!mentor.free && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>per session</div>}
                </div>
              </div>

              {/* Session Type */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 12 }}>Session Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {mentor.sessionTypes.map((type) => {
                    const Icon = SESSION_TYPE_ICONS[type] || Video;
                    const active = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 7,
                          padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
                          border: active ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.1)',
                          color: active ? PURPLE : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        <Icon size={14} />
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Picker */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 12 }}>Select Date</label>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                  {dates.map((d, i) => {
                    const active = selectedDate && selectedDate.toDateString() === d.toDateString();
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        style={{
                          flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: 4, padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                          transition: 'all 0.2s', minWidth: 56,
                          background: active ? `linear-gradient(135deg,${PURPLE},${CYAN})` : 'rgba(255,255,255,0.05)',
                          border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{dayNames[d.getDay()]}</span>
                        <span style={{ fontSize: 18, fontWeight: 700 }}>{d.getDate()}</span>
                        <span style={{ fontSize: 10 }}>{monthNames[d.getMonth()]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 12 }}>Select Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                  {TIME_SLOTS.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: active ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                          border: active ? `1px solid ${CYAN}` : '1px solid rgba(255,255,255,0.08)',
                          color: active ? CYAN : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 10 }}>Message to Mentor <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the mentor what you'd like to focus on..."
                  rows={3}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 13,
                    resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Confirm Button */}
              <motion.button
                whileHover={canConfirm ? { scale: 1.02 } : {}}
                whileTap={canConfirm ? { scale: 0.98 } : {}}
                onClick={() => canConfirm && setStep(2)}
                style={{
                  width: '100%', padding: '14px 0',
                  background: canConfirm ? `linear-gradient(135deg,${PURPLE},${CYAN})` : 'rgba(255,255,255,0.08)',
                  border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
                  color: canConfirm ? '#fff' : 'rgba(255,255,255,0.3)',
                  cursor: canConfirm ? 'pointer' : 'not-allowed',
                  boxShadow: canConfirm ? `0 8px 24px rgba(124,58,237,0.35)` : 'none',
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Check size={18} />
                Confirm Booking
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: `linear-gradient(135deg,${GREEN},${CYAN})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: `0 0 40px rgba(16,185,129,0.4)`,
                }}
              >
                <CheckCircle2 size={48} color="#fff" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}
              >
                Session Booked! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' }}
              >
                Your <strong style={{ color: CYAN }}>{selectedType}</strong> session with <strong style={{ color: '#fff' }}>{mentor.name}</strong><br />
                is scheduled for <strong style={{ color: PURPLE }}>{selectedDate ? `${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}` : ''}</strong> at <strong style={{ color: PURPLE }}>{selectedSlot}</strong>.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 14, padding: '14px 20px', marginBottom: 28, fontSize: 13,
                  color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Bell size={16} color={GREEN} />
                A calendar invite and reminder will be sent to your registered email.
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  padding: '12px 36px', background: `linear-gradient(135deg,${PURPLE},${CYAN})`,
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer',
                  boxShadow: `0 8px 24px rgba(124,58,237,0.35)`,
                }}
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Mentor Card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, index, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: GLASS,
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.12)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: hovered ? mentor.gradient : 'transparent',
        transition: 'all 0.35s',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
        <motion.div
          animate={{ rotate: hovered ? [0, -3, 3, 0] : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 56, height: 56, borderRadius: 16, background: mentor.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18, color: '#fff', flexShrink: 0,
            boxShadow: `0 8px 20px rgba(0,0,0,0.3)`,
          }}
        >
          {initials(mentor.name)}
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mentor.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{mentor.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={11} color={CYAN} />
            <span style={{ fontSize: 12, color: CYAN, fontWeight: 600 }}>{mentor.company}</span>
          </div>
        </div>
        {mentor.available ? (
          <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: GREEN, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '3px 9px', letterSpacing: 0.5 }}>LIVE</span>
        ) : (
          <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 9px', letterSpacing: 0.5 }}>BUSY</span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={12} color='rgba(255,255,255,0.4)' />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{mentor.experience} yrs exp</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Users size={12} color='rgba(255,255,255,0.4)' />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{mentor.sessions} sessions</span>
        </div>
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <StarRating rating={mentor.rating} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FBBF24' }}>{mentor.rating.toFixed(1)}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>({mentor.sessions} reviews)</span>
      </div>

      {/* Expertise tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {mentor.expertise.map((tag) => (
          <span key={tag} style={{
            fontSize: 11, fontWeight: 600, color: 'rgba(124,58,237,0.9)',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 8, padding: '3px 9px',
          }}>{tag}</span>
        ))}
      </div>

      {/* Session types */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {mentor.sessionTypes.map((type) => {
          const Icon = SESSION_TYPE_ICONS[type] || Video;
          return (
            <span key={type} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 500, color: 'rgba(6,182,212,0.8)',
              background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: 8, padding: '4px 9px',
            }}>
              <Icon size={10} />
              {type}
            </span>
          );
        })}
      </div>

      {/* Price + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {mentor.free ? (
            <span style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>Free</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>₹{mentor.price}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/session</span>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBook(mentor)}
          style={{
            padding: '10px 20px',
            background: hovered ? `linear-gradient(135deg,${PURPLE},${CYAN})` : 'rgba(124,58,237,0.15)',
            border: `1px solid ${hovered ? 'transparent' : 'rgba(124,58,237,0.4)'}`,
            borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: hovered ? `0 8px 20px rgba(124,58,237,0.35)` : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          Book Session
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ onBook }) {
  const MY_SESSIONS = [
    { mentor: 'Rahul Sharma', type: 'Mock Interview', date: 'Tomorrow, 4:00 PM', color: PURPLE },
    { mentor: 'Sneha Gupta', type: 'Resume Review', date: 'Sat, 11:00 AM', color: CYAN },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Become a Mentor CTA */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: `linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))`,
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 20, padding: '24px',
          backdropFilter: 'blur(20px)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,rgba(124,58,237,0.3),transparent)` }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,rgba(6,182,212,0.2),transparent)` }} />
        <Sparkles size={28} color={PURPLE} style={{ marginBottom: 12 }} />
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Become a Mentor</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 18px' }}>
          Share your expertise and earn while helping engineers grow.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {['Set your own rates', 'Flexible schedule', '10,000+ active learners'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} color={GREEN} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{item}</span>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '12px 0',
            background: `linear-gradient(135deg,${PURPLE},${CYAN})`,
            border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700,
            fontSize: 13, cursor: 'pointer',
            boxShadow: `0 8px 20px rgba(124,58,237,0.35)`,
          }}
        >
          Apply Now →
        </motion.button>
      </motion.div>

      {/* Trending Mentors */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: GLASS, border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '20px',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TrendingUp size={16} color={CYAN} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Trending This Week</h3>
        </div>
        {TRENDING.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < TRENDING.length - 1 ? 14 : 0, cursor: 'pointer', padding: '8px', borderRadius: 12, transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={() => onBook(m)}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: m.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                {initials(m.name)}
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: GREEN, border: '2px solid #050B18' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{m.company}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24' }}>⭐ {m.rating}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{m.sessions} sessions</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* My Sessions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: GLASS, border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '20px',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Calendar size={16} color={PURPLE} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>My Upcoming Sessions</h3>
        </div>
        {MY_SESSIONS.map((s, i) => (
          <div key={i} style={{
            background: `rgba(124,58,237,0.07)`, border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: 12, padding: '12px 14px', marginBottom: i < MY_SESSIONS.length - 1 ? 10 : 0,
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 4 }}>{s.mentor}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{s.type}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.date}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: GLASS, border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '20px',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Award size={16} color='#FBBF24' />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Platform Stats</h3>
        </div>
        {[
          { label: 'Active Mentors', value: '500+', color: PURPLE },
          { label: 'Sessions Completed', value: '18,400', color: CYAN },
          { label: 'Success Rate', value: '94%', color: GREEN },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MentorshipMarketplace() {
  const [filters, setFilters] = useState({ role: 'All', company: 'All', exp: 'All', rating: 'All', avail: 'All', price: 'All' });
  const [search, setSearch] = useState('');
  const [bookingMentor, setBookingMentor] = useState(null);

  const filtered = useMemo(() => {
    return MENTORS.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.company.toLowerCase().includes(search.toLowerCase()) && !m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filters.role !== 'All' && m.role !== filters.role) return false;
      if (filters.company !== 'All' && m.company !== filters.company) return false;
      if (filters.exp !== 'All') {
        if (filters.exp === '0–3 yrs' && m.experience > 3) return false;
        if (filters.exp === '4–6 yrs' && (m.experience < 4 || m.experience > 6)) return false;
        if (filters.exp === '7–10 yrs' && (m.experience < 7 || m.experience > 10)) return false;
        if (filters.exp === '10+ yrs' && m.experience <= 10) return false;
      }
      if (filters.rating !== 'All') {
        if (filters.rating === '4.5+' && m.rating < 4.5) return false;
        if (filters.rating === '4.8+' && m.rating < 4.8) return false;
        if (filters.rating === '5.0' && m.rating < 5.0) return false;
      }
      if (filters.avail !== 'All' && !m.available) return false;
      if (filters.price === 'Free' && !m.free) return false;
      if (filters.price === 'Paid' && m.free) return false;
      return true;
    });
  }, [filters, search]);

  const activeFiltersCount = Object.values(filters).filter((v) => v !== 'All').length;

  const resetFilters = () => setFilters({ role: 'All', company: 'All', exp: 'All', rating: 'All', avail: 'All', price: 'All' });

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Inter', 'Outfit', system-ui, sans-serif" }}>
      {/* Ambient background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.07),transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.06),transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg,${PURPLE},${CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px rgba(124,58,237,0.35)` }}>
                  <Users size={22} color="#fff" />
                </div>
                <div>
                  <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, background: `linear-gradient(90deg,#fff,rgba(255,255,255,0.6))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Mentorship Marketplace
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Connect with top industry mentors</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, fontSize: 12, color: GREEN, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, animation: 'pulse 2s infinite' }} />
                {MENTORS.filter((m) => m.available).length} mentors online
              </div>
              <div style={{ padding: '6px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, fontSize: 12, color: PURPLE, fontWeight: 600 }}>
                <BookOpen size={12} style={{ display: 'inline', marginRight: 5 }} />
                {MENTORS.length} mentors listed
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: GLASS, border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '20px 24px', marginBottom: 28,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}
        >
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px', marginBottom: 16 }}>
            <Search size={16} color='rgba(255,255,255,0.4)' />
            <input
              type="text"
              placeholder="Search mentors by name, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, marginRight: 4 }}>
              <Filter size={14} />
              Filters
              {activeFiltersCount > 0 && (
                <span style={{ background: PURPLE, color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{activeFiltersCount}</span>
              )}
            </div>
            <SelectDropdown label="Role" options={ROLES} value={filters.role} onChange={(v) => setFilters((p) => ({ ...p, role: v }))} />
            <SelectDropdown label="Company" options={COMPANIES} value={filters.company} onChange={(v) => setFilters((p) => ({ ...p, company: v }))} />
            <SelectDropdown label="Experience" options={EXP_RANGES} value={filters.exp} onChange={(v) => setFilters((p) => ({ ...p, exp: v }))} />
            <SelectDropdown label="Rating" options={RATING_OPTS} value={filters.rating} onChange={(v) => setFilters((p) => ({ ...p, rating: v }))} />
            <SelectDropdown label="Availability" options={AVAIL_OPTS} value={filters.avail} onChange={(v) => setFilters((p) => ({ ...p, avail: v }))} />
            <SelectDropdown label="Price" options={PRICE_OPTS} value={filters.price} onChange={(v) => setFilters((p) => ({ ...p, price: v }))} />
            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '8px 14px', color: '#EF4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                <X size={13} />
                Clear
              </motion.button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>{filtered.length}</span> mentors found
            </span>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          {/* Mentor Grid */}
          <div>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)' }}
              >
                <Users size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No mentors found</div>
                <div style={{ fontSize: 14 }}>Try adjusting your filters</div>
              </motion.div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                {filtered.map((mentor, i) => (
                  <MentorCard key={mentor.id} mentor={mentor} index={i} onBook={setBookingMentor} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 24 }}>
            <Sidebar onBook={setBookingMentor} />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingMentor && (
          <BookingModal mentor={bookingMentor} onClose={() => setBookingMentor(null)} />
        )}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.35); border-radius: 10px; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input::placeholder { color: rgba(255,255,255,0.35); }
        textarea::placeholder { color: rgba(255,255,255,0.3); }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 320px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
