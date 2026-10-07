import { useState } from 'react';
import { Slider, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * ChargedParticleLab — ذرهٔ باردار در میدان مغناطیسی.
 *
 * با انتخاب ذره (الکترون/پروتون/ذرهٔ آلفا) و تنظیم سرعت و میدان، شعاع
 * مسیر دایره‌ای و دورهٔ چرخش با فرمول واقعی حساب و مدار روی SVG رسم
 * می‌شود. مقیاس نمایش لگاریتمی است تا همهٔ حالت‌ها دیده شوند.
 */

const PARTICLES = {
  electron: { label: 'الکترون', m: 9.11e-31, q: 1.602e-19 },
  proton: { label: 'پروتون', m: 1.67e-27, q: 1.602e-19 },
  alpha: { label: 'ذرهٔ آلفا', m: 6.64e-27, q: 2 * 1.602e-19 },
} as const;

type PKey = keyof typeof PARTICLES;

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faSci = (v: number): string => {
  if (v <= 0) return '۰';
  const exp = Math.floor(Math.log10(v));
  const mant = v / 10 ** exp;
  const fa = (s: string) => s.replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫').replace('-', '−');
  return `${fa(mant.toFixed(2))} × ۱۰${fa(String(exp))}`;
};

const DEFAULTS = { p: 'proton' as PKey, vExp: 6, bMt: 500 };

export default function ChargedParticleLab() {
  const hydrated = useHydrated('chargedParticleLab');
  const [pKey, setPKey] = useState<PKey>(DEFAULTS.p);
  const [vExp, setVExp] = useState(DEFAULTS.vExp);
  const [bMt, setBMt] = useState(DEFAULTS.bMt);

  const p = PARTICLES[pKey];
  const v = 10 ** vExp;
  const b = bMt / 1000;
  const r = (p.m * v) / (p.q * b);
  const t = (2 * Math.PI * p.m) / (p.q * b);

  // Logarithmic display radius so electron and alpha orbits both fit.
  const dispR = 12 + Math.min(58, 8 * (Math.log10(r) + 12));

  const reset = () => {
    setPKey(DEFAULTS.p);
    setVExp(DEFAULTS.vExp);
    setBMt(DEFAULTS.bMt);
  };

  return (
    <section
      aria-label="آزمایشگاه ذرهٔ باردار در میدان مغناطیسی"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">ذرهٔ باردار در میدان مغناطیسی</p>
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
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="انتخاب ذره">
            {(Object.keys(PARTICLES) as PKey[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={pKey === k}
                onClick={() => setPKey(k)}
                className={`min-h-[44px] rounded-md border px-4 py-2 text-sm font-bold transition-colors ${
                  pKey === k ? 'border-primary bg-primary-wash text-primary-deep' : 'border-line text-ink-muted hover:border-line-control'
                }`}
              >
                {PARTICLES[k].label}
              </button>
            ))}
          </div>
          <Slider label="سرعت — توان دهی متر بر ثانیه" value={vExp} min={4} max={7} step={0.5} onChange={setVExp} />
          <Slider label="میدان — میلی‌تسلا" value={bMt} min={10} max={2000} step={10} onChange={setBMt} />
          <LiveReadout text={`شعاع مسیر ${faSci(r)} متر و دورهٔ یک دور ${faSci(t)} ثانیه است.`} />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <svg viewBox="0 0 340 220" role="img" aria-label="مدار دایره‌ای ذره در میدان" className="block h-auto w-full">
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i} opacity="0.45" stroke="currentColor" className="text-ink">
                <line x1={40 + i * 42} y1="96" x2={40 + i * 42} y2="104" strokeWidth="1.5" />
                <line x1={36 + i * 42} y1="100" x2={44 + i * 42} y2="100" strokeWidth="1.5" />
              </g>
            ))}
            <circle cx="170" cy="110" r={dispR} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
            <circle cx={170 + dispR} cy="110" r="5" fill="currentColor" className="text-accent" />
            <text x="170" y="205" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">
              میدان رو به داخل صفحه است (×)
            </text>
          </svg>
          <p className="px-1 pb-1 pt-1 text-center text-2xs text-ink-faint">اندازهٔ دایره نمایشی است؛ عددهای واقعی را از متن بالا بخوان</p>
        </div>
      </div>
    </section>
  );
}
