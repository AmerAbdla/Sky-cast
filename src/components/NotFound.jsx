import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4 text-center text-slate-200">
      <h1 className="text-3xl font-bold text-white">This page doesn’t exist</h1>
      <p className="text-slate-400">Check the address, or head back to the forecast.</p>
      <Link
        to="/"
        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        Go to Today
      </Link>
    </main>
  );
}
