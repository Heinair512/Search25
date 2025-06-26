import { ref } from 'vue';

// Use the exact JSON format from the example
export const mockApiResponse = {
  hits: 10,
  took: 13,
  products: [
    {
      "id": "01:COST08:100000",
      "attributesTextSearch": "hammer werkzeug handwerkzeug",
      "customerArticleNumbers": ["CUST-123"],
      "description": "Professional Hammer COST08",
      "description1": "High-quality hammer for professional use",
      "description2": "With ergonomic grip and perfect balance",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Hammer",
      "gtiNs": ["1234567890123"],
      "grosPrice": 29.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg",
      "productNumber": "H0001",
      "productNumberForView": "H0001",
      "remark": "Best seller",
      "runNumber": 100000,
      "supplier": "COST08",
      "supplierProductNumber": [
        "100000"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-12345"
    },
    {
      "id": "01:KANE03:100001",
      "attributesTextSearch": "bohrer elektrowerkzeug",
      "customerArticleNumbers": ["CUST-456"],
      "description": "Power Drill Set KANE03",
      "description1": "Complete power drill set",
      "description2": "With various drill bits and carrying case",
      "discountGroup": "DG2",
      "discountGroupText": "Premium Discount",
      "designation": "Drill",
      "gtiNs": ["2345678901234"],
      "grosPrice": 149.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/825262/pexels-photo-825262.jpeg",
      "productNumber": "D0001",
      "productNumberForView": "D0001",
      "remark": "High demand",
      "runNumber": 100001,
      "supplier": "KANE03",
      "supplierProductNumber": [
        "100001"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-23456"
    },
    {
      "id": "01:INRH02:100002",
      "attributesTextSearch": "schraubendreher werkzeug handwerkzeug",
      "customerArticleNumbers": ["CUST-789"],
      "description": "Precision Screwdriver Kit",
      "description1": "Professional screwdriver set",
      "description2": "With magnetic tips and comfort grip handles",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Screwdriver",
      "gtiNs": ["3456789012345"],
      "grosPrice": 34.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      "productNumber": "S0001",
      "productNumberForView": "S0001",
      "remark": null,
      "runNumber": 100002,
      "supplier": "INRH02",
      "supplierProductNumber": [
        "100002"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-34567"
    },
    {
      "id": "01:ITLA02:100003",
      "attributesTextSearch": "werkzeugkasten aufbewahrung",
      "customerArticleNumbers": ["CUST-012"],
      "description": "Heavy Duty Toolbox",
      "description1": "Durable toolbox",
      "description2": "With multiple compartments and secure locking system",
      "discountGroup": "DG3",
      "discountGroupText": "Special Discount",
      "designation": "Toolbox",
      "gtiNs": ["4567890123456"],
      "grosPrice": 79.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg",
      "productNumber": "T0001",
      "productNumberForView": "T0001",
      "remark": "Limited stock",
      "runNumber": 100003,
      "supplier": "ITLA02",
      "supplierProductNumber": [
        "100003"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-45678"
    },
    {
      "id": "01:TEBR01:100004",
      "attributesTextSearch": "kreissäge elektrowerkzeug",
      "customerArticleNumbers": ["CUST-345"],
      "description": "Circular Saw",
      "description1": "Professional grade circular saw",
      "description2": "With laser guide and dust collection",
      "discountGroup": "DG2",
      "discountGroupText": "Premium Discount",
      "designation": "Saw",
      "gtiNs": ["5678901234567"],
      "grosPrice": 199.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg",
      "productNumber": "C0001",
      "productNumberForView": "C0001",
      "remark": null,
      "runNumber": 100004,
      "supplier": "TEBR01",
      "supplierProductNumber": [
        "100004"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-56789"
    },
    {
      "id": "01:COST08:100005",
      "attributesTextSearch": "maßband messwerkzeug",
      "customerArticleNumbers": ["CUST-678"],
      "description": "Measuring Tape Set",
      "description1": "Set of 3 measuring tapes",
      "description2": "With metric and imperial measurements",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Measuring Tape",
      "gtiNs": ["6789012345678"],
      "grosPrice": 19.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
      "productNumber": "M0001",
      "productNumberForView": "M0001",
      "remark": null,
      "runNumber": 100005,
      "supplier": "COST08",
      "supplierProductNumber": [
        "100005"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-67890"
    },
    {
      "id": "01:KANE03:100006",
      "attributesTextSearch": "schutzbrille sicherheitsausrüstung",
      "customerArticleNumbers": ["CUST-901"],
      "description": "Safety Goggles",
      "description1": "Impact-resistant safety goggles",
      "description2": "With anti-fog coating",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Goggles",
      "gtiNs": ["7890123456789"],
      "grosPrice": 14.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/1474993/pexels-photo-1474993.jpeg",
      "productNumber": "G0001",
      "productNumberForView": "G0001",
      "remark": null,
      "runNumber": 100006,
      "supplier": "KANE03",
      "supplierProductNumber": [
        "100006"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-78901"
    },
    {
      "id": "01:INRH02:100007",
      "attributesTextSearch": "arbeitshandschuhe sicherheitsausrüstung",
      "customerArticleNumbers": ["CUST-234"],
      "description": "Work Gloves Pro",
      "description1": "Heavy-duty work gloves",
      "description2": "With reinforced palms and touchscreen compatibility",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Gloves",
      "gtiNs": ["8901234567890"],
      "grosPrice": 24.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/1449844/pexels-photo-1449844.jpeg",
      "productNumber": "W0001",
      "productNumberForView": "W0001",
      "remark": null,
      "runNumber": 100007,
      "supplier": "INRH02",
      "supplierProductNumber": [
        "100007"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-89012"
    },
    {
      "id": "01:ITLA02:100008",
      "attributesTextSearch": "wasserwaage messwerkzeug",
      "customerArticleNumbers": ["CUST-567"],
      "description": "Level Set",
      "description1": "Professional 3-piece level set",
      "description2": "With magnetic strips",
      "discountGroup": "DG2",
      "discountGroupText": "Premium Discount",
      "designation": "Level",
      "gtiNs": ["9012345678901"],
      "grosPrice": 44.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
      "productNumber": "L0001",
      "productNumberForView": "L0001",
      "remark": null,
      "runNumber": 100008,
      "supplier": "ITLA02",
      "supplierProductNumber": [
        "100008"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-90123"
    },
    {
      "id": "01:TEBR01:100009",
      "attributesTextSearch": "schraubenschlüssel werkzeug handwerkzeug",
      "customerArticleNumbers": ["CUST-890"],
      "description": "Adjustable Wrench",
      "description1": "Premium adjustable wrench",
      "description2": "With wide jaw capacity",
      "discountGroup": "DG1",
      "discountGroupText": "Standard Discount",
      "designation": "Wrench",
      "gtiNs": ["0123456789012"],
      "grosPrice": 27.99,
      "grosPriceCurrency": "EUR",
      "picturePath": "https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg",
      "productNumber": "A0001",
      "productNumberForView": "A0001",
      "remark": null,
      "runNumber": 100009,
      "supplier": "TEBR01",
      "supplierProductNumber": [
        "100009"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": "SAP-01234"
    }
  ]
};

// Add some variations for testing
const extendedProducts = [
  ...mockApiResponse.products,
  {
    "id": "01:COST08:100010",
    "attributesTextSearch": "Werkzeug, Hammer, Handwerkzeug",
    "customerArticleNumbers": ["CUST-123", "CUST-456"],
    "description": "Tool Belt",
    "description1": "Heavy-duty tool belt",
    "description2": "With multiple pockets and padded waist support",
    "discountGroup": "DG1",
    "discountGroupText": "Discount Group 1",
    "designation": "Tool Belt",
    "gtiNs": ["1234567890123"],
    "grosPrice": 39.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/1027508/pexels-photo-1027508.jpeg",
    "productNumber": "TB001",
    "productNumberForView": "TB001",
    "remark": "Bestseller",
    "runNumber": 100010,
    "supplier": "COST08",
    "supplierProductNumber": [
      "100010", "ALT-100010"
    ],
    "locked": false,
    "priceHidden": false,
    "materialnumberSap": "SAP-12345"
  },
  {
    "id": "01:KANE03:100011",
    "attributesTextSearch": "Messer, Schneidwerkzeug, Handwerkzeug",
    "customerArticleNumbers": ["CUST-789", "CUST-012"],
    "description": "Utility Knife Set",
    "description1": "Professional utility knife set",
    "description2": "With replacement blades",
    "discountGroup": "DG1",
    "discountGroupText": "Discount Group 1",
    "designation": "Knife Set",
    "gtiNs": ["2345678901234"],
    "grosPrice": 16.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/3846220/pexels-photo-3846220.jpeg",
    "productNumber": "UK001",
    "productNumberForView": "UK001",
    "remark": "Popular item",
    "runNumber": 100011,
    "supplier": "KANE03",
    "supplierProductNumber": [
      "100011", "ALT-100011"
    ],
    "locked": false,
    "priceHidden": false,
    "materialnumberSap": "SAP-23456"
  },
  {
    "id": "01:INRH02:100012",
    "attributesTextSearch": "Bohrmaschine, Elektrowerkzeug, Bohrer",
    "customerArticleNumbers": ["CUST-345", "CUST-678"],
    "description": "Power Drill Professional",
    "description1": "High-performance power drill",
    "description2": "With variable speed and hammer function",
    "discountGroup": "DG2",
    "discountGroupText": "Discount Group 2",
    "designation": "Power Drill",
    "gtiNs": ["3456789012345"],
    "grosPrice": 129.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/2062061/pexels-photo-2062061.jpeg",
    "productNumber": "PD001",
    "productNumberForView": "PD001",
    "remark": "Top rated",
    "runNumber": 100012,
    "supplier": "INRH02",
    "supplierProductNumber": [
      "100012", "ALT-100012"
    ],
    "locked": false,
    "priceHidden": false,
    "materialnumberSap": "SAP-34567"
  },
  {
    "id": "01:ITLA02:100013",
    "attributesTextSearch": "Elektrowerkzeug, Säge, Kreissäge",
    "customerArticleNumbers": ["CUST-901", "CUST-234"],
    "description": "Circular Saw Professional",
    "description1": "Heavy-duty circular saw",
    "description2": "With laser guide and dust collection",
    "discountGroup": "DG2",
    "discountGroupText": "Discount Group 2",
    "designation": "Circular Saw",
    "gtiNs": ["4567890123456"],
    "grosPrice": 179.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/1319459/pexels-photo-1319459.jpeg",
    "productNumber": "CS001",
    "productNumberForView": "CS001",
    "remark": "Professional grade",
    "runNumber": 100013,
    "supplier": "ITLA02",
    "supplierProductNumber": [
      "100013", "ALT-100013"
    ],
    "locked": false,
    "priceHidden": false,
    "materialnumberSap": "SAP-45678"
  },
  {
    "id": "01:TEBR01:100014",
    "attributesTextSearch": "Elektrowerkzeug, Bohrer, Akkuschrauber",
    "customerArticleNumbers": ["CUST-567", "CUST-890"],
    "description": "Cordless Drill Set",
    "description1": "18V cordless drill set",
    "description2": "With two batteries and charger",
    "discountGroup": "DG2",
    "discountGroupText": "Discount Group 2",
    "designation": "Cordless Drill",
    "gtiNs": ["5678901234567"],
    "grosPrice": 159.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/1094770/pexels-photo-1094770.jpeg",
    "productNumber": "CD001",
    "productNumberForView": "CD001",
    "remark": "Best seller",
    "runNumber": 100014,
    "supplier": "TEBR01",
    "supplierProductNumber": [
      "100014", "ALT-100014"
    ],
    "locked": false,
    "priceHidden": false,
    "materialnumberSap": "SAP-56789"
  },
  {
    "id": "01:COST08:100015",
    "attributesTextSearch": "Handwerkzeug, Zange, Werkzeug",
    "customerArticleNumbers": ["CUST-123", "CUST-456"],
    "description": "Professional Pliers Set",
    "description1": "Set of 5 professional pliers",
    "description2": "Including needle nose, diagonal, and lineman's pliers",
    "discountGroup": "DG1",
    "discountGroupText": "Discount Group 1",
    "designation": "Pliers Set",
    "gtiNs": ["6789012345678"],
    "grosPrice": 49.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg",
    "productNumber": "PS001",
    "productNumberForView": "PS001",
    "remark": "Professional grade",
    "runNumber": 100015,
    "supplier": "COST08",
    "supplierProductNumber": [
      "100015", "ALT-100015"
    ],
    "locked": true,
    "priceHidden": false,
    "materialnumberSap": "SAP-67890"
  }
];

// Mock API service
export const debugSearchApi = {
  async search(term = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use the extended products list for more variety
    const allProducts = term === 'extended' ? extendedProducts : extendedProducts;
    
    // If search term is provided, filter results
    if (term && term.trim() !== '' && term !== 'extended') {
      const searchTermLower = term.toLowerCase();
      const filteredProducts = allProducts.filter(product => 
        (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
        (product.productNumber && product.productNumber.toLowerCase().includes(searchTermLower)) ||
        (product.supplier && product.supplier.toLowerCase().includes(searchTermLower)) ||
        (product.id && product.id.toLowerCase().includes(searchTermLower)) ||
        (product.attributesTextSearch && product.attributesTextSearch.toLowerCase().includes(searchTermLower)) ||
        (product.designation && product.designation.toLowerCase().includes(searchTermLower))
      );
      
      return {
        hits: filteredProducts.length,
        took: Math.floor(Math.random() * 20) + 5, // Random response time between 5-25ms
        products: filteredProducts
      };
    }
    
    // Return all products if no search term
    return {
      hits: allProducts.length,
      took: Math.floor(Math.random() * 20) + 5,
      products: allProducts
    };
  }
};