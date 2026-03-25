import { useState } from "react";
import Icon from "@/components/ui/icon";
import SearchPanel from "./SearchPanel";
import ResultsTable, { Violation } from "./ResultsTable";
import StatsCards from "./StatsCards";

const SEARCH_URL = "https://functions.poehali.dev/a74b4e30-ad6e-462c-a8d5-5ebcb892cfbb";

const MonitoringDashboard = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQueries, setActiveQueries] = useState<string[]>([]);

  const handleSearch = async (queries: string[], marketplace: string, _type: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setViolations([]);
    setError(null);
    setActiveQueries(queries);

    try {
      // Передаём все бренды одним запросом через запятую — бэкенд сам разберёт
      const combined = queries.join(",");
      const params = new URLSearchParams({ query: combined, marketplace });
      const res = await fetch(`${SEARCH_URL}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setViolations(data.results || []);
    } catch {
      setError("Не удалось получить данные. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="monitoring" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StatsCards />
      <SearchPanel onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && activeQueries.length > 0 && (
        <div className="card-glass rounded-xl px-5 py-3 mb-4 flex flex-wrap items-center gap-2 font-mono text-xs text-[hsl(215,20%,55%)]">
          <Icon name="Loader2" size={13} className="animate-spin text-[var(--neon)]" />
          <span>Сканирую все словоформы для:</span>
          {activeQueries.map((q, i) => (
            <span key={i} className="bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.25)] text-[var(--neon)] px-2 py-0.5 rounded-md">
              {q}
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="card-glass rounded-xl px-5 py-4 text-sm text-[#ff4d6d] border border-[rgba(255,77,109,0.2)] mb-4 font-mono">
          {error}
        </div>
      )}
      {(isLoading || hasSearched) && !error && (
        <ResultsTable violations={violations} isLoading={isLoading} />
      )}
    </section>
  );
};

export default MonitoringDashboard;
