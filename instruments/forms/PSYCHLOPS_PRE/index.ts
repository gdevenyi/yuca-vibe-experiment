import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

type Anchors = { high: { en: string; es: string }; low: { en: string; es: string } };

function sixPointOptions({ high, low }: Anchors) {
  return t({
    en: { 0: `0 – ${low.en}`, 1: '1', 2: '2', 3: '3', 4: '4', 5: `5 – ${high.en}` },
    es: { 0: `0 – ${low.es}`, 1: '1', 2: '2', 3: '3', 4: '4', 5: `5 – ${high.es}` }
  });
}

const affectedOptions = sixPointOptions({
  low: { en: 'Not at all affected', es: 'Nada afectado/a' },
  high: { en: 'Severely affected', es: 'Gravemente afectado/a' }
});

const durationOptions = t({
  en: {
    underOneMonth: 'Under one month',
    oneToThreeMonths: 'Between one and three months',
    threeMonthsToOneYear: 'Over three months but under one year',
    oneToFiveYears: 'One to five years',
    overFiveYears: 'Over five years'
  },
  es: {
    underOneMonth: 'Menos de un mes',
    oneToThreeMonths: 'Entre uno y tres meses',
    threeMonthsToOneYear: 'Más de tres meses pero menos de un año',
    oneToFiveYears: 'De uno a cinco años',
    overFiveYears: 'Más de cinco años'
  }
});

const writeInBox = t({
  en: '(Please write it in the box below.)',
  es: '(Escríbalo en el recuadro de abajo).'
});

const tickOneBox = t({
  en: '(Please tick one box below.)',
  es: '(Marque una casilla abajo).'
});

const affectedLabel = t({
  en: 'How much has it affected you over the last week?',
  es: '¿Cuánto le ha afectado durante la última semana?'
});

const durationLabel = t({
  en: 'How long ago were you first concerned about this problem?',
  es: '¿Hace cuánto tiempo comenzó a preocuparle este problema por primera vez?'
});

const $Score = z.number().int().min(0).max(5);
const $Duration = z.enum([
  'underOneMonth',
  'oneToThreeMonths',
  'threeMonthsToOneYear',
  'oneToFiveYears',
  'overFiveYears'
]);

function hasSecondProblem(q2a: unknown): boolean {
  return typeof q2a === 'string' && q2a.trim() !== '';
}

const copyright = t({
  en: "This questionnaire is called the Psychological Outcome Profiles questionnaire (PSYCHLOPS), Pre-Therapy, Version 5. See www.psychlops.org. All rights reserved © 2017, School of Population Health and Environmental Sciences, King's College London.",
  es: "Este cuestionario se llama Psychological Outcome Profiles questionnaire (PSYCHLOPS), Pre-Therapy, Version 5. Consulte www.psychlops.org. Todos los derechos reservados © 2017, School of Population Health and Environmental Sciences, King's College London."
});

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'PSYCHLOPS_PRE',
    edition: 1
  },
  tags: [t({ en: 'Psychotherapy Outcome', es: 'Resultados de psicoterapia' })],
  details: {
    title: t({
      en: 'PSYCHLOPS Pre-Therapy Questionnaire',
      es: 'Cuestionario PSYCHLOPS antes de la terapia'
    }),
    description: t({
      en: 'A questionnaire about you and how you are feeling – now that you are starting therapy. The Psychological Outcome Profiles questionnaire (PSYCHLOPS) is a client-centred mental health outcome measure covering problems, functioning and wellbeing. ',
      es: 'Un cuestionario sobre usted y cómo se siente, ahora que comienza la terapia. El Psychological Outcome Profiles questionnaire (PSYCHLOPS) es una medida de resultados en salud mental centrada en la persona, que abarca problemas, funcionamiento y bienestar. '
    }).concat(copyright),
    estimatedDuration: 5,
    // ODC joins instruction entries with ', ', so the sentences are one entry.
    instructions: [
      t({
        en: 'Question 2 is about another problem. If you do not have another problem, leave Question 2 empty. ',
        es: 'La pregunta 2 trata sobre otro problema. Si no tiene otro problema, deje la pregunta 2 en blanco. '
      }).concat(copyright)
    ],
    license: 'UNLICENSED',
    referenceUrl: 'http://www.psychlops.org',
    sourceUrl: 'http://www.psychlops.org'
  },
  content: [
    {
      title: t({ en: 'Question 1', es: 'Pregunta 1' }),
      fields: {
        q1a: {
          kind: 'string',
          variant: 'textarea',
          label: t({
            en: 'a. Choose the problem that troubles you most.',
            es: 'a. Elija el problema que más le preocupa.'
          }),
          description: writeInBox
        },
        q1b: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: `b. ${affectedLabel}`,
          description: tickOneBox,
          options: affectedOptions
        },
        q1c: {
          kind: 'string',
          variant: 'radio',
          label: `c. ${durationLabel}`,
          description: tickOneBox,
          options: durationOptions
        }
      }
    },
    {
      title: t({ en: 'Question 2', es: 'Pregunta 2' }),
      fields: {
        q2a: {
          kind: 'string',
          variant: 'textarea',
          label: t({
            en: 'a. Choose another problem that troubles you.',
            es: 'a. Elija otro problema que le preocupe.'
          }),
          description: writeInBox
        },
        q2b: {
          kind: 'dynamic',
          deps: ['q2a'],
          render: (data) => {
            if (!hasSecondProblem(data.q2a)) {
              return null;
            }
            return {
              kind: 'number',
              variant: 'radio',
              disableAutoPrefix: true,
              label: `b. ${affectedLabel}`,
              description: tickOneBox,
              options: affectedOptions
            };
          }
        },
        q2c: {
          kind: 'dynamic',
          deps: ['q2a'],
          render: (data) => {
            if (!hasSecondProblem(data.q2a)) {
              return null;
            }
            return {
              kind: 'string',
              variant: 'radio',
              label: `c. ${durationLabel}`,
              description: tickOneBox,
              options: durationOptions
            };
          }
        }
      }
    },
    {
      title: t({ en: 'Question 3', es: 'Pregunta 3' }),
      fields: {
        q3a: {
          kind: 'string',
          variant: 'textarea',
          label: t({
            en: 'a. Choose one thing that is hard to do because of your problem (or problems).',
            es: 'a. Elija una cosa que le resulte difícil hacer debido a su problema (o problemas).'
          }),
          description: writeInBox
        },
        q3b: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: 'b. How hard has it been to do this thing over the last week?',
            es: 'b. ¿Qué tan difícil le ha resultado hacer esto durante la última semana?'
          }),
          description: tickOneBox,
          options: sixPointOptions({
            low: { en: 'Not at all hard', es: 'Nada difícil' },
            high: { en: 'Very hard', es: 'Muy difícil' }
          })
        }
      }
    },
    {
      title: t({ en: 'Question 4', es: 'Pregunta 4' }),
      fields: {
        q4: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: 'How have you felt in yourself this last week?',
            es: '¿Cómo se ha sentido consigo mismo/a esta última semana?'
          }),
          description: tickOneBox,
          options: sixPointOptions({
            low: { en: 'Very good', es: 'Muy bien' },
            high: { en: 'Very bad', es: 'Muy mal' }
          })
        }
      }
    }
  ],
  measures: {
    totalScore: {
      kind: 'computed',
      label: t({
        en: 'Total PSYCHLOPS Pre-Therapy score (0-20)',
        es: 'Puntuación total PSYCHLOPS antes de la terapia (0-20)'
      }),
      value: ({ q1b, q2b, q3b, q4 }) => (q2b === undefined ? q1b * 2 : q1b + q2b) + q3b + q4
    },
    secondProblemCompleted: {
      kind: 'computed',
      label: t({
        en: 'Problem 2 (Question 2) completed',
        es: 'Problema 2 (pregunta 2) completado'
      }),
      value: ({ q2b }) => q2b !== undefined
    }
  },
  validationSchema: z
    .object({
      q1a: z.string(),
      q1b: $Score,
      q1c: $Duration,
      q2a: z.string().optional(),
      q2b: $Score.optional(),
      q2c: $Duration.optional(),
      q3a: z.string(),
      q3b: $Score,
      q4: $Score
    })
    .superRefine((data, ctx) => {
      if (!hasSecondProblem(data.q2a)) {
        return;
      }
      const message = t({ en: 'Please answer this question.', es: 'Responda esta pregunta.' });
      if (data.q2b === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['q2b'], message });
      }
      if (data.q2c === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['q2c'], message });
      }
    })
});
