import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Zap, ChevronDown, CheckSquare, Square,
  Book, Globe, Youtube, Code2, Award, Target,
  Clock, Rocket, Layers, Database, Shield, Smartphone,
  Server, Brain, GitBranch, Sparkles, ArrowRight,
  CheckCircle2, Play
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* ROADMAP DATA                                                         */
/* ------------------------------------------------------------------ */
const CAREER_GOALS = [
  { value: 'fullstack',     label: 'Full Stack Developer',    icon: Layers },
  { value: 'frontend',      label: 'Frontend Developer',       icon: Globe },
  { value: 'backend',       label: 'Backend Developer',        icon: Server },
  { value: 'aiml',          label: 'AI / ML Engineer',         icon: Brain },
  { value: 'datascience',   label: 'Data Scientist',           icon: Database },
  { value: 'cybersecurity', label: 'Cyber Security Engineer',  icon: Shield },
  { value: 'android',       label: 'Android Developer',        icon: Smartphone },
  { value: 'devops',        label: 'DevOps Engineer',          icon: GitBranch },
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const ROADMAPS = {
  fullstack: {
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED, #6366F1)',
    icon: Layers,
    title: 'Full Stack Developer',
    summary: 'Master both frontend and backend to build complete web applications end-to-end.',
    phases: [
      {
        month: 'Month 1', title: 'Web Fundamentals', color: '#7C3AED',
        skills: ['HTML5 & Semantic Markup', 'CSS3 & Flexbox/Grid', 'JavaScript Basics', 'Git & GitHub', 'Command Line'],
        weekPlan: ['Week 1: HTML structure, forms, tables', 'Week 2: CSS styling, responsive design', 'Week 3: JS variables, loops, functions', 'Week 4: DOM manipulation, events'],
      },
      {
        month: 'Month 2', title: 'React & Modern JS', color: '#6366F1',
        skills: ['React.js Fundamentals', 'ES6+ Features', 'State & Props', 'Hooks (useState, useEffect)', 'React Router'],
        weekPlan: ['Week 1: ES6: arrow functions, destructuring', 'Week 2: React components and JSX', 'Week 3: State management with hooks', 'Week 4: Routing and API calls'],
      },
      {
        month: 'Month 3', title: 'Backend with Node.js', color: '#06B6D4',
        skills: ['Node.js & Express', 'REST API Design', 'MongoDB & Mongoose', 'Authentication (JWT)', 'Middleware'],
        weekPlan: ['Week 1: Node.js basics, modules, npm', 'Week 2: Express server, routing, middleware', 'Week 3: MongoDB CRUD operations', 'Week 4: JWT auth and protected routes'],
      },
      {
        month: 'Month 4', title: 'Advanced Frontend', color: '#10B981',
        skills: ['Redux / Zustand', 'TypeScript Basics', 'Tailwind CSS', 'Testing (Jest, RTL)', 'Performance Optimization'],
        weekPlan: ['Week 1: Global state management', 'Week 2: TypeScript types and interfaces', 'Week 3: Utility-first CSS with Tailwind', 'Week 4: Unit and integration testing'],
      },
      {
        month: 'Month 5', title: 'Cloud & DevOps Basics', color: '#F59E0B',
        skills: ['Docker Basics', 'AWS/Vercel Deployment', 'CI/CD Pipelines', 'Environment Variables', 'NGINX Basics'],
        weekPlan: ['Week 1: Docker containers and images', 'Week 2: Deploy to AWS EC2 / Vercel', 'Week 3: GitHub Actions CI/CD', 'Week 4: Domain setup and SSL'],
      },
      {
        month: 'Month 6', title: 'Portfolio & Job Ready', color: '#EC4899',
        skills: ['System Design Basics', 'SQL / PostgreSQL', 'GraphQL Intro', 'Open Source Contributions', 'Interview Prep'],
        weekPlan: ['Week 1: Build capstone project', 'Week 2: SQL joins and queries', 'Week 3: Polish portfolio and GitHub', 'Week 4: Interview prep and mock tests'],
      },
    ],
    projects: [
      { name: 'Full-Stack E-Commerce App', desc: 'React frontend + Node/Express backend + MongoDB. Includes auth, cart, and payment gateway.', level: 'Intermediate' },
      { name: 'Real-Time Chat Application', desc: 'Socket.io + React + Express. Rooms, typing indicators, and read receipts.', level: 'Intermediate' },
      { name: 'SaaS Dashboard', desc: 'Admin dashboard with charts, user management, subscriptions, and dark/light mode.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'Traversy Media', url: 'https://youtube.com/@TraversyMedia', desc: 'Excellent crash courses for every web technology' },
      { type: 'YouTube', name: 'Fireship', url: 'https://youtube.com/@Fireship', desc: 'Fast-paced tech concepts in 100-second videos' },
      { type: 'Website', name: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Free full-stack curriculum with hands-on projects' },
      { type: 'Docs', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: 'Official reference for HTML, CSS, and JavaScript' },
      { type: 'Website', name: 'Frontend Mentor', url: 'https://frontendmentor.io', desc: 'Real-world challenges to practice your skills' },
    ],
  },
  frontend: {
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
    icon: Globe,
    title: 'Frontend Developer',
    summary: 'Create stunning, performant web UIs with modern JavaScript frameworks and design systems.',
    phases: [
      { month: 'Month 1', title: 'HTML, CSS & JS Mastery', color: '#06B6D4', skills: ['HTML5 Semantics', 'CSS Grid & Flexbox', 'CSS Animations', 'Vanilla JavaScript', 'Browser DevTools'], weekPlan: ['Week 1: Advanced HTML forms & accessibility', 'Week 2: CSS Grid layouts and animations', 'Week 3: JS DOM, events, fetch API', 'Week 4: Build 5 static projects'] },
      { month: 'Month 2', title: 'React Ecosystem', color: '#7C3AED', skills: ['React.js', 'Hooks Deep Dive', 'Context API', 'React Query', 'Framer Motion'], weekPlan: ['Week 1: React component patterns', 'Week 2: Advanced hooks: useMemo, useCallback', 'Week 3: Server state with React Query', 'Week 4: Animations with Framer Motion'] },
      { month: 'Month 3', title: 'TypeScript & Tooling', color: '#10B981', skills: ['TypeScript', 'Vite Build Tool', 'ESLint & Prettier', 'Storybook', 'Chromatic'], weekPlan: ['Week 1: TypeScript fundamentals', 'Week 2: Generic types and interfaces', 'Week 3: Build tooling with Vite', 'Week 4: Component library with Storybook'] },
      { month: 'Month 4', title: 'Testing & Performance', color: '#F59E0B', skills: ['Jest & RTL', 'Playwright E2E', 'Web Vitals (LCP, CLS)', 'Lazy Loading', 'Code Splitting'], weekPlan: ['Week 1: Unit tests with Jest', 'Week 2: Integration tests with React Testing Library', 'Week 3: E2E tests with Playwright', 'Week 4: Lighthouse and web vitals optimization'] },
      { month: 'Month 5', title: 'Next.js & Full Stack', color: '#EC4899', skills: ['Next.js App Router', 'SSR & SSG', 'API Routes', 'tRPC Basics', 'Prisma ORM'], weekPlan: ['Week 1: Next.js pages and routing', 'Week 2: Server-side rendering patterns', 'Week 3: API routes and data fetching', 'Week 4: Full-stack blog with Prisma'] },
      { month: 'Month 6', title: 'Portfolio & Mastery', color: '#8B5CF6', skills: ['Design Systems', 'CSS-in-JS (Styled Components)', 'Micro-frontends', 'PWA', 'Interview DSA'], weekPlan: ['Week 1: Build personal portfolio', 'Week 2: Design token system', 'Week 3: PWA features (service workers)', 'Week 4: Frontend interview prep'] },
    ],
    projects: [
      { name: 'Design System UI Library', desc: 'Build a reusable component library with TypeScript, Storybook, and automated testing.', level: 'Advanced' },
      { name: 'Animated Portfolio Website', desc: 'Personal portfolio with Framer Motion animations, dark/light mode, and blog.', level: 'Beginner' },
      { name: 'Weather Dashboard PWA', desc: 'Progressive web app with geolocation, offline support, and beautiful data visualization.', level: 'Intermediate' },
    ],
    resources: [
      { type: 'YouTube', name: 'Kevin Powell (CSS)', url: 'https://youtube.com/@KevinPowell', desc: 'The best teacher for modern CSS techniques' },
      { type: 'YouTube', name: 'Web Dev Simplified', url: 'https://youtube.com/@WebDevSimplified', desc: 'Simplified explanations of complex web concepts' },
      { type: 'Website', name: 'css-tricks.com', url: 'https://css-tricks.com', desc: 'CSS guides, almanac, and web dev articles' },
      { type: 'Docs', name: 'React Documentation', url: 'https://react.dev', desc: 'Official React docs with interactive examples' },
      { type: 'Website', name: 'roadmap.sh/frontend', url: 'https://roadmap.sh/frontend', desc: 'Community-curated frontend developer roadmap' },
    ],
  },
  backend: {
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    icon: Server,
    title: 'Backend Developer',
    summary: 'Build robust, scalable server-side applications and APIs powering modern applications.',
    phases: [
      { month: 'Month 1', title: 'Programming & Fundamentals', color: '#10B981', skills: ['Python or Node.js', 'OOP Concepts', 'Data Structures', 'Git Workflow', 'Linux CLI'], weekPlan: ['Week 1: Python/Node syntax and data types', 'Week 2: OOP — classes, inheritance, polymorphism', 'Week 3: Arrays, linked lists, stacks, queues', 'Week 4: Git branching and Linux commands'] },
      { month: 'Month 2', title: 'Databases', color: '#7C3AED', skills: ['SQL & PostgreSQL', 'NoSQL (MongoDB)', 'ORM (Prisma/SQLAlchemy)', 'Indexing & Optimization', 'ACID Properties'], weekPlan: ['Week 1: SQL basics — SELECT, JOIN, GROUP BY', 'Week 2: Advanced queries and indexing', 'Week 3: MongoDB CRUD and aggregation', 'Week 4: ORM setup and migrations'] },
      { month: 'Month 3', title: 'APIs & Web Frameworks', color: '#06B6D4', skills: ['REST API Design', 'Express.js / FastAPI', 'Authentication (JWT, OAuth)', 'Validation', 'Error Handling'], weekPlan: ['Week 1: RESTful principles and HTTP methods', 'Week 2: Express/FastAPI server setup', 'Week 3: JWT auth and refresh tokens', 'Week 4: API documentation with Swagger'] },
      { month: 'Month 4', title: 'Microservices & Message Queues', color: '#F59E0B', skills: ['Microservices Architecture', 'RabbitMQ / Kafka', 'gRPC Basics', 'Service Discovery', 'Circuit Breaker'], weekPlan: ['Week 1: Microservices patterns and tradeoffs', 'Week 2: Message queues with RabbitMQ', 'Week 3: gRPC communication between services', 'Week 4: API Gateway pattern'] },
      { month: 'Month 5', title: 'Cloud & Containers', color: '#EC4899', skills: ['Docker', 'Kubernetes Basics', 'AWS EC2/S3/Lambda', 'Redis Caching', 'Monitoring (Prometheus)'], weekPlan: ['Week 1: Docker containers and compose', 'Week 2: Kubernetes pods, services, deployments', 'Week 3: AWS services for backend', 'Week 4: Redis caching strategies'] },
      { month: 'Month 6', title: 'Advanced & Interview Prep', color: '#8B5CF6', skills: ['System Design', 'Performance Tuning', 'Security (OWASP Top 10)', 'Load Testing', 'Algorithms & DSA'], weekPlan: ['Week 1: System design patterns (CAP theorem)', 'Week 2: OWASP security vulnerabilities', 'Week 3: Load testing with k6', 'Week 4: DSA and interview practice'] },
    ],
    projects: [
      { name: 'REST API with Authentication', desc: 'Full CRUD REST API with JWT auth, rate limiting, and Swagger documentation.', level: 'Beginner' },
      { name: 'Microservices E-Commerce Backend', desc: 'Order, user, inventory, and payment services communicating via RabbitMQ.', level: 'Advanced' },
      { name: 'Real-Time Analytics Pipeline', desc: 'Kafka + ClickHouse pipeline for processing and visualizing events in real time.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'Hussein Nasser', url: 'https://youtube.com/@hnasr', desc: 'Deep dives into backend engineering and system design' },
      { type: 'YouTube', name: 'TechWorld with Nana', url: 'https://youtube.com/@TechWorldwithNana', desc: 'Docker, Kubernetes, and DevOps tutorials' },
      { type: 'Website', name: 'roadmap.sh/backend', url: 'https://roadmap.sh/backend', desc: 'Comprehensive backend development roadmap' },
      { type: 'Docs', name: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com', desc: 'Modern, fast Python web framework documentation' },
      { type: 'Website', name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', desc: 'Learn system design with examples and diagrams' },
    ],
  },
  aiml: {
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    icon: Brain,
    title: 'AI / ML Engineer',
    summary: 'Build intelligent systems using machine learning, deep learning, and modern AI frameworks.',
    phases: [
      { month: 'Month 1', title: 'Python & Math Foundations', color: '#8B5CF6', skills: ['Python (NumPy, Pandas)', 'Linear Algebra', 'Probability & Statistics', 'Calculus Basics', 'Data Visualization (Matplotlib)'], weekPlan: ['Week 1: NumPy arrays and matrix operations', 'Week 2: Pandas DataFrames and data cleaning', 'Week 3: Statistics: mean, variance, distributions', 'Week 4: Matplotlib and Seaborn visualization'] },
      { month: 'Month 2', title: 'Classical Machine Learning', color: '#7C3AED', skills: ['Scikit-learn', 'Regression & Classification', 'Decision Trees & Random Forest', 'SVM', 'K-Means Clustering'], weekPlan: ['Week 1: Linear and logistic regression', 'Week 2: Tree-based models and ensembles', 'Week 3: SVM and KNN algorithms', 'Week 4: Unsupervised learning and clustering'] },
      { month: 'Month 3', title: 'Deep Learning', color: '#06B6D4', skills: ['Neural Networks Fundamentals', 'TensorFlow / PyTorch', 'CNNs for Vision', 'RNNs & LSTMs', 'Transfer Learning'], weekPlan: ['Week 1: Perceptrons, activations, backprop', 'Week 2: Build and train CNNs in PyTorch', 'Week 3: Sequence models for time series/text', 'Week 4: Fine-tune pretrained models (ResNet, BERT)'] },
      { month: 'Month 4', title: 'NLP & Transformers', color: '#10B981', skills: ['Text Preprocessing', 'Word Embeddings (Word2Vec)', 'BERT & Transformers (HuggingFace)', 'Prompt Engineering', 'LLM Fine-tuning'], weekPlan: ['Week 1: NLP pipeline: tokenization, stemming', 'Week 2: Word2Vec and sentence embeddings', 'Week 3: BERT fine-tuning for classification', 'Week 4: Prompt engineering and LLM APIs'] },
      { month: 'Month 5', title: 'MLOps & Deployment', color: '#F59E0B', skills: ['MLflow Experiment Tracking', 'Model Deployment (FastAPI)', 'Docker for ML', 'Vertex AI / SageMaker', 'Data Pipelines (Airflow)'], weekPlan: ['Week 1: Track experiments with MLflow', 'Week 2: Serve models with FastAPI', 'Week 3: Containerize ML with Docker', 'Week 4: Deploy to cloud ML platforms'] },
      { month: 'Month 6', title: 'Portfolio & Specialization', color: '#EC4899', skills: ['Reinforcement Learning Intro', 'Computer Vision Projects', 'Kaggle Competitions', 'Research Paper Reading', 'Interview Prep'], weekPlan: ['Week 1: RL: Q-learning and policy gradients', 'Week 2: End-to-end CV project', 'Week 3: Compete in a Kaggle challenge', 'Week 4: ML system design interview prep'] },
    ],
    projects: [
      { name: 'Sentiment Analysis API', desc: 'Fine-tune BERT on custom data, wrap in FastAPI, and deploy with Docker.', level: 'Intermediate' },
      { name: 'Image Classification App', desc: 'Train a CNN on a custom dataset, deploy as web app with upload functionality.', level: 'Intermediate' },
      { name: 'LLM-powered Chatbot', desc: 'RAG pipeline using LangChain, OpenAI API, and vector database (Pinecone/Chroma).', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'Andrej Karpathy', url: 'https://youtube.com/@AndrejKarpathy', desc: 'Deep learning from first principles by OpenAI co-founder' },
      { type: 'YouTube', name: 'sentdex', url: 'https://youtube.com/@sentdex', desc: 'Python ML tutorials from basics to advanced' },
      { type: 'Website', name: 'fast.ai', url: 'https://fast.ai', desc: 'Practical deep learning course for coders' },
      { type: 'Docs', name: 'Hugging Face Docs', url: 'https://huggingface.co/docs', desc: 'Transformers, datasets, and model hub documentation' },
      { type: 'Website', name: 'Papers With Code', url: 'https://paperswithcode.com', desc: 'Latest ML research papers with code implementations' },
    ],
  },
  datascience: {
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    icon: Database,
    title: 'Data Scientist',
    summary: 'Extract insights from data using statistics, ML, and data storytelling to drive business decisions.',
    phases: [
      { month: 'Month 1', title: 'Python & Statistics', color: '#F59E0B', skills: ['Python Fundamentals', 'NumPy & Pandas', 'Descriptive Statistics', 'Hypothesis Testing', 'Probability Distributions'], weekPlan: ['Week 1: Python basics and data types', 'Week 2: Pandas for data manipulation', 'Week 3: Statistical measures and distributions', 'Week 4: T-tests, chi-square, ANOVA'] },
      { month: 'Month 2', title: 'Data Visualization', color: '#EC4899', skills: ['Matplotlib & Seaborn', 'Plotly & Dash', 'Tableau Basics', 'EDA Techniques', 'Storytelling with Data'], weekPlan: ['Week 1: Advanced Matplotlib plots', 'Week 2: Interactive Plotly dashboards', 'Week 3: Tableau for BI reports', 'Week 4: Complete EDA on Kaggle dataset'] },
      { month: 'Month 3', title: 'Machine Learning', color: '#7C3AED', skills: ['Scikit-learn', 'Feature Engineering', 'Model Selection & Tuning', 'Cross-validation', 'Imbalanced Datasets'], weekPlan: ['Week 1: Core ML algorithms review', 'Week 2: Feature selection and engineering', 'Week 3: GridSearch and RandomizedSearch', 'Week 4: Handle class imbalance (SMOTE)'] },
      { month: 'Month 4', title: 'SQL & Data Engineering', color: '#06B6D4', skills: ['Advanced SQL', 'Window Functions', 'Big Data (Spark basics)', 'ETL Pipelines', 'Data Warehousing'], weekPlan: ['Week 1: Advanced SQL: CTEs, window functions', 'Week 2: PySpark basics for big data', 'Week 3: Build a simple ETL pipeline', 'Week 4: Data warehouse concepts (star schema)'] },
      { month: 'Month 5', title: 'Deep Learning & NLP', color: '#10B981', skills: ['TensorFlow/Keras', 'CNNs & RNNs', 'Text Analytics', 'Time Series Forecasting', 'AutoML'], weekPlan: ['Week 1: Neural networks for tabular data', 'Week 2: Time series with LSTM', 'Week 3: Text classification with BERT', 'Week 4: AutoML tools (H2O, AutoSklearn)'] },
      { month: 'Month 6', title: 'Portfolio & Career Prep', color: '#8B5CF6', skills: ['A/B Testing', 'Business Case Studies', 'Kaggle Competitions', 'DS Interview Prep', 'Communication Skills'], weekPlan: ['Week 1: Run an A/B test experiment', 'Week 2: Solve 3 business case studies', 'Week 3: Complete end-to-end Kaggle project', 'Week 4: Statistics and SQL interview prep'] },
    ],
    projects: [
      { name: 'Customer Churn Prediction', desc: 'End-to-end project: EDA → feature engineering → model training → Streamlit dashboard.', level: 'Intermediate' },
      { name: 'Sales Forecasting Dashboard', desc: 'Time series forecasting with Prophet/LSTM and interactive Plotly/Dash visualization.', level: 'Intermediate' },
      { name: 'Recommendation Engine', desc: 'Collaborative filtering + content-based hybrid recommender for movies/products.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'StatQuest (Josh Starmer)', url: 'https://youtube.com/@statquest', desc: 'Clear, illustrated explanations of statistics and ML' },
      { type: 'YouTube', name: 'Ken Jee', url: 'https://youtube.com/@KenJee_ds', desc: 'Data science career advice and project walkthroughs' },
      { type: 'Website', name: 'Kaggle Learn', url: 'https://kaggle.com/learn', desc: 'Free micro-courses on Python, ML, SQL, and visualization' },
      { type: 'Docs', name: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', desc: 'Complete reference for Python data manipulation' },
      { type: 'Website', name: 'Towards Data Science', url: 'https://towardsdatascience.com', desc: 'Articles and tutorials from the DS community' },
    ],
  },
  cybersecurity: {
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    icon: Shield,
    title: 'Cyber Security Engineer',
    summary: 'Protect systems and networks by mastering ethical hacking, security analysis, and threat mitigation.',
    phases: [
      { month: 'Month 1', title: 'Networking & OS Fundamentals', color: '#EF4444', skills: ['TCP/IP & OSI Model', 'Networking Protocols (HTTP, DNS, SSH)', 'Linux Security', 'Windows Security', 'Wireshark Packet Analysis'], weekPlan: ['Week 1: OSI model and TCP/IP stack', 'Week 2: DNS, HTTP, HTTPS, TLS deep dive', 'Week 3: Linux commands and file permissions', 'Week 4: Wireshark traffic analysis labs'] },
      { month: 'Month 2', title: 'Ethical Hacking Basics', color: '#F59E0B', skills: ['Kali Linux', 'Reconnaissance (OSINT)', 'Nmap Network Scanning', 'Metasploit Framework', 'Burp Suite Basics'], weekPlan: ['Week 1: Kali Linux setup and basic tools', 'Week 2: OSINT and passive reconnaissance', 'Week 3: Nmap scanning and enumeration', 'Week 4: Metasploit basics and payloads'] },
      { month: 'Month 3', title: 'Web Application Security', color: '#7C3AED', skills: ['OWASP Top 10', 'SQL Injection', 'XSS & CSRF', 'Burp Suite Advanced', 'API Security'], weekPlan: ['Week 1: OWASP Top 10 vulnerabilities', 'Week 2: SQL injection labs on DVWA', 'Week 3: XSS and CSRF exploitation and defense', 'Week 4: API security testing with Burp Suite'] },
      { month: 'Month 4', title: 'Network Security', color: '#06B6D4', skills: ['Firewalls & IDS/IPS', 'VPN & Zero Trust', 'MITM Attacks', 'Wireless Security (WPA3)', 'Sniffing & Spoofing'], weekPlan: ['Week 1: Firewall rules and IDS configuration', 'Week 2: VPN types and zero trust architecture', 'Week 3: Man-in-the-middle attack labs', 'Week 4: Wireless network pentesting'] },
      { month: 'Month 5', title: 'Malware & Forensics', color: '#EC4899', skills: ['Malware Analysis (Static & Dynamic)', 'Reverse Engineering Basics', 'Memory Forensics', 'Log Analysis', 'Incident Response'], weekPlan: ['Week 1: Static malware analysis with strings/IDA', 'Week 2: Dynamic analysis with sandboxes', 'Week 3: Memory forensics with Volatility', 'Week 4: Incident response playbooks'] },
      { month: 'Month 6', title: 'Certifications & Career', color: '#8B5CF6', skills: ['CompTIA Security+', 'CEH Prep', 'TryHackMe / HTB Machines', 'Bug Bounty Programs', 'SOC Analyst Skills'], weekPlan: ['Week 1: Security+ exam topics review', 'Week 2: Complete 10 TryHackMe rooms', 'Week 3: Hack 3 HackTheBox machines', 'Week 4: Submit first bug bounty report'] },
    ],
    projects: [
      { name: 'Home Lab Setup', desc: 'Build a virtual lab with Kali Linux, vulnerable VMs, and practice attack/defense scenarios.', level: 'Beginner' },
      { name: 'Web Vulnerability Scanner', desc: 'Build a Python tool that detects XSS, SQL injection, and open redirects in web apps.', level: 'Intermediate' },
      { name: 'SIEM Dashboard', desc: 'Set up ELK stack to collect, parse, and visualize security logs and alerts.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'NetworkChuck', url: 'https://youtube.com/@NetworkChuck', desc: 'Fun and engaging cybersecurity and networking content' },
      { type: 'YouTube', name: 'John Hammond', url: 'https://youtube.com/@_JohnHammond', desc: 'CTF walkthroughs and malware analysis' },
      { type: 'Website', name: 'TryHackMe', url: 'https://tryhackme.com', desc: 'Guided, hands-on cybersecurity learning rooms' },
      { type: 'Website', name: 'HackTheBox', url: 'https://hackthebox.com', desc: 'Advanced penetration testing labs and challenges' },
      { type: 'Docs', name: 'OWASP Foundation', url: 'https://owasp.org', desc: 'Web application security standards and checklists' },
    ],
  },
  android: {
    color: '#3DDC84',
    gradient: 'linear-gradient(135deg, #3DDC84, #00C853)',
    icon: Smartphone,
    title: 'Android Developer',
    summary: 'Build beautiful, performant native Android apps using Kotlin and Jetpack Compose.',
    phases: [
      { month: 'Month 1', title: 'Kotlin Fundamentals', color: '#3DDC84', skills: ['Kotlin Basics', 'OOP in Kotlin', 'Coroutines & Flow', 'Null Safety', 'Extension Functions'], weekPlan: ['Week 1: Kotlin syntax and data classes', 'Week 2: Classes, interfaces, and inheritance', 'Week 3: Coroutines for async programming', 'Week 4: Kotlin Flow and StateFlow'] },
      { month: 'Month 2', title: 'Android Core & UI', color: '#7C3AED', skills: ['Activities & Fragments', 'Jetpack Compose', 'Material Design 3', 'RecyclerView', 'Navigation Component'], weekPlan: ['Week 1: Activity lifecycle and intents', 'Week 2: Jetpack Compose basics and state', 'Week 3: Navigation in Compose', 'Week 4: Material 3 theming and components'] },
      { month: 'Month 3', title: 'Architecture & Data', color: '#06B6D4', skills: ['MVVM Architecture', 'Room Database', 'Retrofit & OkHttp', 'Hilt (Dependency Injection)', 'Repository Pattern'], weekPlan: ['Week 1: ViewModel and LiveData', 'Week 2: Room database with DAO', 'Week 3: Retrofit API calls and GSON', 'Week 4: Hilt dependency injection setup'] },
      { month: 'Month 4', title: 'Advanced Features', color: '#F59E0B', skills: ['WorkManager', 'Push Notifications (FCM)', 'CameraX', 'Maps SDK', 'Biometric Auth'], weekPlan: ['Week 1: Background tasks with WorkManager', 'Week 2: Firebase Cloud Messaging', 'Week 3: Camera and image capture', 'Week 4: Google Maps integration'] },
      { month: 'Month 5', title: 'Testing & Performance', color: '#EC4899', skills: ['Espresso UI Tests', 'Unit Tests with MockK', 'Profiler Tools', 'App Size Optimization', 'Battery Optimization'], weekPlan: ['Week 1: Unit tests with JUnit and MockK', 'Week 2: UI automation with Espresso', 'Week 3: Memory leaks and profiling', 'Week 4: APK size reduction techniques'] },
      { month: 'Month 6', title: 'Publishing & Career', color: '#8B5CF6', skills: ['Google Play Store', 'App Signing & Release', 'Firebase Analytics', 'In-App Purchases', 'Android Interview Prep'], weekPlan: ['Week 1: Finalize and publish app to Play Store', 'Week 2: Firebase analytics and crashlytics', 'Week 3: In-app purchases with Billing API', 'Week 4: Android interview prep'] },
    ],
    projects: [
      { name: 'News Reader App', desc: 'Kotlin + Jetpack Compose + Retrofit + MVVM. Fetch news API, save favorites in Room DB.', level: 'Beginner' },
      { name: 'Expense Tracker', desc: 'Full offline app with Room DB, categories, charts with MPAndroidChart, and export to CSV.', level: 'Intermediate' },
      { name: 'Real-Time Chat App', desc: 'Firebase Auth + Firestore + FCM push notifications + image sharing with CameraX.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'Philipp Lackner', url: 'https://youtube.com/@PhilippLackner', desc: 'Best Kotlin and Jetpack Compose tutorials on YouTube' },
      { type: 'YouTube', name: 'Android Developers', url: 'https://youtube.com/@AndroidDevelopers', desc: 'Official Android channel with talks and tutorials' },
      { type: 'Docs', name: 'Android Documentation', url: 'https://developer.android.com', desc: 'Official Android developer guides and API references' },
      { type: 'Website', name: 'Android Weekly', url: 'https://androidweekly.net', desc: 'Weekly newsletter with latest Android news and articles' },
      { type: 'Website', name: 'Kotlin Playground', url: 'https://play.kotlinlang.org', desc: 'Browser-based Kotlin IDE to practice without setup' },
    ],
  },
  devops: {
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #7C3AED)',
    icon: GitBranch,
    title: 'DevOps Engineer',
    summary: 'Bridge development and operations by automating infrastructure, CI/CD, and cloud deployments.',
    phases: [
      { month: 'Month 1', title: 'Linux & Scripting', color: '#6366F1', skills: ['Linux Administration', 'Bash Scripting', 'Python Automation', 'Networking (TCP/IP, DNS)', 'SSH & Security'], weekPlan: ['Week 1: Linux file system, permissions, processes', 'Week 2: Bash scripting: variables, loops, cron', 'Week 3: Python for sysadmin automation', 'Week 4: Networking: subnets, DNS, firewalls'] },
      { month: 'Month 2', title: 'Version Control & CI/CD', color: '#7C3AED', skills: ['Git Advanced (Branching, Rebase)', 'GitHub Actions', 'GitLab CI/CD', 'Jenkins Basics', 'Webhooks & Triggers'], weekPlan: ['Week 1: Git branching strategies (GitFlow)', 'Week 2: GitHub Actions workflows', 'Week 3: Multi-stage CI/CD pipelines', 'Week 4: Jenkins declarative pipelines'] },
      { month: 'Month 3', title: 'Containers & Docker', color: '#06B6D4', skills: ['Docker Fundamentals', 'Dockerfile Best Practices', 'Docker Compose', 'Container Registries (ECR/GCR)', 'Multi-stage Builds'], weekPlan: ['Week 1: Docker images, containers, volumes', 'Week 2: Dockerfile optimization and layers', 'Week 3: Docker Compose multi-service apps', 'Week 4: Container security and scanning'] },
      { month: 'Month 4', title: 'Kubernetes', color: '#10B981', skills: ['Kubernetes Architecture', 'Pods, Deployments, Services', 'ConfigMaps & Secrets', 'Helm Charts', 'RBAC & Security'], weekPlan: ['Week 1: Kubernetes cluster setup (Minikube/K3s)', 'Week 2: Deployments, ReplicaSets, and rollouts', 'Week 3: Services: ClusterIP, NodePort, LoadBalancer', 'Week 4: Helm package management'] },
      { month: 'Month 5', title: 'Cloud & IaC', color: '#F59E0B', skills: ['AWS Core Services', 'Terraform', 'Ansible', 'CloudFormation', 'Cost Optimization'], weekPlan: ['Week 1: AWS EC2, VPC, IAM, S3, RDS', 'Week 2: Terraform: providers, resources, state', 'Week 3: Ansible playbooks and inventory', 'Week 4: Multi-environment IaC with Terraform'] },
      { month: 'Month 6', title: 'Observability & Career', color: '#EC4899', skills: ['Prometheus & Grafana', 'ELK Stack', 'Distributed Tracing (Jaeger)', 'SRE Principles', 'DevOps Interview Prep'], weekPlan: ['Week 1: Prometheus metrics and alerting', 'Week 2: Grafana dashboards and visualization', 'Week 3: ELK stack for centralized logging', 'Week 4: SRE: SLOs, SLAs, error budgets'] },
    ],
    projects: [
      { name: 'CI/CD Pipeline for a Node App', desc: 'GitHub Actions → Docker build → ECR push → EC2 deploy with zero downtime (blue-green).', level: 'Intermediate' },
      { name: 'Kubernetes Microservices Cluster', desc: 'Deploy 3 microservices on K8s with Helm, auto-scaling, and health checks.', level: 'Advanced' },
      { name: 'Full Infrastructure with Terraform', desc: 'IaC for VPC, ECS cluster, RDS, S3, CloudFront, and Route53 on AWS.', level: 'Advanced' },
    ],
    resources: [
      { type: 'YouTube', name: 'TechWorld with Nana', url: 'https://youtube.com/@TechWorldwithNana', desc: 'Clear DevOps and Kubernetes tutorials for beginners' },
      { type: 'YouTube', name: 'NetworkChuck', url: 'https://youtube.com/@NetworkChuck', desc: 'Networking and cloud concepts explained with energy' },
      { type: 'Website', name: 'KillerKoda.com', url: 'https://killercoda.com', desc: 'Free browser-based Kubernetes and DevOps labs' },
      { type: 'Docs', name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs', desc: 'Official Kubernetes concepts and API reference' },
      { type: 'Website', name: 'DevOps Roadmap', url: 'https://roadmap.sh/devops', desc: 'Visual roadmap for becoming a DevOps engineer' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* HELPER: resource icon                                               */
/* ------------------------------------------------------------------ */
const ResourceIcon = ({ type }) => {
  if (type === 'YouTube') return <Youtube size={15} style={{ color: '#EF4444' }} />;
  if (type === 'Docs') return <Book size={15} style={{ color: '#06B6D4' }} />;
  return <Globe size={15} style={{ color: '#10B981' }} />;
};

const ProjectLevelBadge = ({ level }) => {
  const cfg = { Beginner: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' }, Intermediate: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' }, Advanced: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' } }[level] || {};
  return <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 8px', borderRadius: 100 }}>{level}</span>;
};

/* ------------------------------------------------------------------ */
/* GENERATED ROADMAP DISPLAY                                           */
/* ------------------------------------------------------------------ */
const RoadmapDisplay = ({ roadmap, level }) => {
  const [checked, setChecked] = useState({});
  const toggleCheck = useCallback((key) => setChecked(p => ({ ...p, [key]: !p[key] })), []);

  const totalMilestones = roadmap.phases.reduce((a, p) => a + p.skills.length, 0);
  const completedMilestones = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring', damping: 22 }}>

      {/* Roadmap Header */}
      <div style={{
        padding: '28px 32px', marginBottom: 28,
        background: `linear-gradient(135deg, ${roadmap.color}18, ${roadmap.color}06)`,
        border: `1px solid ${roadmap.color}28`, borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: roadmap.gradient, opacity: 0.1, filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: roadmap.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${roadmap.color}35` }}>
            <roadmap.icon size={26} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Outfit', margin: '0 0 5px', letterSpacing: '-0.02em' }}>{roadmap.title} Roadmap</h2>
            <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>{roadmap.summary}</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Outfit', color: roadmap.color, letterSpacing: '-0.03em' }}>{progress}%</div>
          <div style={{ color: '#64748B', fontSize: 12, marginBottom: 8 }}>Progress</div>
          <div style={{ width: 120, height: 6, background: 'rgba(99,102,241,0.1)', borderRadius: 100, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3 }}
              style={{ height: '100%', background: roadmap.gradient, borderRadius: 100 }} />
          </div>
        </div>
      </div>

      {/* Timeline Phases */}
      <div style={{ position: 'relative', marginBottom: 36 }}>
        {/* Vertical timeline line */}
        <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${roadmap.color}, transparent)`, opacity: 0.2 }} />

        {roadmap.phases.map((phase, phaseIdx) => (
          <motion.div key={phase.month} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: phaseIdx * 0.1 }}
            style={{ display: 'flex', gap: 24, marginBottom: phaseIdx < roadmap.phases.length - 1 ? 28 : 0 }}>

            {/* Timeline node */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${phase.color}, ${phase.color}80)`, border: `3px solid ${phase.color}30`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${phase.color}30`, position: 'relative', zIndex: 1 }}>
                <span style={{ color: 'white', fontSize: 9, fontWeight: 700, opacity: 0.8 }}>MONTH</span>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: 'Outfit', lineHeight: 1 }}>{phaseIdx + 1}</span>
              </div>
            </div>

            {/* Phase Content */}
            <div className="glass-card-static" style={{ flex: 1, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase.color, boxShadow: `0 0 8px ${phase.color}` }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', margin: 0 }}>{phase.month}: {phase.title}</h3>
              </div>

              {/* Two-column layout: skills + weekly plan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Skills */}
                <div>
                  <p style={{ color: '#475569', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Skills to Learn</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {phase.skills.map((skill, si) => {
                      const key = `${phaseIdx}-${si}`;
                      return (
                        <div key={skill} onClick={() => toggleCheck(key)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          {checked[key]
                            ? <CheckSquare size={15} style={{ color: phase.color, flexShrink: 0 }} />
                            : <Square size={15} style={{ color: '#334155', flexShrink: 0 }} />}
                          <span style={{ color: checked[key] ? '#64748B' : '#94A3B8', fontSize: 13, textDecoration: checked[key] ? 'line-through' : 'none', transition: 'all 0.2s' }}>{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Plan */}
                <div>
                  <p style={{ color: '#475569', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Weekly Breakdown</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {phase.weekPlan.map((week, wi) => (
                      <div key={wi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: `${phase.color}15`, border: `1px solid ${phase.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ color: phase.color, fontSize: 9, fontWeight: 900 }}>W{wi + 1}</span>
                        </div>
                        <span style={{ color: '#64748B', fontSize: 12, lineHeight: 1.5 }}>{week.replace(`Week ${wi + 1}: `, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Projects Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="glass-card-static" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${roadmap.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={18} style={{ color: roadmap.color }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', margin: 0 }}>Recommended Projects</h3>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Build these to strengthen your portfolio</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {roadmap.projects.map((project, i) => (
            <motion.div key={project.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }}
              style={{ padding: '18px 20px', background: `${roadmap.color}06`, border: `1px solid ${roadmap.color}15`, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: roadmap.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code2 size={13} style={{ color: 'white' }} />
                </div>
                <ProjectLevelBadge level={project.level} />
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9', marginBottom: 6, fontFamily: 'Outfit' }}>{project.name}</h4>
              <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resources Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="glass-card-static" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} style={{ color: '#06B6D4' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit', margin: 0 }}>Free Learning Resources</h3>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Handpicked channels, docs & websites</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roadmap.resources.map((res, i) => (
            <motion.a key={res.name} href={res.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.95 + i * 0.06 }}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
                background: 'rgba(13,22,39,0.6)', border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: 12, textDecoration: 'none', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${roadmap.color}35`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ResourceIcon type={res.type} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 14 }}>{res.name}</span>
                  <span style={{ fontSize: 10, color: '#475569', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)', padding: '2px 7px', borderRadius: 100 }}>{res.type}</span>
                </div>
                <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>{res.desc}</p>
              </div>
              <ArrowRight size={14} style={{ color: '#334155', flexShrink: 0 }} />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
const CareerRoadmap = () => {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCareer) return;
    setLoading(true);
    setRoadmap(null);
    await new Promise(r => setTimeout(r, 1800));
    setRoadmap(ROADMAPS[selectedCareer]);
    setLoading(false);
  };

  const selectedCareerObj = CAREER_GOALS.find(g => g.value === selectedCareer);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 64 }}>

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={22} style={{ color: '#A78BFA' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
              AI Career <span className="gradient-text">Roadmap</span>
            </h1>
            <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>Get a personalized 6-month learning roadmap for your dream tech career</p>
          </div>
        </div>
      </motion.div>

      {/* ── Configuration Card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card-static" style={{ padding: '32px 36px', marginBottom: 36, position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <Sparkles size={18} style={{ color: '#A78BFA' }} />
          <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Outfit', margin: 0 }}>Configure Your Roadmap</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          {/* Career Goal */}
          <div>
            <label className="label">Career Goal</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {CAREER_GOALS.map(({ value, label, icon: Icon }) => (
                <motion.button key={value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelectedCareer(value); setRoadmap(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px',
                    background: selectedCareer === value ? 'rgba(124,58,237,0.15)' : 'rgba(13,22,39,0.6)',
                    border: selectedCareer === value ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(99,102,241,0.1)',
                    borderRadius: 12, cursor: 'pointer',
                    color: selectedCareer === value ? '#C4B5FD' : '#64748B',
                    fontSize: 13, fontWeight: 700, textAlign: 'left',
                    transition: 'all 0.2s',
                  }}>
                  <Icon size={15} style={{ color: selectedCareer === value ? '#A78BFA' : '#475569', flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.3 }}>{label}</span>
                  {selectedCareer === value && <CheckCircle2 size={13} style={{ color: '#A78BFA', marginLeft: 'auto', flexShrink: 0 }} />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="label">Current Level</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { level: 'Beginner', desc: 'Just starting out, learning basics', color: '#10B981' },
                { level: 'Intermediate', desc: 'Know the basics, want to go deeper', color: '#F59E0B' },
                { level: 'Advanced', desc: 'Experienced, targeting senior roles', color: '#EF4444' },
              ].map(({ level, desc, color }) => (
                <motion.button key={level} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    background: selectedLevel === level ? `${color}10` : 'rgba(13,22,39,0.6)',
                    border: selectedLevel === level ? `1px solid ${color}35` : '1px solid rgba(99,102,241,0.1)',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: selectedLevel === level ? `0 0 10px ${color}` : 'none', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: selectedLevel === level ? '#F1F5F9' : '#64748B', marginBottom: 2 }}>{level}</div>
                    <div style={{ fontSize: 12, color: '#475569' }}>{desc}</div>
                  </div>
                  {selectedLevel === level && <CheckCircle2 size={15} style={{ color, flexShrink: 0 }} />}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button
            whileHover={!loading && selectedCareer ? { scale: 1.03, boxShadow: '0 16px 40px rgba(124,58,237,0.45)' } : {}}
            whileTap={!loading && selectedCareer ? { scale: 0.97 } : {}}
            onClick={handleGenerate}
            disabled={!selectedCareer || loading}
            className="btn-primary"
            style={{ padding: '14px 40px', fontSize: 15, minWidth: 220 }}>
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                Generating Roadmap...
              </>
            ) : (
              <>
                <Zap size={17} />
                Generate My Roadmap
              </>
            )}
          </motion.button>
        </div>

        {!selectedCareer && (
          <p style={{ textAlign: 'center', color: '#334155', fontSize: 13, marginTop: 14 }}>
            ← Select a career goal to get started
          </p>
        )}
      </motion.div>

      {/* ── Loading Animation ── */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid rgba(6,182,212,0.2)', borderTopColor: '#06B6D4' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={28} style={{ color: '#7C3AED' }} />
              </div>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 8 }}>Building your roadmap...</h3>
            <p style={{ color: '#475569', fontSize: 14 }}>Crafting a personalized 6-month plan for <strong style={{ color: '#A78BFA' }}>{selectedCareerObj?.label}</strong></p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Roadmap Display ── */}
      <AnimatePresence>
        {roadmap && !loading && (
          <RoadmapDisplay roadmap={roadmap} level={selectedLevel} />
        )}
      </AnimatePresence>

      {/* ── Empty Illustration ── */}
      {!roadmap && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
            {[Target, Code2, Award, Rocket].map((Icon, i) => (
              <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} style={{ color: '#334155' }} />
              </motion.div>
            ))}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', marginBottom: 10 }}>Your Roadmap Awaits</h3>
          <p style={{ color: '#475569', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>
            Select a career goal above and click "Generate My Roadmap" to receive a personalized 6-month learning plan with projects and resources.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CareerRoadmap;
