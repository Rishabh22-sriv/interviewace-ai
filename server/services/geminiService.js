/**
 * InterviewAce AI — Gemini Service v2
 * 
 * ARCHITECTURE: Context-locked AI with domain validation, retry mechanism,
 * structured output enforcement, and anti-hallucination rules.
 * 
 * CORE PRINCIPLE: The user's selected context is the source of truth.
 * AI output is NEVER shown without validation.
 */

const { getGeminiModel } = require('../config/gemini');

// ─────────────────────────────────────────────
// DOMAIN KEYWORD MAPS — for output validation
// ─────────────────────────────────────────────

const TECHNICAL_DOMAINS = {
  html: ['html', 'element', 'tag', 'attribute', 'semantic', 'form', 'dom', 'document', 'meta', 'head', 'body', 'anchor', 'input', 'table', 'div', 'span', 'accessibility', 'html5', 'doctype', 'iframe', 'script', 'link', 'canvas', 'viewport'],
  css: ['css', 'style', 'selector', 'property', 'flexbox', 'grid', 'animation', 'transition', 'responsive', 'media query', 'specificity', 'cascade', 'box model', 'pseudo', 'display', 'position', 'margin', 'padding', 'border', 'color', 'font', 'z-index'],
  javascript: ['javascript', 'js', 'function', 'variable', 'let', 'const', 'var', 'async', 'await', 'promise', 'closure', 'prototype', 'hoisting', 'scope', 'event', 'dom', 'callback', 'arrow function', 'destructuring', 'es6', 'array', 'object', 'class', 'module', 'this'],
  react: ['react', 'component', 'hook', 'usestate', 'useeffect', 'props', 'state', 'jsx', 'virtual dom', 'lifecycle', 'redux', 'context', 'ref', 'usememo', 'usecallback', 'router', 'rendering', 'reconciliation'],
  python: ['python', 'def', 'class', 'list', 'dict', 'tuple', 'set', 'generator', 'decorator', 'lambda', 'comprehension', 'inheritance', 'module', 'exception', 'gil', 'pip', 'virtual environment', 'flask', 'django', 'numpy', 'pandas'],
  java: ['java', 'class', 'interface', 'inheritance', 'polymorphism', 'encapsulation', 'jvm', 'garbage collection', 'collections', 'generics', 'thread', 'exception', 'stream', 'lambda', 'spring', 'maven', 'jdbc', 'serialization'],
  'c++': ['c++', 'pointer', 'reference', 'memory', 'allocation', 'destructor', 'constructor', 'virtual', 'template', 'overloading', 'overriding', 'stl', 'vector', 'map', 'stack', 'queue', 'namespace', 'header'],
  c: ['c language', 'pointer', 'memory', 'malloc', 'free', 'struct', 'array', 'string', 'function', 'recursion', 'header file', 'preprocessor', 'stack', 'linked list', 'bit manipulation'],
  sql: ['sql', 'query', 'select', 'join', 'table', 'database', 'index', 'primary key', 'foreign key', 'normalization', 'transaction', 'group by', 'having', 'aggregate', 'stored procedure', 'view', 'trigger'],
  dsa: ['data structure', 'algorithm', 'array', 'linked list', 'tree', 'graph', 'stack', 'queue', 'sorting', 'searching', 'complexity', 'big o', 'binary search', 'dynamic programming', 'recursion', 'hash', 'heap', 'traversal'],
  dbms: ['database', 'dbms', 'rdbms', 'normalization', 'acid', 'transaction', 'concurrency', 'deadlock', 'indexing', 'query optimization', 'er diagram', 'relational', 'nosql', 'mongodb', 'postgresql'],
  os: ['operating system', 'process', 'thread', 'scheduling', 'memory management', 'paging', 'segmentation', 'deadlock', 'semaphore', 'mutex', 'file system', 'ipc', 'virtual memory', 'cpu', 'context switch', 'fork'],
  cn: ['computer network', 'protocol', 'tcp', 'udp', 'ip', 'http', 'https', 'dns', 'osi', 'layer', 'router', 'switch', 'socket', 'bandwidth', 'latency', 'firewall', 'ssl', 'rest', 'api'],
  'system-design': ['system design', 'scalability', 'load balancer', 'database', 'cache', 'microservice', 'api gateway', 'message queue', 'cdn', 'availability', 'consistency', 'cap theorem', 'partition', 'sharding'],
  nodejs: ['node', 'nodejs', 'event loop', 'npm', 'express', 'middleware', 'module', 'callback', 'async', 'stream', 'buffer', 'fs', 'http', 'websocket', 'cluster'],
  mongodb: ['mongodb', 'document', 'collection', 'bson', 'aggregation', 'index', 'replica', 'sharding', 'query', 'schema', 'mongoose'],
};

// HR/Behavioral domain keywords (for detecting wrong cross-contamination)
const HR_KEYWORDS = ['tell me about yourself', 'strength', 'weakness', 'where do you see yourself', 'salary', 'why do you want', 'work-life balance', 'team conflict', 'greatest achievement'];

// ─────────────────────────────────────────────
// UTILITY: Safe JSON parser
// ─────────────────────────────────────────────

const safeParseJSON = (text) => {
  // Try JSON array first
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]); } catch {}
  }
  // Try JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {}
  }
  // Try removing markdown code blocks
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(clean); } catch {}
  return null;
};

// ─────────────────────────────────────────────
// VALIDATION: Check if question matches domain
// ─────────────────────────────────────────────

const validateQuestionDomain = (question, topic, interviewType) => {
  if (!question || typeof question !== 'string') return false;
  
  const q = question.toLowerCase();
  
  // For HR/Behavioral types — question should NOT be purely technical
  if (interviewType === 'hr' || interviewType === 'behavioral') {
    // HR/behavioral questions are generally fine as long as they are not code-specific
    return question.length > 20;
  }
  
  // For technical type — must match domain keywords
  if (interviewType === 'technical' && topic) {
    const normalizedTopic = topic.toLowerCase().trim();
    const domainKey = Object.keys(TECHNICAL_DOMAINS).find(k => 
      normalizedTopic.includes(k) || k.includes(normalizedTopic)
    );
    
    if (domainKey) {
      const keywords = TECHNICAL_DOMAINS[domainKey];
      const hasKeyword = keywords.some(kw => q.includes(kw));
      
      // Also block obvious HR contamination
      const isHR = HR_KEYWORDS.some(kw => q.includes(kw));
      
      return hasKeyword && !isHR;
    }
    
    // If topic not in our map, just check it's not obviously HR
    const isHR = HR_KEYWORDS.some(kw => q.includes(kw));
    return !isHR;
  }
  
  return question.length > 20; // Basic length check for other types
};

// ─────────────────────────────────────────────
// PROMPT BUILDERS (versioned)
// ─────────────────────────────────────────────

const buildQuestionPrompt_V2 = ({ type, difficulty, totalQuestions, topic, targetRole }) => {
  const typeConfig = {
    hr: {
      label: 'HR / Soft Skills',
      description: 'Focus on personality, culture fit, career goals, work ethics, communication, and teamwork.',
      prohibited: 'Do NOT ask any technical coding or algorithm questions.',
    },
    technical: {
      label: 'Technical',
      description: `Focus EXCLUSIVELY on ${topic} — concepts, implementation, best practices, common pitfalls, and real-world usage.`,
      prohibited: `Do NOT ask HR questions, behavioral questions, "tell me about yourself", strengths/weaknesses, or any topic unrelated to ${topic}.`,
    },
    behavioral: {
      label: 'Behavioral / STAR Method',
      description: 'Focus on past experiences, situational challenges, conflict resolution, leadership, teamwork using STAR method.',
      prohibited: 'Do NOT ask technical coding questions. Ask about real experiences and situations.',
    },
    aptitude: {
      label: 'Aptitude / Logical Reasoning',
      description: `Focus on logical reasoning, problem solving, quantitative aptitude${topic ? `, specifically ${topic}` : ''}.`,
      prohibited: 'Do NOT ask HR or purely technical programming questions.',
    },
    'system-design': {
      label: 'System Design / Architecture',
      description: `Focus on designing scalable systems${topic ? `, specifically ${topic}` : ''}. Cover components, trade-offs, scalability, availability, databases, caching.`,
      prohibited: 'Do NOT ask basic syntax or HR questions.',
    },
  };

  const config = typeConfig[type] || typeConfig.technical;
  const difficultyGuide = {
    easy: `EASY questions: Test basic fundamentals, definitions, and simple concepts. A beginner should be able to answer these.`,
    medium: `MEDIUM questions: Test practical understanding, comparison between concepts, and common real-world scenarios. Intermediate knowledge required.`,
    hard: `HARD questions: Test deep understanding, edge cases, architecture decisions, troubleshooting, and advanced concepts. Senior-level knowledge expected.`,
  };

  return `You are an expert interviewer specialized in ${config.label} interviews with 15+ years of experience.

CONTEXT (DO NOT CHANGE):
- Interview Type: ${type.toUpperCase()}
- Topic/Skill: ${topic || 'General'}
- Difficulty: ${difficulty.toUpperCase()}
- Questions Needed: ${totalQuestions}
${targetRole ? `- Target Role: ${targetRole}` : ''}

INSTRUCTIONS:
${config.description}
${config.prohibited}

${difficultyGuide[difficulty] || difficultyGuide.medium}

Generate EXACTLY ${totalQuestions} questions. Each question MUST be:
1. Directly related to: ${topic || type}
2. At ${difficulty} difficulty level
3. Unique and not repeated
4. Practically useful for a real interview

Return ONLY a valid JSON array. No markdown, no extra text, no explanations:
[
  {
    "id": 1,
    "question": "The exact interview question here",
    "skill": "${topic || type}",
    "type": "${type}",
    "difficulty": "${difficulty}",
    "hint": "A brief hint about what a good answer should cover",
    "expectedConcepts": ["concept1", "concept2", "concept3"]
  }
]`;
};

const buildEvaluationPrompt_V2 = ({ question, answer, type, difficulty, topic, skill, expectedConcepts }) => {
  const isTextBased = true; // Future: detect voice
  
  return `You are an expert technical interviewer evaluating a candidate's answer.

CONTEXT (LOCKED - DO NOT CHANGE):
- Question: "${question}"
- Skill/Topic Being Tested: ${skill || topic || type}
- Interview Type: ${type}
- Difficulty: ${difficulty}
${expectedConcepts?.length ? `- Expected Concepts: ${expectedConcepts.join(', ')}` : ''}

CANDIDATE'S ANSWER:
"${answer}"

EVALUATION RULES:
1. Evaluate ONLY based on the actual question above
2. Technical accuracy must be based on ${skill || topic || type} knowledge specifically
3. For text-based answers: evaluate Clarity, Technical Accuracy, Relevance, Completeness, Structure
4. Do NOT evaluate "voice confidence" or "speaking tone" — this is text input
5. The sampleAnswer must directly answer THIS specific question
6. Feedback must reference the actual answer content
7. Be honest — do not inflate scores for short or incorrect answers

SCORING (0-100 for each):
- communication: How clearly and structuredly they expressed their answer
- technicalAccuracy: How technically correct and complete the answer is for ${skill || topic || type}
- relevance: How directly they answered THIS specific question (not generic padding)
- completeness: Whether they covered the key concepts expected

Return ONLY this exact JSON (no extra text):
{
  "scores": {
    "communication": <0-100>,
    "technicalAccuracy": <0-100>,
    "relevance": <0-100>,
    "completeness": <0-100>,
    "overall": <weighted average>
  },
  "feedback": {
    "strengths": ["specific strength 1 based on their actual answer", "specific strength 2"],
    "weaknesses": ["specific gap 1 related to ${skill || topic}", "specific gap 2"],
    "improvements": ["specific actionable suggestion 1", "suggestion 2"],
    "missingConcepts": ["concept they missed", "another missed concept"],
    "sampleAnswer": "A complete, accurate model answer specifically for: '${question.slice(0, 100)}...'"
  }
}`;
};

const buildResumePrompt_V2 = (resumeText) => {
  return `You are an expert HR consultant and ATS specialist analyzing a resume.

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY report skills, experiences, projects, and achievements that are EXPLICITLY mentioned in the resume text below
2. NEVER invent or assume skills that are not written in the resume
3. NEVER claim the person has experience they do not have
4. If something is missing, say it is missing — do not fabricate it
5. Base ALL feedback strictly on what is actually written below

RESUME TEXT TO ANALYZE:
---
${resumeText}
---

Analyze the above resume text and return ONLY this exact JSON (no extra text):
{
  "atsScore": <0-100 based on ATS friendliness>,
  "verifiedSkills": ["skill1 ACTUALLY in resume", "skill2 ACTUALLY in resume"],
  "verifiedExperience": ["experience ACTUALLY in resume"],
  "verifiedProjects": ["project ACTUALLY in resume"],
  "verifiedEducation": "education ACTUALLY in resume",
  "feedback": {
    "strengths": ["strength based on ACTUAL resume content"],
    "weaknesses": ["weakness identified from ACTUAL resume content"],
    "missingSkills": ["skill NOT in resume but recommended for the field"],
    "suggestedImprovements": ["specific, actionable improvement"],
    "grammarIssues": ["specific grammar/formatting issue if found"],
    "summary": "2-3 sentence assessment based ONLY on actual resume content"
  },
  "atsIssues": ["specific ATS formatting problem found"],
  "keywordGaps": ["important keyword NOT present in resume"]
}

ATS Score Guidelines:
- 85-100: Excellent ATS optimization
- 70-84: Good, minor improvements needed  
- 50-69: Average, needs work
- Below 50: Poor ATS formatting`;
};

// ─────────────────────────────────────────────
// RETRY ENGINE
// ─────────────────────────────────────────────

const callWithRetry = async (fn, validateFn, maxRetries = 2, context = '') => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await fn();
      const validation = validateFn(result);
      
      if (validation.valid) {
        if (attempt > 1) {
          console.log(`[AI] ${context} passed on attempt ${attempt}`);
        }
        return result;
      }
      
      console.warn(`[AI] ${context} failed validation (attempt ${attempt}): ${validation.reason}`);
      lastError = new Error(`Validation failed: ${validation.reason}`);
    } catch (err) {
      console.error(`[AI] ${context} error (attempt ${attempt}):`, err.message);
      lastError = err;
    }
  }
  
  throw lastError || new Error(`Failed after ${maxRetries + 1} attempts`);
};

// ─────────────────────────────────────────────
// MAIN FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Generate interview questions — context-locked, validated, with retry
 */
const generateInterviewQuestions = async ({ type, difficulty, totalQuestions, topic, targetRole }) => {
  const model = getGeminiModel();
  const count = parseInt(totalQuestions) || 5;
  
  // Context normalization
  const ctx = {
    type: (type || 'technical').toLowerCase().trim(),
    difficulty: (difficulty || 'medium').toLowerCase().trim(),
    totalQuestions: count,
    topic: topic ? topic.trim() : '',
    targetRole: targetRole || '',
  };

  console.log(`[AI][generateInterviewQuestions] Context:`, ctx);

  const prompt = buildQuestionPrompt_V2(ctx);
  
  const generateFn = async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeParseJSON(text);
    
    if (!parsed || !Array.isArray(parsed)) {
      throw new Error('AI did not return a valid JSON array');
    }
    
    return parsed;
  };
  
  const validateFn = (questions) => {
    if (!Array.isArray(questions) || questions.length === 0) {
      return { valid: false, reason: 'Empty or invalid question array' };
    }
    
    // Check each question has required fields
    for (const q of questions) {
      if (!q.question || typeof q.question !== 'string' || q.question.length < 15) {
        return { valid: false, reason: `Question too short or missing: ${JSON.stringify(q)}` };
      }
    }
    
    // For technical with specific topic, validate domain match
    if (ctx.type === 'technical' && ctx.topic) {
      const invalidQuestions = questions.filter(q => !validateQuestionDomain(q.question, ctx.topic, ctx.type));
      if (invalidQuestions.length > questions.length * 0.3) {
        return { valid: false, reason: `${invalidQuestions.length} questions don't match domain "${ctx.topic}"` };
      }
    }
    
    return { valid: true };
  };
  
  try {
    const questions = await callWithRetry(generateFn, validateFn, 2, `question generation [${ctx.type}/${ctx.topic}/${ctx.difficulty}]`);
    
    // Normalize output structure
    return questions.slice(0, count).map((q, i) => ({
      id: i + 1,
      question: q.question.trim(),
      skill: q.skill || ctx.topic || ctx.type,
      type: ctx.type,
      difficulty: ctx.difficulty,
      hint: q.hint || '',
      expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts : [],
    }));
    
  } catch (err) {
    console.error('[AI] Question generation failed after retries:', err.message);
    throw new Error('Unable to generate reliable interview questions for the selected topic. Please try again.');
  }
};

/**
 * Evaluate an interview answer — question-specific, honest scoring
 */
const evaluateAnswer = async ({ question, answer, type, difficulty, topic, skill, expectedConcepts }) => {
  const model = getGeminiModel();

  if (!answer || answer.trim().length < 5) {
    return {
      scores: { communication: 0, technicalAccuracy: 0, relevance: 0, completeness: 0, overall: 0 },
      feedback: {
        strengths: [],
        weaknesses: ['No meaningful answer was provided'],
        improvements: ['Please provide a detailed answer to receive proper feedback'],
        missingConcepts: [],
        sampleAnswer: '',
      },
    };
  }

  const ctx = {
    question: question.trim(),
    answer: answer.trim(),
    type: (type || 'technical').toLowerCase(),
    difficulty: (difficulty || 'medium').toLowerCase(),
    topic: topic || '',
    skill: skill || topic || type,
    expectedConcepts: expectedConcepts || [],
  };

  console.log(`[AI][evaluateAnswer] Evaluating answer for: "${ctx.question.slice(0, 50)}..."`);

  const prompt = buildEvaluationPrompt_V2(ctx);
  
  const generateFn = async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeParseJSON(text);
    if (!parsed || !parsed.scores) throw new Error('Invalid evaluation response structure');
    return parsed;
  };
  
  const validateFn = (evaluation) => {
    if (!evaluation.scores) return { valid: false, reason: 'Missing scores object' };
    const { communication, technicalAccuracy, relevance, completeness, overall } = evaluation.scores;
    
    // All scores must be numbers 0-100
    const scores = [communication, technicalAccuracy, relevance, completeness, overall];
    if (scores.some(s => typeof s !== 'number' || s < 0 || s > 100)) {
      return { valid: false, reason: 'Scores out of valid range' };
    }
    
    if (!evaluation.feedback?.sampleAnswer || evaluation.feedback.sampleAnswer.length < 20) {
      return { valid: false, reason: 'Missing or too-short sample answer' };
    }
    
    // Check sampleAnswer is question-specific (not completely generic)
    const genericPhrases = ['a strong answer would', 'generally speaking', 'this is a broad topic'];
    const sample = evaluation.feedback.sampleAnswer.toLowerCase();
    if (genericPhrases.some(p => sample.startsWith(p))) {
      return { valid: false, reason: 'Sample answer is too generic' };
    }
    
    return { valid: true };
  };
  
  try {
    const evaluation = await callWithRetry(generateFn, validateFn, 2, `evaluation [${ctx.type}/${ctx.skill}]`);
    
    // Normalize — also keep backward compat with old 'confidence' field name
    const scores = evaluation.scores;
    const normalizedOverall = Math.round(
      (scores.communication * 0.25 + scores.technicalAccuracy * 0.40 + 
       scores.relevance * 0.20 + scores.completeness * 0.15)
    );
    
    return {
      scores: {
        communication: Math.round(scores.communication),
        technicalAccuracy: Math.round(scores.technicalAccuracy),
        confidence: Math.round(scores.relevance), // backward compat alias
        grammar: Math.round(scores.completeness), // backward compat alias
        relevance: Math.round(scores.relevance),
        completeness: Math.round(scores.completeness),
        overall: Math.round(scores.overall || normalizedOverall),
      },
      feedback: {
        strengths: evaluation.feedback.strengths || [],
        weaknesses: evaluation.feedback.weaknesses || [],
        improvements: evaluation.feedback.improvements || [],
        missingConcepts: evaluation.feedback.missingConcepts || [],
        sampleAnswer: evaluation.feedback.sampleAnswer || '',
      },
    };
    
  } catch (err) {
    console.error('[AI] Evaluation failed after retries:', err.message);
    throw new Error('Unable to evaluate answer at this time. Please try again.');
  }
};

/**
 * Analyze resume — strict anti-hallucination, no invented content
 */
const analyzeResume = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short to analyze. Please upload a valid resume.');
  }
  
  const model = getGeminiModel();
  const prompt = buildResumePrompt_V2(resumeText);
  
  const generateFn = async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeParseJSON(text);
    if (!parsed || typeof parsed.atsScore === 'undefined') {
      throw new Error('Invalid resume analysis response');
    }
    return parsed;
  };
  
  const validateFn = (analysis) => {
    if (typeof analysis.atsScore !== 'number' || analysis.atsScore < 0 || analysis.atsScore > 100) {
      return { valid: false, reason: 'Invalid ATS score' };
    }
    if (!analysis.feedback?.summary) {
      return { valid: false, reason: 'Missing feedback summary' };
    }
    return { valid: true };
  };
  
  try {
    return await callWithRetry(generateFn, validateFn, 2, 'resume analysis');
  } catch (err) {
    console.error('[AI] Resume analysis failed:', err.message);
    throw new Error('Unable to analyze resume at this time. Please try again.');
  }
};

/**
 * Generate interview summary report
 */
const generateInterviewSummary = async (interviewData) => {
  const model = getGeminiModel();

  const prompt = `You are an expert career coach providing post-interview feedback.

Interview Data:
- Type: ${interviewData.type}
- Topic/Skill: ${interviewData.topic || 'General'}
- Difficulty: ${interviewData.difficulty}
- Overall Score: ${interviewData.overallScores?.overall || 0}/100
- Communication: ${interviewData.overallScores?.communication || 0}/100
- Technical Accuracy: ${interviewData.overallScores?.technicalAccuracy || 0}/100
- Relevance: ${interviewData.overallScores?.confidence || 0}/100
- Completeness: ${interviewData.overallScores?.grammar || 0}/100

Based on these ACTUAL scores, provide an honest assessment.
Do NOT fabricate achievements or inflate performance.

Return ONLY this JSON:
{
  "executiveSummary": "2-3 sentences describing actual performance based on the scores above",
  "topStrengths": ["strength 1 based on score data", "strength 2", "strength 3"],
  "priorityImprovements": ["area needing work 1", "area 2", "area 3"],
  "readinessLevel": "Ready / Almost Ready / Needs Practice / Significant Work Needed",
  "nextSteps": ["specific actionable step 1", "step 2", "step 3"]
}

readinessLevel guide: Score 80+="Ready", 65-79="Almost Ready", 45-64="Needs Practice", <45="Significant Work Needed"`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeParseJSON(text);
    if (!parsed) return null;
    
    // Enforce readiness level based on actual score (don't let AI override)
    const score = interviewData.overallScores?.overall || 0;
    const readinessMap = [
      [80, 'Ready'],
      [65, 'Almost Ready'],
      [45, 'Needs Practice'],
      [0, 'Significant Work Needed'],
    ];
    const calculatedReadiness = readinessMap.find(([threshold]) => score >= threshold)?.[1] || 'Significant Work Needed';
    parsed.readinessLevel = calculatedReadiness; // Programmatic override
    
    return parsed;
  } catch (err) {
    console.error('[AI] Summary generation failed:', err.message);
    return null; // Summary is optional — don't fail the interview
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  analyzeResume,
  generateInterviewSummary,
};
