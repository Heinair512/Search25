import { ref } from 'vue';

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

export const businessUnits = ['GC Gruppe', 'Search', 'GC', 'bimsplus', 'hti'];

// Generate random metrics for each BU with adjusted MRR and NDCG values
export const searchMetrics = businessUnits.map(bu => ({
  bu,
  ctr: Math.random() * 30 + 10,
  conversionRate: Math.random() * 15 + 5,
  totalSearches: Math.floor(Math.random() * 10000) + 1000,
  noResultsRate: Math.random() * 10 + 2,
  avgClickedPosition: Math.random() * 3 + 1,
  mrr: Math.random() * 0.3 + 0.7, // Adjusted to be between 0.7 and 1.0
  ndcg: Math.random() * 0.2 + 0.8, // Adjusted to be between 0.8 and 1.0
  searchTermsCount: Math.floor(Math.random() * 5000) + 1000,
  rankedTermsPercentage: Math.random() * 30 + 60
}));

// Generate daily data for a date range with adjusted MRR and NDCG values
export const generateDailyDataForRange = (startDate: Date, endDate: Date) => {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      ctr: Math.random() * 30 + 10,
      conversionRate: Math.random() * 15 + 5,
      noResultsRate: Math.random() * 10 + 2,
      mrr: Math.random() * 0.3 + 0.7, // Adjusted to be between 0.7 and 1.0
      ndcg: Math.random() * 0.2 + 0.8, // Adjusted to be between 0.8 and 1.0
      searchTermsCount: Math.floor(Math.random() * 5000) + 1000,
      rankedTermsPercentage: Math.random() * 30 + 60
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

// Real search terms data with actual search counts
const searchTermsWithCounts = [
  { term: 'ev', searches: 96912 },
  { term: 'rsl', searches: 85411 },
  { term: 'ppb15', searches: 76726 },
  { term: 'PPB22', searches: 63469 },
  { term: 'hk', searches: 51161 },
  { term: 'sigma01', searches: 49361 },
  { term: 'duofix', searches: 48744 },
  { term: 'ppb28', searches: 48158 },
  { term: 'eckventil', searches: 47127 },
  { term: 'kfe', searches: 46443 },
  { term: 'hahnverlängerung', searches: 46318 },
  { term: 'wasserzähler', searches: 45236 },
  { term: 'Kugelhahn', searches: 44827 },
  { term: 'cl', searches: 42530 },
  { term: 'schnellentlüfter', searches: 41796 },
  { term: 'auslaufventil', searches: 38041 },
  { term: 'manometer', searches: 37754 },
  { term: 'chg35', searches: 37673 },
  { term: 'ausgussbecken', searches: 37134 },
  { term: 'kfekv', searches: 37130 },
  { term: 'spus2220', searches: 36584 },
  { term: 'spus2825', searches: 36543 },
  { term: 'DFIX320WC112', searches: 35809 },
  { term: 'schall', searches: 35782 },
  { term: 'rs', searches: 35509 },
  { term: 'cus15h', searches: 33589 },
  { term: 'ppm15', searches: 33437 },
  { term: 'wärmemengenzähler', searches: 33205 },
  { term: 'panzerschlauch', searches: 33089 },
  { term: 'spus1515', searches: 32160 },
  { term: 'rohrschelle', searches: 32103 },
  { term: 'sicherheitsgruppe', searches: 31715 },
  { term: 'stand wc', searches: 31333 },
  { term: 'kv2020', searches: 31189 },
  { term: 'de', searches: 31182 },
  { term: 'cus22h', searches: 30711 },
  { term: 'hahnblock', searches: 30574 },
  { term: 'Kupferrohr', searches: 29503 },
  { term: 'Megapress', searches: 29372 },
  { term: 'kondensatpumpe', searches: 29288 },
  { term: 'silikon', searches: 28847 },
  { term: 'ppm22', searches: 28463 },
  { term: 'GIS', searches: 28252 },
  { term: 'kabelkanal', searches: 27844 },
  { term: 'Durchlauferhitzer', searches: 27807 },
  { term: 'badheizkörper', searches: 26375 },
  { term: 'freistromventil', searches: 25974 },
  { term: 'kappenventil', searches: 25972 },
  { term: 'sicherheitsventil', searches: 25812 },
  { term: 'Pumpenverschraubung', searches: 25475 }
];

// Generate search terms data for each business unit
const generateSearchTermsForBU = (terms: typeof searchTermsWithCounts, bu: string, withPosition = false): SearchTerm[] => {
  return terms.map(({ term, searches }) => {
    const clicks = Math.floor(Math.random() * (searches * 0.3)); // Random clicks up to 30% of searches
    return {
      term,
      bu,
      searches,
      clicks,
      ctr: clicks ? ((clicks / searches) * 100).toFixed(1) + '%' : '0%',
      ...(withPosition && { position: Math.random() * 10 + 1 })
    };
  });
};

// Generate data for each business unit
const generateDataForAllBUs = (terms: typeof searchTermsWithCounts, withPosition = false): SearchTerm[] => {
  return businessUnits.flatMap(bu => generateSearchTermsForBU(terms, bu, withPosition));
};

// Split the search terms into three groups for different metrics
const termCount = Math.floor(searchTermsWithCounts.length / 3);
const noResultTerms = searchTermsWithCounts.slice(0, termCount);
const lowClickTerms = searchTermsWithCounts.slice(termCount, termCount * 2);
const topClickedTerms = searchTermsWithCounts.slice(termCount * 2);

export const noResultSearches = ref(generateDataForAllBUs(noResultTerms));
export const lowClickSearches = ref(generateDataForAllBUs(lowClickTerms));
export const topClickedSearches = ref(generateDataForAllBUs(topClickedTerms, true));