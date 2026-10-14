// The order in which the series gives the instruments. The series instrument
// and site/scripts/build-bundles.ts both read this list.
export const SERIES_DIR = 'YUCA_SERIES';

export const SERIES_ITEMS = [
  { edition: 1, name: 'PHQ_9' },
  { edition: 1, name: 'GAD_7' },
  { edition: 1, name: 'PQ_B' },
  { edition: 1, name: 'WHODAS_2_12' },
  { edition: 1, name: 'SIDAS' },
  { edition: 1, name: 'WHO_ASSIST_V3' },
  { edition: 1, name: 'UCLA_LONELINESS_SCALE' },
  { edition: 1, name: 'PSYCHLOPS_PRE' },
  { edition: 1, name: 'G_SAS' },
  { edition: 1, name: 'SLEEP_HEALTH_INDEX' },
  { edition: 1, name: 'ISI' },
  { edition: 1, name: 'IPAQ_SF' },
  { edition: 1, name: 'WHO_5' },
  { edition: 1, name: 'YUCA_ADDITIONAL_QUESTIONS' }
] as const;
