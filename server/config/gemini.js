const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let mockMode = false;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey.includes('your_gemini_api_key_here') || apiKey.trim() === '') {
  console.log('⚠️  Using placeholder/empty GEMINI_API_KEY. Mock AI fallbacks will be used for testing.');
  mockMode = true;
} else {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('❌ Error initializing Gemini API:', err.message);
    console.log('⚠️  Falling back to Mock AI.');
    mockMode = true;
  }
}

// Mock Gemini generator to mimic Google AI response formatting
const getMockGeminiModel = () => {
  return {
    generateContent: async (prompt) => {
      console.log('✨ [Mock AI] Generating response for prompt...');
      let responseText = '';

      if (prompt.includes('unique interview questions')) {
        // Generate questions
        const totalQuestionsMatch = prompt.match(/exactly (\d+)/);
        const totalQuestions = totalQuestionsMatch ? parseInt(totalQuestionsMatch[1], 10) : 3;
        
        let difficulty = 'Medium';
        if (prompt.includes('easy') || prompt.includes('Easy')) difficulty = 'Easy';
        if (prompt.includes('hard') || prompt.includes('Hard')) difficulty = 'Hard';

        let category = 'technical';
        if (prompt.includes('Human Resources')) category = 'hr';
        if (prompt.includes('Aptitude')) category = 'aptitude';
        if (prompt.includes('System Design')) category = 'system-design';
        if (prompt.includes('Behavioral')) category = 'behavioral';

        const mockQuestions = [];
        const questionPool = {
          hr: [
            "Tell me about a time you had to deal with a difficult team member.",
            "Why do you want to join our company, and what value can you bring?",
            "Where do you see yourself in five years?",
            "Describe your ideal work environment.",
            "How do you manage stress and tight deadlines?"
          ],
          technical: [
            "Explain the difference between Virtual DOM and Real DOM in React.",
            "What is a closure in JavaScript, and when would you use it?",
            "How do indexes speed up database queries, and what are their drawbacks?",
            "What are the different HTTP methods, and when should you use PUT vs PATCH?",
            "What is Event Delegation in Javascript and how does it work?"
          ],
          aptitude: [
            "If a clock strikes 6 times in 5 seconds, how long will it take to strike 12 times?",
            "A train 120m long passes a post in 10s. What is its speed in km/h?",
            "Five years ago, a father was 3 times as old as his son. If their combined age now is 50, how old are they?",
            "Determine the next number in the sequence: 2, 6, 12, 20, 30, ...",
            "A shopkeeper offers 20% discount and still makes 10% profit. What is the cost price if list price is $110?"
          ],
          'system-design': [
            "How would you design a URL shortening service like Bitly?",
            "Explain how you would handle scaling a real-time chat application to millions of users.",
            "Design a rate limiter for an API backend.",
            "How would you design a notification service that sends SMS, Email, and Push notifications?",
            "Design a database schema for an e-commerce platform with fast search capability."
          ],
          behavioral: [
            "Tell me about a time you failed to meet a goal and how you handled it.",
            "Describe a situation where you had to make a decision without all the information you needed.",
            "How do you prioritize your tasks when you have multiple competing deadlines?",
            "Tell me about a time you went above and beyond for a project or client.",
            "Describe a time when you successfully resolved a conflict within your team."
          ]
        };

        const pool = questionPool[category] || questionPool.technical;
        for (let i = 0; i < totalQuestions; i++) {
          mockQuestions.push({
            id: i + 1,
            question: pool[i % pool.length],
            category: category,
            difficulty: difficulty,
            expectedDuration: 120
          });
        }
        responseText = JSON.stringify(mockQuestions);

      } else if (prompt.includes('Evaluate the following interview answer')) {
        // Evaluate answer
        responseText = JSON.stringify({
          scores: {
            communication: 85,
            technicalAccuracy: 80,
            confidence: 90,
            grammar: 88,
            overall: 86
          },
          feedback: {
            strengths: [
              "Well structured explanation with clear definitions.",
              "Demonstrated confident tone and logical flow."
            ],
            weaknesses: [
              "Could benefit from sharing a brief real-world example to back up the answer.",
              "Slightly brief in the technical implementation details."
            ],
            improvements: [
              "Try to follow the STAR method (Situation, Task, Action, Result) for behavioral questions.",
              "Explicitly mention edge-cases or efficiency trade-offs where applicable."
            ],
            sampleAnswer: "A high-quality response would outline the concept clearly, define key terms, provide a code snippet or architectural diagram, and highlight the performance benefits and design trade-offs of the approach."
          }
        });

      } else if (prompt.includes('Analyze the following resume')) {
        // Analyze resume
        responseText = JSON.stringify({
          atsScore: 78,
          feedback: {
            missingSkills: ["Docker", "CI/CD (GitHub Actions)", "TypeScript"],
            grammarIssues: ["Used passive voice in 2 project descriptions", "Consistent bullet-point punctuation needed"],
            strengths: [
              "Clear, clean format with easily scannable sections.",
              "Strong technical project section with measurable impact statements.",
              "Good coverage of core frontend (React, JavaScript, Tailwind) technologies."
            ],
            weaknesses: [
              "Lacks metrics or quantitative evidence of impact (e.g., % improvement in speed, user retention).",
              "The summary section could be more tailored to specific roles.",
              "Limited backend/devops tools mentioned."
            ],
            suggestedImprovements: [
              "Rephrase bullet points to start with strong action verbs (e.g., 'Engineered', 'Optimized', 'Designed').",
              "Incorporate statistics like 'reduced API latency by 30%' or 'increased user engagement by 15%'.",
              "Add a dedicated Skills matrix categorized by languages, frameworks, and tools."
            ],
            recommendedTechnologies: ["TypeScript", "Next.js", "Docker", "Jest/Cypress"],
            recommendedProjects: [
              "Build a serverless REST API using Node.js and AWS Lambda to demonstrate cloud knowledge.",
              "Implement an end-to-end testing suite for an existing application to showcase testing proficiency."
            ],
            summary: "This resume showcases a solid foundation in modern web development with concrete projects. Tailoring details with metrics and adding modern cloud/testing tools will make it highly competitive for senior roles."
          }
        });

      } else if (prompt.includes('Based on this interview performance data') || prompt.includes('based on this interview performance data')) {
        // Interview summary
        responseText = JSON.stringify({
          executiveSummary: "The candidate demonstrated solid conceptual understanding and clear communication. With additional technical depth and structured practice, they will be fully prepared.",
          topStrengths: [
            "Excellent clarity and structured layout of explanations.",
            "High confidence and steady tone throughout the session.",
            "Strong vocabulary and grammar."
          ],
          priorityImprovements: [
            "Incorporate more technical details and specific examples.",
            "Discuss potential edge-cases and performance optimizations.",
            "Practice answering under tighter time constraints."
          ],
          readinessLevel: "Almost Ready",
          nextSteps: [
            "Review core data structures and algorithms concepts.",
            "Conduct another mock interview focused specifically on technical questions.",
            "Analyze the sample answers generated in the report to align definitions."
          ]
        });
      } else {
        responseText = "{}";
      }

      return {
        response: {
          text: () => responseText
        }
      };
    }
  };
};

const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (mockMode) {
    return getMockGeminiModel();
  }
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getGeminiModel };

