import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

// Wheel segments definition
interface Segment {
  label: string;
  color: string;
  bg: string;
  count: number; // how many times appears on wheel
  multiplier?: number;
  isBonus?: boolean;
  emoji: string;
}

const SEGMENTS: Segment[] = [
  { label: '1',          color: '#ffffff', bg: '#1a3a5c', count: 21, multiplier: 1,   emoji: '1️⃣' },
  { label: '2',          color: '#ffffff', bg: '#1a5c2a', count: 13, multiplier: 2,   emoji: '2️⃣' },
  { label: '5',          color: '#ffffff', bg: '#5c1a1a', count: 7,  multiplier: 5,   emoji: '5️⃣' },
  { label: '10',         color: '#ffffff', bg: '#4a1a5c', count: 4,  multiplier: 10,  emoji: '🔟' },
  { label: 'COIN FLIP',  color: '#050810', bg: '#f59e0b', count: 4,  isBonus: true,   emoji: '🪙' },
  { label: 'PACHINKO',   color: '#050810', bg: '#ec4899', count: 2,  isBonus: true,   emoji: '🎯' },
  { label: 'CASH HUNT',  color: '#050810', bg: '#10b981', count: 2,  isBonus: true,   emoji: '🎯' },
  { label: 'CRAZY TIME', color: '#050810', bg: '#f59e0b', count: 1,  isBonus: true,   emoji: '🎪' },
];

// Expand into full 54-slot wheel
const WHEEL_SLOTS: Segment[] = [];
SEGMENTS.forEach(seg => {
  for (let i = 0; i < seg.count; i++) WHEEL_SLOTS.push(seg);
});
// Shuffle deterministically for display
const SHUFFLED_SLOTS = [...WHEEL_SLOTS].sort((_, __, i = Math.random()) => i - 0.5);

const TOTAL_SLOTS = WHEEL_SLOTS.length; // 54

type GamePhase = 'betting' | 'spinning' | 'result' | 'bonus';
type BonusGame = 'coinflip' | 'pachinko' | 'cashhunt' | 'crazytime' | null;

const HISTORY_RESULTS = [
  { label: '1', bg: '#1a3a5c', emoji: '1️⃣' },
  { label: 'CRAZY TIME', bg: '#f59e0b', emoji: '🎪' },
  { label: '2', bg: '#1a5c2a', emoji: '2️⃣' },
  { label: 'COIN FLIP', bg: '#f59e0b', emoji: '🪙' },
  { label: '5', bg: '#5c1a1a', emoji: '5️⃣' },
  { label: '10', bg: '#4a1a5c', emoji: '🔟' },
  { label: '1', bg: '#1a3a5c', emoji: '1️⃣' },
  { label: '2', bg: '#1a5c2a', emoji: '2️⃣' },
];

const LIVE_BETS = [
  { user: 'GalaxyX', avatar: '🌌', bets: { '1': 500, 'COIN FLIP': 200 } },
  { user: 'NightHawk', avatar: '🦅', bets: { '2': 1000 } },
  { user: 'CyberWolf88', avatar: '🐺', bets: {} },
  { user: 'NeonRider', avatar: '🏍️', bets: { '5': 300, 'CRAZY TIME': 100 } },
  { user: 'PhantomP', avatar: '👻', bets: { '10': 2000 } },
];

// Coin Flip bonus game component
function CoinFlipBonus({ onClose, bet }: { onClose: (win: number) => void; bet: number }) {
  const [side, setSide] = useState<'red' | 'blue' | null>(null);
  const [chosen, setChosen] = useState<'red' | 'blue' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [redMult] = useState(Math.floor(Math.random() * 8) + 2);
  const [blueMult] = useState(Math.floor(Math.random() * 15) + 3);

  const flip = (choice: 'red' | 'blue') => {
    if (flipping || side) return;
    setChosen(choice);
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'red' : 'blue';
      setSide(result);
      setFlipping(false);
      const mult = result === 'red' ? redMult : blueMult;
      const win = choice === result ? bet * mult : 0;
      setTimeout(() => onClose(win), 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/95 backdrop-blur-md">
      <div className="cyber-card rounded-sm p-8 max-w-sm w-full mx-4 text-center"
        style={{ border: '1px solid rgba(245,158,11,0.4)', boxShadow: '0 0 60px rgba(245,158,11,0.2)' }}>
        <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-2">// БОНУС ИГРА</div>
        <h2 className="font-cyber text-2xl text-white mb-6">COIN FLIP</h2>

        {/* Coin */}
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className={`w-full h-full rounded-full flex items-center justify-center text-5xl border-4 transition-all duration-300
            ${flipping ? 'animate-spin-slow' : ''}
            ${side === 'red' ? 'bg-red-500/20 border-red-500' : side === 'blue' ? 'bg-blue-500/20 border-blue-500' : 'bg-[#0a0f1a] border-[#f59e0b]'}`}>
            {!side ? '🪙' : side === 'red' ? '🔴' : '🔵'}
          </div>
          {flipping && (
            <div className="absolute inset-0 rounded-full border-4 border-[#f59e0b] animate-ping opacity-30" />
          )}
        </div>

        {!side && !flipping && (
          <>
            <p className="text-gray-400 text-sm mb-6">Выбери сторону монеты</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => flip('red')}
                className="py-4 rounded-sm font-cyber text-sm font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: 'white', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}>
                🔴 КРАСНАЯ<br />
                <span className="font-mono-cyber text-xl">{redMult}x</span>
              </button>
              <button onClick={() => flip('blue')}
                className="py-4 rounded-sm font-cyber text-sm font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                🔵 СИНЯЯ<br />
                <span className="font-mono-cyber text-xl">{blueMult}x</span>
              </button>
            </div>
          </>
        )}

        {flipping && (
          <div className="font-cyber text-[#f59e0b] text-lg tracking-widest animate-neon-flicker">БРОСАЕМ...</div>
        )}

        {side && !flipping && (
          <div className="animate-fade-in">
            <div className={`font-cyber text-2xl mb-2 ${side === chosen ? 'text-[#00ff9f]' : 'text-[#ff006e]'}`}>
              {side === chosen ? '🎉 ВЫИГРЫШ!' : '💸 ПРОИГРЫШ'}
            </div>
            <div className="font-mono-cyber text-sm text-gray-400">
              Выпало: {side === 'red' ? '🔴 Красная' : '🔵 Синяя'} ({side === 'red' ? redMult : blueMult}x)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Cash Hunt bonus game component
function CashHuntBonus({ onClose, bet }: { onClose: (win: number) => void; bet: number }) {
  const SIZE = 7;
  const TOTAL = SIZE * SIZE;
  const [revealed, setRevealed] = useState<number | null>(null);
  const [multipliers] = useState(() => {
    const mults = Array.from({ length: TOTAL }, () =>
      [2,3,5,7,10,15,20,25,30,50,75,100][Math.floor(Math.random() * 12)]
    );
    return mults;
  });
  const symbols = ['🦁','🐯','🦊','🐻','🦝','🦜','🦩','🐬','🦋','🌟','💎','🔮','🎭','🃏','🎲'];

  const pick = (i: number) => {
    if (revealed !== null) return;
    setRevealed(i);
    const win = bet * multipliers[i];
    setTimeout(() => onClose(win), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/95 backdrop-blur-md">
      <div className="cyber-card rounded-sm p-6 max-w-lg w-full mx-4"
        style={{ border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 0 60px rgba(16,185,129,0.15)' }}>
        <div className="text-center mb-4">
          <div className="font-cyber text-xs text-[#10b981] tracking-widest mb-1">// БОНУС ИГРА</div>
          <h2 className="font-cyber text-xl text-white">CASH HUNT</h2>
          <p className="text-gray-500 text-sm mt-1">{revealed === null ? 'Выбери символ — за ним скрыт множитель!' : `Множитель: ${multipliers[revealed]}x`}</p>
        </div>

        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => pick(i)} disabled={revealed !== null}
              className={`aspect-square rounded-sm flex items-center justify-center text-xl transition-all duration-300
                ${revealed === i ? 'scale-110' : revealed === null ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-default'}`}
              style={{
                background: revealed === i ? 'rgba(16,185,129,0.2)' : 'rgba(10,15,26,0.8)',
                border: revealed === i ? '2px solid #10b981' : '1px solid rgba(16,185,129,0.1)',
                boxShadow: revealed === i ? '0 0 20px rgba(16,185,129,0.4)' : 'none',
              }}>
              {revealed === i
                ? <span className="font-mono-cyber text-sm font-bold text-[#10b981]">{multipliers[i]}x</span>
                : <span>{symbols[i % symbols.length]}</span>
              }
            </button>
          ))}
        </div>

        {revealed !== null && (
          <div className="text-center animate-fade-in">
            <div className="font-cyber text-[#10b981] text-lg">🎉 ТЫ ВЫБРАЛ {multipliers[revealed]}x!</div>
            <div className="font-mono-cyber text-sm text-gray-400 mt-1">Выигрыш: ₽{(bet * multipliers[revealed]).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pachinko bonus
function PachinkoBonus({ onClose, bet }: { onClose: (win: number) => void; bet: number }) {
  const SLOTS = [2,5,10,20,50,100,2,5,2,10,25,2,5,10,2];
  const [ballPos, setBallPos] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);

  const drop = () => {
    if (dropping || landed !== null) return;
    setDropping(true);
    const pos = Math.floor(Math.random() * SLOTS.length);
    let steps = 20;
    const interval = setInterval(() => {
      setBallPos(Math.floor(Math.random() * SLOTS.length));
      steps--;
      if (steps <= 0) {
        clearInterval(interval);
        setBallPos(pos);
        setLanded(pos);
        setDropping(false);
        setTimeout(() => onClose(bet * SLOTS[pos]), 2000);
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/95 backdrop-blur-md">
      <div className="cyber-card rounded-sm p-6 max-w-md w-full mx-4 text-center"
        style={{ border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 0 60px rgba(236,72,153,0.15)' }}>
        <div className="font-cyber text-xs text-[#ec4899] tracking-widest mb-1">// БОНУС ИГРА</div>
        <h2 className="font-cyber text-xl text-white mb-6">PACHINKO</h2>

        {/* Ball */}
        <div className="relative h-16 mb-4">
          {ballPos !== null && (
            <div className="absolute top-0 text-2xl transition-all duration-75"
              style={{ left: `${(ballPos / (SLOTS.length - 1)) * 90}%` }}>
              🔮
            </div>
          )}
        </div>

        {/* Pegs */}
        <div className="flex justify-around mb-6 px-2">
          {['•','•','•','•','•','•','•','•'].map((p, i) => (
            <span key={i} className="text-[#ec4899]/40 text-lg">•</span>
          ))}
        </div>

        {/* Slots */}
        <div className="flex gap-1 mb-6">
          {SLOTS.map((mult, i) => (
            <div key={i} className={`flex-1 py-2 rounded-sm font-mono-cyber text-xs font-bold transition-all
              ${landed === i ? 'scale-110' : ''}`}
              style={{
                background: landed === i ? 'rgba(236,72,153,0.3)' : i === ballPos && dropping ? 'rgba(236,72,153,0.1)' : 'rgba(10,15,26,0.8)',
                border: `1px solid ${landed === i ? '#ec4899' : 'rgba(236,72,153,0.1)'}`,
                color: landed === i ? '#ec4899' : '#6b7280',
                boxShadow: landed === i ? '0 0 15px rgba(236,72,153,0.5)' : 'none',
              }}>
              {mult}x
            </div>
          ))}
        </div>

        {!dropping && landed === null && (
          <button onClick={drop}
            className="px-8 py-3 font-cyber text-sm tracking-widest rounded-sm"
            style={{ background: 'linear-gradient(135deg, #ec4899, #9d174d)', color: 'white', boxShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
            БРОСИТЬ ШАР
          </button>
        )}
        {dropping && (
          <div className="font-cyber text-[#ec4899] animate-neon-flicker tracking-widest">ПАДАЕТ...</div>
        )}
        {landed !== null && (
          <div className="animate-fade-in">
            <div className="font-cyber text-[#ec4899] text-lg mb-1">🎯 {SLOTS[landed]}x!</div>
            <div className="font-mono-cyber text-sm text-gray-400">Выигрыш: ₽{(bet * SLOTS[landed]).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Crazy Time top slot bonus
function CrazyTimeBonus({ onClose, bet }: { onClose: (win: number) => void; bet: number }) {
  const slots = [20,40,2,15,100,5,25,50,10,200,5,25];
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const spin = () => {
    if (spinning || result !== null) return;
    setSpinning(true);
    const finalIdx = Math.floor(Math.random() * slots.length);
    const totalDeg = 360 * 5 + (finalIdx / slots.length) * 360;
    setOffset(totalDeg);
    setTimeout(() => {
      setResult(slots[finalIdx]);
      setSpinning(false);
      setTimeout(() => onClose(bet * slots[finalIdx]), 2500);
    }, 3000);
  };

  const segAngle = 360 / slots.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]/95 backdrop-blur-md">
      <div className="cyber-card rounded-sm p-8 max-w-sm w-full mx-4 text-center"
        style={{ border: '1px solid rgba(245,158,11,0.5)', boxShadow: '0 0 80px rgba(245,158,11,0.25)' }}>
        <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-1">// ДЖЕКПОТ ИГРА</div>
        <h2 className="font-cyber text-2xl text-white mb-6">🎪 CRAZY TIME!</h2>

        {/* Wheel */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#f59e0b]/40"
            style={{ background: 'conic-gradient(from 0deg, #7c3aed, #ec4899, #f59e0b, #10b981, #3b82f6, #ef4444, #7c3aed, #ec4899, #f59e0b, #10b981, #3b82f6, #ef4444)',
              transform: `rotate(${offset}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.35, 1)' : 'none' }} />
          <div className="absolute inset-4 rounded-full bg-[#050810] flex items-center justify-center z-10">
            <div className="font-mono-cyber font-black text-2xl text-[#f59e0b]">
              {result ? `${result}x` : '?'}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20">▼</div>
        </div>

        {/* Multipliers preview */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {slots.map((s, i) => (
            <div key={i} className={`px-2 py-0.5 rounded-sm font-mono-cyber text-xs font-bold
              ${result === s ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]' : 'border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.03)] text-gray-600'}`}
              style={{ border: `1px solid ${result === s ? '#f59e0b' : 'rgba(245,158,11,0.1)'}` }}>
              {s}x
            </div>
          ))}
        </div>

        {!spinning && result === null && (
          <button onClick={spin}
            className="px-8 py-4 font-cyber text-sm tracking-widest rounded-sm animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#050810', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
            🎪 КРУТИТЬ!
          </button>
        )}
        {spinning && (
          <div className="font-cyber text-[#f59e0b] text-lg animate-neon-flicker tracking-widest">КРУТИТСЯ...</div>
        )}
        {result !== null && (
          <div className="animate-fade-in">
            <div className="font-cyber text-[#f59e0b] text-2xl mb-2">🎉 {result}x!</div>
            <div className="font-mono-cyber text-lg text-white">+₽{(bet * result).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CrazyTimePage() {
  const [phase, setPhase] = useState<GamePhase>('betting');
  const [bets, setBets] = useState<Record<string, number>>({});
  const [balance, setBalance] = useState(28400);
  const [selectedChip, setSelectedChip] = useState(100);
  const [countdown, setCountdown] = useState(10);
  const [spinAngle, setSpinAngle] = useState(0);
  const [result, setResult] = useState<Segment | null>(null);
  const [bonusGame, setBonusGame] = useState<BonusGame>(null);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const CHIPS = [50, 100, 500, 1000, 5000];

  const totalBet = Object.values(bets).reduce((s, v) => s + v, 0);

  const placeBet = (label: string) => {
    if (phase !== 'betting') return;
    if (balance < selectedChip) return;
    setBalance(prev => prev - selectedChip);
    setBets(prev => ({ ...prev, [label]: (prev[label] || 0) + selectedChip }));
  };

  const clearBets = () => {
    if (phase !== 'betting') return;
    setBalance(prev => prev + totalBet);
    setBets({});
  };

  const startSpin = useCallback(() => {
    setPhase('spinning');
    setSpinning(true);
    setWonAmount(null);

    // Pick random segment
    const idx = Math.floor(Math.random() * WHEEL_SLOTS.length);
    const winner = WHEEL_SLOTS[idx];

    // Spin wheel
    const slotAngle = 360 / TOTAL_SLOTS;
    const targetAngle = 360 * 8 + idx * slotAngle;
    setSpinAngle(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult(winner);
      setPhase('result');

      if (winner.isBonus) {
        setTimeout(() => {
          if (winner.label === 'COIN FLIP') setBonusGame('coinflip');
          else if (winner.label === 'PACHINKO') setBonusGame('pachinko');
          else if (winner.label === 'CASH HUNT') setBonusGame('cashhunt');
          else if (winner.label === 'CRAZY TIME') setBonusGame('crazytime');
        }, 1500);
      } else {
        // Pay out
        const betOnWinner = bets[winner.label] || 0;
        if (betOnWinner > 0) {
          const win = betOnWinner * (winner.multiplier || 1);
          setBalance(prev => prev + win);
          setWonAmount(win);
        }
        setTimeout(() => resetRound(), 4000);
      }
    }, 5000);
  }, [bets]);

  const resetRound = () => {
    setPhase('betting');
    setBets({});
    setResult(null);
    setBonusGame(null);
    setWonAmount(null);
    setSpinAngle(prev => prev % 360);
    let c = 10;
    setCountdown(c);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startSpin();
      }
    }, 1000);
  };

  const handleBonusClose = (win: number) => {
    setBonusGame(null);
    if (win > 0) {
      setBalance(prev => prev + win);
      setWonAmount(win);
    }
    setTimeout(() => resetRound(), 3000);
  };

  useEffect(() => {
    let c = 10;
    setCountdown(c);
    countdownRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startSpin();
      }
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  // Betting board segments
  const BOARD_SEGMENTS = [
    { label: '1', color: '#1a3a5c', textColor: '#fff', prob: '38.9%', multiplier: '1x', emoji: '1️⃣' },
    { label: '2', color: '#1a5c2a', textColor: '#fff', prob: '24.1%', multiplier: '2x', emoji: '2️⃣' },
    { label: '5', color: '#5c1a1a', textColor: '#fff', prob: '13.0%', multiplier: '5x', emoji: '5️⃣' },
    { label: '10', color: '#4a1a5c', textColor: '#fff', prob: '7.4%', multiplier: '10x', emoji: '🔟' },
    { label: 'COIN FLIP', color: '#92400e', textColor: '#fef3c7', prob: '7.4%', multiplier: 'BONUS', emoji: '🪙' },
    { label: 'PACHINKO', color: '#831843', textColor: '#fce7f3', prob: '3.7%', multiplier: 'BONUS', emoji: '🎯' },
    { label: 'CASH HUNT', color: '#065f46', textColor: '#d1fae5', prob: '3.7%', multiplier: 'BONUS', emoji: '💰' },
    { label: 'CRAZY TIME', color: '#78350f', textColor: '#fef3c7', prob: '1.9%', multiplier: 'JACKPOT', emoji: '🎪' },
  ];

  const slotDeg = 360 / TOTAL_SLOTS;

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Bonus game overlays */}
      {bonusGame === 'coinflip' && <CoinFlipBonus bet={bets['COIN FLIP'] || totalBet || 100} onClose={handleBonusClose} />}
      {bonusGame === 'pachinko' && <PachinkoBonus bet={bets['PACHINKO'] || totalBet || 100} onClose={handleBonusClose} />}
      {bonusGame === 'cashhunt' && <CashHuntBonus bet={bets['CASH HUNT'] || totalBet || 100} onClose={handleBonusClose} />}
      {bonusGame === 'crazytime' && <CrazyTimeBonus bet={bets['CRAZY TIME'] || totalBet || 100} onClose={handleBonusClose} />}

      {/* Header */}
      <div className="border-b border-[rgba(245,158,11,0.25)] bg-[#020408]/80 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link to="/games" className="text-gray-500 hover:text-[#f59e0b] transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎪</span>
                <h1 className="font-cyber text-xl font-black text-white">CRAZY TIME</h1>
                <span className="badge-hot">HOT</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={12} className="text-[#ffd600]" />
                  <span className="font-mono-cyber text-xs text-[#ffd600]">5.0</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono-cyber text-xs text-gray-500">NEXUS Originals</span>
                <span className="font-mono-cyber text-xs text-[#f59e0b]">RTP 96.8%</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-glow-pulse" />
                  <span className="font-mono-cyber text-xs text-[#00ff9f]">8,740 онлайн</span>
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

      {/* History */}
      <div className="border-b border-[rgba(245,158,11,0.1)] bg-[#020408]/40">
        <div className="container mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <span className="font-cyber text-[10px] text-gray-600 tracking-widest shrink-0">ИСТОРИЯ:</span>
          {HISTORY_RESULTS.map((h, i) => (
            <div key={i} className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-sm font-cyber text-xs"
              style={{ background: `${h.bg}30`, border: `1px solid ${h.bg}60`, color: '#fff' }}>
              {h.emoji} {h.label}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Left: Wheel */}
          <div className="xl:col-span-1">
            <div className="cyber-card rounded-sm p-4 text-center"
              style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-4">// КОЛЕСО ФОРТУНЫ</div>

              {/* Wheel SVG */}
              <div className="relative w-56 h-56 mx-auto mb-4">
                {/* Arrow */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-2xl"
                  style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }}>▼</div>

                <svg viewBox="0 0 200 200" className="w-full h-full"
                  style={{ transform: `rotate(${spinAngle}deg)`, transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none' }}>
                  {BOARD_SEGMENTS.map((seg, si) => {
                    const countForSeg = WHEEL_SLOTS.filter(s => s.label === seg.label).length;
                    const anglePerSlot = 360 / TOTAL_SLOTS;
                    const totalAngle = countForSeg * anglePerSlot;
                    // position evenly distributed
                    const startAngle = BOARD_SEGMENTS.slice(0, si).reduce((acc, s) => {
                      return acc + WHEEL_SLOTS.filter(w => w.label === s.label).length * anglePerSlot;
                    }, -90);
                    const endAngle = startAngle + totalAngle;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = 100 + 95 * Math.cos(startRad);
                    const y1 = 100 + 95 * Math.sin(startRad);
                    const x2 = 100 + 95 * Math.cos(endRad);
                    const y2 = 100 + 95 * Math.sin(endRad);
                    const large = totalAngle > 180 ? 1 : 0;
                    const midRad = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                    const tx = 100 + 68 * Math.cos(midRad);
                    const ty = 100 + 68 * Math.sin(midRad);
                    return (
                      <g key={seg.label}>
                        <path d={`M100,100 L${x1},${y1} A95,95 0 ${large},1 ${x2},${y2} Z`}
                          fill={seg.color} stroke="#050810" strokeWidth="1" />
                        <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                          fontSize={totalAngle > 30 ? "9" : "7"} fill={seg.textColor} fontFamily="Orbitron"
                          fontWeight="bold" transform={`rotate(${(startAngle + endAngle) / 2 + 90}, ${tx}, ${ty})`}>
                          {seg.label.length > 5 ? seg.emoji : seg.label}
                        </text>
                      </g>
                    );
                  })}
                  {/* Center */}
                  <circle cx="100" cy="100" r="15" fill="#050810" stroke="#f59e0b" strokeWidth="2" />
                  <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#f59e0b">★</text>
                </svg>

                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: spinning ? '0 0 40px rgba(245,158,11,0.3)' : '0 0 20px rgba(245,158,11,0.1)', transition: 'box-shadow 0.5s' }} />
              </div>

              {/* State display */}
              {phase === 'betting' && (
                <div>
                  <div className="font-cyber text-gray-500 text-xs tracking-widest mb-1">СТАВКИ ПРИНИМАЮТСЯ</div>
                  <div className="font-mono-cyber text-5xl font-black text-white">{countdown}</div>
                  <div className="font-cyber text-gray-600 text-xs">СЕКУНД</div>
                </div>
              )}
              {phase === 'spinning' && (
                <div className="animate-neon-flicker">
                  <div className="font-cyber text-[#f59e0b] text-sm tracking-widest">КРУТИТСЯ!</div>
                </div>
              )}
              {phase === 'result' && result && (
                <div className="animate-fade-in">
                  <div className="font-cyber text-xs text-gray-500 tracking-widest mb-1">РЕЗУЛЬТАТ</div>
                  <div className="font-cyber text-2xl font-black mb-1" style={{ color: result.bg }}>
                    {result.emoji} {result.label}
                  </div>
                  {wonAmount !== null && (
                    <div className="font-mono-cyber text-xl text-[#00ff9f] font-bold">+₽{wonAmount.toLocaleString()}</div>
                  )}
                  {result.isBonus && (
                    <div className="font-cyber text-xs text-[#f59e0b] animate-neon-flicker mt-1">БОНУС ИГРА!</div>
                  )}
                </div>
              )}

              {/* Spin button */}
              {phase === 'betting' && (
                <button onClick={() => { if (countdownRef.current) clearInterval(countdownRef.current); startSpin(); }}
                  className="mt-4 px-6 py-2.5 font-cyber text-xs tracking-widest rounded-sm transition-all"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#050810' }}>
                  КРУТИТЬ СЕЙЧАС
                </button>
              )}
            </div>

            {/* Live players */}
            <div className="cyber-card rounded-sm p-4 mt-4" style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
              <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-3">// ИГРОКИ</div>
              <div className="space-y-2">
                {LIVE_BETS.map((p, i) => (
                  <div key={i} className={`flex items-center gap-2 py-1.5 px-2 rounded-sm ${p.user === 'CyberWolf88' ? 'bg-[#f59e0b]/5 border border-[rgba(245,158,11,0.1)]' : ''}`}>
                    <span>{p.avatar}</span>
                    <div className="flex-1">
                      <div className={`font-cyber text-xs ${p.user === 'CyberWolf88' ? 'text-[#f59e0b]' : 'text-gray-400'}`}>{p.user}</div>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {Object.entries(p.bets).map(([label, amount]) => (
                        <span key={label} className="font-mono-cyber text-[10px] px-1.5 py-0.5 rounded-sm"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                          {label} ₽{amount}
                        </span>
                      ))}
                      {Object.keys(p.bets).length === 0 && (
                        <span className="text-gray-700 text-xs font-mono-cyber">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Betting board + chips */}
          <div className="xl:col-span-2 space-y-4">
            {/* Chip selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-cyber text-xs text-gray-500 tracking-widest">ФИШКА:</span>
              {CHIPS.map(chip => (
                <button key={chip} onClick={() => setSelectedChip(chip)}
                  className={`w-12 h-12 rounded-full font-cyber text-xs font-bold border-2 transition-all hover:scale-110
                    ${selectedChip === chip ? 'scale-110' : ''}`}
                  style={{
                    background: selectedChip === chip
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'rgba(10,15,26,0.8)',
                    borderColor: selectedChip === chip ? '#f59e0b' : 'rgba(245,158,11,0.2)',
                    color: selectedChip === chip ? '#050810' : '#f59e0b',
                    boxShadow: selectedChip === chip ? '0 0 15px rgba(245,158,11,0.4)' : 'none',
                  }}>
                  {chip >= 1000 ? `${chip/1000}K` : chip}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-3">
                <span className="font-mono-cyber text-sm text-gray-500">
                  Ставка: <span className="text-[#f59e0b] font-bold">₽{totalBet.toLocaleString()}</span>
                </span>
                {totalBet > 0 && phase === 'betting' && (
                  <button onClick={clearBets}
                    className="px-3 py-1.5 font-cyber text-xs border border-[rgba(255,0,110,0.3)] text-[#ff006e] rounded-sm hover:bg-[#ff006e]/10 transition-all">
                    СБРОСИТЬ
                  </button>
                )}
              </div>
            </div>

            {/* Betting Board */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BOARD_SEGMENTS.map(seg => {
                const myBet = bets[seg.label] || 0;
                const isResult = result?.label === seg.label;
                return (
                  <button key={seg.label} onClick={() => placeBet(seg.label)}
                    disabled={phase !== 'betting'}
                    className={`relative rounded-sm p-4 text-left transition-all duration-200 overflow-hidden
                      ${phase === 'betting' ? 'hover:scale-[1.03] cursor-pointer' : 'cursor-default'}
                      ${isResult ? 'scale-105' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${seg.color}dd, ${seg.color}88)`,
                      border: `2px solid ${isResult ? '#ffd600' : myBet > 0 ? '#00f5ff' : `${seg.color}60`}`,
                      boxShadow: isResult ? '0 0 30px rgba(255,214,0,0.5)' : myBet > 0 ? '0 0 15px rgba(0,245,255,0.2)' : 'none',
                    }}>

                    {/* Result flash */}
                    {isResult && (
                      <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(255,214,0,0.15)' }} />
                    )}

                    <div className="relative">
                      <div className="text-2xl mb-1">{seg.emoji}</div>
                      <div className="font-cyber text-sm font-black" style={{ color: seg.textColor }}>{seg.label}</div>
                      <div className="font-mono-cyber text-xs mt-0.5"
                        style={{ color: seg.multiplier === 'BONUS' ? '#fde68a' : seg.multiplier === 'JACKPOT' ? '#ffd600' : 'rgba(255,255,255,0.6)' }}>
                        {seg.multiplier}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        вероятность {seg.prob}
                      </div>

                      {/* My bet badge */}
                      {myBet > 0 && (
                        <div className="absolute -top-2 -right-2 bg-[#00f5ff] text-[#050810] font-cyber text-[10px] px-1.5 py-0.5 rounded-sm font-bold">
                          ₽{myBet.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info & stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* How to play */}
              <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(245,158,11,0.1)' }}>
                <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-3">// КАК ИГРАТЬ</div>
                <div className="space-y-2">
                  {[
                    { step: '1', text: 'Выбери фишку и кликай на сектор для ставки' },
                    { step: '2', text: 'Колесо крутится — жди результата' },
                    { step: '3', text: 'Попал на число — получи ставку × множитель' },
                    { step: '4', text: 'Попал на бонус — играй в особую игру!' },
                  ].map(s => (
                    <div key={s.step} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-[#f59e0b] text-[#050810] rounded-sm flex items-center justify-center font-cyber text-[10px] font-bold shrink-0 mt-0.5">
                        {s.step}
                      </div>
                      <span className="text-gray-500 text-xs leading-relaxed">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus games */}
              <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(245,158,11,0.1)' }}>
                <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-3">// БОНУС ИГРЫ</div>
                <div className="space-y-2">
                  {[
                    { emoji: '🪙', name: 'Coin Flip', desc: 'Выбери красную или синюю сторону' },
                    { emoji: '🎯', name: 'Pachinko', desc: 'Брось шар и получи множитель' },
                    { emoji: '💰', name: 'Cash Hunt', desc: 'Выбери символ — найди множитель' },
                    { emoji: '🎪', name: 'Crazy Time', desc: 'Гигантское колесо с множителями до 200x' },
                  ].map(b => (
                    <div key={b.name} className="flex items-center gap-2">
                      <span className="text-lg">{b.emoji}</span>
                      <div>
                        <div className="font-cyber text-xs text-white">{b.name}</div>
                        <div className="text-gray-600 text-[11px]">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My stats */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(245,158,11,0.08)' }}>
              <div className="font-cyber text-xs text-[#f59e0b] tracking-widest mb-3">// МОЯ СТАТИСТИКА</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Выиграно сегодня', value: '₽32,500', color: '#00ff9f' },
                  { label: 'Лучший бонус', value: 'Crazy Time 🎪', color: '#f59e0b' },
                  { label: 'Раундов', value: '218', color: '#38bdf8' },
                  { label: 'Win rate', value: '52%', color: '#a855f7' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-mono-cyber text-lg font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-600 text-xs">{s.label}</div>
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