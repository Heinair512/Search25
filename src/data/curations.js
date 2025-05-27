import { ref } from 'vue';

export const curations = ref([
  { 
    term: 'hammer', 
    pinnedCount: 3, 
    pinnedKbns: ['123456', '789012'],
    comment: 'Wichtige Hammer-Produkte für die Startseite',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  { 
    term: 'schrauben', 
    pinnedCount: 2, 
    pinnedKbns: ['345678'],
    comment: 'Top-Schrauben für Holzarbeiten',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  { 
    term: 'bohrer', 
    pinnedCount: 1,
    comment: 'Professionelle Bohrer-Serie',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  { 
    term: 'säge', 
    pinnedCount: 2,
    comment: 'Handwerker-Favoriten',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  { 
    term: 'werkzeugkasten', 
    pinnedCount: 1,
    comment: 'Bestseller Werkzeugkästen',
    createdAt: new Date() // today
  },
  {
    term: 'schleifmaschine',
    pinnedCount: 2,
    pinnedKbns: ['567890', '234567'],
    comment: 'Professionelle Schleifmaschinen',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    term: 'zange',
    pinnedCount: 1,
    pinnedKbns: ['678901'],
    comment: 'Hochwertige Zangen für Elektriker',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    term: 'messgerät',
    pinnedCount: 3,
    pinnedKbns: ['789012', '890123', '901234'],
    comment: 'Digitale Messgeräte',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  }
]);