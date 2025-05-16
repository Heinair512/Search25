import { nanoid } from 'nanoid';

// Types
export interface SearchMetrics {
  bu: string;
  ctr: number;
  conversionRate: number;
  totalSearches: number;
  noResultsRate: number;
  avgClickedPosition: number;
  mrr: number;
  ndcg: number;
  searchTermsCount: number;
  rankedTermsPercentage: number;
}

export interface SearchTerm {
  term: string;
  bu: string;
  searches: number;
  clicks?: number;
  position?: number;
  ctr?: string;
}

export interface DailyMetrics {
  date: string;
  ctr: number;
  conversionRate: number;
  noResultsRate: number;
  mrr: number;
  ndcg: number;
  searchTermsCount: number;
  rankedTermsPercentage: number;
}

// Constants
export const businessUnits = ['GC Gruppe', 'Search', 'GC', 'bimsplus', 'hti'];

// Helper Functions
function generateRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Data Generators
export function generateSearchMetrics(bu: string): SearchMetrics {
  return {
    bu,
    ctr: generateRandomInRange(10, 40),
    conversionRate: generateRandomInRange(5, 20),
    totalSearches: generateRandomInt(1000, 11000),
    noResultsRate: generateRandomInRange(2, 12),
    avgClickedPosition: generateRandomInRange(1, 4),
    mrr: generateRandomInRange(0.7, 1.0),
    ndcg: generateRandomInRange(0.8, 1.0),
    searchTermsCount: generateRandomInt(1000, 6000),
    rankedTermsPercentage: generateRandomInRange(60, 90)
  };
}

export function generateDailyMetrics(date: Date): DailyMetrics {
  return {
    date: date.toISOString().split('T')[0],
    ctr: generateRandomInRange(10, 40),
    conversionRate: generateRandomInRange(5, 20),
    noResultsRate: generateRandomInRange(2, 12),
    mrr: generateRandomInRange(0.7, 1.0),
    ndcg: generateRandomInRange(0.8, 1.0),
    searchTermsCount: generateRandomInt(1000, 6000),
    rankedTermsPercentage: generateRandomInRange(60, 90)
  };
}

export function generateSearchTerm(term: string, bu: string, withPosition = false): SearchTerm {
  const searches = generateRandomInt(1000, 100000);
  const clicks = Math.floor(generateRandomInRange(0, searches * 0.3));
  
  return {
    term,
    bu,
    searches,
    clicks,
    ctr: clicks ? ((clicks / searches) * 100).toFixed(1) + '%' : '0%',
    ...(withPosition && { position: generateRandomInRange(1, 10) })
  };
}

export function generateScatterData(targetCtr: number, count: number) {
  const data = [];
  const distributions = [
    { weight: 0.4, range: [10, 100] },
    { weight: 0.3, range: [101, 1000] },
    { weight: 0.2, range: [1001, 10000] },
    { weight: 0.1, range: [10001, 100000] }
  ];

  for (let i = 0; i < count; i++) {
    // Select impression range based on distribution weights
    const rand = Math.random();
    let cumWeight = 0;
    const distribution = distributions.find(d => {
      cumWeight += d.weight;
      return rand <= cumWeight;
    });

    // Generate impressions within selected range
    const [min, max] = distribution.range;
    const impressions = Math.floor(Math.random() * (max - min + 1)) + min;

    // Calculate clicks with noise
    const perfectClicks = impressions * targetCtr;
    const noiseRange = perfectClicks * 0.3; // 30% noise
    const noise = (Math.random() - 0.5) * noiseRange;
    const clicks = Math.max(1, Math.floor(perfectClicks + noise));

    data.push({
      x: impressions,
      y: clicks
    });
  }

  return data;
}

// Generate complete datasets
export function generateAllMetrics() {
  return {
    searchMetrics: businessUnits.map(bu => generateSearchMetrics(bu)),
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return generateDailyMetrics(date);
    }),
    searchTerms: businessUnits.flatMap(bu => 
      Array.from({ length: 50 }, () => generateSearchTerm(nanoid(8), bu))
    ),
    topClickedSearches: businessUnits.flatMap(bu => 
      Array.from({ length: 50 }, () => generateSearchTerm(nanoid(8), bu, true))
    )
  };
}