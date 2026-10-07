import { useState } from 'react';
import { Slider, Toggle, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * CircuitBuilder — سازندهٔ مدار مقاومتی.
 *
 * سه مقاومت با لغزنده، حالت سری/موازی با کلید، و ولتاژ باتری: مقاومت
 * معادل، جریان کل و توان با فرمول واقعی حساب می‌شوند. سهم هر مقاومت
 * با میلهٔ نمایشی دیده می‌شود.
 */

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 1): string =>
  v.toFixed(digits).replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

const DEFAULTS = { r1: 10, r2: 20, r3: 30, volts: 12, series: true };

function fmtR(v: number): string {
  return v >= 1000 ? `${faNum(v / 1000)} kΩ` : `${faNum(v, 0)} Ω`;
}

export default function CircuitBuilder() {
  const hydrated = useHydrated('circuitBuilder');
  const [r1, setR1] = useState(DEFAULTS.r1);
  const [r2, setR2] = useState(DEFAULTS.r2);
  const [r3, setR3] = useState(DEFAULTS.r3);
  const [volts, setVolts] = useState(DEFAULTS.volts);
  const [series, setSeries] = useState(DEFAULTS.series);

  const rs = [r1, r2, r3];
  const req = series ? r1 + r2 + r3 : 1 / (1 / r1 + 1 / r2 + 1 / r3);
  const iTotal = volts / req;
  const power = volts * iTotal;
  // Per-resistor share for the bars: voltage share in series, current share in parallel.
  const shares = series ? rs.map((r) => r / req) : rs.map((r) => req / r);
  const maxShare = Math.max(...shares);

  const reset = () => {
    setR1(DEFAULTS.r1);
    setR2(DEFAULTS.r2);
    setR3(DEFAULTS.r3);
    setVolts(DEFAULTS.volts);
    setSeries(DEFAULTS.series);
  };

  return (
    <section
      aria-label="سازندهٔ مدار مقاومتی"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">سازندهٔ مدار — سه مقاومت، دو حالت اتصال</p>
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
          <Toggle label={series ? 'اتصال: سری' : 'اتصال: موازی'} checked={!series} onChange={(c) => setSeries(!c)} hint="کلید را بزن تا حالت عوض شود" />
          <Slider label="مقاومت اول — اهم" value={r1} min={1} max={100} step={1} onChange={setR1} />
          <Slider label="مقاومت دوم — اهم" value={r2} min={1} max={100} step={1} onChange={setR2} />
          <Slider label="مقاومت سوم — اهم" value={r3} min={1} max={100} step={1} onChange={setR3} />
          <Slider label="ولتاژ باتری — ولت" value={volts} min={1} max={24} step={1} onChange={setVolts} />
          <LiveReadout
            text={`مقاومت معادل ${fmtR(req)}، جریان کل ${faNum(iTotal * 1000, 0)} میلی‌آمپر و توان مصرفی ${faNum(power)} وات است.`}
          />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-3">
          <p className="mb-2 text-xs font-bold text-ink-faint">{series ? 'سهم هر مقاومت از ولتاژ کل' : 'سهم هر مقاومت از جریان کل'}</p>
          <div className="grid gap-3" dir="ltr">
            {rs.map((r, i) => (
              <div key={i} className="grid gap-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-ink">R{i + 1}</span>
                  <span className="text-ink-muted">{fmtR(r)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface" role="img" aria-label={`سهم مقاومت ${i + 1}`}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(shares[i] / maxShare) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 340 90" role="img" aria-label={series ? 'مدار سری' : 'مدار موازی'} className="mt-3 block h-auto w-full">
            {series ? (
              <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink">
                <rect x="20" y="25" width="300" height="40" />
                {[70, 170, 270].map((x) => (
                  <rect key={x} x={x - 18} y="25" width="36" height="40" strokeWidth="2" className="text-primary" />
                ))}
              </g>
            ) : (
              <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink">
                <line x1="40" y1="10" x2="40" y2="80" />
                <line x1="300" y1="10" x2="300" y2="80" />
                {[25, 45, 65].map((y) => (
                  <g key={y}>
                    <line x1="40" y1={y} x2="300" y2={y} />
                    <rect x="152" y={y - 8} width="36" height="16" strokeWidth="2" className="text-primary" />
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>
    </section>
  );
}
