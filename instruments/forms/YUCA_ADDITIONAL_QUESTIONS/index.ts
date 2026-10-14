import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const yesNo = t({
  en: { true: 'Yes', false: 'No' },
  es: { true: 'Sí', false: 'No' }
});

const temperatureOptions = t({
  en: {
    muchTooCold: 'Much too cold',
    littleTooCold: 'A little too cold',
    satisfactory: 'Satisfactory',
    littleTooHot: 'A little too hot',
    muchTooHot: 'Much too hot'
  },
  es: {
    muchTooCold: 'Demasiado fría',
    littleTooCold: 'Un poco demasiado fría',
    satisfactory: 'Satisfactoria',
    littleTooHot: 'Un poco demasiado calurosa',
    muchTooHot: 'Demasiado calurosa'
  }
});

const humidityOptions = t({
  en: {
    muchTooDry: 'Much too dry',
    littleTooDry: 'A little too dry',
    satisfactory: 'Satisfactory',
    littleTooHumid: 'A little too humid',
    muchTooHumid: 'Much too humid'
  },
  es: {
    muchTooDry: 'Demasiado seca',
    littleTooDry: 'Un poco demasiado seca',
    satisfactory: 'Satisfactoria',
    littleTooHumid: 'Un poco demasiado húmeda',
    muchTooHumid: 'Demasiado húmeda'
  }
});

const $Temperature = z.enum(['muchTooCold', 'littleTooCold', 'satisfactory', 'littleTooHot', 'muchTooHot']);

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'YUCA_ADDITIONAL_QUESTIONS',
    edition: 1
  },
  tags: [t({ en: 'Follow-Up', es: 'Seguimiento' }), t({ en: 'Environment', es: 'Entorno' })],
  details: {
    title: t({ en: 'Additional Questions', es: 'Preguntas adicionales' }),
    description: t({
      en: 'Questions about changes since the last questionnaire, and about noise, temperature and humidity over the past 2 weeks.',
      es: 'Preguntas sobre cambios desde el último cuestionario y sobre el ruido, la temperatura y la humedad durante las últimas 2 semanas.'
    }),
    estimatedDuration: 1,
    instructions: [
      t({
        en: 'Please choose one answer for each question.',
        es: 'Elija una respuesta para cada pregunta.'
      })
    ],
    license: 'UNLICENSED'
  },
  content: [
    {
      title: t({ en: 'Changes since your last questionnaire', es: 'Cambios desde su último cuestionario' }),
      fields: {
        psychiatricMedicationChanged: {
          kind: 'boolean',
          label: t({
            en: 'Has your psychiatric medication changed since your last questionnaire?',
            es: '¿Ha cambiado su medicación psiquiátrica desde su último cuestionario?'
          }),
          options: yesNo,
          variant: 'radio'
        },
        otherMedicationChanged: {
          kind: 'boolean',
          label: t({
            en: 'Has your other medication changed since your last questionnaire?',
            es: '¿Ha cambiado su otra medicación desde su último cuestionario?'
          }),
          options: yesNo,
          variant: 'radio'
        },
        homeLocationChanged: {
          kind: 'boolean',
          label: t({
            en: 'Has your home location changed since your last questionnaire?',
            es: '¿Ha cambiado el lugar de su domicilio desde su último cuestionario?'
          }),
          options: yesNo,
          variant: 'radio'
        }
      }
    },
    {
      title: t({ en: 'Over the past 2 weeks', es: 'Durante las últimas 2 semanas' }),
      fields: {
        noiseDisturbedNights: {
          kind: 'string',
          label: t({
            en: 'Over the past 2 weeks, how many nights was your sleep disturbed by noise?',
            es: 'Durante las últimas 2 semanas, ¿cuántas noches fue perturbado su sueño por el ruido?'
          }),
          options: t({
            en: { never: 'Never', '1-2': '1-2 nights', '3-7': '3-7 nights', '8+': '8+ nights' },
            es: { never: 'Nunca', '1-2': '1-2 noches', '3-7': '3-7 noches', '8+': '8 o más noches' }
          }),
          variant: 'radio'
        },
        outdoorTemperature: {
          kind: 'string',
          label: t({
            en: 'Over the past 2 weeks, how have you perceived the temperature outdoors?',
            es: 'Durante las últimas 2 semanas, ¿cómo ha percibido la temperatura al aire libre?'
          }),
          options: temperatureOptions,
          variant: 'radio'
        },
        outdoorHumidity: {
          kind: 'string',
          label: t({
            en: 'Over the past 2 weeks, how have you perceived the humidity outdoors?',
            es: 'Durante las últimas 2 semanas, ¿cómo ha percibido la humedad al aire libre?'
          }),
          options: humidityOptions,
          variant: 'radio'
        },
        homeTemperature: {
          kind: 'string',
          label: t({
            en: 'Over the past 2 weeks, how have you perceived the temperature at home?',
            es: 'Durante las últimas 2 semanas, ¿cómo ha percibido la temperatura en su casa?'
          }),
          options: temperatureOptions,
          variant: 'radio'
        }
      }
    }
  ],
  measures: {
    psychiatricMedicationChanged: { kind: 'const', ref: 'psychiatricMedicationChanged' },
    otherMedicationChanged: { kind: 'const', ref: 'otherMedicationChanged' },
    homeLocationChanged: { kind: 'const', ref: 'homeLocationChanged' },
    noiseDisturbedNights: { kind: 'const', ref: 'noiseDisturbedNights' },
    outdoorTemperature: { kind: 'const', ref: 'outdoorTemperature' },
    outdoorHumidity: { kind: 'const', ref: 'outdoorHumidity' },
    homeTemperature: { kind: 'const', ref: 'homeTemperature' }
  },
  validationSchema: z.object({
    psychiatricMedicationChanged: z.boolean(),
    otherMedicationChanged: z.boolean(),
    homeLocationChanged: z.boolean(),
    noiseDisturbedNights: z.enum(['never', '1-2', '3-7', '8+']),
    outdoorTemperature: $Temperature,
    outdoorHumidity: z.enum(['muchTooDry', 'littleTooDry', 'satisfactory', 'littleTooHumid', 'muchTooHumid']),
    homeTemperature: $Temperature
  })
});
