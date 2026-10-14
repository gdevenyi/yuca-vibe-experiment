import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const questions = [
  {
    en: 'Do familiar surroundings sometimes seem strange, confusing, threatening or unreal to you?',
    es: '¿Los lugares conocidos a veces le parecen extraños, confusos, amenazantes o irreales?'
  },
  {
    en: 'Have you heard unusual sounds like banging, clicking, hissing, clapping or ringing in your ears?',
    es: '¿Ha escuchado sonidos inusuales como golpes, chasquidos, silbidos, aplausos o zumbidos en los oídos?'
  },
  {
    en: 'Do things that you see appear different from the way they usually do (brighter or duller, larger or smaller, or changed in some other way)?',
    es: '¿Las cosas que ve parecen diferentes de como son normalmente (más brillantes u opacas, más grandes o más pequeñas, o cambiadas de alguna otra forma)?'
  },
  {
    en: 'Have you had experiences with telepathy, psychic forces, or fortune telling?',
    es: '¿Ha tenido experiencias de telepatía, fuerzas psíquicas o adivinación del futuro?'
  },
  {
    en: 'Have you felt that you are not in control of your own ideas or thoughts?',
    es: '¿Ha sentido que no tiene el control de sus propias ideas o pensamientos?'
  },
  {
    en: 'Do you have difficulty getting your point across, because you ramble or go off the track a lot when you talk?',
    es: '¿Tiene dificultad para hacerse entender porque divaga o se desvía mucho del tema cuando habla?'
  },
  {
    en: 'Do you have strong feelings or beliefs about being unusually gifted or talented in some way?',
    es: '¿Tiene sentimientos o creencias fuertes de que tiene algún don o talento fuera de lo común?'
  },
  {
    en: 'Do you feel that other people are watching you or talking about you?',
    es: '¿Siente que otras personas lo/la observan o hablan de usted?'
  },
  {
    en: 'Do you sometimes get strange feelings on or just beneath your skin, like bugs crawling?',
    es: '¿A veces tiene sensaciones extrañas sobre la piel o justo debajo de ella, como si caminaran insectos?'
  },
  {
    en: 'Do you sometimes feel suddenly distracted by distant sounds that you are not normally aware of?',
    es: '¿A veces se distrae de repente por sonidos lejanos que normalmente no nota?'
  },
  {
    en: 'Have you had the sense that some person or force is around you, although you couldn’t see anyone?',
    es: '¿Ha tenido la sensación de que alguna persona o fuerza está a su alrededor, aunque no podía ver a nadie?'
  },
  {
    en: 'Do you worry at times that something may be wrong with your mind?',
    es: '¿A veces le preocupa que algo pueda estar mal en su mente?'
  },
  {
    en: "Have you ever felt that you don't exist, the world does not exist, or that you are dead?",
    es: '¿Alguna vez ha sentido que usted no existe, que el mundo no existe o que está muerto/a?'
  },
  {
    en: 'Have you been confused at times whether something you experienced was real or imaginary?',
    es: '¿A veces ha tenido dudas sobre si algo que vivió era real o imaginario?'
  },
  {
    en: 'Do you hold beliefs that other people would find unusual or bizarre?',
    es: '¿Tiene creencias que otras personas considerarían inusuales o extrañas?'
  },
  {
    en: 'Do you feel that parts of your body have changed in some way, or that parts of your body are working differently?',
    es: '¿Siente que partes de su cuerpo han cambiado de alguna forma, o que partes de su cuerpo funcionan de manera diferente?'
  },
  {
    en: 'Are your thoughts sometimes so strong that you can almost hear them?',
    es: '¿Sus pensamientos a veces son tan fuertes que casi puede escucharlos?'
  },
  {
    en: 'Do you find yourself feeling mistrustful or suspicious of other people?',
    es: '¿Se siente desconfiado/a o receloso/a de otras personas?'
  },
  {
    en: 'Have you seen unusual things like flashes, flames, blinding light, or geometric figures?',
    es: '¿Ha visto cosas inusuales como destellos, llamas, luces cegadoras o figuras geométricas?'
  },
  {
    en: "Have you seen things that other people can't see or don't seem to see?",
    es: '¿Ha visto cosas que otras personas no pueden ver o parecen no ver?'
  },
  {
    en: 'Do people sometimes find it hard to understand what you are saying?',
    es: '¿A las personas a veces les cuesta entender lo que usted dice?'
  }
] as const;

type ItemNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21;
type ItemKey = `item${ItemNumber}`;
type DistressKey = `distress${ItemNumber}`;

const itemNumbers = questions.map((_, i) => (i + 1) as ItemNumber);

const yesNoOptions = t({
  en: { true: 'YES', false: 'NO' },
  es: { true: 'SÍ', false: 'NO' }
});

const distressLabel = t({
  en: 'If YES: When this happens, I feel frightened, concerned, or it causes problems for me:',
  es: 'Si respondió SÍ: Cuando esto ocurre, me siento asustado/a, preocupado/a, o me causa problemas:'
});

const distressOptions = t({
  en: {
    1: 'Strongly disagree',
    2: 'disagree',
    3: 'neutral',
    4: 'agree',
    5: 'strongly agree'
  },
  es: {
    1: 'Muy en desacuerdo',
    2: 'En desacuerdo',
    3: 'Neutral',
    4: 'De acuerdo',
    5: 'Muy de acuerdo'
  }
});

type PQBData = { [K in ItemKey]: boolean } & { [K in DistressKey]?: number };

/** Builds the yes/no field and the dynamic distress field for each item number. */
function buildFields(numbers: ItemNumber[]) {
  return Object.fromEntries(
    numbers.flatMap((n) => [
      [
        `item${n}`,
        {
          kind: 'boolean',
          label: `${n}. ${t(questions[n - 1]!)}`,
          options: yesNoOptions,
          variant: 'radio'
        }
      ],
      [
        `distress${n}`,
        {
          kind: 'dynamic',
          deps: [`item${n}`],
          render: (data: Partial<PQBData>) => {
            if (data[`item${n}`] !== true) {
              return null;
            }
            return {
              disableAutoPrefix: true,
              kind: 'number',
              label: distressLabel,
              options: distressOptions,
              variant: 'radio'
            };
          }
        }
      ]
    ])
  ) as any;
}

const yesCount = (data: PQBData) => itemNumbers.filter((n) => data[`item${n}`]).length;

const distressSum = (data: PQBData) =>
  itemNumbers.reduce((sum, n) => sum + (data[`item${n}`] ? (data[`distress${n}`] ?? 0) : 0), 0);

const shape = Object.fromEntries(
  itemNumbers.flatMap((n) => [
    [`item${n}`, z.boolean()],
    [`distress${n}`, z.number().int().min(1).max(5).optional()]
  ])
) as { [K in ItemKey]: z.ZodBoolean } & { [K in DistressKey]: z.ZodOptional<z.ZodNumber> };

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'PQ_B',
    edition: 1
  },
  tags: [t({ en: 'Psychosis', es: 'Psicosis' }), t({ en: 'Screening', es: 'Tamizaje' })],
  details: {
    title: t({ en: 'Prodromal Questionnaire – Brief (PQ-B)', es: 'Cuestionario Prodrómico – Breve (PQ-B)' }),
    description: t({
      en: 'The PQ-B is a 21-item self-report screening questionnaire for psychosis-risk (prodromal) symptoms in the past month, with a distress rating for each endorsed item. PQ-B by Rachel Loewy, PhD and Tyrone D. Cannon, PhD. © University of California, May 2010.',
      es: 'El PQ-B es un cuestionario de tamizaje de autoinforme de 21 preguntas sobre síntomas de riesgo de psicosis (prodrómicos) durante el último mes, con una calificación de malestar para cada pregunta afirmativa. PQ-B por Rachel Loewy, PhD y Tyrone D. Cannon, PhD. © University of California, mayo de 2010.'
    }),
    authors: ['Rachel Loewy', 'Tyrone D. Cannon'],
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'Please indicate whether you have had the following thoughts, feelings and experiences in the past month by checking “yes” or “no” for each item. Do not include experiences that occur only while under the influence of alcohol, drugs or medications that were not prescribed to you. If you answer “YES” to an item, also indicate how distressing that experience has been for you.',
        es: 'Indique si ha tenido los siguientes pensamientos, sentimientos y experiencias durante el último mes marcando “sí” o “no” en cada pregunta. No incluya experiencias que ocurren solo bajo los efectos del alcohol, de drogas o de medicamentos que no le fueron recetados. Si responde “SÍ” a una pregunta, indique también cuánto malestar le ha causado esa experiencia.'
      })
    ],
    license: 'UNLICENSED'
  },
  content: [
    {
      title: t({ en: 'Items 1–10', es: 'Preguntas 1–10' }),
      fields: buildFields(itemNumbers.slice(0, 10))
    },
    {
      title: t({ en: 'Items 11–21', es: 'Preguntas 11–21' }),
      fields: buildFields(itemNumbers.slice(10))
    }
  ],
  measures: {
    totalScore: {
      kind: 'computed',
      label: t({
        en: 'Total score (number of YES answers, 0-21)',
        es: 'Puntuación total (número de respuestas SÍ, 0-21)'
      }),
      value: (data) => yesCount(data)
    },
    distressScore: {
      kind: 'computed',
      label: t({
        en: 'Distress score (sum of distress ratings for YES items, 0-105)',
        es: 'Puntuación de malestar (suma de las calificaciones de malestar de las preguntas SÍ, 0-105)'
      }),
      value: (data) => distressSum(data)
    }
  },
  validationSchema: z.object(shape).superRefine((data, ctx) => {
    for (const n of itemNumbers) {
      if (data[`item${n}`] && data[`distress${n}`] === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t({
            en: 'Please rate how distressing this experience has been for you.',
            es: 'Indique cuánto malestar le ha causado esta experiencia.'
          }),
          path: [`distress${n}`]
        });
      }
    }
  })
});
