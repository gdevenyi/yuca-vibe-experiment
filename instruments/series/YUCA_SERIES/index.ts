import { defineSeriesInstrument } from '/runtime/v1/@opendatacapture/runtime-core';

import { SERIES_ITEMS } from './items.ts';
import { t } from './lang.ts';

export default defineSeriesInstrument({
  kind: 'SERIES',
  language: 'en',
  tags: [t({ en: 'Mental Health', es: 'Salud mental' })],
  clientDetails: {
    estimatedDuration: 45,
    instructions: [
      t({
        en: 'This series contains several questionnaires. Answer each questionnaire in turn. You can see your answers at the end. This demonstration does not save any answers.',
        es: 'Esta serie contiene varios cuestionarios. Responda cada cuestionario por turno. Puede ver sus respuestas al final. Esta demostración no guarda ninguna respuesta.'
      })
    ]
  },
  details: {
    description: t({
      en: 'A battery of mental health, substance use, sleep, physical activity and environment questionnaires.',
      es: 'Una batería de cuestionarios sobre salud mental, consumo de sustancias, sueño, actividad física y entorno.'
    }),
    license: 'UNLICENSED',
    title: t({ en: 'YUCA Questionnaire Series', es: 'Serie de cuestionarios YUCA' })
  },
  content: {
    items: [...SERIES_ITEMS]
  }
});
