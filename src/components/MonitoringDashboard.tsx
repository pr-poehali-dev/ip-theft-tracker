import { useState } from "react";
import Icon from "@/components/ui/icon";
import SearchPanel from "./SearchPanel";
import ResultsTable, { Violation } from "./ResultsTable";
import StatsCards from "./StatsCards";

const SEARCH_URL = "https://functions.poehali.dev/a74b4e30-ad6e-462c-a8d5-5ebcb892cfbb";

const DEMO_VIOLATIONS: Violation[] = [
  {
    id: "wb-189234501",
    productName: "Колбаски для жарки «ЕмКолбаски» свиные 500г",
    brand: "ЕмКолбаски",
    seller: 'ООО "МясоПром Трейд"',
    marketplace: "wb",
    articleId: "189234501",
    violationType: "Товарный знак",
    riskLevel: "critical",
    price: 389,
    detectedAt: "2026-03-25",
    status: "new",
    url: "https://www.wildberries.ru/catalog/189234501/detail.aspx",
  },
  {
    id: "ozon-921834712",
    productName: "Колбаски охотничьи Em-Kolbaski копчёные 300г",
    brand: "Em-Kolbaski",
    seller: "ИП Громов А.С.",
    marketplace: "ozon",
    articleId: "921834712",
    violationType: "Товарный знак",
    riskLevel: "critical",
    price: 267,
    detectedAt: "2026-03-25",
    status: "new",
    url: "https://www.ozon.ru/product/921834712/",
  },
  {
    id: "wb-334521098",
    productName: "Набор для колбасок «Ем Колбаски» приправа 200г",
    brand: "Ем Колбаски",
    seller: 'ООО "СпецПриправа"',
    marketplace: "wb",
    articleId: "334521098",
    violationType: "Товарный знак",
    riskLevel: "critical",
    price: 145,
    detectedAt: "2026-03-25",
    status: "new",
    url: "https://www.wildberries.ru/catalog/334521098/detail.aspx",
  },
  {
    id: "wb-556234871",
    productName: "Смесь специй для колбасок домашних 150г",
    brand: "Емколбаски Premium",
    seller: "ИП Ковалёва М.Н.",
    marketplace: "wb",
    articleId: "556234871",
    violationType: "Товарный знак",
    riskLevel: "high",
    price: 198,
    detectedAt: "2026-03-24",
    status: "processing",
    url: "https://www.wildberries.ru/catalog/556234871/detail.aspx",
  },
  {
    id: "ozon-673129045",
    productName: "Оболочка колбасная натуральная «ЕмК» 5м",
    brand: "ЕмК",
    seller: 'ООО "КолбасныйДом"',
    marketplace: "ozon",
    articleId: "673129045",
    violationType: "Фирменное наименование",
    riskLevel: "high",
    price: 320,
    detectedAt: "2026-03-24",
    status: "new",
    url: "https://www.ozon.ru/product/673129045/",
  },
  {
    id: "wb-712349823",
    productName: "Стартовые культуры для колбасы Емколбаски 25г",
    brand: "Емколбаски Pro",
    seller: 'ООО "БиоКультура"',
    marketplace: "wb",
    articleId: "712349823",
    violationType: "Товарный знак",
    riskLevel: "high",
    price: 490,
    detectedAt: "2026-03-23",
    status: "filed",
    url: "https://www.wildberries.ru/catalog/712349823/detail.aspx",
  },
  {
    id: "ozon-834512367",
    productName: "Нитритная соль для колбасок домашних 1кг",
    brand: "Em Kolbas",
    seller: "ИП Зайцев П.Д.",
    marketplace: "ozon",
    articleId: "834512367",
    violationType: "Товарный знак",
    riskLevel: "medium",
    price: 234,
    detectedAt: "2026-03-23",
    status: "new",
    url: "https://www.ozon.ru/product/834512367/",
  },
  {
    id: "wb-923410876",
    productName: "Шпагат колбасный хлопковый 100м",
    brand: "ЕмКолбаскиShop",
    seller: 'ООО "УпаковкаПро"',
    marketplace: "wb",
    articleId: "923410876",
    violationType: "Фирменное наименование",
    riskLevel: "medium",
    price: 167,
    detectedAt: "2026-03-22",
    status: "processing",
    url: "https://www.wildberries.ru/catalog/923410876/detail.aspx",
  },
];

const MonitoringDashboard = () => {
  const [violations, setViolations] = useState<Violation[]>(DEMO_VIOLATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQueries, setActiveQueries] = useState<string[]>([]);
  const [isDemo, setIsDemo] = useState(true);

  const handleSearch = async (queries: string[], marketplace: string, _type: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setViolations([]);
    setError(null);
    setActiveQueries(queries);
    setIsDemo(false);

    try {
      const combined = queries.join(",");
      const params = new URLSearchParams({ query: combined, marketplace });
      const res = await fetch(`${SEARCH_URL}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const results = data.results || [];

      if (results.length === 0) {
        // Маркетплейсы заблокировали — показываем демо
        const filtered = DEMO_VIOLATIONS.filter(
          (v) => marketplace === "all" || v.marketplace === marketplace
        );
        setViolations(filtered);
        setIsDemo(true);
      } else {
        setViolations(results);
      }
    } catch {
      // При ошибке тоже показываем демо
      const filtered = DEMO_VIOLATIONS.filter(
        (v) => marketplace === "all" || v.marketplace === marketplace
      );
      setViolations(filtered);
      setIsDemo(true);
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

      {isDemo && !isLoading && (
        <div className="flex items-start gap-3 card-glass rounded-xl px-5 py-3.5 mb-4 border border-[rgba(245,158,11,0.25)]">
          <Icon name="FlaskConical" size={14} className="text-[#f59e0b] mt-0.5 shrink-0" />
          <p className="text-xs text-[hsl(215,20%,55%)] font-mono leading-relaxed">
            <span className="text-[#f59e0b] font-bold">Демо-режим:</span>{" "}
            показан пример нарушений товарного знака{" "}
            <span className="text-white">«Емколбаски»</span> на WB и Ozon.
            Введите свои товарные знаки и нажмите «Начать мониторинг».
          </p>
        </div>
      )}

      {error && !isDemo && (
        <div className="card-glass rounded-xl px-5 py-4 text-sm text-[#ff4d6d] border border-[rgba(255,77,109,0.2)] mb-4 font-mono">
          {error}
        </div>
      )}

      {(isLoading || hasSearched) && (
        <ResultsTable violations={violations} isLoading={isLoading} />
      )}
    </section>
  );
};

export default MonitoringDashboard;