import { GovernmentPolicy } from '../services/policyService';

// Define categories for citizen welfare impact
export type WelfareCategory = 
  | 'economic' 
  | 'health' 
  | 'education' 
  | 'housing' 
  | 'environment' 
  | 'social' 
  | 'infrastructure';

// Define impact level
export type ImpactLevel = 'high' | 'medium' | 'low';

// Define policy conclusion structure
export interface PolicyConclusion {
  policyId: string;
  welfareCategories: WelfareCategory[];
  impactLevel: ImpactLevel;
  citizenBenefits: string[];
  implementationTimeline: string;
  potentialChallenges: string[];
  recommendations: string[];
}

// Map of policy IDs to their conclusions
export const policyConclusions: Record<string, PolicyConclusion> = {
  '1': {
    policyId: '1',
    welfareCategories: ['infrastructure', 'economic', 'environment'],
    impactLevel: 'high',
    citizenBenefits: [
      'Improved transportation infrastructure',
      'Better public transit options',
      'Reduced commute times',
      'Enhanced public safety',
      'Job creation in construction and maintenance',
      'Improved access to broadband internet',
      'Better water quality and reliability'
    ],
    implementationTimeline: 'Multi-year implementation with phased approach',
    potentialChallenges: [
      'Construction disruptions',
      'Coordination between federal, state, and local agencies',
      'Environmental impact considerations',
      'Cost overruns'
    ],
    recommendations: [
      'Stay informed about local infrastructure projects',
      'Participate in public comment periods',
      'Consider career opportunities in infrastructure sectors',
      'Plan for potential travel disruptions during construction'
    ]
  },
  '2': {
    policyId: '2',
    welfareCategories: ['health', 'education', 'economic', 'environment'],
    impactLevel: 'high',
    citizenBenefits: [
      'Expanded Medicare coverage including hearing benefits',
      'Enhanced child tax credit for families',
      'Universal pre-K for 3 and 4-year-olds',
      'Lower prescription drug costs',
      'Clean energy investments',
      'Climate change mitigation'
    ],
    implementationTimeline: 'Phased implementation over several years',
    potentialChallenges: [
      'Budget constraints',
      'Political opposition',
      'Implementation complexity across states',
      'Coordination with existing programs'
    ],
    recommendations: [
      'Check eligibility for new Medicare benefits',
      'Apply for enhanced child tax credit',
      'Research pre-K enrollment options',
      'Compare prescription drug prices',
      'Explore clean energy incentives'
    ]
  },
  '3': {
    policyId: '3',
    welfareCategories: ['economic', 'social'],
    impactLevel: 'high',
    citizenBenefits: [
      'Direct financial assistance',
      'Extended unemployment benefits',
      'Targeted assistance for small businesses',
      'Support for essential services',
      'Job creation in underserved communities'
    ],
    implementationTimeline: 'Rapid implementation for immediate relief',
    potentialChallenges: [
      'Eligibility verification',
      'Fraud prevention',
      'Equitable distribution',
      'Administrative complexity'
    ],
    recommendations: [
      'Check eligibility for direct payments',
      'Apply for extended unemployment benefits if needed',
      'Research small business assistance programs',
      'Monitor local service availability'
    ]
  },
  '4': {
    policyId: '4',
    welfareCategories: ['economic', 'social'],
    impactLevel: 'medium',
    citizenBenefits: [
      'Access to low-interest loans for small businesses',
      'Simplified loan application process',
      'Support for minority-owned businesses',
      'Innovation and technology adoption assistance',
      'Job creation in small business sector'
    ],
    implementationTimeline: 'Immediate to short-term implementation',
    potentialChallenges: [
      'Loan approval criteria',
      'Administrative capacity',
      'Outreach to underserved communities',
      'Technology adoption barriers'
    ],
    recommendations: [
      'Research loan eligibility requirements',
      'Prepare business documentation',
      'Connect with local SBA offices',
      'Explore technology adoption resources'
    ]
  },
  '5': {
    policyId: '5',
    welfareCategories: ['economic', 'health', 'education', 'housing'],
    impactLevel: 'high',
    citizenBenefits: [
      'Direct financial assistance',
      'Extended unemployment benefits',
      'Increased child tax credit',
      'Support for renters and homeowners',
      'Funding for schools to safely reopen',
      'Vaccine distribution and testing support'
    ],
    implementationTimeline: 'Rapid implementation for immediate relief',
    potentialChallenges: [
      'Eligibility verification',
      'Equitable distribution',
      'Administrative complexity',
      'Coordination with existing programs'
    ],
    recommendations: [
      'Check eligibility for direct payments',
      'Apply for extended unemployment benefits if needed',
      'Research rental and mortgage assistance programs',
      'Stay informed about school reopening plans',
      'Locate vaccine and testing sites'
    ]
  },
  '6': {
    policyId: '6',
    welfareCategories: ['environment', 'economic', 'social'],
    impactLevel: 'high',
    citizenBenefits: [
      'Improved air quality',
      'Job creation in clean energy sector',
      'Protection from climate impacts',
      'Access to renewable energy incentives',
      'Electric vehicle adoption support',
      'Conservation employment opportunities'
    ],
    implementationTimeline: 'Long-term implementation with immediate components',
    potentialChallenges: [
      'Transition for fossil fuel workers',
      'Infrastructure requirements',
      'Cost considerations',
      'Political opposition'
    ],
    recommendations: [
      'Research clean energy incentives',
      'Explore electric vehicle options',
      'Consider career opportunities in clean energy',
      'Participate in local climate resilience planning'
    ]
  },
  '7': {
    policyId: '7',
    welfareCategories: ['health', 'economic'],
    impactLevel: 'high',
    citizenBenefits: [
      'Lower health insurance premiums',
      'Access to public health insurance option',
      'Reduced prescription drug costs',
      'Protection from surprise medical billing',
      'Expanded Medicaid access',
      'Improved access to community health centers'
    ],
    implementationTimeline: 'Phased implementation over several years',
    potentialChallenges: [
      'Insurance market adjustments',
      'Provider network changes',
      'State Medicaid expansion decisions',
      'Administrative complexity'
    ],
    recommendations: [
      'Compare health insurance options during open enrollment',
      'Check eligibility for expanded Medicaid',
      'Research prescription drug assistance programs',
      'Locate community health centers',
      'Understand surprise billing protections'
    ]
  },
  '8': {
    policyId: '8',
    welfareCategories: ['education', 'economic', 'social'],
    impactLevel: 'high',
    citizenBenefits: [
      'Improved school infrastructure',
      'Enhanced teacher quality',
      'Expanded access to early childhood education',
      'Reduced student debt',
      'Increased Pell Grant funding',
      'Support for minority-serving institutions'
    ],
    implementationTimeline: 'Multi-year implementation with phased approach',
    potentialChallenges: [
      'Resource allocation',
      'Implementation across diverse school systems',
      'Teacher recruitment and retention',
      'Coordination with existing programs'
    ],
    recommendations: [
      'Research early childhood education options',
      'Apply for student debt relief programs',
      'Check Pell Grant eligibility',
      'Explore opportunities at minority-serving institutions',
      'Participate in school improvement planning'
    ]
  }
};

// Function to get policy conclusion by ID
export function getPolicyConclusion(policyId: string): PolicyConclusion | null {
  return policyConclusions[policyId] || null;
}

// Function to analyze policy impact on citizen welfare
export function analyzePolicyWelfareImpact(policy: GovernmentPolicy): PolicyConclusion | null {
  return getPolicyConclusion(policy.id);
}

// Function to generate welfare-focused summary
export function generateWelfareSummary(policy: GovernmentPolicy, enhancedConclusion?: PolicyConclusion | null): string {
  const conclusion = enhancedConclusion || policyConclusions[policy.id];
  if (!conclusion) {
    return `The ${policy.title} policy is currently under review.`;
  }
  
  return `Policy: ${policy.title}\n\n` +
         `Impact Level: ${conclusion.impactLevel}\n\n` +
         `Citizen Benefits:\n${conclusion.citizenBenefits.map(benefit => `- ${benefit}`).join('\n')}\n\n` +
         `Implementation Timeline: ${conclusion.implementationTimeline}\n\n` +
         `Potential Challenges:\n${conclusion.potentialChallenges.map(challenge => `- ${challenge}`).join('\n')}\n\n` +
         `Recommendations:\n${conclusion.recommendations.map(rec => `- ${rec}`).join('\n')}`;
} 