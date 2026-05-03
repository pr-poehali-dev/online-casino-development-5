import Icon from '@/components/ui/icon';

const team = [
  { name: 'Alex Nexus', role: 'CEO & Co-Founder', emoji: '👨‍💼', desc: '15 лет в iGaming индустрии' },
  { name: 'Maria Cyber', role: 'CTO', emoji: '👩‍💻', desc: 'Эксперт по кибербезопасности' },
  { name: 'Ivan Storm', role: 'Head of Games', emoji: '🎮', desc: '10 лет в разработке игр' },
  { name: 'Sofia Digital', role: 'Head of Support', emoji: '🤝', desc: 'Специалист по клиентскому сервису' },
];

const milestones = [
  { year: '2020', event: 'Основание NEXUS Casino', desc: 'Начало работы платформы с 500 играми' },
  { year: '2021', event: 'Лицензия MGA', desc: 'Получена мальтийская лицензия игорного бизнеса' },
  { year: '2022', event: '1 миллион игроков', desc: 'Платформа достигла отметки 1M активных пользователей' },
  { year: '2023', event: 'Live Casino запуск', desc: 'Открытие полноценной студии Live Casino' },
  { year: '2024', event: 'ИИ-рекомендации', desc: 'Внедрение персонализированных ИИ-алгоритмов' },
];

const licenses = [
  { name: 'Malta Gaming Authority', number: 'MGA/CRP/148/2020', color: '#00f5ff' },
  { name: 'Curaçao eGaming', number: 'GLH-OCCHKTW0709092017', color: '#a855f7' },
  { name: 'UK Gambling Commission', number: 'UKGC-38561', color: '#00ff9f' },
];

const paymentPartners = ['💳 Visa', '💳 MasterCard', '🏦 SWIFT', '₿ Bitcoin', '⚡ Lightning', '🔷 Ethereum', '💜 Tether', '💚 Litecoin'];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-20 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff9f] to-transparent opacity-40" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#00f5ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-[#a855f7]/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="font-cyber text-xs text-[#00ff9f] tracking-widest mb-2">// О КОМПАНИИ</div>
          <h1 className="font-cyber text-5xl font-black mb-4">
            <span className="neon-text-cyan">NEXUS</span>{' '}
            <span className="gradient-text">CASINO</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Мы строим казино будущего — безопасное, честное и захватывающее. С 2020 года мы меняем индустрию онлайн-гемблинга.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
            {[
              { value: '2,400+', label: 'Игр', color: '#00f5ff' },
              { value: '1M+', label: 'Игроков', color: '#00ff9f' },
              { value: '₽10B+', label: 'Выплат', color: '#ffd600' },
              { value: '4', label: 'Лицензии', color: '#a855f7' },
            ].map((s, i) => (
              <div key={i} className="cyber-card rounded-sm p-4 text-center corner-bracket">
                <div className="font-mono-cyber text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-2">// НАША МИССИЯ</div>
              <h2 className="font-cyber text-3xl text-white mb-4">
                Переосмысляем<br /><span className="neon-text-cyan">онлайн-гемблинг</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                NEXUS Casino создан для игроков, которые ценят честность, безопасность и инновации. Мы используем самые современные технологии блокчейн, ИИ и криптографии, чтобы гарантировать абсолютную прозрачность каждой ставки.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Наш принцип — игрок всегда на первом месте. Мы не просто казино, мы — технологическая платформа нового поколения.
              </p>
              <div className="space-y-3">
                {[
                  { icon: 'Shield', text: 'Полная прозрачность RNG (генератора случайных чисел)', color: '#00ff9f' },
                  { icon: 'Zap', text: 'Моментальные выплаты без скрытых комиссий', color: '#ffd600' },
                  { icon: 'Brain', text: 'ИИ для защиты от зависимости', color: '#a855f7' },
                  { icon: 'Globe', text: 'Поддержка 20+ языков и валют', color: '#00f5ff' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      <Icon name={p.icon as 'Shield'} size={14} style={{ color: p.color }} />
                    </div>
                    <span className="text-gray-300 text-sm">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f5ff] via-[#a855f7] to-[#ff006e] opacity-30" />
              <div className="space-y-6 pl-10">
                {milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[22px] w-4 h-4 border-2 border-[#00f5ff] bg-[#050810] rounded-sm rotate-45" />
                    <div className="cyber-card rounded-sm p-4">
                      <div className="font-mono-cyber text-[#00f5ff] text-sm font-bold mb-1">{m.year}</div>
                      <div className="font-cyber text-sm text-white mb-1">{m.event}</div>
                      <div className="text-gray-500 text-xs">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 border-t border-[rgba(0,245,255,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-2">// КОМАНДА</div>
            <h2 className="font-cyber text-3xl text-white">Кто стоит за NEXUS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="cyber-card rounded-sm p-5 text-center corner-bracket group hover:scale-[1.03] transition-transform">
                <div className="text-4xl mb-3">{member.emoji}</div>
                <div className="font-cyber text-sm text-white mb-1">{member.name}</div>
                <div className="text-[#00f5ff] text-xs font-cyber mb-2">{member.role}</div>
                <div className="text-gray-500 text-xs">{member.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licenses */}
      <section className="py-12 border-t border-[rgba(0,245,255,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="font-cyber text-xs text-[#00ff9f] tracking-widest mb-2">// ЛИЦЕНЗИИ И РЕГУЛЯТОРЫ</div>
            <h2 className="font-cyber text-3xl text-white">Играй уверенно</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {licenses.map((lic, i) => (
              <div key={i} className="cyber-card rounded-sm p-5 flex items-center gap-4"
                style={{ border: `1px solid ${lic.color}20` }}>
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: `${lic.color}10`, border: `1px solid ${lic.color}30` }}>
                  <Icon name="Shield" size={18} style={{ color: lic.color }} />
                </div>
                <div>
                  <div className="font-cyber text-xs text-white mb-0.5">{lic.name}</div>
                  <div className="font-mono-cyber text-xs text-gray-600">{lic.number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Partners */}
      <section className="py-12 border-t border-[rgba(0,245,255,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-2">// ПЛАТЁЖНЫЕ СИСТЕМЫ</div>
            <h2 className="font-cyber text-2xl text-white">Удобные способы оплаты</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentPartners.map((p, i) => (
              <div key={i} className="cyber-card rounded-sm px-5 py-3 text-sm text-gray-300 hover:text-[#00f5ff] hover:border-[rgba(0,245,255,0.2)] transition-all cursor-pointer">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Gambling */}
      <section className="py-12 border-t border-[rgba(0,245,255,0.05)]">
        <div className="container mx-auto px-4">
          <div className="cyber-card rounded-sm p-8 text-center max-w-2xl mx-auto"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,159,0.05), transparent)', border: '1px solid rgba(0,255,159,0.2)' }}>
            <Icon name="Shield" size={40} className="mx-auto mb-4 text-[#00ff9f]" />
            <h2 className="font-cyber text-2xl text-white mb-3">Ответственная игра</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Мы заботимся о безопасности наших игроков. Установи лимиты на депозиты и ставки, используй функцию самоисключения или обратись за помощью к специалистам.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Лимит депозитов', 'Самоисключение', 'Реальность-проверка', 'Родительский контроль'].map(f => (
                <span key={f} className="text-xs font-cyber text-[#00ff9f] border border-[rgba(0,255,159,0.2)] px-3 py-1 rounded-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
