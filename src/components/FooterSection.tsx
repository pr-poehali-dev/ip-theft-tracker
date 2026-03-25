import Icon from "@/components/ui/icon";

const FooterSection = () => {
  return (
    <footer className="border-t border-[rgba(0,212,255,0.1)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--neon-dim)] border border-[var(--neon)] flex items-center justify-center">
                <Icon name="Shield" size={16} className="text-[var(--neon)]" />
              </div>
              <span className="text-white font-bold text-lg">
                BRAND<span className="neon-text">GUARD</span>
              </span>
            </div>
            <p className="text-[hsl(215,20%,45%)] text-sm leading-relaxed max-w-sm">
              Профессиональная платформа защиты интеллектуальной собственности на маркетплейсах с применением ИИ.
            </p>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[hsl(215,20%,40%)] mb-4">
              Платформа
            </div>
            <ul className="space-y-2">
              {["Мониторинг", "Аналитика", "Жалобы", "Отчёты", "API"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[hsl(215,20%,55%)] hover:text-[var(--neon)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[hsl(215,20%,40%)] mb-4">
              Поддержка
            </div>
            <ul className="space-y-2">
              {["Документация", "FAQ", "Тарифы", "Контакты", "Блог"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[hsl(215,20%,55%)] hover:text-[var(--neon)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[rgba(255,255,255,0.05)] gap-4">
          <div className="text-xs text-[hsl(215,20%,35%)] font-mono">
            © 2026 BrandGuard. Все права защищены.
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,35%)] font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] pulse-dot" />
            Все системы работают штатно
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
