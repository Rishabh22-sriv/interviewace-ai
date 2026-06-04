import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Lightbulb, Code2, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚙️' },
];

const PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy',
    desc: 'Given an array of integers and a target, return indices of the two numbers that add up to the target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explain: 'nums[0] + nums[1] = 2 + 7 = 9' }],
    hints: ['Try using a hash map', 'For each element, check if (target - element) exists in the map', 'Store each element\'s index as you iterate'],
    starter: {
      javascript: 'function twoSum(nums, target) {\n  // Your solution here\n  \n}',
      python: 'def twoSum(nums, target):\n    # Your solution here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n}',
      cpp: '#include<vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your solution here\n        return {};\n    }\n};',
    },
    solution: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}',
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i',
    }
  },
  {
    id: 2, title: 'Reverse a String', difficulty: 'Easy',
    desc: 'Write a function that reverses a string. The input string is given as an array of characters.',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explain: 'Reverse in place' }],
    hints: ['Use two pointers from both ends', 'Swap characters and move pointers inward', 'No extra space needed'],
    starter: {
      javascript: 'function reverseString(s) {\n  // Your solution here\n}',
      python: 'def reverseString(s):\n    # Your solution here\n    pass',
      java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Your solution here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your solution here\n    }\n};',
    },
    solution: { javascript: 'function reverseString(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    [s[l], s[r]] = [s[r], s[l]];\n    l++; r--;\n  }\n}', python: 'def reverseString(s):\n    s.reverse()' }
  },
  {
    id: 3, title: 'Fibonacci Number', difficulty: 'Easy',
    desc: 'Calculate F(n) where F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Optimize for O(n) time.',
    examples: [{ input: 'n = 10', output: '55', explain: 'F(10) = 55' }],
    hints: ['Don\'t use recursion — it\'s O(2^n)', 'Keep track of only last two values', 'Iterate n times'],
    starter: {
      javascript: 'function fib(n) {\n  // Your solution here\n}',
      python: 'def fib(n):\n    # Your solution here\n    pass',
      java: 'class Solution {\n    public int fib(int n) {\n        // Your solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int fib(int n) {\n        // Your solution here\n        return 0;\n    }\n};',
    },
    solution: { javascript: 'function fib(n) {\n  let a = 0, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}', python: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a' }
  },
  {
    id: 4, title: 'Valid Parentheses', difficulty: 'Medium',
    desc: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [{ input: 's = "()[]{}"', output: 'true', explain: 'All brackets are properly matched' }],
    hints: ['Use a stack', 'Push opening brackets, pop when closing bracket is seen', 'At the end, stack should be empty'],
    starter: {
      javascript: 'function isValid(s) {\n  // Your solution here\n}',
      python: 'def isValid(s):\n    # Your solution here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your solution here\n        return false;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Your solution here\n        return false;\n    }\n};',
    },
    solution: { javascript: 'function isValid(s) {\n  const stack = [], map = {")":" (", "}":"{", "]":"["};\n  for (const c of s) {\n    if ("({[".includes(c)) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}', python: 'def isValid(s):\n    stack = []\n    pairs = {")" : "(", "}" : "{", "]" : "["}\n    for c in s:\n        if c in "({[": stack.append(c)\n        elif not stack or stack.pop() != pairs[c]: return False\n    return not stack' }
  },
  {
    id: 5, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy',
    desc: 'Find the maximum depth (number of nodes along the longest path from root to leaf) of a binary tree.',
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3', explain: 'Tree has 3 levels' }],
    hints: ['Use recursion or BFS', 'Depth = 1 + max(left depth, right depth)', 'Base case: null node returns 0'],
    starter: {
      javascript: 'function maxDepth(root) {\n  // Your solution here\n}',
      python: 'def maxDepth(root):\n    # Your solution here\n    pass',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your solution here\n        return 0;\n    }\n};',
    },
    solution: { javascript: 'function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}', python: 'def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))' }
  },
];

const DIFF_COLOR = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };
const DIFF_BG = { Easy: 'rgba(16,185,129,0.12)', Medium: 'rgba(245,158,11,0.12)', Hard: 'rgba(239,68,68,0.12)' };

const MOCK_OUTPUTS = {
  1: { input: '[2,7,11,15], 9', output: '[0, 1]', status: 'Accepted ✅', time: '72ms', memory: '42.1 MB' },
  2: { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', status: 'Accepted ✅', time: '88ms', memory: '45.2 MB' },
  3: { input: '10', output: '55', status: 'Accepted ✅', time: '60ms', memory: '41.8 MB' },
  4: { input: '"()[]{}"', output: 'true', status: 'Accepted ✅', time: '68ms', memory: '43.2 MB' },
  5: { input: '[3,9,20,null,null,15,7]', output: '3', status: 'Accepted ✅', time: '79ms', memory: '44.5 MB' },
};

const CodingPractice = () => {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(PROBLEMS[0].starter.javascript);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectProblem = (p) => {
    setSelectedProblem(p);
    setCode(p.starter[language]);
    setOutput(null);
    setShowHint(false);
    setHintIndex(0);
    setShowSolution(false);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setCode(selectedProblem.starter[lang]);
    setShowLangMenu(false);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 1200));
    setOutput(MOCK_OUTPUTS[selectedProblem.id] || { input: 'test', output: 'Result', status: 'Accepted ✅', time: '80ms', memory: '42MB' });
    setLoading(false);
  };

  const selectedLang = LANGUAGES.find(l => l.id === language);

  return (
    <div style={{ minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 2 }}>
            <span className="gradient-text">AI Coding Practice</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 13 }}>Practice with hints, AI explanation, and instant feedback</p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* Problem List */}
        <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 12, overflowY: 'auto' }}>
          <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px 8px', margin: 0 }}>Problems</p>
          {PROBLEMS.map((p, i) => (
            <button key={p.id} onClick={() => selectProblem(p)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: selectedProblem.id === p.id ? 'rgba(124,58,237,0.12)' : 'transparent', cursor: 'pointer', textAlign: 'left', marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                <span style={{ color: selectedProblem.id === p.id ? '#C4B5FD' : '#94A3B8', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i + 1}. {p.title}</span>
                <span style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty], borderRadius: 10, padding: '2px 7px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.difficulty}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Editor Panel */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: 12 }}>
          {/* Top: Description + Editor side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Problem Description */}
            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <h2 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 16, margin: 0, fontFamily: 'Outfit' }}>{selectedProblem.title}</h2>
                <span style={{ background: DIFF_BG[selectedProblem.difficulty], color: DIFF_COLOR[selectedProblem.difficulty], borderRadius: 10, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{selectedProblem.difficulty}</span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{selectedProblem.desc}</p>
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={{ background: 'rgba(99,102,241,0.05)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Example {i + 1}</p>
                  <p style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}><strong style={{ color: '#64748B' }}>Input:</strong> {ex.input}</p>
                  <p style={{ color: '#94A3B8', fontSize: 12, margin: '4px 0 0' }}><strong style={{ color: '#64748B' }}>Output:</strong> {ex.output}</p>
                  <p style={{ color: '#475569', fontSize: 12, margin: '4px 0 0', fontStyle: 'italic' }}>// {ex.explain}</p>
                </div>
              ))}

              {/* Hints */}
              <button onClick={() => setShowHint(!showHint)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, padding: '8px 14px', color: '#F59E0B', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: 12 }}>
                  <p style={{ color: '#FCD34D', fontSize: 13, margin: 0 }}>💡 Hint {hintIndex + 1}: {selectedProblem.hints[hintIndex]}</p>
                  {hintIndex < selectedProblem.hints.length - 1 && (
                    <button onClick={() => setHintIndex(h => h + 1)} style={{ marginTop: 8, color: '#F59E0B', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Next Hint →</button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Code Editor */}
            <div style={{ background: '#0A0F1E', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Editor Header */}
              <div style={{ background: '#0D1627', borderBottom: '1px solid rgba(99,102,241,0.1)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '5px 10px', color: '#94A3B8', fontSize: 13, cursor: 'pointer' }}>
                    {selectedLang?.icon} {selectedLang?.name} <ChevronDown size={12} />
                  </button>
                  {showLangMenu && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#0D1627', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, zIndex: 10, overflow: 'hidden', minWidth: 140 }}>
                      {LANGUAGES.map(l => (
                        <button key={l.id} onClick={() => selectLanguage(l.id)}
                          style={{ width: '100%', padding: '9px 14px', background: l.id === language ? 'rgba(124,58,237,0.12)' : 'transparent', border: 'none', color: l.id === language ? '#C4B5FD' : '#94A3B8', fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {l.icon} {l.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setCode(selectedProblem.starter[language])}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#E2E8F0', fontFamily: '"Fira Code", "Consolas", monospace', fontSize: 13, padding: 16, outline: 'none', resize: 'none', lineHeight: 1.6, minHeight: 200 }} />
            </div>
          </div>

          {/* Bottom: Controls + Output */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleRun} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px' }}>
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Code2 size={15} /></motion.div> : <Play size={15} />}
                {loading ? 'Running...' : 'Run Code'}
              </button>
              <button onClick={() => setShowSolution(!showSolution)} className="btn-secondary" style={{ padding: '10px 16px', fontSize: 13 }}>
                {showSolution ? 'Hide' : '🔑 View'} Solution
              </button>
            </div>

            <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 12, padding: 12, fontFamily: 'monospace', fontSize: 12, minHeight: 60 }}>
              {loading ? (
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', color: '#64748B' }}>
                  {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, delay: i*0.15, duration: 0.5 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />)}
                  <span style={{ marginLeft: 6 }}>Executing...</span>
                </div>
              ) : output ? (
                <div>
                  <div style={{ color: '#10B981', fontWeight: 700, marginBottom: 4 }}>{output.status}</div>
                  <div style={{ color: '#64748B' }}>Output: <span style={{ color: '#E2E8F0' }}>{output.output}</span></div>
                  <div style={{ color: '#475569', marginTop: 4 }}>⏱ {output.time} | 📦 {output.memory}</div>
                </div>
              ) : (
                <span style={{ color: '#475569' }}>Run your code to see output...</span>
              )}
            </div>
          </div>

          {/* Solution Panel */}
          {showSolution && selectedProblem.solution[language] && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: 16 }}>
              <p style={{ color: '#10B981', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>✅ Optimal Solution ({selectedLang?.name})</p>
              <pre style={{ background: '#0A0F1E', borderRadius: 10, padding: 14, color: '#E2E8F0', fontSize: 13, fontFamily: '"Fira Code", monospace', overflowX: 'auto', margin: 0 }}>
                {selectedProblem.solution[language] || selectedProblem.solution.javascript}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
