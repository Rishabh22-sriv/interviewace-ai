import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { resumeService } from '../services';
import toast from 'react-hot-toast';
import {
  Upload, FileText, CheckCircle, AlertCircle, Clock,
  BarChart3, TrendingUp, AlertTriangle, Star, Cpu,
  FolderOpen, RefreshCw, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const ScoreGauge = ({ score }) => {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Work';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', width: 160, height: 160 }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="12" />
          <motion.circle
            cx="80" cy="80" r="65"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 65}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 65 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 65 * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 36, fontWeight: 900, color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>ATS Score</span>
        </div>
      </div>
      <p style={{ color, fontWeight: 700, fontSize: 16, marginTop: 8, fontFamily: 'Outfit, sans-serif' }}>{label}</p>
    </div>
  );
};

const FeedbackSection = ({ title, items, icon: Icon, color, emptyMsg }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} style={{ color }} />
          <span style={{ color, fontWeight: 700, fontSize: 14 }}>{title}</span>
          <span style={{ background: `${color}20`, color, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{items?.length || 0}</span>
        </div>
        {expanded ? <ChevronUp size={16} style={{ color: '#64748B' }} /> : <ChevronDown size={16} style={{ color: '#64748B' }} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 16px' }}>
              {items?.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color, flexShrink: 0, marginTop: 2 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>{emptyMsg}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResumeAnalyzer = () => {
  const [uploading, setUploading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [report, setReport] = useState(null);
  const [polling, setPolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let interval;
    if (polling && resumeId) {
      interval = setInterval(async () => {
        try {
          const res = await resumeService.getReport(resumeId);
          if (res.data.resume.status === 'completed' || res.data.resume.status === 'failed') {
            setPolling(false);
            setReport(res.data.resume);
            if (res.data.resume.status === 'completed') {
              toast.success('Resume analysis complete! 🎉');
              fetchHistory();
            } else {
              toast.error('Analysis failed. Please try again.');
            }
          }
        } catch {}
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, resumeId]);

  const fetchHistory = async () => {
    try {
      const res = await resumeService.getHistory();
      setHistory(res.data.resumes || []);
    } catch {}
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF files are supported');
    if (file.size > 10 * 1024 * 1024) return toast.error('File size must be under 10MB');

    setUploading(true);
    setReport(null);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await resumeService.upload(formData);
      setResumeId(res.data.resumeId);
      setPolling(true);
      toast.success('Resume uploaded! Analyzing with AI...');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading || polling,
  });

  const handleDeleteResume = async (id) => {
    try {
      await resumeService.delete(id);
      toast.success('Resume deleted');
      fetchHistory();
      if (report?._id === id) setReport(null);
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const loadReport = async (id) => {
    try {
      const res = await resumeService.getReport(id);
      setReport(res.data.resume);
      setActiveTab('upload');
    } catch {}
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
          Resume <span className="gradient-text">Analyzer</span>
        </h1>
        <p style={{ color: '#64748B' }}>Get your ATS score and AI-powered improvement recommendations</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(99,102,241,0.1)', marginBottom: 28 }}>
        {[{ id: 'upload', label: 'Upload & Analyze' }, { id: 'history', label: `History (${history.length})` }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? '#7C3AED' : 'transparent'}`, color: activeTab === tab.id ? '#A5B4FC' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'upload' && (
        <>
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`drop-zone ${isDragActive ? 'active' : ''}`}
            style={{ marginBottom: 28, cursor: uploading || polling ? 'not-allowed' : 'pointer', opacity: uploading || polling ? 0.7 : 1 }}
          >
            <input {...getInputProps()} id="resume-upload-input" />
            <div style={{ textAlign: 'center' }}>
              {uploading ? (
                <>
                  <LoadingSpinner size="md" />
                  <p style={{ color: '#94A3B8', marginTop: 16 }}>Uploading resume...</p>
                </>
              ) : polling ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <Cpu size={48} style={{ color: '#7C3AED', margin: '0 auto', display: 'block' }} />
                  </motion.div>
                  <p style={{ color: '#A5B4FC', fontWeight: 600, marginTop: 16 }}>AI is analyzing your resume...</p>
                  <p style={{ color: '#64748B', fontSize: 13 }}>This usually takes 15-30 seconds</p>
                </>
              ) : (
                <>
                  <Upload size={48} style={{ color: isDragActive ? '#7C3AED' : '#475569', margin: '0 auto 16px', display: 'block', transition: 'color 0.2s' }} />
                  <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                    {isDragActive ? 'Drop your PDF here!' : 'Drop your resume PDF here'}
                  </p>
                  <p style={{ color: '#64748B', fontSize: 14, marginBottom: 16 }}>or click to browse files</p>
                  <span style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#A5B4FC', padding: '6px 14px', borderRadius: 20, fontSize: 13 }}>
                    PDF only • Max 10MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          {report && report.status === 'completed' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <CheckCircle size={20} style={{ color: '#10B981' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Analysis Complete</h2>
                <span style={{ color: '#64748B', fontSize: 13 }}>• {report.originalFilename}</span>
              </div>

              {/* Score & Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, marginBottom: 24 }} className="grid-cols-1 md:grid-cols-[200px_1fr]">
                <div className="glass-card-static" style={{ padding: 24 }}>
                  <ScoreGauge score={report.atsScore} />
                </div>
                <div className="glass-card-static" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>AI Assessment</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.8 }}>{report.feedback?.summary || 'Analysis complete. Review the detailed feedback below.'}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                    {[
                      { label: `${report.feedback?.strengths?.length || 0} Strengths`, color: '#10B981' },
                      { label: `${report.feedback?.missingSkills?.length || 0} Missing Skills`, color: '#EF4444' },
                      { label: `${report.feedback?.suggestedImprovements?.length || 0} Improvements`, color: '#F59E0B' },
                    ].map(({ label, color }) => (
                      <span key={label} style={{ fontSize: 12, fontWeight: 600, color, background: `${color}15`, padding: '4px 10px', borderRadius: 20 }}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Feedback */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FeedbackSection title="Strengths" items={report.feedback?.strengths} icon={Star} color="#10B981" emptyMsg="No strengths identified" />
                <FeedbackSection title="Missing Skills" items={report.feedback?.missingSkills} icon={AlertCircle} color="#EF4444" emptyMsg="No missing skills detected" />
                <FeedbackSection title="Grammar Issues" items={report.feedback?.grammarIssues} icon={AlertTriangle} color="#F59E0B" emptyMsg="No grammar issues found" />
                <FeedbackSection title="Suggested Improvements" items={report.feedback?.suggestedImprovements} icon={TrendingUp} color="#6366F1" emptyMsg="No suggestions" />
                <FeedbackSection title="Recommended Technologies" items={report.feedback?.recommendedTechnologies} icon={Cpu} color="#06B6D4" emptyMsg="No recommendations" />
                <FeedbackSection title="Recommended Projects" items={report.feedback?.recommendedProjects} icon={FolderOpen} color="#EC4899" emptyMsg="No project recommendations" />
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <FileText size={48} style={{ color: '#334155', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: '#64748B' }}>No resumes analyzed yet. Upload your first resume!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((resume) => (
                <div key={resume._id} className="glass-card-static" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} style={{ color: '#6366F1' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{resume.originalFilename}</p>
                    <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>{new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {resume.status === 'completed' ? (
                      <span style={{ fontSize: 18, fontWeight: 800, color: resume.atsScore >= 70 ? '#10B981' : '#F59E0B', fontFamily: 'Outfit, sans-serif' }}>
                        {resume.atsScore}%
                      </span>
                    ) : (
                      <span className="badge badge-yellow">{resume.status}</span>
                    )}
                    {resume.status === 'completed' && (
                      <button onClick={() => loadReport(resume._id)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                        View
                      </button>
                    )}
                    <button onClick={() => handleDeleteResume(resume._id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
