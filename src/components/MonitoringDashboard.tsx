import { useState } from "react";
import SearchPanel from "./SearchPanel";
import ResultsTable, { Violation } from "./ResultsTable";
import StatsCards from "./StatsCards";

const SEARCH_URL = "https://functions.poehali.dev/a74b4e30-ad6e-462c-a8d5-5ebcb892cfbb";

const MonitoringDashboard = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, marketplace: string, _type: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setViolations([]);
    setError(null);

    try {
      const params = new URLSearchParams({ query, marketplace });
      const res = await fetch(`${SEARCH_URL}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setViolations(data.results || []);
    } catch (e) {
      setError("Не удалось получить данные. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="monitoring" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StatsCards />
      <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
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
