import { useState } from 'react';
import { Slider, Toggle, LiveReadout, FunctionPlot } from '../common/Controls';
import { useHydrated } from '../common/useHydrated';

/**
 * RCSandbox — جعبهٔ شن مدار RC.
 *
 * مقاومت، ظرفیت و ولتاژ باتری تنظیم می‌شوند؛ در دو حالت شارژ و تخلیه،
 * ولتاژ خازن در هر لحظه با فرمول نمایی واقعی حساب و نمودار آن رسم
 * می‌شود. لغزندهٔ زمان، نقطهٔ «الان» را روی منحنی نشان می‌دهد.
 */

const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (v: number, digits = 2): string =>
  v.toFixed(digits).replace(/-/g, '−').replace(/\d/g, (d) => FA[Number(d)]).replace('.', '٫');

const DEFAULTS = { rK: 10, cU: 100, volts: 9, charging: true, tTau: 1 };

export default function RCSandbox() {
  const hydrated = useHydrated('rcSandbox');
  const [rK, setRK] = useState(DEFAULTS.rK);
  const [cU, setCU] = useState(DEFAULTS.cU);
  const [volts, setVolts] = useState(DEFAULTS.volts);
  const [charging, setCharging] = useState(DEFAULTS.charging);
  const [tTau, setTTau] = useState(DEFAULTS.tTau);

  const tau = rK * 1000 * cU * 1e-6;
  const t = tTau * tau;
  const vc = charging ? volts * (1 - Math.exp(-t / tau)) : volts * Math.exp(-t / tau);
  const pct = Math.round((vc / volts) * 100);

  const reset = () => {
    setRK(DEFAULTS.rK);
    setCU(DEFAULTS.cU);
    setVolts(DEFAULTS.volts);
    setCharging(DEFAULTS.charging);
    setTTau(DEFAULTS.tTau);
  };

  return (
    <section
      aria-label="جعبهٔ شن مدار RC"
      className="my-7 rounded-lg border border-line bg-surface px-5 py-5"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-ink-faint">جعبهٔ شن RC — شارژ و تخلیهٔ نمایی</p>
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
          <Toggle label={charging ? 'حالت: شارژ' : 'حالت: تخلیه'} checked={!charging} onChange={(c) => setCharging(!c)} hint="کلید را بزن تا عوض شود" />
          <Slider label="مقاومت — کیلواهم" value={rK} min={1} max={100} step={1} onChange={setRK} />
          <Slider label="ظرفیت — میکروفاراد" value={cU} min={10} max={1000} step={10} onChange={setCU} />
          <Slider label="ولتاژ باتری — ولت" value={volts} min={1} max={24} step={1} onChange={setVolts} />
          <Slider label="زمان — بر حسب τ" value={tTau} min={0} max={5} step={0.1} onChange={setTTau} />
          <LiveReadout
            text={`ثابت زمانی ${faNum(tau)} ثانیه است؛ در این لحظه ولتاژ خازن ${faNum(vc)} ولت (${faNum(pct, 0)}٪ ${charging ? 'شارژ' : 'باقی‌مانده'}) است.`}
          />
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-surface-sunken/60 p-2">
          <FunctionPlot
            fn={(x) => (charging ? volts * (1 - Math.exp(-x)) : volts * Math.exp(-x))}
            xMin={0}
            xMax={5}
            yMin={0}
            yMax={volts}
            label={charging ? 'نمودار شارژ خازن' : 'نمودار تخلیهٔ خازن'}
          />
          <p className="px-1 pb-1 pt-1 text-center text-2xs text-ink-faint">محور افقی زمان بر حسب τ — نقطهٔ «الان» همان لغزندهٔ زمان است</p>
        </div>
      </div>
    </section>
  );
}
