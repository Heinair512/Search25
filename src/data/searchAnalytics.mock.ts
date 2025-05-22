import { ref } from 'vue';
import { 
  generateSearchMetrics, 
  generateDailyMetrics, 
  generateSearchTerm,
  businessUnits
} from './mockDataGenerator';

// Export the business units array
export { businessUnits };

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

// Generate unique metrics for each BU
export const searchMetrics = businessUnits.map(bu => generateSearchMetrics(bu));

// Generate daily data for a date range with unique metrics per BU
export const generateDailyDataForRange = (startDate: Date, endDate: Date, bu: string = 'GC Gruppe') => {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push(generateDailyMetrics(currentDate, bu));
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

// Generate search terms data for each business unit with unique metrics
const generateSearchTermsForBU = (terms: typeof searchTermsWithCounts, bu: string, withPosition = false): SearchTerm[] => {
  return terms.map(({ term, searches }) => {
    // Get BU-specific ranges
    const buFactor = bu === 'Search' ? 1.2 : 
                    bu === 'GC Gruppe' ? 1.0 : 
                    bu === 'GC' ? 0.9 : 
                    bu === 'bimsplus' ? 0.7 : 
                    bu === 'Elements' ? 0.85 : 0.8;
    
    // Adjust searches based on BU
    const adjustedSearches = Math.floor(searches * buFactor);
    
    // Calculate clicks based on BU-specific CTR
    const buCtrBase = bu === 'Search' ? 0.35 : 
                     bu === 'GC Gruppe' ? 0.3 : 
                     bu === 'GC' ? 0.25 : 
                     bu === 'bimsplus' ? 0.2 : 
                     bu === 'Elements' ? 0.28 : 0.22;
    
    const clickRate = Math.random() * 0.2 + buCtrBase; // Random between buCtrBase and buCtrBase+0.2
    const clicks = Math.floor(adjustedSearches * clickRate);
    
    // Calculate position if needed
    const position = withPosition ? 
                    (bu === 'Search' ? 1 + Math.random() * 1.5 : 
                     bu === 'GC Gruppe' ? 1.5 + Math.random() * 1.5 : 
                     bu === 'GC' ? 2 + Math.random() * 2 : 
                     bu === 'bimsplus' ? 2.5 + Math.random() * 2.5 : 
                     bu === 'Elements' ? 1.8 + Math.random() * 1.8 :
                     2.2 + Math.random() * 2.2) : undefined;
    
    return {
      term,
      bu,
      searches: adjustedSearches,
      clicks,
      ctr: clicks ? ((clicks / adjustedSearches) * 100).toFixed(1) + '%' : '0%',
      ...(withPosition && { position })
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