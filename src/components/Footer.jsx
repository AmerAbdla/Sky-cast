export default function Footer() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer className="mt-8 border-t border-slate-800/80 bg-slate-950/40 py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium text-slate-400">
          Skycast · Weather data updated every 30 minutes via Open-Meteo ·{" "}
          <time dateTime={now.toISOString()}>{formattedDate}</time>
        </p>
      </div>
    </footer>
  );
}
