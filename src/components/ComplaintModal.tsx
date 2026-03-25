import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Violation } from "./ResultsTable";

interface ComplaintModalProps {
  violation: Violation;
  onClose: () => void;
}

const WB_COMPLAINT_URL = "https://www.wildberries.ru/services/legal-information";
const OZON_COMPLAINT_URL = "https://www.ozon.ru/legal/pravooobladatelyam/";

const ComplaintModal = ({ violation, onClose }: ComplaintModalProps) => {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"text" | "instruction">("text");

  const isWB = violation.marketplace === "wb";
  const mpName = isWB ? "Wildberries" : "Ozon";
  const complaintUrl = isWB ? WB_COMPLAINT_URL : OZON_COMPLAINT_URL;

  const complaintText = `Уважаемая служба поддержки ${mpName}!

Настоящим уведомляем вас о нарушении исключительных прав на товарный знак.

ПРАВООБЛАДАТЕЛЬ:
Наименование: [Ваше название компании / ФИО]
Контактные данные: [Email / телефон]
Свидетельство на товарный знак №: [Номер свидетельства Роспатент]

НАРУШЕНИЕ:
Площадка: ${mpName}
Наименование товара: ${violation.productName}
Артикул / ID: ${violation.articleId}
Продавец: ${violation.seller}
Ссылка на товар: ${violation.url || `https://${isWB ? "www.wildberries.ru/catalog/" + violation.articleId + "/detail.aspx" : "www.ozon.ru/product/" + violation.articleId + "/"}`}
Тип нарушения: ${violation.violationType}

СУТЬ НАРУШЕНИЯ:
Указанный товар использует обозначение, сходное до степени смешения с зарегистрированным товарным знаком правообладателя, что вводит потребителей в заблуждение относительно производителя товара и нарушает исключительные права правообладателя в соответствии со ст. 1484 ГК РФ.

ТРЕБОВАНИЯ:
1. Незамедлительно удалить указанный товар с площадки ${mpName}.
2. Заблокировать возможность повторного размещения аналогичных товаров данным продавцом.
3. Предоставить информацию о продавце для подачи судебного иска.

Готовы предоставить все необходимые документы, подтверждающие право на товарный знак.

С уважением,
[Подпись]
[Дата: ${new Date().toLocaleDateString("ru-RU")}]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl card-glass rounded-2xl border border-[rgba(0,212,255,0.2)] shadow-[0_0_60px_rgba(0,212,255,0.1)] max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,212,255,0.1)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)]">
              <Icon name="FileText" size={15} className="text-[#7c3aed]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Жалоба на нарушение</div>
              <div className="text-[11px] text-[hsl(215,20%,45%)] font-mono">{mpName} • {violation.articleId}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-[hsl(215,20%,45%)] hover:text-white transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 shrink-0">
          {(["text", "instruction"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStep(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
              style={
                step === tab
                  ? { background: "rgba(0,212,255,0.12)", color: "var(--neon)", border: "1px solid rgba(0,212,255,0.3)" }
                  : { background: "transparent", color: "hsl(215,20%,45%)", border: "1px solid transparent" }
              }
            >
              {tab === "text" ? "Текст претензии" : "Инструкция подачи"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === "text" ? (
            <>
              <div className="text-[11px] text-[hsl(215,20%,45%)] font-mono mb-3 flex items-center gap-2">
                <Icon name="Info" size={11} />
                Замените текст в [квадратных скобках] на ваши данные
              </div>
              <pre className="text-xs text-[hsl(215,20%,70%)] font-mono leading-relaxed whitespace-pre-wrap bg-[rgba(0,0,0,0.3)] rounded-xl p-4 border border-[rgba(255,255,255,0.05)]">
                {complaintText}
              </pre>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-[hsl(215,20%,50%)] font-mono mb-4">
                Пошаговая инструкция подачи жалобы на {mpName}
              </div>
              {(isWB ? [
                { step: "1", title: "Скопируйте текст претензии", desc: 'Перейдите на вкладку "Текст претензии", нажмите "Скопировать"' },
                { step: "2", title: "Откройте форму WB", desc: "Перейдите по кнопке ниже на страницу правообладателей Wildberries" },
                { step: "3", title: "Заполните форму", desc: 'Выберите раздел "Нарушение прав на товарный знак", вставьте текст претензии' },
                { step: "4", title: "Приложите документы", desc: "Свидетельство о регистрации ТЗ, доверенность (если подаёте не лично)" },
                { step: "5", title: "Отправьте и сохраните номер", desc: "Зафиксируйте номер обращения для отслеживания статуса" },
              ] : [
                { step: "1", title: "Скопируйте текст претензии", desc: 'Перейдите на вкладку "Текст претензии", нажмите "Скопировать"' },
                { step: "2", title: "Откройте форму Ozon", desc: "Перейдите по кнопке ниже на страницу для правообладателей Ozon" },
                { step: "3", title: "Зарегистрируйтесь в Brand Protection", desc: "Создайте аккаунт правообладателя в системе защиты брендов Ozon" },
                { step: "4", title: "Подайте жалобу", desc: "Укажите артикул товара, загрузите свидетельство на ТЗ, вставьте текст" },
                { step: "5", title: "Ожидайте решения", desc: "Ozon рассматривает жалобы в течение 3–7 рабочих дней" },
              ]).map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center shrink-0 text-[var(--neon)] text-xs font-mono font-bold">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium mb-0.5">{item.title}</div>
                    <div className="text-xs text-[hsl(215,20%,50%)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[rgba(0,212,255,0.1)] shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono border border-[rgba(0,212,255,0.3)] text-[var(--neon)] rounded-xl hover:bg-[rgba(0,212,255,0.08)] transition-all duration-200"
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} />
            {copied ? "Скопировано!" : "Скопировать текст"}
          </button>
          <a
            href={complaintUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-[#7c3aed] text-white rounded-xl hover:bg-[#6d28d9] transition-all duration-200 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <Icon name="ExternalLink" size={14} />
            Подать на {mpName}
          </a>
          <button onClick={onClose} className="ml-auto text-xs text-[hsl(215,20%,40%)] font-mono hover:text-white transition-colors">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
