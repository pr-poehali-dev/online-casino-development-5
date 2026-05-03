import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

type GameState = 'waiting' | 'flying' | 'crashed' | 'won';

interface PlaneTrail {
  id: number;
  x: number;
  y: number;
  color: string;
  opacity: number;
}

interface LivePlayer {
  user: string;
  avatar: string;
  bet: number;
  cashout: number | null;
  cashedOut: boolean;
}

const ROUND_HISTORY = [
  { mult: 2.14 }, { mult: 1.07 }, { mult: 34.5 }, { mult: 1.01 },
  { mult: 7.82 }, { mult: 3.30 }, { mult: 1.00 }, { mult: 156.2 },
  { mult: 2.65 }, { mult: 1.08 },
];

const INITIAL_PLAYERS: LivePlayer[] = [
  { user: 'NightHawk', avatar: '🦅', bet: 1500, cashout: null, cashedOut: false },
  { user: 'GalaxyX', avatar: '🌌', bet: 8000, cashout: null, cashedOut: false },
  { user: 'CyberWolf88', avatar: '🐺', bet: 2000, cashout: null, cashedOut: false },
  { user: 'NeonRider', avatar: '🏍️', bet: 500, cashout: null, cashedOut: false },
  { user: 'PhantomP', avatar: '👻', bet: 3000, cashout: null, cashedOut: false },
  { user: 'StarDust', avatar: '✨', bet: 750, cashout: null, cashedOut: false },
  { user: 'DarkKnight', avatar: '🤺', bet: 5000, cashout: null, cashedOut: false },
];

export default function AviamastersPage() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState('1000');
  const [autoCashout, setAutoCashout] = useState('');
  const [hasBet, setHasBet] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [crashedAt, setCrashedAt] = useState<number | null>(null);
  const [balance, setBalance] = useState(28400);
  const [players, setPlayers] = useState<LivePlayer[]>(INITIAL_PLAYERS);
  const [trails, setTrails] = useState<PlaneTrail[]>([]);
  const [planePos, setPlanePos] = useState({ x: 5, y: 85 });
  const [betSlot2, setBetSlot2] = useState('');
  const [hasSlot2, setHasSlot2] = useState(false);
  const [autoCashout2, setAutoCashout2] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trailRef = useRef<PlaneTrail[]>([]);
  const multRef = useRef(1.0);

  const stopAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const beginCountdown = useCallback(() => {
    setGameState('waiting');
    setMultiplier(1.0);
    multRef.current = 1.0;
    setPlanePos({ x: 5, y: 85 });
    setTrails([]);
    trailRef.current = [];
    setCrashedAt(null);
    setWonAmount(null);
    setPlayers(INITIAL_PLAYERS);
    let c = 7;
    setCountdown(c);
    countdownRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startFlight();
      }
    }, 1000);
  }, []);

  const startFlight = useCallback(() => {
    setGameState('flying');

    // random crash point: skewed towards low values
    const r = Math.random();
    const crashPoint = r < 0.4
      ? 1 + Math.random() * 1.5
      : r < 0.7
        ? 2 + Math.random() * 5
        : r < 0.9
          ? 7 + Math.random() * 20
          : 30 + Math.random() * 170;

    let current = 1.0;

    intervalRef.current = setInterval(() => {
      current = parseFloat((current + current * 0.028).toFixed(2));
      multRef.current = current;
      setMultiplier(current);

      // move plane: parabolic trajectory
      const progress = Math.min((current - 1) / (crashPoint - 1), 1);
      const newX = 5 + progress * 78;
      const newY = 85 - progress * progress * 78;
      setPlanePos({ x: newX, y: newY });

      // trail
      const newTrail: PlaneTrail = {
        id: Date.now() + Math.random(),
        x: newX,
        y: newY,
        color: '#38bdf8',
        opacity: 1,
      };
      trailRef.current = [...trailRef.current.slice(-30), newTrail];
      setTrails([...trailRef.current]);

      // simulate other players cashing out
      setPlayers(prev => prev.map(p => {
        if (p.cashedOut || p.cashout !== null) return p;
        const thresholds: Record<string, number> = {
          NightHawk: 1.5, NeonRider: 1.8, PhantomP: 2.5,
          DarkKnight: 3.0, StarDust: 1.4,
        };
        const threshold = thresholds[p.user];
        if (threshold && current >= threshold) {
          return { ...p, cashout: current, cashedOut: true };
        }
        return p;
      }));

      // auto cashout slot 1
      const auto1 = parseFloat(autoCashout);
      if (hasBet && !isNaN(auto1) && auto1 > 1 && current >= auto1) {
        triggerCashout(current);
      }

      if (current >= crashPoint) {
        stopAll();
        setCrashedAt(current);
        setGameState('crashed');
        setHasBet(false);
        setHasSlot2(false);
        setTimeout(() => beginCountdown(), 4000);
      }
    }, 120);
  }, [hasBet, autoCashout, beginCountdown]);

  const triggerCashout = (mult: number) => {
    const betNum = parseFloat(bet);
    const won = Math.floor(betNum * mult);
    setBalance(prev => prev + won);
    setWonAmount(won);
    setHasBet(false);
    setPlayers(prev => prev.map(p =>
      p.user === 'CyberWolf88' ? { ...p, cashout: mult, cashedOut: true } : p
    ));
  };

  const handleCashout = () => {
    if (!hasBet || gameState !== 'flying') return;
    triggerCashout(multRef.current);
  };

  const handleBet = () => {
    const betNum = parseFloat(bet);
    if (!betNum || betNum <= 0 || betNum > balance || gameState !== 'waiting') return;
    setBalance(prev => prev - betNum);
    setHasBet(true);
  };

  const handleSlot2Bet = () => {
    const betNum = parseFloat(betSlot2);
    if (!betNum || betNum <= 0 || betNum > balance || gameState !== 'waiting') return;
    setBalance(prev => prev - betNum);
    setHasSlot2(true);
  };

  useEffect(() => {
    beginCountdown();
    return () => stopAll();
  }, []);

  const multColor = multiplier >= 100 ? '#ff006e'
    : multiplier >= 10 ? '#ffd600'
    : multiplier >= 5 ? '#a855f7'
    : multiplier >= 2 ? '#00ff9f'
    : '#38bdf8';

  const skyGradient = gameState === 'crashed'
    ? 'radial-gradient(ellipse at 30% 40%, #2a0808 0%, #0a0208 60%, #050810 100%)'
    : `radial-gradient(ellipse at ${planePos.x}% ${planePos.y}%, ${multColor}08 0%, #050d1a 50%, #050810 100%)`;

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Header */}
      <div className="border-b border-[rgba(56,189,248,0.2)] bg-[#020408]/80 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link to="/games" className="text-gray-500 hover:text-[#38bdf8] transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛩️</span>
                <h1 className="font-cyber text-xl font-black text-white">AVIAMASTERS</h1>
                <span className="badge-hot">HOT</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={12} className="text-[#ffd600]" />
                  <span className="font-mono-cyber text-xs text-[#ffd600]">5.0</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono-cyber text-xs text-gray-500">NEXUS Originals</span>
                <span className="font-mono-cyber text-xs text-[#38bdf8]">RTP 97.5%</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-glow-pulse" />
                  <span className="font-mono-cyber text-xs text-[#00ff9f]">5,120 онлайн</span>
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

      <div className="container mx-auto px-4 py-4">
        {/* History strip */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <span className="font-cyber text-[10px] text-gray-600 tracking-widest shrink-0">ИСТОРИЯ:</span>
          {ROUND_HISTORY.map((h, i) => (
            <div key={i} className="shrink-0 px-2.5 py-1 rounded-sm font-mono-cyber text-xs font-bold transition-all"
              style={{
                background: h.mult < 1.5 ? 'rgba(255,0,110,0.1)' : h.mult >= 10 ? 'rgba(255,214,0,0.1)' : 'rgba(56,189,248,0.07)',
                color: h.mult < 1.5 ? '#ff006e' : h.mult >= 10 ? '#ffd600' : '#38bdf8',
                border: `1px solid ${h.mult < 1.5 ? 'rgba(255,0,110,0.25)' : h.mult >= 10 ? 'rgba(255,214,0,0.25)' : 'rgba(56,189,248,0.15)'}`,
              }}>
              {h.mult.toFixed(2)}x
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Game canvas — spans 3 cols */}
          <div className="xl:col-span-3 space-y-4">
            {/* Sky / game area */}
            <div className="cyber-card rounded-sm overflow-hidden relative"
              style={{ border: `1px solid ${gameState === 'crashed' ? 'rgba(255,0,110,0.3)' : 'rgba(56,189,248,0.2)'}`, minHeight: 380 }}>

              {/* Sky background */}
              <div className="absolute inset-0 transition-all duration-300" style={{ background: skyGradient }} />
              <div className="absolute inset-0 grid-bg opacity-10" />

              {/* Stars */}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{ left: `${(i * 37 + 11) % 95}%`, top: `${(i * 53 + 7) % 70}%`, opacity: 0.2 + (i % 5) * 0.1 }} />
              ))}

              {/* Altitude markers (right axis) */}
              <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-between py-4 pointer-events-none">
                {['10x', '5x', '2x', '1x'].map(label => (
                  <div key={label} className="flex items-center gap-1">
                    <div className="w-4 h-px bg-[rgba(56,189,248,0.15)]" />
                    <span className="font-mono-cyber text-[10px] text-[rgba(56,189,248,0.3)]">{label}</span>
                  </div>
                ))}
              </div>

              {/* Ground line */}
              <div className="absolute bottom-16 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)' }} />

              {/* Trail */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                {trails.length > 1 && (
                  <polyline
                    points={trails.map(t => `${t.x}%,${t.y}%`).join(' ')}
                    fill="none"
                    stroke={multColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}
              </svg>

              {/* Plane */}
              {(gameState === 'flying' || gameState === 'won') && (
                <div className="absolute transition-all duration-120 text-3xl"
                  style={{
                    left: `${planePos.x}%`,
                    top: `${planePos.y}%`,
                    transform: 'translate(-50%, -50%) rotate(-15deg)',
                    filter: `drop-shadow(0 0 12px ${multColor})`,
                  }}>
                  🛩️
                  {/* Wing glow */}
                  <div className="absolute inset-0 blur-lg opacity-60" style={{ background: multColor }} />
                </div>
              )}

              {/* Explosion */}
              {gameState === 'crashed' && (
                <div className="absolute text-5xl"
                  style={{ left: `${planePos.x}%`, top: `${planePos.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <span className="animate-fade-in" style={{ filter: 'drop-shadow(0 0 30px #ff006e)' }}>💥</span>
                </div>
              )}

              {/* Central multiplier display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {gameState === 'waiting' && (
                  <div className="text-center animate-fade-in">
                    <div className="font-cyber text-gray-600 text-xs tracking-widest mb-2">СЛЕДУЮЩИЙ РАУНД</div>
                    <div className="font-mono-cyber font-black text-[80px] leading-none text-white"
                      style={{ textShadow: '0 0 40px rgba(56,189,248,0.3)' }}>
                      {countdown}
                    </div>
                    <div className="font-cyber text-gray-600 text-xs tracking-widest mt-1">СЕКУНД</div>
                    {hasBet && (
                      <div className="mt-4 border border-[#38bdf8]/30 bg-[#38bdf8]/5 px-6 py-2 rounded-sm">
                        <span className="font-cyber text-xs text-[#38bdf8]">СТАВКА ПРИНЯТА: ₽{parseFloat(bet).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {(gameState === 'flying') && (
                  <div className="text-center">
                    <div className="font-mono-cyber font-black leading-none transition-all duration-100"
                      style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', color: multColor, textShadow: `0 0 40px ${multColor}80` }}>
                      {multiplier.toFixed(2)}x
                    </div>
                    {wonAmount && (
                      <div className="mt-2 animate-fade-in">
                        <div className="font-cyber text-sm text-[#00ff9f] tracking-widest">ВЫИГРЫШ ЗАБРАН!</div>
                        <div className="font-mono-cyber text-2xl text-[#00ff9f] font-bold">+₽{wonAmount.toLocaleString('ru-RU')}</div>
                      </div>
                    )}
                  </div>
                )}

                {gameState === 'crashed' && (
                  <div className="text-center animate-fade-in">
                    <div className="font-cyber text-[#ff006e] text-sm tracking-widest mb-2 animate-neon-flicker">САМОЛЁТ УПАЛ!</div>
                    <div className="font-mono-cyber font-black leading-none"
                      style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', color: '#ff006e', textShadow: '0 0 40px rgba(255,0,110,0.8)' }}>
                      {crashedAt?.toFixed(2)}x
                    </div>
                    <div className="font-cyber text-gray-600 text-xs mt-3 tracking-widest">НОВЫЙ РАУНД ЧЕРЕЗ 4 СЕК</div>
                  </div>
                )}
              </div>

              {/* Bottom bar inside canvas */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(to top, rgba(2,4,8,0.9), transparent)' }}>
                <div className="flex items-center gap-3">
                  <Icon name="Users" size={13} className="text-gray-600" />
                  <span className="font-mono-cyber text-xs text-gray-500">{players.length} игроков в раунде</span>
                </div>
                <div className="font-mono-cyber text-xs text-gray-600">
                  Банк: ₽{players.reduce((s, p) => s + p.bet, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Bet panels — two slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slot 1 */}
              <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(56,189,248,0.2)' }}>
                <div className="font-cyber text-xs text-[#38bdf8] tracking-widest mb-3">// СТАВКА 1</div>
                <div className="flex gap-2 mb-2">
                  {['200', '500', '1000', '5000'].map(v => (
                    <button key={v} onClick={() => setBet(v)} disabled={gameState === 'flying' || hasBet}
                      className={`flex-1 py-1.5 font-cyber text-xs rounded-sm border transition-all disabled:opacity-40
                        ${bet === v ? 'border-[#38bdf8] bg-[#38bdf8]/10 text-[#38bdf8]' : 'border-[rgba(56,189,248,0.15)] text-gray-500 hover:text-[#38bdf8]'}`}>
                      {parseInt(v) >= 1000 ? `${parseInt(v)/1000}K` : v}
                    </button>
                  ))}
                </div>
                <input value={bet} onChange={e => setBet(e.target.value)} disabled={hasBet || gameState === 'flying'}
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm font-mono-cyber mb-2"
                  style={{ borderColor: 'rgba(56,189,248,0.3)', color: '#38bdf8' }} />

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-cyber text-xs text-gray-600 shrink-0">Авто:</span>
                  <input value={autoCashout} onChange={e => setAutoCashout(e.target.value)}
                    placeholder="2.00x" disabled={hasBet || gameState === 'flying'}
                    className="cyber-input flex-1 px-3 py-2 text-xs rounded-sm font-mono-cyber disabled:opacity-40"
                    style={{ borderColor: 'rgba(56,189,248,0.2)', color: '#38bdf8' }} />
                </div>

                {gameState === 'waiting' && !hasBet && (
                  <button onClick={handleBet}
                    className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#050810', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }}>
                    ПОСТАВИТЬ
                  </button>
                )}
                {gameState === 'waiting' && hasBet && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-[#38bdf8]/40 text-[#38bdf8]">
                    ✓ СТАВКА ₽{parseFloat(bet).toLocaleString()} ПРИНЯТА
                  </div>
                )}
                {gameState === 'flying' && hasBet && !wonAmount && (
                  <button onClick={handleCashout}
                    className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all animate-glow-pulse"
                    style={{ background: 'linear-gradient(135deg, #00ff9f, #00cc7a)', color: '#050810', boxShadow: '0 0 20px rgba(0,255,159,0.4)' }}>
                    ЗАБРАТЬ ₽{Math.floor(parseFloat(bet) * multiplier).toLocaleString('ru-RU')}
                  </button>
                )}
                {gameState === 'flying' && hasBet && wonAmount && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-[#00ff9f]/40 text-[#00ff9f]">
                    ✓ ЗАБРАНО +₽{wonAmount.toLocaleString()}
                  </div>
                )}
                {gameState === 'flying' && !hasBet && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-gray-800 text-gray-700">
                    РАУНД ИДЁТ...
                  </div>
                )}
                {gameState === 'crashed' && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-[#ff006e]/30 text-[#ff006e]/60">
                    УПАЛ НА {crashedAt?.toFixed(2)}x
                  </div>
                )}
              </div>

              {/* Slot 2 */}
              <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(168,85,247,0.15)' }}>
                <div className="font-cyber text-xs text-[#a855f7] tracking-widest mb-3">// СТАВКА 2</div>
                <div className="flex gap-2 mb-2">
                  {['200', '500', '1000', '5000'].map(v => (
                    <button key={v} onClick={() => setBetSlot2(v)} disabled={gameState === 'flying' || hasSlot2}
                      className={`flex-1 py-1.5 font-cyber text-xs rounded-sm border transition-all disabled:opacity-40
                        ${betSlot2 === v ? 'border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]' : 'border-[rgba(168,85,247,0.15)] text-gray-500 hover:text-[#a855f7]'}`}>
                      {parseInt(v) >= 1000 ? `${parseInt(v)/1000}K` : v}
                    </button>
                  ))}
                </div>
                <input value={betSlot2} onChange={e => setBetSlot2(e.target.value)} disabled={hasSlot2 || gameState === 'flying'}
                  placeholder="Сумма второй ставки"
                  className="cyber-input w-full px-3 py-2.5 text-sm rounded-sm font-mono-cyber mb-2"
                  style={{ borderColor: 'rgba(168,85,247,0.2)', color: '#a855f7' }} />

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-cyber text-xs text-gray-600 shrink-0">Авто:</span>
                  <input value={autoCashout2} onChange={e => setAutoCashout2(e.target.value)}
                    placeholder="5.00x" disabled={hasSlot2 || gameState === 'flying'}
                    className="cyber-input flex-1 px-3 py-2 text-xs rounded-sm font-mono-cyber disabled:opacity-40"
                    style={{ borderColor: 'rgba(168,85,247,0.2)', color: '#a855f7' }} />
                </div>

                {gameState === 'waiting' && !hasSlot2 && (
                  <button onClick={handleSlot2Bet} disabled={!betSlot2}
                    className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: 'white', boxShadow: '0 0 20px rgba(168,85,247,0.2)' }}>
                    ПОСТАВИТЬ ВТОРУЮ
                  </button>
                )}
                {gameState === 'waiting' && hasSlot2 && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-[#a855f7]/40 text-[#a855f7]">
                    ✓ СТАВКА ₽{parseFloat(betSlot2).toLocaleString()} ПРИНЯТА
                  </div>
                )}
                {gameState === 'flying' && hasSlot2 && (
                  <button
                    className="w-full py-3 font-cyber text-sm tracking-widest rounded-sm transition-all"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: 'white' }}>
                    ЗАБРАТЬ ₽{Math.floor(parseFloat(betSlot2 || '0') * multiplier).toLocaleString('ru-RU')}
                  </button>
                )}
                {gameState === 'flying' && !hasSlot2 && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-gray-800 text-gray-700">
                    РАУНД ИДЁТ...
                  </div>
                )}
                {gameState === 'crashed' && (
                  <div className="w-full py-3 font-cyber text-xs tracking-widest rounded-sm text-center border border-[rgba(168,85,247,0.2)] text-gray-700">
                    —
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Live bets */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(56,189,248,0.15)', maxHeight: 320, overflowY: 'auto' }}>
              <div className="font-cyber text-xs text-[#38bdf8] tracking-widest mb-3">
                // СТАВКИ В РАУНДЕ
                <span className="ml-2 text-gray-600 font-mono-cyber normal-case tracking-normal">({players.length})</span>
              </div>
              <div className="space-y-1.5">
                {players.map((p, i) => (
                  <div key={i} className={`flex items-center gap-2 py-1.5 px-2 rounded-sm transition-all
                    ${p.user === 'CyberWolf88' ? 'bg-[#38bdf8]/5 border border-[rgba(56,189,248,0.1)]' : ''}`}>
                    <span className="text-base">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-cyber text-xs truncate ${p.user === 'CyberWolf88' ? 'text-[#38bdf8]' : 'text-gray-400'}`}>
                        {p.user}
                      </div>
                      <div className="font-mono-cyber text-[10px] text-gray-600">₽{p.bet.toLocaleString()}</div>
                    </div>
                    {p.cashedOut ? (
                      <div className="font-cyber text-[10px] px-1.5 py-0.5 rounded-sm shrink-0"
                        style={{ background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.2)', color: '#00ff9f' }}>
                        {p.cashout?.toFixed(2)}x
                      </div>
                    ) : gameState === 'flying' ? (
                      <div className="font-mono-cyber text-xs shrink-0" style={{ color: multColor }}>
                        {multiplier.toFixed(2)}x
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-glow-pulse shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard today */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(56,189,248,0.1)' }}>
              <div className="font-cyber text-xs text-[#ffd600] tracking-widest mb-3">// ТОП СЕГОДНЯ</div>
              <div className="space-y-2">
                {[
                  { user: 'GalaxyX', avatar: '🌌', win: '₽48,000', mult: '34.5x' },
                  { user: 'NightHawk', avatar: '🦅', win: '₽22,500', mult: '12.3x' },
                  { user: 'CyberWolf88', avatar: '🐺', win: '₽15,200', mult: '7.6x' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-cyber text-xs" style={{ color: ['#ffd600', '#c0c0c0', '#cd7f32'][i] }}>
                      {['🥇', '🥈', '🥉'][i]}
                    </span>
                    <span className="text-base">{p.avatar}</span>
                    <div className="flex-1">
                      <div className="font-cyber text-xs text-gray-300">{p.user}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-cyber text-xs text-[#00ff9f]">{p.win}</div>
                      <div className="font-mono-cyber text-[10px] text-gray-600">{p.mult}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My stats */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(56,189,248,0.08)' }}>
              <div className="font-cyber text-xs text-[#38bdf8] tracking-widest mb-3">// МОЯ СТАТИСТИКА</div>
              <div className="space-y-2">
                {[
                  { label: 'Рекорд', value: '34.5x', color: '#ffd600' },
                  { label: 'Выиграл сегодня', value: '₽15,200', color: '#00ff9f' },
                  { label: 'Раундов', value: '312', color: '#38bdf8' },
                  { label: 'Win rate', value: '58%', color: '#a855f7' },
                  { label: 'Средний выход', value: '2.4x', color: '#00f5ff' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{s.label}</span>
                    <span className="font-mono-cyber text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(56,189,248,0.07)' }}>
              <div className="font-cyber text-xs text-[#38bdf8] tracking-widest mb-3">// КАК ИГРАТЬ</div>
              <div className="space-y-1.5">
                {[
                  'Поставь до взлёта самолёта',
                  'Множитель растёт со временем',
                  'Нажми «Забрать» до крэша',
                  'Можно поставить 2 ставки сразу',
                  'Авто-вывод — укажи нужный x',
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-[#38bdf8] rounded-full mt-1.5 shrink-0" />
                    <span className="text-gray-600 text-xs leading-relaxed">{r}</span>
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
