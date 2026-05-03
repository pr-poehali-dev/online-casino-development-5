import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

type CellState = 'hidden' | 'apple' | 'bomb';
type GameState = 'betting' | 'playing' | 'won' | 'lost';

const GRID_SIZE = 5; // 5x5
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const DIFFICULTY = [
  { label: 'Легко', bombs: 3, multiplierStep: 0.15, color: '#22c55e' },
  { label: 'Средне', bombs: 8, multiplierStep: 0.32, color: '#ffd600' },
  { label: 'Сложно', bombs: 15, multiplierStep: 0.75, color: '#ff006e' },
  { label: 'Безумие', bombs: 20, multiplierStep: 1.8, color: '#a855f7' },
];

const LIVE_PLAYERS = [
  { user: 'NightHawk', avatar: '🦅', bet: 800, found: 4, mult: '1.80x', status: 'playing' },
  { user: 'GalaxyX', avatar: '🌌', bet: 5000, found: 7, mult: '3.24x', status: 'playing' },
  { user: 'NeonRider', avatar: '🏍️', bet: 200, found: 2, mult: '1.32x', status: 'cashout' },
  { user: 'PhantomP', avatar: '👻', bet: 1000, found: 0, mult: '—', status: 'lost' },
];

function generateGrid(bombCount: number): CellState[] {
  const grid: CellState[] = Array(TOTAL_CELLS).fill('apple');
  const bombPositions = new Set<number>();
  while (bombPositions.size < bombCount) {
    bombPositions.add(Math.floor(Math.random() * TOTAL_CELLS));
  }
  bombPositions.forEach(pos => { grid[pos] = 'bomb'; });
  return grid;
}

export default function AppleOfFortunePage() {
  const [gameState, setGameState] = useState<GameState>('betting');
  const [grid, setGrid] = useState<CellState[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(Array(TOTAL_CELLS).fill(false));
  const [difficultyIdx, setDifficultyIdx] = useState(0);
  const [bet, setBet] = useState('1000');
  const [balance, setBalance] = useState(28400);
  const [multiplier, setMultiplier] = useState(1.0);
  const [applesFound, setApplesFound] = useState(0);
  const [lastBomb, setLastBomb] = useState<number | null>(null);
  const [history, setHistory] = useState<{ mult: string; result: 'win' | 'loss'; amount: number }[]>([
    { mult: '3.24x', result: 'win', amount: 1620 },
    { mult: '1.00x', result: 'loss', amount: -500 },
    { mult: '5.10x', result: 'win', amount: 5100 },
    { mult: '1.48x', result: 'win', amount: 740 },
    { mult: '1.00x', result: 'loss', amount: -1000 },
  ]);

  const diff = DIFFICULTY[difficultyIdx];
  const applesTotal = TOTAL_CELLS - diff.bombs;

  const startGame = () => {
    const betNum = parseFloat(bet);
    if (!betNum || betNum <= 0 || betNum > balance) return;
    setBalance(prev => prev - betNum);
    setGrid(generateGrid(diff.bombs));
    setRevealed(Array(TOTAL_CELLS).fill(false));
    setMultiplier(1.0);
    setApplesFound(0);
    setLastBomb(null);
    setGameState('playing');
  };

  const handleCellClick = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    if (revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (grid[index] === 'bomb') {
      // Reveal all bombs
      const finalRevealed = grid.map((cell, i) => cell === 'bomb' ? true : newRevealed[i]);
      setRevealed(finalRevealed);
      setLastBomb(index);
      setGameState('lost');
      const betNum = parseFloat(bet);
      setHistory(prev => [{ mult: '1.00x', result: 'loss', amount: -betNum }, ...prev.slice(0, 9)]);
    } else {
      const newFound = applesFound + 1;
      setApplesFound(newFound);
      const newMult = parseFloat((1.0 + newFound * diff.multiplierStep).toFixed(2));
      setMultiplier(newMult);

      // Auto-win if found all apples
      if (newFound >= applesTotal) {
        setGameState('won');
        const betNum = parseFloat(bet);
        const won = parseFloat((betNum * newMult).toFixed(0));
        setBalance(prev => prev + won);
        setHistory(prev => [{ mult: `${newMult}x`, result: 'win', amount: won - betNum }, ...prev.slice(0, 9)]);
      }
    }
  }, [gameState, revealed, grid, applesFound, diff, bet, applesTotal]);

  const handleCashout = () => {
    if (gameState !== 'playing' || applesFound === 0) return;
    const betNum = parseFloat(bet);
    const won = parseFloat((betNum * multiplier).toFixed(0));
    setBalance(prev => prev + won);
    setHistory(prev => [{ mult: `${multiplier}x`, result: 'win', amount: won - betNum }, ...prev.slice(0, 9)]);
    setGameState('won');
    // reveal all
    setRevealed(Array(TOTAL_CELLS).fill(true));
  };

  const resetGame = () => {
    setGameState('betting');
    setGrid([]);
    setRevealed(Array(TOTAL_CELLS).fill(false));
    setMultiplier(1.0);
    setApplesFound(0);
    setLastBomb(null);
  };

  const currentWin = parseFloat((parseFloat(bet) * multiplier).toFixed(0));

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Header */}
      <div className="border-b border-[rgba(34,197,94,0.2)] bg-[#020408]/80 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/games" className="text-gray-500 hover:text-[#22c55e] transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍎</span>
                <h1 className="font-cyber text-xl font-black text-white">APPLE OF FORTUNE</h1>
                <span className="badge-new">NEW</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono-cyber text-xs text-gray-500">NEXUS Originals</span>
                <span className="font-mono-cyber text-xs text-[#22c55e]">RTP 98.0%</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-glow-pulse" />
                  <span className="font-mono-cyber text-xs text-[#00ff9f]">2,940 онлайн</span>
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Left: controls */}
          <div className="xl:col-span-1 space-y-4">
            {/* Bet */}
            <div className="cyber-card rounded-sm p-5" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// СТАВКА</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['500', '1000', '5000', '10000'].map(v => (
                  <button key={v} onClick={() => setBet(v)} disabled={gameState === 'playing'}
                    className={`py-2 font-cyber text-xs rounded-sm border transition-all
                      ${bet === v ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]' : 'border-[rgba(34,197,94,0.15)] text-gray-500 hover:text-[#22c55e] disabled:opacity-40'}`}>
                    ₽{parseInt(v) >= 1000 ? `${parseInt(v) / 1000}K` : v}
                  </button>
                ))}
              </div>
              <input value={bet} onChange={e => setBet(e.target.value)} disabled={gameState === 'playing'}
                className="cyber-input w-full px-3 py-3 text-sm rounded-sm font-mono-cyber mb-1"
                style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }} />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setBet(v => String(Math.floor(parseFloat(v) / 2)))} disabled={gameState === 'playing'}
                  className="flex-1 py-1.5 font-cyber text-xs border border-[rgba(34,197,94,0.15)] text-gray-500 rounded-sm hover:text-[#22c55e] transition-all disabled:opacity-40">
                  ½
                </button>
                <button onClick={() => setBet(v => String(Math.min(parseFloat(v) * 2, balance)))} disabled={gameState === 'playing'}
                  className="flex-1 py-1.5 font-cyber text-xs border border-[rgba(34,197,94,0.15)] text-gray-500 rounded-sm hover:text-[#22c55e] transition-all disabled:opacity-40">
                  ×2
                </button>
                <button onClick={() => setBet(String(balance))} disabled={gameState === 'playing'}
                  className="flex-1 py-1.5 font-cyber text-xs border border-[rgba(34,197,94,0.15)] text-gray-500 rounded-sm hover:text-[#22c55e] transition-all disabled:opacity-40">
                  MAX
                </button>
              </div>
            </div>

            {/* Difficulty */}
            <div className="cyber-card rounded-sm p-5" style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// СЛОЖНОСТЬ</div>
              <div className="space-y-2">
                {DIFFICULTY.map((d, i) => (
                  <button key={d.label} onClick={() => setDifficultyIdx(i)} disabled={gameState === 'playing'}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm border transition-all text-left disabled:opacity-40
                      ${difficultyIdx === i ? 'scale-[1.02]' : ''}`}
                    style={{
                      border: `1px solid ${difficultyIdx === i ? `${d.color}60` : 'rgba(255,255,255,0.05)'}`,
                      background: difficultyIdx === i ? `${d.color}10` : 'transparent',
                    }}>
                    <div>
                      <div className="font-cyber text-xs" style={{ color: difficultyIdx === i ? d.color : '#6b7280' }}>
                        {d.label}
                      </div>
                      <div className="text-gray-600 text-[10px] font-mono-cyber mt-0.5">
                        💣 {d.bombs} бомб
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-cyber text-xs" style={{ color: d.color }}>
                        +{(d.multiplierStep * 100).toFixed(0)}% за 🍎
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier / Cashout */}
            <div className="cyber-card rounded-sm p-5" style={{ border: `1px solid ${diff.color}30` }}>
              <div className="font-cyber text-xs text-gray-500 tracking-widest mb-3">// ТЕКУЩИЙ ВЫИГРЫШ</div>
              <div className="text-center mb-4">
                <div className="font-mono-cyber font-black text-4xl mb-1" style={{ color: diff.color, textShadow: `0 0 20px ${diff.color}` }}>
                  {multiplier.toFixed(2)}x
                </div>
                <div className="font-mono-cyber text-lg text-white">
                  ₽{currentWin.toLocaleString('ru-RU')}
                </div>
                <div className="text-gray-600 text-xs mt-1 font-mono-cyber">
                  🍎 {applesFound} / {applesTotal} яблок
                </div>
              </div>

              {gameState === 'betting' && (
                <button onClick={startGame}
                  className="w-full py-4 font-cyber text-sm tracking-widest rounded-sm transition-all"
                  style={{ background: `linear-gradient(135deg, #22c55e, #16a34a)`, color: 'white', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
                  🍎 НАЧАТЬ ИГРУ
                </button>
              )}
              {gameState === 'playing' && (
                <button onClick={handleCashout} disabled={applesFound === 0}
                  className="w-full py-4 font-cyber text-sm tracking-widest rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed animate-glow-pulse"
                  style={{ background: applesFound > 0 ? `linear-gradient(135deg, ${diff.color}, ${diff.color}99)` : 'rgba(255,255,255,0.05)', color: applesFound > 0 ? '#050810' : '#6b7280', boxShadow: applesFound > 0 ? `0 0 20px ${diff.color}50` : 'none' }}>
                  ЗАБРАТЬ ₽{currentWin.toLocaleString('ru-RU')}
                </button>
              )}
              {(gameState === 'won' || gameState === 'lost') && (
                <button onClick={resetGame}
                  className="w-full py-4 font-cyber text-sm tracking-widest rounded-sm transition-all"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>
                  ИГРАТЬ СНОВА
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(34,197,94,0.1)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// МОЯ СТАТИСТИКА</div>
              <div className="space-y-2">
                {[
                  { label: 'Лучший множитель', value: '5.10x', color: '#ffd600' },
                  { label: 'Выиграл сегодня', value: '₽7,460', color: '#22c55e' },
                  { label: 'Раундов сыграно', value: '134', color: '#00f5ff' },
                  { label: 'Win rate', value: '61%', color: '#a855f7' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{s.label}</span>
                    <span className="font-mono-cyber text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: game grid */}
          <div className="xl:col-span-2">
            <div className="cyber-card rounded-sm overflow-hidden" style={{ border: `1px solid ${diff.color}25` }}>
              {/* Status bar */}
              <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.04)]"
                style={{ background: `radial-gradient(ellipse at center, ${diff.color}08 0%, transparent 70%)` }}>
                {gameState === 'betting' && (
                  <div className="text-center">
                    <div className="font-cyber text-gray-500 text-sm tracking-widest">ОТКРЫВАЙ ЯБЛОКИ — ИЗБЕГАЙ БОМБ</div>
                  </div>
                )}
                {gameState === 'playing' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍎</span>
                      <div>
                        <div className="font-mono-cyber text-xs text-gray-500">НАЙДЕНО</div>
                        <div className="font-mono-cyber font-bold" style={{ color: diff.color }}>{applesFound} яблок</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono-cyber text-xs text-gray-500">МНОЖИТЕЛЬ</div>
                      <div className="font-mono-cyber text-2xl font-black" style={{ color: diff.color }}>{multiplier.toFixed(2)}x</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-mono-cyber text-xs text-gray-500">БОМБ ОСТАЛОСЬ</div>
                        <div className="font-mono-cyber font-bold text-[#ff006e]">{diff.bombs} 💣</div>
                      </div>
                    </div>
                  </div>
                )}
                {gameState === 'won' && (
                  <div className="text-center">
                    <div className="font-cyber text-[#22c55e] text-lg tracking-widest">🎉 ВЫИГРЫШ!</div>
                    <div className="font-mono-cyber text-2xl font-black text-white">+₽{(currentWin - parseFloat(bet)).toLocaleString('ru-RU')}</div>
                  </div>
                )}
                {gameState === 'lost' && (
                  <div className="text-center">
                    <div className="font-cyber text-[#ff006e] text-lg tracking-widest animate-neon-flicker">💥 БУМ! БОМБА!</div>
                    <div className="font-mono-cyber text-sm text-gray-500">Попробуй снова</div>
                  </div>
                )}
              </div>

              {/* Grid */}
              <div className="p-6">
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                  {Array(TOTAL_CELLS).fill(null).map((_, index) => {
                    const isRevealed = revealed[index];
                    const cellType = grid[index];
                    const isBomb = isRevealed && cellType === 'bomb';
                    const isApple = isRevealed && cellType === 'apple';
                    const isLastBomb = index === lastBomb;

                    return (
                      <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={gameState !== 'playing' || isRevealed}
                        className={`
                          aspect-square rounded-sm flex items-center justify-center text-2xl
                          transition-all duration-200 relative overflow-hidden
                          ${!isRevealed && gameState === 'playing' ? 'hover:scale-105 cursor-pointer' : ''}
                          ${!isRevealed && gameState !== 'playing' ? 'cursor-default' : ''}
                        `}
                        style={{
                          background: isBomb
                            ? isLastBomb ? 'rgba(255,0,110,0.3)' : 'rgba(255,0,110,0.1)'
                            : isApple
                              ? `${diff.color}20`
                              : gameState === 'betting'
                                ? 'rgba(34,197,94,0.03)'
                                : 'rgba(10,15,26,0.8)',
                          border: isBomb
                            ? isLastBomb ? '2px solid #ff006e' : '1px solid rgba(255,0,110,0.4)'
                            : isApple
                              ? `1px solid ${diff.color}60`
                              : gameState === 'betting'
                                ? '1px solid rgba(34,197,94,0.1)'
                                : '1px solid rgba(0,245,255,0.1)',
                          boxShadow: isLastBomb ? '0 0 20px rgba(255,0,110,0.5)' : isApple ? `0 0 10px ${diff.color}30` : 'none',
                          transform: isLastBomb ? 'scale(1.1)' : undefined,
                        }}
                      >
                        {/* Hidden cell */}
                        {!isRevealed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {gameState === 'playing' ? (
                              <div className="w-6 h-6 border border-[rgba(0,245,255,0.2)] rounded-sm"
                                style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.05), transparent)' }} />
                            ) : (
                              <span className="text-gray-700 text-lg">▪</span>
                            )}
                          </div>
                        )}
                        {/* Apple */}
                        {isApple && (
                          <span className="animate-fade-in" style={{ filter: `drop-shadow(0 0 8px ${diff.color})` }}>
                            🍎
                          </span>
                        )}
                        {/* Bomb */}
                        {isBomb && (
                          <span className={isLastBomb ? 'animate-fade-in' : ''}>
                            💣
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bombs indicator row */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[8px]">🍎</div>
                    <span className="font-mono-cyber text-xs text-gray-600">= яблоко (+{(diff.multiplierStep * 100).toFixed(0)}%)</span>
                  </div>
                  <span className="text-gray-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#ff006e]/10 border border-[#ff006e]/30 flex items-center justify-center text-[8px]">💣</div>
                    <span className="font-mono-cyber text-xs text-gray-600">= бомба (конец игры)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: live + history */}
          <div className="xl:col-span-1 space-y-4">
            {/* Live players */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// СЕЙЧАС ИГРАЮТ</div>
              <div className="space-y-2">
                {LIVE_PLAYERS.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 border-b border-[rgba(255,255,255,0.03)]">
                    <span className="text-lg">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-cyber text-xs text-gray-400 truncate">{p.user}</div>
                      <div className="font-mono-cyber text-[10px] text-gray-600">₽{p.bet.toLocaleString()} • {'🍎'.repeat(Math.min(p.found, 5))}</div>
                    </div>
                    <div className={`font-cyber text-xs px-2 py-0.5 rounded-sm border
                      ${p.status === 'playing' ? 'border-[#22c55e]/30 text-[#22c55e]' :
                        p.status === 'cashout' ? 'border-[#ffd600]/30 text-[#ffd600]' :
                        'border-[#ff006e]/30 text-[#ff006e]'}`}>
                      {p.status === 'playing' ? p.mult : p.status === 'cashout' ? `+${p.mult}` : '💣'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(34,197,94,0.1)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// МОЯ ИСТОРИЯ</div>
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.03)]">
                    <div className={`font-cyber text-xs px-2 py-0.5 rounded-sm border
                      ${h.result === 'win' ? 'border-[#22c55e]/30 text-[#22c55e]' : 'border-[#ff006e]/30 text-[#ff006e]'}`}>
                      {h.mult}
                    </div>
                    <div className={`font-mono-cyber text-xs font-bold ${h.result === 'win' ? 'text-[#22c55e]' : 'text-[#ff006e]'}`}>
                      {h.result === 'win' ? '+' : ''}₽{Math.abs(h.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="cyber-card rounded-sm p-4" style={{ border: '1px solid rgba(34,197,94,0.08)' }}>
              <div className="font-cyber text-xs text-[#22c55e] tracking-widest mb-3">// КАК ИГРАТЬ</div>
              <div className="space-y-2">
                {[
                  'Сделай ставку и выбери сложность',
                  'Открывай клетки — ищи яблоки 🍎',
                  'Каждое яблоко увеличивает множитель',
                  'Нажми «Забрать» в любой момент',
                  'Попади на бомбу 💣 — потеряешь ставку',
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono-cyber text-[#22c55e] text-xs shrink-0">{i + 1}.</span>
                    <span className="text-gray-500 text-xs leading-relaxed">{r}</span>
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
