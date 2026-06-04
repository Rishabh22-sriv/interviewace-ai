import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, ThumbsUp, Search, Plus, X, Tag, Building2,
  Clock, ChevronDown, ChevronUp, Send, Hash, TrendingUp,
  Users, CheckCircle2, Eye, Filter, Globe, EyeOff, Award,
  Flame, Bookmark, Share2, MoreHorizontal
} from 'lucide-react';

/* ─────────────────── MOCK DATA ─────────────────── */
const MOCK_POSTS = [
  {
    id: 1,
    author: 'Arjun Mehta',
    avatar: 'AM',
    avatarColor: '#7C3AED',
    anonymous: false,
    time: '2h ago',
    title: 'Amazon SDE-1 Interview Experience (Bangalore) — Cleared! 🎉',
    content: `Just got the offer from Amazon Bangalore! Sharing my experience to help others.\n\n**Round 1 (OA):** 2 coding questions — sliding window (medium) and graph BFS (hard). Solved both in time.\n\n**Round 2 (Technical):** Arrays & strings, asked to implement an LRU cache. Focus on time complexity.\n\n**Round 3 (LP Round):** 6 leadership principle questions. Prepare STAR stories thoroughly — they dig deep.\n\n**Round 4 (System Design):** Design a URL shortener. Discuss scale, DB choice, caching.\n\nKey tip: Always think aloud and always clarify constraints before coding. Good luck everyone! 💪`,
    tags: ['Technical', 'DSA', 'Placement'],
    company: 'Amazon',
    upvotes: 142,
    voted: false,
    comments: [
      { id: 1, author: 'Priya Sharma', avatar: 'PS', avatarColor: '#06B6D4', text: 'Congratulations! What resources did you use for LP prep?', time: '1h ago' },
      { id: 2, author: 'Rohan Das', avatar: 'RD', avatarColor: '#10B981', text: 'Amazing! Did they ask about OS concepts in any round?', time: '45m ago' },
    ],
    expanded: false,
  },
  {
    id: 2,
    author: 'Anonymous',
    avatar: '??',
    avatarColor: '#475569',
    anonymous: true,
    time: '4h ago',
    title: 'Honest review of Wipro WILP program — Worth it?',
    content: `I joined Wipro WILP 8 months ago. Mixed feelings.\n\n**Pros:** Structured learning, salary from day 1, job security, good for non-CS students.\n\n**Cons:** Very slow-paced for experienced coders, assignments are repetitive, mandatory attendance even for online sessions.\n\nIf you have strong CS fundamentals and want a product company, keep trying. But if you need a stable start, WILP is decent. The training stipend is ₹40k/month during probation.`,
    tags: ['Placement', 'HR'],
    company: 'Wipro',
    upvotes: 88,
    voted: false,
    comments: [
      { id: 1, author: 'Neha Gupta', avatar: 'NG', avatarColor: '#EC4899', text: 'What is the bond period for WILP?', time: '3h ago' },
    ],
    expanded: false,
  },
  {
    id: 3,
    author: 'Siddharth Rao',
    avatar: 'SR',
    avatarColor: '#06B6D4',
    anonymous: false,
    time: '6h ago',
    title: 'How I cracked Flipkart SDE-2 after 3 rejections',
    content: `Third time was the charm! After failing Flipkart rounds twice, here's what I changed:\n\n1. **DP problems** — Did all 50 classic DP patterns on LeetCode\n2. **System Design** — Read Designing Data-Intensive Applications cover to cover\n3. **Mock Interviews** — Practiced with friends 3x per week for 2 months\n\nFinal round breakdown:\n- DSA: Segment tree problem + graph coloring\n- System Design: Design Google Drive\n- Managerial: Conflict resolution, team situations\n\nSalary: ₹32 LPA + ESOPs. DM me for detailed notes!`,
    tags: ['DSA', 'Technical', 'Placement'],
    company: 'Flipkart',
    upvotes: 214,
    voted: false,
    comments: [
      { id: 1, author: 'Kavya Nair', avatar: 'KN', avatarColor: '#7C3AED', text: 'Can you share the DP resources you used?', time: '5h ago' },
      { id: 2, author: 'Amit Verma', avatar: 'AV', avatarColor: '#F59E0B', text: 'What was the timeline from first round to offer?', time: '4h ago' },
      { id: 3, author: 'Siddharth Rao', avatar: 'SR', avatarColor: '#06B6D4', text: '@Kavya — Striver\'s DP sheet + NeetCode! @Amit — 3 weeks total.', time: '3h ago' },
    ],
    expanded: false,
  },
  {
    id: 4,
    author: 'Tanvi Singh',
    avatar: 'TS',
    avatarColor: '#EC4899',
    anonymous: false,
    time: '10h ago',
    title: 'TCS NQT Pattern 2025 — What changed this year',
    content: `Appeared for TCS NQT last week. Here's the updated pattern:\n\n**Section 1 — Verbal:** Reading comprehension (3 passages), sentence completion, grammar. Easier than last year.\n\n**Section 2 — Aptitude:** Time & Work, Probability, Number Series. 26 questions, 40 mins.\n\n**Section 3 — Coding:** 1 coding question (easy-medium). This year it was string manipulation.\n\n**Cutoff (approx):** 70%+ overall. Verbal cutoff is strict.\n\nPro tip: Don't skip the verbal section! Many people lose marks there while focusing on aptitude.`,
    tags: ['Placement', 'DSA'],
    company: 'TCS',
    upvotes: 67,
    voted: false,
    comments: [
      { id: 1, author: 'Ravi Kumar', avatar: 'RK', avatarColor: '#06B6D4', text: 'Is there negative marking in NQT?', time: '9h ago' },
      { id: 2, author: 'Tanvi Singh', avatar: 'TS', avatarColor: '#EC4899', text: 'No negative marking! Attempt everything.', time: '8h ago' },
    ],
    expanded: false,
  },
  {
    id: 5,
    author: 'Karan Malhotra',
    avatar: 'KM',
    avatarColor: '#10B981',
    anonymous: false,
    time: '1d ago',
    title: 'Google L3 SWE Interview — What to really expect',
    content: `Sharing my Google interview experience (India office, Hyderabad).\n\n5 rounds over 2 days (virtual):\n\n**Rounds 1-2 (Coding):** Graph problems, one involved dynamic programming on trees. Implement solution cleanly.\n\n**Round 3 (Coding + Design):** Medium LeetCode + mini system design discussion (design a rate limiter).\n\n**Round 4 (Googleyness):** Values-based questions. Be authentic.\n\n**Round 5 (System Design):** Design YouTube search at scale.\n\nImportant: Google cares about code quality, not just correctness. Write clean, commented code. Time complexity MUST be discussed.`,
    tags: ['Technical', 'DSA', 'Company'],
    company: 'Google',
    upvotes: 389,
    voted: false,
    comments: [
      { id: 1, author: 'Meera Iyer', avatar: 'MI', avatarColor: '#7C3AED', text: 'What was the timeline from application to offer?', time: '23h ago' },
      { id: 2, author: 'Karan Malhotra', avatar: 'KM', avatarColor: '#10B981', text: '6 weeks from application to final offer!', time: '22h ago' },
    ],
    expanded: false,
  },
  {
    id: 6,
    author: 'Divya Krishnan',
    avatar: 'DK',
    avatarColor: '#A78BFA',
    anonymous: false,
    time: '1d ago',
    title: 'Resume Tips that got me 15 interview calls in 2 weeks',
    content: `I revamped my resume using these tips and went from 0 responses to 15 interview calls.\n\n**What I changed:**\n- One-page, ATS-friendly format (used Jake's Resume template)\n- Quantified EVERY bullet: "Reduced API response time by 40%"\n- Added 3 relevant projects with GitHub links\n- Skills section: only mentioned skills I can explain in an interview\n- Removed objective statement, replaced with summary\n\n**What NOT to do:**\n- Don't use tables or multi-column layouts (ATS fails)\n- Don't list 50 skills you barely know\n- Don't use photos or color-heavy designs\n\nHappy to review resumes — post in comments!`,
    tags: ['Resume', 'Placement'],
    company: null,
    upvotes: 176,
    voted: false,
    comments: [
      { id: 1, author: 'Ankit Patel', avatar: 'AP', avatarColor: '#F59E0B', text: 'Can you share the Jake\'s template link?', time: '20h ago' },
      { id: 2, author: 'Divya Krishnan', avatar: 'DK', avatarColor: '#A78BFA', text: 'Search "Jake Resume LaTeX" on Overleaf!', time: '19h ago' },
    ],
    expanded: false,
  },
  {
    id: 7,
    author: 'Anonymous',
    avatar: '??',
    avatarColor: '#475569',
    anonymous: true,
    time: '2d ago',
    title: 'Honest feedback: Infosys InfyTQ vs mainstream placement — my take',
    content: `Been at Infosys for 1 year now (joined via campus). Honest review:\n\n**Training:** 3 months intensive at Mysore campus. Good experience, you learn a lot.\n\n**Work culture:** Depends heavily on project and manager. Some teams are toxic, some are great.\n\n**Salary:** Starting at ₹3.6 LPA (freshers). Growth is slow — expect ₹5-6 LPA after 2 years.\n\n**Learning:** Limited if you want cutting-edge tech. Most projects are legacy Java/.NET.\n\nAdvice: Use Infosys as a launchpad. Get 1-2 years of experience, then switch to product companies. The brand name does help in getting interviews.`,
    tags: ['HR', 'Placement'],
    company: 'Infosys',
    upvotes: 134,
    voted: false,
    comments: [
      { id: 1, author: 'Pooja Desai', avatar: 'PD', avatarColor: '#06B6D4', text: 'Is the Mysore training paid or unpaid?', time: '1d ago' },
    ],
    expanded: false,
  },
  {
    id: 8,
    author: 'Rahul Joshi',
    avatar: 'RJ',
    avatarColor: '#F59E0B',
    anonymous: false,
    time: '2d ago',
    title: 'Graph algorithms you MUST know for FAANG — Complete guide',
    content: `After clearing interviews at Microsoft and Meta, here are the graph topics that appeared in my rounds:\n\n**Basic:** BFS, DFS, cycle detection\n**Intermediate:** Topological sort, Dijkstra, Bellman-Ford\n**Advanced:** Union-Find (DSU), MST (Prim/Kruskal), Tarjan's SCC\n\nMost common problem patterns:\n1. Connected components (Union-Find)\n2. Shortest path with constraints (modified Dijkstra)\n3. Detecting cycles in directed/undirected graphs\n4. Bipartite graph check\n5. DAG problems (course schedule, etc.)\n\nPractice: All graph problems on LeetCode 75 + NeetCode graph section. Should take ~3 weeks.`,
    tags: ['DSA', 'Technical'],
    company: null,
    upvotes: 298,
    voted: false,
    comments: [
      { id: 1, author: 'Simran Kaur', avatar: 'SK', avatarColor: '#10B981', text: 'Is Union-Find asked often in Indian companies too?', time: '1d ago' },
      { id: 2, author: 'Rahul Joshi', avatar: 'RJ', avatarColor: '#F59E0B', text: 'Yes! Especially in Uber, Swiggy backend rounds.', time: '1d ago' },
    ],
    expanded: false,
  },
  {
    id: 9,
    author: 'Shreya Bose',
    avatar: 'SB',
    avatarColor: '#EC4899',
    anonymous: false,
    time: '3d ago',
    title: 'My HR interview preparation strategy — 30 questions list inside',
    content: `HR rounds are often underestimated. I prepared 30 questions and answers in STAR format.\n\n**Must-prepare questions:**\n1. Tell me about yourself (2-min pitch)\n2. Why this company/role?\n3. Biggest achievement with measurable impact\n4. Failure story + learnings\n5. Where do you see yourself in 5 years?\n6. Why are you leaving your current company?\n7. Salary negotiation: Know your market value!\n\n**Tips:**\n- Research company values and weave them into answers\n- Prepare questions TO ask the interviewer\n- Don't bash previous employer\n- Be honest about weaknesses but show self-awareness\n\nComment below and I'll share my full 30Q doc!`,
    tags: ['HR', 'General'],
    company: null,
    upvotes: 203,
    voted: false,
    comments: [
      { id: 1, author: 'Vikram Nair', avatar: 'VN', avatarColor: '#7C3AED', text: 'Please share the doc! This is gold.', time: '2d ago' },
      { id: 2, author: 'Shreya Bose', avatar: 'SB', avatarColor: '#EC4899', text: 'DM me on LinkedIn — link in profile!', time: '2d ago' },
    ],
    expanded: false,
  },
  {
    id: 10,
    author: 'Dev Agarwal',
    avatar: 'DA',
    avatarColor: '#06B6D4',
    anonymous: false,
    time: '3d ago',
    title: 'Paytm SDE Intern Experience — Summer 2025',
    content: `Completed my 3-month internship at Paytm! Here's everything:\n\n**Selection:** OA (2 coding + 1 SQL) → Technical Interview (DSA + project discussion)\n\n**Internship:**\n- Working on Paytm Payments Bank backend (Spring Boot + Kafka)\n- Mentored by SDE-2, got real production tasks\n- Stipend: ₹50,000/month\n- PPO offered to top 40% of interns (got mine! 🎉)\n\n**Tip for the OA:** The SQL question trips most people. Practice window functions, GROUP BY, and subqueries.\n\n**Tech stack they use:** Java, Spring Boot, MySQL, Redis, Kafka, Docker, K8s`,
    tags: ['Placement', 'Company', 'Technical'],
    company: 'Paytm',
    upvotes: 112,
    voted: false,
    comments: [
      { id: 1, author: 'Ishaan Roy', avatar: 'IR', avatarColor: '#A78BFA', text: 'What year are you in? Is it open for 2nd years?', time: '2d ago' },
      { id: 2, author: 'Dev Agarwal', avatar: 'DA', avatarColor: '#06B6D4', text: 'I was in 3rd year. Usually pre-final or final year.', time: '2d ago' },
    ],
    expanded: false,
  },
];

const ALL_TAGS = ['DSA', 'Placement', 'HR', 'Technical', 'Resume', 'Company', 'General'];
const FILTER_TABS = ['All', 'DSA', 'Placement', 'HR', 'Technical', 'Company'];

const TOP_CONTRIBUTORS = [
  { name: 'Karan Malhotra', posts: 24, upvotes: 1420, avatar: 'KM', color: '#10B981' },
  { name: 'Rahul Joshi', posts: 18, upvotes: 987, avatar: 'RJ', color: '#F59E0B' },
  { name: 'Divya Krishnan', posts: 15, upvotes: 743, avatar: 'DK', color: '#A78BFA' },
  { name: 'Shreya Bose', posts: 12, upvotes: 612, avatar: 'SB', color: '#EC4899' },
];

const TRENDING_TOPICS = [
  { tag: 'FAANG DSA', count: 234 },
  { tag: 'Resume ATS', count: 189 },
  { tag: 'Amazon LP', count: 156 },
  { tag: 'System Design', count: 142 },
  { tag: 'HR Questions', count: 118 },
  { tag: 'Salary Negotiate', count: 97 },
];

const POPULAR_COMPANIES = [
  { name: 'Google', color: '#4285F4', posts: 87 },
  { name: 'Amazon', color: '#FF9900', posts: 134 },
  { name: 'Microsoft', color: '#00A4EF', posts: 76 },
  { name: 'Flipkart', color: '#F9A825', posts: 65 },
  { name: 'TCS', color: '#00B4E0', posts: 112 },
  { name: 'Infosys', color: '#007CC3', posts: 89 },
];

/* ─────────────────── TAG CHIP ─────────────────── */
const TagChip = ({ tag, selected, onClick, small }) => {
  const tagColors = {
    DSA: '#7C3AED', Placement: '#06B6D4', HR: '#10B981',
    Technical: '#F59E0B', Resume: '#EC4899', Company: '#6366F1', General: '#94A3B8'
  };
  const color = tagColors[tag] || '#94A3B8';
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: small ? '3px 10px' : '5px 13px',
        borderRadius: 100,
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        letterSpacing: '0.4px',
        border: `1px solid ${selected ? color : color + '40'}`,
        background: selected ? color + '25' : 'transparent',
        color: selected ? color : color + 'CC',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        textTransform: 'uppercase',
      }}
    >
      {tag}
    </motion.button>
  );
};

/* ─────────────────── AVATAR ─────────────────── */
const Avatar = ({ initials, color, size = 38 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `${color}25`,
    border: `2px solid ${color}50`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.32, fontWeight: 800, color, flexShrink: 0,
    fontFamily: 'Outfit',
  }}>
    {initials}
  </div>
);

/* ─────────────────── POST CARD ─────────────────── */
const PostCard = ({ post, onUpvote, onExpand, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="glass-card-static"
      style={{ padding: 24, marginBottom: 16 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <Avatar initials={post.avatar} color={post.avatarColor} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#E2E8F0' }}>
              {post.anonymous ? 'Anonymous' : post.author}
            </span>
            {post.company && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 100, background: 'rgba(6,182,212,0.12)',
                border: '1px solid rgba(6,182,212,0.25)', color: '#67E8F9',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                {post.company}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12 }}>
            <Clock size={11} />
            <span>{post.time}</span>
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', padding: 4 }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', marginBottom: 10, lineHeight: 1.4, fontFamily: 'Outfit' }}>
        {post.title}
      </h3>

      {/* Content Preview / Full */}
      <div style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>
        {post.expanded
          ? post.content.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '4px 0' }}>
                {line.startsWith('**') && line.endsWith('**')
                  ? <strong style={{ color: '#E2E8F0' }}>{line.replace(/\*\*/g, '')}</strong>
                  : line}
              </p>
            ))
          : <p style={{ margin: 0 }}>{post.content.replace(/\*\*/g, '').split('\n')[0].substring(0, 160)}...</p>
        }
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {post.tags.map(tag => <TagChip key={tag} tag={tag} small />)}
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Upvote */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onUpvote(post.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
            borderRadius: 100, border: `1px solid ${post.voted ? 'rgba(124,58,237,0.4)' : 'rgba(71,85,105,0.4)'}`,
            background: post.voted ? 'rgba(124,58,237,0.15)' : 'rgba(15,23,42,0.4)',
            color: post.voted ? '#A78BFA' : '#64748B', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
          }}
        >
          <ThumbsUp size={14} style={{ fill: post.voted ? '#A78BFA' : 'none' }} />
          {post.upvotes}
        </motion.button>

        {/* Comments toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onExpand(post.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
            borderRadius: 100, border: '1px solid rgba(71,85,105,0.4)',
            background: post.expanded ? 'rgba(6,182,212,0.1)' : 'rgba(15,23,42,0.4)',
            color: post.expanded ? '#67E8F9' : '#64748B', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
          }}
        >
          <MessageSquare size={14} />
          {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
        </motion.button>

        {/* Read More */}
        <button
          onClick={() => onExpand(post.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#7C3AED', fontSize: 13, fontWeight: 600,
          }}
        >
          {post.expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
        </button>

        <div style={{ flex: 1 }} />

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155' }}>
          <Share2 size={14} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155' }}>
          <Bookmark size={14} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {post.expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              {/* Existing comments */}
              {post.comments.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}
                >
                  <Avatar initials={c.avatar} color={c.avatarColor} size={30} />
                  <div style={{
                    flex: 1, padding: '10px 14px',
                    background: 'rgba(5,11,24,0.5)', borderRadius: 12,
                    border: '1px solid rgba(99,102,241,0.08)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>{c.author}</span>
                      <span style={{ fontSize: 11, color: '#334155' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>{c.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Add comment input */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 8 }}>
                <Avatar initials="ME" color="#7C3AED" size={30} />
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <input
                    className="input-field"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    style={{ flex: 1, padding: '9px 14px', fontSize: 13, borderRadius: 10 }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: commentText.trim() ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(99,102,241,0.1)',
                      border: 'none', cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Send size={14} style={{ color: commentText.trim() ? 'white' : '#334155' }} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────────────── CREATE POST MODAL ─────────────────── */
const CreatePostModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ title: '', content: '', tags: [], company: '', anonymous: false });
  const toggleTag = (tag) => setForm(f => ({
    ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
  }));
  const valid = form.title.trim() && form.content.trim() && form.tags.length > 0;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0D1627', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 24, padding: 36, maxWidth: 620, width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Outfit', marginBottom: 4 }}>
              Create a <span className="gradient-text">Post</span>
            </h2>
            <p style={{ color: '#475569', fontSize: 13 }}>Share your experience with the community</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(71,85,105,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} style={{ color: '#94A3B8' }} />
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title */}
          <div>
            <label className="label">Post Title *</label>
            <input
              className="input-field"
              placeholder="e.g. Amazon SDE-1 Interview Experience — Hyderabad"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Content */}
          <div>
            <label className="label">Content *</label>
            <textarea
              className="input-field"
              placeholder="Share your detailed experience, tips, or questions..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={6}
              style={{ resize: 'vertical', lineHeight: 1.7 }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags * (select at least one)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {ALL_TAGS.map(tag => (
                <TagChip
                  key={tag} tag={tag}
                  selected={form.tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="label">Company <span style={{ color: '#334155' }}>(optional)</span></label>
            <input
              className="input-field"
              placeholder="e.g. Google, Amazon, TCS..."
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            />
          </div>

          {/* Anonymous Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(5,11,24,0.5)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {form.anonymous ? <EyeOff size={16} style={{ color: '#6366F1' }} /> : <Eye size={16} style={{ color: '#94A3B8' }} />}
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0', margin: 0 }}>Post Anonymously</p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Your name will be hidden from other users</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
              style={{
                width: 48, height: 26, borderRadius: 100, border: 'none',
                background: form.anonymous ? '#7C3AED' : 'rgba(71,85,105,0.4)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
              }}
            >
              <motion.div
                animate={{ x: form.anonymous ? 22 : 2 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: 'white' }}
              />
            </motion.button>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <motion.button
              whileHover={{ scale: valid ? 1.02 : 1 }}
              whileTap={{ scale: valid ? 0.97 : 1 }}
              className="btn-primary"
              disabled={!valid}
              onClick={() => { onSubmit(form); onClose(); }}
              style={{ flex: 2 }}
            >
              <Send size={15} /> Publish Post
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────── MAIN COMPONENT ─────────────────── */
const Community = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { icon: MessageSquare, label: 'Total Posts', value: '1,284', color: '#7C3AED', gradient: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.05))' },
    { icon: Users, label: 'Active Members', value: '8,941', color: '#06B6D4', gradient: 'linear-gradient(135deg,rgba(6,182,212,0.2),rgba(14,165,233,0.05))' },
    { icon: CheckCircle2, label: 'Questions Answered', value: '3,672', color: '#10B981', gradient: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.05))' },
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchTag = activeFilter === 'All' || p.tags.includes(activeFilter);
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [posts, activeFilter, search]);

  const handleUpvote = (id) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, voted: !p.voted, upvotes: p.voted ? p.upvotes - 1 : p.upvotes + 1 } : p));
  };

  const handleExpand = (id) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, expanded: !p.expanded } : p));
  };

  const handleComment = (postId, text) => {
    setPosts(ps => ps.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, { id: Date.now(), author: 'You', avatar: 'ME', avatarColor: '#7C3AED', text, time: 'Just now' }]
    } : p));
  };

  const handleCreatePost = (form) => {
    const newPost = {
      id: Date.now(),
      author: form.anonymous ? 'Anonymous' : 'You',
      avatar: form.anonymous ? '??' : 'ME',
      avatarColor: form.anonymous ? '#475569' : '#7C3AED',
      anonymous: form.anonymous,
      time: 'Just now',
      title: form.title,
      content: form.content,
      tags: form.tags,
      company: form.company || null,
      upvotes: 0,
      voted: false,
      comments: [],
      expanded: false,
    };
    setPosts(ps => [newPost, ...ps]);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 28,
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(124,58,237,0.18)', borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} style={{ color: '#A78BFA' }} />
            </div>
            <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Community Forum</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Learn from <span className="gradient-text">Real Experiences</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>Discuss interview tips, share experiences, and help each other crack placements.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ fontSize: 14 }}
        >
          <Plus size={16} /> Create Post
        </motion.button>
      </motion.div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card shimmer"
            style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: s.gradient, borderRadius: '0 0 0 80%', opacity: 0.6 }} />
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.gradient, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</p>
            <p style={{ color: '#F1F5F9', fontSize: 28, fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.02em', margin: 0 }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* Left — Feed */}
        <div>
          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-static"
            style={{ padding: 20, marginBottom: 20 }}
          >
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                className="input-field"
                placeholder="Search posts, companies, topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40, fontSize: 14 }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} style={{ color: '#475569' }} />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTER_TABS.map(tab => (
                <motion.button
                  key={tab}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: activeFilter === tab ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(99,102,241,0.07)',
                    color: activeFilter === tab ? 'white' : '#64748B',
                    transition: 'all 0.2s',
                    boxShadow: activeFilter === tab ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  {tab}
                </motion.button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter size={12} /> {filteredPosts.length} posts
              </span>
            </div>
          </motion.div>

          {/* Posts Feed */}
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? filteredPosts.map((post, i) => (
              <motion.div key={post.id} layout>
                <PostCard
                  post={post}
                  onUpvote={handleUpvote}
                  onExpand={handleExpand}
                  onComment={handleComment}
                />
              </motion.div>
            )) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '64px 20px' }}
                className="glass-card-static"
              >
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <MessageSquare size={32} style={{ color: '#334155' }} />
                </div>
                <p style={{ color: '#475569', fontSize: 16, marginBottom: 8 }}>No posts found</p>
                <p style={{ color: '#334155', fontSize: 13 }}>Try a different filter or search term</p>
                <button className="btn-secondary" onClick={() => { setSearch(''); setActiveFilter('All'); }} style={{ marginTop: 20 }}>
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 24 }}>
          {/* Top Contributors */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card-static" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Award size={16} style={{ color: '#F59E0B' }} />
              <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit' }}>Top Contributors</h3>
            </div>
            {TOP_CONTRIBUTORS.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
                <span style={{ width: 20, fontSize: 12, fontWeight: 800, color: i < 3 ? '#F59E0B' : '#475569', textAlign: 'center' }}>
                  #{i + 1}
                </span>
                <Avatar initials={c.avatar} color={c.color} size={34} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{c.posts} posts · {c.upvotes} upvotes</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trending Topics */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card-static" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <TrendingUp size={16} style={{ color: '#7C3AED' }} />
              <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit' }}>Trending Topics</h3>
            </div>
            {TRENDING_TOPICS.map((t, i) => (
              <motion.div
                key={t.tag}
                whileHover={{ x: 4 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, cursor: 'pointer' }}
                onClick={() => setSearch(t.tag)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Hash size={12} style={{ color: '#7C3AED' }} />
                  <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 500 }}>{t.tag}</span>
                </div>
                <span style={{ fontSize: 11, color: '#475569', background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 100 }}>
                  {t.count}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Companies */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card-static" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Building2 size={16} style={{ color: '#06B6D4' }} />
              <h3 style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit' }}>Popular Companies</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {POPULAR_COMPANIES.map(c => (
                <motion.button
                  key={c.name}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSearch(c.name)}
                  style={{
                    padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: `${c.color}15`, color: c.color,
                    border: `1px solid ${c.color}30`,
                  }}
                >
                  {c.name}
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>{c.posts}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Hot Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Flame size={16} style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FDE68A' }}>Most Active Today</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#F1F5F9', fontFamily: 'Outfit', marginBottom: 4 }}>
              Google L3 Interview Experience
            </p>
            <p style={{ fontSize: 12, color: '#92400E' }}>389 upvotes · 2 comments · trending 🔥</p>
          </motion.div>
        </div>
      </div>

      {/* ── Create Post Modal ── */}
      <AnimatePresence>
        {showModal && (
          <CreatePostModal onClose={() => setShowModal(false)} onSubmit={handleCreatePost} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
