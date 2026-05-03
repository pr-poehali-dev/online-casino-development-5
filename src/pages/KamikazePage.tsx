import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

type GameState = 'waiting' | 'flying' | 'crashed' | 'won';

const HISTORY = [
  { mult: 1.24, crashed: false }, { mult: 5.80, crashed: false },
  { mult: 1.01, crashed: true },  { mult: 12.40, crashed: false },
  { mult: 2.34, crashed: false }, { mult: 1.07, crashed: true },
  { mult: 3.60, crashed: false }, { mult: 88.5, crashed: false },
  { mult: 1.02, crashed: true },  { mult: 4.20, crashed: false },
];

const LIVE_BETS = [
  { user: 'NightHawk', bet: 500, cashout: null, avatar: '🦅' },
  { user: 'CyberWolf88', bet: 2000, cashout: null, avatar: '🐺' },
  { user: 'GalaxyX', bet: 1200, cashout: null, avatar: '🌌' },
  { user: 'NeonRider', bet: 300, cashout: null, avatar: '🏍️' },
  { user: 'PhantomP', bet: 5000, cashout: null, avatar: '👻' },
  { user: 'StarDust', bet: 800, cashout: null, avatar: '✨' },
];

export default function KamikazePage() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState('1000');
  const [autoCashout, setAutoCashout] = useState('2.00');
  const [hasBet, setHasBet] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [crashedAt, setCrashedAt] = useState<number | null>(null);
  const [balance, setBalance] = useState(28400);
  const [liveBets, setLiveBets] = useState(LIVE_BETS);
  const [chatMessages, setChatMessages] = useState([
    { user: 'GalaxyX', text: '88x было вчера 🔥', time: '14:28' },
    { user: 'NightHawk', text: 'Кто выходит на 2x?', time: '14:29' },
    { user: 'System', text: 'Следующий раунд через 5 сек', time: '14:30' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startGame = useCallback(() => {
    setGameState('flying');
    setMultiplier(1.0);
    setCrashedAt(null);
    setWonAmount(null);

    const crashPoint = Math.random() < 0.3
      ? 1 + Math.random() * 0.5
      : 1 + Math.random() * (Math.random() < 0.1 ? 50 : 10);

    let current = 1.0;
    intervalRef.current = setInterval(() => {
      current += current * 0.03;
      setMultiplier(parseFloat(current.toFixed(2)));

      // auto cashout
      if (parseFloat(autoCashout) > 0 && current >= parseFloat(autoCashout)) {
        // handled by effect
      }

      if (current >= crashPoint) {
        stopInterval();
        setCrashedAt(parseFloat(current.toFixed(2)));
        setGameState('crashed');
        if (hasBet) {
          setHasBet(false);
        }
        // restart after 3s
        setTimeout(() => {
          setGameState('waiting');
          setCountdown(5);
          setMultiplier(1.0);
          setLiveBets(LIVE_BETS);
          let c = 5;
          countdownRef.current = setInterval(() => {
            c--;
            setCountdown(c);
            if (c <= 0) {
              if (countdownRef.current) clearInterval(countdownRef.current);
              startGame();
            }
          }, 1000);
        }, 3000);
      }
    }, 100);
  }, [autoCashout, hasBet]);

  // auto cashout effect
  useEffect(() => {
    if (gameState === 'flying' && hasBet && parseFloat(autoCashout) > 0 && multiplier >= parseFloat(autoCashout)) {
      handleCashout();
    }
  }, [multiplier]);

  useEffect(() => {
    setCountdown(5);
    let c = 5;
    countdownRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startGame();
      }
    }, 1000);
    return () => stopInterval();
  }, []);

  const handleBet = () => {
    const betNum = parseFloat(bet);
    if (!betNum || betNum <= 0 || betNum > balance) return;
    if (gameState !== 'waiting') return;
    setBalance(prev => prev - betNum);
    setHasBet(true);
    setLiveBets(prev => prev.map((b, i) => i === 1 ? { ...b, bet: betNum } : b));
  };

  const handleCashout = () => {
    if (!hasBet || gameState !== 'flying') return;
    const betNum = parseFloat(bet);
    const won = parseFloat((betNum * multiplier).toFixed(0));
    setBalance(prev => prev + won);
    setWonAmount(won);
    setHasBet(false);
    setGameState('won');
    setLiveBets(prev => prev.map((b, i) => i === 1 ? { ...b, cashout: multiplier } : b));
    setTimeout(() => {
      setGameState('flying');
    }, 100);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: 'CyberWolf88', text: chatInput, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const multColor = multiplier >= 10 ? '#ffd600' : multiplier >= 5 ? '#a855f7' : multiplier >= 2 ? '#00ff9f' : '#00f5ff';

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Header */}
      <div className="border-b border-[rgba(255,69,0,0.2)] bg-[#020408]/80 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/games" className="text-gray-500 hover:text-[#ff4500] transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                <h1 className="font-cyber text-xl font-black text-white">KAMIKAZE</h1>
                <span className="badge-hot animate-neon-flicker">HOT</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono-cyber text-xs text-gray-500">NEXUS Originals</span>
                <span className="font-mono-cyber text-xs text-[#ff4500]">RTP 97.0%</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-glow-pulse" />
                  <span className="font-mono-cyber text-xs text-[#00ff9f]">{liveBets.length * 847} онлайн</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card rounded-sm px-5 py-2 flex items-center gap-3">
            <Icon name="Wallet" size={14} className="text-[#00f5ff]" />
            <span className="font-mono-cyber text-[#00f5ff] font-bold">₽{balance.toLocaleString('ru-RU')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Main Game Area */}
          <div className="xl:col-span-3 space-y-4">

            {/* Game Canvas */}
            <div className="cyber-card rounded-sm overflow-hidden" style={{ border: '1px solid rgba(255,69,0,0.2)' }}>
              {/* History strip */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[rgba(255,255,255,0.04)] overflow-x-auto">
                <span className="font-cyber text-[10px] text-gray-600 tracking-widest shrink-0">ИСТОРИЯ:</span>
                {HISTORY.map((h, i) => (
                  <div key={i}
                    className="shrink-0 px-2 py-0.5 rounded-sm font-mono-cyber text-xs font-bold"
                    style={{
                      background: h.crashed ? 'rgba(255,0,110,0.1)' : h.mult >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(0,245,255,0.05)',
                      color: h.crashed ? '#ff006e' : h.mult >= 5 ? '#ffd600' : '#00f5ff',
                      border: `1px solid ${h.crashed ? 'rgba(255,0,110,0.2)' : h.mult >= 5 ? 'rgba(255,214,0,0.2)' : 'rgba(0,245,255,0.1)'}`,
                    }}>
                    {h.mult.toFixed(2)}x
                  </div>
                ))}
              </div>

              {/* Game screen */}
              <div className="relative h-72 md:h-96 flex flex-col items-center justify-center overflow-hidden"
                style={{ background: 'radial-gradient(ellipse at center, #0a1020 0%, #050810 70%)' }}>

                {/* Grid lines */}
                <div className="absolute inset-0 grid-bg opacity-20" />

                {/* Trajectory line */}
                {gameState === 'flying' || gameState === 'won' ? (
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trailGrad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ff4500" stopOpacity="0" />
                        <stop offset="100%" stopColor="#ff4500" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 100% Q 30% 90% ${Math.min(multiplier * 5, 100)}% ${Math.max(100 - multiplier * 8, 5)}%`}
                      fill="none"
                      stroke="url(#trailGrad)"
                      strokeWidth="2"
                    />
                  </svg>
                ) : null}

                {/* Plane */}
                {gameState === 'flying' || gameState === 'won' ? (
                  <div
                    className="absolute text-4xl transition-all duration-100"
                    style={{
                      left: `${Math.min(multiplier * 5, 85)}%`,
                      top: `${Math.max(55 - multiplier * 8, 8)}%`,
                      filter: `drop-shadow(0 0 15px #ff4500)`,
                      transform: 'rotate(-35deg)',
                    }}>
                    ✈️
                  </div>
                ) : null}

                {/* Main multiplier display */}
                <div className="relative z-10 text-center">
                  {gameState === 'waiting' && (
                    <div className="animate-fade-in">
                      <div className="font-cyber text-gray-600 text-sm tracking-widest mb-2">СЛЕДУЮЩИЙ РАУНД</div>
                      <div className="font-mono-cyber text-7xl font-black text-white mb-2">{countdown}</div>
                      <div className="font-cyber text-gray-500 text-xs tracking-widest">СЕКУНД</div>
                    </div>
                  )}

                  {(gameState === 'flying' || gameState === 'won') && (
                    <div>
                      <div className="font-mono-cyber font-black leading-none transition-all duration-100"
                        style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', color: multColor, textShadow: `0 0 30px ${multColor}` }}>
                        {multiplier.toFixed(2)}x
                      </div>
                      {wonAmount && (
                        <div className="mt-3 animate-fade-in">
                          <div className="font-cyber text-sm text-[#00ff9f]">ВЫИГРЫШ!</div>
                          <div className="font-mono-cyber text-2xl text-[#00ff9f] font-bold">+₽{wonAmount.toLocaleString('ru-RU')}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {gameState === 'crashed' && (
                    <div className="animate-fade-in">
                      <div className="font-cyber text-[#ff006e] text-sm tracking-widest mb-2 animate-neon-flicker">УПАЛ!</div>
                      <div className="font-mono-cyber font-black leading-none"
                        style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', color: '#ff006e', textShadow: '0 0 30px #ff006e' }}>
                        {crashedAt?.toFixed(2)}x
                      </div>
                      <div className="font-cyber text-gray-600 text-xs mt-3 tracking-widest">НОВЫЙ РАУНД ЧЕРЕЗ 3 СЕК</div>
                    </div>
                  )}
                </div>

                {/* Explosion effect */}
                {gameState === 'crashed' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-8xl animate-fade-in" style={{ filter: 'drop-shadow(0 0 30px #ff006e)' }}>💥</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bet Controls */}
            <div className="cyber-card rounded-sm p-5" style={{ border: '1px solid rgba(255,69,0,0.15)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Bet amount */}
                <div>
                  <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-2">СТАВКА (₽)</label>
                  <div className="flex gap-2 mb-2">
                    {['500', '1000', '5000', '10000'].map(v => (
                      <button key={v}
                        onClick={() => setBet(v)}
                        disabled={gameState === 'flying'}
                        className={`flex-1 py-1.5 font-cyber text-xs rounded-sm border transition-all
                          ${bet === v ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[rgba(255,69,0,0.15)] text-gray-500 hover:text-[#ff4500]'}`}>
                        {parseInt(v) >= 1000 ? `${parseInt(v) / 1000}K` : v}
                      </button>
                    ))}
                  </div>
                  <input
                    value={bet}
                    onChange={e => setBet(e.target.value)}
                    disabled={gameState === 'flying' || hasBet}
                    className="cyber-input w-full px-3 py-3 text-sm rounded-sm font-mono-cyber"
                    style={{ borderColor: 'rgba(255,69,0,0.3)', color: '#ff4500' }}
                  />
                </div>

                {/* Auto cashout */}
                <div>
                  <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-2">АВТО-ВЫВОД (x)</label>
                  <div className="flex gap-2 mb-2">
                    {['1.5', '2.0', '5.0', '10.0'].map(v => (
                      <button key={v}
                        onClick={() => setAutoCashout(v)}
                        className={`flex-1 py-1.5 font-cyber text-xs rounded-sm border transition-all
                          ${autoCashout === v ? 'border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]' : 'border-[rgba(0,245,255,0.1)] text-gray-500 hover:text-[#00f5ff]'}`}>
                        {v}x
                      </button>
                    ))}
                  </div>
                  <input
                    value={autoCashout}
                    onChange={e => setAutoCashout(e.target.value)}
                    className="cyber-input w-full px-3 py-3 text-sm rounded-sm font-mono-cyber"
                  />
                </div>

                {/* Action button */}
                <div>
                  <label className="font-cyber text-xs text-gray-500 tracking-widest block mb-2">ДЕЙСТВИЕ</label>
                  <div className="h-[42px] mb-2" /> {/* spacer */}
                  {gameState === 'waiting' && !hasBet && (
                    <button onClick={handleBet}
                      className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all"
                      style={{ background: 'linear-gradient(135deg, #ff4500, #cc2200)', color: 'white', boxShadow: '0 0 20px rgba(255,69,0,0.3)' }}>
                      ПОСТАВИТЬ
                    </button>
                  )}
                  {gameState === 'waiting' && hasBet && (
                    <button disabled
                      className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm border border-[#ff4500]/40 text-[#ff4500] opacity-60">
                      СТАВКА ПРИНЯТА ✓
                    </button>
                  )}
                  {gameState === 'flying' && !hasBet && (
                    <button disabled
                      className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm border border-gray-700 text-gray-600 cursor-not-allowed">
                      РАУНД ИДЁТ...
                    </button>
                  )}
                  {(gameState === 'flying' || gameState === 'won') && hasBet && (
                    <button onClick={handleCashout}
                      className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all animate-glow-pulse"
                      style={{ background: 'linear-gradient(135deg, #00ff9f, #00cc7a)', color: '#050810', boxShadow: '0 0 20px rgba(0,255,159,0.4)' }}>
                      ЗАБРАТЬ ₽{(parseFloat(bet) * multiplier).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
                    </button>
                  )}
                  {gameState === 'crashed' && (
                    <button disabled
                      className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm border border-[#ff006e]/30 text-[#ff006e]/50 cursor-not-allowed">
                      САМОЛЁТ УПАЛ 💥
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live bets table */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(255,69,0,0.1)' }}>
              <div className="font-cyber text-xs text-[#ff4500] tracking-widest mb-3">// СТАВКИ В РАУНДЕ</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {liveBets.map((lb, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-sm
                    ${lb.user === 'CyberWolf88' ? 'bg-[#00f5ff]/5 border border-[rgba(0,245,255,0.1)]' : ''}`}>
                    <span className="text-lg">{lb.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-cyber text-xs truncate ${lb.user === 'CyberWolf88' ? 'text-[#00f5ff]' : 'text-gray-400'}`}>
                        {lb.user}
                      </div>
                    </div>
                    <div className="font-mono-cyber text-xs text-gray-400">₽{lb.bet.toLocaleString()}</div>
                    {lb.cashout ? (
                      <div className="font-cyber text-xs text-[#00ff9f] border border-[#00ff9f]/30 px-2 py-0.5">
                        {lb.cashout.toFixed(2)}x
                      </div>
                    ) : gameState === 'flying' ? (
                      <div className="font-mono-cyber text-xs" style={{ color: multColor }}>
                        {multiplier.toFixed(2)}x
                      </div>
                    ) : (
                      <div className="font-cyber text-xs text-gray-700">—</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat & Stats Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(255,69,0,0.15)' }}>
              <div className="font-cyber text-xs text-[#ff4500] tracking-widest mb-3">// СТАТИСТИКА</div>
              <div className="space-y-3">
                {[
                  { label: 'Макс. множитель', value: '88.50x', color: '#ffd600' },
                  { label: 'Средний', value: '4.2x', color: '#a855f7' },
                  { label: 'Мой выигрыш сегодня', value: '₽15,200', color: '#00ff9f' },
                  { label: 'Раундов сыграно', value: '847', color: '#00f5ff' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{s.label}</span>
                    <span className="font-mono-cyber text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="cyber-card rounded-sm overflow-hidden flex flex-col" style={{ border: '1px solid rgba(255,69,0,0.15)', height: '340px' }}>
              <div className="font-cyber text-xs text-[#ff4500] tracking-widest px-4 py-3 border-b border-[rgba(255,255,255,0.04)]">
                // ЧАТ
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-cyber">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="text-xs">
                    <span className={`font-cyber ${msg.user === 'System' ? 'text-[#ff4500]' : msg.user === 'CyberWolf88' ? 'text-[#00f5ff]' : 'text-gray-500'}`}>
                      {msg.user}:
                    </span>
                    <span className="text-gray-400 ml-1">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[rgba(255,255,255,0.04)] flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Сообщение..."
                  className="cyber-input flex-1 px-3 py-2 text-xs rounded-sm"
                />
                <button onClick={sendChat} className="px-3 py-2 rounded-sm"
                  style={{ background: 'rgba(255,69,0,0.2)', border: '1px solid rgba(255,69,0,0.3)', color: '#ff4500' }}>
                  <Icon name="Send" size={12} />
                </button>
              </div>
            </div>

            {/* Rules */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(255,69,0,0.1)' }}>
              <div className="font-cyber text-xs text-[#ff4500] tracking-widest mb-3">// КАК ИГРАТЬ</div>
              <div className="space-y-2">
                {[
                  '1. Сделай ставку до старта',
                  '2. Самолёт взлетает — множитель растёт',
                  '3. Нажми «Забрать» до крэша',
                  '4. Чем дольше ждёшь — тем выше риск',
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-[#ff4500] rounded-full mt-2 shrink-0" />
                    <span className="text-gray-500 text-xs leading-relaxed">{rule}</span>
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
