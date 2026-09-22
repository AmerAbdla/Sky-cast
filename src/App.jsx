import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import { WeatherProvider } from "./context/WeatherContext";
import "./App.css";

// Lazy-load secondary and map-heavy routes to optimize initial bundle size & FCP
const Forecast = lazy(() => import("./components/Forecast"));
const WeatherMap = lazy(() => import("./components/WeatherMap"));
const NotFound = lazy(() => import("./components/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-blue-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        <span className="text-sm font-medium">Loading view…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    // WeatherProvider wraps the router so active city and unit persist across routes
    <WeatherProvider>
      <div className="flex min-h-screen flex-col bg-slate-900">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/map" element={<WeatherMap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </WeatherProvider>
  );
}

