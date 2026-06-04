import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, CheckCircle, Circle, ChevronRight, X, Clock, Tag, TrendingUp, Award } from 'lucide-react';

const TOPICS = [
  { id: 'arrays', name: 'Arrays', icon: '[]', easy: 4, medium: 3, hard: 2 },
  { id: 'strings', name: 'Strings', icon: '"A"', easy: 3, medium: 4, hard: 2 },
  { id: 'linkedlist', name: 'Linked List', icon: '→', easy: 3, medium: 3, hard: 2 },
  { id: 'stack', name: 'Stack', icon: '⊤', easy: 3, medium: 3, hard: 1 },
  { id: 'queue', name: 'Queue', icon: '⊣', easy: 2, medium: 3, hard: 2 },
  { id: 'tree', name: 'Trees', icon: '🌳', easy: 2, medium: 4, hard: 3 },
  { id: 'graph', name: 'Graph', icon: '◎', easy: 2, medium: 3, hard: 3 },
  { id: 'dp', name: 'Dynamic Programming', icon: '💡', easy: 2, medium: 3, hard: 4 },
  { id: 'sorting', name: 'Sorting', icon: '↕', easy: 3, medium: 2, hard: 2 },
  { id: 'recursion', name: 'Recursion', icon: '∞', easy: 3, medium: 3, hard: 2 },
];

const PROBLEMS = {
  arrays: [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Hash Map', 'Array'], desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', approach: 'Use a hash map to store visited elements. For each element, check if (target - element) exists in the map.', python: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i', js: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}', time: 'O(n)', space: 'O(n)', insight: 'Trading space for time — hash map lookup is O(1).' },
    { id: 2, title: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', tags: ['DP', 'Array'], desc: 'Find the contiguous subarray which has the largest sum and return its sum.', approach: 'Track current running sum. Reset to 0 if it goes negative. Keep track of maximum seen.', python: 'def maxSubArray(nums):\n    max_sum = nums[0]\n    curr = nums[0]\n    for n in nums[1:]:\n        curr = max(n, curr + n)\n        max_sum = max(max_sum, curr)\n    return max_sum', js: 'function maxSubArray(nums) {\n  let max = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    max = Math.max(max, curr);\n  }\n  return max;\n}', time: 'O(n)', space: 'O(1)', insight: 'Kadane\'s algorithm: either extend previous subarray or start fresh.' },
    { id: 3, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Greedy'], desc: 'Find the maximum profit from buying and selling a stock once.', approach: 'Track minimum price seen so far. At each step, compute profit if sold today and update maximum.', python: 'def maxProfit(prices):\n    min_p, max_p = float("inf"), 0\n    for p in prices:\n        min_p = min(min_p, p)\n        max_p = max(max_p, p - min_p)\n    return max_p', js: 'function maxProfit(prices) {\n  let min = Infinity, max = 0;\n  for (const p of prices) {\n    min = Math.min(min, p);\n    max = Math.max(max, p - min);\n  }\n  return max;\n}', time: 'O(n)', space: 'O(1)', insight: 'Single pass — track min price and max profit simultaneously.' },
    { id: 4, title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['Array', 'Prefix Sum'], desc: 'Return an array where each element is the product of all other elements except itself, without division.', approach: 'Use prefix and suffix product arrays. Left product × right product gives the answer.', python: 'def productExceptSelf(nums):\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n-1, -1, -1):\n        res[i] *= suffix\n        suffix *= nums[i]\n    return res', js: 'function productExceptSelf(nums) {\n  const n = nums.length, res = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\n  let suffix = 1;\n  for (let i = n-1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n  return res;\n}', time: 'O(n)', space: 'O(1)', insight: 'Clever prefix/suffix product avoids division and extra space.' },
    { id: 5, title: 'Container With Most Water', difficulty: 'Medium', tags: ['Two Pointers', 'Array'], desc: 'Given heights of n vertical lines, find two lines that together with the x-axis forms a container with most water.', approach: 'Use two pointers from both ends. Move the pointer with smaller height inward.', python: 'def maxArea(height):\n    l, r = 0, len(height) - 1\n    res = 0\n    while l < r:\n        res = max(res, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return res', js: 'function maxArea(height) {\n  let l = 0, r = height.length - 1, res = 0;\n  while (l < r) {\n    res = Math.max(res, Math.min(height[l], height[r]) * (r - l));\n    height[l] < height[r] ? l++ : r--;\n  }\n  return res;\n}', time: 'O(n)', space: 'O(1)', insight: 'Moving the shorter side can only increase area; moving taller never helps.' },
    { id: 6, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', tags: ['Binary Search', 'Array'], desc: 'Find the minimum element in a rotated sorted array in O(log n).', approach: 'Binary search: if mid > right, minimum is in right half, else in left half.', python: 'def findMin(nums):\n    l, r = 0, len(nums)-1\n    while l < r:\n        m = (l + r) // 2\n        if nums[m] > nums[r]: l = m + 1\n        else: r = m\n    return nums[l]', js: 'function findMin(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const m = Math.floor((l + r) / 2);\n    nums[m] > nums[r] ? l = m + 1 : r = m;\n  }\n  return nums[l];\n}', time: 'O(log n)', space: 'O(1)', insight: 'The pivot (rotation point) is always where the order breaks.' },
    { id: 7, title: '3Sum', difficulty: 'Medium', tags: ['Two Pointers', 'Sorting'], desc: 'Find all unique triplets in the array that sum to zero.', approach: 'Sort array. For each element, use two pointers on the rest. Skip duplicates.', python: 'def threeSum(nums):\n    nums.sort()\n    res = []\n    for i, a in enumerate(nums):\n        if i > 0 and a == nums[i-1]: continue\n        l, r = i+1, len(nums)-1\n        while l < r:\n            s = a + nums[l] + nums[r]\n            if s > 0: r -= 1\n            elif s < 0: l += 1\n            else:\n                res.append([a, nums[l], nums[r]])\n                l += 1\n                while l < r and nums[l] == nums[l-1]: l += 1\n    return res', js: 'function threeSum(nums) {\n  nums.sort((a,b) => a-b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i-1]) continue;\n    let l = i+1, r = nums.length-1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s > 0) r--;\n      else if (s < 0) l++;\n      else { res.push([nums[i], nums[l++], nums[r--]]); while (nums[l]===nums[l-1]) l++; }\n    }\n  }\n  return res;\n}', time: 'O(n²)', space: 'O(1)', insight: 'Fixing one element and using two pointers reduces 3-sum to 2-sum.' },
    { id: 8, title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Two Pointers', 'Array'], desc: 'Compute how much water can be trapped between height bars after raining.', approach: 'Two pointers: track max left and max right. Water at position = min(maxL, maxR) - height[i].', python: 'def trap(height):\n    l, r = 0, len(height)-1\n    maxL = maxR = res = 0\n    while l < r:\n        if height[l] <= height[r]:\n            if height[l] >= maxL: maxL = height[l]\n            else: res += maxL - height[l]\n            l += 1\n        else:\n            if height[r] >= maxR: maxR = height[r]\n            else: res += maxR - height[r]\n            r -= 1\n    return res', js: 'function trap(height) {\n  let l = 0, r = height.length-1, maxL = 0, maxR = 0, res = 0;\n  while (l < r) {\n    if (height[l] <= height[r]) {\n      height[l] >= maxL ? maxL = height[l] : res += maxL - height[l];\n      l++;\n    } else {\n      height[r] >= maxR ? maxR = height[r] : res += maxR - height[r];\n      r--;\n    }\n  }\n  return res;\n}', time: 'O(n)', space: 'O(1)', insight: 'Water at each cell is bounded by the minimum of max walls on each side.' },
    { id: 9, title: 'Merge Intervals', difficulty: 'Medium', tags: ['Sorting', 'Array'], desc: 'Given an array of intervals, merge all overlapping intervals.', approach: 'Sort by start. If current start ≤ previous end, merge by taking max end.', python: 'def merge(intervals):\n    intervals.sort()\n    res = [intervals[0]]\n    for s, e in intervals[1:]:\n        if s <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], e)\n        else:\n            res.append([s, e])\n    return res', js: 'function merge(intervals) {\n  intervals.sort((a,b) => a[0]-b[0]);\n  const res = [intervals[0]];\n  for (const [s,e] of intervals.slice(1)) {\n    if (s <= res.at(-1)[1]) res.at(-1)[1] = Math.max(res.at(-1)[1], e);\n    else res.push([s, e]);\n  }\n  return res;\n}', time: 'O(n log n)', space: 'O(n)', insight: 'After sorting, only need to compare with last merged interval.' },
  ],
  strings: [
    { id: 1, title: 'Valid Anagram', difficulty: 'Easy', tags: ['Hash Map', 'String'], desc: 'Given two strings s and t, return true if t is an anagram of s.', approach: 'Count character frequencies in both strings and compare.', python: 'from collections import Counter\ndef isAnagram(s, t):\n    return Counter(s) == Counter(t)', js: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}', time: 'O(n)', space: 'O(1)', insight: 'Fixed alphabet size (26) makes space effectively O(1).' },
    { id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Set'], desc: 'Find the length of the longest substring without repeating characters.', approach: 'Sliding window with a set. Shrink window from left when a repeat is found.', python: 'def lengthOfLongestSubstring(s):\n    seen = set()\n    l = res = 0\n    for r in range(len(s)):\n        while s[r] in seen:\n            seen.remove(s[l])\n            l += 1\n        seen.add(s[r])\n        res = max(res, r - l + 1)\n    return res', js: 'function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let l = 0, res = 0;\n  for (let r = 0; r < s.length; r++) {\n    while (set.has(s[r])) set.delete(s[l++]);\n    set.add(s[r]);\n    res = Math.max(res, r - l + 1);\n  }\n  return res;\n}', time: 'O(n)', space: 'O(min(m,n))', insight: 'Sliding window expands right, contracts left on duplicates.' },
    { id: 3, title: 'Valid Palindrome', difficulty: 'Easy', tags: ['Two Pointers', 'String'], desc: 'Determine if a string is a palindrome, considering only alphanumeric characters.', approach: 'Two pointers from both ends, skip non-alphanumeric, compare chars.', python: 'def isPalindrome(s):\n    l, r = 0, len(s)-1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l, r = l+1, r-1\n    return True', js: 'function isPalindrome(s) {\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, \'\');\n  return s === s.split(\'\').reverse().join(\'\');\n}', time: 'O(n)', space: 'O(1)', insight: 'Clean the string first or skip non-alphanumeric with two pointers.' },
    { id: 4, title: 'Group Anagrams', difficulty: 'Medium', tags: ['Hash Map', 'String', 'Sorting'], desc: 'Group strings that are anagrams of each other.', approach: 'Use sorted string as key. All anagrams have the same sorted form.', python: 'from collections import defaultdict\ndef groupAnagrams(strs):\n    d = defaultdict(list)\n    for s in strs:\n        d[tuple(sorted(s))].append(s)\n    return list(d.values())', js: 'function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split(\'\').sort().join(\'\');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return [...map.values()];\n}', time: 'O(n·k log k)', space: 'O(n·k)', insight: 'Canonical form (sorted) maps all anagrams to the same key.' },
  ],
  dp: [
    { id: 1, title: 'Climbing Stairs', difficulty: 'Easy', tags: ['DP', 'Fibonacci'], desc: 'You are climbing n stairs, one or two steps at a time. How many distinct ways can you reach the top?', approach: 'Like Fibonacci. dp[i] = dp[i-1] + dp[i-2]. Only need last 2 values.', python: 'def climbStairs(n):\n    a, b = 1, 1\n    for _ in range(n-1):\n        a, b = b, a + b\n    return b', js: 'function climbStairs(n) {\n  let a = 1, b = 1;\n  for (let i = 1; i < n; i++) [a, b] = [b, a + b];\n  return b;\n}', time: 'O(n)', space: 'O(1)', insight: 'Classic DP — ways to reach step n = ways from n-1 + ways from n-2.' },
    { id: 2, title: 'Coin Change', difficulty: 'Medium', tags: ['DP', 'BFS'], desc: 'Find the fewest number of coins needed to make up the amount. Return -1 if impossible.', approach: 'Bottom-up DP: dp[i] = min coins to make amount i. For each amount, try all coins.', python: 'def coinChange(coins, amount):\n    dp = [float("inf")] * (amount+1)\n    dp[0] = 0\n    for a in range(1, amount+1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a-c])\n    return dp[amount] if dp[amount] != float("inf") else -1', js: 'function coinChange(coins, amount) {\n  const dp = Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++)\n    for (const c of coins)\n      if (a-c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a-c]);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}', time: 'O(n·m)', space: 'O(n)', insight: 'Build up from amount 0 — each cell uses previously computed optimal solutions.' },
    { id: 3, title: 'Longest Common Subsequence', difficulty: 'Medium', tags: ['DP', '2D DP'], desc: 'Find the length of the longest common subsequence of two strings.', approach: '2D DP table. dp[i][j] = LCS of s1[:i] and s2[:j]. If chars match, +1 from diagonal.', python: 'def longestCommonSubsequence(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]', js: 'function lcs(s1, s2) {\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({length:m+1}, () => Array(n+1).fill(0));\n  for (let i=1;i<=m;i++)\n    for (let j=1;j<=n;j++)\n      dp[i][j] = s1[i-1]===s2[j-1] ? 1+dp[i-1][j-1] : Math.max(dp[i-1][j],dp[i][j-1]);\n  return dp[m][n];\n}', time: 'O(m·n)', space: 'O(m·n)', insight: 'Classic 2D DP — subproblems build naturally from smaller prefixes.' },
  ],
};

// Fill remaining topics with placeholder problems
['linkedlist', 'stack', 'queue', 'tree', 'graph', 'sorting', 'recursion'].forEach(topic => {
  if (!PROBLEMS[topic]) {
    PROBLEMS[topic] = [
      { id: 1, title: `${topic.charAt(0).toUpperCase()+topic.slice(1)} Problem 1`, difficulty: 'Easy', tags: [topic], desc: 'Practice problem — coming soon with full solutions.', approach: 'Think step by step.', python: '# Solution coming soon', js: '// Solution coming soon', time: 'O(n)', space: 'O(1)', insight: 'Break the problem into smaller subproblems.' },
      { id: 2, title: `${topic.charAt(0).toUpperCase()+topic.slice(1)} Problem 2`, difficulty: 'Medium', tags: [topic], desc: 'Practice problem — coming soon with full solutions.', approach: 'Think step by step.', python: '# Solution coming soon', js: '// Solution coming soon', time: 'O(n log n)', space: 'O(n)', insight: 'Think about edge cases first.' },
      { id: 3, title: `${topic.charAt(0).toUpperCase()+topic.slice(1)} Problem 3`, difficulty: 'Hard', tags: [topic], desc: 'Practice problem — coming soon with full solutions.', approach: 'Think step by step.', python: '# Solution coming soon', js: '// Solution coming soon', time: 'O(n²)', space: 'O(n)', insight: 'Consider multiple approaches before coding.' },
    ];
  }
});

const DIFF_COLOR = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };
const DIFF_BG = { Easy: 'rgba(16,185,129,0.12)', Medium: 'rgba(245,158,11,0.12)', Hard: 'rgba(239,68,68,0.12)' };

const DSAHub = () => {
  const [selectedTopic, setSelectedTopic] = useState('arrays');
  const [diffFilter, setDiffFilter] = useState('All');
  const [solved, setSolved] = useState({});
  const [modalProblem, setModalProblem] = useState(null);
  const [modalTab, setModalTab] = useState('python');

  const topic = TOPICS.find(t => t.id === selectedTopic);
  const problems = PROBLEMS[selectedTopic] || [];
  const filtered = diffFilter === 'All' ? problems : problems.filter(p => p.difficulty === diffFilter);

  const totalProblems = Object.values(PROBLEMS).flat().length;
  const totalSolved = Object.keys(solved).length;
  const easySolved = Object.values(PROBLEMS).flat().filter(p => p.difficulty === 'Easy' && solved[`${selectedTopic}-${p.id}`]).length;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
          <span className="gradient-text">DSA Practice Hub</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>Topic-wise practice with solutions and explanations</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Solved', value: totalSolved, color: '#7C3AED', icon: '🏆' },
          { label: 'Easy', value: Object.values(PROBLEMS).flat().filter(p => p.difficulty === 'Easy' && solved[p.id]).length, color: '#10B981', icon: '✅' },
          { label: 'Medium', value: Object.values(PROBLEMS).flat().filter(p => p.difficulty === 'Medium' && solved[p.id]).length, color: '#F59E0B', icon: '🎯' },
          { label: 'Hard', value: Object.values(PROBLEMS).flat().filter(p => p.difficulty === 'Hard' && solved[p.id]).length, color: '#EF4444', icon: '🔥' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 900, fontFamily: 'Outfit' }}>{s.value}</div>
            <div style={{ color: '#64748B', fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 12, height: 'fit-content' }}>
          {TOPICS.map(t => {
            const topicProblems = PROBLEMS[t.id] || [];
            const topicSolved = topicProblems.filter(p => solved[`${t.id}-${p.id}`]).length;
            const progress = Math.round((topicSolved / topicProblems.length) * 100);

            return (
              <button key={t.id} onClick={() => setSelectedTopic(t.id)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: selectedTopic === t.id ? 'rgba(124,58,237,0.12)' : 'transparent', cursor: 'pointer', textAlign: 'left', marginBottom: 4, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: selectedTopic === t.id ? '#C4B5FD' : '#94A3B8', fontWeight: selectedTopic === t.id ? 700 : 500, fontSize: 13 }}>{t.name}</span>
                  <span style={{ color: '#475569', fontSize: 11 }}>{topicSolved}/{topicProblems.length}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(99,102,241,0.1)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Problems */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)}
                style={{ padding: '7px 16px', borderRadius: 20, border: `1.5px solid ${diffFilter === d ? (DIFF_COLOR[d] || '#7C3AED') : 'rgba(99,102,241,0.15)'}`, background: diffFilter === d ? (DIFF_BG[d] || 'rgba(124,58,237,0.12)') : 'transparent', color: diffFilter === d ? (DIFF_COLOR[d] || '#C4B5FD') : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {d}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: 'rgba(13,22,39,0.8)', border: `1px solid ${solved[`${selectedTopic}-${p.id}`] ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.12)'}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={() => setSolved(s => ({ ...s, [`${selectedTopic}-${p.id}`]: !s[`${selectedTopic}-${p.id}`] }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 2 }}>
                  {solved[`${selectedTopic}-${p.id}`]
                    ? <CheckCircle size={20} style={{ color: '#10B981' }} />
                    : <Circle size={20} style={{ color: '#475569' }} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 14 }}>{p.title}</span>
                    <span style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty], border: `1px solid ${DIFF_COLOR[p.difficulty]}30`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{p.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {p.tags.map(tag => <span key={tag} style={{ background: 'rgba(99,102,241,0.08)', color: '#64748B', borderRadius: 5, padding: '1px 8px', fontSize: 11 }}>{tag}</span>)}
                  </div>
                </div>
                <button onClick={() => { setModalProblem({ ...p, topicId: selectedTopic }); setModalTab('python'); }}
                  style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 9, padding: '7px 14px', color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ChevronRight size={13} /> Solution
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalProblem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalProblem(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#0D1627', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '85vh', overflowY: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h2 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 20, marginBottom: 6, fontFamily: 'Outfit' }}>{modalProblem.title}</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: DIFF_BG[modalProblem.difficulty], color: DIFF_COLOR[modalProblem.difficulty], borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>{modalProblem.difficulty}</span>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: '#94A3B8', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>⏱ {modalProblem.time}</span>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: '#94A3B8', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>📦 {modalProblem.space}</span>
                  </div>
                </div>
                <button onClick={() => setModalProblem(null)} style={{ background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#64748B' }}><X size={16} /></button>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{modalProblem.desc}</p>
              </div>

              <div style={{ background: 'rgba(124,58,237,0.06)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(124,58,237,0.1)' }}>
                <p style={{ color: '#A78BFA', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>💡 Approach</p>
                <p style={{ color: '#C4B5FD', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{modalProblem.approach}</p>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid rgba(16,185,129,0.1)' }}>
                <p style={{ color: '#10B981', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>🔑 Key Insight</p>
                <p style={{ color: '#6EE7B7', fontSize: 14, margin: 0 }}>{modalProblem.insight}</p>
              </div>

              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {['python', 'javascript'].map(lang => (
                  <button key={lang} onClick={() => setModalTab(lang)}
                    style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${modalTab === lang ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: modalTab === lang ? 'rgba(124,58,237,0.15)' : 'transparent', color: modalTab === lang ? '#C4B5FD' : '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {lang === 'python' ? '🐍 Python' : '🟨 JavaScript'}
                  </button>
                ))}
              </div>
              <pre style={{ background: '#0A0F1E', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 12, padding: 16, color: '#E2E8F0', fontSize: 13, fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>
                {modalTab === 'python' ? modalProblem.python : modalProblem.js}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DSAHub;
