import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const $Item = z.number().int().min(0).max(4);

const $Data = z.object({
  severity: z.object({
    fallingAsleep: $Item,
    stayingAsleep: $Item,
    wakingTooEarly: $Item
  }),
  satisfied: $Item,
  interfere: $Item,
  noticeable: $Item,
  worried: $Item
});

type Data = z.infer<typeof $Data>;

function totalScore(data: Data): number {
  return (
    data.severity.fallingAsleep +
    data.severity.stayingAsleep +
    data.severity.wakingTooEarly +
    data.satisfied +
    data.interfere +
    data.noticeable +
    data.worried
  );
}

const severityItems = {
  fallingAsleep: t({ en: 'Difficulty falling asleep', es: 'Dificultad para quedarse dormido/a' }),
  stayingAsleep: t({ en: 'Difficulty staying asleep', es: 'Dificultad para permanecer dormido/a' }),
  wakingTooEarly: t({ en: 'Problem waking up too early', es: 'Problema de despertarse demasiado temprano' })
};

type SeverityKey = keyof typeof severityItems;
const severityKeys = Object.keys(severityItems) as SeverityKey[];

function interpretation(total: number): string {
  if (total <= 7) {
    return t({ en: 'No clinically significant insomnia', es: 'Sin insomnio clínicamente significativo' });
  }
  if (total <= 14) {
    return t({ en: 'Subthreshold insomnia', es: 'Insomnio subumbral' });
  }
  if (total <= 21) {
    return t({ en: 'Clinical insomnia (moderate severity)', es: 'Insomnio clínico (gravedad moderada)' });
  }
  return t({ en: 'Clinical insomnia (severe)', es: 'Insomnio clínico (grave)' });
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'ISI',
    edition: 1
  },
  tags: [t({ en: 'Insomnia', es: 'Insomnio' }), t({ en: 'Sleep', es: 'Sueño' })],
  details: {
    title: t({ en: 'Insomnia Severity Index (ISI)', es: 'Índice de Gravedad del Insomnio (ISI)' }),
    description: t({
      en: 'The Insomnia Severity Index is a brief seven-item self-report screening tool for insomnia. It asks about the severity of sleep problems, satisfaction with sleep, interference with daily functioning, how noticeable the problem is to others, and distress. Reprinted from Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the insomnia severity index as an outcome measure for insomnia research. Sleep Medicine, 2, 297–307. Copyright © 2001, with permission from Elsevier.',
      es: 'El Índice de Gravedad del Insomnio es una breve herramienta de detección del insomnio, de autoinforme, con siete preguntas. Pregunta sobre la gravedad de los problemas de sueño, la satisfacción con el sueño, la interferencia con el funcionamiento diario, cuán notorio es el problema para los demás y la angustia. Reimpreso de Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the insomnia severity index as an outcome measure for insomnia research. Sleep Medicine, 2, 297–307. Copyright © 2001, con permiso de Elsevier.'
    }),
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'For each question, please choose the answer that best describes your sleep.',
        es: 'Para cada pregunta, elija la respuesta que mejor describa su sueño.'
      })
    ],
    license: 'UNLICENSED',
  },
  content: [
    {
      fields: {
        severity: {
          kind: 'number-record',
          variant: 'likert',
          label: t({
            en: '1. Please rate the current (i.e., last 2 weeks) SEVERITY of your insomnia problem(s).',
            es: '1. Califique la GRAVEDAD actual (es decir, de las últimas 2 semanas) de su(s) problema(s) de insomnio.'
          }),
          items: Object.fromEntries(
            severityKeys.map((key, index) => [key, { label: `${'abc'[index]}. ${severityItems[key]}` }])
          ) as { [K in SeverityKey]: { label: string } },
          options: t({
            en: { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe', 4: 'Very severe' },
            es: { 0: 'Ninguna', 1: 'Leve', 2: 'Moderada', 3: 'Grave', 4: 'Muy grave' }
          })
        },
        satisfied: {
          kind: 'number',
          variant: 'radio',
          disableAutoPrefix: true,
          label: t({
            en: '2. How SATISFIED/dissatisfied are you with your current sleep pattern?',
            es: '2. ¿Qué tan SATISFECHO/insatisfecho está con su patrón de sueño actual?'
          }),
          options: t({
            en: { 0: '0 – Very satisfied', 1: '1', 2: '2', 3: '3', 4: '4 – Very dissatisfied' },
            es: { 0: '0 – Muy satisfecho/a', 1: '1', 2: '2', 3: '3', 4: '4 – Muy insatisfecho/a' }
          })
        },
        interfere: {
          kind: 'number',
          variant: 'radio',
          label: t({
            en: '3. To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, ability to function at work/daily chores, concentration, memory, mood, etc.)?',
            es: '3. ¿En qué medida considera que su problema de sueño INTERFIERE con su funcionamiento diario (p. ej., fatiga durante el día, capacidad para funcionar en el trabajo o en las tareas diarias, concentración, memoria, estado de ánimo, etc.)?'
          }),
          options: t({
            en: { 0: 'Not at all interfering', 1: 'A little', 2: 'Somewhat', 3: 'Much', 4: 'Very much interfering' },
            es: { 0: 'No interfiere en absoluto', 1: 'Un poco', 2: 'Algo', 3: 'Mucho', 4: 'Interfiere muchísimo' }
          })
        },
        noticeable: {
          kind: 'number',
          variant: 'radio',
          label: t({
            en: '4. How NOTICEABLE to others do you think your sleeping problem is in terms of impairing the quality of your life?',
            es: '4. ¿Qué tan NOTORIO cree que es para los demás su problema de sueño en cuanto a cómo afecta su calidad de vida?'
          }),
          options: t({
            en: { 0: 'Not at all noticeable', 1: 'Barely', 2: 'Somewhat', 3: 'Much', 4: 'Very much noticeable' },
            es: { 0: 'Nada notorio', 1: 'Apenas', 2: 'Algo', 3: 'Mucho', 4: 'Muy notorio' }
          })
        },
        worried: {
          kind: 'number',
          variant: 'radio',
          label: t({
            en: '5. How WORRIED/distressed are you about your current sleep problem?',
            es: '5. ¿Qué tan PREOCUPADO/angustiado está por su problema de sueño actual?'
          }),
          options: t({
            en: { 0: 'Not at all', 1: 'A little', 2: 'Somewhat', 3: 'Much', 4: 'Very much' },
            es: { 0: 'Nada', 1: 'Un poco', 2: 'Algo', 3: 'Mucho', 4: 'Muchísimo' }
          })
        }
      }
    }
  ],
  measures: {
    totalScore: {
      kind: 'computed',
      label: t({ en: 'Total score (0-28)', es: 'Puntuación total (0-28)' }),
      value: totalScore
    },
    interpretation: {
      kind: 'computed',
      label: t({ en: 'Interpretation', es: 'Interpretación' }),
      value: (data) => interpretation(totalScore(data))
    }
  },
  validationSchema: $Data
});
