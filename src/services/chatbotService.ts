import { GovernmentPolicy } from './policyService';
import { generateWelfareSummary, WelfareCategory, ImpactLevel, PolicyConclusion } from '../data/policyConclusions';
import { generateMLResponse, enhancePolicyConclusion } from './mlService';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface ConversationContext {
  lastPolicyId?: string;
  lastCategory?: string;
  lastWelfareCategory?: WelfareCategory;
  lastImpactLevel?: ImpactLevel;
  lastQuestionType?: string;
  previousQuestions: string[];
  mlConfidence?: number;
}

const policyKeywords = {
  infrastructure: ['infrastructure', 'roads', 'bridges', 'transportation', 'construction'],
  healthcare: ['health', 'medical', 'healthcare', 'medicare', 'insurance'],
  education: ['education', 'school', 'university', 'student', 'college'],
  climate: ['climate', 'environment', 'green', 'renewable', 'energy'],
  economy: ['economy', 'economic', 'stimulus', 'business', 'jobs'],
  smallBusiness: ['small business', 'entrepreneur', 'startup', 'business support'],
  housing: ['housing', 'rent', 'mortgage', 'home', 'apartment'],
  social: ['social', 'welfare', 'benefits', 'assistance', 'support'],
};

// Welfare-focused keywords
const welfareKeywords = [
  'benefit', 'welfare', 'impact', 'citizen', 'people', 'public', 
  'help', 'assist', 'support', 'improve', 'enhance', 'protect',
  'recommendation', 'suggestion', 'advice', 'guidance', 'what should i do',
  'how will this affect me', 'what does this mean for me', 'how can i benefit',
  'what can i do', 'how to apply', 'how to get help', 'eligibility',
  'timeline', 'when', 'implementation', 'rollout', 'schedule'
];

// Question types for better context understanding
const questionTypes = {
  what: ['what', 'which', 'where', 'who'],
  how: ['how', 'why', 'when'],
  is: ['is', 'are', 'do', 'does', 'can', 'could', 'would', 'should'],
  tell: ['tell', 'explain', 'describe', 'summarize', 'give', 'show', 'provide'],
  compare: ['compare', 'difference', 'versus', 'vs', 'against', 'better', 'worse'],
  more: ['more', 'additional', 'another', 'other', 'else', 'further', 'extra'],
  specific: ['specific', 'exactly', 'precisely', 'detail', 'details', 'specifics'],
};

// Function to detect question type
function detectQuestionType(message: string): string | undefined {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(questionTypes)) {
    if (keywords.some(keyword => lowerMessage.startsWith(keyword))) {
      return type;
    }
  }
  
  return undefined;
}

// Function to extract policy ID from message
function extractPolicyId(message: string, policies: GovernmentPolicy[]): string | undefined {
  const lowerMessage = message.toLowerCase();
  
  // Check for policy titles
  for (const policy of policies) {
    if (lowerMessage.includes(policy.title.toLowerCase())) {
      return policy.id;
    }
  }
  
  // Check for bill numbers
  for (const policy of policies) {
    if (policy.billNumber && lowerMessage.includes(policy.billNumber)) {
      return policy.id;
    }
  }
  
  return undefined;
}

// Function to extract welfare category from message
function extractWelfareCategory(message: string): WelfareCategory | undefined {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, keywords] of Object.entries(policyKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return category as WelfareCategory;
    }
  }
  
  return undefined;
}

// Function to generate follow-up response based on context
async function generateFollowUpResponse(
  message: string, 
  context: ConversationContext, 
  policies: GovernmentPolicy[]
): Promise<string> {
  // If we have a previous policy context, enhance it with ML insights
  if (context.lastPolicyId) {
    const policy = policies.find(p => p.id === context.lastPolicyId);
    if (policy) {
      const enhancedConclusion = await enhancePolicyConclusion(context.lastPolicyId, message);
      if (enhancedConclusion) {
        return generateWelfareSummary(policy, enhancedConclusion);
      }
    }
  }
  
  // Fallback to rule-based response if ML enhancement fails
  return "I'm not sure what specific information you're looking for. Could you please rephrase your question?";
}

export const generateBotResponse = async (
  message: string, 
  policies: GovernmentPolicy[],
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    // Create conversation context from history
    const context: ConversationContext = {
      previousQuestions: conversationHistory
        .filter(msg => msg.isUser)
        .map(msg => msg.text),
      lastQuestionType: detectQuestionType(message)
    };
    
    // Extract policy ID if present
    const policyId = extractPolicyId(message, policies);
    if (policyId) {
      context.lastPolicyId = policyId;
    }
    
    // Generate ML-enhanced response
    const mlResponse = await generateMLResponse(
      message,
      policies,
      conversationHistory.map(msg => ({ text: msg.text, isUser: msg.isUser }))
    );
    
    // Update context with ML confidence
    context.mlConfidence = mlResponse.confidence;
    
    // If ML confidence is high, use ML response
    if (mlResponse.confidence > 0.7) {
      // If we have relevant policies, enhance the response
      if (mlResponse.policyIds.length > 0) {
        const enhancedPolicies = await Promise.all(
          mlResponse.policyIds.map(async (id) => {
            const policy = policies.find(p => p.id === id);
            if (policy) {
              const enhancedConclusion = await enhancePolicyConclusion(id, message);
              return { policy, enhancedConclusion: enhancedConclusion || undefined };
            }
            return null;
          })
        );
        
        const validPolicies = enhancedPolicies.filter(p => p !== null);
        if (validPolicies.length > 0) {
          return mlResponse.answer + "\n\n" + 
            validPolicies.map(({ policy, enhancedConclusion }) => 
              generateWelfareSummary(policy, enhancedConclusion)
            ).join("\n\n");
        }
      }
      
      return mlResponse.answer;
    }
    
    // Fallback to rule-based response if ML confidence is low
    // Check for follow-up questions if we have conversation history
    if (conversationHistory.length > 0) {
      const followUpResponse = await generateFollowUpResponse(message, context, policies);
      if (followUpResponse !== "I'm not sure what specific information you're looking for. Could you please rephrase your question?") {
        return followUpResponse;
      }
    }
    
    // Check for greetings
    if (message.toLowerCase().includes('hello') || 
        message.toLowerCase().includes('hi') || 
        message.toLowerCase().includes('hey')) {
      return "Hello! I'm your policy assistant. I can help you understand how government policies affect citizen welfare. How can I help you today?";
    }
    
    // Check for help requests
    if (message.toLowerCase().includes('help') || 
        message.toLowerCase().includes('what can you do')) {
      return "I can help you understand how government policies affect citizen welfare. You can ask me about:\n\n" +
             "- Policy benefits and impacts on citizens\n" +
             "- Implementation timelines and recommendations\n" +
             "- Specific policy categories (infrastructure, healthcare, education, etc.)\n" +
             "- How to take advantage of policy benefits\n\n" +
             "What would you like to know?";
    }
    
    // Default response
    return "I'm not sure I understand. You can ask me about specific policy categories like infrastructure, healthcare, education, climate change, economic policies, or small business support. Or ask 'help' for more information.";
  } catch (error) {
    console.error('Error generating bot response:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
  }
}; 