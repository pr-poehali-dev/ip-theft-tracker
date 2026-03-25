import { useState } from "react";
import SearchPanel from "./SearchPanel";
import ResultsTable, { Violation } from "./ResultsTable";
import StatsCards from "./StatsCards";

const MOCK_VIOLATIONS: Violation[] = [
  {
    id: "1",
    productName: "Кроссовки беговые ProRun Ultra",
    seller: 'ООО "СпортТрейд"',
    marketplace: "wb",
    articleId: "AB-774521",
    violationType: "Товарный знак",
    riskLevel: "critical",
    price: 4990,
    detectedAt: "2026-03-25",
    status: "new",
  },
  {
    id: "2",
    productName: 'Рюкзак городской "TechPack Pro"',
    seller: "ИП Сидоров А.В.",
    marketplace: "ozon",
    articleId: "OZ-1923847",
    violationType: "Товарный знак",
    riskLevel: "high",
    price: 3200,
    detectedAt: "2026-03-24",
    status: "processing",
  },
  {
    id: "3",
    productName: "Наушники BeatsClone X5",
    seller: 'ООО "ТехноМаркет"',
    marketplace: "wb",
    articleId: "WB-5512034",
    violationType: "Авторское право",
    riskLevel: "critical",
    price: 1890,
    detectedAt: "2026-03-24",
    status: "filed",
  },
  {
    id: "4",
    productName: "Футболка с принтом Nike Fake",
    seller: "ИП Петров К.И.",
    marketplace: "ozon",
    articleId: "OZ-4418823",
    violationType: "Товарный знак",
    riskLevel: "high",
    price: 890,
    detectedAt: "2026-03-23",
    status: "new",
  },
  {
    id: "5",
    productName: "Парфюм Chanel №5 реплика",
    seller: 'ООО "БьютиЛюкс"',
    marketplace: "wb",
    articleId: "WB-9981234",
    violationType: "Товарный знак",
    riskLevel: "critical",
    price: 2100,
    detectedAt: "2026-03-23",
    status: "resolved",
  },
  {
    id: "6",
    productName: "Сумка Louis Vuitton копия",
    seller: "ИП Козлов М.А.",
    marketplace: "ozon",
    articleId: "OZ-7723991",
    violationType: "Промышленный образец",
    riskLevel: "medium",
    price: 5600,
    detectedAt: "2026-03-22",
    status: "processing",
  },
];

const MonitoringDashboard = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (_query: string, _marketplace: string, _type: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setViolations([]);
    setTimeout(() => {
      setViolations(MOCK_VIOLATIONS);
      setIsLoading(false);
    }, 2200);
  };

  return (
    <section id="monitoring" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StatsCards />
      <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
      {(isLoading || hasSearched) && (
        <ResultsTable violations={violations} isLoading={isLoading} />
      )}
    </section>
  );
};

export default MonitoringDashboard;