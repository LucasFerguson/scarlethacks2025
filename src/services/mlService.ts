import { GovernmentPolicy } from './policyService';
import { PolicyConclusion, policyConclusions } from '../data/policyConclusions';

// Interface for ML model response
interface MLResponse {
  answer: string;
  confidence: number;
  policyIds: string[];
  welfareCategories: string[];
}

// Interface for policy analysis
interface PolicyAnalysis {
  relevance: number;
  welfareImpact: number;
  implementationComplexity: number;
}

// Function to analyze policy relevance using ML
async function analyzePolicyRelevance(
  query: string,
  policy: GovernmentPolicy
): Promise<PolicyAnalysis> {
  try {
    // Call to ML model API for policy analysis
    const response = await fetch('https://gta-backend.onrender.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        policy: {
          title: policy.title,
          description: policy.description,
          category: policy.category,
          status: policy.status,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze policy');
    }

    const data = await response.json();
    return {
      relevance: data.relevance || 0,
      welfareImpact: data.welfareImpact || 0,
      implementationComplexity: data.implementationComplexity || 0,
    };
  } catch (error) {
    console.error('Error analyzing policy:', error);
    return {
      relevance: 0,
      welfareImpact: 0,
      implementationComplexity: 0,
    };
  }
}

// Function to generate ML-enhanced response
export async function generateMLResponse(
  query: string,
  policies: GovernmentPolicy[],
  conversationHistory: { text: string; isUser: boolean }[] = []
): Promise<MLResponse> {
  try {
    // Prepare conversation context
    const context = conversationHistory
      .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    // Call to ML model API for response generation
    const response = await fetch('https://gta-backend.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        context,
        policies: policies.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    
    // Analyze relevant policies
    const relevantPolicies = await Promise.all(
      policies.map(async (policy) => {
        const analysis = await analyzePolicyRelevance(query, policy);
        return {
          policy,
          analysis,
        };
      })
    );

    // Sort policies by relevance
    const sortedPolicies = relevantPolicies
      .sort((a, b) => b.analysis.relevance - a.analysis.relevance)
      .filter(p => p.analysis.relevance > 0.3); // Filter out low relevance policies

    // Extract welfare categories from relevant policies
    const welfareCategories = new Set<string>();
    sortedPolicies.forEach(({ policy }) => {
      const conclusion = policyConclusions[policy.id];
      if (conclusion) {
        conclusion.welfareCategories.forEach(cat => welfareCategories.add(cat));
      }
    });

    return {
      answer: data.answer,
      confidence: data.confidence || 0.8,
      policyIds: sortedPolicies.map(p => p.policy.id),
      welfareCategories: Array.from(welfareCategories),
    };
  } catch (error) {
    console.error('Error generating ML response:', error);
    return {
      answer: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
      confidence: 0,
      policyIds: [],
      welfareCategories: [],
    };
  }
}

// Function to enhance policy conclusions with ML insights
export async function enhancePolicyConclusion(
  policyId: string,
  query: string
): Promise<PolicyConclusion | null> {
  try {
    const baseConclusion = policyConclusions[policyId];
    if (!baseConclusion) return null;

    // Call to ML model API for conclusion enhancement
    const response = await fetch('https://gta-backend.onrender.com/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policyId,
        query,
        baseConclusion,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to enhance policy conclusion');
    }

    const data = await response.json();
    
    // Merge ML enhancements with base conclusion
    return {
      ...baseConclusion,
      citizenBenefits: [
        ...baseConclusion.citizenBenefits,
        ...(data.additionalBenefits || []),
      ],
      potentialChallenges: [
        ...baseConclusion.potentialChallenges,
        ...(data.additionalChallenges || []),
      ],
      recommendations: [
        ...baseConclusion.recommendations,
        ...(data.additionalRecommendations || []),
      ],
    };
  } catch (error) {
    console.error('Error enhancing policy conclusion:', error);
    return null;
  }
} 