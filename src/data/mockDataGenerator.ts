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

// Business Unit Specific Ranges
const buRanges = {
  'GC Gruppe': {
    ctr: { min: 25, max: 35 },
    conversionRate: { min: 12, max: 18 },
    totalSearches: { min: 8000, max: 12000 },
    noResultsRate: { min: 3, max: 7 },
    avgClickedPosition: { min: 1.5, max: 2.5 },
    mrr: { min: 0.85, max: 0.95 },
    ndcg: { min: 0.9, max: 0.98 },
    searchTermsCount: { min: 4000, max: 6000 },
    rankedTermsPercentage: { min: 75, max: 85 }
  },
  'Search': {
    ctr: { min: 30, max: 40 },
    conversionRate: { min: 15, max: 20 },
    totalSearches: { min: 10000, max: 15000 },
    noResultsRate: { min: 2, max: 5 },
    avgClickedPosition: { min: 1.2, max: 2.0 },
    mrr: { min: 0.88, max: 0.98 },
    ndcg: { min: 0.92, max: 0.99 },
    searchTermsCount: { min: 5000, max: 7000 },
    rankedTermsPercentage: { min: 80, max: 90 }
  },
  'GC': {
    ctr: { min: 20, max: 30 },
    conversionRate: { min: 10, max: 15 },
    totalSearches: { min: 6000, max: 9000 },
    noResultsRate: { min: 4, max: 8 },
    avgClickedPosition: { min: 1.8, max: 2.8 },
    mrr: { min: 0.82, max: 0.92 },
    ndcg: { min: 0.88, max: 0.95 },
    searchTermsCount: { min: 3000, max: 5000 },
    rankedTermsPercentage: { min: 70, max: 80 }
  },
  'bimsplus': {
    ctr: { min: 15, max: 25 },
    conversionRate: { min: 8, max: 13 },
    totalSearches: { min: 4000, max: 7000 },
    noResultsRate: { min: 5, max: 9 },
    avgClickedPosition: { min: 2.0, max: 3.0 },
    mrr: { min: 0.80, max: 0.90 },
    ndcg: { min: 0.85, max: 0.93 },
    searchTermsCount: { min: 2000, max: 4000 },
    rankedTermsPercentage: { min: 65, max: 75 }
  },
  'hti': {
    ctr: { min: 18, max: 28 },
    conversionRate: { min: 9, max: 14 },
    totalSearches: { min: 5000, max: 8000 },
    noResultsRate: { min: 4.5, max: 8.5 },
    avgClickedPosition: { min: 1.9, max: 2.9 },
    mrr: { min: 0.81, max: 0.91 },
    ndcg: { min: 0.86, max: 0.94 },
    searchTermsCount: { min: 2500, max: 4500 },
    rankedTermsPercentage: { min: 68, max: 78 }
  }
};

// Helper Functions
function generateRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Data Generators
export function generateSearchMetrics(bu: string): SearchMetrics {
  if (!buRanges[bu]) {
    console.error('No range defined for business unit:', bu);
    return {
      bu,
      ctr: 0,
      conversionRate: 0,
      totalSearches: 0,
      noResultsRate: 0,
      avgClickedPosition: 0,
      mrr: 0,
      ndcg: 0,
      searchTermsCount: 0,
      rankedTermsPercentage: 0
    };
  }

  const ranges = buRanges[bu];
  return {
    bu,
    ctr: generateRandomInRange(ranges.ctr.min, ranges.ctr.max),
    conversionRate: generateRandomInRange(ranges.conversionRate.min, ranges.conversionRate.max),
    totalSearches: generateRandomInt(ranges.totalSearches.min, ranges.totalSearches.max),
    noResultsRate: generateRandomInRange(ranges.noResultsRate.min, ranges.noResultsRate.max),
    avgClickedPosition: generateRandomInRange(ranges.avgClickedPosition.min, ranges.avgClickedPosition.max),
    mrr: generateRandomInRange(ranges.mrr.min, ranges.mrr.max),
    ndcg: generateRandomInRange(ranges.ndcg.min, ranges.ndcg.max),
    searchTermsCount: generateRandomInt(ranges.searchTermsCount.min, ranges.searchTermsCount.max),
    rankedTermsPercentage: generateRandomInRange(ranges.rankedTermsPercentage.min, ranges.rankedTermsPercentage.max)
  };
}

export function generateDailyMetrics(date: Date, bu: string): DailyMetrics {
  const ranges = buRanges[bu];
  return {
    date: date.toISOString().split('T')[0],
    ctr: generateRandomInRange(ranges.ctr.min, ranges.ctr.max),
    conversionRate: generateRandomInRange(ranges.conversionRate.min, ranges.conversionRate.max),
    noResultsRate: generateRandomInRange(ranges.noResultsRate.min, ranges.noResultsRate.max),
    mrr: generateRandomInRange(ranges.mrr.min, ranges.mrr.max),
    ndcg: generateRandomInRange(ranges.ndcg.min, ranges.ndcg.max),
    searchTermsCount: generateRandomInt(ranges.searchTermsCount.min, ranges.searchTermsCount.max),
    rankedTermsPercentage: generateRandomInRange(ranges.rankedTermsPercentage.min, ranges.rankedTermsPercentage.max)
  };
}

export function generateSearchTerm(term: string, bu: string, withPosition = false): SearchTerm {
  const ranges = buRanges[bu];
  const searches = generateRandomInt(1000, 100000);
  const clickRate = generateRandomInRange(0.05, 0.3) * (ranges.ctr.max / 40); // Adjust click rate based on BU's CTR
  const clicks = Math.floor(searches * clickRate);
  
  return {
    term,
    bu,
    searches,
    clicks,
    ctr: clicks ? ((clicks / searches) * 100).toFixed(1) + '%' : '0%',
    ...(withPosition && { position: generateRandomInRange(ranges.avgClickedPosition.min, ranges.avgClickedPosition.max + 2) })
  };
}

export function generateScatterData(targetCtr: number, count: number, bu: string) {
  const data = [];
  const distributions = [
    { weight: 0.4, range: [10, 100] },
    { weight: 0.3, range: [101, 1000] },
    { weight: 0.2, range: [1001, 10000] },
    { weight: 0.1, range: [10001, 100000] }
  ];

  // Adjust target CTR based on business unit
  const buFactor = buRanges[bu].ctr.max / 40; // Normalize to a factor
  const adjustedTargetCtr = targetCtr * buFactor;

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
    const perfectClicks = impressions * adjustedTargetCtr;
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
    dailyData: businessUnits.reduce((acc, bu) => {
      acc[bu] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return generateDailyMetrics(date, bu);
      });
      return acc;
    }, {}),
    searchTerms: businessUnits.flatMap(bu => 
      Array.from({ length: 50 }, () => generateSearchTerm(nanoid(8), bu))
    ),
    topClickedSearches: businessUnits.flatMap(bu => 
      Array.from({ length: 50 }, () => generateSearchTerm(nanoid(8), bu, true))
    )
  };
}