import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Zap, RefreshCw, BookOpen, Mic, Brain, TrendingUp } from 'lucide-react';

const tips = [
  { icon: Brain, category: 'Interview Tip', color: '#7C3AED', text: 'Use the STAR method for behavioral questions: Situation, Task, Action, Result. Structure keeps your answer clear and compelling.' },
  { icon: Mic, category: 'Voice Tips', color: '#06B6D4', text: 'Speak at a measured pace during voice interviews. A 1-2 second pause before answering shows confidence, not hesitation.' },
  { icon: BookOpen, category: 'Technical Tip', color: '#10B981', text: 'In system design interviews, always clarify scale and requirements before proposing a solution. Ask: "How many users? What are the read/write ratios?"' },
  { icon: TrendingUp, category: 'Resume Tip', color: '#F59E0B', text: 'Quantify every achievement: "Reduced API latency by 40%" beats "improved performance". Numbers make ATS scanners and recruiters pay attention.' },
  { icon: Zap, category: 'Quick Win', color: '#EC4899', text: 'Research the company before HR rounds. Show you understand their mission and products. Reference specific projects or values during your answer.' },
  { icon: Brain, category: 'Confidence', color: '#A78BFA', text: 'Practice your 60-second self-introduction until it feels natural. This sets the tone for your entire interview.' },
];

const FloatingAIWidget = () => {
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const currentTip = tips[tipIndex];
  const TipIcon = currentTip.icon;

  const nextTip = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTipIndex((i) => (i + 1) % tips.length);
      setRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(nextTip, 10000);
    return () => clearInterval(interval);
  }, [open, tipIndex]);

  return (
    <div className="ai-widget">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.92 }} transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="ai-widget-panel">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                  <Bot size={16} color="white" />
                </div>
                <div>
                  <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 14, margin: 0, fontFamily: 'Outfit' }}>AI Coach</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
                    <p style={{ color: '#10B981', fontSize: 11, margin: 0, fontWeight: 600 }}>Active</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>

            {/* Tip */}
            <AnimatePresence mode="wait">
              {!refreshing && (
                <motion.div key={tipIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: `${currentTip.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TipIcon size={13} style={{ color: currentTip.color }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: currentTip.color, textTransform: 'uppercase', letterSpacing: '0.7px' }}>{currentTip.category}</span>
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.75, margin: 0 }}>{currentTip.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>{tipIndex + 1} of {tips.length} tips</p>
              <button onClick={nextTip}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#A78BFA', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
                <RefreshCw size={12} />
                Next Tip
              </button>
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 5, marginTop: 12, justifyContent: 'center' }}>
              {tips.map((_, i) => (
                <button key={i} onClick={() => setTipIndex(i)}
                  style={{ width: i === tipIndex ? 20 : 6, height: 6, borderRadius: 100, background: i === tipIndex ? '#7C3AED' : 'rgba(99,102,241,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)} className="ai-widget-btn"
        title="AI Interview Coach">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={24} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingAIWidget;
