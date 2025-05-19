import { ref } from 'vue';

// Initial synonyms data
const initialSynonyms = [
  {
    id: '1',
    name: 'Hose',
    kommentar: 'Das ist nur zum Test',
    aenderungsdatum: '07.11.2022 14:37:50',
    bearbeiter: 'Steffen Giese',
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
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: ['Schlegel', 'Klopfer'],
        art: 'ungerichtet',
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