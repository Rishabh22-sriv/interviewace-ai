const { getGeminiModel } = require('../config/gemini');

/**
 * Generate interview questions using Gemini AI
 */
const generateInterviewQuestions = async ({ type, difficulty, totalQuestions, topic }) => {
  const model = getGeminiModel();

  const typeDescriptions = {
    hr: 'Human Resources / Soft Skills',
    technical: 'Technical / Coding',
    aptitude: 'Aptitude / Logical Reasoning',
    'system-design': 'System Design / Architecture',
    behavioral: 'Behavioral / STAR Method',
  };

  const prompt = `You are an expert interviewer. Generate exactly ${totalQuestions} unique interview questions for a ${difficulty} difficulty ${typeDescriptions[type]} interview${topic ? ` focused on ${topic}` : ''}.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Your interview question here",
    "category": "${type}",
    "difficulty": "${difficulty}",
    "expectedDuration": 120
  }
]

Rules:
- Return ONLY the JSON array, no extra text
- Make questions progressive in difficulty
- Questions must be practical and relevant
- expectedDuration is in seconds (60-300)
- Each question must be unique and insightful`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse AI-generated questions');

  return JSON.parse(jsonMatch[0]);
};

/**
 * Evaluate an interview answer using Gemini AI
 */
const evaluateAnswer = async ({ question, answer, type, difficulty }) => {
  const model = getGeminiModel();

  if (!answer || answer.trim().length < 5) {
    return {
      scores: {
        communication: 0,
        technicalAccuracy: 0,
        confidence: 0,
        grammar: 0,
        overall: 0,
      },
      feedback: {
        strengths: [],
        weaknesses: ['No answer provided'],
        improvements: ['Please provide a detailed answer'],
        sampleAnswer: '',
      },
    };
  }

  const prompt = `You are an expert technical interviewer with 15+ years of experience.

Evaluate the following interview answer and provide detailed feedback.

Interview Type: ${type}
Difficulty: ${difficulty}
Question: ${question}
Candidate's Answer: ${answer}

Provide your evaluation in ONLY this exact JSON format (no extra text):
{
  "scores": {
    "communication": <0-100>,
    "technicalAccuracy": <0-100>,
    "confidence": <0-100>,
    "grammar": <0-100>,
    "overall": <0-100>
  },
  "feedback": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "improvements": ["improvement1", "improvement2"],
    "sampleAnswer": "A comprehensive model answer here..."
  }
}

Scoring Guidelines:
- communication: Clarity, structure, and how well they conveyed their thoughts
- technicalAccuracy: Correctness and depth of technical knowledge
- confidence: Tone, assertiveness, and conviction in the answer
- grammar: Language correctness, vocabulary, and sentence structure
- overall: Holistic assessment

Be honest, constructive, and specific. The overall score should reflect the weighted average.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI evaluation');

  return JSON.parse(jsonMatch[0]);
};

/**
 * Analyze resume using Gemini AI
 */
const analyzeResume = async (resumeText) => {
  const model = getGeminiModel();

  const prompt = `You are an expert HR consultant and ATS (Applicant Tracking System) specialist with 15+ years of experience in talent acquisition.

Analyze the following resume and provide a comprehensive evaluation.

Resume Text:
${resumeText}

Return ONLY this exact JSON format (no extra text):
{
  "atsScore": <0-100>,
  "feedback": {
    "missingSkills": ["skill1", "skill2", "skill3"],
    "grammarIssues": ["issue1", "issue2"],
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "suggestedImprovements": ["improvement1", "improvement2", "improvement3"],
    "recommendedTechnologies": ["tech1", "tech2", "tech3"],
    "recommendedProjects": ["project1", "project2", "project3"],
    "summary": "A brief 2-3 sentence overall assessment of the resume"
  }
}

ATS Score Guidelines:
- 90-100: Excellent, highly ATS-friendly
- 70-89: Good, minor improvements needed
- 50-69: Average, significant improvements needed
- Below 50: Poor, major overhaul required

Be specific, actionable, and constructive in your feedback.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse resume analysis');

  return JSON.parse(jsonMatch[0]);
};

/**
 * Generate a comprehensive interview report summary
 */
const generateInterviewSummary = async (interviewData) => {
  const model = getGeminiModel();

  const prompt = `You are an expert career coach. Based on this interview performance data, provide a brief executive summary.

Interview Type: ${interviewData.type}
Difficulty: ${interviewData.difficulty}
Overall Score: ${interviewData.overallScores.overall}/100
Communication: ${interviewData.overallScores.communication}/100
Technical Accuracy: ${interviewData.overallScores.technicalAccuracy}/100
Confidence: ${interviewData.overallScores.confidence}/100
Grammar: ${interviewData.overallScores.grammar}/100

Return ONLY this JSON:
{
  "executiveSummary": "2-3 sentence overall performance summary",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "priorityImprovements": ["area1", "area2", "area3"],
  "readinessLevel": "Ready / Almost Ready / Needs Practice / Significant Work Needed",
  "nextSteps": ["step1", "step2", "step3"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  return JSON.parse(jsonMatch[0]);
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  analyzeResume,
  generateInterviewSummary,
};
