import axios from 'axios';

// Define the structure of a government policy
export interface GovernmentPolicy {
  id: string;
  title: string;
  description: string;
  level: 'Federal' | 'State' | 'Local';
  introducedDate: string;
  status: 'Proposed' | 'In Committee' | 'Passed' | 'Vetoed';
  category: string;
  url?: string;
  sponsor?: string;
  congress?: string;
  billNumber?: string;
  billType?: string;
  lastUpdated?: string;
  upvotes: number;
  downvotes: number;
}

// Mock data with diverse summaries and official government links
const mockPolicies: GovernmentPolicy[] = [
  {
    id: '1',
    title: 'Infrastructure Investment and Jobs Act',
    description: 'This comprehensive infrastructure bill allocates $1.2 trillion to modernize America\'s transportation systems, including roads, bridges, public transit, and airports. It also invests in clean energy infrastructure, broadband expansion, and water systems, creating millions of well-paying jobs while addressing climate change and improving public safety.',
    level: 'Federal',
    introducedDate: '2021-08-10',
    status: 'Passed',
    category: 'Infrastructure Development',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/3684',
    sponsor: 'Rep. DeFazio, Peter A. [D-OR-4]',
    congress: '117',
    billType: 'hr',
    billNumber: '3684',
    lastUpdated: '2021-11-15',
    upvotes: 1245,
    downvotes: 342
  },
  {
    id: '2',
    title: 'Build Back Better Act',
    description: 'This $1.75 trillion social spending and climate bill expands Medicare coverage to include hearing benefits, extends the enhanced child tax credit, provides universal pre-K for 3 and 4-year-olds, invests $550 billion in clean energy and climate programs, and includes provisions to lower prescription drug costs. The bill aims to strengthen the middle class and address climate change while reducing the federal deficit.',
    level: 'Federal',
    introducedDate: '2021-09-27',
    status: 'In Committee',
    category: 'Public Health',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/5376',
    sponsor: 'Rep. Yarmuth, John A. [D-KY-3]',
    congress: '117',
    billType: 'hr',
    billNumber: '5376',
    lastUpdated: '2021-11-19',
    upvotes: 876,
    downvotes: 543
  },
  {
    id: '3',
    title: 'Economic Recovery and Growth Act',
    description: 'This legislation provides $300 billion in direct payments to individuals, extends unemployment benefits, and includes targeted assistance for small businesses and industries hardest hit by the pandemic. It also establishes a new grant program for state and local governments to fund essential services and infrastructure projects, with a focus on creating jobs and stimulating economic growth in underserved communities.',
    level: 'Federal',
    introducedDate: '2021-09-23',
    status: 'Proposed',
    category: 'Nutritional Support',
    url: 'https://www.congress.gov/bill/117th-congress/senate-bill/1234',
    sponsor: 'Sen. Schumer, Charles E. [D-NY]',
    congress: '117',
    billType: 's',
    billNumber: '1234',
    lastUpdated: '2021-09-23',
    upvotes: 654,
    downvotes: 234
  },
  {
    id: '4',
    title: 'Small Business Support Act',
    description: 'This bipartisan bill provides $50 billion in grants and low-interest loans to small businesses, with special provisions for minority-owned businesses and those in underserved areas. It simplifies the loan application process, extends the Paycheck Protection Program, and creates a new Small Business Administration office focused on innovation and technology adoption to help businesses compete in the digital economy.',
    level: 'Federal',
    introducedDate: '2021-10-15',
    status: 'Passed',
    category: 'Small Business Support',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/4567',
    sponsor: 'Rep. Velazquez, Nydia M. [D-NY-7]',
    congress: '117',
    billType: 'hr',
    billNumber: '4567',
    lastUpdated: '2021-11-01',
    upvotes: 987,
    downvotes: 123
  },
  {
    id: '5',
    title: 'Economic Stimulus Package',
    description: 'This emergency economic relief package provides $1,400 direct payments to individuals, extends enhanced unemployment benefits, increases the child tax credit, and allocates funds for vaccine distribution and testing. It also includes provisions to help struggling renters and homeowners, support for restaurants and other hard-hit small businesses, and funding for schools to safely reopen.',
    level: 'Federal',
    introducedDate: '2021-11-05',
    status: 'In Committee',
    category: 'Economic Stimulus',
    url: 'https://www.congress.gov/bill/117th-congress/senate-bill/7890',
    sponsor: 'Sen. Wyden, Ron [D-OR]',
    congress: '117',
    billType: 's',
    billNumber: '7890',
    lastUpdated: '2021-11-10',
    upvotes: 765,
    downvotes: 432
  },
  {
    id: '6',
    title: 'Climate Action and Jobs Act',
    description: 'This comprehensive climate legislation establishes a national clean energy standard, creates a Civilian Climate Corps to employ thousands in conservation work, and provides tax incentives for renewable energy and electric vehicles. It also includes provisions to protect vulnerable communities from climate impacts, invest in climate resilience, and ensure a just transition for workers in fossil fuel industries.',
    level: 'Federal',
    introducedDate: '2021-10-28',
    status: 'Proposed',
    category: 'Environment',
    url: 'https://www.congress.gov/bill/117th-congress/senate-bill/2345',
    sponsor: 'Sen. Markey, Edward J. [D-MA]',
    congress: '117',
    billType: 's',
    billNumber: '2345',
    lastUpdated: '2021-11-05',
    upvotes: 1123,
    downvotes: 345
  },
  {
    id: '7',
    title: 'Healthcare Affordability Act',
    description: 'This legislation expands the Affordable Care Act by increasing premium subsidies, creating a public health insurance option, and allowing Medicare to negotiate prescription drug prices. It also includes provisions to address surprise medical billing, expand Medicaid in states that haven\'t done so, and invest in community health centers to improve access to care in underserved areas.',
    level: 'Federal',
    introducedDate: '2021-09-15',
    status: 'In Committee',
    category: 'Healthcare',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/3456',
    sponsor: 'Rep. Pallone, Frank, Jr. [D-NJ-6]',
    congress: '117',
    billType: 'hr',
    billNumber: '3456',
    lastUpdated: '2021-10-20',
    upvotes: 876,
    downvotes: 234
  },
  {
    id: '8',
    title: 'Education Equity and Opportunity Act',
    description: 'This bill provides $100 billion to address educational inequities, including funding for school infrastructure improvements, teacher recruitment and retention programs, and expanded access to early childhood education. It also includes provisions to reduce student debt, increase Pell Grant funding, and support historically Black colleges and universities and other minority-serving institutions.',
    level: 'Federal',
    introducedDate: '2021-11-01',
    status: 'Proposed',
    category: 'Education',
    url: 'https://www.congress.gov/bill/117th-congress/senate-bill/4567',
    sponsor: 'Sen. Murray, Patty [D-WA]',
    congress: '117',
    billType: 's',
    billNumber: '4567',
    lastUpdated: '2021-11-15',
    upvotes: 987,
    downvotes: 123
  }
];

// Function to fetch government policies
export async function fetchGovernmentPolicies(): Promise<GovernmentPolicy[]> {
  // Return mock data directly without API calls
  return mockPolicies;
}

// Function to fetch a single policy by ID
export async function fetchPolicyById(id: string): Promise<GovernmentPolicy | null> {
  // Find policy in mock data
  const policy = mockPolicies.find(policy => policy.id === id);
  return policy || null;
} 