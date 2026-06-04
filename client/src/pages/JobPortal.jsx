import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, Bookmark, BookmarkCheck, ExternalLink,
  Search, Filter, X, ChevronLeft, ChevronRight, Building2,
  Wifi, Monitor, Users2, DollarSign, Star, TrendingUp,
  Sparkles, BadgeCheck, GraduationCap, Zap
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   MOCK JOB DATA — 27 listings
─────────────────────────────────────────────────────────── */
const ALL_JOBS = [
  /* ── Freshers (Service companies) ── */
  {
    id: 1, type: 'job', company: 'TCS', logoColor: '#00B4E0', role: 'System Engineer',
    location: 'Pan India', locationType: 'Onsite', salary: '₹3.6 – 4.5 LPA',
    experience: 'Fresher', skills: ['Java', 'SQL', 'SDLC', 'Linux'],
    posted: 2, applyUrl: 'https://www.tcs.com/careers', featured: false,
    description: 'Join TCS as a System Engineer and work on enterprise-grade software delivery projects. Training provided at Mysore campus.',
  },
  {
    id: 2, type: 'job', company: 'Wipro', logoColor: '#341D5A', role: 'Project Engineer',
    location: 'Hyderabad / Pune', locationType: 'Onsite', salary: '₹3.5 – 4.0 LPA',
    experience: 'Fresher', skills: ['Python', 'SQL', '.NET', 'Agile'],
    posted: 5, applyUrl: 'https://careers.wipro.com', featured: false,
    description: 'Work on innovative projects across domains including BFSI, healthcare, and retail as a Project Engineer at Wipro.',
  },
  {
    id: 3, type: 'job', company: 'Infosys', logoColor: '#007CC3', role: 'Systems Engineer',
    location: 'Bangalore / Chennai', locationType: 'Hybrid', salary: '₹3.6 – 5.0 LPA',
    experience: 'Fresher', skills: ['Java', 'Spring', 'MySQL', 'REST APIs'],
    posted: 1, applyUrl: 'https://www.infosys.com/careers', featured: false,
    description: 'Infosys Fresher Program (InfyTQ powered). Contribute to digital transformation projects with global clients.',
  },
  {
    id: 4, type: 'job', company: 'Cognizant', logoColor: '#0033A0', role: 'Programmer Analyst',
    location: 'Chennai / Pune', locationType: 'Onsite', salary: '₹4.0 – 5.0 LPA',
    experience: 'Fresher', skills: ['C#', '.NET', 'SQL Server', 'Azure'],
    posted: 3, applyUrl: 'https://careers.cognizant.com', featured: false,
    description: 'Join Cognizant\'s GenC program and work on real client projects from day 1 with structured mentorship.',
  },
  {
    id: 5, type: 'job', company: 'Accenture', logoColor: '#A100FF', role: 'Associate Software Engineer',
    location: 'Mumbai / Gurgaon', locationType: 'Hybrid', salary: '₹4.5 – 6.0 LPA',
    experience: 'Fresher', skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
    posted: 4, applyUrl: 'https://www.accenture.com/in-en/careers', featured: false,
    description: 'Accenture\'s Technology Development Program. Work on cutting-edge digital, cloud, and AI projects.',
  },
  {
    id: 6, type: 'job', company: 'HCL Technologies', logoColor: '#EF4444', role: 'Graduate Engineer Trainee',
    location: 'Noida / Hyderabad', locationType: 'Onsite', salary: '₹3.5 – 4.0 LPA',
    experience: 'Fresher', skills: ['Java', 'Python', 'DevOps', 'Docker'],
    posted: 7, applyUrl: 'https://www.hcltech.com/careers', featured: false,
    description: 'HCL GET program offers 6-month training followed by placement in live projects across HCL\'s global delivery centers.',
  },
  /* ── Mid-level (Product companies) ── */
  {
    id: 7, type: 'job', company: 'Amazon', logoColor: '#FF9900', role: 'SDE-1',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹22 – 35 LPA',
    experience: '1yr', skills: ['Java', 'AWS', 'DSA', 'System Design', 'Distributed Systems'],
    posted: 0, applyUrl: 'https://amazon.jobs', featured: true,
    description: 'Build scalable distributed systems at Amazon. Work with world-class engineers on products used by millions daily.',
  },
  {
    id: 8, type: 'job', company: 'Flipkart', logoColor: '#F9A825', role: 'SDE-1',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹18 – 28 LPA',
    experience: '1yr', skills: ['Java', 'Spring Boot', 'Kafka', 'React', 'MySQL'],
    posted: 2, applyUrl: 'https://www.flipkartcareers.com', featured: true,
    description: 'Join India\'s leading e-commerce platform. Build systems that power high-traffic sale events like Big Billion Days.',
  },
  {
    id: 9, type: 'job', company: 'Swiggy', logoColor: '#F97316', role: 'Software Engineer',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹15 – 25 LPA',
    experience: '1yr', skills: ['Go', 'Python', 'Kubernetes', 'Microservices', 'Redis'],
    posted: 3, applyUrl: 'https://careers.swiggy.com', featured: false,
    description: 'Build the next generation of food-tech infrastructure. Work on real-time logistics and delivery optimization systems.',
  },
  {
    id: 10, type: 'job', company: 'Zomato', logoColor: '#E23744', role: 'Software Engineer — Backend',
    location: 'Gurgaon', locationType: 'Onsite', salary: '₹16 – 24 LPA',
    experience: '1yr', skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
    posted: 5, applyUrl: 'https://www.zomato.com/careers', featured: false,
    description: 'Work on high-scale backend systems serving millions of orders per day. Core team, early equity.',
  },
  {
    id: 11, type: 'job', company: 'Paytm', logoColor: '#00B9F1', role: 'SDE-1 — Payments',
    location: 'Noida', locationType: 'Onsite', salary: '₹12 – 20 LPA',
    experience: '1yr', skills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Docker'],
    posted: 8, applyUrl: 'https://paytm.com/about/careers', featured: false,
    description: 'Join Paytm\'s Payments team and build secure, high-throughput fintech systems. Millions of daily transactions.',
  },
  {
    id: 12, type: 'job', company: 'Razorpay', logoColor: '#3395FF', role: 'Software Engineer',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹20 – 32 LPA',
    experience: '1yr', skills: ['Golang', 'React', 'PostgreSQL', 'Docker', 'Microservices'],
    posted: 1, applyUrl: 'https://razorpay.com/jobs', featured: true,
    description: 'Join the team powering India\'s payments revolution. Work on products used by 8M+ businesses.',
  },
  {
    id: 13, type: 'job', company: 'CRED', logoColor: '#1C1C1C', role: 'SDE — Mobile (Android)',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹18 – 28 LPA',
    experience: '2yr+', skills: ['Kotlin', 'Android', 'MVVM', 'Jetpack', 'GraphQL'],
    posted: 6, applyUrl: 'https://careers.cred.club', featured: false,
    description: 'CRED is building a members-only platform for India\'s premium credit card users. World-class design + eng culture.',
  },
  {
    id: 14, type: 'job', company: 'PhonePe', logoColor: '#5F259F', role: 'Backend Engineer',
    location: 'Bangalore', locationType: 'Onsite', salary: '₹20 – 35 LPA',
    experience: '2yr+', skills: ['Java', 'Spring', 'Kafka', 'Cassandra', 'Microservices'],
    posted: 4, applyUrl: 'https://www.phonepe.com/careers', featured: false,
    description: 'PhonePe is India\'s most-used UPI app. Build mission-critical payment infra processing billions of transactions.',
  },
  {
    id: 15, type: 'job', company: 'Meesho', logoColor: '#9333EA', role: 'SDE-1 — Full Stack',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹14 – 22 LPA',
    experience: '1yr', skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
    posted: 10, applyUrl: 'https://meesho.io/careers', featured: false,
    description: 'Meesho is India\'s fastest-growing social commerce startup. Build products for 150M+ users in Tier 2/3 cities.',
  },
  /* ── Remote opportunities ── */
  {
    id: 16, type: 'job', company: 'Deel', logoColor: '#16A34A', role: 'Software Engineer — Remote',
    location: 'Remote (India)', locationType: 'Remote', salary: '$80K – $120K/year',
    experience: '2yr+', skills: ['Node.js', 'React', 'PostgreSQL', 'GraphQL', 'TypeScript'],
    posted: 2, applyUrl: 'https://deel.com/careers', featured: false,
    description: 'Deel is building global payroll infrastructure. Fully remote, work async with teams across 100+ countries.',
  },
  {
    id: 17, type: 'job', company: 'Remote.com', logoColor: '#1BCD99', role: 'Full Stack Developer',
    location: 'Remote (Worldwide)', locationType: 'Remote', salary: '$70K – $110K/year',
    experience: '2yr+', skills: ['Ruby on Rails', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    posted: 5, applyUrl: 'https://remote.com/careers', featured: false,
    description: 'Remote-first company building the future of work. Competitive international pay with equity.',
  },
  {
    id: 18, type: 'job', company: 'GitLab', logoColor: '#FC6D26', role: 'Backend Engineer — Ruby',
    location: 'Remote (Global)', locationType: 'Remote', salary: '$90K – $130K/year',
    experience: '2yr+', skills: ['Ruby', 'PostgreSQL', 'Redis', 'Kubernetes', 'CI/CD'],
    posted: 3, applyUrl: 'https://about.gitlab.com/jobs', featured: false,
    description: 'GitLab is 100% remote with 2000+ team members across 60+ countries. Contribute to open-source DevOps platform.',
  },
  /* ── Internships ── */
  {
    id: 19, type: 'internship', company: 'Paytm', logoColor: '#00B9F1', role: 'SDE Intern — Backend',
    location: 'Noida', locationType: 'Onsite', salary: '₹50,000/month',
    experience: 'Fresher', skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    posted: 1, applyUrl: 'https://paytm.com/about/careers', featured: true,
    description: 'Work on live production systems processing millions of transactions. PPO offered to top 40% of interns.',
  },
  {
    id: 20, type: 'internship', company: 'Groww', logoColor: '#00D09C', role: 'Full Stack Intern',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹40,000/month',
    experience: 'Fresher', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    posted: 3, applyUrl: 'https://groww.in/careers', featured: false,
    description: 'Join India\'s fastest-growing fintech startup. Work on real user-facing features for 50M+ active investors.',
  },
  {
    id: 21, type: 'internship', company: 'Zepto', logoColor: '#9333EA', role: 'Product & Tech Intern',
    location: 'Mumbai', locationType: 'Onsite', salary: '₹60,000/month',
    experience: 'Fresher', skills: ['Python', 'SQL', 'Data Analysis', 'React'],
    posted: 0, applyUrl: 'https://www.zeptonow.com/careers', featured: true,
    description: 'Work on Zepto\'s 10-minute grocery delivery platform. High ownership, fast learning environment.',
  },
  {
    id: 22, type: 'internship', company: 'Ola Electric', logoColor: '#F59E0B', role: 'Software Intern — IoT',
    location: 'Bangalore', locationType: 'Onsite', salary: '₹35,000/month',
    experience: 'Fresher', skills: ['Python', 'C++', 'MQTT', 'AWS IoT', 'Docker'],
    posted: 7, applyUrl: 'https://olaelectric.com/careers', featured: false,
    description: 'Work on connected vehicle software and IoT infrastructure for India\'s leading EV manufacturer.',
  },
  {
    id: 23, type: 'internship', company: 'Jupiter Money', logoColor: '#6366F1', role: 'Backend Intern',
    location: 'Mumbai', locationType: 'Hybrid', salary: '₹45,000/month',
    experience: 'Fresher', skills: ['Golang', 'PostgreSQL', 'Redis', 'Docker'],
    posted: 4, applyUrl: 'https://jupiter.money/careers', featured: false,
    description: 'Work on Jupiter\'s banking infrastructure. Learn real fintech engineering from a world-class team.',
  },
  {
    id: 24, type: 'internship', company: 'Slice', logoColor: '#EC4899', role: 'Frontend Intern',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹30,000/month',
    experience: 'Fresher', skills: ['React Native', 'TypeScript', 'Redux', 'Firebase'],
    posted: 6, applyUrl: 'https://sliceit.com/careers', featured: false,
    description: 'Build the next-gen credit card app for Gen-Z India. Work directly with the product and design team.',
  },
  {
    id: 25, type: 'internship', company: 'Dukaan', logoColor: '#FF6B35', role: 'SDE Intern — Full Stack',
    location: 'Remote', locationType: 'Remote', salary: '₹25,000/month',
    experience: 'Fresher', skills: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
    posted: 2, applyUrl: 'https://mydukaan.io/careers', featured: false,
    description: 'Remote-first startup helping small businesses go digital. Build e-commerce tools used by 10M+ merchants.',
  },
  {
    id: 26, type: 'internship', company: 'Licious', logoColor: '#E53935', role: 'Data Engineering Intern',
    location: 'Bangalore', locationType: 'Hybrid', salary: '₹35,000/month',
    experience: 'Fresher', skills: ['Python', 'SQL', 'Spark', 'Airflow', 'Snowflake'],
    posted: 9, applyUrl: 'https://licious.in/careers', featured: false,
    description: 'Work on Licious\'s data pipeline and analytics infrastructure. Learn big data at scale in a fast-growth startup.',
  },
  {
    id: 27, type: 'internship', company: 'Juspay', logoColor: '#06B6D4', role: 'Haskell / Backend Intern',
    location: 'Bangalore', locationType: 'Onsite', salary: '₹50,000/month',
    experience: 'Fresher', skills: ['Haskell', 'Purescript', 'MySQL', 'Redis'],
    posted: 1, applyUrl: 'https://juspay.in/careers', featured: false,
    description: 'Juspay powers payments for Amazon, Swiggy, and 100+ top companies. Unique functional programming culture.',
  },
];

const ALL_SKILLS = ['Java', 'Python', 'React', 'Node.js', 'Go', 'Kotlin', 'AWS', 'Docker', 'SQL', 'TypeScript', 'Spring Boot', 'Microservices', 'DSA', 'System Design'];
const LOCATIONS = ['All', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Noida', 'Remote', 'Pan India'];
const EXPERIENCE_OPTS = ['All', 'Fresher', '1yr', '2yr+'];
const PAGE_SIZE = 10;

const TYPE_STYLES = {
  Remote:  { bg: 'rgba(16,185,129,0.12)', color: '#6EE7B7', border: 'rgba(16,185,129,0.25)' },
  Onsite:  { bg: 'rgba(6,182,212,0.12)',  color: '#67E8F9', border: 'rgba(6,182,212,0.25)' },
  Hybrid:  { bg: 'rgba(124,58,237,0.12)', color: '#C4B5FD', border: 'rgba(124,58,237,0.25)' },
};

const LOGO_BG_STYLE = (color) => ({
  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
  background: `${color}18`,
  border: `2px solid ${color}35`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, fontWeight: 900, color, fontFamily: 'Outfit',
});

const getLogoInitials = (company) => company.substring(0, 2).toUpperCase();

/* ── Skill multi-select ── */
const SkillChip = ({ skill, selected, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.93 }}
    onClick={() => onClick(skill)}
    style={{
      padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
      border: `1px solid ${selected ? 'rgba(124,58,237,0.5)' : 'rgba(71,85,105,0.3)'}`,
      background: selected ? 'rgba(124,58,237,0.2)' : 'rgba(15,23,42,0.4)',
      color: selected ? '#C4B5FD' : '#64748B', transition: 'all 0.2s',
    }}
  >
    {skill}
  </motion.button>
);

/* ── Type Badge ── */
const TypeBadge = ({ type }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Onsite;
  const icons = { Remote: Wifi, Onsite: Monitor, Hybrid: Users2 };
  const Icon = icons[type] || Monitor;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <Icon size={10} /> {type}
    </span>
  );
};

/* ── Job Card ── */
const JobCard = ({ job, saved, onSave }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    whileHover={{ y: -3, borderColor: 'rgba(124,58,237,0.3)' }}
    style={{
      background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.14)',
      borderRadius: 18, padding: 22, cursor: 'default',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      position: 'relative', overflow: 'hidden',
    }}
  >
    {/* Featured glow strip */}
    {job.featured && (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
    )}

    {/* Header Row */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
      <div style={LOGO_BG_STYLE(job.logoColor)}>
        {getLogoInitials(job.company)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F1F5F9', marginBottom: 3, fontFamily: 'Outfit' }}>
              {job.role}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: job.logoColor }}>{job.company}</span>
              {job.featured && <BadgeCheck size={13} style={{ color: '#06B6D4' }} />}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onSave(job.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
          >
            {saved
              ? <BookmarkCheck size={18} style={{ color: '#7C3AED' }} />
              : <Bookmark size={18} style={{ color: '#334155' }} />}
          </motion.button>
        </div>
      </div>
    </div>

    {/* Meta Row */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12, alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
        <MapPin size={12} /> {job.location}
      </span>
      <TypeBadge type={job.locationType} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100,
        fontSize: 11, fontWeight: 700,
        background: job.experience === 'Fresher' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
        color: job.experience === 'Fresher' ? '#6EE7B7' : '#FDE68A',
        border: `1px solid ${job.experience === 'Fresher' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
      }}>
        <GraduationCap size={10} /> {job.experience}
      </span>
    </div>

    {/* Salary */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <DollarSign size={13} style={{ color: '#10B981' }} />
      <span style={{ fontSize: 14, fontWeight: 800, color: '#6EE7B7', fontFamily: 'Outfit' }}>{job.salary}</span>
    </div>

    {/* Description */}
    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
      {job.description}
    </p>

    {/* Skills */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
      {job.skills.slice(0, 5).map(skill => (
        <span key={skill} style={{
          padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
          background: 'rgba(99,102,241,0.08)', color: '#818CF8',
          border: '1px solid rgba(99,102,241,0.18)',
        }}>
          {skill}
        </span>
      ))}
      {job.skills.length > 5 && (
        <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, color: '#334155', border: '1px solid rgba(71,85,105,0.2)' }}>
          +{job.skills.length - 5} more
        </span>
      )}
    </div>

    {/* Footer */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#334155' }}>
        <Clock size={11} />
        {job.posted === 0 ? 'Today' : job.posted === 1 ? '1 day ago' : `${job.posted} days ago`}
      </span>
      <motion.a
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ padding: '9px 20px', fontSize: 13, gap: 6 }}
      >
        Apply Now <ExternalLink size={13} />
      </motion.a>
    </div>
  </motion.div>
);

/* ── Pagination ── */
const Pagination = ({ page, totalPages, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 }}>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(page - 1)}
      disabled={page === 1}
      style={{
        width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)',
        background: 'rgba(13,22,39,0.8)', cursor: page === 1 ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: page === 1 ? 0.4 : 1, color: '#94A3B8',
      }}
    >
      <ChevronLeft size={16} />
    </motion.button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
      <motion.button
        key={n}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(n)}
        style={{
          width: 38, height: 38, borderRadius: 10, border: `1px solid ${n === page ? 'rgba(124,58,237,0.5)' : 'rgba(99,102,241,0.2)'}`,
          background: n === page ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(13,22,39,0.8)',
          cursor: 'pointer', fontSize: 14, fontWeight: 700,
          color: n === page ? 'white' : '#64748B',
          boxShadow: n === page ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
        }}
      >
        {n}
      </motion.button>
    ))}

    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(page + 1)}
      disabled={page === totalPages}
      style={{
        width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)',
        background: 'rgba(13,22,39,0.8)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: page === totalPages ? 0.4 : 1, color: '#94A3B8',
      }}
    >
      <ChevronRight size={16} />
    </motion.button>
  </div>
);

/* ─────────────────── MAIN COMPONENT ─────────────────── */
const JobPortal = () => {
  const [mode, setMode] = useState('job'); // 'job' | 'internship'
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState('All');
  const [locationType, setLocationType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedJobs') || '[]'); }
    catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Persist saved jobs
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((id) => {
    setSavedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  }, []);

  const toggleSkill = useCallback((skill) => {
    setSelectedSkills(s => s.includes(skill) ? s.filter(x => x !== skill) : [...s, skill]);
    setPage(1);
  }, []);

  const filteredJobs = useMemo(() => {
    let jobs = ALL_JOBS.filter(j => (showSaved ? savedIds.includes(j.id) : j.type === mode));
    if (search) jobs = jobs.filter(j =>
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
    if (selectedSkills.length > 0) jobs = jobs.filter(j => selectedSkills.some(s => j.skills.includes(s)));
    if (location !== 'All') jobs = jobs.filter(j => j.location.includes(location));
    if (locationType !== 'All') jobs = jobs.filter(j => j.locationType === locationType);
    if (experience !== 'All') jobs = jobs.filter(j => j.experience === experience);
    return jobs;
  }, [mode, search, selectedSkills, location, locationType, experience, savedIds, showSaved]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const pagedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featuredJobs = ALL_JOBS.filter(j => j.featured && j.type === mode);

  const resetFilters = () => {
    setSearch(''); setSelectedSkills([]); setLocation('All');
    setLocationType('All'); setExperience('All'); setPage(1);
  };
  const hasFilters = search || selectedSkills.length > 0 || location !== 'All' || locationType !== 'All' || experience !== 'All';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 28,
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(124,58,237,0.08) 100%)',
          border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} style={{ color: '#67E8F9' }} />
            </div>
            <span style={{ color: '#67E8F9', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Job Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Find Your <span className="gradient-text">Dream Job</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>
            {ALL_JOBS.filter(j => j.type === 'job').length} jobs · {ALL_JOBS.filter(j => j.type === 'internship').length} internships · Updated daily
          </p>
        </div>

        {/* Saved Jobs btn */}
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setShowSaved(s => !s); setPage(1); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            background: showSaved ? 'rgba(124,58,237,0.2)' : 'rgba(13,22,39,0.8)',
            border: `1px solid ${showSaved ? 'rgba(124,58,237,0.5)' : 'rgba(99,102,241,0.2)'}`,
            color: showSaved ? '#C4B5FD' : '#64748B',
          }}
        >
          <BookmarkCheck size={16} />
          Saved Jobs
          {savedIds.length > 0 && (
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#7C3AED', color: 'white', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {savedIds.length}
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* ── Toggle Jobs / Internships ── */}
      {!showSaved && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {(['job', 'internship']).map(m => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMode(m); setPage(1); }}
              style={{
                padding: '9px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mode === m ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'transparent',
                color: mode === m ? 'white' : '#64748B',
                fontSize: 14, fontWeight: 700, transition: 'all 0.25s',
                boxShadow: mode === m ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {m === 'job' ? '💼 Full-time Jobs' : '🎓 Internships'}
            </motion.button>
          ))}
        </div>
      )}

      {/* ── Search + Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card-static"
        style={{ padding: 20, marginBottom: 24 }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              className="input-field"
              placeholder="Search role, company, or skill..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: 40, fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={14} style={{ color: '#475569' }} />
              </button>
            )}
          </div>

          {/* Location */}
          <select
            className="input-field"
            value={location}
            onChange={e => { setLocation(e.target.value); setPage(1); }}
            style={{ flex: '0 1 160px', padding: '11px 14px', fontSize: 13 }}
          >
            {LOCATIONS.map(l => <option key={l} value={l}>{l === 'All' ? '📍 Location' : l}</option>)}
          </select>

          {/* Type */}
          <select
            className="input-field"
            value={locationType}
            onChange={e => { setLocationType(e.target.value); setPage(1); }}
            style={{ flex: '0 1 150px', padding: '11px 14px', fontSize: 13 }}
          >
            <option value="All">🌐 Work Type</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Experience */}
          <select
            className="input-field"
            value={experience}
            onChange={e => { setExperience(e.target.value); setPage(1); }}
            style={{ flex: '0 1 150px', padding: '11px 14px', fontSize: 13 }}
          >
            {EXPERIENCE_OPTS.map(e => <option key={e} value={e}>{e === 'All' ? '🎯 Experience' : e}</option>)}
          </select>

          {/* Toggle skill filter */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(f => !f)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '11px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: showFilters ? 'rgba(124,58,237,0.15)' : 'rgba(99,102,241,0.07)',
              border: `1px solid ${showFilters ? 'rgba(124,58,237,0.4)' : 'rgba(99,102,241,0.15)'}`,
              color: showFilters ? '#C4B5FD' : '#64748B',
            }}
          >
            <Filter size={13} />
            Skills
            {selectedSkills.length > 0 && (
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#7C3AED', color: 'white', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedSkills.length}
              </span>
            )}
          </motion.button>

          {/* Reset */}
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}
            >
              <X size={13} /> Reset
            </motion.button>
          )}
        </div>

        {/* Skill chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ALL_SKILLS.map(skill => (
                  <SkillChip key={skill} skill={skill} selected={selectedSkills.includes(skill)} onClick={toggleSkill} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Featured jobs strip ── */}
      {!showSaved && !hasFilters && featuredJobs.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Star size={15} style={{ color: '#F59E0B' }} />
            <h2 style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Outfit' }}>Featured Opportunities</h2>
            <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.12)', color: '#FDE68A', border: '1px solid rgba(245,158,11,0.25)' }}>HOT</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={toggleSave} />
            ))}
          </div>
        </div>
      )}

      {/* ── Job Count ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} style={{ color: '#7C3AED' }} />
          <span style={{ color: '#64748B', fontSize: 14 }}>
            Showing <strong style={{ color: '#E2E8F0' }}>{Math.min(PAGE_SIZE, filteredJobs.length - (page - 1) * PAGE_SIZE)}</strong> of <strong style={{ color: '#E2E8F0' }}>{filteredJobs.length}</strong> {showSaved ? 'saved' : mode === 'job' ? 'jobs' : 'internships'}
          </span>
        </div>
        {filteredJobs.length > 0 && (
          <span style={{ fontSize: 13, color: '#334155' }}>Page {page} of {totalPages}</span>
        )}
      </div>

      {/* ── Job Grid ── */}
      {filteredJobs.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {pagedJobs.map(job => (
                <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={toggleSave} />
              ))}
            </AnimatePresence>
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card-static"
          style={{ padding: '64px 20px', textAlign: 'center' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Briefcase size={36} style={{ color: '#334155' }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 8 }}>
            {showSaved ? 'No saved jobs yet' : 'No jobs found'}
          </h3>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 24 }}>
            {showSaved ? 'Save jobs by clicking the bookmark icon on any listing.' : 'Try adjusting your filters or search term.'}
          </p>
          <button className="btn-secondary" onClick={showSaved ? () => setShowSaved(false) : resetFilters}>
            {showSaved ? 'Browse Jobs' : 'Clear Filters'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default JobPortal;
