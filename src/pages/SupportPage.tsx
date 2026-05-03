import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const faqItems = [
  { q: 'Как пополнить баланс?', a: 'Перейди в Личный кабинет → Пополнить. Поддерживаются банковские карты, электронные кошельки, криптовалюта. Средства зачисляются мгновенно.' },
  { q: 'Сколько времени занимает вывод средств?', a: 'Вывод на криптокошелёк — до 15 минут. На банковскую карту — 1-3 рабочих дня. VIP-игроки получают приоритетный вывод.' },
  { q: 'Как получить приветственный бонус?', a: 'Зарегистрируйся, верифицируй аккаунт и пополни баланс на сумму от ₽1,000. Бонус начисляется автоматически в течение 5 минут.' },
  { q: 'Что такое вейджер?', a: 'Вейджер — это коэффициент отыгрыша бонуса. Например, вейджер x30 означает, что нужно поставить сумму, равную бонусу × 30, прежде чем вывести выигрыш.' },
  { q: 'Как подтвердить личность?', a: 'Перейди в Личный кабинет → Настройки → Верификация. Загрузи фото паспорта и селфи с документом. Проверка занимает до 24 часов.' },
  { q: 'Какие игры считаются в турнирах?', a: 'Каждый турнир имеет свои условия. Обычно учитываются определённые категории игр или конкретные слоты. Условия указаны на странице турнира.' },
];

const initialMessages = [
  { id: 1, from: 'bot', text: 'Привет! Я виртуальный ассистент NEXUS. Готов помочь вам 24/7. Выберите тему или напишите вопрос.', time: '14:30' },
  { id: 2, from: 'bot', text: 'Популярные запросы: 💳 Пополнение | 💸 Вывод | 🎁 Бонусы | 🔐 Безопасность | 📋 Верификация', time: '14:30' },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), from: 'user', text: input, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        text: 'Спасибо за обращение! Ваш вопрос передан специалисту. Обычное время ответа — 2-5 минут. Для срочных вопросов рекомендуем позвонить по номеру +7 800 000 0000.',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff006e] to-transparent opacity-40" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="font-cyber text-xs text-[#ff006e] tracking-widest mb-2">// СЛУЖБА ПОДДЕРЖКИ</div>
          <h1 className="font-cyber text-4xl font-black text-white mb-2">
            Поддержка <span className="neon-text-pink">24/7</span>
          </h1>
          <p className="text-gray-500">Мы всегда на связи — в любое время дня и ночи</p>

          {/* Contact Methods */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: 'MessageSquare', label: 'Онлайн-чат', sub: 'Сейчас онлайн', color: '#00ff9f' },
              { icon: 'Phone', label: '+7 800 000 0000', sub: 'Бесплатно', color: '#00f5ff' },
              { icon: 'Mail', label: 'support@nexus.io', sub: 'Ответ за 1 час', color: '#a855f7' },
              { icon: 'Send', label: 'Telegram', sub: '@nexus_support', color: '#ff006e' },
            ].map((contact, i) => (
              <div key={i} className="cyber-card rounded-sm px-5 py-3 flex items-center gap-3"
                style={{ border: `1px solid ${contact.color}20` }}>
                <Icon name={contact.icon as 'MessageSquare'} size={18} style={{ color: contact.color }} />
                <div className="text-left">
                  <div className="font-cyber text-xs text-white">{contact.label}</div>
                  <div className="text-gray-600 text-xs">{contact.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {['Онлайн-чат', 'FAQ', 'Обратная связь'].map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-5 py-3 font-cyber text-xs tracking-widest rounded-sm border transition-all
                ${activeTab === i ? 'border-[#ff006e] bg-[#ff006e]/10 text-[#ff006e]' : 'border-[rgba(255,255,255,0.08)] text-gray-500 hover:text-[#ff006e]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Chat */}
        {activeTab === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="cyber-card rounded-sm overflow-hidden" style={{ border: '1px solid rgba(255,0,110,0.2)' }}>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.05)]"
                style={{ background: 'linear-gradient(135deg, rgba(255,0,110,0.05), transparent)' }}>
                <div className="w-10 h-10 bg-[#ff006e]/20 border border-[#ff006e]/30 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <div className="font-cyber text-sm text-white">NEXUS Assistant</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#00ff9f] rounded-full animate-glow-pulse" />
                    <span className="text-[#00ff9f] text-xs font-mono-cyber">ОНЛАЙН</span>
                  </div>
                </div>
                <div className="ml-auto text-gray-600 text-xs font-mono-cyber">Среднее время ответа: 2 мин</div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-cyber">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.from === 'bot' && (
                      <div className="w-8 h-8 bg-[#ff006e]/20 border border-[#ff006e]/30 flex items-center justify-center text-sm flex-shrink-0 rounded-sm">
                        🤖
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-sm text-sm leading-relaxed
                      ${msg.from === 'bot'
                        ? 'bg-[#0a0f1a] border border-[rgba(255,0,110,0.1)] text-gray-300'
                        : 'bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.2)] text-[#00f5ff]'}`}>
                      {msg.text}
                      <div className="text-gray-600 text-xs mt-1 font-mono-cyber">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#ff006e]/20 border border-[#ff006e]/30 flex items-center justify-center text-sm rounded-sm">
                      🤖
                    </div>
                    <div className="bg-[#0a0f1a] border border-[rgba(255,0,110,0.1)] px-4 py-3 rounded-sm flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-[#ff006e] rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Напишите ваш вопрос..."
                    className="cyber-input flex-1 px-4 py-3 text-sm rounded-sm"
                  />
                  <button onClick={sendMessage} className="cyber-btn-pink px-4 py-3 rounded-sm">
                    <Icon name="Send" size={16} />
                  </button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['Пополнение', 'Вывод', 'Бонус', 'Верификация'].map(q => (
                    <button key={q} onClick={() => setInput(q)}
                      className="px-2 py-1 text-xs font-cyber text-gray-600 border border-[rgba(255,255,255,0.05)] rounded-sm hover:text-[#ff006e] hover:border-[#ff006e]/30 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 1 && (
          <div className="max-w-2xl mx-auto space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="cyber-card rounded-sm overflow-hidden"
                style={{ border: `1px solid ${openFaq === i ? 'rgba(255,0,110,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-cyber text-sm ${openFaq === i ? 'text-[#ff006e]' : 'text-white'}`}>{item.q}</span>
                  <Icon name={openFaq === i ? 'ChevronUp' : 'ChevronDown'} size={16}
                    className={openFaq === i ? 'text-[#ff006e]' : 'text-gray-600'} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-[rgba(255,255,255,0.03)]">
                    <div className="pt-4">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Feedback Form */}
        {activeTab === 2 && (
          <div className="max-w-lg mx-auto">
            <div className="cyber-card rounded-sm p-6">
              <div className="font-cyber text-xs text-[#ff006e] tracking-widest mb-6">// ФОРМА ОБРАТНОЙ СВЯЗИ</div>
              <div className="space-y-4">
                {[
                  { label: 'Ваше имя', placeholder: 'CyberPlayer', type: 'text' },
                  { label: 'Email', placeholder: 'player@nexus.io', type: 'email' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-1">{f.label.toUpperCase()}</label>
                    <input type={f.type} placeholder={f.placeholder} className="cyber-input w-full px-3 py-3 text-sm rounded-sm" />
                  </div>
                ))}
                <div>
                  <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-1">ТЕМА</label>
                  <select className="cyber-input w-full px-3 py-3 text-sm rounded-sm appearance-none">
                    <option>Технические проблемы</option>
                    <option>Пополнение / Вывод</option>
                    <option>Бонусы</option>
                    <option>Безопасность аккаунта</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-1">СООБЩЕНИЕ</label>
                  <textarea rows={4} placeholder="Опишите вашу проблему..."
                    className="cyber-input w-full px-3 py-3 text-sm rounded-sm resize-none" />
                </div>
                <button className="cyber-btn-pink w-full py-3 text-xs rounded-sm flex items-center gap-2 justify-center">
                  <Icon name="Send" size={14} />
                  ОТПРАВИТЬ ЗАЯВКУ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
