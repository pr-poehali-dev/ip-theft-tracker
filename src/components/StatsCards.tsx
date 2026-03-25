import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const stats = [
  {
    label: "Товаров проверено",
    value: 2847693,
    suffix: "",
    icon: "Search",
    change: "+12.4%",
    color: "var(--neon)",
  },
  {
    label: "Нарушений найдено",
    value: 18432,
    suffix: "",
    icon: "AlertTriangle",
    change: "+8.7%",
    color: "#ff4d6d",
  },
  {
    label: "Брендов защищено",
    value: 1254,
    suffix: "",
    icon: "Shield",
    change: "+34.2%",
    color: "#7c3aed",
  },
  {
    label: "Жалоб подано",
    value: 9871,
    suffix: "",
    icon: "FileText",
    change: "+21.1%",
    color: "#f59e0b",
  },
];

function AnimatedCounter({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{current.toLocaleString("ru-RU")}</>;
}

const StatsCards = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card-glass rounded-xl p-5 relative overflow-hidden group hover:border-[rgba(0,212,255,0.3)] transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
            style={{
              background: `radial-gradient(ellipse at top left, ${stat.color}08 0%, transparent 60%)`,
            }}
          />
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}40` }}
            >
              <Icon name={stat.icon} size={18} style={{ color: stat.color }} />
            </div>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{ background: `${stat.color}15`, color: stat.color, border: `1px solid ${stat.color}30` }}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono mb-1">
            <AnimatedCounter target={stat.value} duration={1500 + i * 200} />
          </div>
          <div className="text-xs text-[hsl(215,20%,50%)] font-medium">{stat.label}</div>

          <div
            className="absolute bottom-0 left-0 right-0 h-px opacity-50"
            style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
          />
        </div>
      ))}
    </section>
  );
};

export default StatsCards;