import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import type { FormInstrument } from '/runtime/v1/@opendatacapture/runtime-core';
import { z } from '/runtime/v1/zod@3.x';

import { t } from './lang.ts';

// Substances a. to j. in the order of the source form.
const substanceKeys = [
  'tobacco',
  'alcohol',
  'cannabis',
  'cocaine',
  'amphetamines',
  'inhalants',
  'sedatives',
  'hallucinogens',
  'opioids',
  'other'
] as const;

type Substance = (typeof substanceKeys)[number];

const letters: { [K in Substance]: string } = {
  tobacco: 'a',
  alcohol: 'b',
  cannabis: 'c',
  cocaine: 'd',
  amphetamines: 'e',
  inhalants: 'f',
  sedatives: 'g',
  hallucinogens: 'h',
  opioids: 'i',
  other: 'j'
};

/** `name`: the row text of the source form. `inline`: the same text for use inside a question. */
const substances: { [K in Substance]: { inline: string; name: string } } = {
  tobacco: t({
    en: {
      name: 'Tobacco products (cigarettes, chewing tobacco, cigars, etc.)',
      inline: 'tobacco products (cigarettes, chewing tobacco, cigars, etc.)'
    },
    es: {
      name: 'Productos de tabaco (cigarrillos, tabaco de mascar, puros, etc.)',
      inline: 'productos de tabaco (cigarrillos, tabaco de mascar, puros, etc.)'
    }
  }),
  alcohol: t({
    en: {
      name: 'Alcoholic beverages (beer, wine, spirits, etc.)',
      inline: 'alcoholic beverages (beer, wine, spirits, etc.)'
    },
    es: {
      name: 'Bebidas alcohólicas (cerveza, vino, licores, etc.)',
      inline: 'bebidas alcohólicas (cerveza, vino, licores, etc.)'
    }
  }),
  cannabis: t({
    en: {
      name: 'Cannabis (marijuana, pot, grass, hash, etc.)',
      inline: 'cannabis (marijuana, pot, grass, hash, etc.)'
    },
    es: {
      name: 'Cannabis (marihuana, mota, hierba, hachís, etc.)',
      inline: 'cannabis (marihuana, mota, hierba, hachís, etc.)'
    }
  }),
  cocaine: t({
    en: { name: 'Cocaine (coke, crack, etc.)', inline: 'cocaine (coke, crack, etc.)' },
    es: { name: 'Cocaína (coca, crack, etc.)', inline: 'cocaína (coca, crack, etc.)' }
  }),
  amphetamines: t({
    en: {
      name: 'Amphetamine type stimulants (speed, diet pills, ecstasy, etc.)',
      inline: 'amphetamine type stimulants (speed, diet pills, ecstasy, etc.)'
    },
    es: {
      name: 'Estimulantes de tipo anfetamina (speed, pastillas para adelgazar, éxtasis, etc.)',
      inline: 'estimulantes de tipo anfetamina (speed, pastillas para adelgazar, éxtasis, etc.)'
    }
  }),
  inhalants: t({
    en: {
      name: 'Inhalants (nitrous, glue, petrol, paint thinner, etc.)',
      inline: 'inhalants (nitrous, glue, petrol, paint thinner, etc.)'
    },
    es: {
      name: 'Inhalantes (óxido nitroso, pegamento, gasolina, solvente de pintura, etc.)',
      inline: 'inhalantes (óxido nitroso, pegamento, gasolina, solvente de pintura, etc.)'
    }
  }),
  sedatives: t({
    en: {
      name: 'Sedatives or Sleeping Pills (Valium, Serepax, Rohypnol, etc.)',
      inline: 'sedatives or sleeping pills (Valium, Serepax, Rohypnol, etc.)'
    },
    es: {
      name: 'Sedantes o pastillas para dormir (Valium, Serepax, Rohypnol, etc.)',
      inline: 'sedantes o pastillas para dormir (Valium, Serepax, Rohypnol, etc.)'
    }
  }),
  hallucinogens: t({
    en: {
      name: 'Hallucinogens (LSD, acid, mushrooms, PCP, Special K, etc.)',
      inline: 'hallucinogens (LSD, acid, mushrooms, PCP, Special K, etc.)'
    },
    es: {
      name: 'Alucinógenos (LSD, ácido, hongos, PCP, Special K, etc.)',
      inline: 'alucinógenos (LSD, ácido, hongos, PCP, Special K, etc.)'
    }
  }),
  opioids: t({
    en: {
      name: 'Opioids (heroin, morphine, methadone, codeine, etc.)',
      inline: 'opioids (heroin, morphine, methadone, codeine, etc.)'
    },
    es: {
      name: 'Opioides (heroína, morfina, metadona, codeína, etc.)',
      inline: 'opioides (heroína, morfina, metadona, codeína, etc.)'
    }
  }),
  other: t({
    en: { name: 'Other', inline: 'the other substance' },
    es: { name: 'Otra', inline: 'la otra sustancia' }
  })
};

// Answer keys of Q2 to Q8, in the column order of the source form.
const frequencyKeys = ['never', 'onceOrTwice', 'monthly', 'weekly', 'dailyOrAlmostDaily'] as const;
const everKeys = ['no', 'yesPast3Months', 'yesNotPast3Months'] as const;

type FrequencyAnswer = (typeof frequencyKeys)[number];
type EverAnswer = (typeof everKeys)[number];

// Option labels of Q2 to Q5. The object order is the display order.
const frequencyLabels: { [K in FrequencyAnswer]: string } = t({
  en: {
    never: 'Never',
    onceOrTwice: 'Once or Twice',
    monthly: 'Monthly',
    weekly: 'Weekly',
    dailyOrAlmostDaily: 'Daily or Almost Daily'
  },
  es: {
    never: 'Nunca',
    onceOrTwice: 'Una o dos veces',
    monthly: 'Mensualmente',
    weekly: 'Semanalmente',
    dailyOrAlmostDaily: 'Diariamente o casi diariamente'
  }
});

// Option labels of Q6 to Q8. The object order is the display order.
const everLabels: { [K in EverAnswer]: string } = t({
  en: {
    no: 'No, Never',
    yesPast3Months: 'Yes, in the past 3 months',
    yesNotPast3Months: 'Yes, but not in the past 3 months'
  },
  es: {
    no: 'No, nunca',
    yesPast3Months: 'Sí, en los últimos 3 meses',
    yesNotPast3Months: 'Sí, pero no en los últimos 3 meses'
  }
});

/** Item scores of the source form for each answer of Q2 to Q7. Q8 is not scored. */
const itemScores: {
  [K in 'q2' | 'q3' | 'q4' | 'q5']: { [A in FrequencyAnswer]: number };
} & { [K in 'q6' | 'q7']: { [A in EverAnswer]: number } } = {
  q2: { never: 0, onceOrTwice: 2, monthly: 3, weekly: 4, dailyOrAlmostDaily: 6 },
  q3: { never: 0, onceOrTwice: 3, monthly: 4, weekly: 5, dailyOrAlmostDaily: 6 },
  q4: { never: 0, onceOrTwice: 4, monthly: 5, weekly: 6, dailyOrAlmostDaily: 7 },
  q5: { never: 0, onceOrTwice: 5, monthly: 6, weekly: 7, dailyOrAlmostDaily: 8 },
  q6: { no: 0, yesPast3Months: 6, yesNotPast3Months: 3 },
  q7: { no: 0, yesPast3Months: 6, yesNotPast3Months: 3 }
};

const options = {
  q2: frequencyLabels,
  q3: frequencyLabels,
  q4: frequencyLabels,
  q5: frequencyLabels,
  q6: everLabels,
  q7: everLabels,
  q8: everLabels
};

// Question stems. `{}` is replaced with the substance.
const stems = {
  q2: t({
    en: 'In the past three months, how often have you used {}?',
    es: 'En los últimos tres meses, ¿con qué frecuencia ha consumido {}?'
  }),
  q3: t({
    en: 'During the past three months, how often have you had a strong desire or urge to use {}?',
    es: 'Durante los últimos tres meses, ¿con qué frecuencia ha sentido un fuerte deseo o ansias de consumir {}?'
  }),
  q4: t({
    en: 'During the past three months, how often has your use of {} led to health, social, legal or financial problems?',
    es: 'Durante los últimos tres meses, ¿con qué frecuencia su consumo de {} le ha causado problemas de salud, sociales, legales o económicos?'
  }),
  q5: t({
    en: 'During the past three months, how often have you failed to do what was normally expected of you because of your use of {}?',
    es: 'Durante los últimos tres meses, ¿con qué frecuencia ha dejado de hacer lo que normalmente se esperaba de usted por su consumo de {}?'
  }),
  q6: t({
    en: 'Has a friend or relative or anyone else ever expressed concern about your use of {}?',
    es: '¿Algún amigo, familiar o cualquier otra persona ha mostrado alguna vez preocupación por su consumo de {}?'
  }),
  q7: t({
    en: 'Have you ever tried and failed to control, cut down or stop using {}?',
    es: '¿Ha intentado alguna vez controlar, reducir o dejar de consumir {} y no lo ha logrado?'
  })
};

type FollowUp = 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7';
const followUps: readonly FollowUp[] = ['q2', 'q3', 'q4', 'q5', 'q6', 'q7'];

const questionNumber: { [K in FollowUp]: number } = { q2: 2, q3: 3, q4: 4, q5: 5, q6: 6, q7: 7 };

/** Q5 is not asked for tobacco. */
function isAsked(question: FollowUp, substance: Substance) {
  return !(question === 'q5' && substance === 'tobacco');
}

/** Data keys of Q2 to Q7. There is no Q5 for tobacco. */
type FollowUpKey = Exclude<`${FollowUp}_${Substance}`, 'q5_tobacco'>;

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const $frequency = z.enum(frequencyKeys);
const $ever = z.enum(everKeys);

function isFrequencyQuestion(question: FollowUp): question is 'q2' | 'q3' | 'q4' | 'q5' {
  return question !== 'q6' && question !== 'q7';
}

const $schema = z.object({
  ...(Object.fromEntries(substanceKeys.map((s) => [`q1_${s}`, z.boolean()])) as {
    [K in Substance as `q1_${K}`]: z.ZodBoolean;
  }),
  q1_otherSpecify: z.string().min(1).optional(),
  ...(Object.fromEntries(
    followUps.flatMap((q) =>
      substanceKeys
        .filter((s) => isAsked(q, s))
        .map((s) => [`${q}_${s}`, (isFrequencyQuestion(q) ? $frequency : $ever).optional()])
    )
  ) as {
    [K in FollowUpKey]: K extends `${'q6' | 'q7'}_${string}`
      ? z.ZodOptional<typeof $ever>
      : z.ZodOptional<typeof $frequency>;
  }),
  q8: $ever.optional()
});

type Data = z.infer<typeof $schema>;

function used(data: Partial<Data>, substance: Substance) {
  return data[`q1_${substance}`] === true;
}

/** Whether the participant must answer this follow-up item (the skip logic of the source form). */
function isApplicable(data: Partial<Data>, question: FollowUp, substance: Substance) {
  if (!isAsked(question, substance) || !used(data, substance)) {
    return false;
  }
  if (question === 'q3' || question === 'q4' || question === 'q5') {
    // Ask Q3 to Q5 only for substances used in the past three months (Q2 not "Never").
    const q2 = data[`q2_${substance}` as FollowUpKey];
    return q2 !== undefined && q2 !== 'never';
  }
  return true;
}

function anyUsed(data: Partial<Data>) {
  return substanceKeys.some((s) => used(data, s));
}

const validationSchema = $schema.superRefine((data, ctx) => {
  const required = t({ en: 'This question is required.', es: 'Esta pregunta es obligatoria.' });
  if (data.q1_other && !data.q1_otherSpecify?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ['q1_otherSpecify'] });
  }
  for (const q of followUps) {
    for (const s of substanceKeys) {
      if (isApplicable(data, q, s) && data[`${q}_${s}` as FollowUpKey] === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: [`${q}_${s}`] });
      }
    }
  }
  if (anyUsed(data) && data.q8 === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ['q8'] });
  }
});

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type Fields = FormInstrument.FieldsGroup<Data, 'en'>['fields'];

const yesNo = t({ en: { false: 'No', true: 'Yes' }, es: { false: 'No', true: 'Sí' } });

const q1Fields = {
  ...Object.fromEntries(
    substanceKeys.map((s) => [
      `q1_${s}`,
      {
        kind: 'boolean',
        label: `${letters[s]}. ${substances[s].name}`,
        options: yesNo,
        variant: 'radio'
      }
    ])
  ),
  q1_otherSpecify: {
    kind: 'dynamic',
    deps: ['q1_other'],
    render: (data: Partial<Data>) =>
      data.q1_other
        ? {
            kind: 'string',
            label: t({ en: 'j. Other - specify:', es: 'j. Otra - especifique:' }),
            variant: 'input'
          }
        : null
  }
} as Fields;

/** The text of the substance inside a question. For "Other", use the text that the participant gave. */
function inlineName(data: Partial<Data>, substance: Substance) {
  if (substance === 'other' && data.q1_otherSpecify?.trim()) {
    return data.q1_otherSpecify.trim();
  }
  return substances[substance].inline;
}

function followUpField(question: FollowUp, substance: Substance) {
  const deps: string[] = [`q1_${substance}`];
  if (question === 'q3' || question === 'q4' || question === 'q5') {
    deps.push(`q2_${substance}`);
  }
  if (substance === 'other') {
    deps.push('q1_otherSpecify');
  }
  return {
    kind: 'dynamic',
    deps,
    render: (data: Partial<Data>) => {
      if (!isApplicable(data, question, substance)) {
        return null;
      }
      return {
        kind: 'string',
        label: `${questionNumber[question]}${letters[substance]}. ${stems[question].replace('{}', inlineName(data, substance))}`,
        options: options[question],
        variant: 'radio'
      };
    }
  };
}

const followUpFields = {
  ...Object.fromEntries(
    followUps.flatMap((q) =>
      substanceKeys.filter((s) => isAsked(q, s)).map((s) => [`${q}_${s}`, followUpField(q, s)])
    )
  ),
  q8: {
    kind: 'dynamic',
    deps: substanceKeys.map((s) => `q1_${s}`),
    render: (data: Partial<Data>) =>
      anyUsed(data)
        ? {
            kind: 'string',
            label: t({
              en: '8. Have you ever used any drug by injection? (NON-MEDICAL USE ONLY)',
              es: '8. ¿Alguna vez ha consumido alguna droga por vía inyectada? (SOLO USO NO MÉDICO)'
            }),
            options: options.q8,
            variant: 'radio'
          }
        : null
  }
} as Fields;

// ---------------------------------------------------------------------------
// Measures
// ---------------------------------------------------------------------------

/** Specific Substance Involvement Score: the sum of Q2 to Q7 (tobacco has no Q5). Q1 and Q8 are not included. */
function involvementScore(data: Data, substance: Substance) {
  return followUps.reduce((sum, q) => {
    const answer = data[`${q}_${substance}` as FollowUpKey];
    if (answer === undefined) {
      return sum;
    }
    return sum + (itemScores[q] as { [key: string]: number })[answer]!;
  }, 0);
}

const riskLabels = t({
  en: {
    low: 'Low (no intervention)',
    moderate: 'Moderate (brief intervention)',
    high: 'High (more intensive treatment)'
  },
  es: {
    low: 'Bajo (sin intervención)',
    moderate: 'Moderado (intervención breve)',
    high: 'Alto (tratamiento más intensivo)'
  }
});

/** Risk level from the scoring table: alcohol 0-10 / 11-26 / 27+, all other substances 0-3 / 4-26 / 27+. */
function riskLevel(score: number, substance: Substance) {
  const lowMax = substance === 'alcohol' ? 10 : 3;
  if (score <= lowMax) {
    return riskLabels.low;
  }
  return score <= 26 ? riskLabels.moderate : riskLabels.high;
}

const measureNames: { [K in Substance]: string } = {
  tobacco: t({ en: 'Tobacco', es: 'Tabaco' }),
  alcohol: t({ en: 'Alcohol', es: 'Alcohol' }),
  cannabis: t({ en: 'Cannabis', es: 'Cannabis' }),
  cocaine: t({ en: 'Cocaine', es: 'Cocaína' }),
  amphetamines: t({ en: 'Amphetamine type stimulants', es: 'Estimulantes de tipo anfetamina' }),
  inhalants: t({ en: 'Inhalants', es: 'Inhalantes' }),
  sedatives: t({ en: 'Sedatives or sleeping pills', es: 'Sedantes o pastillas para dormir' }),
  hallucinogens: t({ en: 'Hallucinogens', es: 'Alucinógenos' }),
  opioids: t({ en: 'Opioids', es: 'Opioides' }),
  other: t({ en: 'Other drugs', es: 'Otras drogas' })
};

const measures = Object.fromEntries(
  substanceKeys.flatMap((s) => {
    const range = s === 'alcohol' ? '0-10 / 11-26 / 27+' : '0-3 / 4-26 / 27+';
    return [
      [
        `${s}Score`,
        {
          kind: 'computed',
          label: t({
            en: `${measureNames[s]}: specific substance involvement score`,
            es: `${measureNames[s]}: puntuación de involucramiento con la sustancia`
          }),
          value: (data: Data) => involvementScore(data, s)
        }
      ],
      [
        `${s}Risk`,
        {
          kind: 'computed',
          label: t({
            en: `${measureNames[s]}: risk level (${range})`,
            es: `${measureNames[s]}: nivel de riesgo (${range})`
          }),
          value: (data: Data) => riskLevel(involvementScore(data, s), s)
        }
      ]
    ];
  })
) as { [key: string]: { kind: 'computed'; label: string; value: (data: Data) => number | string } };

// ---------------------------------------------------------------------------
// Instrument
// ---------------------------------------------------------------------------

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  internal: {
    name: 'WHO_ASSIST_V3',
    edition: 1
  },
  tags: [
    t({ en: 'Substance Use', es: 'Consumo de sustancias' }),
    t({ en: 'Alcohol', es: 'Alcohol' }),
    t({ en: 'Tobacco', es: 'Tabaco' })
  ],
  details: {
    title: t({
      en: 'WHO Alcohol, Smoking and Substance Involvement Screening Test (ASSIST V3.0)',
      es: 'Prueba de detección de consumo de alcohol, tabaco y sustancias de la OMS (ASSIST V3.0)'
    }),
    description: t({
      en: 'The WHO ASSIST V3.0 screens for the use of alcohol, tobacco products and other drugs across the lifetime and in the past three months. It gives a specific substance involvement score and a risk level for each substance. Developed by the World Health Organization (WHO). This is a self-report version of the interviewer form.',
      es: 'El ASSIST V3.0 de la OMS detecta el consumo de alcohol, productos de tabaco y otras drogas a lo largo de la vida y en los últimos tres meses. Da una puntuación de involucramiento y un nivel de riesgo para cada sustancia. Desarrollado por la Organización Mundial de la Salud (OMS). Esta es una versión de autoinforme del formulario para entrevistador.'
    }),
    estimatedDuration: 10,
    // ODC joins instruction entries with ', ', so the sentences are one entry.
    instructions: [
      t({
        en: 'The questions below ask about your experience of using alcohol, tobacco products and other drugs across your lifetime and in the past three months. These substances can be smoked, swallowed, snorted, inhaled, injected or taken in the form of pills. Some of the substances listed may be prescribed by a doctor (like amphetamines, sedatives, pain medications). Do not include medications that you use as prescribed by your doctor. However, include such medications if you have taken them for reasons other than prescription, or taken them more frequently or at higher doses than prescribed. Your answers about the use of illicit drugs will be treated as strictly confidential.',
        es: 'Las preguntas siguientes tratan sobre su experiencia con el consumo de alcohol, productos de tabaco y otras drogas a lo largo de su vida y en los últimos tres meses. Estas sustancias se pueden fumar, tragar, aspirar por la nariz, inhalar, inyectar o tomar en forma de pastillas. Algunas de las sustancias de la lista pueden ser recetadas por un médico (como anfetaminas, sedantes o analgésicos). No incluya los medicamentos que usa tal como se los recetó su médico. Sin embargo, sí incluya esos medicamentos si los ha tomado por razones distintas a la receta, o con más frecuencia o en dosis más altas que las recetadas. Sus respuestas sobre el consumo de drogas ilícitas se tratarán de forma estrictamente confidencial.'
      })
    ],
    license: 'FREE-NOS',
    referenceUrl: 'https://www.who.int/publications/i/item/978924159938-2',
    sourceUrl: 'https://www.who.int/publications/i/item/978924159938-2',
    authors: ['World Health Organization']
  },
  content: [
    {
      title: t({ en: 'Question 1', es: 'Pregunta 1' }),
      description: t({
        en: 'In your life, which of the following substances have you ever used? (NON-MEDICAL USE ONLY). Include any use, even when you were in school.',
        es: 'En su vida, ¿cuáles de las siguientes sustancias ha consumido alguna vez? (SOLO USO NO MÉDICO). Incluya cualquier consumo, incluso cuando estaba en la escuela.'
      }),
      fields: q1Fields
    },
    {
      title: t({ en: 'Questions 2 to 8', es: 'Preguntas 2 a 8' }),
      description: t({
        en: 'The questions below are only about the substances that you answered "Yes" to in Question 1. If you answered "No" for all substances, there are no more questions and you can submit the form.',
        es: 'Las preguntas siguientes tratan solo sobre las sustancias a las que respondió "Sí" en la Pregunta 1. Si respondió "No" para todas las sustancias, no hay más preguntas y puede enviar el formulario.'
      }),
      fields: followUpFields
    }
  ],
  measures: {
    ...measures,
    injection: {
      kind: 'const',
      label: t({
        en: 'Q8: drug use by injection (no / yesPast3Months / yesNotPast3Months)',
        es: 'P8: consumo de drogas por vía inyectada (no / yesPast3Months / yesNotPast3Months)'
      }),
      ref: 'q8'
    }
  },
  validationSchema
});
