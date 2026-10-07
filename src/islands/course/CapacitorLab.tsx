import { useState } from 'react';
import { Slider, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * CapacitorLab — آزمایشگاه خازن.
 *
 * مساحت صفحات، فاصله و ثابت دی‌الکتریک تنظیم می‌شوند؛ ظرفیت با فرمول
 * خازن تخت حساب و با ولتاژِ قابل‌تنظیم، بار و انرژی هم به دست می‌آیند.
 * اثر هر پارامتر را زنده ببین: مساحت و κ در صورت، فاصله در مخرج.
 */

const EPS0 = 8.85e-12;

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 1): string =>
  v.toFixed(digits).replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

function fmtC(f: number): string {
  if (f >= 1e-6) return `${faNum(f * 1e6)} میکروفاراد`;
  if (f >= 1e-9) return `${faNum(f * 1e9)} نانوفاراد`;
  return `${faNum(f * 1e12)} پیکوفاراد`;
}

const DIELECTRICS = [
  { label: 'هوا (۱)', k: 1 },
  { label: 'کاغذ (۳.۵)', k: 3.5 },
  { label: 'شیشه (۵)', k: 5 },
  { label: 'آب (۸۰)', k: 80 },
];

const DEFAULTS = { aCm2: 100, dMm: 1, kIdx: 0, volts: 12 };

export default function CapacitorLab() {
  const hydrated = useHydrated('capacitorLab');
  const [aCm2, setACm2] = useState(DEFAULTS.aCm2);
  const [dMm, setDMm] = useState(DEFAULTS.dMm);
  const [kIdx, setKIdx] = useState(DEFAULTS.kIdx);
  const [volts, setVolts] = useState(DEFAULTS.volts);

  const k = DIELECTRICS[kIdx].k;
  const c = (k * EPS0 * (aCm2 / 1e4)) / (dMm / 1000);
  const q = c * volts;
  const u = 0.5 * c * volts * volts;
  const plateGap = 20 + (dMm / 5) * 40;

  const reset = () => {
    setACm2(DEFAULTS.aCm2);
    setDMm(DEFAULTS.dMm);
    setKIdx(DEFAULTS.kIdx);
    setVolts(DEFAULTS.volts);
  };

  return (
    <section
      aria-label="آزمایشگاه خازن"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">آزمایشگاه خازن تخت با دی‌الکتریک</p>
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
          <Slider label="مساحت صفحات — سانتی‌مترمربع" value={aCm2} min={10} max={1000} step={10} onChange={setACm2} />
          <Slider label="فاصلهٔ صفحات — میلی‌متر" value={dMm} min={0.5} max={5} step={0.5} onChange={setDMm} />
          <div className="grid gap-1.5">
            <span className="text-sm font-semibold text-ink" id="cap-di-label">دی‌الکتریک بین صفحات</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="cap-di-label">
              {DIELECTRICS.map((d, i) => (
                <button
                  key={d.label}
                  type="button"
                  aria-pressed={kIdx === i}
                  onClick={() => setKIdx(i)}
                  className={`min-h-[44px] rounded-md border px-3 py-2 text-xs font-bold transition-colors ${
                    kIdx === i ? 'border-primary bg-primary-wash text-primary-deep' : 'border-line text-ink-muted hover:border-line-control'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <Slider label="ولتاژ باتری — ولت" value={volts} min={1} max={24} step={1} onChange={setVolts} />
          <LiveReadout
            text={`ظرفیت ${fmtC(c)} است؛ در این ولتاژ ${faNum(q * 1e9)} نانوکولن بار و ${faNum(u * 1e6)} میکروژول انرژی ذخیره می‌شود.`}
          />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <svg viewBox="0 0 340 200" role="img" aria-label="دو صفحهٔ خازن و دی‌الکتریک بینشان" className="block h-auto w-full">
            <rect x="60" y="40" width="220" height="10" fill="currentColor" className="text-primary" />
            <rect x="60" y={60 + plateGap} width="220" height="10" fill="currentColor" className="text-primary" />
            <rect x="60" y="54" width="220" height={Math.max(4, plateGap - 2)} fill="currentColor" opacity="0.18" className="text-accent" />
            <text x="290" y="50" fontSize="16" fill="currentColor" className="text-danger">+</text>
            <text x="290" y={80 + plateGap} fontSize="16" fill="currentColor" className="text-primary">−</text>
            <text x="170" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">
              {`فاصله ${dMm} میلی‌متر — دی‌الکتریک ${DIELECTRICS[kIdx].label}`}
            </text>
          </svg>
          <p className="px-1 pb-1 pt-1 text-center text-2xs text-ink-faint">صفحهٔ بزرگ‌تر و فاصلهٔ کمتر یعنی ظرفیت بیشتر</p>
        </div>
      </div>
    </section>
  );
}
