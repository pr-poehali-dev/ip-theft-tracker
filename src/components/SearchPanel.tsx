import { useState } from "react";
import Icon from "@/components/ui/icon";

const marketplaces = [
  { id: "wb", label: "Wildberries", color: "#cb11ab" },
  { id: "ozon", label: "Ozon", color: "#005bff" },
  { id: "all", label: "Все площадки", color: "var(--neon)" },
];

const violationTypes = [
  "Товарный знак",
  "Авторское право",
  "Патент",
  "Промышленный образец",
  "Фирменное наименование",
];

interface SearchPanelProps {
  onSearch: (query: string, marketplace: string, type: string) => void;
  isLoading: boolean;
}

const SearchPanel = ({ onSearch, isLoading }: SearchPanelProps) => {
  const [query, setQuery] = useState("");
  const [marketplace, setMarketplace] = useState("all");
  const [violationType, setViolationType] = useState("Товарный знак");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query, marketplace, violationType);
  };

  return (
    <div className="card-glass rounded-2xl p-6 mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-5 rounded-full bg-[var(--neon)] shadow-[0_0_8px_var(--neon)]" />
        <h2 className="text-sm font-mono uppercase tracking-widest text-[hsl(215,20%,70%)]">
          Поиск нарушений
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,212,255,0.3)] to-transparent ml-3" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--neon)]">
            <Icon name="Search" size={16} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите название бренда, товарного знака или артикул..."
            className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(0,212,255,0.2)] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[var(--neon)] focus:shadow-[0_0_0_1px_rgba(0,212,255,0.3)] transition-all duration-200 text-sm font-mono"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(215,20%,35%)] text-xs font-mono">
            CTRL+K
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2">
              Площадка
            </div>
            <div className="flex gap-2">
              {marketplaces.map((mp) => (
                <button
                  key={mp.id}
                  type="button"
                  onClick={() => setMarketplace(mp.id)}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 border"
                  style={
                    marketplace === mp.id
                      ? {
                          background: `${mp.color}20`,
                          borderColor: mp.color,
                          color: mp.color,
                          boxShadow: `0 0 10px ${mp.color}30`,
                        }
                      : {
                          background: "rgba(255,255,255,0.02)",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "hsl(215,20%,55%)",
                        }
                  }
                >
                  {mp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2">
              Тип нарушения
            </div>
            <select
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(0,212,255,0.2)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--neon)] transition-all duration-200 font-mono"
            >
              {violationTypes.map((t) => (
                <option key={t} value={t} className="bg-[hsl(220,30%,8%)]">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,40%)] font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            Система активна • Последнее обновление: только что
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--neon)] text-[hsl(220,30%,6%)] rounded-xl font-bold text-sm hover:bg-[rgba(0,212,255,0.85)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[var(--neon-glow)] hover:shadow-[var(--neon-strong)]"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={15} className="animate-spin" />
                Сканирование...
              </>
            ) : (
              <>
                <Icon name="Zap" size={15} />
                Найти нарушения
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
