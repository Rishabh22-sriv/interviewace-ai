import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, BookOpen, FileText, HelpCircle, Layers, Zap, RotateCcw, ChevronRight } from 'lucide-react';

const SUBJECTS = [
  { id: 'dsa', name: 'DSA', icon: '🌳', color: '#10B981' },
  { id: 'dbms', name: 'DBMS', icon: '🗃️', color: '#06B6D4' },
  { id: 'os', name: 'OS', icon: '💻', color: '#7C3AED' },
  { id: 'cn', name: 'CN', icon: '🌐', color: '#F59E0B' },
  { id: 'oop', name: 'OOP', icon: '🧩', color: '#EC4899' },
  { id: 'system', name: 'System Design', icon: '🏗️', color: '#8B5CF6' },
];

const MODES = [
  { id: 'explain', name: 'Explain', icon: BookOpen, desc: 'Get concept explanations' },
  { id: 'quiz', name: 'Quiz', icon: HelpCircle, desc: 'Test your knowledge' },
  { id: 'notes', name: 'Notes', icon: FileText, desc: 'Generate study notes' },
  { id: 'flashcard', name: 'Flashcards', icon: Layers, desc: 'Memory flash cards' },
  { id: 'interview', name: 'Interview Qs', icon: Zap, desc: 'Practice questions' },
];

const SAMPLE_PROMPTS = {
  explain: ['Explain Binary Search Trees', 'What is Deadlock in OS?', 'Explain TCP/IP model', 'What is Polymorphism in OOP?', 'Explain Normalization in DBMS'],
  quiz: ['Quiz me on Arrays', 'DBMS quiz — 5 questions', 'Test my OS knowledge', 'CN protocols quiz', 'OOP concepts quiz'],
  notes: ['Notes on Dynamic Programming', 'OS scheduling algorithms notes', 'DBMS keys and relationships', 'Generate CN notes', 'OOP design patterns summary'],
  flashcard: ['Flashcards for Sorting algorithms', 'OS concepts flashcards', 'SQL commands flashcards', 'Data structures flashcards', 'OOP principles flashcards'],
  interview: ['Top 10 DSA interview questions', 'DBMS interview questions', 'OS interview prep', 'CN interview questions', 'OOP interview questions for freshers'],
};

const AI_RESPONSES = {
  'binary search': {
    explain: `## Binary Search 🌳\n\nBinary Search is an efficient algorithm for finding an element in a **sorted array** by repeatedly dividing the search space in half.\n\n### How It Works:\n1. Start with the **middle element**\n2. If target == middle → found! ✅\n3. If target < middle → search **left half**\n4. If target > middle → search **right half**\n5. Repeat until found or array is empty\n\n### Time Complexity:\n- **Best:** O(1)\n- **Average/Worst:** O(log n)\n\n### Space Complexity: O(1)\n\n\`\`\`python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\`\`\`\n\n### Key Insight: Each step eliminates half the remaining elements!`,
  },
  'deadlock': {
    explain: `## Deadlock in Operating Systems 🔒\n\nA deadlock is a situation where **two or more processes are stuck waiting** for each other to release resources, and none can proceed.\n\n### The 4 Coffman Conditions (ALL must hold):\n1. **Mutual Exclusion** — Resource can't be shared\n2. **Hold & Wait** — Process holds one resource, waits for another\n3. **No Preemption** — Resources can't be forcibly taken\n4. **Circular Wait** — P1 waits for P2, P2 waits for P3, P3 waits for P1\n\n### Prevention Strategies:\n- **Break Mutual Exclusion** — Use sharable resources\n- **Break Hold & Wait** — Request all resources at once\n- **Allow Preemption** — Force-take resources\n- **Break Circular Wait** — Order resource requests numerically\n\n### Detection & Recovery:\n- Use **Resource Allocation Graph (RAG)**\n- Kill one process in the cycle\n- Rollback to safe state`,
  },
  'normalization': {
    explain: `## Database Normalization 🗃️\n\nNormalization is the process of organizing a database to **reduce redundancy** and **improve data integrity**.\n\n### Normal Forms:\n\n**1NF (First Normal Form)**\n- Each column contains atomic (single) values\n- No repeating groups\n\n**2NF (Second Normal Form)**\n- Must be in 1NF\n- No partial dependencies (non-key attributes depend on full primary key)\n\n**3NF (Third Normal Form)**\n- Must be in 2NF\n- No transitive dependencies (non-key → non-key)\n\n**BCNF (Boyce-Codd Normal Form)**\n- Stronger version of 3NF\n- Every functional dependency X→Y, X must be a super key\n\n### Benefits:\n✅ Eliminates data redundancy\n✅ Prevents update/delete/insert anomalies\n✅ Better data consistency`,
  },
  default: {
    explain: `## Great question! Here's a comprehensive explanation:\n\nThis topic is fundamental to computer science and software engineering. Let me break it down:\n\n### Key Concepts:\n- **Core Principle**: Understanding the foundational idea\n- **Implementation**: How it works in practice\n- **Use Cases**: When and why to apply it\n- **Trade-offs**: Performance vs. complexity considerations\n\n### Best Practices:\n1. Always consider time and space complexity\n2. Think about edge cases\n3. Understand the underlying data structure\n4. Practice with real examples\n\n### Interview Tips:\n💡 Explain your thought process out loud\n💡 Start with brute force, then optimize\n💡 Always discuss complexity at the end\n\nWould you like me to go deeper into any specific aspect? 🎯`,
    quiz: null,
  }
};

const generateQuiz = (subject) => ([
  { q: `What is the time complexity of QuickSort in the average case?`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explanation: 'QuickSort averages O(n log n) due to partitioning at each level of recursion.' },
  { q: `Which data structure uses LIFO (Last In First Out) principle?`, options: ['Queue', 'Array', 'Stack', 'Linked List'], answer: 2, explanation: 'Stack follows LIFO — the last element pushed is the first one popped.' },
  { q: `What does ACID stand for in DBMS?`, options: ['Array, Code, Index, Data', 'Atomicity, Consistency, Isolation, Durability', 'Abstract, Compile, Integrate, Deploy', 'Access, Create, Insert, Delete'], answer: 1, explanation: 'ACID properties ensure reliable database transactions.' },
  { q: `In OS, what is a semaphore used for?`, options: ['Memory allocation', 'Process scheduling', 'Synchronization between processes', 'File management'], answer: 2, explanation: 'Semaphores are synchronization primitives used to control access to shared resources.' },
  { q: `Which layer of OSI model handles routing?`, options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Session Layer'], answer: 2, explanation: 'The Network Layer (Layer 3) handles routing using IP addresses.' },
]);

const generateFlashcards = () => ([
  { front: 'What is Big O Notation?', back: 'A mathematical notation to describe the upper bound of an algorithm\'s time/space complexity as input grows.' },
  { front: 'What is a Hash Table?', back: 'A data structure that maps keys to values using a hash function. Average O(1) for insert, delete, lookup.' },
  { front: 'What is a Binary Tree?', back: 'A tree where each node has at most 2 children — left and right subtrees.' },
  { front: 'What is Polymorphism?', back: 'OOP concept where objects of different types can be treated uniformly. Achieved via method overriding/overloading.' },
  { front: 'What is a Process vs Thread?', back: 'Process: independent program with own memory. Thread: lightweight unit within a process sharing the same memory.' },
  { front: 'What is SQL JOIN?', back: 'Combines rows from 2+ tables based on a related column. Types: INNER, LEFT, RIGHT, FULL OUTER JOIN.' },
]);

// ── Flashcard Component ──────────────────────────────────────────────────────
const Flashcard = ({ card, index }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      onClick={() => setFlipped(!flipped)} style={{ cursor: 'pointer', perspective: 1000, height: 160 }}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Question</span>
          <p style={{ color: '#E2E8F0', fontWeight: 600, textAlign: 'center', fontSize: 15 }}>{card.front}</p>
          <span style={{ color: '#64748B', fontSize: 11, marginTop: 10 }}>Click to reveal ↗</span>
        </div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <span style={{ color: '#34D399', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Answer</span>
          <p style={{ color: '#E2E8F0', textAlign: 'center', fontSize: 14 }}>{card.back}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Quiz Component ───────────────────────────────────────────────────────────
const QuizView = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => quiz[parseInt(i)].answer === a).length;

  return (
    <div>
      {quiz.map((q, i) => (
        <div key={i} style={{ marginBottom: 20, background: 'rgba(99,102,241,0.05)', borderRadius: 14, padding: 18, border: '1px solid rgba(99,102,241,0.12)' }}>
          <p style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 12, fontSize: 15 }}>Q{i+1}. {q.q}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {q.options.map((opt, j) => {
              const isSelected = answers[i] === j;
              const isCorrect = q.answer === j;
              let bg = 'rgba(99,102,241,0.07)', border = 'rgba(99,102,241,0.15)', color = '#94A3B8';
              if (isSelected && !submitted) { bg = 'rgba(124,58,237,0.15)'; border = '#7C3AED'; color = '#C4B5FD'; }
              if (submitted && isCorrect) { bg = 'rgba(16,185,129,0.15)'; border = '#10B981'; color = '#34D399'; }
              if (submitted && isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = '#EF4444'; color = '#FCA5A5'; }
              return (
                <button key={j} onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                  style={{ padding: '10px 14px', borderRadius: 9, border: `1px solid ${border}`, background: bg, color, fontSize: 13, fontWeight: 500, cursor: submitted ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 10, fontStyle: 'italic' }}>💡 {q.explanation}</p>}
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} className="btn-primary" style={{ width: '100%', padding: 14 }}>Submit Answers</button>
      ) : (
        <div style={{ textAlign: 'center', padding: 20, background: 'rgba(16,185,129,0.1)', borderRadius: 14, border: '1px solid rgba(16,185,129,0.2)' }}>
          <p style={{ color: '#34D399', fontSize: 22, fontWeight: 900 }}>{score}/{quiz.length}</p>
          <p style={{ color: '#64748B' }}>{score >= 4 ? '🎉 Excellent!' : score >= 3 ? '👍 Good job!' : '📚 Keep practicing!'}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{ marginTop: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', borderRadius: 9, padding: '8px 18px', color: '#34D399', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            <RotateCcw size={13} style={{ marginRight: 6 }} /> Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const StudyAssistant = () => {
  const [subject, setSubject] = useState('dsa');
  const [mode, setMode] = useState('explain');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [flashcards, setFlashcards] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const getAIResponse = (userInput, currentMode) => {
    const lower = userInput.toLowerCase();
    if (currentMode === 'quiz') return { type: 'quiz', data: generateQuiz(subject) };
    if (currentMode === 'flashcard') return { type: 'flashcard', data: generateFlashcards() };

    let responseKey = 'default';
    if (lower.includes('binary search')) responseKey = 'binary search';
    if (lower.includes('deadlock')) responseKey = 'deadlock';
    if (lower.includes('normalization')) responseKey = 'normalization';

    const resp = AI_RESPONSES[responseKey] || AI_RESPONSES.default;
    const text = resp[currentMode] || resp.explain || AI_RESPONSES.default.explain;
    return { type: 'text', data: text };
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text, id: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    setQuizData(null);
    setFlashcards(null);

    await new Promise(r => setTimeout(r, 900));

    const response = getAIResponse(text, mode);
    if (response.type === 'quiz') {
      setQuizData(response.data);
      setMessages(m => [...m, { role: 'ai', content: 'Here\'s your quiz! Answer all questions then submit. 🎯', id: Date.now() + 1 }]);
    } else if (response.type === 'flashcard') {
      setFlashcards(response.data);
      setMessages(m => [...m, { role: 'ai', content: 'Here are your flashcards! Click each card to flip it. 🃏', id: Date.now() + 1 }]);
    } else {
      setMessages(m => [...m, { role: 'ai', content: response.data, id: Date.now() + 1 }]);
    }
    setLoading(false);
  };

  const sub = SUBJECTS.find(s => s.id === subject);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', gap: 20 }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Subject</p>
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => { setSubject(s.id); setMessages([]); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', background: subject === s.id ? `${s.color}15` : 'transparent', cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s' }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ color: subject === s.id ? s.color : '#94A3B8', fontWeight: subject === s.id ? 700 : 500, fontSize: 13 }}>{s.name}</span>
            </button>
          ))}
        </div>
        <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 16 }}>
          <p style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Mode</p>
          {MODES.map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setMessages([]); setQuizData(null); setFlashcards(null); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 9, border: 'none', background: mode === m.id ? 'rgba(124,58,237,0.15)' : 'transparent', cursor: 'pointer', marginBottom: 4 }}>
              <m.icon size={13} style={{ color: mode === m.id ? '#7C3AED' : '#475569' }} />
              <span style={{ color: mode === m.id ? '#C4B5FD' : '#64748B', fontWeight: mode === m.id ? 600 : 400, fontSize: 12 }}>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 20, overflow: 'hidden', minHeight: 600 }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${sub?.color}18`, border: `1px solid ${sub?.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{sub?.icon}</div>
          <div>
            <h2 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 16, margin: 0, fontFamily: 'Outfit' }}>AI Study Assistant</h2>
            <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>{sub?.name} — {MODES.find(m2 => m2.id === mode)?.name} Mode</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '5px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ color: '#34D399', fontSize: 12, fontWeight: 600 }}>AI Ready</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <Brain size={48} style={{ color: '#7C3AED', opacity: 0.4, marginBottom: 16 }} />
              <h3 style={{ color: '#64748B', fontWeight: 600, marginBottom: 8 }}>Ask me anything!</h3>
              <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>Try one of these prompts:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                {(SAMPLE_PROMPTS[mode] || SAMPLE_PROMPTS.explain).map(p => (
                  <button key={p} onClick={() => handleSend(p)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.05)', color: '#94A3B8', fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <ChevronRight size={13} style={{ color: '#7C3AED' }} /> {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                  <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(99,102,241,0.08)', border: msg.role === 'ai' ? '1px solid rgba(99,102,241,0.12)' : 'none', color: '#E2E8F0', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'Inter' }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {quizData && <QuizView quiz={quizData} />}
              {flashcards && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {flashcards.map((c, i) => <Flashcard key={i} card={c} index={i} />)}
                </div>
              )}
              {loading && (
                <div style={{ display: 'flex', gap: 6, padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 12, width: 'fit-content', border: '1px solid rgba(99,102,241,0.12)' }}>
                  {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, delay: i*0.15, duration: 0.5 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED' }} />)}
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(99,102,241,0.12)', display: 'flex', gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Ask about ${sub?.name}...`}
            style={{ flex: 1, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '12px 16px', color: '#E2E8F0', fontSize: 14, fontFamily: 'Inter', outline: 'none' }} />
          <button onClick={() => handleSend()} disabled={!input.trim() || loading} className="btn-primary"
            style={{ padding: '12px 18px', borderRadius: 12, opacity: !input.trim() || loading ? 0.5 : 1 }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;
