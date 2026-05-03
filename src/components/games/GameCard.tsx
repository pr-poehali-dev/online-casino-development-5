import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';

interface GameCardProps {
  game: Game;
}

const GAME_ROUTES: Record<string, string> = {
  'Kamikaze': '/games/kamikaze',
};

export default function GameCard({ game }: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handlePlay = () => {
    const route = GAME_ROUTES[game.title];
    if (route) navigate(route);
  };

  return (
    <div
      className="cyber-card rounded-sm overflow-hidden cursor-pointer group transition-all duration-300"
      style={{ border: `1px solid ${hovered ? game.color : 'rgba(0,245,255,0.1)'}`, boxShadow: hovered ? `0 0 20px ${game.color}30` : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Game Preview */}
      <div className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(circle at center, ${game.color}15 0%, #050810 70%)` }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <span className="text-5xl animate-float" style={{ filter: `drop-shadow(0 0 10px ${game.color})` }}>
          {game.emoji}
        </span>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {game.badge === 'HOT' && <span className="badge-hot">HOT</span>}
          {game.badge === 'NEW' && <span className="badge-new">NEW</span>}
          {game.badge === 'JACKPOT' && <span className="badge-jackpot">JACKPOT</span>}
        </div>

        {game.jackpot && (
          <div className="absolute top-2 right-2 bg-[#0a0f1a] border border-[#ffd600]/40 px-2 py-1">
            <span className="font-mono-cyber text-[#ffd600] text-xs">{game.jackpot}</span>
          </div>
        )}

        {/* Play overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-[#050810]/60 flex items-center justify-center animate-fade-in">
            <button onClick={handlePlay} className="cyber-btn-primary px-6 py-2 text-xs rounded-sm">
              ИГРАТЬ
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-cyber text-sm text-white truncate mb-1">{game.title}</h3>
        <p className="text-gray-500 text-xs mb-2">{game.provider}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={11} className="text-[#ffd600]" />
            <span className="text-[#ffd600] font-mono-cyber text-xs">{game.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Users" size={11} className="text-gray-500" />
            <span className="text-gray-500 font-mono-cyber text-xs">{game.players.toLocaleString()}</span>
          </div>
          <div className="text-xs font-mono-cyber" style={{ color: game.color }}>
            RTP {game.rtp}%
          </div>
        </div>
      </div>
    </div>
  );
}