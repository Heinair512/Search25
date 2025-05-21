import { nanoid } from 'nanoid';

// Types
export interface SearchMetrics {
  bu: string;
  currentMonthSearches: number;
  previousMonthSearches: number;
  currentWeekCTR: number;
  previousWeekCTR: number;
  currentWeekZeroResults: number;
  previousWeekZeroResults: number;
  topSearchTerm: string;
  topSearchCount: number;
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

// Generate realistic search metrics for each BU
export function generateSearchMetrics(bu: string): SearchMetrics {
  // Generate current month searches (between 50k and 150k)
  const currentMonthSearches = generateRandomInt(50000, 150000);
  
  // Previous month slightly lower (80-95% of current)
  const previousMonthSearches = Math.floor(currentMonthSearches * (generateRandomInRange(0.80, 0.95)));
  
  // Current week CTR (between 15-35%)
  const currentWeekCTR = generateRandomInRange(15, 35);
  
  // Previous week CTR slightly different (±15% of current)
  const previousWeekCTR = currentWeekCTR * (1 + (generateRandomInRange(-0.15, 0.15)));
  
  // Current week zero results (between 3-8%)
  const currentWeekZeroResults = generateRandomInRange(3, 8);
  
  // Previous week zero results slightly different (±20% of current)
  const previousWeekZeroResults = currentWeekZeroResults * (1 + (generateRandomInRange(-0.20, 0.20)));

  // Top search terms with realistic counts
  const topSearchTerms = [
    { term: 'hammer', count: generateRandomInt(8000, 12000) },
    { term: 'schrauben', count: generateRandomInt(7000, 11000) },
    { term: 'bohrer', count: generateRandomInt(6000, 10000) }
  ];
  
  const topSearch = topSearchTerms[0];

  return {
    bu,
    currentMonthSearches,
    previousMonthSearches,
    currentWeekCTR,
    previousWeekCTR,
    currentWeekZeroResults,
    previousWeekZeroResults,
    topSearchTerm: topSearch.term,
    topSearchCount: topSearch.count,
    ctr: generateRandomInRange(10, 40),
    conversionRate: generateRandomInRange(5, 20),
    totalSearches: currentMonthSearches,
    noResultsRate: currentWeekZeroResults,
    avgClickedPosition: generateRandomInRange(1, 4),
    mrr: generateRandomInRange(0.7, 1.0),
    ndcg: generateRandomInRange(0.8, 1.0),
    searchTermsCount: generateRandomInt(1000, 6000),
    rankedTermsPercentage: generateRandomInRange(60, 90)
  };
}

// Generate daily data with consistent trends
export function generateDailyDataForRange(startDate: Date, endDate: Date): DailyMetrics[] {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      ctr: generateRandomInRange(10, 40),
      conversionRate: generateRandomInRange(5, 20),
      noResultsRate: generateRandomInRange(2, 12),
      mrr: generateRandomInRange(0.7, 1.0),
      ndcg: generateRandomInRange(0.8, 1.0),
      searchTermsCount: generateRandomInt(1000, 6000),
      rankedTermsPercentage: generateRandomInRange(60, 90)
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

// Generate search terms data
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

// Generate scatter plot data
export function generateScatterData(targetCtr: number, count: number) {
  const data = [];
  const distributions = [
    { weight: 0.4, range: [10, 100] },
    { weight: 0.3, range: [101, 1000] },
    { weight: 0.2, range: [1001, 10000] },
    { weight: 0.1, range: [10001, 100000] }
  ];

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let cumWeight = 0;
    const distribution = distributions.find(d => {
      cumWeight += d.weight;
      return rand <= cumWeight;
    });

    const [min, max] = distribution.range;
    const impressions = Math.floor(Math.random() * (max - min + 1)) + min;
    const perfectClicks = impressions * targetCtr;
    const noiseRange = perfectClicks * 0.3;
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