import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import GameCard from '@/components/games/GameCard';
import { games } from '@/data/games';

const stats = [
  { label: 'Активных игроков', value: '124,891', icon: 'Users', color: '#00f5ff' },
  { label: 'Выплачено сегодня', value: '₽48.2M', icon: 'TrendingUp', color: '#00ff9f' },
  { label: 'Игр в каталоге', value: '2,400+', icon: 'Gamepad2', color: '#a855f7' },
  { label: 'Текущий джекпот', value: '₽11.3M', icon: 'Zap', color: '#ffd600' },
];

const quickCategories = [
  { label: 'Слоты', emoji: '🎰', path: '/games', color: '#00f5ff' },
  { label: 'Рулетка', emoji: '🎡', path: '/games', color: '#ff006e' },
  { label: 'Покер', emoji: '🃏', path: '/games', color: '#a855f7' },
  { label: 'Live', emoji: '📡', path: '/games', color: '#00ff9f' },
  { label: 'Блэкджек', emoji: '🂡', path: '/games', color: '#ffd600' },
  { label: 'Турниры', emoji: '🏆', path: '/tournaments', color: '#ff006e' },
];

const testimonials = [
  { user: 'CyberWolf88', amount: '₽125,000', game: 'Mega Fortune', avatar: '🐺' },
  { user: 'NeonRider', amount: '₽67,500', game: 'Quantum Poker', avatar: '🏍️' },
  { user: 'GalaxyX', amount: '₽234,000', game: 'Galaxy Slots', avatar: '🌌' },
  { user: 'NightHawk', amount: '₽89,200', game: 'Dark Blackjack', avatar: '🦅' },
];

export default function HomePage() {
  const [jackpot, setJackpot] = useState(11348291);
  const hotGames = games.filter(g => g.badge === 'HOT' || g.badge === 'JACKPOT').slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 100 + 10));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-[#050810] to-[#050810]" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00f5ff]/5 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff006e]/3 rounded-full blur-3xl" />
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-[#00f5ff]/20 animate-scan-line" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 border border-[#00f5ff]/30 bg-[#00f5ff]/5 px-4 py-2 rounded-sm mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-[#00ff9f] rounded-full animate-glow-pulse" />
              <span className="font-mono-cyber text-[#00ff9f] text-xs tracking-widest">СИСТЕМА ОНЛАЙН • 124,891 ИГРОКОВ</span>
            </div>

            <h1 className="font-cyber text-5xl md:text-7xl font-black mb-4 leading-tight animate-slide-up">
              <span className="neon-text-cyan">NEXUS</span>
              <br />
              <span className="gradient-text">CASINO</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-4 max-w-2xl mx-auto animate-slide-up font-light tracking-wide" style={{ animationDelay: '0.1s' }}>
              Казино нового поколения в мире киберпространства.
              <br />
              <span className="text-[#a855f7]">2,400+ игр • Моментальные выплаты • 24/7 поддержка</span>
            </p>

            {/* Jackpot Counter */}
            <div className="inline-flex items-center gap-3 bg-[#0a0f1a] border border-[#ffd600]/30 px-6 py-3 rounded-sm mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-[#ffd600] text-lg">💎</span>
              <div>
                <div className="font-cyber text-xs text-[#ffd600]/60 tracking-widest">ПРОГРЕССИВНЫЙ ДЖЕКПОТ</div>
                <div className="font-mono-cyber text-2xl font-bold text-[#ffd600]">
                  ₽{jackpot.toLocaleString('ru-RU')}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/games" className="cyber-btn-primary px-8 py-4 text-sm rounded-sm inline-flex items-center gap-2 justify-center">
                <Icon name="Zap" size={16} />
                ИГРАТЬ СЕЙЧАС
              </Link>
              <Link to="/bonuses" className="cyber-btn-secondary px-8 py-4 text-sm rounded-sm inline-flex items-center gap-2 justify-center">
                <Icon name="Gift" size={16} />
                ПОЛУЧИТЬ БОНУС
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: 'Shield', label: 'SSL защита', color: '#00ff9f' },
                { icon: 'Award', label: 'MGA лицензия', color: '#00f5ff' },
                { icon: 'Zap', label: 'Мгновенные выплаты', color: '#ffd600' },
                { icon: 'Lock', label: '2FA безопасность', color: '#a855f7' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1">
                  <Icon name={badge.icon as 'Shield'} size={18} style={{ color: badge.color }} />
                  <span className="text-gray-500 text-xs font-mono-cyber hidden sm:block">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050810] to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[rgba(0,245,255,0.08)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="cyber-card rounded-sm p-4 text-center corner-bracket">
                <Icon name={stat.icon as 'Users'} size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
                <div className="font-mono-cyber text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-cyber text-[#00f5ff] text-xs tracking-widest">// БЫСТРЫЙ ДОСТУП</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00f5ff]/30 to-transparent" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickCategories.map((cat, i) => (
              <Link key={i} to={cat.path}
                className="cyber-card rounded-sm p-4 text-center hover:scale-105 transition-all duration-200 group"
                style={{ border: `1px solid ${cat.color}20` }}>
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="font-cyber text-xs tracking-wider" style={{ color: cat.color }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Games */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-1">
                <span className="font-cyber text-[#ff006e] text-xs tracking-widest">// ГОРЯЧИЕ ИГРЫ</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#ff006e]/30 to-transparent" />
              </div>
              <h2 className="font-cyber text-2xl text-white">Популярное прямо сейчас</h2>
            </div>
            <Link to="/games" className="cyber-btn-secondary px-4 py-2 text-xs rounded-sm hidden md:flex items-center gap-2">
              Все игры <Icon name="ArrowRight" size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hotGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Bonus Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-sm overflow-hidden border border-[#a855f7]/30"
            style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #12072a 50%, #0a0f1a 100%)' }}>
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-60" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#a855f7]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#ff006e]/10 rounded-full blur-3xl" />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-2">// ПРИВЕТСТВЕННЫЙ БОНУС</div>
                <h2 className="font-cyber text-3xl md:text-5xl font-black text-white mb-3">
                  +200% <span className="neon-text-purple">до</span>
                  <br />
                  <span className="gradient-text-gold">₽100,000</span>
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Зарегистрируйся сейчас и получи двойное пополнение на первый депозит + 150 фриспинов
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link to="/bonuses" className="cyber-btn-pink px-8 py-3 text-sm rounded-sm inline-flex items-center gap-2 justify-center">
                    <Icon name="Gift" size={16} />
                    ПОЛУЧИТЬ БОНУС
                  </Link>
                  <Link to="/bonuses" className="cyber-btn-secondary px-8 py-3 text-sm rounded-sm inline-flex items-center gap-2 justify-center" style={{ borderColor: '#a855f7', color: '#a855f7' }}>
                    Подробнее
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <div className="text-8xl animate-float">🎁</div>
                <div className="mt-4 space-y-2">
                  {['150 фриспинов', 'Без вейджера x30', '7 дней на отыгрыш'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={14} className="text-[#00ff9f]" />
                      <span className="text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-cyber text-[#00ff9f] text-xs tracking-widest">// ПОСЛЕДНИЕ ПОБЕДИТЕЛИ</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ff9f]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="cyber-card rounded-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0a0f1a] border border-[rgba(0,245,255,0.2)] flex items-center justify-center text-2xl flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-cyber text-xs text-[#00f5ff]">{t.user}</div>
                  <div className="font-mono-cyber text-xl text-[#00ff9f] font-bold">{t.amount}</div>
                  <div className="text-gray-500 text-xs">{t.game}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-2">// ПОЧЕМУ NEXUS</div>
            <h2 className="font-cyber text-3xl text-white">Технологии будущего сегодня</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'Zap', title: 'Мгновенные выплаты', desc: 'Вывод средств за 5 минут на любой кошелёк. Без задержек и комиссий.', color: '#ffd600' },
              { icon: 'Shield', title: 'Абсолютная безопасность', desc: '256-bit SSL шифрование, двухфакторная аутентификация и полная лицензия MGA.', color: '#00ff9f' },
              { icon: 'Brain', title: 'ИИ-рекомендации', desc: 'Умная система подбирает игры на основе твоих предпочтений и стиля игры.', color: '#a855f7' },
              { icon: 'Smartphone', title: 'Мобильная версия', desc: 'Полноценное казино в твоём смартфоне. iOS и Android без ограничений.', color: '#00f5ff' },
              { icon: 'HeadphonesIcon', title: 'Поддержка 24/7', desc: 'Живые операторы готовы помочь в любое время. Чат, телефон, email.', color: '#ff006e' },
              { icon: 'TrendingUp', title: 'Честная статистика', desc: 'Прозрачный RTP, история всех ставок и детальная аналитика твоей игры.', color: '#00f5ff' },
            ].map((feat, i) => (
              <div key={i} className="cyber-card rounded-sm p-6 corner-bracket group hover:scale-[1.02] transition-transform duration-200"
                style={{ border: `1px solid ${feat.color}15` }}>
                <div className="w-12 h-12 border flex items-center justify-center mb-4 group-hover:animate-glow-pulse"
                  style={{ borderColor: `${feat.color}40`, background: `${feat.color}10` }}>
                  <Icon name={feat.icon as 'Zap'} size={20} style={{ color: feat.color }} />
                </div>
                <h3 className="font-cyber text-sm text-white mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
