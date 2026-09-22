import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useWeather } from "../context/WeatherContext";

// NavLink handles active route state automatically without manual path matching
const linkClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
    isActive
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
  }`;

export default function Header() {
  const { unit, unitSymbol, toggleUnit } = useWeather();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 lg:px-20">
        <Link
          to="/"
          aria-label="Skycast Homepage"
          className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
        >
          <img
            src={logo}
            alt="Skycast weather logo"
            width="40"
            height="40"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-blue-500">
            Sky<span className="text-white">cast</span>
          </span>
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-2">
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
          className="rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-sm font-bold text-blue-400 transition hover:bg-slate-700/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {unitSymbol}
        </button>
      </div>
    </header>
  );
}
