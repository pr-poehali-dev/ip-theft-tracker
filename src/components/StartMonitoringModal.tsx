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

interface StartMonitoringModalProps {
  onClose: () => void;
  onSearch: (queries: string[], marketplace: string, type: string) => void;
}

const StartMonitoringModal = ({ onClose, onSearch }: StartMonitoringModalProps) => {
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

  const handleStart = () => {
    const finalTags = [...tags];
    if (inputValue.trim()) {
      finalTags.push(inputValue.trim());
    }
    if (finalTags.length === 0) return;

    onSearch(finalTags, marketplace, violationType);

    // Скроллим к результатам
    setTimeout(() => {
      document.getElementById("monitoring")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    onClose();
  };

  const hasInput = tags.length > 0 || inputValue.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl card-glass rounded-2xl border border-[rgba(0,212,255,0.25)] shadow-[0_0_80px_rgba(0,212,255,0.12)]">

        {/* Scan line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-60" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(0,212,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-[var(--neon-dim)] border border-[var(--neon)] pulse-dot" />
              <Icon name="Radar" size={17} className="text-[var(--neon)] relative z-10" />
            </div>
            <div>
              <div className="text-white font-bold text-base">Начать мониторинг</div>
              <div className="text-[11px] text-[hsl(215,20%,45%)] font-mono">Введите товарные знаки для сканирования</div>
            </div>
          </div>
          <button onClick={onClose} className="text-[hsl(215,20%,40%)] hover:text-white transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Поле ввода товарных знаков */}
          <div>
            <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Icon name="Shield" size={11} className="text-[var(--neon)]" />
              Товарные знаки
            </div>
            <div
              className="min-h-[56px] w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(0,212,255,0.2)] rounded-xl px-3 py-2.5 flex flex-wrap gap-2 items-center cursor-text focus-within:border-[var(--neon)] focus-within:shadow-[0_0_0_1px_rgba(0,212,255,0.2)] transition-all duration-200"
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.3)] text-[var(--neon)] text-xs font-mono px-2.5 py-1 rounded-lg"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                    className="text-[rgba(0,212,255,0.5)] hover:text-[var(--neon)] transition-colors"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
                placeholder={tags.length === 0 ? "Например: Емколбаски, Мясновъ, Дымов..." : "Добавить ещё..."}
                className="flex-1 min-w-[160px] bg-transparent text-white placeholder-[hsl(215,20%,35%)] text-sm font-mono outline-none"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <div className="text-[11px] text-[hsl(215,20%,35%)] font-mono">
                Enter или запятая — добавить • Backspace — удалить
              </div>
              {tags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTags([])}
                  className="text-[11px] text-[rgba(255,77,109,0.6)] hover:text-[#ff4d6d] font-mono transition-colors"
                >
                  Очистить
                </button>
              )}
            </div>
          </div>

          {/* Площадка */}
          <div>
            <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Icon name="Globe" size={11} className="text-[var(--neon)]" />
              Площадка
            </div>
            <div className="flex gap-2">
              {marketplaces.map((mp) => (
                <button
                  key={mp.id}
                  type="button"
                  onClick={() => setMarketplace(mp.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 border"
                  style={
                    marketplace === mp.id
                      ? { background: `${mp.color}18`, borderColor: mp.color, color: mp.color, boxShadow: `0 0 12px ${mp.color}25` }
                      : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", color: "hsl(215,20%,50%)" }
                  }
                >
                  {mp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Тип нарушения */}
          <div>
            <div className="text-xs text-[hsl(215,20%,50%)] font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Icon name="AlertTriangle" size={11} className="text-[var(--neon)]" />
              Тип нарушения
            </div>
            <select
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(0,212,255,0.2)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--neon)] transition-all duration-200 font-mono"
            >
              {violationTypes.map((t) => (
                <option key={t} value={t} className="bg-[hsl(220,30%,8%)]">{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[rgba(0,212,255,0.1)]">
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,40%)] font-mono mr-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            {tags.length > 0
              ? `${tags.length} знак${tags.length === 1 ? "" : tags.length < 5 ? "а" : "ов"} готово`
              : "Система готова к сканированию"}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[hsl(215,20%,45%)] font-mono hover:text-white transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleStart}
            disabled={!hasInput}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--neon)] text-[hsl(220,30%,6%)] rounded-xl font-bold text-sm hover:bg-[rgba(0,212,255,0.85)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[var(--neon-glow)] hover:shadow-[var(--neon-strong)]"
          >
            <Icon name="Zap" size={15} />
            Сканировать
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMonitoringModal;
