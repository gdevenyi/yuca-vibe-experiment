import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

type Activity = 'moderate' | 'vigorous' | 'walking';

const MET_VALUES: { [K in Activity]: number } = { walking: 3.3, moderate: 4.0, vigorous: 8.0 };
const MINIMUM_BOUT_MINUTES = 10;
const MAXIMUM_MINUTES_PER_DAY = 180;
const MAXIMUM_TOTAL_DAILY_ACTIVITY_MINUTES = 960;

const $Days = z.number().int().min(0).max(7);
const $Hours = z.number().min(0).max(24).optional();
const $Minutes = z.number().int().min(0).max(1440).optional();

const $Data = z
  .object({
    vigorousDays: $Days,
    vigorousHours: $Hours,
    vigorousMinutes: $Minutes,
    vigorousDontKnow: z.boolean().optional(),
    moderateDays: $Days,
    moderateHours: $Hours,
    moderateMinutes: $Minutes,
    moderateDontKnow: z.boolean().optional(),
    walkingDays: $Days,
    walkingHours: $Hours,
    walkingMinutes: $Minutes,
    walkingDontKnow: z.boolean().optional(),
    sittingHours: $Hours,
    sittingMinutes: $Minutes,
    sittingDontKnow: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    const checkTime = (prefix: 'moderate' | 'sitting' | 'vigorous' | 'walking', asked: boolean) => {
      if (!asked) {
        return;
      }
      const hours = data[`${prefix}Hours`];
      const minutes = data[`${prefix}Minutes`];
      const dontKnow = data[`${prefix}DontKnow`] === true;
      const hasTime = hours !== undefined || minutes !== undefined;
      if (dontKnow && hasTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`${prefix}Hours`],
          message: t({
            en: 'Enter the time or tick "Don\'t know/Not sure", not both.',
            es: 'Escriba el tiempo o marque "No sabe/No está seguro/a", pero no ambos.'
          })
        });
      }
      if (!dontKnow && !hasTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`${prefix}Hours`],
          message: t({
            en: 'Enter the hours and/or minutes per day, or tick "Don\'t know/Not sure".',
            es: 'Escriba las horas y/o los minutos por día, o marque "No sabe/No está seguro/a".'
          })
        });
      }
      if ((hours ?? 0) * 60 + (minutes ?? 0) > 1440) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`${prefix}Minutes`],
          message: t({
            en: 'The time per day cannot be more than 24 hours.',
            es: 'El tiempo por día no puede ser mayor de 24 horas.'
          })
        });
      }
    };
    checkTime('vigorous', data.vigorousDays > 0);
    checkTime('moderate', data.moderateDays > 0);
    checkTime('walking', data.walkingDays > 0);
    checkTime('sitting', true);
  });

type Data = z.infer<typeof $Data>;

type ActivityTime = { days: number; minutesPerDay: number };

/** Minutes per day as reported, or `null` for "Don't know/Not sure". Days = 0 gives 0 minutes. */
function reportedTime(data: Data, activity: Activity): ActivityTime | null {
  const days = data[`${activity}Days`];
  if (days === 0) {
    return { days: 0, minutesPerDay: 0 };
  }
  if (data[`${activity}DontKnow`] === true) {
    return null;
  }
  return { days, minutesPerDay: (data[`${activity}Hours`] ?? 0) * 60 + (data[`${activity}Minutes`] ?? 0) };
}

/** IPAQ short form protocol: bouts under 10 minutes are recoded to zero, and time per day is truncated to 180 minutes. */
function cleanedTime(time: ActivityTime): ActivityTime {
  if (time.minutesPerDay < MINIMUM_BOUT_MINUTES) {
    return { days: 0, minutesPerDay: 0 };
  }
  return { days: time.days, minutesPerDay: Math.min(time.minutesPerDay, MAXIMUM_MINUTES_PER_DAY) };
}

type Scores = {
  category: 'High' | 'Low' | 'Moderate';
  metMinutes: { [K in Activity]: number } & { total: number };
};

type ScoringResult = { reason: 'dontKnow' | 'outlier' } | { reason: null; scores: Scores };

const activities: Activity[] = ['vigorous', 'moderate', 'walking'];

function score(data: Data): ScoringResult {
  const reported = activities.map((activity) => reportedTime(data, activity));
  if (reported.some((time) => time === null)) {
    return { reason: 'dontKnow' };
  }
  const [vigorousRaw, moderateRaw, walkingRaw] = reported as ActivityTime[];
  if (vigorousRaw!.minutesPerDay + moderateRaw!.minutesPerDay + walkingRaw!.minutesPerDay > MAXIMUM_TOTAL_DAILY_ACTIVITY_MINUTES) {
    return { reason: 'outlier' };
  }
  const vigorous = cleanedTime(vigorousRaw!);
  const moderate = cleanedTime(moderateRaw!);
  const walking = cleanedTime(walkingRaw!);

  const metMinutes = {
    vigorous: MET_VALUES.vigorous * vigorous.minutesPerDay * vigorous.days,
    moderate: MET_VALUES.moderate * moderate.minutesPerDay * moderate.days,
    walking: MET_VALUES.walking * walking.minutesPerDay * walking.days
  };
  const total = metMinutes.vigorous + metMinutes.moderate + metMinutes.walking;
  const totalDays = vigorous.days + moderate.days + walking.days;

  let category: Scores['category'] = 'Low';
  if ((vigorous.days >= 3 && total >= 1500) || (totalDays >= 7 && total >= 3000)) {
    category = 'High';
  } else if (
    (vigorous.days >= 3 && vigorous.minutesPerDay >= 20) ||
    (moderate.minutesPerDay >= 30 ? moderate.days : 0) + (walking.minutesPerDay >= 30 ? walking.days : 0) >= 5 ||
    (totalDays >= 5 && total >= 600)
  ) {
    category = 'Moderate';
  }
  return { reason: null, scores: { category, metMinutes: { ...metMinutes, total } } };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

const categoryLabels = {
  High: t({ en: 'High', es: 'Alto' }),
  Moderate: t({ en: 'Moderate', es: 'Moderado' }),
  Low: t({ en: 'Low', es: 'Bajo' })
};

function daysOptions(none: { en: string; es: string }) {
  return t({
    en: {
      0: none.en,
      1: '1 day',
      2: '2 days',
      3: '3 days',
      4: '4 days',
      5: '5 days',
      6: '6 days',
      7: '7 days'
    },
    es: {
      0: none.es,
      1: '1 día',
      2: '2 días',
      3: '3 días',
      4: '4 días',
      5: '5 días',
      6: '6 días',
      7: '7 días'
    }
  });
}

const daysPerWeekHint = t({ en: 'Days per week', es: 'Días por semana' });

const hoursPerDay = t({ en: 'Hours per day', es: 'Horas por día' });
const minutesPerDay = t({ en: 'Minutes per day', es: 'Minutos por día' });
const timeHint = t({
  en: 'Enter hours and/or minutes per day. If you do not know, tick "Don\'t know/Not sure".',
  es: 'Escriba las horas y/o los minutos por día. Si no lo sabe, marque "No sabe/No está seguro/a".'
});
const dontKnowLabel = t({ en: "Don't know/Not sure", es: 'No sabe/No está seguro/a' });

function timeFields(activity: Activity, question: string) {
  const isAsked = (data: { [key: string]: unknown }) => {
    const days = data[`${activity}Days`];
    return typeof days === 'number' && days > 0;
  };
  return {
    [`${activity}Hours`]: {
      kind: 'dynamic',
      deps: [`${activity}Days`],
      render: (data: { [key: string]: unknown }) =>
        isAsked(data)
          ? { kind: 'number', variant: 'input', label: `${question} — ${hoursPerDay}`, description: timeHint }
          : null
    },
    [`${activity}Minutes`]: {
      kind: 'dynamic',
      deps: [`${activity}Days`],
      render: (data: { [key: string]: unknown }) =>
        isAsked(data) ? { kind: 'number', variant: 'input', label: minutesPerDay } : null
    },
    [`${activity}DontKnow`]: {
      kind: 'dynamic',
      deps: [`${activity}Days`],
      render: (data: { [key: string]: unknown }) =>
        isAsked(data) ? { kind: 'boolean', variant: 'checkbox', label: dontKnowLabel } : null
    }
  } as const;
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'IPAQ_SF',
    edition: 1
  },
  tags: [t({ en: 'Physical Activity', es: 'Actividad física' })],
  details: {
    title: t({
      en: 'International Physical Activity Questionnaire – Short Form (IPAQ-SF)',
      es: 'Cuestionario Internacional de Actividad Física – Versión corta (IPAQ-SF)'
    }),
    description: t({
      en: 'The International Physical Activity Questionnaire (IPAQ), short last 7 days self-administered format (revised August 2002), for use with young and middle-aged adults (15-69 years). It estimates walking, moderate and vigorous physical activity in MET-minutes per week and time spent sitting.',
      es: 'Cuestionario Internacional de Actividad Física (IPAQ), versión corta autoadministrada de los últimos 7 días (revisada en agosto de 2002), para adultos jóvenes y de mediana edad (15-69 años). Estima la actividad física de caminata, moderada y vigorosa en MET-minutos por semana y el tiempo que pasa sentado/a.'
    }),
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'We are interested in finding out about the kinds of physical activities that people do as part of their everyday lives. The questions will ask you about the time you spent being physically active in the last 7 days. Please answer each question even if you do not consider yourself to be an active person. Please think about the activities you do at work, as part of your house and yard work, to get from place to place, and in your spare time for recreation, exercise or sport.',
        es: 'Nos interesa conocer los tipos de actividad física que las personas realizan como parte de su vida diaria. Las preguntas se refieren al tiempo que usted pasó físicamente activo/a en los últimos 7 días. Responda cada pregunta aunque no se considere una persona activa. Piense en las actividades que realiza en el trabajo, como parte de las tareas de la casa y del jardín, para ir de un lugar a otro, y en su tiempo libre para recreación, ejercicio o deporte.'
      })
    ],
    license: 'UNLICENSED',
    referenceUrl: 'https://sites.google.com/site/theipaq/',
    sourceUrl: 'https://sites.google.com/site/theipaq/'
  },
  content: [
    {
      title: t({ en: 'Vigorous activities', es: 'Actividades vigorosas' }),
      description: t({
        en: 'Think about all the vigorous activities that you did in the last 7 days. Vigorous physical activities refer to activities that take hard physical effort and make you breathe much harder than normal. Think only about those physical activities that you did for at least 10 minutes at a time.',
        es: 'Piense en todas las actividades vigorosas que realizó en los últimos 7 días. Las actividades físicas vigorosas son las que requieren un gran esfuerzo físico y le hacen respirar mucho más fuerte de lo normal. Piense solo en las actividades físicas que realizó durante al menos 10 minutos seguidos.'
      }),
      fields: {
        vigorousDays: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: '1. During the last 7 days, on how many days did you do vigorous physical activities like heavy lifting, digging, aerobics, or fast bicycling?',
            es: '1. Durante los últimos 7 días, ¿en cuántos días realizó actividades físicas vigorosas como levantar objetos pesados, cavar, hacer aeróbicos o andar rápido en bicicleta?'
          }),
          description: daysPerWeekHint,
          options: daysOptions({
            en: 'No vigorous physical activities',
            es: 'Ninguna actividad física vigorosa'
          })
        },
        ...timeFields(
          'vigorous',
          t({
            en: '2. How much time did you usually spend doing vigorous physical activities on one of those days?',
            es: '2. ¿Cuánto tiempo dedicó normalmente a actividades físicas vigorosas en uno de esos días?'
          })
        )
      }
    },
    {
      title: t({ en: 'Moderate activities', es: 'Actividades moderadas' }),
      description: t({
        en: 'Think about all the moderate activities that you did in the last 7 days. Moderate activities refer to activities that take moderate physical effort and make you breathe somewhat harder than normal. Think only about those physical activities that you did for at least 10 minutes at a time.',
        es: 'Piense en todas las actividades moderadas que realizó en los últimos 7 días. Las actividades moderadas son las que requieren un esfuerzo físico moderado y le hacen respirar algo más fuerte de lo normal. Piense solo en las actividades físicas que realizó durante al menos 10 minutos seguidos.'
      }),
      fields: {
        moderateDays: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: '3. During the last 7 days, on how many days did you do moderate physical activities like carrying light loads, bicycling at a regular pace, or doubles tennis? Do not include walking.',
            es: '3. Durante los últimos 7 días, ¿en cuántos días realizó actividades físicas moderadas como cargar objetos livianos, andar en bicicleta a ritmo normal o jugar tenis en dobles? No incluya caminar.'
          }),
          description: daysPerWeekHint,
          options: daysOptions({
            en: 'No moderate physical activities',
            es: 'Ninguna actividad física moderada'
          })
        },
        ...timeFields(
          'moderate',
          t({
            en: '4. How much time did you usually spend doing moderate physical activities on one of those days?',
            es: '4. ¿Cuánto tiempo dedicó normalmente a actividades físicas moderadas en uno de esos días?'
          })
        )
      }
    },
    {
      title: t({ en: 'Walking', es: 'Caminata' }),
      description: t({
        en: 'Think about the time you spent walking in the last 7 days. This includes at work and at home, walking to travel from place to place, and any other walking that you have done solely for recreation, sport, exercise, or leisure.',
        es: 'Piense en el tiempo que pasó caminando en los últimos 7 días. Esto incluye caminar en el trabajo y en la casa, caminar para ir de un lugar a otro y cualquier otra caminata que haya hecho únicamente por recreación, deporte, ejercicio u ocio.'
      }),
      fields: {
        walkingDays: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: '5. During the last 7 days, on how many days did you walk for at least 10 minutes at a time?',
            es: '5. Durante los últimos 7 días, ¿en cuántos días caminó durante al menos 10 minutos seguidos?'
          }),
          description: daysPerWeekHint,
          options: daysOptions({ en: 'No walking', es: 'No caminó' })
        },
        ...timeFields(
          'walking',
          t({
            en: '6. How much time did you usually spend walking on one of those days?',
            es: '6. ¿Cuánto tiempo pasó normalmente caminando en uno de esos días?'
          })
        )
      }
    },
    {
      title: t({ en: 'Sitting', es: 'Tiempo sentado/a' }),
      description: t({
        en: 'The last question is about the time you spent sitting on weekdays during the last 7 days. Include time spent at work, at home, while doing course work and during leisure time. This may include time spent sitting at a desk, visiting friends, reading, or sitting or lying down to watch television.',
        es: 'La última pregunta se refiere al tiempo que pasó sentado/a en los días entre semana durante los últimos 7 días. Incluya el tiempo en el trabajo, en la casa, mientras hacía tareas de estudio y durante el tiempo libre. Puede incluir el tiempo sentado/a en un escritorio, visitando amigos, leyendo, o sentado/a o acostado/a mirando televisión.'
      }),
      fields: {
        sittingHours: {
          kind: 'number',
          variant: 'input',
          label: t({
            en: '7. During the last 7 days, how much time did you spend sitting on a week day? — Hours per day',
            es: '7. Durante los últimos 7 días, ¿cuánto tiempo pasó sentado/a en un día entre semana? — Horas por día'
          }),
          description: timeHint
        },
        sittingMinutes: {
          kind: 'number',
          variant: 'input',
          label: minutesPerDay
        },
        sittingDontKnow: {
          kind: 'boolean',
          variant: 'checkbox',
          label: dontKnowLabel
        }
      }
    }
  ],
  measures: {
    walkingMetMinutes: {
      kind: 'computed',
      label: t({ en: 'Walking MET-minutes/week', es: 'MET-minutos/semana de caminata' }),
      value: (data) => {
        const result = score(data);
        return result.reason === null ? round(result.scores.metMinutes.walking) : undefined;
      }
    },
    moderateMetMinutes: {
      kind: 'computed',
      label: t({ en: 'Moderate MET-minutes/week', es: 'MET-minutos/semana de actividad moderada' }),
      value: (data) => {
        const result = score(data);
        return result.reason === null ? round(result.scores.metMinutes.moderate) : undefined;
      }
    },
    vigorousMetMinutes: {
      kind: 'computed',
      label: t({ en: 'Vigorous MET-minutes/week', es: 'MET-minutos/semana de actividad vigorosa' }),
      value: (data) => {
        const result = score(data);
        return result.reason === null ? round(result.scores.metMinutes.vigorous) : undefined;
      }
    },
    totalMetMinutes: {
      kind: 'computed',
      label: t({ en: 'Total physical activity MET-minutes/week', es: 'MET-minutos/semana de actividad física total' }),
      value: (data) => {
        const result = score(data);
        return result.reason === null ? round(result.scores.metMinutes.total) : undefined;
      }
    },
    activityCategory: {
      kind: 'computed',
      label: t({ en: 'Physical activity category', es: 'Categoría de actividad física' }),
      value: (data) => {
        const result = score(data);
        return result.reason === null ? categoryLabels[result.scores.category] : undefined;
      }
    },
    scoringNote: {
      kind: 'computed',
      label: t({ en: 'Scoring note', es: 'Nota de puntuación' }),
      value: (data) => {
        const { reason } = score(data);
        if (reason === 'dontKnow') {
          return t({
            en: 'Not scored: "Don\'t know/Not sure" was given for an activity time.',
            es: 'Sin puntuación: se respondió "No sabe/No está seguro/a" en un tiempo de actividad.'
          });
        }
        if (reason === 'outlier') {
          return t({
            en: 'Not scored: walking + moderate + vigorous time is more than 960 minutes per day (protocol outlier rule).',
            es: 'Sin puntuación: el tiempo de caminata + moderada + vigorosa es mayor de 960 minutos por día (regla de valores atípicos del protocolo).'
          });
        }
        return t({
          en: 'Scored per the IPAQ short form protocol (bouts under 10 minutes set to 0; time per day truncated to 180 minutes).',
          es: 'Puntuado según el protocolo del IPAQ versión corta (episodios de menos de 10 minutos = 0; tiempo por día truncado a 180 minutos).'
        });
      }
    },
    sittingMinutesPerWeekday: {
      kind: 'computed',
      label: t({ en: 'Sitting minutes per weekday', es: 'Minutos sentado/a por día entre semana' }),
      value: (data) =>
        data.sittingDontKnow === true ? undefined : (data.sittingHours ?? 0) * 60 + (data.sittingMinutes ?? 0)
    }
  },
  validationSchema: $Data
});
