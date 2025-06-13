import { ref } from 'vue';

// Use the exact JSON format from the example
export const mockApiResponse = {
  hits: 10,
  took: 13,
  products: [
    {
      "id": "01:COST08:100000",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100000",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN0",
      "productNumberForView": "GEN0",
      "remark": null,
      "runNumber": 100000,
      "supplier": "COST08",
      "supplierProductNumber": [
        "100000"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:KANE03:100001",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100001",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN1",
      "productNumberForView": "GEN1",
      "remark": null,
      "runNumber": 100001,
      "supplier": "KANE03",
      "supplierProductNumber": [
        "100001"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:INRH02:100002",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100002",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN2",
      "productNumberForView": "GEN2",
      "remark": null,
      "runNumber": 100002,
      "supplier": "INRH02",
      "supplierProductNumber": [
        "100002"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:ITLA02:100003",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100003",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN3",
      "productNumberForView": "GEN3",
      "remark": null,
      "runNumber": 100003,
      "supplier": "ITLA02",
      "supplierProductNumber": [
        "100003"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:TEBR01:100004",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100004",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN4",
      "productNumberForView": "GEN4",
      "remark": null,
      "runNumber": 100004,
      "supplier": "TEBR01",
      "supplierProductNumber": [
        "100004"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:COST08:100005",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100005",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN5",
      "productNumberForView": "GEN5",
      "remark": null,
      "runNumber": 100005,
      "supplier": "COST08",
      "supplierProductNumber": [
        "100005"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:KANE03:100006",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100006",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN6",
      "productNumberForView": "GEN6",
      "remark": null,
      "runNumber": 100006,
      "supplier": "KANE03",
      "supplierProductNumber": [
        "100006"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:INRH02:100007",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100007",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN7",
      "productNumberForView": "GEN7",
      "remark": null,
      "runNumber": 100007,
      "supplier": "INRH02",
      "supplierProductNumber": [
        "100007"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:ITLA02:100008",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100008",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN8",
      "productNumberForView": "GEN8",
      "remark": null,
      "runNumber": 100008,
      "supplier": "ITLA02",
      "supplierProductNumber": [
        "100008"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
    },
    {
      "id": "01:TEBR01:100009",
      "attributesTextSearch": null,
      "customerArticleNumbers": [],
      "description": "Generischer Artikel 100009",
      "description1": "",
      "description2": "",
      "discountGroup": null,
      "discountGroupText": null,
      "designation": null,
      "gtiNs": [],
      "grosPrice": 91.28,
      "grosPriceCurrency": "EUR",
      "picturePath": null,
      "productNumber": "GEN9",
      "productNumberForView": "GEN9",
      "remark": null,
      "runNumber": 100009,
      "supplier": "TEBR01",
      "supplierProductNumber": [
        "100009"
      ],
      "locked": false,
      "priceHidden": false,
      "materialnumberSap": null
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
    "description": "Generischer Artikel 100010 mit Attributen",
    "description1": "Zusätzliche Beschreibung 1",
    "description2": "Zusätzliche Beschreibung 2",
    "discountGroup": "DG1",
    "discountGroupText": "Discount Group 1",
    "designation": "Spezial-Werkzeug",
    "gtiNs": ["1234567890123"],
    "grosPrice": 129.99,
    "grosPriceCurrency": "EUR",
    "picturePath": "/images/product.jpg",
    "productNumber": "GEN10",
    "productNumberForView": "GEN10",
    "remark": "Besondere Bemerkung",
    "runNumber": 100010,
    "supplier": "COST08",
    "supplierProductNumber": [
      "100010", "ALT-100010"
    ],
    "locked": true,
    "priceHidden": true,
    "materialnumberSap": "SAP-12345"
  }
];

// Mock API service
export const debugSearchApi = {
  async search(term = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use the extended products list for more variety
    const allProducts = term === 'extended' ? extendedProducts : mockApiResponse.products;
    
    // If search term is provided, filter results
    if (term && term.trim() !== '' && term !== 'extended') {
      const filteredProducts = allProducts.filter(product => 
        (product.description && product.description.toLowerCase().includes(term.toLowerCase())) ||
        (product.productNumber && product.productNumber.toLowerCase().includes(term.toLowerCase())) ||
        (product.supplier && product.supplier.toLowerCase().includes(term.toLowerCase())) ||
        (product.id && product.id.toLowerCase().includes(term.toLowerCase()))
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