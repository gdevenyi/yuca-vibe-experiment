import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

// Simple scoring (WHODAS 2.0 manual): None = 1, Mild = 2, Moderate = 3, Severe = 4, Extreme or cannot do = 5.
const options = t({
  en: {
    1: 'None',
    2: 'Mild',
    3: 'Moderate',
    4: 'Severe',
    5: 'Extreme or cannot do'
  },
  es: {
    1: 'Ninguna',
    2: 'Leve',
    3: 'Moderada',
    4: 'Severa',
    5: 'Extrema o no puede hacerlo'
  }
});

const items = {
  s1: t({
    en: 'S1. Standing for long periods such as 30 minutes?',
    es: 'S1. Estar de pie durante largos períodos de tiempo, como por ejemplo 30 minutos'
  }),
  s2: t({
    en: 'S2. Taking care of your household responsibilities?',
    es: 'S2. Cumplir con sus quehaceres de la casa'
  }),
  s3: t({
    en: 'S3. Learning a new task, for example, learning how to get to a new place?',
    es: 'S3. Aprender una nueva tarea, por ejemplo, aprender cómo llegar a un lugar nuevo'
  }),
  s4: t({
    en: 'S4. How much of a problem did you have joining in community activities (for example, festivities, religious or other activities) in the same way as anyone else can?',
    es: 'S4. ¿Cuánta dificultad ha tenido para participar en actividades de la comunidad (por ejemplo, fiestas, actividades religiosas u otras actividades) de la misma forma que cualquier otra persona?'
  }),
  s5: t({
    en: 'S5. How much have you been emotionally affected by your health problems?',
    es: 'S5. ¿Cuánto le han afectado emocionalmente sus problemas de salud?'
  }),
  s6: t({
    en: 'S6. Concentrating on doing something for ten minutes?',
    es: 'S6. Concentrarse en hacer algo durante diez minutos'
  }),
  s7: t({
    en: 'S7. Walking a long distance such as a kilometre [or equivalent]?',
    es: 'S7. Caminar una distancia larga, como un kilómetro [o algo equivalente]'
  }),
  s8: t({
    en: 'S8. Washing your whole body?',
    es: 'S8. Bañarse (lavarse todo el cuerpo)'
  }),
  s9: t({
    en: 'S9. Getting dressed?',
    es: 'S9. Vestirse'
  }),
  s10: t({
    en: 'S10. Dealing with people you do not know?',
    es: 'S10. Relacionarse con personas que no conoce'
  }),
  s11: t({
    en: 'S11. Maintaining a friendship?',
    es: 'S11. Mantener una amistad'
  }),
  s12: t({
    en: 'S12. Your day-to-day work?',
    es: 'S12. Realizar su trabajo diario'
  })
};

type ItemKey = keyof typeof items;
const itemKeys = Object.keys(items) as ItemKey[];

const $Days = z.number().int().min(0).max(30);

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'WHODAS_2_12',
    edition: 1
  },
  tags: [t({ en: 'Disability', es: 'Discapacidad' }), t({ en: 'Functioning', es: 'Funcionamiento' })],
  details: {
    title: t({
      en: 'WHO Disability Assessment Schedule 2.0 (WHODAS 2.0), 12-item version, self-administered',
      es: 'Cuestionario para la Evaluación de Discapacidades de la OMS 2.0 (WHODAS 2.0), versión de 12 preguntas, autoadministrada'
    }),
    description: t({
      en: 'This questionnaire asks about difficulties due to health conditions. Health conditions include diseases or illnesses, other health problems that may be short or long lasting, injuries, mental or emotional problems, and problems with alcohol or drugs. WHODAS 2.0 © World Health Organization.',
      es: 'Este cuestionario pregunta sobre dificultades debidas a condiciones de salud. Las condiciones de salud incluyen enfermedades o dolencias, otros problemas de salud que pueden ser de corta o larga duración, lesiones, problemas mentales o emocionales, y problemas relacionados con el alcohol o las drogas. WHODAS 2.0 © Organización Mundial de la Salud.'
    }),
    authors: ['World Health Organization'],
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'This questionnaire asks about difficulties due to health conditions. Health conditions include diseases or illnesses, other health problems that may be short or long lasting, injuries, mental or emotional problems, and problems with alcohol or drugs. Think back over the past 30 days and answer these questions, thinking about how much difficulty you had doing the following activities. For each question, please circle only one response.',
        es: 'Este cuestionario pregunta sobre dificultades debidas a condiciones de salud. Las condiciones de salud incluyen enfermedades o dolencias, otros problemas de salud que pueden ser de corta o larga duración, lesiones, problemas mentales o emocionales, y problemas relacionados con el alcohol o las drogas. Piense en los últimos 30 días y responda estas preguntas pensando en cuánta dificultad tuvo para realizar las siguientes actividades. Para cada pregunta, marque solo una respuesta.'
      })
    ],
    license: 'UNLICENSED',
    referenceUrl: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule'
  },
  content: [
    {
      fields: {
        difficulty: {
          kind: 'number-record',
          label: t({
            en: 'In the past 30 days, how much difficulty did you have in:',
            es: 'En los últimos 30 días, cuánta dificultad ha tenido para:'
          }),
          items: Object.fromEntries(itemKeys.map((key) => [key, { label: items[key] }])) as {
            [K in ItemKey]: { label: string };
          },
          options,
          disableAutoPrefix: true,
          variant: 'likert'
        }
      }
    },
    {
      fields: {
        h1: {
          kind: 'number',
          label: t({
            en: 'H1. Overall, in the past 30 days, how many days were these difficulties present? (Record number of days)',
            es: 'H1. En general, en los últimos 30 días, ¿durante cuántos días tuvo estas dificultades? (Anote el número de días)'
          }),
          variant: 'input'
        },
        h2: {
          kind: 'number',
          label: t({
            en: 'H2. In the past 30 days, for how many days were you totally unable to carry out your usual activities or work because of any health condition? (Record number of days)',
            es: 'H2. En los últimos 30 días, ¿durante cuántos días no pudo realizar en absoluto sus actividades habituales o su trabajo debido a alguna condición de salud? (Anote el número de días)'
          }),
          variant: 'input'
        },
        h3: {
          kind: 'number',
          label: t({
            en: 'H3. In the past 30 days, not counting the days that you were totally unable, for how many days did you cut back or reduce your usual activities or work because of any health condition? (Record number of days)',
            es: 'H3. En los últimos 30 días, sin contar los días en que no pudo realizar en absoluto sus actividades, ¿durante cuántos días tuvo que recortar o reducir sus actividades habituales o su trabajo debido a alguna condición de salud? (Anote el número de días)'
          }),
          variant: 'input'
        }
      }
    }
  ],
  measures: {
    simpleScore: {
      kind: 'computed',
      label: t({
        en: 'Simple sum score, items S1-S12 (12-60)',
        es: 'Puntuación por suma simple, preguntas S1-S12 (12-60)'
      }),
      value: ({ difficulty }) => itemKeys.reduce((sum, key) => sum + difficulty[key], 0)
    },
    daysWithDifficulties: {
      kind: 'const',
      label: t({ en: 'H1. Days with difficulties', es: 'H1. Días con dificultades' }),
      ref: 'h1'
    },
    daysTotallyUnable: {
      kind: 'const',
      label: t({ en: 'H2. Days totally unable', es: 'H2. Días con incapacidad total' }),
      ref: 'h2'
    },
    daysReduced: {
      kind: 'const',
      label: t({ en: 'H3. Days with reduced activities', es: 'H3. Días con actividades reducidas' }),
      ref: 'h3'
    }
  },
  validationSchema: z
    .object({
      difficulty: z.object(Object.fromEntries(itemKeys.map((key) => [key, z.number().int().min(1).max(5)])) as {
        [K in ItemKey]: z.ZodNumber;
      }),
      h1: $Days,
      h2: $Days,
      h3: $Days
    })
    .superRefine((data, ctx) => {
      if (data.h2 + data.h3 > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t({
            en: 'The days in H2 and H3 together cannot be more than 30.',
            es: 'La suma de los días de H2 y H3 no puede ser mayor que 30.'
          }),
          path: ['h3']
        });
      }
    })
});
