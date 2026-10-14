import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

const options = t({
  en: {
    1: 'Never',
    2: 'Rarely',
    3: 'Sometimes',
    4: 'Often'
  },
  es: {
    1: 'Nunca',
    2: 'Rara vez',
    3: 'A veces',
    4: 'A menudo'
  }
});

const statements = [
  { en: 'I feel in tune with the people around me.', es: 'Me siento en sintonía con las personas que me rodean.' },
  { en: 'I lack companionship.', es: 'Me falta compañía.' },
  { en: 'There is no one I can turn to.', es: 'No hay nadie a quien pueda acudir.' },
  { en: 'I do not feel alone.', es: 'No me siento solo/a.' },
  { en: 'I feel part of a group of friends.', es: 'Me siento parte de un grupo de amigos.' },
  {
    en: 'I have a lot in common with the people around me.',
    es: 'Tengo mucho en común con las personas que me rodean.'
  },
  { en: 'I am no longer close to anyone.', es: 'Ya no me siento cercano/a a nadie.' },
  {
    en: 'My interests and ideas are not shared by those around me.',
    es: 'Las personas que me rodean no comparten mis intereses ni mis ideas.'
  },
  { en: 'I am an outgoing person.', es: 'Soy una persona sociable.' },
  { en: 'There are people I feel close to.', es: 'Hay personas con las que me siento cercano/a.' },
  { en: 'I feel left out.', es: 'Me siento excluido/a.' },
  { en: 'My social relationships are superficial.', es: 'Mis relaciones sociales son superficiales.' },
  { en: 'No one really knows me well.', es: 'Nadie me conoce realmente bien.' },
  { en: 'I feel isolated from others.', es: 'Me siento aislado/a de los demás.' },
  {
    en: 'I can find companionship when I want it.',
    es: 'Puedo encontrar compañía cuando la quiero.'
  },
  {
    en: 'There are people who really understand me.',
    es: 'Hay personas que realmente me entienden.'
  },
  { en: 'I am unhappy being so withdrawn.', es: 'Me siento infeliz por estar tan retraído/a.' },
  { en: 'People are around me but not with me.', es: 'Hay personas a mi alrededor, pero no conmigo.' },
  { en: 'There are people I can talk to.', es: 'Hay personas con las que puedo hablar.' },
  { en: 'There are people I can turn to.', es: 'Hay personas a las que puedo acudir.' }
] as const;

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
  | 'item12'
  | 'item13'
  | 'item14'
  | 'item15'
  | 'item16'
  | 'item17'
  | 'item18'
  | 'item19'
  | 'item20';

const itemKeys = statements.map((_, i) => `item${i + 1}`) as ItemKey[];

/** Items 1, 5, 6, 9, 10, 15, 16, 19, 20 are reverse scored (1 <-> 4, 2 <-> 3). */
const reverseScored = new Set<ItemKey>(['item1', 'item5', 'item6', 'item9', 'item10', 'item15', 'item16', 'item19', 'item20']);

const totalScore = (responses: { [K in ItemKey]: number }) =>
  itemKeys.reduce((sum, key) => sum + (reverseScored.has(key) ? 5 - responses[key] : responses[key]), 0);

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'UCLA_LONELINESS_SCALE',
    edition: 1
  },
  tags: [t({ en: 'Loneliness', es: 'Soledad' }), t({ en: 'Social Relationships', es: 'Relaciones sociales' })],
  details: {
    title: t({ en: 'Revised UCLA Loneliness Scale', es: 'Escala de Soledad UCLA Revisada' }),
    description: t({
      en: 'The Revised UCLA Loneliness Scale is a 20-item self-report measure of subjective feelings of loneliness and social isolation. Russell, D., Peplau, L.A., & Cutrona, C.E. (1980). The revised UCLA Loneliness Scale: Concurrent and discriminant validity evidence. Journal of Personality and Social Psychology, 39, 472-480. Interpretation bands: Deckx, L., van den Akker, M., & Buntinx, F. (2014). European Journal of Oncology Nursing, 18(5), 466–477.',
      es: 'La Escala de Soledad UCLA Revisada es una medida de autoinforme de 20 afirmaciones sobre los sentimientos subjetivos de soledad y aislamiento social. Russell, D., Peplau, L.A., y Cutrona, C.E. (1980). The revised UCLA Loneliness Scale: Concurrent and discriminant validity evidence. Journal of Personality and Social Psychology, 39, 472-480. Rangos de interpretación: Deckx, L., van den Akker, M., y Buntinx, F. (2014). European Journal of Oncology Nursing, 18(5), 466–477.'
    }),
    authors: ['Daniel W. Russell', 'Letitia Anne Peplau', 'Carolyn E. Cutrona'],
    estimatedDuration: 5,
    instructions: [
      t({
        en: 'Indicate how often each of the statements below is descriptive of you.',
        es: 'Indique con qué frecuencia cada una de las siguientes afirmaciones lo/la describe a usted.'
      })
    ],
    license: 'UNLICENSED',
    referenceUrl: 'https://doi.org/10.1037/0022-3514.39.3.472'
  },
  content: {
    responses: {
      kind: 'number-record',
      label: t({ en: 'Statements', es: 'Afirmaciones' }),
      items: Object.fromEntries(
        itemKeys.map((key, i) => [key, { label: `${i + 1}. ${t(statements[i]!)}` }])
      ) as { [K in ItemKey]: { label: string } },
      options,
      variant: 'likert'
    }
  },
  measures: {
    totalScore: {
      kind: 'computed',
      label: t({ en: 'Total score (20-80)', es: 'Puntuación total (20-80)' }),
      value: ({ responses }) => totalScore(responses)
    },
    interpretation: {
      kind: 'computed',
      label: t({
        en: 'Interpretation (Deckx et al., 2014)',
        es: 'Interpretación (Deckx et al., 2014)'
      }),
      value: ({ responses }) => {
        const score = totalScore(responses);
        if (score <= 34) {
          return t({ en: 'Low degree of loneliness', es: 'Grado bajo de soledad' });
        } else if (score <= 49) {
          return t({ en: 'Moderate degree of loneliness', es: 'Grado moderado de soledad' });
        } else if (score <= 64) {
          return t({ en: 'Moderately high degree of loneliness', es: 'Grado moderadamente alto de soledad' });
        }
        return t({ en: 'High degree of loneliness', es: 'Grado alto de soledad' });
      }
    }
  },
  validationSchema: z.object({
    responses: z.object(Object.fromEntries(itemKeys.map((key) => [key, z.number().int().min(1).max(4)])) as {
      [K in ItemKey]: z.ZodNumber;
    })
  })
});
