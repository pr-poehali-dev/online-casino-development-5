import { useState } from 'react';
import Icon from '@/components/ui/icon';

const tournaments = [
  {
    id: 1, name: 'CYBER GRAND PRIX', game: 'Все слоты', prize: '₽2,500,000',
    participants: 1842, maxParticipants: 5000, endTime: '2д 14ч 32м',
    status: 'active', color: '#00f5ff', emoji: '🏆', joined: true,
  },
  {
    id: 2, name: 'NEON ROULETTE CHAMPIONSHIP', game: 'Рулетка', prize: '₽800,000',
    participants: 342, maxParticipants: 500, endTime: '18ч 45м',
    status: 'active', color: '#ff006e', emoji: '🎡', joined: false,
  },
  {
    id: 3, name: 'QUANTUM POKER SERIES', game: 'Покер', prize: '₽1,200,000',
    participants: 567, maxParticipants: 1000, endTime: '5д 8ч',
    status: 'active', color: '#a855f7', emoji: '🃏', joined: false,
  },
  {
    id: 4, name: 'BLACKJACK MASTERS', game: 'Блэкджек', prize: '₽500,000',
    participants: 89, maxParticipants: 200, endTime: '1д 3ч',
    status: 'upcoming', color: '#00ff9f', emoji: '🂡', joined: false,
  },
];

const leaderboard = [
  { rank: 1, user: 'NightHawk', avatar: '🦅', score: 124850, prize: '₽500,000', change: 'up' },
  { rank: 2, user: 'CyberWolf88', avatar: '🐺', score: 118420, prize: '₽250,000', change: 'same' },
  { rank: 3, user: 'GalaxyX', avatar: '🌌', score: 112300, prize: '₽150,000', change: 'up' },
  { rank: 4, user: 'NeonRider', avatar: '🏍️', score: 98750, prize: '₽75,000', change: 'down' },
  { rank: 5, user: 'PhantomPlayer', avatar: '👻', score: 87200, prize: '₽50,000', change: 'up' },
  { rank: 6, user: 'DarkKnight', avatar: '🤺', score: 76540, prize: '₽35,000', change: 'down' },
  { rank: 7, user: 'CryptoKing', avatar: '👑', score: 65890, prize: '₽25,000', change: 'up' },
  { rank: 8, user: 'StarDust', avatar: '✨', score: 54320, prize: '₽15,000', change: 'same' },
];

export default function TournamentsPage() {
  const [activeTournament, setActiveTournament] = useState(1);

  const selected = tournaments.find(t => t.id === activeTournament) || tournaments[0];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd600] to-transparent opacity-40" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="font-cyber text-xs text-[#ffd600] tracking-widest mb-2">// АРЕНА ТУРНИРОВ</div>
          <h1 className="font-cyber text-4xl font-black text-white mb-2">
            <span className="gradient-text-gold">Турниры</span> & Лидерборды
          </h1>
          <p className="text-gray-500">Сражайся с лучшими игроками и побеждай реальные призы</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tournament Cards */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-cyber text-[#ffd600] text-xs tracking-widest">// АКТИВНЫЕ ТУРНИРЫ</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#ffd600]/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {tournaments.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveTournament(t.id)}
              className={`cyber-card rounded-sm p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                ${activeTournament === t.id ? 'scale-[1.02]' : ''}`}
              style={{ border: `1px solid ${activeTournament === t.id ? t.color : `${t.color}20`}`,
                boxShadow: activeTournament === t.id ? `0 0 20px ${t.color}30` : 'none' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{t.emoji}</span>
                {t.joined && <span className="badge-new">УЧАСТВУЮ</span>}
                {t.status === 'upcoming' && <span className="text-xs font-cyber text-[#ffd600] border border-[#ffd600]/30 px-2 py-0.5">СКОРО</span>}
              </div>
              <h3 className="font-cyber text-xs text-white mb-1 leading-tight">{t.name}</h3>
              <p className="text-gray-600 text-xs mb-3">{t.game}</p>

              <div className="font-mono-cyber text-xl font-bold mb-2" style={{ color: t.color }}>{t.prize}</div>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 text-xs font-mono-cyber">{t.participants}/{t.maxParticipants}</span>
                  <span className="font-mono-cyber text-xs" style={{ color: t.color }}>
                    {Math.round(t.participants / t.maxParticipants * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-[#0a0f1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.participants / t.maxParticipants * 100}%`, background: t.color }} />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Icon name="Clock" size={10} className="text-gray-600" />
                <span className="font-mono-cyber text-gray-500">{t.endTime}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected tournament detail + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tournament Detail */}
          <div className="lg:col-span-1 cyber-card rounded-sm p-6" style={{ border: `1px solid ${selected.color}20` }}>
            <div className="font-cyber text-xs tracking-widest mb-4" style={{ color: selected.color }}>// {selected.name}</div>

            <div className="text-center py-6">
              <div className="text-6xl mb-3 animate-float">{selected.emoji}</div>
              <div className="font-mono-cyber text-3xl font-bold mb-1" style={{ color: selected.color }}>
                {selected.prize}
              </div>
              <div className="text-gray-500 text-sm">Призовой фонд</div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Игра', value: selected.game },
                { label: 'Участников', value: `${selected.participants} / ${selected.maxParticipants}` },
                { label: 'Осталось времени', value: selected.endTime },
                { label: 'Мин. ставка', value: '₽100' },
                { label: 'Вход', value: 'Бесплатно' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="font-mono-cyber text-sm text-white">{item.value}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-3 text-xs rounded-sm font-cyber tracking-widest ${selected.joined ? 'cyber-btn-secondary' : 'cyber-btn-primary'}`}
              style={selected.joined ? { borderColor: selected.color, color: selected.color } : {}}>
              {selected.joined ? 'УЖЕ УЧАСТВУЮ' : 'УЧАСТВОВАТЬ'}
            </button>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2 cyber-card rounded-sm p-6">
            <div className="font-cyber text-xs text-[#ffd600] tracking-widest mb-6">// ТАБЛИЦА ЛИДЕРОВ — {selected.name}</div>

            <div className="space-y-1">
              {leaderboard.map((player, i) => (
                <div
                  key={player.rank}
                  className={`flex items-center gap-4 p-3 rounded-sm transition-all
                    ${player.user === 'CyberWolf88' ? 'bg-[#00f5ff]/5 border border-[rgba(0,245,255,0.15)]' : 'hover:bg-[#0a0f1a]'}`}
                >
                  {/* Rank */}
                  <div className={`w-8 text-center font-cyber text-sm font-black
                    ${player.rank === 1 ? 'text-[#ffd600]' : player.rank === 2 ? 'text-[#c0c0c0]' : player.rank === 3 ? 'text-[#cd7f32]' : 'text-gray-600'}`}>
                    {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 bg-[#0a0f1a] border border-[rgba(0,245,255,0.1)] flex items-center justify-center text-sm">
                    {player.avatar}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <div className={`font-cyber text-sm ${player.user === 'CyberWolf88' ? 'text-[#00f5ff]' : 'text-white'}`}>
                      {player.user}
                      {player.user === 'CyberWolf88' && <span className="text-xs text-gray-500 ml-2">(Вы)</span>}
                    </div>
                  </div>

                  {/* Change indicator */}
                  <div className={`text-xs ${player.change === 'up' ? 'text-[#00ff9f]' : player.change === 'down' ? 'text-[#ff006e]' : 'text-gray-600'}`}>
                    <Icon name={player.change === 'up' ? 'TrendingUp' : player.change === 'down' ? 'TrendingDown' : 'Minus'} size={12} />
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="font-mono-cyber text-sm text-white">{player.score.toLocaleString()}</div>
                    <div className="font-mono-cyber text-xs text-[#ffd600]">{player.prize}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prize Distribution */}
            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="font-cyber text-xs text-gray-500 tracking-widest mb-3">РАСПРЕДЕЛЕНИЕ ПРИЗОВ</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { place: '1-е', percent: '40%', color: '#ffd600' },
                  { place: '2-е', percent: '20%', color: '#c0c0c0' },
                  { place: '3-е', percent: '15%', color: '#cd7f32' },
                  { place: '4-10', percent: '25%', color: '#00f5ff' },
                ].map(p => (
                  <div key={p.place} className="text-center border border-[rgba(255,255,255,0.05)] p-3 rounded-sm">
                    <div className="font-cyber text-xs mb-1" style={{ color: p.color }}>{p.place}</div>
                    <div className="font-mono-cyber text-sm text-white">{p.percent}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
