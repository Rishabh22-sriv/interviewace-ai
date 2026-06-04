import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Star, ChevronRight, X, Filter,
  CheckCircle, AlertCircle, TrendingUp, FileText, Zap,
  ExternalLink, Users, Clock, Building2, Search
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_SKILLS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Go', 'Rust', 'C++',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'Microservices',
  'System Design', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Figma', 'Git', 'Linux'
];

const JOB_LISTINGS = [
  { id: 1, company: 'Google', logo: '🟢', role: 'Senior Frontend Engineer', location: 'Mountain View, CA', type: 'Full-time', salary: '$180K - $240K', requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'System Design', 'AWS'], experience: '4+ years', description: 'Join Google\'s Consumer Products team to build next-gen user interfaces for Google Search, reaching billions of users daily. You\'ll work with a world-class team to create highly performant, accessible, and beautiful interfaces.', resumeImprovements: ['Add specific performance metrics (e.g. reduced bundle size by X%)', 'Mention cross-functional collaboration with design teams', 'Highlight large-scale system experience'], coverLetterTips: ['Lead with your passion for scale and impact', 'Mention specific Google products you\'ve used or analyzed', 'Emphasize collaborative culture fit'], similarJobs: [2, 3] },
  { id: 2, company: 'Meta', logo: '🔵', role: 'Full Stack Engineer', location: 'Menlo Park, CA', type: 'Full-time', salary: '$170K - $230K', requiredSkills: ['React', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL', 'Docker'], experience: '3+ years', description: 'Build products that connect billions of people globally. Work on Facebook, Instagram, or WhatsApp infrastructure with massive scale challenges.', resumeImprovements: ['Quantify user impact of past projects', 'Highlight rapid prototyping experience', 'Add A/B testing and experimentation experience'], coverLetterTips: ['Express genuine interest in connecting people', 'Mention experience with high-scale systems', 'Show entrepreneurial mindset'], similarJobs: [1, 4] },
  { id: 3, company: 'Netflix', logo: '🔴', role: 'Software Engineer — UI Platform', location: 'Los Gatos, CA (Hybrid)', type: 'Full-time', salary: '$175K - $250K', requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'System Design', 'GraphQL', 'Redis'], experience: '5+ years', description: 'Join Netflix\'s UI Platform team to build the foundation that powers the Netflix streaming experience for 260M subscribers worldwide.', resumeImprovements: ['Highlight streaming or media tech experience', 'Emphasize platform-level engineering', 'Show ownership and autonomy in past roles'], coverLetterTips: ['Lead with enthusiasm for entertainment tech', 'Mention scalability challenges you\'ve solved', 'Showcase independent judgment'], similarJobs: [1, 5] },
  { id: 4, company: 'Stripe', logo: '⚡', role: 'Backend Engineer', location: 'San Francisco, CA', type: 'Full-time', salary: '$160K - $220K', requiredSkills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'Kubernetes', 'System Design'], experience: '3+ years', description: 'Help build the economic infrastructure of the internet. Stripe\'s backend powers millions of businesses worldwide with payments, billing, and financial services.', resumeImprovements: ['Add financial systems or payment processing experience', 'Highlight API design and documentation skills', 'Mention reliability and uptime achievements'], coverLetterTips: ['Lead with curiosity about financial infrastructure', 'Show appreciation for developer experience', 'Emphasize technical rigor'], similarJobs: [6, 7] },
  { id: 5, company: 'Airbnb', logo: '🏠', role: 'React Native Engineer', location: 'Remote', type: 'Full-time', salary: '$155K - $205K', requiredSkills: ['React Native', 'React', 'TypeScript', 'GraphQL', 'Swift', 'Kotlin'], experience: '3+ years', description: 'Build world-class mobile experiences for Airbnb\'s 150M+ users. You\'ll own features from concept to production on both iOS and Android platforms.', resumeImprovements: ['Include App Store ratings or user reviews for shipped apps', 'Add mobile performance metrics', 'Mention cross-platform architecture experience'], coverLetterTips: ['Express love for travel and community', 'Highlight native mobile experience depth', 'Show customer empathy'], similarJobs: [3, 8] },
  { id: 6, company: 'Shopify', logo: '🛍️', role: 'Senior Backend Engineer', location: 'Remote (Canada preferred)', type: 'Full-time', salary: '$140K - $190K', requiredSkills: ['Ruby on Rails', 'Go', 'PostgreSQL', 'Redis', 'Kubernetes', 'REST APIs', 'Docker'], experience: '4+ years', description: 'Power the future of commerce. Shopify empowers 2M+ merchants globally and you\'ll build the infrastructure that processes $200B+ in transactions.', resumeImprovements: ['Highlight ecommerce domain knowledge', 'Mention high-throughput transaction processing', 'Add merchant-facing tooling experience'], coverLetterTips: ['Show passion for merchant success', 'Highlight distributed systems knowledge', 'Mention experience with high-volume systems'], similarJobs: [4, 9] },
  { id: 7, company: 'Figma', logo: '🎨', role: 'Frontend Engineer', location: 'San Francisco, CA (Hybrid)', type: 'Full-time', salary: '$155K - $215K', requiredSkills: ['React', 'TypeScript', 'WebAssembly', 'Canvas API', 'System Design', 'REST APIs'], experience: '3+ years', description: 'Build the next generation of collaborative design tools used by 4M+ designers daily. Work on Figma\'s editor, real-time collaboration, or plugin ecosystem.', resumeImprovements: ['Add graphics programming or WebGL experience', 'Highlight creative tool or editor development', 'Mention real-time collaboration systems'], coverLetterTips: ['Lead with design-engineering intersection passion', 'Reference specific Figma features you admire', 'Show collaborative spirit'], similarJobs: [1, 3] },
  { id: 8, company: 'Vercel', logo: '▲', role: 'DevOps / Platform Engineer', location: 'Remote', type: 'Full-time', salary: '$135K - $185K', requiredSkills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Node.js'], experience: '3+ years', description: 'Scale the infrastructure powering millions of deployments. Vercel\'s edge network serves Next.js and frontend deployments for some of the world\'s largest brands.', resumeImprovements: ['Add specific IaC projects with Terraform or Pulumi', 'Include SLO/SLA achievements', 'Highlight edge computing or CDN experience'], coverLetterTips: ['Show passion for developer experience', 'Highlight multi-region system design', 'Express excitement about the Jamstack ecosystem'], similarJobs: [4, 10] },
  { id: 9, company: 'OpenAI', logo: '🤖', role: 'ML Engineer', location: 'San Francisco, CA', type: 'Full-time', salary: '$190K - $280K', requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker', 'System Design'], experience: '4+ years', description: 'Work at the frontier of AI research and deployment. Help build, train, and deploy large language models and other AI systems that are transforming industries.', resumeImprovements: ['Add ML paper publications or Kaggle rankings', 'Include training run scale (parameters, compute)', 'Highlight research contributions'], coverLetterTips: ['Lead with AI safety consciousness', 'Show deep technical ML depth', 'Mention specific research you\'ve studied'], similarJobs: [10, 11] },
  { id: 10, company: 'Anthropic', logo: '🦋', role: 'AI Safety Researcher / Engineer', location: 'San Francisco, CA', type: 'Full-time', salary: '$180K - $260K', requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Data Analysis', 'System Design', 'Research'], experience: '3+ years', description: 'Join Anthropic to work on making AI systems that are safe, beneficial, and understandable. Work alongside world-class researchers on frontier models.', resumeImprovements: ['Add research publications in ML/AI', 'Include interpretability or alignment project work', 'Highlight mathematical foundations'], coverLetterTips: ['Express nuanced view of AI risks', 'Show deep alignment with safety mission', 'Highlight interdisciplinary thinking'], similarJobs: [9, 11] },
  { id: 11, company: 'Notion', logo: '📓', role: 'Full Stack Engineer', location: 'New York, NY (Hybrid)', type: 'Full-time', salary: '$145K - $195K', requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Docker'], experience: '2+ years', description: 'Help millions of people organize their lives and work. Notion is one of the fastest-growing productivity tools and you\'ll build features that delight users daily.', resumeImprovements: ['Highlight collaborative product development', 'Add user-centric design decisions in past roles', 'Include product thinking and roadmap contribution'], coverLetterTips: ['Show Notion product passion', 'Express love for productivity and tools', 'Highlight thoughtful UI decision-making'], similarJobs: [7, 12] },
  { id: 12, company: 'Linear', logo: '⭕', role: 'Product Engineer', location: 'Remote', type: 'Full-time', salary: '$140K - $190K', requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'System Design', 'Git'], experience: '3+ years', description: 'Build the issue tracker that top teams love. Linear is known for its speed, thoughtful design, and developer-centric philosophy. Every team member ships features.', resumeImprovements: ['Emphasize product instincts and taste', 'Add examples of performance optimizations', 'Highlight autonomous project ownership'], coverLetterTips: ['Reference Linear\'s design philosophy', 'Show appreciation for developer tools', 'Emphasize speed obsession'], similarJobs: [11, 7] },
  { id: 13, company: 'Datadog', logo: '🐕', role: 'Backend Engineer — Observability', location: 'New York, NY', type: 'Full-time', salary: '$155K - $210K', requiredSkills: ['Go', 'Python', 'Kubernetes', 'Docker', 'PostgreSQL', 'Microservices', 'System Design', 'AWS'], experience: '4+ years', description: 'Build the observability platform that monitors 25,000+ companies. Work on metrics, logs, traces, and the infrastructure that handles trillions of data points.', resumeImprovements: ['Add distributed tracing or monitoring experience', 'Include SRE or on-call rotation experience', 'Highlight time-series database knowledge'], coverLetterTips: ['Show passion for reliability engineering', 'Emphasize data pipeline experience', 'Reference specific observability challenges you\'ve solved'], similarJobs: [4, 8] },
  { id: 14, company: 'GitHub', logo: '🐙', role: 'Senior Software Engineer', location: 'Remote', type: 'Full-time', salary: '$150K - $205K', requiredSkills: ['Ruby on Rails', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Git', 'Kubernetes'], experience: '4+ years', description: 'Build the platform that 100M+ developers use to collaborate. Work on GitHub\'s core features including Copilot integration, Actions, or the social coding experience.', resumeImprovements: ['Highlight open source contributions', 'Add developer tools or CLI experience', 'Include community engagement and mentorship'], coverLetterTips: ['Lead with open source passion', 'Reference your GitHub profile and contributions', 'Show collaborative community spirit'], similarJobs: [12, 8] },
  { id: 15, company: 'Coinbase', logo: '🪙', role: 'Blockchain / Web3 Engineer', location: 'Remote', type: 'Full-time', salary: '$155K - $215K', requiredSkills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker', 'System Design'], experience: '3+ years', description: 'Build the financial infrastructure for Web3. Coinbase processes $500B+ in crypto transactions and you\'ll work on wallets, exchanges, or DeFi integrations.', resumeImprovements: ['Add blockchain or crypto project experience', 'Highlight security consciousness in past work', 'Include smart contract knowledge if applicable'], coverLetterTips: ['Express genuine crypto/web3 enthusiasm', 'Show security-first mindset', 'Reference specific DeFi protocols you understand'], similarJobs: [4, 6] },
];

// ─── Score Badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({ score, size = 'md' }) => {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  const bg = score >= 80 ? 'rgba(16,185,129,0.15)' : score >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
  const border = score >= 80 ? 'rgba(16,185,129,0.35)' : score >= 60 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)';
  return (
    <div style={{
      background: bg, border: `2px solid ${border}`, borderRadius: size === 'lg' ? 16 : 10,
      padding: size === 'lg' ? '12px 20px' : '6px 12px', textAlign: 'center', minWidth: size === 'lg' ? 90 : 60,
    }}>
      <div style={{ fontSize: size === 'lg' ? 28 : 18, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{score}%</div>
      {size === 'lg' && <div style={{ color: '#64748B', fontSize: 10, fontWeight: 700, marginTop: 2 }}>Match</div>}
    </div>
  );
};

// ─── Skill Chip ───────────────────────────────────────────────────────────────
const SkillChip = ({ label, matched }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
    background: matched ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
    border: `1px solid ${matched ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
    borderRadius: 20, color: matched ? '#10B981' : '#EF4444',
    fontSize: 11, fontWeight: 600, margin: '2px',
  }}>
    {matched ? <CheckCircle size={9} /> : <AlertCircle size={9} />} {label}
  </span>
);

// ─── Selectable Skill ─────────────────────────────────────────────────────────
const SelectableSkill = ({ label, selected, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{
      padding: '5px 13px', borderRadius: 20, border: `1px solid ${selected ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
      background: selected ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
      color: selected ? '#A78BFA' : '#64748B', fontSize: 12, fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.18s', margin: '3px',
    }}
  >{label}</motion.button>
);

// ─── Compute Match ────────────────────────────────────────────────────────────
const computeMatch = (userSkills, job) => {
  if (!userSkills.length) return { score: 0, matched: [], missing: job.requiredSkills };
  const matched = job.requiredSkills.filter(s => userSkills.includes(s));
  const missing = job.requiredSkills.filter(s => !userSkills.includes(s));
  const score = Math.round((matched.length / job.requiredSkills.length) * 100);
  return { score, matched, missing };
};

// ─── Job Card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, match, onView, highlight }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    style={{
      background: highlight ? 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))' : 'rgba(13,22,39,0.8)',
      border: `1px solid ${highlight ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 18, padding: 22, backdropFilter: 'blur(12px)', cursor: 'pointer',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
    }}
  >
    {highlight && (
      <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', padding: '4px 14px', borderBottomLeftRadius: 12, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>BEST MATCH</div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>{job.logo}</div>
        <div>
          <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{job.company}</p>
          <p style={{ color: '#E2E8F0', fontSize: 15, fontWeight: 700, margin: '2px 0', fontFamily: 'Outfit, sans-serif' }}>{job.role}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={11} style={{ color: '#64748B' }} />
            <span style={{ color: '#64748B', fontSize: 11 }}>{job.location}</span>
            <span style={{ color: '#475569', fontSize: 11 }}>• {job.type}</span>
          </div>
        </div>
      </div>
      <ScoreBadge score={match.score} size="md" />
    </div>

    <div style={{ marginBottom: 12 }}>
      <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 5 }}>Matching</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 8 }}>
        {match.matched.slice(0, 4).map(s => <SkillChip key={s} label={s} matched />)}
        {match.matched.length > 4 && <span style={{ fontSize: 11, color: '#10B981', padding: '3px 8px', alignSelf: 'center' }}>+{match.matched.length - 4}</span>}
      </div>
      {match.missing.length > 0 && (
        <>
          <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 5 }}>Missing</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {match.missing.slice(0, 3).map(s => <SkillChip key={s} label={s} matched={false} />)}
            {match.missing.length > 3 && <span style={{ fontSize: 11, color: '#EF4444', padding: '3px 8px', alignSelf: 'center' }}>+{match.missing.length - 3}</span>}
          </div>
        </>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {match.missing.length > 0 && (
          <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>
            {match.missing.length} resume gaps
          </span>
        )}
        <span style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>
          ~{Math.max(5, match.score - 10)}% selection chance
        </span>
      </div>
      <motion.button
        onClick={() => onView(job, match)}
        whileHover={{ scale: 1.06 }}
        style={{ padding: '7px 16px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 10, color: '#A78BFA', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        View Details <ChevronRight size={13} />
      </motion.button>
    </div>
  </motion.div>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ job, match, onClose, allJobs, allMatches }) => {
  const similar = job.similarJobs.map(id => allJobs.find(j => j.id === id)).filter(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,11,24,0.88)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(13,22,39,0.98)', border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 24, padding: '36px', maxWidth: 700, width: '100%',
          maxHeight: '88vh', overflowY: 'auto', backdropFilter: 'blur(20px)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '1px solid rgba(255,255,255,0.1)' }}>{job.logo}</div>
            <div>
              <p style={{ color: '#7C3AED', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>{job.company}</p>
              <h2 style={{ color: '#E2E8F0', fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '4px 0' }}>{job.role}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#64748B', fontSize: 12 }}>{job.location}</span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ color: '#64748B', fontSize: 12 }}>{job.salary}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ScoreBadge score={match.score} size="lg" />
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>About this Role</h3>
          <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{job.description}</p>
        </div>

        {/* Match Breakdown */}
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Match Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[
              { label: 'Skills Match', val: `${match.score}%`, color: match.score >= 80 ? '#10B981' : match.score >= 60 ? '#F59E0B' : '#EF4444' },
              { label: 'Experience', val: job.experience, color: '#7C3AED' },
              { label: 'Role Fit', val: `${Math.max(40, match.score - 5)}%`, color: '#06B6D4' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}20`, borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                <div style={{ color: '#64748B', fontSize: 11, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Matching Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{match.matched.map(s => <SkillChip key={s} label={s} matched />)}</div>
          </div>
          {match.missing.length > 0 && (
            <div>
              <p style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Missing Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>{match.missing.map(s => <SkillChip key={s} label={s} matched={false} />)}</div>
            </div>
          )}
        </div>

        {/* Resume Improvements */}
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileText size={16} style={{ color: '#EF4444' }} />
            <h3 style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, margin: 0 }}>Resume Improvements for This Job</h3>
          </div>
          {job.resumeImprovements.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13, color: '#94A3B8' }}>
              <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {r}
            </div>
          ))}
        </div>

        {/* Cover Letter Tips */}
        <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Zap size={16} style={{ color: '#06B6D4' }} />
            <h3 style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, margin: 0 }}>Cover Letter Tips</h3>
          </div>
          {job.coverLetterTips.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13, color: '#94A3B8' }}>
              <span style={{ color: '#06B6D4', flexShrink: 0 }}>→</span> {t}
            </div>
          ))}
        </div>

        {/* Similar Jobs */}
        {similar.length > 0 && (
          <div>
            <h3 style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Similar Roles You Might Like</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              {similar.map(j => {
                const m = allMatches[j.id];
                return (
                  <div key={j.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{j.logo}</span>
                      <div>
                        <p style={{ color: '#94A3B8', fontSize: 10, margin: 0 }}>{j.company}</p>
                        <p style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 700, margin: 0 }}>{j.role}</p>
                      </div>
                    </div>
                    {m && <ScoreBadge score={m.score} size="sm" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          style={{ marginTop: 24, width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <ExternalLink size={17} /> Apply Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const JobMatchScore = () => {
  const [selectedSkills, setSelectedSkills] = useState(['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Docker']);
  const [filterMatch, setFilterMatch] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [detailJob, setDetailJob] = useState(null);
  const [skillSearch, setSkillSearch] = useState('');

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const allMatches = useMemo(() => {
    const result = {};
    JOB_LISTINGS.forEach(job => {
      result[job.id] = computeMatch(selectedSkills, job);
    });
    return result;
  }, [selectedSkills]);

  const sortedJobs = useMemo(() => {
    return [...JOB_LISTINGS].sort((a, b) => allMatches[b.id].score - allMatches[a.id].score);
  }, [allMatches]);

  const filteredJobs = useMemo(() => {
    return sortedJobs.filter(job => {
      const m = allMatches[job.id];
      if (filterMatch === '80+' && m.score < 80) return false;
      if (filterMatch === '60+' && m.score < 60) return false;
      if (filterType !== 'all' && job.type !== filterType) return false;
      return true;
    });
  }, [sortedJobs, filterMatch, filterType, allMatches]);

  const top3 = sortedJobs.slice(0, 3);
  const filteredSkills = ALL_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()));

  const filterBtnStyle = (active) => ({
    padding: '7px 16px', borderRadius: 20,
    background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${active ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.07)'}`,
    color: active ? '#A78BFA' : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={26} style={{ color: '#10B981' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
              AI Job <span style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Match Score</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0, marginTop: 2 }}>See how well you match 15 premium jobs from top companies — instantly</p>
          </div>
        </div>
      </motion.div>

      {/* Skills Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 28, marginBottom: 24, backdropFilter: 'blur(12px)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ color: '#E2E8F0', fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0 }}>My Skills</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#7C3AED', fontSize: 13, fontWeight: 700, background: 'rgba(124,58,237,0.15)', padding: '4px 12px', borderRadius: 20 }}>{selectedSkills.length} selected</span>
            {selectedSkills.length > 0 && (
              <button onClick={() => setSelectedSkills([])} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '4px 12px', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
            )}
          </div>
        </div>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            style={{ width: '100%', padding: '9px 14px 9px 34px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, color: '#E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            placeholder="Filter skills..."
            value={skillSearch}
            onChange={e => setSkillSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredSkills.map(s => (
            <SelectableSkill key={s} label={s} selected={selectedSkills.includes(s)} onClick={() => toggleSkill(s)} />
          ))}
        </div>
      </motion.div>

      {/* Best Match Hero */}
      {selectedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Star size={18} style={{ color: '#F59E0B' }} />
            <h2 style={{ color: '#E2E8F0', fontSize: 17, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0 }}>🏆 Top 3 Best Matches for You</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {top3.map((job, i) => {
              const match = allMatches[job.id];
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setDetailJob({ job, match })}
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.07))',
                    border: '1px solid rgba(124,58,237,0.35)', borderRadius: 18, padding: '22px 20px',
                    cursor: 'pointer', backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 18 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{job.logo}</div>
                  <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 3px' }}>{job.company}</p>
                  <p style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: '0 0 12px' }}>{job.role}</p>
                  <ScoreBadge score={match.score} size="md" />
                  <p style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>{match.matched.length}/{job.requiredSkills.length} skills matched</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}
      >
        <Filter size={15} style={{ color: '#64748B' }} />
        <span style={{ color: '#64748B', fontSize: 13, fontWeight: 600 }}>Filter by match:</span>
        {[{ label: 'All', val: 'all' }, { label: '>80% Match', val: '80+' }, { label: '>60% Match', val: '60+' }].map(({ label, val }) => (
          <button key={val} onClick={() => setFilterMatch(val)} style={filterBtnStyle(filterMatch === val)}>{label}</button>
        ))}
        <span style={{ color: '#475569', fontSize: 13 }}>•</span>
        {['Full-time', 'Remote'].map(t => (
          <button key={t} onClick={() => setFilterType(filterType === t ? 'all' : t)} style={filterBtnStyle(filterType === t)}>{t}</button>
        ))}
        <span style={{ color: '#7C3AED', fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}>{filteredJobs.length} jobs</span>
      </motion.div>

      {/* Job Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {filteredJobs.map((job, i) => {
          const match = allMatches[job.id];
          return (
            <JobCard
              key={job.id}
              job={job}
              match={match}
              onView={(j, m) => setDetailJob({ job: j, match: m })}
              highlight={i < 3 && filterMatch === 'all'}
            />
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}
        >
          <Briefcase size={52} style={{ color: '#334155', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: '#64748B', fontSize: 15 }}>No jobs match your current filters. Try adjusting the match percentage filter.</p>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {detailJob && (
          <DetailModal
            job={detailJob.job}
            match={detailJob.match}
            onClose={() => setDetailJob(null)}
            allJobs={JOB_LISTINGS}
            allMatches={allMatches}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobMatchScore;
