import { ref } from 'vue';

export function useDebugFilters() {
  // Installation options
  const installationOptions = [
    { label: 'CG', value: 'CG' },
    { label: 'GC', value: 'GC' },
    { label: 'HBH', value: 'HBH' },
    { label: 'HHM', value: 'HHM' },
    { label: 'HTI', value: 'HTI' },
    { label: 'BIMS', value: 'BIMS' }
  ];

  // Language options
  const languageOptions = [
    { label: 'DE', value: 'DE' },
    { label: 'EN', value: 'EN' },
    { label: 'PL', value: 'PL' }
  ];

  // Layout options
  const layoutOptions = [
    { label: 'EFG', value: 'EFG' },
    { label: 'GC', value: 'GC' },
    { label: 'HBH', value: 'HBH' },
    { label: 'HHM', value: 'HHM' },
    { label: 'HTI', value: 'HTI' },
    { label: 'BIMS', value: 'BIMS' }
  ];

  // Default values
  const installation = ref('CG');
  const language = ref('DE');
  const layout = ref('EFG');
  const companyId = ref('913');
  const isSap = ref(false);

  return {
    installationOptions,
    languageOptions,
    layoutOptions,
    installation,
    language,
    layout,
    companyId,
    isSap
  };
}