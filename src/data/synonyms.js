import { ref } from 'vue';

// Initial synonyms data
const initialSynonyms = [
  {
    id: '1',
    name: 'Hose',
    kommentar: 'Das ist nur zum Test',
    aenderungsdatum: '07.11.2022 14:37:50',
    bearbeiter: 'Steffen Giese',
    bu: 'GC Gruppe', // Added business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Pantalon'],
        art: 'gerichtet',
        aktiv: true
      }
    ]
  },
  {
    id: '2',
    name: 'Hammer',
    kommentar: 'Werkzeug Synonyme',
    aenderungsdatum: '08.11.2022 09:15:20',
    bearbeiter: 'Jörg Wehrenberg',
    bu: 'Search', // Added business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Schlegel', 'Klopfer'],
        art: 'ungerichtet',
        aktiv: true
      }
    ]
  },
  {
    id: '3',
    name: 'Rohr',
    kommentar: 'Sanitär Synonyme',
    aenderungsdatum: '10.11.2022 11:30:45',
    bearbeiter: 'Heiner Holzhüter',
    bu: 'GC', // Added business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Leitung', 'Pipe'],
        art: 'ungerichtet',
        aktiv: true
      }
    ]
  },
  {
    id: '4',
    name: 'Schraube',
    kommentar: 'Befestigungsmaterial',
    aenderungsdatum: '12.11.2022 14:20:10',
    bearbeiter: 'Krzysztof Michalak',
    bu: 'bimsplus', // Added business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Bolzen', 'Gewinde'],
        art: 'ungerichtet',
        aktiv: true
      }
    ]
  },
  {
    id: '5',
    name: 'Ventil',
    kommentar: 'Sanitärtechnik',
    aenderungsdatum: '15.11.2022 09:45:30',
    bearbeiter: 'Jörg Wehrenberg',
    bu: 'hti', // Added business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Absperrventil', 'Kugelhahn'],
        art: 'gerichtet',
        aktiv: true
      }
    ]
  }
];

// Create a reactive reference to store the synonyms data
export const synonyms = ref(initialSynonyms);

// Function to update the synonyms data
export const updateSynonyms = (newSynonyms) => {
  synonyms.value = newSynonyms;
};