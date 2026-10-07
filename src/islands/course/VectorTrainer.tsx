import { useState } from 'react';
import { Slider, LiveReadout } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * VectorTrainer — مربی جمع برداری.
 *
 * دو بردار با اندازه و زاویه تنظیم می‌شوند؛ مؤلفه‌ها و برآیند با جمع
 * برداری حساب و روی SVG رسم می‌شوند. تمرینِ دستِ جمعِ نیروها و میدان‌هاست.
 */

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 1): string =>
  v.toFixed(digits).replace(/-/g, '−').replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

const DEFAULTS = { aMag: 3, aAng: 30, bMag: 2, bAng: 120 };
const CX = 170;
const CY = 100;
const SCALE = 22;

function arrow(x1: number, y1: number, x2: number, y2: number, cls: string, dashed = false) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className={cls} strokeDasharray={dashed ? '5 4' : undefined} />
  );
}

export default function VectorTrainer() {
  const hydrated = useHydrated('vectorTrainer');
  const [aMag, setAMag] = useState(DEFAULTS.aMag);
  const [aAng, setAAng] = useState(DEFAULTS.aAng);
  const [bMag, setBMag] = useState(DEFAULTS.bMag);
  const [bAng, setBAng] = useState(DEFAULTS.bAng);

  const rad = (d: number) => (d * Math.PI) / 180;
  const ax = aMag * Math.cos(rad(aAng));
  const ay = aMag * Math.sin(rad(aAng));
  const bx = bMag * Math.cos(rad(bAng));
  const by = bMag * Math.sin(rad(bAng));
  const rx = ax + bx;
  const ry = ay + by;
  const rMag = Math.hypot(rx, ry);
  const rAng = (Math.atan2(ry, rx) * 180) / Math.PI;

  const reset = () => {
    setAMag(DEFAULTS.aMag);
    setAAng(DEFAULTS.aAng);
    setBMag(DEFAULTS.bMag);
    setBAng(DEFAULTS.bAng);
  };

  return (
    <section
      aria-label="مربی جمع برداری"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">مربی جمع برداری — برآیند دو بردار</p>
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
          <Slider label="اندازهٔ بردار اول" value={aMag} min={0} max={5} step={0.5} onChange={setAMag} />
          <Slider label="زاویهٔ بردار اول — درجه" value={aAng} min={0} max={360} step={5} onChange={setAAng} />
          <Slider label="اندازهٔ بردار دوم" value={bMag} min={0} max={5} step={0.5} onChange={setBMag} />
          <Slider label="زاویهٔ بردار دوم — درجه" value={bAng} min={0} max={360} step={5} onChange={setBAng} />
          <LiveReadout
            text={`برآیند: اندازه ${faNum(rMag)} و زاویه ${faNum(((rAng % 360) + 360) % 360, 0)} درجه — مؤلفه‌ها: (${faNum(rx)} ، ${faNum(ry)})`}
          />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <svg viewBox="0 0 340 200" role="img" aria-label="جمع دو بردار و برآیندشان" className="block h-auto w-full">
            <line x1="10" y1={CY} x2="330" y2={CY} stroke="currentColor" strokeWidth="1" opacity="0.3" className="text-ink" />
            <line x1={CX} y1="10" x2={CX} y2="190" stroke="currentColor" strokeWidth="1" opacity="0.3" className="text-ink" />
            {arrow(CX, CY, CX + ax * SCALE, CY - ay * SCALE, 'text-primary')}
            {arrow(CX, CY, CX + bx * SCALE, CY - by * SCALE, 'text-accent')}
            {arrow(CX, CY, CX + rx * SCALE, CY - ry * SCALE, 'text-danger', true)}
            <circle cx={CX} cy={CY} r="3.5" fill="currentColor" className="text-ink" />
          </svg>
          <p className="px-1 pb-1 pt-1 text-center text-2xs text-ink-faint">خط‌چین، برآیند است — همان جمع مؤلفه‌به‌مؤلفه</p>
        </div>
      </div>
    </section>
  );
}
