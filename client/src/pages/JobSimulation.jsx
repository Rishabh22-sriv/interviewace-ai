import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Database, BarChart3, Brain, CheckCircle, XCircle,
  Clock, Trophy, TrendingUp, RotateCcw, ChevronRight,
  Star, AlertCircle, Zap, Play
} from 'lucide-react';

// ─── Task Data ────────────────────────────────────────────────────────────────

const ROLE_TASKS = {
  'Frontend Dev': [
    {
      id: 'fe1', type: 'mcq', title: 'Fix the Bug', tag: 'CSS Debugging',
      description: 'A container div is not centering its children horizontally. Find the bug in the CSS below:',
      code: `.container {
  display: flex;
  align-items: center;
  justify-content: centre;   /* ← Check this line */
  width: 100%;
  height: 100vh;
}`,
      options: ["Missing semicolon after 'width: 100%'", "'centre' should be 'center'", "'align-items: center' is incorrect", "'display: flex' doesn't support justify-content"],
      correct: 1,
      explanation: "CSS property values must use American English spelling. 'centre' is British English — the correct value is 'center'. CSS is case-sensitive for property values.",
    },
    {
      id: 'fe2', type: 'text', title: 'Build a Component', tag: 'React Component Design',
      description: 'Describe how you would build a reusable Button component in React that accepts: variant (primary/secondary), size (sm/md/lg), disabled state, onClick handler, and children props.',
      keywords: ['variant', 'props', 'disabled', 'onClick', 'children', 'className'],
      placeholder: 'Describe your component design approach, props structure, and styling strategy...',
      hint: 'Think about: TypeScript props interface, default values, conditional styling, accessibility attributes (aria-disabled), and how to handle the className extension pattern.',
    },
    {
      id: 'fe3', type: 'multi', title: 'Code Review', tag: 'Bug Identification',
      description: 'Review this fetch function and identify all the bugs:',
      code: `async function fetchUserData(userId) {
  const response = fetch(\`/users/\${userId}\`);  // Bug 1
  const data = response.json();              // Bug 2
  if (!response.ok) {                        // Bug 3
    console.log("Error");
  }
  return data;
}`,
      options: ['Missing await before fetch()', 'Missing await before response.json()', 'Error check after .json() call — too late', 'Wrong variable name for userId', 'Template literal syntax is incorrect'],
      correct: [0, 1, 2],
      explanation: 'Three bugs: (1) fetch() is async and needs await, (2) response.json() is also async and needs await, (3) checking response.ok AFTER calling .json() can throw — check it first.',
    },
    {
      id: 'fe4', type: 'multi', title: 'Performance Optimization', tag: 'React Performance',
      description: 'A React component re-renders 20+ times per second causing severe lag. Which optimizations would you apply?',
      options: ['Wrap component with React.memo()', 'Use useCallback() for event handler functions', 'Use useMemo() for expensive calculated values', 'Add more useState() hooks for granularity', 'Implement lazy loading with React.lazy()', 'Remove all useEffect hooks to stop side effects'],
      correct: [0, 1, 2],
      explanation: 'React.memo prevents re-renders when props haven\'t changed. useCallback memoizes handler references. useMemo memoizes expensive computations. Adding more state or removing useEffect would worsen the issue.',
    },
  ],
  'Backend Dev': [
    {
      id: 'be1', type: 'mcq', title: 'API Design', tag: 'REST Architecture',
      description: 'You need to retrieve a single user by ID in a RESTful API. Which endpoint design follows REST best practices?',
      options: ['GET /getUser?id=123', 'GET /users/123', 'POST /fetchUser', 'GET /user?method=get&id=123'],
      correct: 1,
      explanation: 'REST best practices: Use nouns (not verbs) for resources, plural form for collections, and path parameters for specific resource IDs. GET /users/123 is clean, semantic, and follows REST conventions.',
    },
    {
      id: 'be2', type: 'text', title: 'Fix Broken SQL', tag: 'SQL Debugging',
      description: 'This SQL query has multiple syntax errors. Write the corrected version:',
      code: `SELEC name, email, age FORM users
WHER age > 25 AND status = 'active'
ORDER age DESC
LIMIT 10;`,
      keywords: ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'DESC'],
      placeholder: 'Write the corrected SQL query here...',
      hint: 'Spot the typos in SQL keywords. Remember ORDER BY requires the BY keyword.',
    },
    {
      id: 'be3', type: 'mcq', title: 'Debug Node.js', tag: 'Async/Await',
      description: 'This API handler always returns undefined instead of the user data. What is the root cause?',
      code: `app.get('/user/:id', (req, res) => {
  const user = db.findUser(req.params.id);
  res.json({ success: true, user });
});`,
      options: ['Missing async keyword and await on db.findUser()', 'Wrong HTTP method — should be POST', 'Missing error handling try/catch block only', 'res.json() syntax is incorrect'],
      correct: 0,
      explanation: 'db.findUser() is an async database operation returning a Promise. Without async/await, user will be a Promise object (or undefined), not the resolved user data. Fix: async (req, res) => { const user = await db.findUser(req.params.id); }',
    },
    {
      id: 'be4', type: 'mcq', title: 'System Architecture', tag: 'System Design',
      description: 'You need to design a URL shortener handling 1 million requests per day with sub-100ms response time. Which architecture is most appropriate?',
      options: ['Single Node.js server + MySQL (simple to manage)', 'Load balancer + Node cluster + Redis cache + NoSQL DB', 'AWS Lambda per request + S3 storage only', 'Monolithic Rails app with PostgreSQL read replicas'],
      correct: 1,
      explanation: 'At 1M req/day (~12 req/sec avg, likely 100+ at peak): Load balancing distributes traffic, clustering uses all CPU cores, Redis caches frequent lookups (~0ms), NoSQL handles high write throughput. Lambda would work but has cold start latency issues.',
    },
  ],
  'Data Analyst': [
    {
      id: 'da1', type: 'mcq', title: 'Data Cleaning', tag: 'Missing Values',
      description: 'Your dataset has 30% null values in the "customer_revenue" column, which is critical for analysis. What is the best approach?',
      options: ['Delete all rows with null values immediately', 'Impute with mean or median based on distribution shape', 'Replace all nulls with 0 (zero)', 'Leave the nulls as-is and note it in the report'],
      correct: 1,
      explanation: 'The correct approach depends on distribution: use median for skewed distributions (robust to outliers) and mean for symmetric distributions. Deleting 30% of rows causes massive information loss. Zero-imputation distorts statistics. Ignoring nulls causes biased results.',
    },
    {
      id: 'da2', type: 'text', title: 'Write SQL Query', tag: 'SQL Analytics',
      description: 'Write a SQL query to find the top 3 customers by total revenue in the last 30 days from an "orders" table with columns: customer_id, amount, order_date.',
      keywords: ['SELECT', 'SUM', 'GROUP BY', 'ORDER BY', 'LIMIT', 'WHERE'],
      placeholder: 'Write your SQL query here...',
      hint: 'You need: SUM() to aggregate, GROUP BY customer_id, WHERE for date filtering, ORDER BY DESC, and LIMIT 3.',
    },
    {
      id: 'da3', type: 'mcq', title: 'Visualization Choice', tag: 'Data Visualization',
      description: 'You need to visualize the correlation between a user\'s age and their time spent on an app. Which chart type is most appropriate?',
      options: ['Bar chart (grouped by age)', 'Scatter plot with trend line', 'Pie chart showing age proportions', 'Line chart with age on X-axis'],
      correct: 1,
      explanation: 'Scatter plots are the standard choice for showing correlation between two continuous variables. Each point represents one user, allowing you to clearly see clusters, outliers, and the direction/strength of correlation. A trend line (regression line) makes the relationship explicit.',
    },
    {
      id: 'da4', type: 'mcq', title: 'Statistical Significance', tag: 'A/B Testing',
      description: 'Your A/B test ran for 2 weeks with 10,000 users. Variant B shows 5% higher conversion but the p-value is 0.08 (threshold: 0.05). What do you conclude?',
      options: ['Ship Variant B — 5% lift is economically significant enough', 'Results are not statistically significant; need more data or time', 'Run the test again immediately with the same setup', 'Declare both variants are equal and keep the original'],
      correct: 1,
      explanation: 'P-value of 0.08 > 0.05 threshold means we cannot reject the null hypothesis. The 5% lift could be due to random chance. Options: run longer to increase statistical power, or increase sample size. Never ship based on a failed significance test — it risks real revenue loss.',
    },
  ],
  'ML Engineer': [
    {
      id: 'ml1', type: 'mcq', title: 'Model Diagnosis', tag: 'Debugging ML',
      description: 'Your classification model achieves 99% accuracy on the training set but only 61% on production data. What is the most likely root cause?',
      options: ['The model architecture is too complex (too many layers)', 'Severe class imbalance in training data causing the model to predict majority class', 'The learning rate is too high during training', 'Too many training epochs caused memorization'],
      correct: 1,
      explanation: 'Classic class imbalance problem: a model that always predicts the majority class (e.g., 99% "not fraud") achieves high accuracy but useless performance. High training accuracy + low production accuracy also suggests data leakage or distribution shift. Check class distribution and use F1/AUC instead of accuracy.',
    },
    {
      id: 'ml2', type: 'text', title: 'Prevent Overfitting', tag: 'Regularization',
      description: 'Your neural network is overfitting badly — training loss is 0.02 but validation loss is 1.8. List and explain the techniques you would apply.',
      keywords: ['dropout', 'regularization', 'validation', 'early stopping', 'batch', 'augmentation'],
      placeholder: 'Explain the overfitting techniques you would apply and why...',
      hint: 'Think about: Dropout (randomly zero activations), L1/L2 regularization, Early stopping, Data augmentation, Batch normalization, reducing model complexity.',
    },
    {
      id: 'ml3', type: 'mcq', title: 'Algorithm Selection', tag: 'Model Choice',
      description: 'You need to detect unusual patterns (anomalies) in time-series server metrics with no labeled anomaly data. Which algorithm(s) are most appropriate?',
      options: ['Linear Regression with time as feature', 'Isolation Forest or LSTM Autoencoder (unsupervised)', 'K-Means Clustering on raw metrics', 'Random Forest with oversampled anomaly class'],
      correct: 1,
      explanation: 'With no labeled data, you need unsupervised anomaly detection. Isolation Forest is highly effective — it isolates anomalies in feature space (anomalies are easy to isolate). LSTM Autoencoders learn normal temporal patterns; high reconstruction error = anomaly. Both handle time-series well.',
    },
    {
      id: 'ml4', type: 'mcq', title: 'MLOps Tooling', tag: 'Model Versioning',
      description: 'Your team runs 50+ experiments weekly and needs to track hyperparameters, metrics, and model artifacts reliably. Which toolset is most appropriate?',
      options: ['Git repository with model weights committed', 'MLflow or DVC for experiment tracking and model versioning', 'Excel spreadsheet with manual logging', 'Docker containers only (one per experiment)'],
      correct: 1,
      explanation: 'MLflow and DVC are purpose-built for ML: MLflow tracks experiments, parameters, metrics, and artifacts with a UI. DVC versions large data files and model artifacts with Git-like semantics. Committing model weights to Git is slow and inefficient; manual tracking doesn\'t scale.',
    },
  ],
};

const ROLES = [
  { id: 'Frontend Dev', icon: Code, color: '#7C3AED', desc: 'HTML, CSS, JavaScript, React' },
  { id: 'Backend Dev', icon: Database, color: '#06B6D4', desc: 'Node.js, APIs, Databases' },
  { id: 'Data Analyst', icon: BarChart3, color: '#10B981', desc: 'SQL, Statistics, Visualization' },
  { id: 'ML Engineer', icon: Brain, color: '#F59E0B', desc: 'ML Models, MLOps, Python' },
];

const DIFFICULTIES = ['Junior', 'Mid', 'Senior'];

// ─── Code Block ───────────────────────────────────────────────────────────────

const CodeBlock = ({ code }) => {
  const lines = code.split('\n');
  const tokenize = (line) => {
    const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'import', 'export', 'from', 'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'LIMIT', 'AND', 'OR', 'NOT', 'NULL', 'DESC', 'ASC', 'SELEC', 'FORM', 'WHER', 'app', 'res', 'req', 'db'];
    const parts = [];
    let remaining = line;
    const patterns = [
      { regex: /\/\*.*?\*\/|\/\/.*$/, style: { color: '#4ADE80' } },
      { regex: /(['"`])(?:(?!\1)[^\\]|\\.)*\1/, style: { color: '#FCD34D' } },
      { regex: /\b\d+\b/, style: { color: '#F97316' } },
    ];
    parts.push({ text: line, style: { color: '#94A3B8' } });
    return parts;
  };

  return (
    <div style={{ background: '#020813', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, overflow: 'hidden', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
      <div style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.06)', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', gap: 6 }}>
        {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ padding: '16px 20px', overflowX: 'auto' }}>
        {lines.map((line, i) => {
          const isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('--') || line.trim().startsWith('*');
          const hasKeyword = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'LIMIT', 'SELEC', 'FORM', 'WHER'].some(k => line.includes(k));
          const isString = line.includes("'") || line.includes('"') || line.includes('`');

          let lineColor = '#94A3B8';
          if (isComment) lineColor = '#4ADE80';
          else if (hasKeyword) lineColor = '#C4B5FD';

          return (
            <div key={i} style={{ display: 'flex', gap: 16, lineHeight: 1.8 }}>
              <span style={{ color: '#334155', userSelect: 'none', minWidth: 20, textAlign: 'right', fontSize: 11 }}>{i + 1}</span>
              <span style={{ color: lineColor, whiteSpace: 'pre' }}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Timer Bar ────────────────────────────────────────────────────────────────

const TimerBar = ({ seconds, maxSeconds = 120 }) => {
  const pct = (seconds / maxSeconds) * 100;
  const urgent = seconds < 30;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Clock size={15} color={urgent ? '#EF4444' : '#94A3B8'} />
      <div style={{ flex: 1, height: 6, background: 'rgba(99,102,241,0.1)', borderRadius: 100, overflow: 'hidden' }}>
        <motion.div
          style={{ height: 6, borderRadius: 100, background: urgent ? 'linear-gradient(90deg,#EF4444,#F97316)' : 'linear-gradient(90deg,#7C3AED,#06B6D4)', boxShadow: urgent ? '0 0 10px rgba(239,68,68,0.5)' : 'none' }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
        />
      </div>
      <motion.span
        animate={urgent ? { scale: [1, 1.1, 1], color: ['#EF4444', '#F97316', '#EF4444'] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        style={{ fontSize: 14, fontWeight: 800, color: urgent ? '#EF4444' : '#94A3B8', fontFamily: 'Outfit, sans-serif', minWidth: 36, textAlign: 'right' }}
      >
        {seconds}s
      </motion.span>
    </div>
  );
};

// ─── Task View ────────────────────────────────────────────────────────────────

const TaskView = ({ task, taskIdx, totalTasks, onComplete, role }) => {
  const [selected, setSelected] = useState(null);
  const [multiSelected, setMultiSelected] = useState([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(120);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);
  const color = ROLES.find(r => r.id === role)?.color || '#7C3AED';

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(intervalRef.current); if (!submitted) handleSubmit(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSubmit = (timeUp = false) => {
    clearInterval(intervalRef.current);
    let s = 0;
    if (task.type === 'mcq') {
      s = selected === task.correct ? 25 : Math.floor(Math.random() * 8);
    } else if (task.type === 'multi') {
      const correctSet = new Set(task.correct);
      const selectedSet = new Set(multiSelected);
      const overlap = [...correctSet].filter(x => selectedSet.has(x)).length;
      s = Math.round((overlap / task.correct.length) * 25);
    } else {
      const kw = task.keywords || [];
      const matches = kw.filter(k => textAnswer.toLowerCase().includes(k.toLowerCase())).length;
      s = timeUp ? 0 : Math.max(8, Math.round((matches / Math.max(kw.length, 1)) * 25 * (1 - Math.random() * 0.1)));
    }
    setScore(s);
    setSubmitted(true);
  };

  const toggleMulti = (i) => {
    setMultiSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const isCorrectOption = (i) => Array.isArray(task.correct) ? task.correct.includes(i) : task.correct === i;

  const canSubmit = task.type === 'mcq' ? selected !== null : task.type === 'multi' ? multiSelected.length > 0 : textAnswer.trim().length > 10;

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      style={{ maxWidth: 680, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={21} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.8 }}>Task {taskIdx + 1}/{totalTasks}</span>
            <span style={{ padding: '2px 8px', borderRadius: 100, background: `${color}18`, border: `1px solid ${color}30`, fontSize: 10, fontWeight: 700, color }}>{task.tag}</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0, color: '#F1F5F9' }}>{task.title}</h2>
        </div>
      </div>

      {!submitted && <TimerBar seconds={timer} maxSeconds={120} />}
      <div style={{ height: 16 }} />

      <div className="glass-card-static" style={{ padding: 24 }}>
        <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, marginBottom: task.code ? 16 : 20 }}>{task.description}</p>
        {task.code && <div style={{ marginBottom: 20 }}><CodeBlock code={task.code} /></div>}
        {task.hint && !submitted && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Zap size={13} color="#F59E0B" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.6 }}>{task.hint}</span>
          </div>
        )}

        {/* MCQ Options */}
        {task.type === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {task.options.map((opt, i) => {
              let bg = 'rgba(13,22,39,0.5)', border = 'rgba(99,102,241,0.12)', textColor = '#94A3B8';
              if (submitted) {
                if (i === task.correct) { bg = 'rgba(16,185,129,0.1)'; border = '#10B981'; textColor = '#6EE7B7'; }
                else if (i === selected && i !== task.correct) { bg = 'rgba(239,68,68,0.08)'; border = '#EF4444'; textColor = '#FCA5A5'; }
              } else if (selected === i) { bg = `${color}14`; border = color; textColor = '#F1F5F9'; }
              return (
                <motion.button key={i} whileHover={!submitted ? { scale: 1.01 } : {}} whileTap={!submitted ? { scale: 0.99 } : {}}
                  onClick={() => !submitted && setSelected(i)}
                  style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color: textColor, cursor: submitted ? 'default' : 'pointer', textAlign: 'left', fontSize: 14, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {submitted && i === task.correct && <CheckCircle size={16} color="#10B981" />}
                  {submitted && i === selected && i !== task.correct && <XCircle size={16} color="#EF4444" />}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Multi-select */}
        {task.type === 'multi' && (
          <div>
            <p style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, marginBottom: 12 }}>Select all that apply:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {task.options.map((opt, i) => {
                const isCorrect = isCorrectOption(i);
                let bg = multiSelected.includes(i) ? `${color}14` : 'rgba(13,22,39,0.5)';
                let border = multiSelected.includes(i) ? color : 'rgba(99,102,241,0.12)';
                let textColor = multiSelected.includes(i) ? '#F1F5F9' : '#94A3B8';
                if (submitted) {
                  if (isCorrect) { bg = 'rgba(16,185,129,0.1)'; border = '#10B981'; textColor = '#6EE7B7'; }
                  else if (multiSelected.includes(i)) { bg = 'rgba(239,68,68,0.08)'; border = '#EF4444'; textColor = '#FCA5A5'; }
                }
                return (
                  <motion.button key={i} whileHover={!submitted ? { scale: 1.01 } : {}} whileTap={!submitted ? { scale: 0.99 } : {}}
                    onClick={() => !submitted && toggleMulti(i)}
                    style={{ padding: '13px 16px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color: textColor, cursor: submitted ? 'default' : 'pointer', textAlign: 'left', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${submitted ? (isCorrect ? '#10B981' : (multiSelected.includes(i) ? '#EF4444' : 'rgba(99,102,241,0.3)')) : (multiSelected.includes(i) ? color : 'rgba(99,102,241,0.3)')}`, background: multiSelected.includes(i) ? (submitted ? (isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') : `${color}30`) : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {multiSelected.includes(i) && <div style={{ width: 8, height: 8, borderRadius: 2, background: submitted ? (isCorrect ? '#10B981' : '#EF4444') : color }} />}
                    </div>
                    {opt}
                    {submitted && isCorrect && <CheckCircle size={15} color="#10B981" style={{ marginLeft: 'auto' }} />}
                    {submitted && multiSelected.includes(i) && !isCorrect && <XCircle size={15} color="#EF4444" style={{ marginLeft: 'auto' }} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Text input */}
        {task.type === 'text' && (
          <textarea
            className="input-field" value={textAnswer} onChange={e => setTextAnswer(e.target.value)}
            disabled={submitted} placeholder={task.placeholder}
            style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.7, fontFamily: task.id.includes('be2') || task.id.includes('da2') ? 'JetBrains Mono, monospace' : 'Inter, sans-serif' }}
          />
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 22, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {score >= 20 ? <CheckCircle size={20} color="#10B981" /> : score >= 12 ? <AlertCircle size={20} color="#F59E0B" /> : <XCircle size={20} color="#EF4444" />}
              <span style={{ fontWeight: 700, fontSize: 15, color: '#F1F5F9' }}>
                {score >= 20 ? 'Excellent!' : score >= 12 ? 'Partial Credit' : 'Incorrect'}
              </span>
              <div style={{ marginLeft: 'auto', fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: score >= 20 ? '#10B981' : score >= 12 ? '#F59E0B' : '#EF4444' }}>
                {score}/25
              </div>
            </div>
            {task.explanation && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', marginBottom: 14 }}>
                <p style={{ color: '#A5B4FC', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>💡 Explanation</p>
                <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{task.explanation}</p>
              </div>
            )}
            <button className="btn-primary" onClick={() => onComplete(score)} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              {taskIdx < totalTasks - 1 ? <>Next Task <ChevronRight size={15} /></> : <>View Final Report <Trophy size={15} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => handleSubmit(false)} disabled={!canSubmit} style={{ padding: '12px 28px' }}>
            Submit Answer
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ─── Final Report ─────────────────────────────────────────────────────────────

const FinalReport = ({ role, difficulty, taskScores, tasks, onRetry, onChangRole }) => {
  const total = taskScores.reduce((a, b) => a + b, 0);
  const maxTotal = 100;
  const pct = total;
  const rec = pct >= 85 ? { label: '✅ Ready to Hire', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' }
    : pct >= 65 ? { label: '⚡ Almost Ready', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' }
    : { label: '📚 Needs Work', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' };
  const color = ROLES.find(r => r.id === role)?.color || '#7C3AED';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}
          style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 0 50px ${color}50` }}>
          <Trophy size={42} color="white" />
        </motion.div>
        <h1 style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
          Simulation <span className="gradient-text">Report</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 14 }}>{role} — {difficulty} Level</p>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
          style={{ display: 'inline-block', marginTop: 20, padding: '10px 32px', borderRadius: 16, background: rec.bg, border: `1px solid ${rec.border}` }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: rec.color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{total}</div>
          <div style={{ color: '#94A3B8', fontSize: 13 }}>/ 100 points</div>
        </motion.div>
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ padding: '12px 28px', borderRadius: 12, background: rec.bg, border: `1px solid ${rec.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: rec.color, fontFamily: 'Outfit, sans-serif' }}>
            Hiring Recommendation: {rec.label}
          </span>
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={15} color={color} /> Task-wise Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tasks.map((task, i) => {
            const sc = taskScores[i] || 0;
            const taskColor = sc >= 20 ? '#10B981' : sc >= 12 ? '#F59E0B' : '#EF4444';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600 }}>{task.title}</span>
                    <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 100, background: `${color}15`, fontSize: 10, fontWeight: 700, color }}>{task.tag}</span>
                  </div>
                  <span style={{ color: taskColor, fontWeight: 800, fontSize: 16, fontFamily: 'Outfit, sans-serif' }}>{sc}/25</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" style={{ background: taskColor }} initial={{ width: 0 }} animate={{ width: `${(sc / 25) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.15 }} />
                </div>
                {sc < 15 && (
                  <p style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>💡 {task.explanation ? task.explanation.slice(0, 80) + '...' : 'Review the concept and practice more.'}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card-static" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={14} color={color} /> Key Improvements Needed
        </h3>
        {tasks.filter((t, i) => (taskScores[i] || 0) < 20).slice(0, 3).map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)' }}>
            <Star size={12} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', marginBottom: 2 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>Study {t.tag} concepts and practice similar problems to master this area.</div>
            </div>
          </div>
        ))}
        {tasks.every((t, i) => (taskScores[i] || 0) >= 20) && (
          <p style={{ color: '#10B981', fontSize: 13 }}>🎉 Excellent performance across all tasks! You demonstrated strong competency.</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-primary" onClick={onRetry} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <RotateCcw size={15} /> Retry Same Role
        </button>
        <button className="btn-secondary" onClick={onChangRole} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
          <ChevronRight size={15} /> Different Role
        </button>
      </div>
    </motion.div>
  );
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const Setup = ({ onStart }) => {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Junior');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, marginBottom: 18 }}>
          <Zap size={13} color="#A78BFA" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1.2 }}>Job Simulation Platform</span>
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: 12, lineHeight: 1.15 }}>
          AI Job <span className="gradient-text">Simulation</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
          Complete 4 real-world job tasks to prove your readiness. Get an instant hiring recommendation based on your performance.
        </p>
      </div>

      <div className="glass-card-static" style={{ padding: 28, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Select Your Role</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {ROLES.map((r) => {
            const active = role === r.id;
            return (
              <motion.button
                key={r.id} id={`role-${r.id.replace(/\s/g, '-').toLowerCase()}`}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.id)}
                style={{ padding: '18px 20px', borderRadius: 14, border: `2px solid ${active ? r.color : 'rgba(99,102,241,0.12)'}`, background: active ? `${r.color}12` : 'rgba(13,22,39,0.5)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', boxShadow: active ? `0 0 24px ${r.color}30` : 'none' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${r.color}18`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <r.icon size={22} color={r.color} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 2 }}>{r.id}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{r.desc}</div>
                </div>
                {active && <CheckCircle size={16} color={r.color} style={{ marginLeft: 'auto' }} />}
              </motion.button>
            );
          })}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Difficulty Level</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: `2px solid ${difficulty === d ? '#7C3AED' : 'rgba(99,102,241,0.12)'}`, background: difficulty === d ? 'rgba(124,58,237,0.12)' : 'rgba(13,22,39,0.5)', color: difficulty === d ? '#C4B5FD' : '#94A3B8', cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>
              {d === 'Junior' ? '🌱' : d === 'Mid' ? '⚡' : '🚀'} {d}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => role && onStart(role, difficulty)}
        disabled={!role}
        style={{ width: '100%', padding: '17px', fontSize: 16, justifyContent: 'center', borderRadius: 14 }}
      >
        <Play size={19} /> Start Job Simulation
      </motion.button>
      {!role && <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 10 }}>Please select a role to begin</p>}
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const JobSimulation = () => {
  const [phase, setPhase] = useState('setup');
  const [role, setRole] = useState(null);
  const [difficulty, setDifficulty] = useState('Junior');
  const [taskIdx, setTaskIdx] = useState(0);
  const [taskScores, setTaskScores] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleStart = (r, d) => {
    setRole(r);
    setDifficulty(d);
    setTasks(ROLE_TASKS[r] || ROLE_TASKS['Frontend Dev']);
    setTaskIdx(0);
    setTaskScores([]);
    setPhase('task');
  };

  const handleTaskComplete = (score) => {
    const newScores = [...taskScores, score];
    setTaskScores(newScores);
    if (taskIdx < tasks.length - 1) {
      setTaskIdx(t => t + 1);
    } else {
      setPhase('report');
    }
  };

  const handleRestart = () => { setTaskIdx(0); setTaskScores([]); setPhase('task'); };
  const handleChangeRole = () => { setPhase('setup'); setTasks([]); setTaskScores([]); setTaskIdx(0); };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px' }}>
        <AnimatePresence mode="wait">
          {phase === 'setup' && <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Setup onStart={handleStart} /></motion.div>}
          {phase === 'task' && tasks.length > 0 && (
            <motion.div key={`task-${taskIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Task progress strip */}
              <div style={{ maxWidth: 680, margin: '0 auto 20px', display: 'flex', gap: 8 }}>
                {tasks.map((t, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i < taskIdx ? '#10B981' : i === taskIdx ? '#7C3AED' : 'rgba(99,102,241,0.1)', boxShadow: i === taskIdx ? '0 0 10px rgba(124,58,237,0.5)' : 'none', transition: 'all 0.3s' }} />
                ))}
              </div>
              <TaskView
                key={`task-view-${taskIdx}`}
                task={tasks[taskIdx]}
                taskIdx={taskIdx}
                totalTasks={tasks.length}
                onComplete={handleTaskComplete}
                role={role}
              />
            </motion.div>
          )}
          {phase === 'report' && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FinalReport role={role} difficulty={difficulty} taskScores={taskScores} tasks={tasks} onRetry={handleRestart} onChangRole={handleChangeRole} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobSimulation;
