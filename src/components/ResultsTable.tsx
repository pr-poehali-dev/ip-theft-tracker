import Icon from "@/components/ui/icon";

export interface Violation {
  id: string;
  productName: string;
  brand?: string;
  seller: string;
  marketplace: "wb" | "ozon";
  articleId: string;
  violationType: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  price: number;
  detectedAt: string;
  status: "new" | "processing" | "filed" | "resolved";
  url?: string;
}

const riskConfig = {
  critical: { label: "Критический", color: "#ff4d6d", bg: "rgba(255,77,109,0.1)" },
  high: { label: "Высокий", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  medium: { label: "Средний", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  low: { label: "Низкий", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const statusConfig = {
  new: { label: "Новое", color: "var(--neon)", icon: "AlertCircle" },
  processing: { label: "В работе", color: "#f59e0b", icon: "Clock" },
  filed: { label: "Подана жалоба", color: "#7c3aed", icon: "FileCheck" },
  resolved: { label: "Решено", color: "#22c55e", icon: "CheckCircle" },
};

const mpConfig = {
  wb: { label: "WB", color: "#cb11ab" },
  ozon: { label: "OZON", color: "#005bff" },
};

interface ResultsTableProps {
  violations: Violation[];
  isLoading: boolean;
}

const ResultsTable = ({ violations, isLoading }: ResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="card-glass rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(0,212,255,0.2)]" />
            <div className="absolute inset-0 rounded-full border-t-2 border-[var(--neon)] animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-[rgba(0,212,255,0.5)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
          <div className="text-[var(--neon)] font-mono text-sm">Сканирование маркетплейсов...</div>
          <div className="text-[hsl(215,20%,40%)] text-xs font-mono">Анализ товаров на нарушения ИС</div>
        </div>
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-10 text-center">
        <Icon name="CheckCircle" size={36} className="mx-auto mb-3 text-[#22c55e]" />
        <div className="text-white font-semibold mb-1">Нарушений не найдено</div>
        <div className="text-xs text-[hsl(215,20%,45%)] font-mono">По данному запросу товаров с нарушениями не обнаружено</div>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl overflow-hidden animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,212,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 rounded-full bg-[#ff4d6d] shadow-[0_0_8px_#ff4d6d]" />
          <h3 className="text-sm font-mono uppercase tracking-widest text-[hsl(215,20%,70%)]">
            Обнаруженные нарушения
          </h3>
          <span className="bg-[rgba(255,77,109,0.15)] text-[#ff4d6d] border border-[rgba(255,77,109,0.3)] text-xs font-mono px-2 py-0.5 rounded-full">
            {violations.length}
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-[hsl(215,20%,50%)] hover:text-[var(--neon)] transition-colors font-mono">
          <Icon name="Download" size={13} />
          Экспорт
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,212,255,0.08)]">
              {["Товар", "Продавец", "Площадка", "Тип нарушения", "Риск", "Цена", "Статус", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[hsl(215,20%,40%)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {violations.map((v, i) => {
              const risk = riskConfig[v.riskLevel];
              const status = statusConfig[v.status];
              const mp = mpConfig[v.marketplace];
              return (
                <tr
                  key={v.id}
                  className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,212,255,0.03)] transition-colors group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-medium max-w-[180px] truncate">{v.productName}</div>
                    <div className="text-[11px] text-[hsl(215,20%,40%)] font-mono">#{v.articleId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[hsl(215,20%,65%)]">{v.seller}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ background: `${mp.color}20`, color: mp.color, border: `1px solid ${mp.color}40` }}
                    >
                      {mp.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-[hsl(215,20%,60%)]">{v.violationType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.color}40` }}
                    >
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-mono">
                      {v.price.toLocaleString("ru-RU")} ₽
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Icon name={status.icon} size={12} style={{ color: status.color }} />
                      <span className="text-xs" style={{ color: status.color }}>{status.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      {v.url && (
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[hsl(215,20%,50%)] text-xs font-mono hover:text-[var(--neon)] transition-colors"
                        >
                          <Icon name="ExternalLink" size={11} />
                        </a>
                      )}
                      <button className="flex items-center gap-1 text-[var(--neon)] text-xs font-mono hover:underline">
                        Жалоба <Icon name="ArrowRight" size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;