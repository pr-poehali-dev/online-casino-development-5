import { useState } from 'react';
import Icon from '@/components/ui/icon';

const bonuses = [
  {
    id: 1, title: 'Приветственный бонус', type: 'deposit',
    amount: '+200%', desc: 'До ₽100,000 + 150 фриспинов на первый депозит',
    wagering: 'x30', validity: '7 дней', minDeposit: '₽1,000',
    color: '#a855f7', emoji: '🎁', hot: true, available: true,
  },
  {
    id: 2, title: 'Еженедельный кэшбэк', type: 'cashback',
    amount: '15%', desc: 'Возврат 15% от проигрышей каждую неделю без вейджера',
    wagering: 'x1', validity: '3 дня', minDeposit: '₽500',
    color: '#00ff9f', emoji: '💚', hot: false, available: true,
  },
  {
    id: 3, title: 'Фриспины пятницы', type: 'freespins',
    amount: '50 FS', desc: '50 бесплатных вращений каждую пятницу в выбранных слотах',
    wagering: 'x25', validity: '2 дня', minDeposit: '₽2,000',
    color: '#00f5ff', emoji: '🌀', hot: true, available: true,
  },
  {
    id: 4, title: 'Турнирный бонус', type: 'tournament',
    amount: '+50%', desc: 'Бонус к депозиту при регистрации на турнир',
    wagering: 'x40', validity: 'До конца турнира', minDeposit: '₽3,000',
    color: '#ffd600', emoji: '🏆', hot: false, available: true,
  },
  {
    id: 5, title: 'VIP Birthday Bonus', type: 'vip',
    amount: '+300%', desc: 'Специальный бонус в день рождения для VIP-игроков',
    wagering: 'x20', validity: '24 часа', minDeposit: '₽5,000',
    color: '#ff006e', emoji: '🎂', hot: false, available: false,
  },
  {
    id: 6, title: 'Реферальный бонус', type: 'referral',
    amount: '₽5,000', desc: 'Получи ₽5,000 за каждого приглашённого друга',
    wagering: 'x10', validity: '30 дней', minDeposit: 'Без депозита',
    color: '#00f5ff', emoji: '👥', hot: false, available: true,
  },
];

const loyaltyLevels = [
  { level: 'BRONZE', emoji: '🥉', minPoints: 0, maxPoints: 5000, cashback: '5%', color: '#cd7f32' },
  { level: 'SILVER', emoji: '🥈', minPoints: 5000, maxPoints: 20000, cashback: '8%', color: '#c0c0c0' },
  { level: 'GOLD', emoji: '🥇', minPoints: 20000, maxPoints: 50000, cashback: '10%', color: '#ffd600' },
  { level: 'PLATINUM', emoji: '💠', minPoints: 50000, maxPoints: 100000, cashback: '12%', color: '#00f5ff' },
  { level: 'DIAMOND', emoji: '💎', minPoints: 100000, maxPoints: 250000, cashback: '15%', color: '#a855f7' },
  { level: 'LEGENDARY', emoji: '⭐', minPoints: 250000, maxPoints: null, cashback: '20%', color: '#ff006e' },
];

const currentPoints = 67200;

export default function BonusesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [promoCode, setPromoCode] = useState('');

  const filters = [
    { id: 'all', label: 'Все бонусы' },
    { id: 'deposit', label: 'На депозит' },
    { id: 'cashback', label: 'Кэшбэк' },
    { id: 'freespins', label: 'Фриспины' },
    { id: 'tournament', label: 'Турниры' },
  ];

  const filtered = activeFilter === 'all' ? bonuses : bonuses.filter(b => b.type === activeFilter);

  const currentLevel = loyaltyLevels.find(l => currentPoints >= l.minPoints && (l.maxPoints === null || currentPoints < l.maxPoints));
  const nextLevel = loyaltyLevels[loyaltyLevels.indexOf(currentLevel!) + 1];
  const progress = currentLevel && nextLevel
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-40" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-2">// БОНУСЫ И АКЦИИ</div>
          <h1 className="font-cyber text-4xl font-black text-white mb-2">
            <span className="neon-text-purple">Акции</span> & Бонусы
          </h1>
          <p className="text-gray-500">Эксклюзивные предложения для наших игроков</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Promo Code */}
        <div className="cyber-card rounded-sm p-6 mb-8 border-[rgba(255,214,0,0.2)]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <div className="font-cyber text-xs text-[#ffd600] tracking-widest mb-1">// ПРОМОКОД</div>
              <p className="text-gray-400 text-sm">Введи промокод и получи дополнительный бонус</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="NEXUS2024"
                className="cyber-input px-4 py-3 text-sm rounded-sm flex-1 md:w-48 font-cyber tracking-widest"
              />
              <button className="cyber-btn-primary px-6 py-3 text-xs rounded-sm whitespace-nowrap">
                АКТИВИРОВАТЬ
              </button>
            </div>
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="cyber-card rounded-sm p-6 mb-8 border-[rgba(168,85,247,0.2)]">
          <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-6">// ПРОГРАММА ЛОЯЛЬНОСТИ</div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Current Status */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{currentLevel?.emoji}</div>
                <div>
                  <div className="font-cyber text-lg" style={{ color: currentLevel?.color }}>{currentLevel?.level}</div>
                  <div className="font-mono-cyber text-sm text-gray-400">{currentPoints.toLocaleString()} / {nextLevel?.minPoints.toLocaleString()} очков</div>
                </div>
              </div>

              {/* Progress to next */}
              {nextLevel && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-xs font-mono-cyber">До статуса {nextLevel.level}</span>
                    <span className="font-mono-cyber text-xs" style={{ color: currentLevel?.color }}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[#0a0f1a] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentLevel?.color}, ${nextLevel.color})` }} />
                  </div>
                  <div className="text-gray-600 text-xs mt-1 font-mono-cyber">
                    Ещё {(nextLevel.minPoints - currentPoints).toLocaleString()} очков
                  </div>
                </div>
              )}
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {loyaltyLevels.map((lvl) => {
                const isCurrent = lvl.level === currentLevel?.level;
                const isEarned = currentPoints >= lvl.minPoints;
                return (
                  <div key={lvl.level}
                    className={`text-center p-3 rounded-sm border transition-all
                      ${isCurrent ? 'scale-110' : ''}`}
                    style={{ border: `1px solid ${isEarned ? `${lvl.color}40` : 'rgba(255,255,255,0.05)'}`,
                      background: isCurrent ? `${lvl.color}15` : 'transparent' }}>
                    <div className="text-2xl mb-1">{lvl.emoji}</div>
                    <div className="font-cyber text-[10px] mb-0.5" style={{ color: isEarned ? lvl.color : '#4b5563' }}>{lvl.level}</div>
                    <div className="text-[10px] font-mono-cyber" style={{ color: isEarned ? '#00ff9f' : '#374151' }}>{lvl.cashback}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 font-cyber text-xs tracking-wider rounded-sm border transition-all
                ${activeFilter === f.id ? 'bg-[#a855f7] text-white border-[#a855f7]' : 'border-[rgba(168,85,247,0.2)] text-gray-400 hover:text-[#a855f7]'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Bonuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(bonus => (
            <div key={bonus.id}
              className={`cyber-card rounded-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] ${!bonus.available ? 'opacity-50' : ''}`}
              style={{ border: `1px solid ${bonus.color}20` }}>

              {/* Card Header */}
              <div className="relative p-6 pb-4"
                style={{ background: `radial-gradient(circle at top right, ${bonus.color}10 0%, transparent 60%)` }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{bonus.emoji}</span>
                  <div className="flex flex-col gap-1 items-end">
                    {bonus.hot && <span className="badge-hot">HOT</span>}
                    {!bonus.available && <span className="font-cyber text-xs text-gray-600 border border-gray-700 px-2 py-0.5">VIP</span>}
                  </div>
                </div>

                <h3 className="font-cyber text-sm text-white mb-1">{bonus.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{bonus.desc}</p>

                <div className="font-mono-cyber text-3xl font-bold mt-3" style={{ color: bonus.color }}>
                  {bonus.amount}
                </div>
              </div>

              <div className="px-6 pb-4">
                <div className="neon-divider mb-4" />

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {[
                    { label: 'Вейджер', value: bonus.wagering },
                    { label: 'Срок', value: bonus.validity },
                    { label: 'Мин. депозит', value: bonus.minDeposit },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="font-mono-cyber text-xs text-white">{item.value}</div>
                      <div className="text-gray-600 text-[10px] mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!bonus.available}
                  className={`w-full py-3 text-xs rounded-sm font-cyber tracking-widest transition-all
                    ${bonus.available ? 'cyber-btn-primary' : 'border border-gray-700 text-gray-600 cursor-not-allowed'}`}
                  style={bonus.available ? { background: `linear-gradient(135deg, ${bonus.color}, ${bonus.color}99)`, color: '#050810' } : {}}>
                  {bonus.available ? 'АКТИВИРОВАТЬ' : 'НЕДОСТУПНО'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
