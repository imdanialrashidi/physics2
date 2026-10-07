import { useState } from 'react';
import { Toggle, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * RightHandTrainer — مربی قاعدهٔ دست راست.
 *
 * جهت سرعت و میدان از سه محور انتخاب می‌شود؛ جهت نیرو با حاصل‌ضرب
 * برداری واقعی حساب و با جملهٔ فارسی اعلام می‌شود. کلید بار منفی جهت
 * را برعکس می‌کند. حالت «آزمون» جهت‌ها را می‌پوشاند تا خودت حدس بزنی.
 */

type Axis = 'x' | 'y' | 'z';
const AXES: { id: Axis; label: string }[] = [
  { id: 'x', label: 'x' },
  { id: 'y', label: 'y' },
  { id: 'z', label: 'z' },
];

const VEC: Record<Axis, [number, number, number]> = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
};

function cross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

const FA_NAME: Record<string, string> = {
  '+x': 'مثبت x',
  '−x': 'منفی x',
  '+y': 'مثبت y',
  '−y': 'منفی y',
  '+z': 'مثبت z (بیرون صفحه)',
  '−z': 'منفی z (داخل صفحه)',
  '۰': 'صفر (سرعت موازی میدان است)',
};

function nameOf(v: [number, number, number]): string {
  if (v[0] === 1) return '+x';
  if (v[0] === -1) return '−x';
  if (v[1] === 1) return '+y';
  if (v[1] === -1) return '−y';
  if (v[2] === 1) return '+z';
  if (v[2] === -1) return '−z';
  return '۰';
}

export default function RightHandTrainer() {
  const hydrated = useHydrated('rightHandTrainer');
  const [vAxis, setVAxis] = useState<Axis>('x');
  const [vSign, setVSign] = useState<1 | -1>(1);
  const [bAxis, setBAxis] = useState<Axis>('y');
  const [negative, setNegative] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const v: [number, number, number] = [VEC[vAxis][0] * vSign, VEC[vAxis][1] * vSign, VEC[vAxis][2] * vSign];
  const b = VEC[bAxis];
  let f = cross(v, b);
  if (negative) f = [-f[0], -f[1], -f[2]];
  const fName = nameOf(f);
  const parallel = fName === '۰';

  const reset = () => {
    setVAxis('x');
    setVSign(1);
    setBAxis('y');
    setNegative(false);
    setQuizMode(false);
    setRevealed(false);
  };

  return (
    <section
      aria-label="مربی قاعدهٔ دست راست"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">مربی قاعدهٔ دست راست — جهت نیروی مغناطیسی</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded-md border border-line-control px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary-deep"
        >
          بازنشانی
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <fieldset className="rounded-md border border-line p-3">
            <legend className="px-1 text-sm font-bold text-ink">جهت سرعت (v)</legend>
            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {AXES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={vAxis === a.id}
                  onClick={() => {
                    setVAxis(a.id);
                    setRevealed(false);
                  }}
                  className={`min-h-[44px] min-w-[44px] rounded-md border px-3 py-2 font-mono text-sm font-bold transition-colors ${
                    vAxis === a.id ? 'border-primary bg-primary-wash text-primary-deep' : 'border-line text-ink-muted hover:border-line-control'
                  }`}
                >
                  {a.label}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={vSign === -1}
                onClick={() => {
                  setVSign((s) => (s === 1 ? -1 : 1));
                  setRevealed(false);
                }}
                className="min-h-[44px] rounded-md border border-line px-3 py-2 font-mono text-sm font-bold text-ink-muted transition-colors hover:border-line-control"
              >
                ±
              </button>
            </div>
          </fieldset>

          <fieldset className="rounded-md border border-line p-3">
            <legend className="px-1 text-sm font-bold text-ink">جهت میدان (B)</legend>
            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {AXES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={bAxis === a.id}
                  onClick={() => {
                    setBAxis(a.id);
                    setRevealed(false);
                  }}
                  className={`min-h-[44px] min-w-[44px] rounded-md border px-3 py-2 font-mono text-sm font-bold transition-colors ${
                    bAxis === a.id ? 'border-primary bg-primary-wash text-primary-deep' : 'border-line text-ink-muted hover:border-line-control'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-2">
          <Toggle label="بار منفی (الکترون)" checked={negative} onChange={(c) => { setNegative(c); setRevealed(false); }} />
          <Toggle label="حالت آزمون (پنهان‌کردن جواب)" checked={quizMode} onChange={(c) => { setQuizMode(c); setRevealed(false); }} />
        </div>

        {quizMode && !revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-on transition-colors hover:bg-primary-deep"
          >
            حدس زدم — جواب را نشان بده
          </button>
        ) : (
          <LiveReadout
            text={
              parallel
                ? 'سرعت موازی میدان است، پس نیروی مغناطیسی صفر است — هیچ جهتی وجود ندارد.'
                : `نیروی وارد بر بار ${negative ? 'منفی' : 'مثبت'} در جهت ${FA_NAME[fName]} است.`
            }
          />
        )}
      </div>
    </section>
  );
}
