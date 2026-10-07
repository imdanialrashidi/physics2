import { useState } from 'react';
import { Slider, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * GaussTrainer — مربی سطح گاوسی.
 *
 * سه تقارن (کره، سیم بلند، صفحه) با زبانه انتخاب می‌شوند؛ بار و فاصله
 * با لغزنده تنظیم و میدان با قانون گاوس حساب می‌شود. برای کره، شعاع
 * کره هم تنظیم می‌شود تا رفتار داخل و خارج دیده شود.
 */

const EPS0 = 8.85e-12;

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 2): string =>
  v.toFixed(digits).replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

type Mode = 'sphere' | 'wire' | 'plane';
const MODES: { id: Mode; label: string }[] = [
  { id: 'sphere', label: 'کرهٔ باردار' },
  { id: 'wire', label: 'سیم بلند' },
  { id: 'plane', label: 'صفحهٔ بزرگ' },
];

const DEFAULTS = { mode: 'sphere' as Mode, qU: 5, rCm: 20, bigRCm: 10, lambdaN: 2, sigmaP: 8.85 };

export default function GaussTrainer() {
  const hydrated = useHydrated('gaussTrainer');
  const [mode, setMode] = useState<Mode>(DEFAULTS.mode);
  const [qU, setQU] = useState(DEFAULTS.qU);
  const [rCm, setRCm] = useState(DEFAULTS.rCm);
  const [bigRCm, setBigRCm] = useState(DEFAULTS.bigRCm);
  const [lambdaN, setLambdaN] = useState(DEFAULTS.lambdaN);
  const [sigmaP, setSigmaP] = useState(DEFAULTS.sigmaP);

  const r = rCm / 100;
  let e = 0;
  let note = '';
  if (mode === 'sphere') {
    const bigR = bigRCm / 100;
    const q = qU * 1e-6;
    if (r > bigR) {
      e = (8.99e9 * q) / (r * r);
      note = 'نقطه بیرون کره است: کل بار مثل نقطه در مرکز رفتار می‌کند.';
    } else {
      e = ((8.99e9 * q) / (bigR ** 3)) * r;
      note = 'نقطه داخل کره است: فقط بارِ محصور شمرده می‌شود و میدان خطی است.';
    }
  } else if (mode === 'wire') {
    const lambda = lambdaN * 1e-9;
    e = lambda / (2 * Math.PI * EPS0 * r);
    note = 'میدان سیم بلند با عکس فاصله کم می‌شود، نه مربع آن.';
  } else {
    const sigma = sigmaP * 1e-12;
    e = sigma / (2 * EPS0);
    note = 'میدان صفحهٔ بزرگ مستقل از فاصله است.';
  }

  const reset = () => {
    setMode(DEFAULTS.mode);
    setQU(DEFAULTS.qU);
    setRCm(DEFAULTS.rCm);
    setBigRCm(DEFAULTS.bigRCm);
    setLambdaN(DEFAULTS.lambdaN);
    setSigmaP(DEFAULTS.sigmaP);
  };

  return (
    <section
      aria-label="مربی سطح گاوسی"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">مربی گاوس — میدان در سه تقارن</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded-md border border-line-control px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary-deep"
        >
          بازنشانی
        </button>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="انتخاب تقارن">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => setMode(m.id)}
                className={`min-h-[44px] rounded-md border px-4 py-2 text-sm font-bold transition-colors ${
                  mode === m.id ? 'border-primary bg-primary-wash text-primary-deep' : 'border-line text-ink-muted hover:border-line-control'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'sphere' && (
            <>
              <Slider label="بار کره — میکروکولن" value={qU} min={0.5} max={20} step={0.5} onChange={setQU} />
              <Slider label="شعاع کره — سانتی‌متر" value={bigRCm} min={2} max={20} step={1} onChange={setBigRCm} />
              <Slider label="فاصلهٔ نقطه از مرکز — سانتی‌متر" value={rCm} min={1} max={40} step={1} onChange={setRCm} />
            </>
          )}
          {mode === 'wire' && (
            <>
              <Slider label="چگالی خطی — نانوکولن بر متر" value={lambdaN} min={0.5} max={20} step={0.5} onChange={setLambdaN} />
              <Slider label="فاصله از سیم — سانتی‌متر" value={rCm} min={1} max={40} step={1} onChange={setRCm} />
            </>
          )}
          {mode === 'plane' && (
            <Slider label="چگالی سطحی — پیکوکولن بر مترمربع" value={sigmaP} min={1} max={50} step={0.5} onChange={setSigmaP} />
          )}

          <LiveReadout text={`میدان ${faNum(e)} نیوتن بر کولن است. ${note}`} />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <svg viewBox="0 0 340 200" role="img" aria-label="سطح گاوسی و نقطهٔ موردنظر" className="block h-auto w-full">
            {mode === 'sphere' && (
              <g>
                <circle cx="170" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" strokeDasharray="6 4" />
                <circle cx="170" cy="100" r="30" fill="currentColor" opacity="0.15" className="text-accent" />
                <circle cx="170" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent" />
                <circle cx={170 + 75} cy="100" r="5" fill="currentColor" className="text-danger" />
                <text x="170" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">خط‌چین: سطح گاوسی</text>
              </g>
            )}
            {mode === 'wire' && (
              <g>
                <line x1="170" y1="15" x2="170" y2="185" stroke="currentColor" strokeWidth="3" className="text-accent" />
                <rect x="120" y="40" width="100" height="120" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" strokeDasharray="6 4" />
                <circle cx="235" cy="100" r="5" fill="currentColor" className="text-danger" />
                <text x="170" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">مستطیل‌چین: استوانهٔ گاوسی</text>
              </g>
            )}
            {mode === 'plane' && (
              <g>
                <line x1="40" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="3" className="text-accent" />
                <rect x="140" y="55" width="60" height="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" strokeDasharray="6 4" />
                <line x1="230" y1="60" x2="230" y2="30" stroke="currentColor" strokeWidth="1.5" className="text-primary" markerEnd="url(#gt-head)" />
                <line x1="230" y1="140" x2="230" y2="170" stroke="currentColor" strokeWidth="1.5" className="text-primary" markerEnd="url(#gt-head)" />
                <defs>
                  <marker id="gt-head" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6" fill="none" strokeWidth="1.5" stroke="currentColor" />
                  </marker>
                </defs>
                <text x="170" y="190" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">میدان عمود بر صفحه، دوطرفه</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </section>
  );
}
