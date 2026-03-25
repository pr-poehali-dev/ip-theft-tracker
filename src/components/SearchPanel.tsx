import { useState, useRef, KeyboardEvent } from "react";
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
  onSearch: (queries: string[], marketplace: string, type: string) => void;
  isLoading: boolean;
}

const SearchPanel = ({ onSearch, isLoading }: SearchPanelProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [marketplace, setMarketplace] = useState("all");
  const [violationType, setViolationType] = useState("Товарный знак");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTags = [...tags];
    if (inputValue.trim()) {
      finalTags.push(inputValue.trim());
      setInputValue("");
      setTags(finalTags);
    }
    if (finalTags.length > 0) {
      onSearch(finalTags, marketplace, violationType);
    }
  };

  const hasInput = tags.length > 0 || inputValue.trim().length > 0;

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

        {/* Поле с тегами */}
        <div>
          <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2">
            Товарные знаки для мониторинга
          </div>
          <div
            className="min-h-[52px] w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(0,212,255,0.2)] rounded-xl px-3 py-2.5 flex flex-wrap gap-2 items-center cursor-text focus-within:border-[var(--neon)] focus-within:shadow-[0_0_0_1px_rgba(0,212,255,0.3)] transition-all duration-200"
            onClick={() => inputRef.current?.focus()}
          >
            <Icon name="Shield" size={15} className="text-[var(--neon)] shrink-0 ml-1" />

            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.3)] text-[var(--neon)] text-xs font-mono px-2.5 py-1 rounded-lg"
              >
                {tag}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                  className="text-[rgba(0,212,255,0.6)] hover:text-[var(--neon)] transition-colors"
                >
                  <Icon name="X" size={11} />
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
              placeholder={tags.length === 0 ? "Введите товарный знак и нажмите Enter..." : "Добавить ещё..."}
              className="flex-1 min-w-[180px] bg-transparent text-white placeholder-[hsl(215,20%,35%)] text-sm font-mono outline-none"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-[11px] text-[hsl(215,20%,35%)] font-mono">
              Enter или запятая — добавить знак • Backspace — удалить последний
            </div>
            {tags.length > 0 && (
              <button
                type="button"
                onClick={() => setTags([])}
                className="text-[11px] text-[rgba(255,77,109,0.7)] hover:text-[#ff4d6d] font-mono transition-colors ml-auto"
              >
                Очистить все
              </button>
            )}
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
                      ? { background: `${mp.color}20`, borderColor: mp.color, color: mp.color, boxShadow: `0 0 10px ${mp.color}30` }
                      : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", color: "hsl(215,20%,55%)" }
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
            {tags.length > 0
              ? `${tags.length} товарн${tags.length === 1 ? "ый знак" : tags.length < 5 ? "ых знака" : "ых знаков"} в очереди`
              : "Система активна • Добавьте товарные знаки"}
          </div>
          <button
            type="submit"
            disabled={isLoading || !hasInput}
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
                Начать мониторинг
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
