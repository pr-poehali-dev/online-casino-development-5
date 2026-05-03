import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const balanceHistory = [
  { date: '28 Апр', balance: 12000 },
  { date: '29 Апр', balance: 18500 },
  { date: '30 Апр', balance: 15200 },
  { date: '1 Май', balance: 22000 },
  { date: '2 Май', balance: 19800 },
  { date: '3 Май', balance: 31500 },
  { date: '4 Май', balance: 28400 },
];

const transactions = [
  { id: 1, type: 'win', game: 'Cyber Slots X', amount: '+₽15,200', date: '03.05.2024 14:32', status: 'completed' },
  { id: 2, type: 'bet', game: 'Neon Roulette', amount: '-₽500', date: '03.05.2024 13:15', status: 'completed' },
  { id: 3, type: 'deposit', game: 'Пополнение', amount: '+₽10,000', date: '03.05.2024 12:00', status: 'completed' },
  { id: 4, type: 'win', game: 'Dark Blackjack', amount: '+₽3,200', date: '02.05.2024 22:45', status: 'completed' },
  { id: 5, type: 'bet', game: 'Quantum Poker', amount: '-₽2,000', date: '02.05.2024 21:30', status: 'completed' },
  { id: 6, type: 'withdraw', game: 'Вывод средств', amount: '-₽5,000', date: '02.05.2024 18:00', status: 'pending' },
];

const achievements = [
  { icon: '🏆', title: 'Первая победа', desc: 'Выиграл первую ставку', earned: true },
  { icon: '💎', title: 'VIP игрок', desc: 'Депозит более ₽100,000', earned: true },
  { icon: '🔥', title: '7 дней подряд', desc: 'Играл 7 дней подряд', earned: true },
  { icon: '⚡', title: 'Большой выигрыш', desc: 'Выиграл более ₽50,000', earned: false },
  { icon: '🎯', title: 'Мастер рулетки', desc: '100 побед в рулетке', earned: false },
  { icon: '🌟', title: 'Легенда', desc: 'Достичь уровня Легенда', earned: false },
];

const tabs = ['Обзор', 'История', 'Достижения', 'Настройки'];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-10 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 border-2 border-[#00f5ff] bg-[#0a0f1a] flex items-center justify-center text-4xl"
                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                🐺
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00ff9f] rounded-full border-2 border-[#050810] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#050810] rounded-full" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-cyber text-2xl text-white">CyberWolf88</h1>
                <span className="badge-jackpot">VIP</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-mono-cyber text-gray-500">ID: #NX-48821</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={12} className="text-[#ffd600]" />
                  <span className="text-[#ffd600] font-mono-cyber">Уровень 47</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Shield" size={12} className="text-[#00ff9f]" />
                  <span className="text-[#00ff9f] font-mono-cyber">Верифицирован</span>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-3 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-cyber text-xs text-gray-500">XP: 47,200 / 50,000</span>
                  <span className="font-mono-cyber text-xs text-[#00f5ff]">94%</span>
                </div>
                <div className="h-1.5 bg-[#0a0f1a] rounded-full overflow-hidden border border-[rgba(0,245,255,0.1)]">
                  <div className="h-full rounded-full animate-glow-pulse" style={{ width: '94%', background: 'linear-gradient(90deg, #00f5ff, #a855f7)' }} />
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="cyber-card rounded-sm p-5 text-center min-w-[200px]">
              <div className="font-cyber text-xs text-gray-500 tracking-widest mb-1">БАЛАНС</div>
              <div className="font-mono-cyber text-3xl text-[#00f5ff] font-bold mb-3">₽28,400</div>
              <div className="flex gap-2">
                <button className="cyber-btn-primary px-3 py-2 text-xs rounded-sm flex-1 flex items-center gap-1 justify-center">
                  <Icon name="Plus" size={12} />
                  Пополнить
                </button>
                <button className="cyber-btn-secondary px-3 py-2 text-xs rounded-sm flex-1 flex items-center gap-1 justify-center">
                  <Icon name="ArrowUpRight" size={12} />
                  Вывести
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[rgba(0,245,255,0.08)] bg-[#020408]/50">
        <div className="container mx-auto px-4">
          <div className="flex">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`px-6 py-4 font-cyber text-xs tracking-widest uppercase border-b-2 transition-all duration-200
                  ${activeTab === i
                    ? 'text-[#00f5ff] border-[#00f5ff]'
                    : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Chart */}
              <div className="cyber-card rounded-sm p-6">
                <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-4">// ДИНАМИКА БАЛАНСА</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={balanceHistory}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0a0f1a', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '2px', fontFamily: 'Share Tech Mono', fontSize: '12px' }}
                      labelStyle={{ color: '#00f5ff' }}
                      itemStyle={{ color: '#00f5ff' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#00f5ff" strokeWidth={2} fill="url(#balanceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Всего ставок', value: '1,842', color: '#00f5ff' },
                  { label: 'Всего выигрышей', value: '₽234K', color: '#00ff9f' },
                  { label: 'Лучший выигрыш', value: '₽45,000', color: '#ffd600' },
                  { label: 'Win Rate', value: '54.2%', color: '#a855f7' },
                ].map((s, i) => (
                  <div key={i} className="cyber-card rounded-sm p-4 text-center">
                    <div className="font-mono-cyber text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent transactions */}
              <div className="cyber-card rounded-sm p-5">
                <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-4">// ПОСЛЕДНИЕ ОПЕРАЦИИ</div>
                <div className="space-y-2">
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.03)]">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm
                        ${tx.type === 'win' ? 'bg-[#00ff9f]/10 text-[#00ff9f]' :
                          tx.type === 'deposit' ? 'bg-[#00f5ff]/10 text-[#00f5ff]' :
                          tx.type === 'withdraw' ? 'bg-[#a855f7]/10 text-[#a855f7]' :
                          'bg-[#ff006e]/10 text-[#ff006e]'}`}>
                        <Icon name={tx.type === 'win' ? 'TrendingUp' : tx.type === 'deposit' ? 'Plus' : tx.type === 'withdraw' ? 'ArrowUpRight' : 'Minus'} size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="font-cyber text-xs text-white">{tx.game}</div>
                        <div className="text-gray-600 text-xs font-mono-cyber">{tx.date}</div>
                      </div>
                      <div className={`font-mono-cyber text-sm font-bold
                        ${tx.amount.startsWith('+') ? 'text-[#00ff9f]' : 'text-gray-400'}`}>
                        {tx.amount}
                      </div>
                      <div className={`text-xs font-mono-cyber px-2 py-0.5 rounded-sm
                        ${tx.status === 'completed' ? 'text-[#00ff9f] bg-[#00ff9f]/10' : 'text-[#ffd600] bg-[#ffd600]/10'}`}>
                        {tx.status === 'completed' ? 'OK' : 'В ожидании'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Deposit widget */}
              <div className="cyber-card rounded-sm p-5">
                <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-4">// БЫСТРОЕ ПОПОЛНЕНИЕ</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['1,000', '5,000', '10,000'].map(amt => (
                    <button key={amt} onClick={() => setDepositAmount(amt)}
                      className={`py-2 text-xs font-cyber rounded-sm border transition-all duration-200
                        ${depositAmount === amt ? 'border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]' : 'border-[rgba(0,245,255,0.2)] text-gray-400'}`}>
                      ₽{amt}
                    </button>
                  ))}
                </div>
                <input
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="Сумма пополнения"
                  className="cyber-input w-full px-3 py-2 text-sm rounded-sm mb-3"
                />
                <button className="cyber-btn-primary w-full py-3 text-xs rounded-sm">ПОПОЛНИТЬ</button>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['💳', '🏦', '₿', '⚡'].map((icon, i) => (
                    <button key={i} className="h-10 border border-[rgba(0,245,255,0.1)] flex items-center justify-center text-lg hover:border-[#00f5ff] transition-colors">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Progress */}
              <div className="cyber-card rounded-sm p-5">
                <div className="font-cyber text-xs text-[#ffd600] tracking-widest mb-4">// VIP СТАТУС</div>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">💎</div>
                  <div className="font-cyber text-lg text-[#ffd600]">DIAMOND</div>
                  <div className="text-gray-500 text-xs mt-1">Следующий: LEGENDARY</div>
                </div>
                {[
                  { label: 'Кэшбэк', value: '15%', color: '#00ff9f' },
                  { label: 'Лимит вывода', value: '₽500K/день', color: '#00f5ff' },
                  { label: 'Персональный менеджер', value: 'Да', color: '#ffd600' },
                ].map((perk, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.03)]">
                    <span className="text-gray-500 text-xs">{perk.label}</span>
                    <span className="font-mono-cyber text-xs" style={{ color: perk.color }}>{perk.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 1 && (
          <div className="cyber-card rounded-sm p-6">
            <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-6">// ИСТОРИЯ ОПЕРАЦИЙ</div>
            <div className="space-y-1">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 p-4 border border-[rgba(0,245,255,0.05)] hover:border-[rgba(0,245,255,0.15)] rounded-sm transition-all">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-sm
                    ${tx.type === 'win' ? 'bg-[#00ff9f]/10 text-[#00ff9f]' :
                      tx.type === 'deposit' ? 'bg-[#00f5ff]/10 text-[#00f5ff]' :
                      tx.type === 'withdraw' ? 'bg-[#a855f7]/10 text-[#a855f7]' :
                      'bg-[#ff006e]/10 text-[#ff006e]'}`}>
                    <Icon name={tx.type === 'win' ? 'TrendingUp' : tx.type === 'deposit' ? 'Plus' : tx.type === 'withdraw' ? 'ArrowUpRight' : 'Minus'} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-cyber text-sm text-white">{tx.game}</div>
                    <div className="text-gray-600 text-xs font-mono-cyber">{tx.date}</div>
                  </div>
                  <div className={`font-mono-cyber text-lg font-bold ${tx.amount.startsWith('+') ? 'text-[#00ff9f]' : 'text-gray-400'}`}>
                    {tx.amount}
                  </div>
                  <div className={`text-xs font-cyber px-3 py-1 border rounded-sm
                    ${tx.status === 'completed' ? 'border-[#00ff9f]/30 text-[#00ff9f]' : 'border-[#ffd600]/30 text-[#ffd600]'}`}>
                    {tx.status === 'completed' ? 'ВЫПОЛНЕНО' : 'В ОЖИДАНИИ'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 2 && (
          <div>
            <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-6">// ДОСТИЖЕНИЯ</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <div key={i} className={`cyber-card rounded-sm p-5 flex items-center gap-4 transition-all
                  ${ach.earned ? 'border-[rgba(0,245,255,0.2)]' : 'border-[rgba(255,255,255,0.03)] opacity-50'}`}>
                  <div className={`w-14 h-14 flex items-center justify-center text-3xl rounded-sm
                    ${ach.earned ? 'bg-[#0a0f1a] border border-[rgba(0,245,255,0.3)]' : 'bg-[#0a0f1a] border border-[rgba(255,255,255,0.05)]'}`}>
                    {ach.earned ? ach.icon : '🔒'}
                  </div>
                  <div>
                    <div className={`font-cyber text-sm ${ach.earned ? 'text-white' : 'text-gray-600'}`}>{ach.title}</div>
                    <div className="text-gray-600 text-xs mt-0.5">{ach.desc}</div>
                    {ach.earned && <div className="text-[#00ff9f] text-xs font-mono-cyber mt-1">✓ ПОЛУЧЕНО</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <div className="max-w-xl space-y-6">
            <div className="cyber-card rounded-sm p-6">
              <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-6">// НАСТРОЙКИ ПРОФИЛЯ</div>
              <div className="space-y-4">
                {[
                  { label: 'Никнейм', value: 'CyberWolf88', type: 'text' },
                  { label: 'Email', value: 'wolf@nexus.io', type: 'email' },
                  { label: 'Телефон', value: '+7 900 000 0000', type: 'tel' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-1">{field.label.toUpperCase()}</label>
                    <input type={field.type} defaultValue={field.value} className="cyber-input w-full px-3 py-3 text-sm rounded-sm" />
                  </div>
                ))}
                <button className="cyber-btn-primary px-6 py-3 text-xs rounded-sm mt-2">СОХРАНИТЬ</button>
              </div>
            </div>

            <div className="cyber-card rounded-sm p-6">
              <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-4">// БЕЗОПАСНОСТЬ</div>
              <div className="space-y-3">
                {[
                  { label: 'Двухфакторная аутентификация', enabled: true },
                  { label: 'Email уведомления', enabled: true },
                  { label: 'SMS уведомления', enabled: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.03)]">
                    <span className="text-gray-300 text-sm">{s.label}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${s.enabled ? 'bg-[#00f5ff]' : 'bg-[#0a0f1a] border border-[rgba(0,245,255,0.2)]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-[#050810] rounded-full transition-transform ${s.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
