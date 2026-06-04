const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let mockMode = false;

const apiKey = process.env.GEMINI_API_KEY;

// Use mock AI if key is missing, placeholder, or invalid format (AQ. prefix = wrong key type)
if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key') || apiKey.startsWith('AQ.')) {
  console.log('⚠️  Mock AI mode: Using built-in AI responses.');
  mockMode = true;
} else {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini AI initialized.');
  } catch (err) {
    console.error('❌ Gemini init error:', err.message);
    mockMode = true;
  }
}

// ─── Mock AI (fully functional pre-built responses) ───────────────────────────
const getMockGeminiModel = () => {
  return {
    generateContent: async (prompt) => {
      let responseText = '';

      if (prompt.includes('unique interview questions')) {
        const totalQuestionsMatch = prompt.match(/exactly (\d+)/);
        const totalQuestions = totalQuestionsMatch ? parseInt(totalQuestionsMatch[1], 10) : 5;

        let difficulty = 'Medium';
        if (prompt.toLowerCase().includes('easy')) difficulty = 'Easy';
        if (prompt.toLowerCase().includes('hard')) difficulty = 'Hard';

        let category = 'technical';
        if (prompt.includes('Human Resources')) category = 'hr';
        if (prompt.includes('Aptitude')) category = 'aptitude';
        if (prompt.includes('System Design')) category = 'system-design';
        if (prompt.includes('Behavioral')) category = 'behavioral';

        const questionPool = {
          hr: [
            "Tell me about yourself and your professional journey so far.",
            "Why do you want to work here, and what can you contribute?",
            "Where do you see yourself in 5 years?",
            "How do you handle conflicts with team members?",
            "Describe your greatest professional achievement.",
            "What is your biggest weakness, and how are you addressing it?",
            "How do you manage multiple priorities and deadlines?",
          ],
          technical: [
            "Explain the difference between REST and GraphQL APIs.",
            "What is the Virtual DOM in React, and why is it beneficial?",
            "How does JavaScript's event loop work?",
            "What are closures in JavaScript? Give an example.",
            "Explain the difference between SQL and NoSQL databases.",
            "What is Big O notation, and why does it matter?",
            "How do you handle asynchronous operations in JavaScript?",
          ],
          aptitude: [
            "A train 120m long passes a pole in 10 seconds. What is its speed in km/h?",
            "If a clock strikes 6 times in 5 seconds, how long will it take to strike 12 times?",
            "Find the next number in the series: 2, 6, 12, 20, 30, ?",
            "A shopkeeper marks up 25% and gives 10% discount. What is the net profit %?",
            "Two pipes fill a tank in 12 and 15 hours. How long together?",
          ],
          'system-design': [
            "How would you design a URL shortener like Bitly?",
            "Design a scalable real-time chat application like WhatsApp.",
            "How would you build a rate limiter for an API?",
            "Design a notification system (push, email, SMS) for millions of users.",
            "How would you design Twitter's trending topics feature?",
          ],
          behavioral: [
            "Tell me about a time you failed and what you learned.",
            "Describe a situation where you had to lead without authority.",
            "Tell me about a time you disagreed with your manager.",
            "Describe a time you went above and beyond for a project.",
            "Tell me about a time you had to make a decision with incomplete data.",
          ],
        };

        const pool = questionPool[category] || questionPool.technical;
        const questions = [];
        for (let i = 0; i < totalQuestions; i++) {
          questions.push({
            id: i + 1,
            question: pool[i % pool.length],
            category,
            difficulty,
            expectedDuration: 120,
          });
        }
        responseText = JSON.stringify(questions);

      } else if (prompt.includes('Evaluate the following interview answer')) {
        responseText = JSON.stringify({
          scores: {
            communication: Math.floor(Math.random() * 20) + 75,
            technicalAccuracy: Math.floor(Math.random() * 20) + 70,
            confidence: Math.floor(Math.random() * 20) + 75,
            grammar: Math.floor(Math.random() * 15) + 80,
            overall: Math.floor(Math.random() * 20) + 72,
          },
          feedback: {
            strengths: [
              "Clear and structured explanation with good logical flow.",
              "Confident delivery with appropriate vocabulary.",
              "Demonstrated understanding of core concepts.",
            ],
            weaknesses: [
              "Could include more specific real-world examples.",
              "Some technical details could be elaborated further.",
            ],
            improvements: [
              "Use the STAR method (Situation, Task, Action, Result) for behavioral answers.",
              "Quantify your achievements where possible (e.g., 'improved performance by 30%').",
              "Practice concise answers within 2 minutes for better interview flow.",
            ],
            sampleAnswer:
              "A strong answer would clearly define the concept, provide a practical example, discuss trade-offs or edge cases, and conclude with how it applies in real-world scenarios.",
          },
        });

      } else if (prompt.includes('Analyze the following resume') || prompt.includes('resume')) {
        responseText = JSON.stringify({
          atsScore: Math.floor(Math.random() * 15) + 72,
          feedback: {
            missingSkills: ["Docker", "CI/CD (GitHub Actions)", "TypeScript", "AWS/Cloud basics"],
            grammarIssues: [
              "Use consistent tense (past tense for previous roles)",
              "Avoid passive voice in project descriptions",
            ],
            strengths: [
              "Clean, well-organized format that is easy to scan.",
              "Good coverage of core technical skills.",
              "Projects section demonstrates hands-on experience.",
            ],
            weaknesses: [
              "Lacks quantifiable impact metrics (e.g., % improvements, user numbers).",
              "Summary/objective section could be more role-specific.",
              "Limited exposure to cloud or DevOps tools visible.",
            ],
            suggestedImprovements: [
              "Start every bullet with a strong action verb (Engineered, Designed, Optimized).",
              "Add metrics: 'Reduced load time by 40%' beats 'improved performance'.",
              "Tailor your resume for each job description using relevant keywords.",
            ],
            recommendedTechnologies: ["TypeScript", "Docker", "Jest", "Next.js", "AWS"],
            recommendedProjects: [
              "Build a full-stack app with authentication and deploy it on AWS/Vercel.",
              "Contribute to an open-source project to showcase collaboration skills.",
            ],
            summary:
              "This resume shows a solid foundation in modern web development. Adding measurable achievements and cloud/DevOps exposure will significantly boost your ATS score and recruiter interest.",
          },
        });

      } else if (prompt.includes('interview performance data')) {
        responseText = JSON.stringify({
          executiveSummary:
            "The candidate demonstrated strong communication and a solid conceptual grasp of the subject matter. With focused technical depth and structured practice, they are on track to excel in real interviews.",
          topStrengths: [
            "Excellent clarity and structured delivery of answers.",
            "Strong confidence and professional tone throughout.",
            "Good grasp of foundational concepts.",
          ],
          priorityImprovements: [
            "Add technical depth with specific implementation details.",
            "Practice time management — aim for 90-second answers.",
            "Incorporate real-world examples and metrics in responses.",
          ],
          readinessLevel: "Almost Ready",
          nextSteps: [
            "Review core data structures, algorithms, and system design patterns.",
            "Take 2-3 more mock interviews across different types.",
            "Study the sample answers in this report and compare your responses.",
          ],
        });
      } else {
        responseText = '{}';
      }

      return { response: { text: () => responseText } };
    },
  };
};

// ─── Get Model (real or mock) ─────────────────────────────────────────────────
const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (mockMode || !genAI) {
    return getMockGeminiModel();
  }
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    console.error('Model error, using mock:', err.message);
    return getMockGeminiModel();
  }
};

module.exports = { genAI, getGeminiModel };
