import { useEffect, useRef, useState } from "react";
import { useWeather } from "../context/WeatherContext";
import { cityKey, formatCityLabel, searchCities } from "../weather";

function SearchDialog({ onClose }) {
  const { setActiveCity } = useWeather();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchCities(query, controller.signal)
        .then((found) => {
          setResults(found);
          setSearchError(null);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setSearchError("Search is unavailable right now.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsSearching(false);
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const choose = (city) => {
    setActiveCity(city);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-3 pt-16 sm:p-4 sm:pt-24 backdrop-blur-md"
      onMouseDown={(e) => {
        if (!dialogRef.current?.contains(e.target)) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Add a city"
        className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900 p-5 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:text-white sm:right-6 sm:top-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          ✕
        </button>

        <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl">Add a city</h2>
        <p className="mb-4 text-xs text-slate-400 sm:mb-6 sm:text-sm">
          Search by city name, then pick the right match.
        </p>

        <label htmlFor="city-search" className="sr-only">
          City name
        </label>
        <input
          id="city-search"
          type="text"
          placeholder="Cairo, Lisbon, Nairobi…"
          value={term}
          onChange={(e) => {
            const val = e.target.value;
            setTerm(val);
            if (val.trim().length < 2) {
              setResults([]);
              setSearchError(null);
            }
          }}
          autoFocus
          autoComplete="off"
          className="mb-6 w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3.5 text-white placeholder-slate-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {term.trim().length < 2 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Type at least two letters to search.
          </p>
        ) : isSearching ? (
          <p className="py-6 text-center text-sm text-slate-400">Searching…</p>
        ) : searchError ? (
          <p className="py-6 text-center text-sm text-rose-400">{searchError}</p>
        ) : results.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No city matches that name. Check the spelling and try again.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {results.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => choose(city)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800 p-4 text-left transition hover:bg-slate-700/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>
                    <span className="block font-semibold text-white">{city.name}</span>
                    <span className="block text-xs text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(", ")}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-lg text-slate-500">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function CityBar() {
  const { cities, activeCity, setActiveCity } = useWeather();
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x pb-1 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
        {cities.map((city) => {
          const isActive = cityKey(city) === cityKey(activeCity);
          return (
            <button
              key={cityKey(city)}
              type="button"
              onClick={() => setActiveCity(city)}
              aria-current={isActive ? "true" : undefined}
              title={formatCityLabel(city)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {city.name}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="shrink-0 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-colors hover:bg-blue-500/20 sm:px-4 sm:py-2 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          + Add city
        </button>
      </div>

      {isSearchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
