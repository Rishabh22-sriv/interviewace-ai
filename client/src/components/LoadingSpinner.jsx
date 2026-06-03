import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 24, md: 40, lg: 64 };
  const s = sizes[size] || sizes.md;

  return (
    <div className="center-flex flex-col gap-4">
      <div style={{ position: 'relative', width: s, height: s }}>
        {/* Outer ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `3px solid rgba(99, 102, 241, 0.15)`,
          }}
        />
        {/* Spinning arc */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `3px solid transparent`,
            borderTopColor: '#7C3AED',
            borderRightColor: '#6366F1',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner dot */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '25%',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {text && (
        <motion.p
          style={{ color: '#94A3B8', fontSize: 14 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const PageLoader = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <div className="center-flex flex-col gap-6">
      <motion.div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #6366F1, #06B6D4)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            '0 0 20px rgba(124,58,237,0.3)',
            '0 0 60px rgba(124,58,237,0.6)',
            '0 0 20px rgba(124,58,237,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="center-flex flex-col gap-2">
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #7C3AED, #6366F1, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          InterviewAce AI
        </span>
        <LoadingSpinner size="sm" text="Loading..." />
      </div>
    </div>
  </div>
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="glass-card-static p-6">
    <div className="skeleton h-5 w-1/3 mb-4 rounded" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton h-3 mb-2 rounded`} style={{ width: `${70 + Math.random() * 30}%` }} />
    ))}
  </div>
);

export default LoadingSpinner;
