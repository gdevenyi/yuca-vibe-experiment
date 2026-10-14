import { useEffect, useState } from 'react';

import { Button, Card, Heading, Spinner } from '@douglasneuroinformatics/libui/components';
import { i18n } from '@douglasneuroinformatics/libui/i18n';
import { CoreProvider } from '@douglasneuroinformatics/libui/providers';
import { InstrumentInterpreter } from '@opendatacapture/instrument-interpreter';
import { computeInstrumentMeasures } from '@opendatacapture/instrument-utils';
import { InstrumentRenderer, ScalarInstrumentRenderer } from '@opendatacapture/react-core';
import type { InstrumentSubmitHandler } from '@opendatacapture/react-core';
import type { AnyUnilingualScalarInstrument, Json } from '@opendatacapture/runtime-core';
import type { SeriesInstrumentBundleContainer } from '@opendatacapture/schemas/instrument';

type SiteLanguage = 'en' | 'es';

type ItemBundle = SeriesInstrumentBundleContainer['items'][number];

/** The site's routes: '#/' (home), '#/<lang>' (the series) and '#/<lang>/<NAME>' (one questionnaire). */
type Route = { item: null | string; lang: SiteLanguage } | null;

/** What the site shows for one submitted questionnaire. ODC computes measures on the server; here we do it in the browser. */
type SubmissionRecord = {
  data: Json;
  measures: { [key: string]: { label?: string; value: unknown } };
  title: string;
};

const LANGUAGES = ['en', 'es'] as const;

const TEXT = {
  en: {
    back: 'Back to start',
    data: 'Answers',
    intro:
      'This page shows the YUCA questionnaires as a series instrument in Open Data Capture (ODC). It uses the same form renderer as a real ODC deployment. It is a demonstration only: the answers stay in your browser and are not saved or sent anywhere.',
    loadError: 'Could not load the questionnaires.',
    one: 'Or open one questionnaire:',
    restart: 'Start again',
    scores: 'Scores',
    start: 'Start the series in English',
    submitted: 'Submitted data (not saved)',
    title: 'YUCA Questionnaires'
  },
  es: {
    back: 'Volver al inicio',
    data: 'Respuestas',
    intro:
      'Esta página muestra los cuestionarios YUCA como una serie de instrumentos en Open Data Capture (ODC). Usa el mismo sistema de formularios que una instalación real de ODC. Es solo una demostración: las respuestas permanecen en su navegador y no se guardan ni se envían.',
    loadError: 'No se pudieron cargar los cuestionarios.',
    one: 'O abra un solo cuestionario:',
    restart: 'Comenzar de nuevo',
    scores: 'Puntuaciones',
    start: 'Comenzar la serie en español',
    submitted: 'Datos enviados (no se guardan)',
    title: 'Cuestionarios YUCA'
  }
} satisfies { [L in SiteLanguage]: { [key: string]: string } };

const SUBMIT_LABEL = { en: 'Submit', es: 'Enviar', fr: 'Soumettre' };

const interpreter = new InstrumentInterpreter();

const seriesRequests = new Map<SiteLanguage, Promise<SeriesInstrumentBundleContainer>>();

function loadSeries(lang: SiteLanguage): Promise<SeriesInstrumentBundleContainer> {
  let request = seriesRequests.get(lang);
  if (!request) {
    request = fetch(`${import.meta.env.BASE_URL}bundles/${lang}.json`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json() as Promise<SeriesInstrumentBundleContainer>;
    });
    seriesRequests.set(lang, request);
  }
  return request;
}

/** Item ids are '<NAME>-<lang>' (see scripts/build-bundles.ts). */
function itemName(item: ItemBundle): string {
  return item.id.replace(/-(en|es)$/, '');
}

async function interpretItem(item: ItemBundle): Promise<AnyUnilingualScalarInstrument> {
  return (await interpreter.interpret(item.bundle)) as AnyUnilingualScalarInstrument;
}

async function toRecord(item: ItemBundle, data: Json): Promise<SubmissionRecord> {
  const instrument = await interpretItem(item);
  return {
    data,
    measures: computeInstrumentMeasures(instrument, data),
    title: instrument.details.title
  };
}

function readRoute(): Route {
  const match = /^#\/(en|es)(?:\/([A-Z0-9_]+))?$/.exec(window.location.hash);
  return match ? { item: match[2] ?? null, lang: match[1] as SiteLanguage } : null;
}

function useSeries(lang: SiteLanguage) {
  const [target, setTarget] = useState<null | SeriesInstrumentBundleContainer>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    setTarget(null);
    loadSeries(lang)
      .then(setTarget)
      .catch((err: unknown) => {
        console.error(err);
        setError(true);
      });
  }, [lang]);
  return { error, target };
}

const QuestionnaireList = ({ lang }: { lang: SiteLanguage }) => {
  const { target } = useSeries(lang);
  const [titles, setTitles] = useState<null | { name: string; title: string }[]>(null);

  useEffect(() => {
    if (!target) {
      return;
    }
    void Promise.all(
      target.items.map(async (item) => ({ name: itemName(item), title: (await interpretItem(item)).details.title }))
    ).then(setTitles);
  }, [target]);

  if (!titles) {
    return <Spinner />;
  }
  return (
    <ol className="list-decimal space-y-1 pl-6 text-sm">
      {titles.map(({ name, title }) => (
        <li key={name}>
          <a className="underline" href={`#/${lang}/${name}`}>
            {title}
          </a>
        </li>
      ))}
    </ol>
  );
};

const Home = () => (
  <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
    {LANGUAGES.map((lang) => (
      <Card className="space-y-4 p-6" key={lang} lang={lang}>
        <Heading variant="h3">{TEXT[lang].title}</Heading>
        <p className="text-muted-foreground text-sm">{TEXT[lang].intro}</p>
        <Button asChild>
          <a href={`#/${lang}`}>{TEXT[lang].start}</a>
        </Button>
        <p className="text-sm">{TEXT[lang].one}</p>
        <QuestionnaireList lang={lang} />
      </Card>
    ))}
  </div>
);

const SubmissionList = ({
  lang,
  submissions,
  total
}: {
  lang: SiteLanguage;
  submissions: SubmissionRecord[];
  total: number;
}) => {
  const text = TEXT[lang];
  return (
    <details className="mt-8 rounded-md border p-4">
      <summary className="cursor-pointer font-medium">
        {text.submitted} ({submissions.length}/{total})
      </summary>
      <div className="mt-4 space-y-6">
        {submissions.map(({ data, measures, title }, index) => (
          <section className="space-y-2" key={index}>
            <Heading variant="h5">{title}</Heading>
            <table className="text-sm">
              <caption className="text-muted-foreground text-left">{text.scores}</caption>
              <tbody>
                {Object.entries(measures).map(([key, { label, value }]) => (
                  <tr key={key}>
                    <td className="pr-4">{label ?? key}</td>
                    <td className="font-mono">{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <details>
              <summary className="text-muted-foreground cursor-pointer text-sm">{text.data}</summary>
              <pre className="overflow-x-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </section>
        ))}
      </div>
    </details>
  );
};

const InstrumentPage = ({ item, lang }: { item: null | string; lang: SiteLanguage }) => {
  const { error, target } = useSeries(lang);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [run, setRun] = useState(0);
  const text = TEXT[lang];

  useEffect(() => {
    setSubmissions([]);
  }, [item, lang]);

  const addSubmission = async (bundle: ItemBundle, data: Json) => {
    const record = await toRecord(bundle, data);
    setSubmissions((prev) => [...prev, record]);
  };

  const single = item ? target?.items.find((candidate) => itemName(candidate) === item) : undefined;

  let content = null;
  if (error || (target && item && !single)) {
    content = <p className="text-destructive">{text.loadError}</p>;
  } else if (target && single) {
    content = (
      <ScalarInstrumentRenderer
        className="min-h-[36rem] grow"
        key={`${single.id}-${run}`}
        submitButtonLabel={SUBMIT_LABEL}
        target={single}
        onSubmit={({ data }) => addSubmission(single, data as Json)}
      />
    );
  } else if (target) {
    content = (
      <InstrumentRenderer
        className="min-h-[36rem] grow"
        key={`${lang}-${run}`}
        submitButtonLabel={SUBMIT_LABEL}
        target={target}
        onSubmit={(submission) => {
          const bundle = target.items.find(({ id }) => id === submission.instrumentId);
          if (!bundle) {
            throw new Error(`Unknown instrument '${submission.instrumentId}'`);
          }
          return addSubmission(bundle, submission.data);
        }}
      />
    );
  }

  return (
    <div className="container flex min-h-screen flex-col py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <a className="text-sm underline" href="#/">
          &larr; {text.back}
        </a>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSubmissions([]);
            setRun((n) => n + 1);
          }}
        >
          {text.restart}
        </Button>
      </div>
      {content}
      {submissions.length > 0 && (
        <SubmissionList lang={lang} submissions={submissions} total={single ? 1 : (target?.items.length ?? 0)} />
      )}
    </div>
  );
};

export const App = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(route?.lang ?? 'en');
  }, [route?.lang]);

  return (
    <CoreProvider>{route ? <InstrumentPage item={route.item} key={route.lang} lang={route.lang} /> : <Home />}</CoreProvider>
  );
};
