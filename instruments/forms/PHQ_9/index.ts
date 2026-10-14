import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { omit, sum } from '/runtime/v1/lodash-es@4.x';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const $Response = z.number().int().min(0).max(3);

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: [t({ en: 'Health', es: 'Salud' }), t({ en: 'Depression', es: 'Depresión' })],
  internal: {
    edition: 1,
    name: 'PHQ_9'
  },
  content: [
    {
      title: t({
        en: 'Summary of Instructions',
        es: 'Resumen de las instrucciones'
      }),
      description: t({
        en: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        es: 'Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?'
      }),
      fields: {
        questions: {
          kind: 'number-record',
          label: t({
            en: 'Questions',
            es: 'Preguntas'
          }),
          items: {
            interestPleasure: {
              label: t({
                en: '1. Little interest or pleasure in doing things',
                es: '1. Poco interés o placer en hacer las cosas'
              })
            },
            feelingDown: {
              label: t({
                en: '2. Feeling down, depressed, or hopeless',
                es: '2. Sentirse decaído/a, deprimido/a o sin esperanza'
              })
            },
            sleepIssues: {
              label: t({
                en: '3. Trouble falling or staying asleep, or sleeping too much',
                es: '3. Dificultad para quedarse dormido/a o permanecer dormido/a, o dormir demasiado'
              })
            },
            energyLevel: {
              label: t({
                en: '4. Feeling tired or having little energy',
                es: '4. Sentirse cansado/a o tener poca energía'
              })
            },
            appetiteChanges: {
              label: t({
                en: '5. Poor appetite or overeating',
                es: '5. Poco apetito o comer en exceso'
              })
            },
            selfWorth: {
              label: t({
                en: '6. Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
                es: '6. Sentirse mal consigo mismo/a — o sentir que es un fracaso o que ha quedado mal consigo mismo/a o con su familia'
              })
            },
            concentrationIssues: {
              label: t({
                en: '7. Trouble concentrating on things, such as reading the newspaper or watching television',
                es: '7. Dificultad para concentrarse en las cosas, como leer el periódico o ver la televisión'
              })
            },
            psychomotorChanges: {
              label: t({
                en: '8. Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
                es: '8. ¿Moverse o hablar tan lento que otras personas podrían haberlo notado? O lo contrario — estar tan inquieto/a o agitado/a que se ha estado moviendo mucho más de lo normal'
              })
            },
            suicidalThoughts: {
              label: t({
                en: '9. Thoughts that you would be better off dead or of hurting yourself in some way',
                es: '9. Pensamientos de que estaría mejor muerto/a o de hacerse daño de alguna manera'
              })
            }
          },
          options: t({
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
          }),
          variant: 'likert'
        },
        impactOnFunctioning: {
          kind: 'dynamic',
          deps: ['questions'],
          render: (data) => {
            if (!data.questions || sum(Object.values(data.questions)) === 0) {
              return null;
            }
            return {
              disableAutoPrefix: true,
              kind: 'number',
              label: t({
                en: 'How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?',
                es: '¿Qué tan difícil le han hecho estos problemas hacer su trabajo, encargarse de las cosas de la casa o llevarse bien con otras personas?'
              }),
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
              variant: 'select'
            };
          }
        }
      }
    }
  ],
  clientDetails: {
    estimatedDuration: 1,
    instructions: t({
      en: [
        "You will answer 9 questions about how you've been feeling over the past 2 weeks. Answer each question as honestly as possible based on your feelings and experiences."
      ],
      es: [
        'Va a responder 9 preguntas sobre cómo se ha sentido durante las últimas 2 semanas. Responda cada pregunta con la mayor honestidad posible, según sus sentimientos y experiencias.'
      ]
    })
  },
  details: {
    description: t({
      en: 'The Patient Health Questionnaire (PHQ) is a diagnostic tool for mental health disorders used by health care professionals that is quick and easy for patients to complete. In the mid-1990s, Robert L. Spitzer, MD, Janet B.W. Williams, DSW, and Kurt Kroenke, MD, and colleagues at Columbia University developed the Primary Care Evaluation of Mental Disorders (PRIME-MD), a diagnostic tool containing modules on 12 different mental health disorders. They worked in collaboration with researchers at the Regenstrief Institute at Indiana University and with the support of an educational grant from Pfizer Inc. During the development of PRIME-MD, Drs. Spitzer, Williams and Kroenke, created the PHQ and GAD-7 screeners. The PHQ-9, a tool specific to depression, simply scores each of the 9 DSM-IV criteria based on the mood module from the original PRIME-MD.',
      es: 'El Cuestionario de Salud del Paciente (PHQ) es una herramienta de diagnóstico de trastornos de salud mental que usan los profesionales de la salud y que los pacientes pueden completar de forma rápida y sencilla. A mediados de la década de 1990, Robert L. Spitzer, MD, Janet B.W. Williams, DSW, y Kurt Kroenke, MD, junto con colegas de la Universidad de Columbia, desarrollaron la Evaluación de Trastornos Mentales en Atención Primaria (PRIME-MD), una herramienta de diagnóstico con módulos sobre 12 trastornos de salud mental diferentes. Trabajaron en colaboración con investigadores del Instituto Regenstrief de la Universidad de Indiana y con el apoyo de una beca educativa de Pfizer Inc. Durante el desarrollo del PRIME-MD, los doctores Spitzer, Williams y Kroenke crearon los instrumentos de detección PHQ y GAD-7. El PHQ-9, una herramienta específica para la depresión, simplemente puntúa cada uno de los 9 criterios del DSM-IV a partir del módulo del estado de ánimo del PRIME-MD original.'
    }),

    license: 'PUBLIC-DOMAIN',
    title: t({
      en: 'Patient Health Questionnaire (PHQ-9)',
      es: 'Cuestionario de Salud del Paciente (PHQ-9)'
    })
  },
  measures: {
    interestPleasure: {
      kind: 'computed',
      label: t({
        en: 'Little Interest/Pleasure',
        es: 'Poco interés/placer'
      }),
      value: ({ questions }) => questions.interestPleasure
    },
    feelingDown: {
      kind: 'computed',
      label: t({ en: 'Feeling Down/Depressed', es: 'Sentirse decaído/deprimido' }),
      value: ({ questions }) => questions.feelingDown
    },
    sleepIssues: {
      kind: 'computed',
      label: t({ en: 'Sleep Issues', es: 'Problemas de sueño' }),
      value: ({ questions }) => questions.sleepIssues
    },
    energyLevel: {
      kind: 'computed',
      label: t({ en: 'Low Energy', es: 'Poca energía' }),
      value: ({ questions }) => questions.energyLevel
    },
    appetiteChanges: {
      kind: 'computed',
      label: t({ en: 'Appetite Changes', es: 'Cambios en el apetito' }),
      value: ({ questions }) => questions.appetiteChanges
    },
    selfWorth: {
      kind: 'computed',
      label: t({ en: 'Low Self-Worth', es: 'Baja autoestima' }),
      value: ({ questions }) => questions.selfWorth
    },
    concentrationIssues: {
      kind: 'computed',
      label: t({ en: 'Concentration Issues', es: 'Problemas de concentración' }),
      value: ({ questions }) => questions.concentrationIssues
    },
    psychomotorChanges: {
      kind: 'computed',
      label: t({ en: 'Psychomotor Changes', es: 'Cambios psicomotores' }),
      value: ({ questions }) => questions.psychomotorChanges
    },
    suicidalThoughts: {
      kind: 'computed',
      label: t({ en: 'Suicidal Thoughts', es: 'Pensamientos suicidas' }),
      value: ({ questions }) => questions.suicidalThoughts
    },
    impactOnFunctioning: {
      kind: 'computed',
      label: t({ en: 'Impact on Functioning', es: 'Impacto en el funcionamiento' }),
      value: ({ impactOnFunctioning }) => impactOnFunctioning
    },
    totalScore: {
      kind: 'computed',
      label: t({ en: 'Total Score', es: 'Puntuación total' }),
      value: ({ questions }) => sum(Object.values(omit(questions, 'impactOnFunctioning')))
    }
  },
  validationSchema: z
    .object({
      questions: z.object({
        interestPleasure: $Response,
        feelingDown: $Response,
        sleepIssues: $Response,
        energyLevel: $Response,
        appetiteChanges: $Response,
        selfWorth: $Response,
        concentrationIssues: $Response,
        psychomotorChanges: $Response,
        suicidalThoughts: $Response
      }),
      impactOnFunctioning: $Response.optional()
    })
    .superRefine(({ impactOnFunctioning, questions }, ctx) => {
      const isAnyNonZero = sum(Object.values(questions)) > 0;
      // If any response is not zero, then impactOnFunctioning is required
      if (isAnyNonZero && impactOnFunctioning === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: t({
            en: 'This question is required / Cette question est obligatoire',
            es: 'Esta pregunta es obligatoria'
          }),
          path: ['impactOnFunctioning']
        });
      }
    })
});
