import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const options = t({
  en: {
    5: 'All of the time',
    4: 'Most of the time',
    3: 'More than half of the time',
    2: 'Less than half of the time',
    1: 'Some of the time',
    0: 'At no time'
  },
  es: {
    5: 'Todo el tiempo',
    4: 'La mayor parte del tiempo',
    3: 'Más de la mitad del tiempo',
    2: 'Menos de la mitad del tiempo',
    1: 'De vez en cuando',
    0: 'Nunca'
  }
});

const items = {
  cheerful: t({ en: 'I have felt cheerful and in good spirits.', es: 'Me he sentido alegre y de buen humor.' }),
  calm: t({ en: 'I have felt calm and relaxed.', es: 'Me he sentido tranquilo/a y relajado/a.' }),
  active: t({ en: 'I have felt active and vigorous.', es: 'Me he sentido activo/a y enérgico/a.' }),
  rested: t({
    en: 'I woke up feeling fresh and rested.',
    es: 'Me he despertado sintiéndome fresco/a y descansado/a.'
  }),
  interested: t({
    en: 'My daily life has been filled with things that interest me.',
    es: 'Mi vida diaria ha estado llena de cosas que me interesan.'
  })
};

type ItemKey = keyof typeof items;
const itemKeys = Object.keys(items) as ItemKey[];

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'WHO_5',
    edition: 1
  },
  tags: [t({ en: 'Well-Being', es: 'Bienestar' })],
  details: {
    title: t({ en: 'WHO-5 Well-Being Index', es: 'Índice de Bienestar OMS-5 (WHO-5)' }),
    description: t({
      en: 'The WHO-5 is a short self-report measure of current mental well-being over the last two weeks.',
      es: 'El WHO-5 es una breve medida de autoinforme del bienestar mental durante las últimas dos semanas.'
    }),
    estimatedDuration: 1,
    instructions: [
      t({
        en: 'Please respond to each item by choosing one answer, regarding how you have been feeling over the last two weeks.',
        es: 'Responda a cada afirmación eligiendo una respuesta, según cómo se ha sentido durante las últimas dos semanas.'
      })
    ],
    license: 'PUBLIC-DOMAIN',
    referenceUrl: 'https://www.psykiatri-regionh.dk/who-5/',
    sourceUrl: 'https://www.psykiatri-regionh.dk/who-5/'
  },
  content: {
    who5: {
      kind: 'number-record',
      label: t({ en: 'Over the last two weeks:', es: 'Durante las últimas dos semanas:' }),
      items: Object.fromEntries(itemKeys.map((key) => [key, { label: items[key] }])) as {
        [K in ItemKey]: { label: string };
      },
      options,
      variant: 'likert'
    }
  },
  measures: {
    rawScore: {
      kind: 'computed',
      label: t({ en: 'Raw score (0-25)', es: 'Puntuación bruta (0-25)' }),
      value: ({ who5 }) => itemKeys.reduce((sum, key) => sum + who5[key], 0)
    },
    percentageScore: {
      kind: 'computed',
      label: t({ en: 'Percentage score (0-100)', es: 'Puntuación porcentual (0-100)' }),
      value: ({ who5 }) => itemKeys.reduce((sum, key) => sum + who5[key], 0) * 4
    }
  },
  validationSchema: z.object({
    who5: z.object(Object.fromEntries(itemKeys.map((key) => [key, z.number().int().min(0).max(5)])) as {
      [K in ItemKey]: z.ZodNumber;
    })
  })
});
