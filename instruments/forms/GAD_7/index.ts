import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const likertOptions = t({
  en: {
    0: 'Not at All',
    1: 'Several Days',
    2: 'More than half the days',
    3: 'Nearly every day'
  },
  es: {
    0: 'Nunca',
    1: 'Varios días',
    2: 'Más de la mitad de los días',
    3: 'Casi todos los días'
  }
});

const calculateGAD7total = (data: { [key: string]: unknown }) => {
  let sum = 0;
  for (const key in data) {
    const value = data[key as keyof typeof data];
    if (typeof value === 'number' && key != 'difficultyCoping') {
      sum += value;
    }
  }
  return sum;
};

export default defineInstrument({
  details: {
    title: t({
      en: 'Generalized Anxiety Disorder-7 (GAD-7)',
      es: 'Trastorno de Ansiedad Generalizada-7 (GAD-7)'
    }),
    description: t({
      en: 'The Generalized Anxiety Disorder 7 (GAD-7) is a self-reported questionnaire for screening and severity measuring of generalized anxiety disorder (GAD). The GAD7 asks for self-reported anxiety symptoms over the past two weeks.',
      es: 'El Trastorno de Ansiedad Generalizada 7 (GAD-7) es un cuestionario de autoinforme para la detección y la medición de la gravedad del trastorno de ansiedad generalizada (TAG). El GAD-7 pregunta por los síntomas de ansiedad autoinformados durante las últimas dos semanas.'
    }),
    estimatedDuration: 1,
    instructions: t({
      en: ['Follow the instructions on the next page'],
      es: ['Siga las instrucciones de la página siguiente']
    }),
    license: 'PUBLIC-DOMAIN'
  },
  kind: 'FORM',
  language: 'en',
  tags: [t({ en: 'Anxiety', es: 'Ansiedad' })],
  internal: {
    name: 'GAD_7',
    edition: 1
  },
  content: [
    {
      title: t({
        en: 'Over the last two weeks, how often have you been bothered by the following problems?',
        es: 'Durante las últimas dos semanas, ¿con qué frecuencia le han molestado los siguientes problemas?'
      }),
      fields: {
        nervousAnxiousOnEdge: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado sentirse nervioso/a, ansioso/a o con los nervios de punta?'
          }),
          label: t({
            en: 'Feeling nervous, anxious, or on edge',
            es: 'Sentirse nervioso/a, ansioso/a o con los nervios de punta'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        noStopControlWorrying: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by not being able to stop or control worrying?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado no poder dejar de preocuparse o no poder controlar la preocupación?'
          }),
          label: t({
            en: 'Not being able to stop or control worrying',
            es: 'No poder dejar de preocuparse o no poder controlar la preocupación'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        worryingTooMuch: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by worrying too much about different things?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado preocuparse demasiado por diferentes cosas?'
          }),
          label: t({
            en: 'Worrying too much about different things',
            es: 'Preocuparse demasiado por diferentes cosas'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        troubleRelaxing: {
          description: t({
            en: 'Over the last two weeks, how often have you had trouble relaxing?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia ha tenido dificultad para relajarse?'
          }),
          label: t({
            en: 'Have trouble relaxing',
            es: 'Dificultad para relajarse'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        restless: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by being so restless that it is hard to sit still?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado estar tan inquieto/a que le cuesta quedarse quieto/a?'
          }),
          label: t({
            en: 'Being so restless that it is hard to sit still',
            es: 'Estar tan inquieto/a que le cuesta quedarse quieto/a'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        easilyAnnoyedIrritable: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by becoming easily annoyed or irritable?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado enojarse o irritarse con facilidad?'
          }),
          label: t({
            en: 'Becoming easily annoyed or irritable',
            es: 'Enojarse o irritarse con facilidad'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        },
        afraidSomethingAwful: {
          description: t({
            en: 'Over the last two weeks, how often have you been bothered by feeling afraid, as if something awful might happen?',
            es: 'Durante las últimas dos semanas, ¿con qué frecuencia le ha molestado sentir miedo, como si algo terrible pudiera pasar?'
          }),
          label: t({
            en: 'Feeling afraid, as if something awful might happen',
            es: 'Sentir miedo, como si algo terrible pudiera pasar'
          }),
          kind: 'number',
          options: likertOptions,
          variant: 'radio'
        }
      }
    },
    {
      title: t({
        en: ' ',
        es: ' '
      }),
      fields: {
        difficultyCoping: {
          kind: 'dynamic',
          deps: [
            'nervousAnxiousOnEdge',
            'noStopControlWorrying',
            'worryingTooMuch',
            'troubleRelaxing',
            'restless',
            'easilyAnnoyedIrritable',
            'afraidSomethingAwful'
          ],
          render(data) {
            if (
              !(
                data?.nervousAnxiousOnEdge ||
                data?.noStopControlWorrying ||
                data?.worryingTooMuch ||
                data?.troubleRelaxing ||
                data?.restless ||
                data?.easilyAnnoyedIrritable ||
                data?.afraidSomethingAwful
              )
            ) {
              return null;
            }
            return {
              description: t({
                en: 'Given your problems selected above, how difficult have they made it for you to do your work, take care of things at home, or get along with other people?',
                es: 'Según los problemas que seleccionó arriba, ¿qué tan difícil le han hecho hacer su trabajo, encargarse de las cosas de la casa o llevarse bien con otras personas?'
              }),
              label: t({
                en: 'Given your problems selected above, how difficult have they made it for you to do your work, take care of things at home, or get along with other people?',
                es: 'Según los problemas que seleccionó arriba, ¿qué tan difícil le han hecho hacer su trabajo, encargarse de las cosas de la casa o llevarse bien con otras personas?'
              }),
              kind: 'number',
              options: t({
                en: {
                  0: 'Not difficult at all',
                  1: 'Somewhat difficult',
                  2: 'Very difficult',
                  3: 'Extremely difficult'
                },
                es: {
                  0: 'Nada difícil',
                  1: 'Algo difícil',
                  2: 'Muy difícil',
                  3: 'Extremadamente difícil'
                }
              }),
              variant: 'radio'
            };
          }
        }
      }
    }
  ],
  measures: {
    nervousAnxiousOnEdge: {
      kind: 'const',
      ref: 'nervousAnxiousOnEdge'
    },
    noStopControlWorrying: {
      kind: 'const',
      ref: 'noStopControlWorrying'
    },
    worryingTooMuch: {
      kind: 'const',
      ref: 'worryingTooMuch'
    },
    troubleRelaxing: {
      kind: 'const',
      ref: 'troubleRelaxing'
    },
    restless: {
      kind: 'const',
      ref: 'restless'
    },
    easilyAnnoyedIrritable: {
      kind: 'const',
      ref: 'easilyAnnoyedIrritable'
    },
    afraidSomethingAwful: {
      kind: 'const',
      ref: 'afraidSomethingAwful'
    },
    difficultyCoping: {
      kind: 'const',
      ref: 'difficultyCoping'
    },
    gad7Total: {
      kind: 'computed',
      label: t({
        en: 'Total of GAD7',
        es: 'Puntuación total del GAD-7'
      }),
      value: (data) => {
        return calculateGAD7total(data);
      }
    }
  },
  validationSchema: z.object({
    nervousAnxiousOnEdge: z.number().int().min(0).max(3),
    noStopControlWorrying: z.number().int().min(0).max(3),
    worryingTooMuch: z.number().int().min(0).max(3),
    troubleRelaxing: z.number().int().min(0).max(3),
    restless: z.number().int().min(0).max(3),
    easilyAnnoyedIrritable: z.number().int().min(0).max(3),
    afraidSomethingAwful: z.number().int().min(0).max(3),
    difficultyCoping: z.number().int().min(0).max(3).optional()
  })
});
