import CityBar from "./CityBar";
import { useWeather } from "../context/WeatherContext";
import { formatCityLabel } from "../weather";

const round = (value) => (Number.isFinite(value) ? Math.round(value) : "–");

const clockTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

function Stat({ label, value, tone = "text-blue-400" }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-700/30 bg-slate-900/50 p-4">
      <span className="mb-1 text-xs text-slate-400">{label}</span>
      <span className={`text-xl font-bold ${tone}`}>{value}</span>
    </div>
  );
}

export default function HomePage() {
  const { activeCity, status, error, forecast, unitSymbol, speedUnit, refresh } = useWeather();

  const today = forecast?.daily?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-12 font-sans text-slate-100">
      <div className="container mx-auto px-4 pt-6 lg:px-20">
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-slate-700/50 py-4">
          <CityBar />
        </div>

        {status === "loading" && (
          <p className="p-20 text-center text-xl font-medium text-blue-300">
            Loading weather for {activeCity.name}…
          </p>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-rose-800/50 bg-rose-950/30 p-10 text-center">
            <p className="mb-4 text-lg text-rose-300">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-rose-500/20 px-5 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/30"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && forecast && (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-8 shadow-2xl backdrop-blur-xl md:col-span-2">
                <div className="pointer-events-none absolute -mr-16 -mt-16 right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="mb-1 text-4xl font-extrabold tracking-tight text-white">
                        {activeCity.name}
                      </h1>
                      <p className="text-sm font-medium text-slate-400">
                        {formatCityLabel(activeCity)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Local time {clockTime(forecast.current.time)} · {forecast.timezone}
                      </p>
                    </div>
                    <span aria-hidden="true" className="text-7xl leading-none drop-shadow-lg">
                      {forecast.current.icon}
                    </span>
                  </div>

                  <div className="my-8 flex flex-wrap items-baseline gap-6">
                    <p className="bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-8xl font-black text-transparent">
                      {round(forecast.current.temperature)}°
                    </p>
                    <div>
                      <p className="text-2xl font-semibold text-blue-200">
                        {forecast.current.condition}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-400">
                        Feels like {round(forecast.current.apparentTemperature)}{unitSymbol}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 border-t border-slate-700/50 pt-4 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500">Wind</span>{" "}
                    <span className="font-semibold text-white">
                      {round(forecast.current.windSpeed)} {speedUnit}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Pressure</span>{" "}
                    <span className="font-semibold text-white">
                      {round(forecast.current.pressure)} hPa
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Humidity</span>{" "}
                    <span className="font-semibold text-white">{forecast.current.humidity}%</span>
                  </p>
                </div>
              </section>

              <section className="flex flex-col justify-between rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                  Today at a glance
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <Stat label="High" value={`${round(today?.high)}${unitSymbol}`} tone="text-emerald-400" />
                  <Stat label="Low" value={`${round(today?.low)}${unitSymbol}`} tone="text-amber-400" />
                  <Stat label="Chance of rain" value={`${today?.rain ?? 0}%`} />
                  <Stat label="Humidity" value={`${forecast.current.humidity}%`} />
                  <Stat label="Sunrise" value={today ? clockTime(today.sunrise) : "–"} tone="text-amber-300" />
                  <Stat label="Sunset" value={today ? clockTime(today.sunset) : "–"} tone="text-indigo-300" />
                </div>
              </section>
            </div>

            {/* ─── Next 12 hours ─── */}
            <section className="mt-8 rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Header bar */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Icon badge */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30 text-base">
                    🕐
                  </div>
                  <h2 className="text-xl font-bold text-white">Next 12 hours</h2>
                </div>
                {/* City label pill */}
                <span className="flex items-center gap-1.5 rounded-full border border-slate-700/40 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                  {activeCity.name} local time
                </span>
              </div>

              {/* Scrollable hourly cards */}
              <ul className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                {forecast.hourly.map((hour) => (
                  <li
                    key={hour.key}
                    className={`flex min-w-[110px] flex-col items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 hover:scale-105 ${
                      hour.isNow
                        ? "border-blue-400 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                        : "border-slate-700/40 bg-slate-900/40 text-slate-200 hover:border-slate-600/60"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        hour.isNow ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {hour.isNow ? "Now" : clockTime(hour.date)}
                    </span>

                    <span aria-hidden="true" className="text-3xl">
                      {hour.icon}
                    </span>
                    <span className="sr-only">{hour.condition}</span>

                    <span className="text-2xl font-bold tracking-tight">
                      {round(hour.temperature)}°
                    </span>

                    <span
                      className={`text-[11px] ${hour.isNow ? "text-blue-100" : "text-slate-400"}`}
                    >
                      💧 {hour.humidity}% · 🌧️ {hour.rain}%
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
