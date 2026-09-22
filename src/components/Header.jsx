import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useWeather } from "../context/WeatherContext";

// NavLink handles active route state automatically without manual path matching
const linkClass = ({ isActive }) =>
  `rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
    isActive
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
  }`;

export default function Header() {
  const { unit, unitSymbol, toggleUnit } = useWeather();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3 lg:px-20">
        <Link
          to="/"
          aria-label="Skycast Homepage"
          className="group flex shrink-0 items-center gap-1.5 sm:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
        >
          <img
            src={logo}
            alt="Skycast weather logo"
            width="40"
            height="40"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />
          <span className="text-xl font-bold tracking-tight text-blue-500 sm:text-2xl">
            Sky<span className="text-white">cast</span>
          </span>
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={linkClass}>
            Today
          </NavLink>
          <NavLink to="/forecast" className={linkClass}>
            Forecast
          </NavLink>
          <NavLink to="/map" className={linkClass}>
            Map
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={toggleUnit}
          aria-label={`Switch temperature unit to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`}
          className="shrink-0 rounded-xl border border-slate-700/60 bg-slate-800/80 px-2.5 py-1.5 text-xs font-bold text-blue-400 transition hover:bg-slate-700/80 sm:px-3 sm:py-2 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {unitSymbol}
        </button>
      </div>
    </header>
  );
}
