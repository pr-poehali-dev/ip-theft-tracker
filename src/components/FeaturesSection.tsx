import Icon from "@/components/ui/icon";

const features = [
  {
    icon: "ScanSearch",
    title: "Автоматический мониторинг",
    desc: "Круглосуточное сканирование всех категорий товаров на WB и Ozon в режиме реального времени",
    color: "var(--neon)",
  },
  {
    icon: "Brain",
    title: "ИИ-анализ нарушений",
    desc: "Нейросеть распознаёт визуальные и текстовые сходства с вашим товарным знаком",
    color: "#7c3aed",
  },
  {
    icon: "FileCheck",
    title: "Автоматические жалобы",
    desc: "Одним кликом формируем и подаём претензии на маркетплейс по всем нарушениям",
    color: "#22c55e",
  },
  {
    icon: "Bell",
    title: "Мгновенные уведомления",
    desc: "Оповещения в Telegram и Email при появлении новых нарушений ваших прав",
    color: "#f59e0b",
  },
  {
    icon: "BarChart3",
    title: "Аналитика и отчёты",
    desc: "Детальная статистика нарушений, динамика по времени и эффективность защиты",
    color: "#f97316",
  },
  {
    icon: "Globe",
    title: "Мультиплатформенность",
    desc: "Единый интерфейс для Wildberries, Ozon, Яндекс Маркет и других маркетплейсов",
    color: "#ec4899",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--neon)]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[hsl(215,20%,50%)]">
            Возможности платформы
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--neon)]" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          Полная защита вашего{" "}
          <span className="neon-text">бренда</span>
        </h2>
        <p className="text-[hsl(215,20%,50%)] mt-3 max-w-xl mx-auto text-sm">
          Комплексная система защиты интеллектуальной собственности с применением искусственного интеллекта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="card-glass rounded-xl p-6 group hover:border-[rgba(0,212,255,0.2)] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
            >
              <Icon name={f.icon} size={20} style={{ color: f.color }} />
            </div>
            <h3 className="text-white font-semibold mb-2 text-sm">{f.title}</h3>
            <p className="text-[hsl(215,20%,50%)] text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
