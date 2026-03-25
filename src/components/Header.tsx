import { useState } from "react";
import Icon from "@/components/ui/icon";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,212,255,0.15)] bg-[rgba(8,12,22,0.92)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-[var(--neon-dim)] border border-[var(--neon)] pulse-dot" />
              <Icon name="Shield" size={18} className="text-[var(--neon)] relative z-10" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-wider">BRAND</span>
              <span className="neon-text font-bold text-lg tracking-wider">GUARD</span>
              <div className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest leading-none">
                IP Protection System
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Мониторинг", "Нарушения", "Аналитика", "Отчёты"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-[hsl(215,20%,65%)] hover:text-[var(--neon)] transition-colors duration-200 font-medium tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-[var(--neon)] border border-[rgba(0,212,255,0.3)] rounded-md hover:bg-[var(--neon-dim)] transition-all duration-200 font-medium">
              Войти
            </button>
            <button className="px-4 py-2 text-sm bg-[var(--neon)] text-[hsl(220,30%,6%)] rounded-md hover:bg-[rgba(0,212,255,0.85)] transition-all duration-200 font-bold shadow-[var(--neon-glow)]">
              Начать мониторинг
            </button>
          </div>

          <button
            className="md:hidden text-[var(--neon)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[rgba(0,212,255,0.15)] bg-[rgba(8,12,22,0.98)] px-4 py-4 space-y-3">
          {["Мониторинг", "Нарушения", "Аналитика", "Отчёты"].map((item) => (
            <a
              key={item}
              href="#"
              className="block text-sm text-[hsl(215,20%,65%)] hover:text-[var(--neon)] transition-colors py-2"
            >
              {item}
            </a>
          ))}
          <button className="w-full mt-3 px-4 py-2 text-sm bg-[var(--neon)] text-[hsl(220,30%,6%)] rounded-md font-bold">
            Начать мониторинг
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
