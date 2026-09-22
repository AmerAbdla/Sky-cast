import CityBar from "./CityBar";
import { useWeather } from "../context/WeatherContext";

const round = (value) => (Number.isFinite(value) ? Math.round(value) : "–");

const dayName = (date, isToday) =>
  isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });

const shortDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const clockTime = (date) => date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

/** Clean, responsive SVG chart rendering daily high & low temperature lines */
function TemperatureChart({ days, unitSymbol }) {
  if (days.length < 2) return null;

  const width = 700;
  const height = 200;
  const padX = 34;
  const padY = 34;

  const values = days.flatMap((d) => [d.high, d.low]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const x = (i) => padX + (i * (width - padX * 2)) / (days.length - 1);
  const y = (v) => padY + (1 - (v - min) / span) * (height - padY * 2);
  const points = (key) => days.map((d, i) => `${x(i)},${y(d[key])}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Daily high and low temperature in ${unitSymbol} for the next ${days.length} days`}
    >
      <polyline points={points("high")} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
      <polyline
        points={points("low")}
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {days.map((d, i) => (
        <g key={d.key}>
          <circle cx={x(i)} cy={y(d.high)} r="3.5" fill="#60a5fa" />
          <text x={x(i)} y={y(d.high) - 10} textAnchor="middle" fontSize="12" fill="#bfdbfe">
            {round(d.high)}°
          </text>
          <circle cx={x(i)} cy={y(d.low)} r="3" fill="#a5b4fc" />
          <text x={x(i)} y={y(d.low) + 20} textAnchor="middle" fontSize="12" fill="#c7d2fe">
            {round(d.low)}°
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Forecast() {
  const { activeCity, status, error, forecast, unitSymbol, refresh } = useWeather();
  const days = forecast?.daily ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-16 font-sans text-slate-100">
      <div className="container mx-auto px-3 pt-4 sm:px-4 sm:pt-8 lg:px-20">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-700/50 pb-4 sm:mb-8 sm:pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">7-day forecast</h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Extended outlook for{" "}
              <span className="font-medium text-blue-400">{activeCity.name}</span>
            </p>
          </div>
          <CityBar />
        </div>

        {status === "loading" && (
          <p className="flex h-64 items-center justify-center font-medium text-slate-400">
            Loading forecast…
          </p>
        )}

        {status === "error" && (
          <div className="my-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center sm:p-6">
            <p className="mb-4 text-sm text-red-300 sm:text-base">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-red-500/20 px-5 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && forecast && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-2 sm:mb-10 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
              {days.map((item) => (
                <article
                  key={item.key}
                  className={`flex flex-col items-center justify-between gap-2 rounded-xl border p-3 text-center sm:rounded-2xl sm:p-4 ${
                    item.isToday
                      ? "border-blue-400 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20"
                      : "border-slate-700/50 bg-slate-800/40 text-slate-200 backdrop-blur-md"
                  }`}
                >
                  <div>
                    <h2 className="text-sm font-bold sm:text-base">{dayName(item.date, item.isToday)}</h2>
                    <p className={`text-[11px] sm:text-xs ${item.isToday ? "text-blue-100" : "text-slate-400"}`}>
                      {shortDate(item.date)}
                    </p>
                  </div>

                  <span aria-hidden="true" className="my-1 text-2xl sm:text-3xl">
                    {item.icon}
                  </span>

                  <p
                    className={`text-[11px] font-medium sm:text-xs ${
                      item.isToday ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {item.condition}
                  </p>

                  <p className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-base font-bold sm:text-lg">{round(item.high)}°</span>
                    <span className={`text-[11px] sm:text-xs ${item.isToday ? "text-blue-200" : "text-slate-400"}`}>
                      {round(item.low)}°
                    </span>
                  </p>
                </article>
              ))}
            </div>

            <section className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 shadow-2xl backdrop-blur-xl sm:mb-10 sm:rounded-3xl sm:p-6 lg:p-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
                <h2 className="text-base font-bold text-white sm:text-lg">Temperature and rain outlook</h2>
                <div className="flex items-center gap-3 text-[11px] font-medium sm:gap-4 sm:text-xs">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="inline-block h-0.5 w-3 rounded-full bg-blue-400" /> High
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <span className="inline-block w-3 border-t border-dashed border-indigo-300" /> Low
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto touch-pan-x custom-scrollbar -mx-2 px-2 pb-2">
                <div className="min-w-[550px] sm:min-w-[600px]">
                  <TemperatureChart days={days} unitSymbol={unitSymbol} />

                  <div
                    className="mt-6 grid gap-2 text-center"
                    style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
                  >
                    {days.map((item) => (
                      <div key={item.key} className="flex flex-col items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-300 sm:text-xs">
                          {dayName(item.date, item.isToday)}
                        </span>
                        <div className="flex h-14 w-full items-end justify-center rounded-lg bg-slate-900/60 p-1 sm:h-16">
                          {/* Bar height represents true precipitation probability percentage */}
                          <div
                            className="w-full rounded bg-blue-500"
                            style={{ height: `${item.rain}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-blue-400 sm:text-xs">{item.rain}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-center text-[11px] text-slate-500 sm:text-xs">
                    Bars show the highest chance of rain during each day.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:p-8">
              <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Hour by hour</h2>

              <div className="overflow-x-auto touch-pan-x custom-scrollbar -mx-2 px-2">
                <table className="w-full min-w-[500px] text-left text-slate-300">
                  <caption className="sr-only">
                    Next 12 hours in {activeCity.name}
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-700/60 text-[11px] text-slate-400 sm:text-xs">
                      <th scope="col" className="px-3 py-2.5 sm:px-4 sm:py-3">Time</th>
                      <th scope="col" className="px-3 py-2.5 sm:px-4 sm:py-3">Condition</th>
                      <th scope="col" className="px-3 py-2.5 text-center sm:px-4 sm:py-3">Temp</th>
                      <th scope="col" className="px-3 py-2.5 text-center sm:px-4 sm:py-3">Feels like</th>
                      <th scope="col" className="px-3 py-2.5 text-center sm:px-4 sm:py-3">Humidity</th>
                      <th scope="col" className="px-3 py-2.5 text-center sm:px-4 sm:py-3">Rain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {forecast.hourly.map((row) => (
                      <tr key={row.key} className="text-xs sm:text-sm hover:bg-slate-800/40">
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-white sm:px-4 sm:py-3.5">
                          {row.isNow ? "Now" : clockTime(row.date)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5">
                          <span className="flex items-center gap-1.5 sm:gap-2">
                            <span aria-hidden="true" className="text-base sm:text-lg">{row.icon}</span>
                            {row.condition}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center font-bold text-blue-300 sm:px-4 sm:py-3.5">
                          {round(row.temperature)}°
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center text-slate-400 sm:px-4 sm:py-3.5">
                          {round(row.apparentTemperature)}°
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-center text-blue-400 sm:px-4 sm:py-3.5">{row.humidity}%</td>
                        <td className="whitespace-nowrap px-3 py-3 text-center text-slate-400 sm:px-4 sm:py-3.5">{row.rain}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
