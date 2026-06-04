import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, Download, Eye, Save, Plus, Trash2,
  User, Briefcase, GraduationCap, Code, FolderGit2,
  Award, ChevronDown, ChevronUp, Zap, Check, Palette
} from 'lucide-react';

const TEMPLATES = [
  { id: 'ats', name: 'ATS Friendly', desc: 'Optimized for ATS scanners', color: '#10B981', accent: '#059669' },
  { id: 'modern', name: 'Modern', desc: 'Clean and contemporary', color: '#7C3AED', accent: '#6D28D9' },
  { id: 'professional', name: 'Professional', desc: 'Classic corporate style', color: '#06B6D4', accent: '#0891B2' },
];

const emptyResume = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
  education: [{ id: 1, degree: '', institution: '', year: '', cgpa: '', relevant: '' }],
  experience: [{ id: 1, title: '', company: '', duration: '', location: '', points: ['', ''] }],
  skills: { languages: '', frameworks: '', tools: '', databases: '' },
  projects: [{ id: 1, name: '', tech: '', points: ['', ''] }],
  certifications: [{ id: 1, name: '', issuer: '', year: '' }],
};

// ── Section Wrapper ─────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, color, children, onAdd, addLabel }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 20, background: 'rgba(13,22,39,0.7)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={16} style={{ color }} />
          </div>
          <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 15, fontFamily: 'Outfit' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: '#475569' }} /> : <ChevronDown size={16} style={{ color: '#475569' }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 20px 20px' }}>
              {children}
              {onAdd && (
                <button onClick={onAdd} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 9, padding: '8px 14px', color, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={13} /> {addLabel}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type = 'text', rows }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ color: '#64748B', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>}
    {rows ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: '100%', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '10px 14px', color: '#E2E8F0', fontSize: 14, fontFamily: 'Inter', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '10px 14px', color: '#E2E8F0', fontSize: 14, fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box' }} />
    )}
  </div>
);

// ── Resume Preview ───────────────────────────────────────────────────────────
const ResumePreview = ({ data, template }) => {
  const tpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
  const { personal, education, experience, skills, projects, certifications } = data;

  return (
    <div id="resume-preview" style={{ background: 'white', color: '#1E293B', fontFamily: 'Arial, sans-serif', padding: '32px 36px', minHeight: '842px', fontSize: 12, lineHeight: 1.5, maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${tpl.accent}`, paddingBottom: 14, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: tpl.accent }}>{personal.name || 'Your Name'}</h1>
        <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap', color: '#475569', fontSize: 11 }}>
          {personal.email && <span>📧 {personal.email}</span>}
          {personal.phone && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>💼 {personal.linkedin}</span>}
          {personal.github && <span>🐙 {personal.github}</span>}
        </div>
        {personal.summary && <p style={{ marginTop: 10, color: '#334155', fontSize: 12 }}>{personal.summary}</p>}
      </div>

      {/* Education */}
      {education.some(e => e.institution) && (
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: tpl.accent, borderBottom: `1px solid ${tpl.accent}40`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Education</h2>
          {education.filter(e => e.institution).map(e => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.degree}</strong><span style={{ color: '#64748B' }}>{e.year}</span>
              </div>
              <div style={{ color: '#475569' }}>{e.institution} {e.cgpa && `| CGPA: ${e.cgpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company) && (
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: tpl.accent, borderBottom: `1px solid ${tpl.accent}40`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Experience</h2>
          {experience.filter(e => e.company).map(e => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.title} — {e.company}</strong><span style={{ color: '#64748B' }}>{e.duration}</span>
              </div>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {e.points.filter(p => p).map((p, i) => <li key={i} style={{ color: '#475569', marginBottom: 2 }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {Object.values(skills).some(v => v) && (
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: tpl.accent, borderBottom: `1px solid ${tpl.accent}40`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Technical Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {skills.languages && <div><strong>Languages:</strong> {skills.languages}</div>}
            {skills.frameworks && <div><strong>Frameworks:</strong> {skills.frameworks}</div>}
            {skills.tools && <div><strong>Tools:</strong> {skills.tools}</div>}
            {skills.databases && <div><strong>Databases:</strong> {skills.databases}</div>}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: tpl.accent, borderBottom: `1px solid ${tpl.accent}40`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Projects</h2>
          {projects.filter(p => p.name).map(p => (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>{p.tech && <span style={{ color: '#64748B' }}> | {p.tech}</span>}
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {p.points.filter(pt => pt).map((pt, i) => <li key={i} style={{ color: '#475569', marginBottom: 2 }}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.some(c => c.name) && (
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: tpl.accent, borderBottom: `1px solid ${tpl.accent}40`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Certifications</h2>
          {certifications.filter(c => c.name).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span><strong>{c.name}</strong> — {c.issuer}</span>
              <span style={{ color: '#64748B' }}>{c.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const [resume, setResume] = useState(emptyResume);
  const [template, setTemplate] = useState('ats');
  const [activeTab, setActiveTab] = useState('edit');
  const [saved, setSaved] = useState(false);

  const update = (section, value) => setResume(r => ({ ...r, [section]: value }));
  const updatePersonal = (field, val) => update('personal', { ...resume.personal, [field]: val });
  const updateSkills = (field, val) => update('skills', { ...resume.skills, [field]: val });

  const addEducation = () => update('education', [...resume.education, { id: Date.now(), degree: '', institution: '', year: '', cgpa: '', relevant: '' }]);
  const addExperience = () => update('experience', [...resume.experience, { id: Date.now(), title: '', company: '', duration: '', location: '', points: ['', ''] }]);
  const addProject = () => update('projects', [...resume.projects, { id: Date.now(), name: '', tech: '', points: ['', ''] }]);
  const addCert = () => update('certifications', [...resume.certifications, { id: Date.now(), name: '', issuer: '', year: '' }]);

  const updateEdu = (id, field, val) => update('education', resume.education.map(e => e.id === id ? { ...e, [field]: val } : e));
  const updateExp = (id, field, val) => update('experience', resume.experience.map(e => e.id === id ? { ...e, [field]: val } : e));
  const updateExpPoint = (id, i, val) => update('experience', resume.experience.map(e => e.id === id ? { ...e, points: e.points.map((p, pi) => pi === i ? val : p) } : e));
  const updateProj = (id, field, val) => update('projects', resume.projects.map(p => p.id === id ? { ...p, [field]: val } : p));
  const updateProjPoint = (id, i, val) => update('projects', resume.projects.map(p => p.id === id ? { ...p, points: p.points.map((pt, pi) => pi === i ? val : pt) } : p));
  const updateCert = (id, field, val) => update('certifications', resume.certifications.map(c => c.id === id ? { ...c, [field]: val } : c));

  const handleSave = () => {
    localStorage.setItem('interviewace_resume', JSON.stringify(resume));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const tpl = TEMPLATES.find(t => t.id === template);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
            <span className="gradient-text">AI Resume Builder</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>Create a professional, ATS-optimized resume in minutes</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleSave} className="btn-secondary" style={{ padding: '10px 18px', fontSize: 14 }}>
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save</>}
          </button>
          <button onClick={handleDownloadPDF} className="btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
            <Download size={15} /> Download PDF
          </button>
        </div>
      </motion.div>

      {/* Template Selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
          <Palette size={15} style={{ color: '#64748B' }} />
          <span style={{ color: '#64748B', fontSize: 13, fontWeight: 600 }}>Template:</span>
        </div>
        {TEMPLATES.map(t => (
          <motion.button key={t.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setTemplate(t.id)}
            style={{ padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${template === t.id ? t.color : 'rgba(99,102,241,0.15)'}`, background: template === t.id ? `${t.color}15` : 'rgba(13,22,39,0.6)', color: template === t.id ? t.color : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {template === t.id && <Check size={12} />} {t.name}
          </motion.button>
        ))}
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[{ id: 'edit', label: 'Edit', icon: FileText }, { id: 'preview', label: 'Preview', icon: Eye }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 9, border: 'none', background: activeTab === tab.id ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'transparent', color: activeTab === tab.id ? 'white' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'edit' ? '1fr' : '1fr', gap: 24 }}>
        {activeTab === 'edit' ? (
          <div>
            {/* Personal Info */}
            <Section title="Personal Information" icon={User} color="#7C3AED">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Full Name" value={resume.personal.name} onChange={v => updatePersonal('name', v)} placeholder="Rishabh Srivastava" />
                <Field label="Email" value={resume.personal.email} onChange={v => updatePersonal('email', v)} placeholder="rishabh@gmail.com" type="email" />
                <Field label="Phone" value={resume.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+91 9999999999" />
                <Field label="Location" value={resume.personal.location} onChange={v => updatePersonal('location', v)} placeholder="Lucknow, India" />
                <Field label="LinkedIn" value={resume.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/rishabh" />
                <Field label="GitHub" value={resume.personal.github} onChange={v => updatePersonal('github', v)} placeholder="github.com/Rishabh22-sriv" />
              </div>
              <Field label="Professional Summary" value={resume.personal.summary} onChange={v => updatePersonal('summary', v)} placeholder="Results-driven developer with X years of experience..." rows={3} />
            </Section>

            {/* Education */}
            <Section title="Education" icon={GraduationCap} color="#06B6D4" onAdd={addEducation} addLabel="Add Education">
              {resume.education.map(e => (
                <div key={e.id} style={{ background: 'rgba(99,102,241,0.04)', borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid rgba(99,102,241,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Degree/Course" value={e.degree} onChange={v => updateEdu(e.id, 'degree', v)} placeholder="B.Tech Computer Science" />
                    <Field label="Institution" value={e.institution} onChange={v => updateEdu(e.id, 'institution', v)} placeholder="AKTU, Lucknow" />
                    <Field label="Year" value={e.year} onChange={v => updateEdu(e.id, 'year', v)} placeholder="2021 – 2025" />
                    <Field label="CGPA/Percentage" value={e.cgpa} onChange={v => updateEdu(e.id, 'cgpa', v)} placeholder="8.5/10" />
                  </div>
                </div>
              ))}
            </Section>

            {/* Experience */}
            <Section title="Work Experience" icon={Briefcase} color="#10B981" onAdd={addExperience} addLabel="Add Experience">
              {resume.experience.map(e => (
                <div key={e.id} style={{ background: 'rgba(99,102,241,0.04)', borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid rgba(99,102,241,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Job Title" value={e.title} onChange={v => updateExp(e.id, 'title', v)} placeholder="Software Engineer Intern" />
                    <Field label="Company" value={e.company} onChange={v => updateExp(e.id, 'company', v)} placeholder="Amazon" />
                    <Field label="Duration" value={e.duration} onChange={v => updateExp(e.id, 'duration', v)} placeholder="Jun 2024 – Aug 2024" />
                    <Field label="Location" value={e.location} onChange={v => updateExp(e.id, 'location', v)} placeholder="Bangalore, India" />
                  </div>
                  {e.points.map((p, i) => (
                    <Field key={i} label={`Bullet ${i + 1}`} value={p} onChange={v => updateExpPoint(e.id, i, v)} placeholder="• Developed X feature that improved Y by Z%" />
                  ))}
                </div>
              ))}
            </Section>

            {/* Skills */}
            <Section title="Technical Skills" icon={Code} color="#F59E0B">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Languages" value={resume.skills.languages} onChange={v => updateSkills('languages', v)} placeholder="Python, Java, C++, JavaScript" />
                <Field label="Frameworks" value={resume.skills.frameworks} onChange={v => updateSkills('frameworks', v)} placeholder="React, Node.js, Spring Boot" />
                <Field label="Tools & Platforms" value={resume.skills.tools} onChange={v => updateSkills('tools', v)} placeholder="Git, Docker, AWS, VS Code" />
                <Field label="Databases" value={resume.skills.databases} onChange={v => updateSkills('databases', v)} placeholder="MongoDB, MySQL, PostgreSQL" />
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects" icon={FolderGit2} color="#EC4899" onAdd={addProject} addLabel="Add Project">
              {resume.projects.map(p => (
                <div key={p.id} style={{ background: 'rgba(99,102,241,0.04)', borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid rgba(99,102,241,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Project Name" value={p.name} onChange={v => updateProj(p.id, 'name', v)} placeholder="InterviewAce AI" />
                    <Field label="Tech Stack" value={p.tech} onChange={v => updateProj(p.id, 'tech', v)} placeholder="React, Node.js, MongoDB" />
                  </div>
                  {p.points.map((pt, i) => (
                    <Field key={i} label={`Point ${i + 1}`} value={pt} onChange={v => updateProjPoint(p.id, i, v)} placeholder="Built X using Y which achieved Z" />
                  ))}
                </div>
              ))}
            </Section>

            {/* Certifications */}
            <Section title="Certifications" icon={Award} color="#A78BFA" onAdd={addCert} addLabel="Add Certification">
              {resume.certifications.map(c => (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 10, marginBottom: 8 }}>
                  <Field label="Certificate Name" value={c.name} onChange={v => updateCert(c.id, 'name', v)} placeholder="AWS Cloud Practitioner" />
                  <Field label="Issuer" value={c.issuer} onChange={v => updateCert(c.id, 'issuer', v)} placeholder="Amazon Web Services" />
                  <Field label="Year" value={c.year} onChange={v => updateCert(c.id, 'year', v)} placeholder="2024" />
                </div>
              ))}
            </Section>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f8fafc', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ background: '#1E293B', padding: '10px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ color: '#475569', fontSize: 12, marginLeft: 8 }}>Resume Preview — {tpl?.name} Template</span>
            </div>
            <ResumePreview data={resume} template={template} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
