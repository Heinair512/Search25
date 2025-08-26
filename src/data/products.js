// Generate 50 realistic hammer products
const generateProducts = () => {
  const manufacturers = [
    { name: 'Bosch', count: 10 },
    { name: 'Stanley', count: 8 },
    { name: 'Makita', count: 12 },
    { name: 'DeWalt', count: 7 },
    { name: 'Kraftwerk', count: 6 },
    { name: 'Milwaukee', count: 4 },
    { name: 'Hilti', count: 3 }
  ];

  const categories = [
    { name: 'Elektrowerkzeuge', count: 25 },
    { name: 'Handwerkzeuge', count: 25 }
  ];

  const subcategories = [
    { name: 'Bohrhammer', count: 15 },
    { name: 'Hämmer', count: 20 },
    { name: 'Abbruchhammer', count: 10 },
    { name: 'Schlaghammer', count: 5 }
  ];

  const colors = [
    { name: 'Schwarz', count: 15 },
    { name: 'Blau', count: 10 },
    { name: 'Rot', count: 8 },
    { name: 'Gelb', count: 7 },
    { name: 'Türkis', count: 5 },
    { name: 'Grün', count: 5 }
  ];

  // Updated collection of reliable tool images from Pexels
  const images = [
    'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',     // Hammer
    'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg',   // Tools
    'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg',     // Toolbox
    'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg', // Tools
    'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg',     // Level tool
    'https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg',     // Wrench
    'https://images.pexels.com/photos/1027508/pexels-photo-1027508.jpeg',   // Tool belt
    'https://images.pexels.com/photos/3846220/pexels-photo-3846220.jpeg',   // Knife
    'https://images.pexels.com/photos/2062061/pexels-photo-2062061.jpeg',   // Power drill
    'https://images.pexels.com/photos/1319459/pexels-photo-1319459.jpeg',   // Power tools
    'https://images.pexels.com/photos/1094770/pexels-photo-1094770.jpeg',   // Electric drill
    'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',   // Tools on wall
    'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg',   // Power tool
    'https://images.pexels.com/photos/4483775/pexels-photo-4483775.jpeg'    // Drill
  ];

  const products = [];
  let id = 1;

  // Generate products based on manufacturer counts
  manufacturers.forEach(mfr => {
    for (let i = 0; i < mfr.count; i++) {
      const isElectric = id % 2 === 0;
      const category = isElectric ? categories[0] : categories[1];
      const subcategory = isElectric 
        ? subcategories[id % 3] 
        : subcategories[1];

      const weight = isElectric ? 2 + Math.random() * 5 : 0.3 + Math.random() * 2;
      const length = isElectric ? 40 + Math.random() * 30 : 25 + Math.random() * 20;
      const price = isElectric ? 
        199 + Math.random() * 800 : 
        19.99 + Math.random() * 80;

      // Generate score and debug info
      const baseScore = Math.random() * 5 + 5; // Score between 5 and 10
      const matches = [
        {
          value: (Math.random() * 2 + 1).toFixed(2),
          details: {
            term: 'hammer',
            fields: ['name', 'description']
          }
        },
        {
          value: (Math.random() * 1.5 + 0.5).toFixed(2),
          details: {
            term: mfr.name.toLowerCase(),
            fields: ['manufacturer']
          }
        }
      ];

      const boost = {
        value: (Math.random() * 0.5 + 1).toFixed(2),
        details: [
          {
            term: 'relevance',
            field: 'tracking_data'
          }
        ]
      };

      // Generate ranking reasons for explainability
      const rankingReasons = [];
      if (Math.random() < 0.3) rankingReasons.push('Topseller'); // 30% chance
      if (Math.random() < 0.25) rankingReasons.push('Relevance'); // 25% chance
      // Some products can have both reasons (overlap possible)
      products.push({
        id: `H${String(id).padStart(4, '0')}`,
        name: `${isElectric ? 'Professional ' : ''}${subcategory.name} ${mfr.name}`,
        manufacturer: mfr.name,
        price: Math.round(price * 100) / 100,
        color: colors[id % colors.length].name,
        length: Math.round(length),
        weight: Math.round(weight * 10) / 10,
        category: category.name,
        subcategory: subcategory.name,
        image: images[id % images.length],
        debugInfo: {
          score: baseScore.toFixed(2),
          matches,
          boost,
          rankingType: 'MULTIPLIKATIV',
          rankingReasons
        }
      });
      id++;
    }
  });

  // Sort products by score in descending order before returning
  return products.sort((a, b) => parseFloat(b.debugInfo.score) - parseFloat(a.debugInfo.score));
};

export const products = generateProducts();

// Calculate actual counts for filters based on generated products
const calculateFilterCounts = (products) => {
  const counts = {
    manufacturer: {},
    category: {},
    subcategory: {},
    color: {},
    price: {
      'Bis 50 €': 0,
      '50-100 €': 0,
      '100-250 €': 0,
      '250-500 €': 0,
      'Über 500 €': 0
    },
    weight: {
      'Bis 1 kg': 0,
      '1-3 kg': 0,
      '3-5 kg': 0,
      'Über 5 kg': 0
    }
  };

  products.forEach(product => {
    counts.manufacturer[product.manufacturer] = (counts.manufacturer[product.manufacturer] || 0) + 1;
    counts.category[product.category] = (counts.category[product.category] || 0) + 1;
    counts.subcategory[product.subcategory] = (counts.subcategory[product.subcategory] || 0) + 1;
    counts.color[product.color] = (counts.color[product.color] || 0) + 1;
    
    if (product.price <= 50) counts.price['Bis 50 €']++;
    else if (product.price <= 100) counts.price['50-100 €']++;
    else if (product.price <= 250) counts.price['100-250 €']++;
    else if (product.price <= 500) counts.price['250-500 €']++;
    else counts.price['Über 500 €']++;
    
    if (product.weight <= 1) counts.weight['Bis 1 kg']++;
    else if (product.weight <= 3) counts.weight['1-3 kg']++;
    else if (product.weight <= 5) counts.weight['3-5 kg']++;
    else counts.weight['Über 5 kg']++;
  });

  return counts;
};

const filterCounts = calculateFilterCounts(products);

export const filters = [
  {
    name: 'Hersteller',
    field: 'manufacturer',
    values: Object.entries(filterCounts.manufacturer).map(([label, count], index) => ({
      id: `m${index + 1}`,
      label,
      count,
      selected: false
    }))
  },
  {
    name: 'Kategorie',
    field: 'category',
    values: Object.entries(filterCounts.category).map(([label, count], index) => ({
      id: `c${index + 1}`,
      label,
      count,
      selected: false
    }))
  },
  {
    name: 'Unterkategorie',
    field: 'subcategory',
    values: Object.entries(filterCounts.subcategory).map(([label, count], index) => ({
      id: `s${index + 1}`,
      label,
      count,
      selected: false
    }))
  },
  {
    name: 'Farbe',
    field: 'color',
    values: Object.entries(filterCounts.color).map(([label, count], index) => ({
      id: `f${index + 1}`,
      label,
      count,
      selected: false
    }))
  },
  {
    name: 'Preisbereich',
    field: 'price',
    values: Object.entries(filterCounts.price).map(([label, count], index) => ({
      id: `p${index + 1}`,
      label,
      count,
      selected: false
    }))
  },
  {
    name: 'Gewicht',
    field: 'weight',
    values: Object.entries(filterCounts.weight).map(([label, count], index) => ({
      id: `w${index + 1}`,
      label,
      count,
      selected: false
    }))
  }
];