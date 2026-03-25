const HERO_IMAGE = "https://cdn.poehali.dev/projects/7c05d2a3-5748-4af6-94b3-c5a48a7b0259/files/d26a8a99-c726-4b44-847d-629fb5e6e0b1.jpg";

interface HeroSectionProps {
  onStartMonitoring: () => void;
}

const HeroSection = ({ onStartMonitoring }: HeroSectionProps) => {
  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[rgba(0,212,255,0.04)] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] rounded-full px-4 py-1.5 mb-6 animate-fade-in-up" style={{ opacity: 0 }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] pulse-dot" />
              <span className="text-xs font-mono text-[var(--neon)] uppercase tracking-widest">
                Система защиты ИС v2.0
              </span>
            </div>

            <h1
              className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 animate-fade-in-up delay-100"
              style={{ opacity: 0 }}
            >
              Защита{" "}
              <span className="neon-text animate-flicker">товарных знаков</span>
              <br />
              на маркетплейсах
            </h1>

            <p
              className="text-[hsl(215,20%,60%)] text-base leading-relaxed mb-8 max-w-lg animate-fade-in-up delay-200"
              style={{ opacity: 0 }}
            >
              Автоматический мониторинг нарушений интеллектуальной собственности на Wildberries и Ozon.
              ИИ-система обнаруживает контрафакт и подаёт жалобы в режиме реального времени.
            </p>

            <div
              className="flex flex-wrap gap-3 animate-fade-in-up delay-300"
              style={{ opacity: 0 }}
            >
              <button
                onClick={onStartMonitoring}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--neon)] text-[hsl(220,30%,6%)] rounded-xl font-bold text-sm hover:bg-[rgba(0,212,255,0.85)] transition-all duration-200 shadow-[var(--neon-glow)] hover:shadow-[var(--neon-strong)]"
              >
                Начать мониторинг
              </button>
              <button
                onClick={onStartMonitoring}
                className="flex items-center gap-2 px-6 py-3 border border-[rgba(0,212,255,0.3)] text-[var(--neon)] rounded-xl font-medium text-sm hover:bg-[rgba(0,212,255,0.08)] transition-all duration-200"
              >
                Демонстрация
              </button>
            </div>

            <div
              className="flex items-center gap-6 mt-8 pt-8 border-t border-[rgba(0,212,255,0.1)] animate-fade-in-up delay-400"
              style={{ opacity: 0 }}
            >
              {[
                { label: "Маркетплейсов", value: "12+" },
                { label: "Точность ИИ", value: "98.4%" },
                { label: "Время реакции", value: "< 15 мин" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold neon-text font-mono">{s.value}</div>
                  <div className="text-[11px] text-[hsl(215,20%,45%)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up delay-300" style={{ opacity: 0 }}>
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(0,212,255,0.2)] shadow-[0_0_60px_rgba(0,212,255,0.1)]">
              <img
                src={HERO_IMAGE}
                alt="IP monitoring dashboard"
                className="w-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,30%,6%)] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 bg-[rgba(8,12,22,0.85)] backdrop-blur border border-[rgba(0,212,255,0.2)] rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] pulse-dot" />
                  <span className="text-xs text-white font-mono">Мониторинг активен</span>
                  <span className="ml-auto text-xs text-[var(--neon)] font-mono">18,432 нарушения обнаружено</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-[rgba(0,212,255,0.05)] rounded-full blur-2xl" />
            <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-[rgba(124,58,237,0.05)] rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
