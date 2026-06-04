import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronRight, Code2, Users, Lightbulb,
  BookOpen, Layers, BarChart2, CheckCircle2, ArrowRight,
  Building2, DollarSign, Clock, Globe, Star, Award,
  MessageSquare, Zap, Shield
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* COMPANY DATA                                                         */
/* ------------------------------------------------------------------ */
const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    shortName: 'G',
    difficulty: 'Hard',
    avgPackage: '35-55 LPA',
    rounds: 6,
    color: '#4285F4',
    gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(66,133,244,0.12), rgba(52,168,83,0.06))',
    border: 'rgba(66,133,244,0.25)',
    roles: ['SDE-I', 'SDE-II', 'Senior SDE', 'Staff Engineer'],
    process: [
      { step: 1, title: 'Resume Screening', desc: 'ATS + manual review by recruiter. Focus on impact metrics and scale.' },
      { step: 2, title: 'Recruiter Call (30 min)', desc: 'HR discusses role, timeline, compensation expectations, and your background.' },
      { step: 3, title: 'Phone Screen - Technical (45 min)', desc: 'DS/Algo questions on Google Meet with shared coding doc. Usually 2 medium problems.' },
      { step: 4, title: 'On-site Loop (5 Rounds, 45 min each)', desc: 'Coding (×2), System Design, Behavioral/Leadership, and Googleyness rounds.' },
      { step: 5, title: 'Hiring Committee Review', desc: 'Packet reviewed by committee of senior Googlers independent of interviewers.' },
      { step: 6, title: 'Offer & Negotiation', desc: 'Compensation details, stock options (RSUs), and team matching discussion.' },
    ],
    techQuestions: [
      'Design a URL shortener like bit.ly at Google scale (1B requests/day).',
      'Find the kth largest element in an unsorted array. Optimize to O(n) average case.',
      'Design Google Docs — real-time collaborative editing with conflict resolution.',
      'Implement an LRU cache with O(1) get and put operations.',
      'Given a list of meeting intervals, find all gaps (free time) across all employees.',
      'Design YouTube\'s video recommendation system. How do you handle cold start?',
      'Serialize and deserialize a binary tree. Discuss different traversal approaches.',
    ],
    hrQuestions: [
      'Tell me about a time you had to make a decision with incomplete information.',
      'Describe a project where you had a significant technical disagreement. How was it resolved?',
      'How do you stay current with emerging technologies? Give a recent example.',
      'Tell me about the most complex system you have designed or worked on.',
      'Describe a time you failed. What did you learn and how did it change your approach?',
    ],
    tips: [
      'Practice 150+ LeetCode problems — focus on medium/hard graphs, DP, and trees.',
      'Think aloud. Googlers value your reasoning process as much as the final solution.',
      'System design: always start with requirements, estimate scale, then design.',
      'Prepare "Googleyness" stories — show bias for action, integrity, and collaboration.',
      'Use STAR format. Quantify impact: "reduced latency by 40%" over "improved speed".',
      'Google values "comfort with ambiguity" — acknowledge tradeoffs in your design.',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    shortName: 'M',
    difficulty: 'Hard',
    avgPackage: '30-45 LPA',
    rounds: 5,
    color: '#00BCF2',
    gradient: 'linear-gradient(135deg, #00BCF2 0%, #7FBA00 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(0,188,242,0.12), rgba(127,186,0,0.06))',
    border: 'rgba(0,188,242,0.25)',
    roles: ['SDE-I', 'SDE-II', 'Senior SDE', 'Principal Engineer'],
    process: [
      { step: 1, title: 'Online Assessment', desc: '2 coding problems (60-90 min) on HackerRank. Includes code quality checks.' },
      { step: 2, title: 'Recruiter Call', desc: 'Discussion about team, location, role, and initial background screening.' },
      { step: 3, title: 'Technical Phone Screen (45 min)', desc: 'Coding + behavioral questions on Teams. Usually 1-2 medium DS/Algo problems.' },
      { step: 4, title: 'On-site Loop (4 Rounds)', desc: 'Coding (×2), Design (×1), and As-Appropriate (senior engineer review).' },
      { step: 5, title: 'Offer Rollout', desc: 'Offer includes base salary, sign-on bonus, and ESPP/RSU details.' },
    ],
    techQuestions: [
      'Implement a thread-safe Singleton pattern in your preferred language.',
      'Design Microsoft Teams — how do you handle presence, messaging, and video at scale?',
      'Given a binary tree, find the maximum path sum (path can start and end at any node).',
      'Design a distributed cache system (like Azure Cache for Redis).',
      'Implement a rate limiter for an API — discuss token bucket vs sliding window.',
      'How would you detect cycles in a directed graph? Implement DFS-based solution.',
      'Design the backend for Microsoft Word Online collaborative editing.',
    ],
    hrQuestions: [
      'Describe a time you led a project end-to-end. What was your biggest challenge?',
      'How do you handle working with a difficult teammate? Give a specific example.',
      'Tell me about a time you drove a significant improvement in code quality or process.',
      'How do you prioritize when you have multiple competing deadlines?',
      'Describe a time you had to learn a completely new technology quickly.',
    ],
    tips: [
      'Microsoft emphasizes "growth mindset" — show how you learn from mistakes.',
      'Behavioral questions follow STAR. Prepare 8-10 diverse examples.',
      'Design rounds focus on Azure — understand cloud-native patterns.',
      'Code quality matters: write clean, well-commented code during the screen.',
      'Know C#/.NET basics if applying for Azure/Windows teams.',
      'Microsoft values diversity — be ready to discuss inclusive product thinking.',
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    shortName: 'A',
    difficulty: 'Medium',
    avgPackage: '25-40 LPA',
    rounds: 5,
    color: '#FF9900',
    gradient: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(255,153,0,0.12), rgba(255,102,0,0.06))',
    border: 'rgba(255,153,0,0.25)',
    roles: ['SDE-I', 'SDE-II', 'SDE-III', 'Principal SDE'],
    process: [
      { step: 1, title: 'Online Assessment (90 min)', desc: '2 coding questions + work simulation survey. Time management is key.' },
      { step: 2, title: 'Recruiter Call', desc: 'Amazon LP principles introduced. Brief technical and background discussion.' },
      { step: 3, title: 'Phone Screen (60 min)', desc: 'Technical coding + 2-3 LP behavioral questions. Both carry equal weight.' },
      { step: 4, title: 'Virtual On-site Loop (4-5 rounds)', desc: 'Bar Raiser round + coding + system design + behavioral rounds.' },
      { step: 5, title: 'Offer & Team Matching', desc: 'Compensation includes signing bonus, RSU cliff-vesting over 4 years.' },
    ],
    techQuestions: [
      'Design Amazon\'s product recommendation engine. Handle millions of users.',
      'Implement LRU Cache with O(1) get and put. Then extend to LFU cache.',
      'Design Amazon\'s order management system — from cart to delivery tracking.',
      'Find the shortest path in a weighted directed graph using Dijkstra\'s algorithm.',
      'Design a notification system that supports email, SMS, and push notifications.',
      'Given a list of strings, group anagrams together. Optimize for large datasets.',
      'Design DynamoDB — a key-value and document database at Amazon scale.',
    ],
    hrQuestions: [
      'Tell me about a time you disagreed with your manager. What did you do?',
      'Describe a situation where you delivered a project under a tight deadline.',
      'Give an example of when you went above and beyond for a customer (internal/external).',
      'Tell me about a time you made a mistake. How did you handle it?',
      'Describe a data-driven decision you made. What metrics did you use?',
    ],
    tips: [
      'Amazon\'s 16 Leadership Principles are CORE — prepare 2 stories per principle.',
      'The Bar Raiser round has extra weight — they can veto any hire decision.',
      'System design: always frame around Amazon\'s scale (millions of transactions/sec).',
      'LeetCode: focus on arrays, graphs, DP, and two-pointer patterns.',
      'Never say "that was a team effort" without clarifying your specific role.',
      'Practice writing code in a plain text editor — Amazon often uses CodePair.',
    ],
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    shortName: 'F',
    difficulty: 'Medium',
    avgPackage: '20-32 LPA',
    rounds: 4,
    color: '#2874F0',
    gradient: 'linear-gradient(135deg, #2874F0 0%, #F8F8F8 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(40,116,240,0.12), rgba(40,116,240,0.04))',
    border: 'rgba(40,116,240,0.25)',
    roles: ['SDE-I', 'SDE-II', 'SDE-III'],
    process: [
      { step: 1, title: 'Resume Shortlisting', desc: 'Strong preference for Tier-1 colleges and relevant internship experience.' },
      { step: 2, title: 'Online Test (60-90 min)', desc: '3 coding problems on HackerEarth/HackerRank, varying difficulty.' },
      { step: 3, title: 'Technical Interviews (2 rounds)', desc: 'DS/Algo + machine coding round. Strong focus on OOP and design patterns.' },
      { step: 4, title: 'HM + HR Round', desc: 'System design, culture-fit, and compensation discussion.' },
    ],
    techQuestions: [
      'Design Flipkart\'s flash sale system — handle 1M concurrent users in 60 seconds.',
      'Implement a trie for product search with autocomplete and fuzzy matching.',
      'Design a shopping cart service that handles concurrent updates gracefully.',
      'Find the median of a data stream with O(log n) insert and O(1) find-median.',
      'Design Flipkart\'s inventory management system with real-time stock updates.',
      'Implement a queue using two stacks. Discuss time complexity tradeoffs.',
    ],
    hrQuestions: [
      'Why Flipkart over other e-commerce companies?',
      'Describe a time you had to work in a high-pressure environment.',
      'How do you handle ambiguous product requirements?',
      'Tell me about a technical decision you\'re proud of.',
      'Where do you see yourself in 3 years?',
    ],
    tips: [
      'Machine coding round is important — practice low-level OOP design (parking lot, etc.).',
      'Study e-commerce system design patterns deeply.',
      'Flipkart values product sense — think like a user while designing systems.',
      'Prepare for questions on concurrency and distributed systems.',
      'Show enthusiasm for startup-paced culture and ownership.',
    ],
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    shortName: 'S',
    difficulty: 'Medium',
    avgPackage: '18-30 LPA',
    rounds: 4,
    color: '#FC8019',
    gradient: 'linear-gradient(135deg, #FC8019 0%, #E23744 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(252,128,25,0.12), rgba(226,55,68,0.06))',
    border: 'rgba(252,128,25,0.25)',
    roles: ['SDE-I', 'SDE-II', 'Senior SDE'],
    process: [
      { step: 1, title: 'Application & Resume Review', desc: 'HR screens for relevant skills and years of experience.' },
      { step: 2, title: 'Online Coding Assessment', desc: '2-3 coding problems in 90 minutes. HackerRank platform.' },
      { step: 3, title: 'Technical Rounds (2)', desc: 'DS/Algo + system design focused on food-delivery scale challenges.' },
      { step: 4, title: 'Culture Fit & HR', desc: 'Startup mindset, adaptability, and compensation negotiation.' },
    ],
    techQuestions: [
      'Design Swiggy\'s real-time order tracking system with GPS updates.',
      'How would you design the delivery partner assignment algorithm?',
      'Implement a geo-spatial index to find restaurants within 5km radius.',
      'Design surge pricing engine for delivery during peak hours.',
      'Find the shortest path between delivery partner and customer considering traffic.',
      'Design a notification system for order status updates (sub-second latency).',
    ],
    hrQuestions: [
      'Why do you want to work at a startup vs a large tech company?',
      'How do you deal with rapidly changing product requirements?',
      'Describe a time you wore multiple hats to get something done.',
      'How do you ensure code quality while shipping fast?',
      'Tell me about a project where you had full ownership.',
    ],
    tips: [
      'Swiggy loves geo-spatial and real-time system design questions.',
      'Show startup DNA — bias for action, ownership, and moving fast.',
      'Study Kafka, Redis, and distributed systems for backend roles.',
      'Location-based services and maps APIs are relevant topics.',
      'Be ready to discuss on-call, incidents, and observability.',
    ],
  },
  {
    id: 'zomato',
    name: 'Zomato',
    shortName: 'Z',
    difficulty: 'Medium',
    avgPackage: '16-28 LPA',
    rounds: 4,
    color: '#E23744',
    gradient: 'linear-gradient(135deg, #E23744 0%, #CB202D 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(226,55,68,0.12), rgba(203,32,45,0.06))',
    border: 'rgba(226,55,68,0.25)',
    roles: ['SDE-I', 'SDE-II', 'SDE-III'],
    process: [
      { step: 1, title: 'Resume Screening', desc: 'Focus on relevant tech stack experience and impact-driven resume.' },
      { step: 2, title: 'Coding Test', desc: '2 problems (60 min). Focus on arrays, strings, and basic graph problems.' },
      { step: 3, title: 'Technical Interviews (2)', desc: 'DS/Algo + machine coding (build a mini app in 1.5 hours).' },
      { step: 4, title: 'Founder/Leadership Round', desc: 'Product thinking, culture fit, and long-term vision alignment.' },
    ],
    techQuestions: [
      'Design Zomato\'s restaurant search with filters: cuisine, rating, delivery time.',
      'Build a recommendation system for "what to eat today" personalization.',
      'Design the schema for a restaurant menu management system.',
      'Implement a live-location tracking system for delivery partners.',
      'How would you handle a sudden 10x spike in food orders?',
      'Design Zomato Gold — subscription and table booking backend.',
    ],
    hrQuestions: [
      'What excites you about the food-tech space?',
      'Describe a time when you built something with very limited resources.',
      'How do you balance technical debt with feature delivery?',
      'Tell me about a product decision you influenced as an engineer.',
      'How do you ensure reliability in a high-traffic consumer app?',
    ],
    tips: [
      'Zomato values product intuition — think about UX when solving design problems.',
      'Prepare for machine coding: practice building REST APIs from scratch.',
      'Read Zomato\'s engineering blog for real-world system challenges.',
      'Show interest in food-tech and consumer products in behavioral rounds.',
      'Be comfortable discussing SQL schema design and database optimization.',
    ],
  },
  {
    id: 'tcs',
    name: 'TCS',
    shortName: 'T',
    difficulty: 'Easy',
    avgPackage: '3.5-7 LPA',
    rounds: 3,
    color: '#00497A',
    gradient: 'linear-gradient(135deg, #00497A 0%, #0079A8 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(0,73,122,0.18), rgba(0,121,168,0.08))',
    border: 'rgba(0,121,168,0.3)',
    roles: ['System Engineer', 'Software Engineer', 'Assistant Consultant'],
    process: [
      { step: 1, title: 'TCS NQT (National Qualifier Test)', desc: 'Aptitude + verbal + coding sections. Cutoff ~50-60%. Available online.' },
      { step: 2, title: 'Technical Interview (30-45 min)', desc: 'Basic programming, DBMS, OS, computer networks, and project questions.' },
      { step: 3, title: 'HR Interview', desc: 'Relocation, joining preferences, bond details, and culture fit.' },
    ],
    techQuestions: [
      'What is polymorphism? Give an example in Java/C++.',
      'Explain the difference between SQL JOIN types with examples.',
      'Write a program to find all permutations of a string.',
      'What is a deadlock? How do you prevent it in an OS?',
      'Explain TCP/IP model vs OSI model — key differences.',
      'Write code to reverse a linked list both iteratively and recursively.',
      'What is normalization in databases? Explain 1NF, 2NF, 3NF with examples.',
    ],
    hrQuestions: [
      'Why do you want to join TCS?',
      'Are you willing to relocate to any location in India?',
      'Tell me about your final year project.',
      'What are your strengths and weaknesses?',
      'Are you okay with the TCS 2-year bond clause?',
    ],
    tips: [
      'NQT is the main filter — practice IndiaBix and previous TCS papers.',
      'Basic CS fundamentals (DBMS, OS, CN) are always asked in tech round.',
      'Be honest about relocation flexibility — it affects team allocation.',
      'Practice writing code on paper — some centers do physical tests.',
      'TCS Digital and Prime tracks pay significantly higher (7-14 LPA).',
    ],
  },
  {
    id: 'infosys',
    name: 'Infosys',
    shortName: 'I',
    difficulty: 'Easy',
    avgPackage: '3.6-8 LPA',
    rounds: 3,
    color: '#007CC3',
    gradient: 'linear-gradient(135deg, #007CC3 0%, #0091D0 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(0,124,195,0.15), rgba(0,145,208,0.06))',
    border: 'rgba(0,124,195,0.28)',
    roles: ['Systems Engineer', 'Technology Analyst', 'Senior Engineer'],
    process: [
      { step: 1, title: 'InfyTQ / Retech Online Test', desc: 'Aptitude, reasoning, verbal ability, and 2 coding problems (Python/Java).' },
      { step: 2, title: 'Technical Interview', desc: 'OOP, data structures, resume projects, and coding on paper/online.' },
      { step: 3, title: 'HR Interview', desc: 'Bond acceptance, communication skills, and culture alignment.' },
    ],
    techQuestions: [
      'What are the four pillars of OOP? Explain with real-world examples.',
      'What is the difference between stack and heap memory?',
      'Write code to check if a binary tree is a BST.',
      'Explain ACID properties in database transactions.',
      'What are design patterns? Explain Singleton and Factory.',
      'Difference between ArrayList and LinkedList in Java.',
      'Explain the working of HashMap internally in Java.',
    ],
    hrQuestions: [
      'Why do you want to work at Infosys?',
      'Where do you want to be in 5 years?',
      'How do you handle pressure and tight deadlines?',
      'Tell me about a challenge you faced in college and how you overcame it.',
      'Are you comfortable with the service agreement (bond)?',
    ],
    tips: [
      'Infosys SP and DSE tracks have higher packages — clear InfyTQ with a good score.',
      'Focus on Java/Python OOP — most technical questions come from here.',
      'Be clear about your final year project — expect deep dive questions.',
      'Communication skills are given high importance in HR round.',
      'Read about Infosys\' recent projects and business areas for HR round.',
    ],
  },
  {
    id: 'wipro',
    name: 'Wipro',
    shortName: 'W',
    difficulty: 'Easy',
    avgPackage: '3.5-6.5 LPA',
    rounds: 3,
    color: '#341F97',
    gradient: 'linear-gradient(135deg, #341F97 0%, #5C3FD1 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(52,31,151,0.18), rgba(92,63,209,0.08))',
    border: 'rgba(92,63,209,0.28)',
    roles: ['Project Engineer', 'Software Engineer', 'Senior Software Engineer'],
    process: [
      { step: 1, title: 'NLTH / Online Test', desc: 'Aptitude, English communication, coding (2 problems), and online essay writing.' },
      { step: 2, title: 'Technical Interview', desc: 'Basic CS, OOP, DBMS, project discussion, and simple coding questions.' },
      { step: 3, title: 'HR Round', desc: 'Location preference, communication test, and final offer details.' },
    ],
    techQuestions: [
      'What is the difference between process and thread?',
      'Explain inheritance types in OOP with diagrams.',
      'Write a SQL query to find the second highest salary.',
      'What is indexing in databases and how does it improve performance?',
      'Explain virtual functions and vtable in C++.',
      'What is the difference between throw and throws in Java?',
    ],
    hrQuestions: [
      'What do you know about Wipro\'s WILP (Work Integrated Learning Program)?',
      'How quickly can you join if selected?',
      'Are you open to working in shifts or weekend support?',
      'Describe a team project from college. What was your contribution?',
      'Why did you choose Computer Science / IT as your stream?',
    ],
    tips: [
      'Wipro turbo (premium track) pays significantly more — aim for it.',
      'Aptitude is the main filter — practice quantitative and verbal.',
      'Basic coding (patterns, sorting, string manipulation) is sufficient.',
      'Show willingness to learn — Wipro heavily invests in training freshers.',
      'Be honest and confident in HR — attitude matters a lot here.',
    ],
  },
  {
    id: 'accenture',
    name: 'Accenture',
    shortName: 'Ac',
    difficulty: 'Easy',
    avgPackage: '4.5-9 LPA',
    rounds: 3,
    color: '#A100FF',
    gradient: 'linear-gradient(135deg, #A100FF 0%, #7600BD 100%)',
    bgGrad: 'linear-gradient(135deg, rgba(161,0,255,0.15), rgba(118,0,189,0.06))',
    border: 'rgba(161,0,255,0.28)',
    roles: ['Associate Software Engineer', 'Software Engineer', 'Senior Analyst'],
    process: [
      { step: 1, title: 'Cognitive and Technical Assessments', desc: 'Two tests: Cognitive Assessment (AMCAT format) + Technical Assessment (coding, MCQ).' },
      { step: 2, title: 'Communication Assessment', desc: 'Automated voice-based communication test. Accent and fluency scored.' },
      { step: 3, title: 'HR Interview', desc: 'Project discussion, joining timeline, role preferences, and offer details.' },
    ],
    techQuestions: [
      'Explain the concept of RESTful APIs with an example.',
      'What is the difference between synchronous and asynchronous programming?',
      'Write a program to find duplicate elements in an array.',
      'Explain Agile methodology and Scrum framework.',
      'What is cloud computing? Explain SaaS, PaaS, and IaaS.',
      'What is an API gateway and why is it useful in microservices?',
    ],
    hrQuestions: [
      'Why Accenture over other IT companies?',
      'What is your preferred work location?',
      'Tell me about a time you worked in a diverse team.',
      'What do you know about Accenture\'s services and business units?',
      'Are you open to client-side travel or on-site opportunities?',
    ],
    tips: [
      'Accenture ASE pays 4.5 LPA; specialist roles (9+ LPA) need stronger coding skills.',
      'Focus on communication — Accenture heavily weights client-facing skills.',
      'Learn basics of cloud, DevOps, and digital transformation for bonus points.',
      'AMCAT aptitude prep is essential — use Merittrac practice materials.',
      'Accenture has a huge consulting side — show interest in problem-solving.',
    ],
  },
];

const DIFFICULTY_CONFIG = {
  Easy:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  Medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  Hard:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
};

const TABS = [
  { id: 'process',  label: 'Interview Process', icon: Layers },
  { id: 'tech',     label: 'Technical Qs',      icon: Code2 },
  { id: 'hr',       label: 'HR Questions',      icon: Users },
  { id: 'tips',     label: 'Tips & Tricks',     icon: Lightbulb },
];

/* ------------------------------------------------------------------ */
/* COMPANY CARD                                                         */
/* ------------------------------------------------------------------ */
const CompanyCard = ({ company, onClick }) => {
  const diff = DIFFICULTY_CONFIG[company.difficulty];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${company.color}30` }}
      onClick={() => onClick(company)}
      style={{
        background: company.bgGrad,
        border: `1px solid ${company.border}`,
        borderRadius: 20, padding: 24, cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow 0.25s',
      }}>
      {/* Decorative blob */}
      <div style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: company.gradient, opacity: 0.15, filter: 'blur(20px)', pointerEvents: 'none' }} />

      {/* Logo area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: company.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: 'Outfit', color: 'white', fontSize: 18, boxShadow: `0 6px 20px ${company.color}30` }}>
          {company.shortName}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`, padding: '4px 10px', borderRadius: 100 }}>
          {company.difficulty}
        </span>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 14, letterSpacing: '-0.01em', color: '#F1F5F9' }}>{company.name}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <DollarSign size={13} style={{ color: '#10B981' }} />
          <span style={{ color: '#94A3B8', fontSize: 13 }}>Avg: <strong style={{ color: '#F1F5F9' }}>{company.avgPackage}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Clock size={13} style={{ color: '#06B6D4' }} />
          <span style={{ color: '#94A3B8', fontSize: 13 }}><strong style={{ color: '#F1F5F9' }}>{company.rounds}</strong> interview rounds</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {company.roles.slice(0, 2).map(r => (
          <span key={r} style={{ fontSize: 11, color: '#64748B', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', padding: '3px 8px', borderRadius: 6 }}>{r}</span>
        ))}
        {company.roles.length > 2 && (
          <span style={{ fontSize: 11, color: '#64748B', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', padding: '3px 8px', borderRadius: 6 }}>+{company.roles.length - 2}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: company.color, fontSize: 13, fontWeight: 700 }}>
        <span>View Details</span>
        <ChevronRight size={14} />
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* COMPANY DETAIL MODAL                                                 */
/* ------------------------------------------------------------------ */
const CompanyDetailModal = ({ company, onClose }) => {
  const [activeTab, setActiveTab] = useState('process');
  const diff = DIFFICULTY_CONFIG[company.difficulty];

  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ alignItems: 'flex-start', overflowY: 'auto', padding: '24px 20px' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.92, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }} transition={{ type: 'spring', damping: 25 }}
          style={{
            background: 'linear-gradient(135deg, rgba(13,22,39,0.99), rgba(17,30,53,0.99))',
            border: `1px solid ${company.border}`,
            borderRadius: 28, maxWidth: 780, width: '100%', margin: '0 auto',
            boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${company.color}15`,
            overflow: 'hidden',
          }}>

          {/* Modal Header */}
          <div style={{ background: company.bgGrad, borderBottom: `1px solid ${company.border}`, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: company.gradient, opacity: 0.12, filter: 'blur(30px)' }} />
            <div style={{ width: 60, height: 60, borderRadius: 16, background: company.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: 'Outfit', color: 'white', fontSize: 22, boxShadow: `0 8px 25px ${company.color}40`, flexShrink: 0 }}>
              {company.shortName}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Outfit', margin: 0 }}>{company.name}</h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`, padding: '4px 10px', borderRadius: 100 }}>{company.difficulty}</span>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <DollarSign size={12} style={{ color: '#10B981' }} /> {company.avgPackage}
                </span>
                <span style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} style={{ color: '#06B6D4' }} /> {company.rounds} Rounds
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '16px 32px', borderBottom: '1px solid rgba(99,102,241,0.1)', overflowX: 'auto' }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                background: activeTab === id ? `${company.color}18` : 'transparent',
                color: activeTab === id ? company.color : '#64748B',
                borderBottom: activeTab === id ? `2px solid ${company.color}` : '2px solid transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '28px 32px', maxHeight: '60vh', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'process' && (
                <motion.div key="process" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: `linear-gradient(to bottom, ${company.color}, transparent)`, opacity: 0.25 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {company.process.map((step, i) => (
                        <motion.div key={step.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                          style={{ display: 'flex', gap: 18, paddingBottom: i < company.process.length - 1 ? 24 : 0 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? company.gradient : 'rgba(13,22,39,0.9)', border: `2px solid ${company.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 13, fontFamily: 'Outfit', color: i === 0 ? 'white' : company.color, position: 'relative', zIndex: 1 }}>
                            {step.step}
                          </div>
                          <div style={{ flex: 1, paddingTop: 8 }}>
                            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#F1F5F9', marginBottom: 6, fontFamily: 'Outfit' }}>{step.title}</h4>
                            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tech' && (
                <motion.div key="tech" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>Frequently asked technical questions at {company.name}:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {company.techQuestions.map((q, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        style={{ display: 'flex', gap: 14, padding: '16px 18px', background: 'rgba(13,22,39,0.6)', border: `1px solid rgba(99,102,241,0.1)`, borderRadius: 14, borderLeft: `3px solid ${company.color}50` }}>
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: `${company.color}15`, border: `1px solid ${company.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, color: company.color, fontFamily: 'Outfit' }}>
                          {i + 1}
                        </div>
                        <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{q}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'hr' && (
                <motion.div key="hr" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>Common HR interview questions at {company.name}:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {company.hrQuestions.map((q, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', gap: 12, padding: '14px 18px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 12 }}>
                        <MessageSquare size={15} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                        <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{q}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'tips' && (
                <motion.div key="tips" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>Insider tips to crack your {company.name} interview:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {company.tips.map((tip, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', gap: 12, padding: '14px 18px', background: `${company.color}08`, border: `1px solid ${company.color}15`, borderRadius: 12 }}>
                        <Zap size={15} style={{ color: company.color, flexShrink: 0, marginTop: 2 }} />
                        <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
const CompanyHub = () => {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filtered = useMemo(() => {
    return COMPANIES.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.roles.some(r => r.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = diffFilter === 'All' || c.difficulty === diffFilter;
      return matchSearch && matchDiff;
    });
  }, [search, diffFilter]);

  const counts = useMemo(() => ({
    All: COMPANIES.length,
    Easy: COMPANIES.filter(c => c.difficulty === 'Easy').length,
    Medium: COMPANIES.filter(c => c.difficulty === 'Medium').length,
    Hard: COMPANIES.filter(c => c.difficulty === 'Hard').length,
  }), []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 48 }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.1))', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} style={{ color: '#06B6D4' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 5 }}>
              Company <span className="gradient-text">Prep Hub</span>
            </h1>
            <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>Interview insights, questions & tips for top companies</p>
          </div>
        </div>
      </motion.div>

      {/* ── Summary Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Companies', value: COMPANIES.length, color: '#7C3AED', icon: Building2 },
          { label: 'Easy Track', value: counts.Easy, color: '#10B981', icon: CheckCircle2 },
          { label: 'Medium Track', value: counts.Medium, color: '#F59E0B', icon: BarChart2 },
          { label: 'Hard Track', value: counts.Hard, color: '#EF4444', icon: Star },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ padding: '18px 20px', background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p style={{ color: '#F1F5F9', fontWeight: 900, fontSize: 22, fontFamily: 'Outfit', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="input-field" placeholder="Search companies or roles..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40, paddingTop: 11, paddingBottom: 11, fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 4, gap: 4 }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(d => {
            const dcfg = d !== 'All' ? DIFFICULTY_CONFIG[d] : { color: '#A78BFA', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.2)' };
            return (
              <button key={d} onClick={() => setDiffFilter(d)} style={{
                padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                background: diffFilter === d ? dcfg.bg : 'transparent',
                color: diffFilter === d ? dcfg.color : '#475569',
                transition: 'all 0.2s',
              }}>
                {d}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Company Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Search size={30} style={{ color: '#334155' }} />
          </div>
          <p style={{ color: '#475569', fontSize: 15 }}>No companies match your search.</p>
        </div>
      ) : (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          <AnimatePresence>
            {filtered.map((company, i) => (
              <motion.div key={company.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                <CompanyCard company={company} onClick={setSelectedCompany} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Company Detail Modal ── */}
      <AnimatePresence>
        {selectedCompany && <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default CompanyHub;
