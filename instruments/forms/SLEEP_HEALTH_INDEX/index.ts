import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const CLOCK_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const $ClockTime = z.string().regex(CLOCK_TIME_PATTERN, {
  message: t({
    en: 'Enter the time as HH:MM on a 24-hour clock (for example 22:30 or 07:15).',
    es: 'Escriba la hora como HH:MM en formato de 24 horas (por ejemplo 22:30 o 07:15).'
  })
});

const dayCountKeys = ['0', '1', '2', '3', '4', '5', '6', '7', 'dontKnowRefused'] as const;
const $DayCount = z.enum(dayCountKeys);

const dayCountOptions = t({
  en: {
    0: '0 days',
    1: '1 day',
    2: '2 days',
    3: '3 days',
    4: '4 days',
    5: '5 days',
    6: '6 days',
    7: '7 days',
    dontKnowRefused: "Don't know / refused"
  },
  es: {
    0: '0 días',
    1: '1 día',
    2: '2 días',
    3: '3 días',
    4: '4 días',
    5: '5 días',
    6: '6 días',
    7: '7 días',
    dontKnowRefused: 'No sabe / prefiere no responder'
  }
});

const nightCountOptions = t({
  en: {
    0: '0 nights',
    1: '1 night',
    2: '2 nights',
    3: '3 nights',
    4: '4 nights',
    5: '5 nights',
    6: '6 nights',
    7: '7 nights',
    dontKnowRefused: "Don't know / refused"
  },
  es: {
    0: '0 noches',
    1: '1 noche',
    2: '2 noches',
    3: '3 noches',
    4: '4 noches',
    5: '5 noches',
    6: '6 noches',
    7: '7 noches',
    dontKnowRefused: 'No sabe / prefiere no responder'
  }
});

const clockTimeHint = t({
  en: 'Clock time, 24-hour format HH:MM (for example 22:30 for 10:30 p.m., 07:15 for 7:15 a.m.).',
  es: 'Hora del reloj, formato de 24 horas HH:MM (por ejemplo 22:30 para las 10:30 p. m., 07:15 para las 7:15 a. m.).'
});

function minutesSinceMidnight(clockTime: string): number {
  const [hours, minutes] = clockTime.split(':').map(Number);
  return hours! * 60 + minutes!;
}

function hoursBetween(bedTime: string, wakeTime: string): number {
  const minutes = (minutesSinceMidnight(wakeTime) - minutesSinceMidnight(bedTime) + 1440) % 1440;
  return Math.round((minutes / 60) * 100) / 100;
}

const copyright = t({
  en: "Sleep Health Index® is a federally registered trademark of the National Sleep Foundation, a 501(c)3 non-profit organization. Copyright © 2017 National Sleep Foundation. All rights reserved. The Sleep Health Index® does not provide medical advice and is not intended as a sole means for patient diagnosis. It is not a substitute for professional medical advice, diagnosis or treatment.",
  es: 'Sleep Health Index® es una marca registrada a nivel federal de la National Sleep Foundation, una organización sin fines de lucro 501(c)3. Copyright © 2017 National Sleep Foundation. Todos los derechos reservados. El Sleep Health Index® no ofrece consejo médico y no está destinado a ser el único medio de diagnóstico. No sustituye el consejo, el diagnóstico ni el tratamiento médico profesional.'
});

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'SLEEP_HEALTH_INDEX',
    edition: 1
  },
  tags: [t({ en: 'Sleep', es: 'Sueño' })],
  details: {
    title: t({ en: 'Sleep Health Index®', es: 'Índice de Salud del Sueño (Sleep Health Index®)' }),
    description: t({
      en: 'The Sleep Health Index® is a 14-question survey of sleep quality, sleep duration, disordered sleep and sleep-related behaviours. ',
      es: 'El Sleep Health Index® es una encuesta de 14 preguntas sobre la calidad del sueño, la duración del sueño, los trastornos del sueño y las conductas relacionadas con el sueño. '
    }).concat(copyright),
    estimatedDuration: 4,
    // ODC joins instruction entries with ', ', so the sentences are one entry.
    instructions: [
      t({
        en: 'Please answer each question about your sleep. Enter clock times in 24-hour format (HH:MM). ',
        es: 'Responda cada pregunta sobre su sueño. Escriba las horas en formato de 24 horas (HH:MM). '
      }).concat(copyright)
    ],
    license: 'UNLICENSED',
    referenceUrl: 'https://www.thensf.org/sleep-health-index/'
  },
  content: [
    {
      fields: {
        sleepQuality: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: "1. In general, how would you rate your sleep quality? Would you say it's excellent, very good, good, only fair, or poor?",
            es: '1. En general, ¿cómo calificaría la calidad de su sueño? ¿Diría que es excelente, muy buena, buena, solo regular o mala?'
          }),
          options: t({
            en: { excellent: 'Excellent', veryGood: 'Very good', good: 'Good', onlyFair: 'Only fair', poor: 'Poor' },
            es: { excellent: 'Excelente', veryGood: 'Muy buena', good: 'Buena', onlyFair: 'Solo regular', poor: 'Mala' }
          })
        },
        bedTimeWorkdays: {
          kind: 'string',
          variant: 'input',
          placeholder: 'HH:MM',
          label: t({
            en: '2. Thinking about just the past 7 days, what time did you most often go to bed on workdays? Please answer about weekdays if you did not work last week.',
            es: '2. Pensando solo en los últimos 7 días, ¿a qué hora se acostó con más frecuencia los días de trabajo? Si no trabajó la semana pasada, responda sobre los días entre semana.'
          }),
          description: clockTimeHint
        },
        bedTimeFreeDays: {
          kind: 'string',
          variant: 'input',
          placeholder: 'HH:MM',
          label: t({
            en: '3. What about on non-work days or weekends – what time did you most often go to bed on those days?',
            es: '3. ¿Y en los días que no trabaja o los fines de semana? ¿A qué hora se acostó con más frecuencia esos días?'
          }),
          description: clockTimeHint
        },
        wakeTimeWorkdays: {
          kind: 'string',
          variant: 'input',
          placeholder: 'HH:MM',
          label: t({
            en: '4. What time did you most often wake up for the day on work days or weekdays?',
            es: '4. ¿A qué hora se despertó con más frecuencia para empezar el día en los días de trabajo o entre semana?'
          }),
          description: clockTimeHint
        },
        wakeTimeFreeDays: {
          kind: 'string',
          variant: 'input',
          placeholder: 'HH:MM',
          label: t({
            en: '5. What about on non-work days or weekends – what time did you most often wake up for the day on those days?',
            es: '5. ¿Y en los días que no trabaja o los fines de semana? ¿A qué hora se despertó con más frecuencia para empezar el día esos días?'
          }),
          description: clockTimeHint
        },
        daysWellRested: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '6. During the past 7 days, how many days did you wake up feeling well-rested, if any?',
            es: '6. Durante los últimos 7 días, ¿cuántos días se despertó sintiéndose bien descansado/a, si hubo alguno?'
          }),
          options: dayCountOptions
        },
        nightsTroubleFallingAsleep: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '7. How many nights did you have trouble falling asleep?',
            es: '7. ¿Cuántas noches tuvo dificultad para quedarse dormido/a?'
          }),
          options: nightCountOptions
        },
        nightsTroubleStayingAsleep: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '8. And how many nights did you have trouble staying asleep?',
            es: '8. ¿Y cuántas noches tuvo dificultad para permanecer dormido/a?'
          }),
          options: nightCountOptions
        },
        daysSleepImpactedActivities: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '9. Still thinking about the past 7 days, how many days did poor or insufficient sleep significantly impact your daily activities, like your work performance, socializing, exercising, or other typical activities?',
            es: '9. Pensando todavía en los últimos 7 días, ¿cuántos días el sueño malo o insuficiente afectó de forma importante sus actividades diarias, como su desempeño en el trabajo, su vida social, el ejercicio u otras actividades habituales?'
          }),
          options: dayCountOptions
        },
        daysFellAsleepUnintentionally: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '10. How many days did you fall asleep without intending to, such as dozing off in front of the TV or in any other situation?',
            es: '10. ¿Cuántos días se quedó dormido/a sin querer, por ejemplo, cabeceando frente a la televisión o en cualquier otra situación?'
          }),
          options: dayCountOptions
        },
        nightsSleepMedication: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '11. How many nights did you take over-the-counter or prescription medication to help you sleep?',
            es: '11. ¿Cuántas noches tomó medicamentos de venta libre o con receta para ayudarle a dormir?'
          }),
          options: nightCountOptions
        },
        toldSleepDisorder: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '12. Have you ever been told by a doctor that you have a sleep disorder, such as insomnia or sleep apnea, or not?',
            es: '12. ¿Alguna vez un médico le ha dicho que tiene un trastorno del sueño, como insomnio o apnea del sueño, o no?'
          }),
          options: t({
            en: { yes: 'Yes', no: 'No', dontKnow: "Don't know" },
            es: { yes: 'Sí', no: 'No', dontKnow: 'No sabe' }
          })
        },
        discussedSleepProblems: {
          kind: 'string',
          variant: 'radio',
          label: t({
            en: '13. Have you ever discussed any sleep problems you were having with a doctor or medical professional, or has this not come up?',
            es: '13. ¿Alguna vez ha hablado de algún problema de sueño que tenía con un médico o profesional de la salud, o no ha surgido el tema?'
          }),
          options: t({
            en: { yes: 'Yes', no: 'No', dontKnowRefused: "Don't know / refused" },
            es: { yes: 'Sí', no: 'No', dontKnowRefused: 'No sabe / prefiere no responder' }
          })
        },
        sleepNeedHours: {
          kind: 'number',
          variant: 'input',
          label: t({
            en: '14. How many hours of sleep do you need per day to be well-rested and feel your best?',
            es: '14. ¿Cuántas horas de sueño necesita al día para estar bien descansado/a y sentirse en su mejor forma?'
          }),
          description: t({
            en: "Hours per day, from 0 to 24. If you don't know, leave this empty and tick the box below.",
            es: 'Horas por día, de 0 a 24. Si no sabe, deje este espacio vacío y marque la casilla de abajo.'
          })
        },
        sleepNeedDontKnowRefused: {
          kind: 'boolean',
          variant: 'checkbox',
          label: t({
            en: "Question 14: Don't know / refused",
            es: 'Pregunta 14: No sabe / prefiere no responder'
          })
        }
      }
    }
  ],
  measures: {
    timeInBedWorkdays: {
      kind: 'computed',
      label: t({
        en: 'Hours from usual bedtime to usual wake time, workdays (items 2 and 4)',
        es: 'Horas desde la hora habitual de acostarse hasta la de despertarse, días de trabajo (preguntas 2 y 4)'
      }),
      value: ({ bedTimeWorkdays, wakeTimeWorkdays }) => hoursBetween(bedTimeWorkdays, wakeTimeWorkdays)
    },
    timeInBedFreeDays: {
      kind: 'computed',
      label: t({
        en: 'Hours from usual bedtime to usual wake time, non-work days (items 3 and 5)',
        es: 'Horas desde la hora habitual de acostarse hasta la de despertarse, días libres (preguntas 3 y 5)'
      }),
      value: ({ bedTimeFreeDays, wakeTimeFreeDays }) => hoursBetween(bedTimeFreeDays, wakeTimeFreeDays)
    },
    sleepNeedHours: {
      kind: 'const',
      label: t({
        en: 'Hours of sleep needed per day (item 14)',
        es: 'Horas de sueño necesarias por día (pregunta 14)'
      }),
      ref: 'sleepNeedHours'
    }
  },
  validationSchema: z
    .object({
      sleepQuality: z.enum(['excellent', 'veryGood', 'good', 'onlyFair', 'poor']),
      bedTimeWorkdays: $ClockTime,
      bedTimeFreeDays: $ClockTime,
      wakeTimeWorkdays: $ClockTime,
      wakeTimeFreeDays: $ClockTime,
      daysWellRested: $DayCount,
      nightsTroubleFallingAsleep: $DayCount,
      nightsTroubleStayingAsleep: $DayCount,
      daysSleepImpactedActivities: $DayCount,
      daysFellAsleepUnintentionally: $DayCount,
      nightsSleepMedication: $DayCount,
      toldSleepDisorder: z.enum(['yes', 'no', 'dontKnow']),
      discussedSleepProblems: z.enum(['yes', 'no', 'dontKnowRefused']),
      sleepNeedHours: z.number().min(0).max(24).optional(),
      sleepNeedDontKnowRefused: z.boolean().optional()
    })
    .superRefine((data, ctx) => {
      const dontKnow = data.sleepNeedDontKnowRefused === true;
      if (dontKnow && data.sleepNeedHours !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sleepNeedHours'],
          message: t({
            en: "Enter the number of hours or tick \"Don't know / refused\", not both.",
            es: 'Escriba el número de horas o marque "No sabe / prefiere no responder", pero no ambos.'
          })
        });
      }
      if (!dontKnow && data.sleepNeedHours === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sleepNeedHours'],
          message: t({
            en: "Enter the number of hours, or tick \"Don't know / refused\".",
            es: 'Escriba el número de horas o marque "No sabe / prefiere no responder".'
          })
        });
      }
    })
});
