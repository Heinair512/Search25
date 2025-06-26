import { ref } from 'vue';

export function usePagination(defaultRows = 12) {
  const first = ref(0);
  const rows = ref(defaultRows);
  const isGrid = ref(true);

  const updateStateOnPageChange = (event) => {
    first.value = event.first;
    rows.value = event.rows;
  };

  return {
    first,
    rows,
    isGrid,
    updateStateOnPageChange
  };
}