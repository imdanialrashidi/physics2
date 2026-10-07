import { useState } from 'react';
import { Slider, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * CoulombLab — آزمایشگاه قانون کولن.
 *
 * دو بار نقطه‌ای با لغزنده‌ها تنظیم می‌شوند؛ نیرو با قانون کولن حساب و
 * جهت (دفع/جذب) از علامت بارها نتیجه می‌شود. خروجی عددی زنده + پیکان‌های
 * نیرو روی SVG. دکمهٔ «بازنشانی» به حالت اولیه برمی‌گردد.
 */

const K = 8.99e9;
const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 2): string =>
  v.toFixed(digits).replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

const DEFAULTS = { q1: 2, q2: -3, rCm: 10 };

export default function CoulombLab() {
  const hydrated = useHydrated('coulombLab');
  const [q1, setQ1] = useState(DEFAULTS.q1);
  const [q2, setQ2] = useState(DEFAULTS.q2);
  const [rCm, setRCm] = useState(DEFAULTS.rCm);

  const r = rCm / 100;
  const f = (K * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / (r * r);
  const attracting = q1 * q2 < 0;
  const zero = q1 === 0 || q2 === 0;

  const reset = () => {
    setQ1(DEFAULTS.q1);
    setQ2(DEFAULTS.q2);
    setRCm(DEFAULTS.rCm);
  };

  // Arrow length grows slowly with force so tiny/huge forces stay visible.
  const arrowLen = 14 + Math.min(46, 10 * Math.log10(1 + f));

  return (
    <section
      aria-label="آزمایشگاه قانون کولن"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">آزمایشگاه قانون کولن</p>
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
          <Slider label="بار اول (q₁) — میکروکولن" value={q1} min={-10} max={10} step={0.5} onChange={setQ1} />
          <Slider label="بار دوم (q₂) — میکروکولن" value={q2} min={-10} max={10} step={0.5} onChange={setQ2} />
          <Slider label="فاصله — سانتی‌متر" value={rCm} min={2} max={30} step={1} onChange={setRCm} />
          <LiveReadout
            text={
              zero
                ? 'یکی از بارها صفر است، پس نیرویی وجود ندارد.'
                : `نیرو ${faNum(f)} نیوتن است و دو بار همدیگر را ${attracting ? 'جذب' : 'دفع'} می‌کنند.`
            }
          />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <svg viewBox="0 0 340 170" role="img" aria-label="نمایش دو بار و جهت نیروی بینشان" className="block h-auto w-full">
            <line x1="20" y1="85" x2="320" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" className="text-ink" />
            {/* charge 1 */}
            <circle cx="90" cy="85" r="16" fill={q1 >= 0 ? '#1D4ED8' : '#B45309'} opacity="0.9" />
            <text x="90" y="90" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">
              {q1 >= 0 ? '+' : '−'}
            </text>
            {/* charge 2 */}
            <circle cx="250" cy="85" r="16" fill={q2 >= 0 ? '#1D4ED8' : '#B45309'} opacity="0.9" />
            <text x="250" y="90" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">
              {q2 >= 0 ? '+' : '−'}
            </text>
            {!zero && (
              <g stroke="currentColor" strokeWidth="2" className="text-primary-deep">
                {attracting ? (
                  <>
                    <line x1={90 + 20} y1="60" x2={90 + 20 + arrowLen} y2="60" markerEnd="url(#cl-head)" />
                    <line x1={250 - 20} y1="60" x2={250 - 20 - arrowLen} y2="60" markerEnd="url(#cl-head)" />
                  </>
                ) : (
                  <>
                    <line x1={90 - 20} y1="60" x2={90 - 20 - arrowLen} y2="60" markerEnd="url(#cl-head)" />
                    <line x1={250 + 20} y1="60" x2={250 + 20 + arrowLen} y2="60" markerEnd="url(#cl-head)" />
                  </>
                )}
                <defs>
                  <marker id="cl-head" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6" fill="none" strokeWidth="1.5" stroke="currentColor" />
                  </marker>
                </defs>
              </g>
            )}
            <text x="170" y="130" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7" className="text-ink">
              {`r = ${rCm} cm`}
            </text>
          </svg>
          <p className="px-1 pb-1 pt-1 text-center text-2xs text-ink-faint">آبی مثبت، کهربایی منفی — پیکان‌ها جهت نیرو را نشان می‌دهند</p>
        </div>
      </div>
    </section>
  );
}
