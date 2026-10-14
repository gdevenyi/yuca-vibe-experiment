import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

type Options = { 0: string; 1: string; 2: string; 3: string; 4: string };

const severity = t<Options>({
  en: { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe', 4: 'Extreme' },
  es: { 0: 'Ninguno', 1: 'Leve', 2: 'Moderado', 3: 'Severo', 4: 'Extremo' }
});

const hoursPreoccupied = t<Options>({
  en: { 0: 'None', 1: '1 hr or less', 2: '1-7 hr', 3: '7-21 hr', 4: 'over 21 hr' },
  es: { 0: 'Ninguna', 1: '1 h o menos', 2: '1-7 h', 3: '7-21 h', 4: 'más de 21 h' }
});

const intensity = t<Options>({
  en: { 0: 'None', 1: 'Minimal', 2: 'Moderate', 3: 'Much', 4: 'Extreme' },
  es: { 0: 'Ninguna', 1: 'Mínima', 2: 'Moderada', 3: 'Mucha', 4: 'Extrema' }
});

const questions: { label: string; options: Options }[] = [
  {
    label: t({
      en: '1. If you had unwanted urges to gamble during the past WEEK, on average, how strong were your urges? Please circle the most appropriate number.',
      es: '1. Si tuvo impulsos no deseados de apostar durante la última SEMANA, en promedio, ¿qué tan fuertes fueron sus impulsos? Marque el número más apropiado.'
    }),
    options: severity
  },
  {
    label: t({
      en: '2. During the past WEEK, how many times did you experience urges to gamble? Please circle the most appropriate number.',
      es: '2. Durante la última SEMANA, ¿cuántas veces sintió impulsos de apostar? Marque el número más apropiado.'
    }),
    options: t<Options>({
      en: {
        0: 'None',
        1: 'Once',
        2: 'Two to three times',
        3: 'Several to many times',
        4: 'Constant or near constant'
      },
      es: {
        0: 'Ninguna',
        1: 'Una vez',
        2: 'De dos a tres veces',
        3: 'Varias o muchas veces',
        4: 'Constante o casi constante'
      }
    })
  },
  {
    label: t({
      en: '3. During the past WEEK, how many hours (add up hours) were you preoccupied with your urges to gamble? Please circle the most appropriate number.',
      es: '3. Durante la última SEMANA, ¿cuántas horas (sume las horas) estuvo preocupado/a por sus impulsos de apostar? Marque el número más apropiado.'
    }),
    options: hoursPreoccupied
  },
  {
    label: t({
      en: '4. During the past WEEK, how much were you able to control your urges? Please circle the most appropriate number.',
      es: '4. Durante la última SEMANA, ¿cuánto pudo controlar sus impulsos? Marque el número más apropiado.'
    }),
    options: t<Options>({
      en: { 0: 'Complete', 1: 'Much', 2: 'Moderate', 3: 'Minimal', 4: 'No control' },
      es: { 0: 'Completo', 1: 'Mucho', 2: 'Moderado', 3: 'Mínimo', 4: 'Sin control' }
    })
  },
  {
    label: t({
      en: '5. During the past WEEK, how often did thoughts about gambling and placing bets come up? Please circle the most appropriate answer.',
      es: '5. Durante la última SEMANA, ¿con qué frecuencia tuvo pensamientos sobre el juego y sobre hacer apuestas? Marque la respuesta más apropiada.'
    }),
    options: t<Options>({
      en: {
        0: 'None',
        1: 'Once',
        2: 'Two to four times',
        3: 'Several to many times',
        4: 'Constantly or near constantly'
      },
      es: {
        0: 'Ninguna',
        1: 'Una vez',
        2: 'De dos a cuatro veces',
        3: 'Varias o muchas veces',
        4: 'Constantemente o casi constantemente'
      }
    })
  },
  {
    label: t({
      en: '6. During the past WEEK, approximately how many hours (add up hours) did you spend thinking about gambling and thinking about placing bets? Please circle the most appropriate number.',
      es: '6. Durante la última SEMANA, ¿aproximadamente cuántas horas (sume las horas) pasó pensando en el juego y en hacer apuestas? Marque el número más apropiado.'
    }),
    options: hoursPreoccupied
  },
  {
    label: t({
      en: '7. During the past WEEK, how much were you able to control your thoughts of gambling? Please circle the most appropriate number.',
      es: '7. Durante la última SEMANA, ¿cuánto pudo controlar sus pensamientos sobre el juego? Marque el número más apropiado.'
    }),
    options: t<Options>({
      en: { 0: 'Complete', 1: 'Much', 2: 'Moderate', 3: 'Minimal', 4: 'None' },
      es: { 0: 'Completo', 1: 'Mucho', 2: 'Moderado', 3: 'Mínimo', 4: 'Ninguno' }
    })
  },
  {
    label: t({
      en: '8. During the past WEEK, approximately how much total time did you spend gambling or on gambling related activities. Please circle the most appropriate number.',
      es: '8. Durante la última SEMANA, ¿aproximadamente cuánto tiempo en total pasó apostando o en actividades relacionadas con el juego? Marque el número más apropiado.'
    }),
    options: t<Options>({
      en: { 0: 'None', 1: '2 hr or less', 2: '2-7 hr', 3: '7-21 hr', 4: 'over 21 hr' },
      es: { 0: 'Ninguno', 1: '2 h o menos', 2: '2-7 h', 3: '7-21 h', 4: 'más de 21 h' }
    })
  },
  {
    label: t({
      en: '9. During the past WEEK, on average, how much anticipatory tension and/or excitement did you have shortly before you engaged in gambling? If you did not actually gamble, please estimate how much tension and/or excitement you believe you would have experienced if you had gambled. Please circle the most appropriate number.',
      es: '9. Durante la última SEMANA, en promedio, ¿cuánta tensión y/o emoción anticipatoria tuvo poco antes de apostar? Si no apostó realmente, calcule cuánta tensión y/o emoción cree que habría sentido si hubiera apostado. Marque el número más apropiado.'
    }),
    options: intensity
  },
  {
    label: t({
      en: '10. During the past WEEK, on average, how much excitement and pleasure did you feel when you won on your bet. If you did not actually win at gambling, please estimate how much excitement and pleasure you would have experienced if you had won. Please circle the most appropriate number.',
      es: '10. Durante la última SEMANA, en promedio, ¿cuánta emoción y placer sintió cuando ganó una apuesta? Si no ganó realmente en el juego, calcule cuánta emoción y placer habría sentido si hubiera ganado. Marque el número más apropiado.'
    }),
    options: intensity
  },
  {
    label: t({
      en: '11. During the past WEEK, how much emotional distress (mental pain or anguish, shame, guilt, embarrassment) has your gambling caused you? Please circle the most appropriate number.',
      es: '11. Durante la última SEMANA, ¿cuánto malestar emocional (dolor mental o angustia, vergüenza, culpa, bochorno) le ha causado el juego? Marque el número más apropiado.'
    }),
    options: severity
  },
  {
    label: t({
      en: '12. During the past WEEK, how much personal trouble (relationship, financial, legal, job, medical or health) has your gambling caused you? Please circle the most appropriate number.',
      es: '12. Durante la última SEMANA, ¿cuántos problemas personales (de pareja o relaciones, económicos, legales, laborales, médicos o de salud) le ha causado el juego? Marque el número más apropiado.'
    }),
    options: severity
  }
];

type ItemKey =
  | 'item1'
  | 'item2'
  | 'item3'
  | 'item4'
  | 'item5'
  | 'item6'
  | 'item7'
  | 'item8'
  | 'item9'
  | 'item10'
  | 'item11'
  | 'item12';

const itemKeys = questions.map((_, i) => `item${i + 1}`) as ItemKey[];

/** Builds the radio field for each item, with the item's own 0-4 options. */
function buildFields(keys: ItemKey[]) {
  return Object.fromEntries(
    keys.map((key) => {
      const question = questions[itemKeys.indexOf(key)]!;
      return [key, { kind: 'number', label: question.label, options: question.options, variant: 'radio' }];
    })
  ) as { [K in ItemKey]?: { kind: 'number'; label: string; options: Options; variant: 'radio' } };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'G_SAS',
    edition: 1
  },
  tags: [t({ en: 'Gambling', es: 'Juego de apuestas' }), t({ en: 'Addiction', es: 'Adicción' })],
  details: {
    title: t({
      en: 'Gambling Symptom Assessment Scale (G-SAS)',
      es: 'Escala de Evaluación de Síntomas de Juego (G-SAS)'
    }),
    description: t({
      en: 'The G-SAS is a 12-item self-report scale that measures the severity of gambling symptoms during the past week. Copyright notice: The Gambling Assessment Scale (G-SAS) is copyrighted by Suck Won Kim, M.D. Permission has been granted to reproduce the scale for clinicians to use in their practice and for researchers to use in non-industry studies. For other uses of the scale, the owner of the copyright should be contacted. Citation: Kim S.W., Grant J.E., Adson D., Shin Y.C.: Double-blind naltrexone and placebo comparison study in the treatment of pathological gambling. Biological Psychiatry 49:914-921, 2001.',
      es: 'La G-SAS es una escala de autoinforme de 12 preguntas que mide la gravedad de los síntomas relacionados con el juego de apuestas durante la última semana. Aviso de derechos de autor: La Gambling Assessment Scale (G-SAS) tiene derechos de autor de Suck Won Kim, M.D. Se ha concedido permiso para reproducir la escala para que los clínicos la usen en su práctica y para que los investigadores la usen en estudios no financiados por la industria. Para otros usos de la escala, se debe contactar al titular de los derechos de autor. Cita: Kim S.W., Grant J.E., Adson D., Shin Y.C.: Double-blind naltrexone and placebo comparison study in the treatment of pathological gambling. Biological Psychiatry 49:914-921, 2001.'
    }),
    authors: ['Suck Won Kim'],
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'The following questionnaire is aimed at evaluating gambling symptoms. Please read the questions carefully before you answer.',
        es: 'El siguiente cuestionario tiene como objetivo evaluar los síntomas relacionados con el juego de apuestas. Lea las preguntas con atención antes de responder.'
      })
    ],
    license: 'UNLICENSED',
    referenceUrl: 'https://doi.org/10.1016/S0006-3223(01)01079-4'
  },
  content: [
    {
      title: t({ en: 'Questions 1–6', es: 'Preguntas 1–6' }),
      fields: buildFields(itemKeys.slice(0, 6))
    },
    {
      title: t({ en: 'Questions 7–12', es: 'Preguntas 7–12' }),
      fields: buildFields(itemKeys.slice(6))
    }
  ],
  measures: {
    totalScore: {
      kind: 'computed',
      label: t({ en: 'Total score (0-48)', es: 'Puntuación total (0-48)' }),
      value: (data) => itemKeys.reduce((sum, key) => sum + data[key], 0)
    }
  },
  validationSchema: z.object(
    Object.fromEntries(itemKeys.map((key) => [key, z.number().int().min(0).max(4)])) as {
      [K in ItemKey]: z.ZodNumber;
    }
  )
});
