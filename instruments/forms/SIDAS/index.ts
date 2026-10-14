import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { sum } from '/runtime/v1/lodash-es@4.x';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const $Response = z.number().int().min(0).max(10);
const $OptionalResponse = $Response.optional();

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: [
    t({ en: 'Suicide', es: 'Suicidio' }),
    t({ en: 'Mental Health', es: 'Salud mental' }),
    t({ en: 'Risk', es: 'Riesgo' })
  ],
  internal: {
    edition: 1,
    name: 'SIDAS'
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: t({
      en: ['Please answer each question by selecting a number from 0 to 10.'],
      es: ['Responda cada pregunta seleccionando un número del 0 al 10.']
    }),
    title: t({
      en: 'Suicidal Ideation Attributes Scale',
      es: 'Escala de Atributos de la Ideación Suicida (SIDAS)'
    })
  },
  details: {
    title: t({
      en: 'Suicidal Ideation Attributes Scale',
      es: 'Escala de Atributos de la Ideación Suicida (SIDAS)'
    }),
    description: t({
      en: 'A 5-item scale designed to screen individuals for the presence of suicidal thoughts and assess their severity, measuring frequency, controllability, closeness to attempt, distress, and impact on daily functioning.',
      es: 'Una escala de 5 ítems diseñada para detectar la presencia de pensamientos suicidas y evaluar su gravedad. Mide la frecuencia, el control, la cercanía a un intento, el malestar y el impacto en el funcionamiento diario.'
    }),
    license: 'FREE-NOS',
    referenceUrl: 'https://nceph.anu.edu.au/research/tools-resources/suicidal-ideation-attributes-scale-sidas',
    authors: ['Van Spijker BAJ', 'Batterham PJ', 'Calear AL', 'Farrer L', 'Christensen H', 'Reynolds J', 'Kerkhof AJFM']
  },
  content: {
    frequencyThoughts: {
      kind: 'number',
      label: t({
        en: '1. In the past month, how often have you had thoughts about suicide?',
        es: '1. Durante el último mes, ¿con qué frecuencia ha tenido pensamientos sobre el suicidio?'
      }),
      description: t({
        en: '0 = Never, 10 = Always',
        es: '0 = Nunca, 10 = Siempre'
      }),
      variant: 'slider',
      min: 0,
      max: 10
    },
    controlThoughts: {
      kind: 'dynamic',
      deps: ['frequencyThoughts'],
      render(data) {
        if (!data.frequencyThoughts) {
          return null;
        }
        return {
          kind: 'number',
          label: t({
            en: '2. In the past month, how much control have you had over these thoughts?',
            es: '2. Durante el último mes, ¿cuánto control ha tenido sobre estos pensamientos?'
          }),
          description: t({
            en: '0 = No control, 10 = Full control',
            es: '0 = Ningún control, 10 = Control total'
          }),
          variant: 'slider',
          min: 0,
          max: 10
        };
      }
    },
    attemptCloseness: {
      kind: 'dynamic',
      deps: ['frequencyThoughts'],
      render(data) {
        if (!data.frequencyThoughts) {
          return null;
        }
        return {
          kind: 'number',
          label: t({
            en: '3. In the past month, how close have you come to making a suicide attempt?',
            es: '3. Durante el último mes, ¿qué tan cerca ha estado de hacer un intento de suicidio?'
          }),
          description: t({
            en: '0 = Not close at all, 10 = Made an attempt',
            es: '0 = Nada cerca, 10 = Hice un intento'
          }),
          variant: 'slider',
          min: 0,
          max: 10
        };
      }
    },
    tormentExtent: {
      kind: 'dynamic',
      deps: ['frequencyThoughts'],
      render(data) {
        if (!data.frequencyThoughts) {
          return null;
        }
        return {
          kind: 'number',
          label: t({
            en: '4. In the past month, to what extent have you felt tormented by thoughts about suicide?',
            es: '4. Durante el último mes, ¿en qué medida se ha sentido atormentado/a por pensamientos sobre el suicidio?'
          }),
          description: t({
            en: '0 = Not at all, 10 = Extremely',
            es: '0 = Nada, 10 = Extremadamente'
          }),
          variant: 'slider',
          min: 0,
          max: 10
        };
      }
    },
    interference: {
      kind: 'dynamic',
      deps: ['frequencyThoughts'],
      render(data) {
        if (!data.frequencyThoughts) {
          return null;
        }
        return {
          kind: 'number',
          label: t({
            en: '5. In the past month, how much have thoughts about suicide interfered with your ability to carry out daily activities, such as work, household tasks or social activities?',
            es: '5. Durante el último mes, ¿cuánto han interferido los pensamientos sobre el suicidio con su capacidad para realizar actividades diarias, como el trabajo, las tareas del hogar o las actividades sociales?'
          }),
          description: t({
            en: '0 = Not at all, 10 = Extremely',
            es: '0 = Nada, 10 = Extremadamente'
          }),
          variant: 'slider',
          min: 0,
          max: 10
        };
      }
    }
  },
  measures: {
    frequencyThoughts: {
      kind: 'const',
      ref: 'frequencyThoughts',
      label: t({
        en: 'Frequency of suicidal thoughts',
        es: 'Frecuencia de los pensamientos suicidas'
      })
    },
    controlThoughts: {
      kind: 'computed',
      label: t({
        en: 'Control over thoughts (raw)',
        es: 'Control sobre los pensamientos (bruto)'
      }),
      value: ({ controlThoughts }) => controlThoughts ?? 0
    },
    attemptCloseness: {
      kind: 'computed',
      label: t({
        en: 'Closeness to attempt',
        es: 'Cercanía a un intento'
      }),
      value: ({ attemptCloseness }) => attemptCloseness ?? 0
    },
    tormentExtent: {
      kind: 'computed',
      label: t({
        en: 'Torment by thoughts',
        es: 'Tormento por los pensamientos'
      }),
      value: ({ tormentExtent }) => tormentExtent ?? 0
    },
    interference: {
      kind: 'computed',
      label: t({
        en: 'Interference with daily activities',
        es: 'Interferencia con las actividades diarias'
      }),
      value: ({ interference }) => interference ?? 0
    },
    totalScore: {
      kind: 'computed',
      label: t({
        en: 'Total Score',
        es: 'Puntuación total'
      }),
      value: ({ controlThoughts, frequencyThoughts, ...data }) => {
        if (frequencyThoughts === 0) {
          return 0;
        }
        return sum([frequencyThoughts, 10 - controlThoughts!, ...Object.values(data)]);
      }
    }
  },
  validationSchema: z
    .object({
      frequencyThoughts: $Response,
      controlThoughts: $OptionalResponse,
      attemptCloseness: $OptionalResponse,
      tormentExtent: $OptionalResponse,
      interference: $OptionalResponse
    })
    .superRefine((data, ctx) => {
      if (data.frequencyThoughts > 0) {
        const conditionalFields = ['controlThoughts', 'attemptCloseness', 'tormentExtent', 'interference'] as const;
        for (const field of conditionalFields) {
          if (data[field] === undefined) {
            ctx.addIssue({
              code: 'custom',
              path: [field],
              message: t({
                en: 'This field is required. / Ce champ est obligatoire.',
                es: 'Este campo es obligatorio.'
              })
            });
          }
        }
      }
    })
});
