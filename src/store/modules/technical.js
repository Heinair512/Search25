import { reactive, computed } from 'vue';
import { businessUnits } from '../../data/searchAnalytics.mock';

// Default product attributes with initial boost values
const defaultProductAttributes = [
  { id: 'artikelId', name: 'Artikel ID (_id)', boost: 3 },
  { id: 'gtin', name: 'GTIN', boost: 2 },
  { id: 'artikelnummer', name: 'Artikelnummer', boost: 4 },
  { id: 'titel', name: 'Titel', boost: 5 },
  { id: 'beschreibung', name: 'Beschreibung', boost: 3 },
  { id: 'artikelart', name: 'Artikelart', boost: 2 },
  { id: 'artikelgruppe', name: 'Artikelgruppe', boost: 2 },
  { id: 'artikelserie', name: 'Artikelserie', boost: 2 },
  { id: 'sortiment', name: 'Sortiment', boost: 1 },
  { id: 'rabattgruppe', name: 'Rabattgruppe', boost: 1 },
  { id: 'rabattgruppeText', name: 'Rabattgruppe Text', boost: 1 },
  { id: 'attributeText', name: 'Attribute Text', boost: 3 },
  { id: 'attributeTextAlle', name: 'Attribute Text Alle', boost: 3 },
  { id: 'attributeNumerisch', name: 'Attribute Numerisch', boost: 2 },
  { id: 'sperrkennzeichen', name: 'Sperrkennzeichen', boost: 1 },
  { id: 'layoutsperren', name: 'Layoutsperren', boost: 1 },
  { id: 'firmensperren', name: 'Firmensperren', boost: 1 },
  { id: 'globaleSperre', name: 'Globale Sperre', boost: 1 },
  { id: 'listungSAP', name: 'Listung SAP', boost: 1 },
  { id: 'herstellerId', name: 'Hersteller ID', boost: 2 },
  { id: 'herstellername', name: 'Herstellername', boost: 4 },
  { id: 'herstellernameKurz', name: 'Herstellername Kurz', boost: 3 },
  { id: 'herstellerartikelnummer', name: 'Herstellerartikelnummer', boost: 3 },
  { id: 'herstellerSAP', name: 'Hersteller SAP', boost: 2 },
  { id: 'preis', name: 'Preis', boost: 2 },
  { id: 'waehrung', name: 'Währung', boost: 1 },
  { id: 'eigenmarke', name: 'Eigenmarke', boost: 2 },
  { id: 'bestandsfilter', name: 'Bestandsfilter', boost: 1 },
  { id: 'laufendeNummer', name: 'Laufende Nummer', boost: 1 },
  { id: 'materialnummerSAP', name: 'Materialnummer SAP', boost: 2 },
  { id: 'modellnummer', name: 'Modellnummer', boost: 2 },
  { id: 'kundenArtikelnummern', name: 'Kunden Artikelnummern', boost: 2 },
  { id: 'bild', name: 'Bild', boost: 1 },
  { id: 'erstellt', name: 'Erstellt', boost: 1 },
  { id: 'suggestions', name: 'Suggestions', boost: 2 }
];

// Default feature flags
const defaultFeatureFlags = {
  enableSuggestions: true,
  enableSpellCheck: true,
  enableSynonyms: true,
  enableFacets: true,
  enableHighlighting: true,
  enableAutocomplete: true,
  enableDebug: false
};

// Initialize settings for each business unit
const initializeSettings = () => {
  const settings = {};
  
  businessUnits.forEach(bu => {
    settings[bu] = {
      relevanceRankingEnabled: true,
      featureFlags: { ...defaultFeatureFlags },
      productAttributes: defaultProductAttributes.map(attr => ({ ...attr }))
    };
  });
  
  return settings;
};

const state = reactive({
  settings: initializeSettings(),
  loading: false,
  error: null
});

// Try to load saved settings from localStorage
const loadSavedSettings = () => {
  try {
    const savedSettings = localStorage.getItem('technicalSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      
      // Merge saved settings with default settings for any new BUs or attributes
      businessUnits.forEach(bu => {
        if (!parsed[bu]) {
          parsed[bu] = {
            relevanceRankingEnabled: true,
            featureFlags: { ...defaultFeatureFlags },
            productAttributes: defaultProductAttributes.map(attr => ({ ...attr }))
          };
        } else {
          // Ensure all default feature flags exist
          parsed[bu].featureFlags = {
            ...defaultFeatureFlags,
            ...parsed[bu].featureFlags
          };
          
          // Ensure all product attributes exist
          const existingAttributeIds = parsed[bu].productAttributes.map(attr => attr.id);
          defaultProductAttributes.forEach(defaultAttr => {
            if (!existingAttributeIds.includes(defaultAttr.id)) {
              parsed[bu].productAttributes.push({ ...defaultAttr });
            }
          });
        }
      });
      
      state.settings = parsed;
    }
  } catch (error) {
    console.error('Error loading technical settings:', error);
  }
};

// Load saved settings on initialization
loadSavedSettings();

export const useTechnicalStore = () => {
  const saveSettings = () => {
    try {
      localStorage.setItem('technicalSettings', JSON.stringify(state.settings));
    } catch (error) {
      console.error('Error saving technical settings:', error);
      state.error = 'Failed to save settings';
    }
  };

  const getSettingsForBU = (bu) => {
    return state.settings[bu] || {
      relevanceRankingEnabled: true,
      featureFlags: { ...defaultFeatureFlags },
      productAttributes: defaultProductAttributes.map(attr => ({ ...attr }))
    };
  };

  const updateRelevanceRanking = (bu, enabled) => {
    if (state.settings[bu]) {
      state.settings[bu].relevanceRankingEnabled = enabled;
      saveSettings();
    }
  };

  const updateFeatureFlag = (bu, flagName, value) => {
    if (state.settings[bu] && state.settings[bu].featureFlags.hasOwnProperty(flagName)) {
      state.settings[bu].featureFlags[flagName] = value;
      saveSettings();
    }
  };

  const updateProductAttributeBoost = (bu, attributeId, boostValue) => {
    if (state.settings[bu]) {
      const attribute = state.settings[bu].productAttributes.find(attr => attr.id === attributeId);
      if (attribute) {
        attribute.boost = boostValue;
        saveSettings();
      }
    }
  };

  const resetSettings = (bu) => {
    state.settings[bu] = {
      relevanceRankingEnabled: true,
      featureFlags: { ...defaultFeatureFlags },
      productAttributes: defaultProductAttributes.map(attr => ({ ...attr }))
    };
    saveSettings();
  };

  return {
    // State
    settings: computed(() => state.settings),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    
    // Getters
    getSettingsForBU,
    
    // Actions
    updateRelevanceRanking,
    updateFeatureFlag,
    updateProductAttributeBoost,
    resetSettings,
    saveSettings
  };
};