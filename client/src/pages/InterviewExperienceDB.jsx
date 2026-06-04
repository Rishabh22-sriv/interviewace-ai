import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Star,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  X,
  Building2,
  Calendar,
  Briefcase,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  MessageSquare,
  Award,
  Users,
  HelpCircle,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MOCK DATA
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const MOCK_EXPERIENCES = [
  {
    id: 1,
    company: 'Google',
    role: 'Software Development Engineer',
    date: '2024-03-15',
    outcome: 'Selected',
    technology: 'Python, Distributed Systems',
    difficulty: 4,
    anonymous: false,
    author: 'Arjun Sharma',
    helpful: 142,
    rounds: [
      {
        type: 'Online Assessment',
        difficulty: 3,
        questions: [
          'Find the longest substring without repeating characters.',
          'Given a matrix, find the minimum path sum from top-left to bottom-right.',
          'Design a rate limiter system.',
        ],
        tips: 'Practice LeetCode Medium problems. Focus on optimal time complexity and clearly communicate your thought process.',
      },
      {
        type: 'Technical Interview 1 (DSA)',
        difficulty: 4,
        questions: [
          'Serialize and deserialize a binary tree.',
          'Find the median from a data stream.',
          'Implement LRU Cache with O(1) get and put.',
        ],
        tips: 'Start with brute force then optimize. Explain trade-offs between time and space complexity.',
      },
      {
        type: 'System Design',
        difficulty: 5,
        questions: [
          'Design YouTube at Google scale â€” storage, CDN, recommendation engine.',
          'How would you handle 1 billion concurrent users on a messaging app?',
        ],
        tips: 'Always clarify requirements first. Break down into components: storage, API, caching, load balancing, scalability.',
      },
    ],
  },
  {
    id: 2,
    company: 'Amazon',
    role: 'Software Development Engineer II',
    date: '2024-02-20',
    outcome: 'Selected',
    technology: 'Java, AWS, System Design',
    difficulty: 4,
    anonymous: false,
    author: 'Priya Nair',
    helpful: 118,
    rounds: [
      {
        type: 'Online Assessment',
        difficulty: 3,
        questions: [
          'Find the top k frequent elements in an array.',
          'Robot bounded in a circle â€” predict final position.',
          'Minimum number of platforms required at a railway station.',
        ],
        tips: 'Amazon OA often has two coding + one work simulation. Time yourself strictly â€” 90 minutes total.',
      },
      {
        type: 'Technical + Leadership Principle Round 1',
        difficulty: 4,
        questions: [
          'Design Amazon\s product recommendation system.',
          'Tell me about a time you handled a production outage. (LP: Bias for Action)',
          'Implement a deep clone of a graph with cycles.',
        ],
        tips: 'Prepare STAR stories for ALL 16 LPs. Interviewers take notes and score separately.',
      },
      {
        type: 'Technical + Leadership Principle Round 2',
        difficulty: 4,
        questions: [
          'Design Amazon\s order management system.',
          'Word search II in a 2D board using Trie.',
          'Describe a project where you raised the bar. (LP: Raise the Bar)',
        ],
        tips: 'Quantify impact in LP stories. Use metrics like "reduced latency by 30%" or "saved $2M in infra costs".',
      },
      {
        type: 'Bar Raiser Round',
        difficulty: 5,
        questions: [
          'Design a distributed caching system like ElastiCache.',
          'Walk me through the most complex technical decision you ever made.',
          'How do you mentor junior engineers while still meeting your own deliverables?',
        ],
        tips: 'Bar Raiser is looking for cultural fit as much as technical depth. Be genuine and self-reflective.',
      },
    ],
  },
  {
    id: 3,
    company: 'Microsoft',
    role: 'Software Development Engineer',
    date: '2024-01-10',
    outcome: 'Selected',
    technology: 'C#, .NET, Azure',
    difficulty: 3,
    anonymous: false,
    author: 'Ravi Menon',
    helpful: 97,
    rounds: [
      {
        type: 'Technical Phone Screen',
        difficulty: 3,
        questions: [
          'Check if a linked list has a cycle. Find the entry point.',
          'Explain SOLID principles with real examples.',
          'What is the difference between process and thread?',
        ],
        tips: 'Microsoft phone screen is conversational. Explain your thought process out loud â€” interviewers value communication.',
      },
      {
        type: 'Onsite Technical Round 1',
        difficulty: 3,
        questions: [
          'Clone a graph with random pointers.',
          'Design a URL shortener like bit.ly.',
          'How does garbage collection work in .NET?',
        ],
        tips: 'Whiteboard coding is common. Write clean, readable code even if you are nervous.',
      },
      {
        type: 'Hiring Manager + Behavioral',
        difficulty: 2,
        questions: [
          'Tell me about a time you disagreed with your manager.',
          'How do you handle ambiguous requirements?',
          'Where do you see yourself in 5 years at Microsoft?',
        ],
        tips: 'Be honest and forward-looking. Microsoft values growth mindset â€” mention learning and curiosity.',
      },
    ],
  },
  {
    id: 4,
    company: 'Flipkart',
    role: 'Software Development Engineer',
    date: '2024-03-01',
    outcome: 'Rejected',
    technology: 'Java, Kafka, Microservices',
    difficulty: 4,
    anonymous: true,
    author: 'Anonymous',
    helpful: 73,
    rounds: [
      {
        type: 'Coding Round',
        difficulty: 3,
        questions: [
          'Merge k sorted linked lists.',
          'Find all anagram groups in a list of strings.',
        ],
        tips: 'Flipkart coding round is on HackerEarth. Make sure to handle all edge cases and submit before time.',
      },
      {
        type: 'Technical Interview',
        difficulty: 4,
        questions: [
          'Design Flipkart\\s flash sale system (high write throughput).',
          'Implement a thread-safe bounded blocking queue.',
          'Explain CAP theorem with real-world examples from Flipkarts stack.',
        ],
        tips: 'System design is heavily focused on scalability for Indian traffic spikes. Mention Kafka, Redis, and DB sharding.',
      },
      {
        type: 'Hiring Manager',
        difficulty: 3,
        questions: [
          'Why Flipkart over other e-commerce companies?',
          'Describe your biggest technical failure and what you learned.',
          'How do you prioritize features when engineering and product disagree?',
        ],
        tips: 'I was rejected here. Felt the HM was looking for more ownership stories. Prepare more examples of driving projects end-to-end.',
      },
    ],
  },
  {
    id: 5,
    company: 'TCS',
    role: 'System Engineer',
    date: '2024-04-05',
    outcome: 'Selected',
    technology: 'Java, SQL, Spring Boot',
    difficulty: 2,
    anonymous: false,
    author: 'Sneha Iyer',
    helpful: 56,
    rounds: [
      {
        type: 'TCS NQT (National Qualifier Test)',
        difficulty: 2,
        questions: [
          'Write a program to find the second largest number in an array.',
          'SQL: Find employees earning more than their manager.',
          'Aptitude: Time, speed, distance â€” 20 questions.',
        ],
        tips: 'TCS NQT is a standardized test. Practice IndiaBix for aptitude and GeeksForGeeks for basic coding. Attempt all questions.',
      },
      {
        type: 'HR + Technical Interview',
        difficulty: 2,
        questions: [
          'Explain OOP concepts with examples.',
          'What is the difference between ArrayList and LinkedList in Java?',
          'Are you willing to relocate? What are your salary expectations?',
        ],
        tips: 'Very straightforward for freshers. Dress formally, be confident, and review your college projects thoroughly.',
      },
    ],
  },
  {
    id: 6,
    company: 'Infosys',
    role: 'Systems Engineer',
    date: '2024-04-12',
    outcome: 'Selected',
    technology: 'Java, Python, MySQL',
    difficulty: 2,
    anonymous: false,
    author: 'Karan Verma',
    helpful: 44,
    rounds: [
      {
        type: 'InfyTQ Online Test',
        difficulty: 2,
        questions: [
          'Reverse a string without using built-in functions.',
          'Find if a number is prime.',
          'Database: Write a query to find the 3rd highest salary.',
        ],
        tips: 'Infosys uses InfyTQ platform. The test has sections on pseudo-code, programming, and aptitude. Practice all sections equally.',
      },
      {
        type: 'HR Interview',
        difficulty: 1,
        questions: [
          'Tell me about yourself.',
          'What are your strengths and weaknesses?',
          'Why do you want to join Infosys?',
        ],
        tips: 'Infosys HR round is mostly a formality if you clear the test. Be enthusiastic and mention your interest in training programs.',
      },
    ],
  },
  {
    id: 7,
    company: 'Wipro',
    role: 'Project Engineer',
    date: '2024-03-28',
    outcome: 'Selected',
    technology: 'Python, Data Structures',
    difficulty: 2,
    anonymous: false,
    author: 'Divya Rao',
    helpful: 38,
    rounds: [
      {
        type: 'NLTH (National Level Talent Hunt) Test',
        difficulty: 2,
        questions: [
          'Find the factorial of a number using recursion.',
          'Check if a string is a palindrome.',
          'Reasoning: Blood relations and directions.',
        ],
        tips: 'Wipro NLTH is 3 sections: Aptitude, Verbal, and Coding. The coding section has 2 problems â€” solve both for a higher score band.',
      },
      {
        type: 'Technical + HR Interview',
        difficulty: 2,
        questions: [
          'Explain the difference between stack and queue.',
          'What is polymorphism? Give a real example.',
          'Are you comfortable with night shifts or client travel?',
        ],
        tips: 'Wipro interview is friendly and not very intense. Review data structures basics and be clear about your location preferences.',
      },
    ],
  },
  {
    id: 8,
    company: 'Zomato',
    role: 'Backend Engineer',
    date: '2024-02-08',
    outcome: 'Selected',
    technology: 'Golang, Redis, PostgreSQL',
    difficulty: 4,
    anonymous: false,
    author: 'Aditya Singh',
    helpful: 89,
    rounds: [
      {
        type: 'Coding Challenge (Take-Home)',
        difficulty: 3,
        questions: [
          'Build a REST API for a simplified food ordering system in Golang.',
          'Include authentication, pagination, and error handling.',
          'Write unit tests for at least 80% coverage.',
        ],
        tips: 'Take the take-home seriously â€” it replaces the OA. Clean code, good README, and proper error handling matter more than feature count.',
      },
      {
        type: 'Technical Interview (Deep Dive)',
        difficulty: 4,
        questions: [
          'Walk us through your take-home solution. Why did you make these design choices?',
          'How would you handle a sudden 10x traffic spike during a festival sale?',
          'Implement a consistent hash ring for distributing load across servers.',
        ],
        tips: 'Zomato interviewers are sharp and will probe your take-home deeply. Be ready to defend every decision.',
      },
      {
        type: 'Culture + Leadership Interview',
        difficulty: 3,
        questions: [
          'Tell us about a time you shipped something fast and imperfect. What happened?',
          'How do you handle disagreements in code reviews?',
          'What excites you about food-tech and Zomato specifically?',
        ],
        tips: 'Zomato loves hustle and ownership stories. Show passion for the product â€” use the app and mention specific features.',
      },
    ],
  },
  {
    id: 9,
    company: 'Paytm',
    role: 'Software Engineer',
    date: '2024-01-25',
    outcome: 'Rejected',
    technology: 'Java, Spring, Kafka',
    difficulty: 3,
    anonymous: true,
    author: 'Anonymous',
    helpful: 61,
    rounds: [
      {
        type: 'Online Assessment',
        difficulty: 3,
        questions: [
          'Implement a stack that supports getMin() in O(1).',
          'Find all possible word breaks for a given string and dictionary.',
        ],
        tips: 'Paytm OA is on Hackerrank. 2 problems in 60 minutes. Focus on the first problem completely before moving to the second.',
      },
      {
        type: 'Technical Round 1',
        difficulty: 3,
        questions: [
          'Design a payment gateway system with rollback support.',
          'Explain two-phase commit and its drawbacks.',
          'How does Kafka ensure message delivery exactly once?',
        ],
        tips: 'Strong focus on payments domain knowledge. Read about ACID, BASE, 2PC, and idempotency before your interview.',
      },
      {
        type: 'Technical Round 2 + Managerial',
        difficulty: 4,
        questions: [
          'Design a fraud detection system for UPI transactions.',
          'How would you reduce the P99 latency of a checkout API?',
          'Tell me about a time you worked under extreme pressure.',
        ],
        tips: 'I struggled on the fraud detection design. Study ML-based anomaly detection and rule engines before your Paytm interviews.',
      },
    ],
  },
  {
    id: 10,
    company: 'Swiggy',
    role: 'Software Development Engineer',
    date: '2024-03-10',
    outcome: 'Selected',
    technology: 'Python, Django, Elasticsearch',
    difficulty: 3,
    anonymous: false,
    author: 'Mehak Gupta',
    helpful: 77,
    rounds: [
      {
        type: 'Coding Round (HackerEarth)',
        difficulty: 3,
        questions: [
          'Design a data structure for a restaurant menu with O(1) lookup.',
          'Find the maximum profit from at most 2 stock transactions.',
          'Topological sort a given dependency graph.',
        ],
        tips: 'Swiggy coding round is 3 questions in 90 minutes. All are DSA-focused. Practice graphs, DP, and heaps especially.',
      },
      {
        type: 'Technical Interview 1',
        difficulty: 3,
        questions: [
          'Design Swiggy\\s real-time order tracking system.',
          'How would you implement search autocomplete for restaurant names?',
          'Explain the difference between horizontal and vertical scaling with Swiggy examples.',
        ],
        tips: 'Swiggy interviewers love product-context questions. Know how Swiggy s delivery routing works at a high level.',
      },
      {
        type: 'Technical Interview 2 + HR',
        difficulty: 3,
        questions: [
          'How would you design a dynamic surge pricing algorithm?',
          'Describe a time you improved a team process.',
          'What do you think Swiggy could do better technically?',
        ],
        tips: 'Be constructive about Swiggy s weaknesses â€” they want critical thinkers. Mention specific product improvements with engineering solutions.',
      },
    ],
  },
  {
    id: 11,
    company: 'Accenture',
    role: 'Application Development Associate',
    date: '2024-04-20',
    outcome: 'Selected',
    technology: 'Java, React, SQL',
    difficulty: 2,
    anonymous: false,
    author: 'Rohit Kumar',
    helpful: 33,
    rounds: [
      {
        type: 'Accenture Online Test',
        difficulty: 2,
        questions: [
          'Aptitude: 20 MCQs on number series, probability, ratios.',
          'Reasoning: 15 MCQs on logical sequences.',
          'Coding: Find the number of islands in a 2D grid.',
        ],
        tips: 'Accenture test has 3 clear sections. Manage time well â€” aptitude and reasoning are straightforward if you practice.',
      },
      {
        type: 'Interview (Technical + HR Combined)',
        difficulty: 2,
        questions: [
          'Explain what REST APIs are.',
          'What is normalization in databases?',
          'Why Accenture? Where do you see yourself in 3 years?',
        ],
        tips: 'Very beginner-friendly round. Be confident, know your resume well, and have 2-3 good examples of college projects ready.',
      },
    ],
  },
  {
    id: 12,
    company: 'HCL',
    role: 'Graduate Engineer Trainee',
    date: '2024-04-25',
    outcome: 'Selected',
    technology: 'C++, Java, Networking',
    difficulty: 1,
    anonymous: false,
    author: 'Tanvi Patil',
    helpful: 28,
    rounds: [
      {
        type: 'Online Written Test',
        difficulty: 1,
        questions: [
          'What is a pointer in C++? Write code to swap two numbers using pointers.',
          'Aptitude: 25 questions on averages, percentages, and time-work.',
          'Technical MCQs: OSI model layers, TCP/IP, basic Java concepts.',
        ],
        tips: 'HCL test is basic and fresh-grad friendly. Review networking fundamentals (OSI, TCP/IP) and data structures basics.',
      },
      {
        type: 'Technical + HR Interview',
        difficulty: 1,
        questions: [
          'Explain the OSI model.',
          'What is the difference between TCP and UDP?',
          'Are you ready to work in any domain (infra, dev, QA)?',
        ],
        tips: 'HCL interviews are smooth and encouraging. They are hiring at scale â€” be yourself, show willingness to learn, and dress professionally.',
      },
    ],
  },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   COMPANY COLOR MAP
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const COMPANY_COLORS = {
  Google: { bg: 'rgba(234,67,53,0.2)', text: '#EA4335', border: 'rgba(234,67,53,0.4)' },
  Amazon: { bg: 'rgba(255,153,0,0.2)', text: '#FF9900', border: 'rgba(255,153,0,0.4)' },
  Microsoft: { bg: 'rgba(0,120,212,0.2)', text: '#0078D4', border: 'rgba(0,120,212,0.4)' },
  Flipkart: { bg: 'rgba(37,116,225,0.2)', text: '#2574E1', border: 'rgba(37,116,225,0.4)' },
  TCS: { bg: 'rgba(124,58,237,0.2)', text: '#7C3AED', border: 'rgba(124,58,237,0.4)' },
  Infosys: { bg: 'rgba(6,182,212,0.2)', text: '#06B6D4', border: 'rgba(6,182,212,0.4)' },
  Wipro: { bg: 'rgba(16,185,129,0.2)', text: '#10B981', border: 'rgba(16,185,129,0.4)' },
  Zomato: { bg: 'rgba(225,55,63,0.2)', text: '#E1373F', border: 'rgba(225,55,63,0.4)' },
  Paytm: { bg: 'rgba(0,176,240,0.2)', text: '#00B0F0', border: 'rgba(0,176,240,0.4)' },
  Swiggy: { bg: 'rgba(252,88,0,0.2)', text: '#FC5800', border: 'rgba(252,88,0,0.4)' },
  Accenture: { bg: 'rgba(162,0,93,0.2)', text: '#A2005D', border: 'rgba(162,0,93,0.4)' },
  HCL: { bg: 'rgba(0,100,160,0.2)', text: '#0064A0', border: 'rgba(0,100,160,0.4)' },
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HELPERS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const StarRating = ({ value, max = 5, interactive = false, onChange }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = hovered !== null ? i < hovered : i < value;
        return (
          <Star
            key={i}
            size={14}
            fill={filled ? '#F59E0B' : 'none'}
            stroke={filled ? '#F59E0B' : '#4B5563'}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.15s' }}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onChange && onChange(i + 1)}
          />
        );
      })}
    </div>
  );
};

const OutcomeBadge = ({ outcome }) => {
  const config = {
    Selected: { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
    Rejected: { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
    Pending: { icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  }[outcome] || {};
  const Icon = config.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20,
      background: config.bg, border: `1px solid ${config.border}`,
      color: config.color, fontSize: 12, fontWeight: 600,
    }}>
      <Icon size={11} /> {outcome}
    </span>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   ROUND CARD (collapsible)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const RoundCard = ({ round, index }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{
      background: 'rgba(6,182,212,0.04)',
      border: '1px solid rgba(6,182,212,0.12)',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#CBD5E1',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>{index + 1}</div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{round.type}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StarRating value={round.difficulty} />
          {open ? <ChevronUp size={14} stroke="#7C3AED" /> : <ChevronDown size={14} stroke="#7C3AED" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 14px' }}>
              <p style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>QUESTIONS ASKED</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {round.questions.map((q, qi) => (
                  <li key={qi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <HelpCircle size={13} stroke="#06B6D4" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>{q}</span>
                  </li>
                ))}
              </ul>
              {round.tips && (
                <div style={{
                  marginTop: 10, padding: '8px 12px',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <Lightbulb size={13} stroke="#F59E0B" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#FCD34D', lineHeight: 1.5 }}>{round.tips}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   EXPERIENCE CARD
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ExperienceCard = ({ exp, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [votes, setVotes] = useState(exp.helpful);
  const [voted, setVoted] = useState(false);
  const colors = COMPANY_COLORS[exp.company] || { bg: 'rgba(124,58,237,0.2)', text: '#7C3AED', border: 'rgba(124,58,237,0.4)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(13,22,39,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${colors.text}, #06B6D4)`,
      }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: colors.bg, border: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Building2 size={20} stroke={colors.text} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '2px 10px', borderRadius: 20,
                  background: colors.bg, border: `1px solid ${colors.border}`,
                  color: colors.text, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                }}>{exp.company}</span>
                <OutcomeBadge outcome={exp.outcome} />
              </div>
              <h3 style={{ margin: '6px 0 2px', fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>{exp.role}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748B' }}>
                  <Calendar size={11} /> {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748B' }}>
                  <Code2 size={11} /> {exp.technology}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748B' }}>
                  <Layers size={11} /> {exp.rounds.length} rounds
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <StarRating value={exp.difficulty} />
            <span style={{ fontSize: 11, color: '#475569' }}>
              {exp.anonymous ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><EyeOff size={10} /> Anonymous</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} /> {exp.author}</span>
              )}
            </span>
          </div>
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { if (!voted) { setVotes(v => v + 1); setVoted(true); } }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 8,
              background: voted ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${voted ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: voted ? '#10B981' : '#94A3B8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <ThumbsUp size={12} /> {votes} Helpful
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {expanded ? <><ChevronUp size={13} /> Hide Rounds</> : <><ChevronDown size={13} /> View Rounds</>}
          </motion.button>
        </div>

        {/* Rounds */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="rounds"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: 14 }}>
                <div style={{
                  width: '100%', height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)',
                  marginBottom: 14,
                }} />
                {exp.rounds.map((round, ri) => (
                  <RoundCard key={ri} round={round} index={ri} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SUBMIT MODAL
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SubmitModal = ({ onClose }) => {
  const [form, setForm] = useState({
    company: '', role: '', date: '', outcome: 'Selected', anonymous: false,
    rounds: [{ type: 'Technical Interview', questions: '', tips: '', difficulty: 3 }],
  });

  const addRound = () => setForm(f => ({
    ...f, rounds: [...f.rounds, { type: '', questions: '', tips: '', difficulty: 3 }],
  }));

  const removeRound = (i) => setForm(f => ({
    ...f, rounds: f.rounds.filter((_, idx) => idx !== i),
  }));

  const updateRound = (i, key, val) => setForm(f => {
    const rounds = [...f.rounds];
    rounds[i] = { ...rounds[i], [key]: val };
    return { ...f, rounds };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '20px 16px', overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 680,
          background: 'rgba(13,22,39,0.97)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 20,
          boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageSquare size={16} stroke="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>Share Your Experience</h2>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>Help others prepare better</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: 6, cursor: 'pointer', color: '#94A3B8',
            display: 'flex', alignItems: 'center',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {[
              { label: 'Company Name', key: 'company', placeholder: 'e.g., Google' },
              { label: 'Role', key: 'role', placeholder: 'e.g., Software Engineer' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Interview Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Overall Outcome</label>
              <select value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} style={inputStyle}>
                {['Selected', 'Rejected', 'Pending'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Rounds */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ ...labelStyle, fontSize: 13, color: '#7C3AED' }}>INTERVIEW ROUNDS ({form.rounds.length})</label>
              <button onClick={addRound} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 7,
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                <Plus size={12} /> Add Round
              </button>
            </div>
            {form.rounds.map((round, ri) => (
              <div key={ri} style={{
                background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)',
                borderRadius: 12, padding: 14, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 700 }}>Round {ri + 1}</span>
                  {form.rounds.length > 1 && (
                    <button onClick={() => removeRound(ri)} style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 6, padding: '2px 6px', cursor: 'pointer', color: '#F87171', fontSize: 11,
                    }}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={labelStyle}>Round Type</label>
                    <select value={round.type} onChange={e => updateRound(ri, 'type', e.target.value)} style={inputStyle}>
                      {['Online Assessment', 'Technical Interview', 'System Design', 'HR Interview', 'Managerial Round', 'Bar Raiser', 'Pair Programming', 'Case Study'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Difficulty (1â€“5 Stars)</label>
                    <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 6, paddingTop: 10 }}>
                      <StarRating value={round.difficulty} interactive onChange={v => updateRound(ri, 'difficulty', v)} />
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>{round.difficulty}/5</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>Questions Asked</label>
                  <textarea
                    value={round.questions}
                    onChange={e => updateRound(ri, 'questions', e.target.value)}
                    placeholder="List the questions you were asked (one per line)..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tips for Future Candidates</label>
                  <textarea
                    value={round.tips}
                    onChange={e => updateRound(ri, 'tips', e.target.value)}
                    placeholder="Share preparation tips, what to focus on..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 54 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Anonymous toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div
              onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: form.anonymous ? '#7C3AED' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
              }}
            >
              <motion.div
                animate={{ left: form.anonymous ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  position: 'absolute', top: 2,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Submit anonymously</span>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.3,
            }}
          >
            Submit Experience
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B',
  letterSpacing: 0.8, marginBottom: 5, textTransform: 'uppercase',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '9px 12px', borderRadius: 9,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#E2E8F0', fontSize: 13, outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   STAT CARD
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const StatCard = ({ icon: Icon, value, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      flex: 1, minWidth: 150,
      background: 'rgba(13,22,39,0.8)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: `0 4px 20px ${color}15`,
      position: 'relative', overflow: 'hidden',
    }}
  >
    <div style={{
      position: 'absolute', top: -20, right: -20,
      width: 80, height: 80, borderRadius: '50%',
      background: `radial-gradient(circle, ${color}20, transparent 70%)`,
    }} />
    <Icon size={22} stroke={color} style={{ marginBottom: 8 }} />
    <div style={{ fontSize: 26, fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{label}</div>
  </motion.div>
);

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MAIN PAGE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const InterviewExperienceDB = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ company: '', role: '', technology: '', difficulty: '', outcome: '' });
  const [showModal, setShowModal] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const COMPANIES = ['', ...Array.from(new Set(MOCK_EXPERIENCES.map(e => e.company)))];
  const OUTCOMES = ['', 'Selected', 'Rejected', 'Pending'];
  const DIFFICULTIES = ['', '1', '2', '3', '4', '5'];

  const filtered = useMemo(() => {
    return MOCK_EXPERIENCES.filter(exp => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        exp.company.toLowerCase().includes(q) ||
        exp.role.toLowerCase().includes(q) ||
        exp.technology.toLowerCase().includes(q);
      const matchCompany = !filters.company || exp.company === filters.company;
      const matchOutcome = !filters.outcome || exp.outcome === filters.outcome;
      const matchDiff = !filters.difficulty || exp.difficulty === Number(filters.difficulty);
      const matchTech = !filters.technology || exp.technology.toLowerCase().includes(filters.technology.toLowerCase());
      return matchSearch && matchCompany && matchOutcome && matchDiff && matchTech;
    });
  }, [search, filters]);

  const selectStyle = {
    padding: '9px 12px', borderRadius: 10,
    background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(124,58,237,0.25)',
    color: '#CBD5E1', fontSize: 13, cursor: 'pointer',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050B18',
      color: '#E2E8F0',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      paddingBottom: 60,
    }}>
      {/* Background glow effects */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -200, left: '20%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: 200, right: '10%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        {/* â”€â”€ PAGE HEADER â”€â”€ */}
        <div style={{ paddingTop: 48, paddingBottom: 32, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 20,
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
              color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              marginBottom: 16,
            }}>
              <Award size={13} /> COMMUNITY VERIFIED
            </div>
            <h1 style={{
              margin: '0 0 10px',
              fontSize: 'clamp(28px, 5vw, 46px)',
              fontWeight: 900,
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #F1F5F9 0%, #A78BFA 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Interview Experience Database
            </h1>
            <p style={{ fontSize: 15, color: '#64748B', maxWidth: 520, margin: '0 auto' }}>
              Real interview experiences from engineers across top tech companies. Learn from those who've been there.
            </p>
          </motion.div>
        </div>

        {/* â”€â”€ STATS â”€â”€ */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
          <StatCard icon={MessageSquare} value="2,847" label="Total Experiences" color="#7C3AED" delay={0.1} />
          <StatCard icon={Building2} value="234" label="Companies Listed" color="#06B6D4" delay={0.2} />
          <StatCard icon={HelpCircle} value="12,500" label="Questions Shared" color="#10B981" delay={0.3} />
          <StatCard icon={Users} value="18,300" label="Candidates Helped" color="#F59E0B" delay={0.4} />
        </div>

        {/* â”€â”€ SEARCH + FILTERS â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: 'rgba(13,22,39,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 16, padding: 20, marginBottom: 28,
          }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={16} stroke="#7C3AED" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by company, role, or technology..."
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '11px 16px 11px 42px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.25)',
                color: '#E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={14} stroke="#7C3AED" />
            <select value={filters.company} onChange={e => setFilters(f => ({ ...f, company: e.target.value }))} style={selectStyle}>
              <option value="">All Companies</option>
              {COMPANIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              value={filters.role}
              onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
              placeholder="Role..."
              style={{ ...selectStyle, width: 130 }}
            />
            <input
              value={filters.technology}
              onChange={e => setFilters(f => ({ ...f, technology: e.target.value }))}
              placeholder="Technology..."
              style={{ ...selectStyle, width: 140 }}
            />
            <select value={filters.difficulty} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))} style={selectStyle}>
              <option value="">All Difficulty</option>
              {[1,2,3,4,5].map(d => <option key={d} value={d}>{'â˜…'.repeat(d)}</option>)}
            </select>
            <select value={filters.outcome} onChange={e => setFilters(f => ({ ...f, outcome: e.target.value }))} style={selectStyle}>
              <option value="">All Outcomes</option>
              {['Selected', 'Rejected', 'Pending'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {(search || Object.values(filters).some(Boolean)) && (
              <button
                onClick={() => { setSearch(''); setFilters({ company: '', role: '', technology: '', difficulty: '', outcome: '' }); }}
                style={{
                  padding: '9px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)', color: '#F87171',
                  fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <X size={12} /> Clear
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowModal(true)}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 10,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Plus size={14} /> Submit Experience
            </motion.button>
          </div>
        </motion.div>

        {/* â”€â”€ RESULTS COUNT â”€â”€ */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Showing <span style={{ color: '#A78BFA', fontWeight: 700 }}>{filtered.length}</span> experience{filtered.length !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 12, color: '#475569' }}>Sorted by: Most Helpful</span>
        </div>

        {/* â”€â”€ EXPERIENCE CARDS â”€â”€ */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'rgba(13,22,39,0.6)', borderRadius: 16,
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <Search size={40} stroke="#334155" style={{ marginBottom: 12 }} />
            <p style={{ color: '#64748B', fontSize: 15 }}>No experiences match your filters.</p>
            <button
              onClick={() => { setSearch(''); setFilters({ company: '', role: '', technology: '', difficulty: '', outcome: '' }); }}
              style={{
                marginTop: 12, padding: '8px 18px', borderRadius: 8,
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                color: '#A78BFA', fontSize: 13, cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€ SUBMIT MODAL â”€â”€ */}
      <AnimatePresence>
        {showModal && <SubmitModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default InterviewExperienceDB;



