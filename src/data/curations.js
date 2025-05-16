import { ref } from 'vue';

export const curations = ref([
  { term: 'hammer', pinnedCount: 3, pinnedKbns: ['123456', '789012'] },
  { term: 'schrauben', pinnedCount: 2, pinnedKbns: ['345678'] },
  { term: 'bohrer', pinnedCount: 1 },
  { term: 'säge', pinnedCount: 2 },
  { term: 'werkzeugkasten', pinnedCount: 1 }
]);