export interface Game {
  id: number;
  title: string;
  provider: string;
  category: string;
  rtp: number;
  rating: number;
  players: number;
  badge?: 'HOT' | 'NEW' | 'JACKPOT';
  jackpot?: string;
  emoji: string;
  color: string;
}

export const games: Game[] = [
  { id: 1, title: 'Cyber Slots X', provider: 'NetEnt', category: 'slots', rtp: 96.5, rating: 4.9, players: 1420, badge: 'HOT', emoji: '🎰', color: '#00f5ff' },
  { id: 2, title: 'Neon Roulette', provider: 'Evolution', category: 'roulette', rtp: 97.3, rating: 4.8, players: 890, badge: 'JACKPOT', jackpot: '₽2.4M', emoji: '🎡', color: '#ff006e' },
  { id: 3, title: 'Quantum Poker', provider: 'Playtech', category: 'poker', rtp: 99.5, rating: 4.7, players: 543, emoji: '🃏', color: '#a855f7' },
  { id: 4, title: 'Dark Blackjack', provider: 'Microgaming', category: 'blackjack', rtp: 99.7, rating: 4.9, players: 1205, badge: 'NEW', emoji: '🂡', color: '#00ff9f' },
  { id: 5, title: 'Galaxy Slots', provider: 'Pragmatic', category: 'slots', rtp: 95.8, rating: 4.6, players: 2100, badge: 'HOT', emoji: '🌌', color: '#ffd600' },
  { id: 6, title: 'Live Baccarat', provider: 'Evolution', category: 'live', rtp: 98.9, rating: 4.8, players: 320, emoji: '🎲', color: '#ff006e' },
  { id: 7, title: 'Mega Fortune', provider: 'NetEnt', category: 'slots', rtp: 96.0, rating: 4.7, players: 3400, badge: 'JACKPOT', jackpot: '₽8.7M', emoji: '💎', color: '#ffd600' },
  { id: 8, title: 'Cyber Baccarat', provider: 'Playtech', category: 'live', rtp: 98.5, rating: 4.6, players: 178, badge: 'NEW', emoji: '🤖', color: '#00f5ff' },
  { id: 9, title: 'Turbo Slots', provider: 'Pragmatic', category: 'slots', rtp: 97.1, rating: 4.5, players: 1560, emoji: '⚡', color: '#a855f7' },
  { id: 10, title: 'VR Poker', provider: 'Microgaming', category: 'poker', rtp: 99.2, rating: 4.8, players: 234, badge: 'NEW', emoji: '🥽', color: '#00ff9f' },
  { id: 11, title: 'Aztec Gold', provider: 'NetEnt', category: 'slots', rtp: 95.5, rating: 4.4, players: 987, emoji: '🏺', color: '#ffd600' },
  { id: 12, title: 'Speed Roulette', provider: 'Evolution', category: 'roulette', rtp: 97.3, rating: 4.7, players: 456, badge: 'HOT', emoji: '🎯', color: '#ff006e' },
  { id: 13, title: 'Kamikaze', provider: 'NEXUS Originals', category: 'crash', rtp: 97.0, rating: 4.9, players: 3821, badge: 'HOT', emoji: '✈️', color: '#ff4500' },
  { id: 14, title: 'Apple of Fortune', provider: 'NEXUS Originals', category: 'crash', rtp: 98.0, rating: 4.8, players: 2940, badge: 'NEW', emoji: '🍎', color: '#22c55e' },
  { id: 15, title: 'Aviamasters', provider: 'NEXUS Originals', category: 'crash', rtp: 97.5, rating: 5.0, players: 5120, badge: 'HOT', emoji: '🛩️', color: '#38bdf8' },
  { id: 16, title: 'Crazy Time', provider: 'NEXUS Originals', category: 'live', rtp: 96.8, rating: 5.0, players: 8740, badge: 'HOT', emoji: '🎪', color: '#f59e0b' },
];

export const categories = [
  { id: 'all', label: 'Все игры', icon: '🎮' },
  { id: 'slots', label: 'Слоты', icon: '🎰' },
  { id: 'roulette', label: 'Рулетка', icon: '🎡' },
  { id: 'poker', label: 'Покер', icon: '🃏' },
  { id: 'blackjack', label: 'Блэкджек', icon: '🂡' },
  { id: 'live', label: 'Live Casino', icon: '📡' },
  { id: 'crash', label: 'Краш-игры', icon: '✈️' },
];

export const providers = ['Все', 'NetEnt', 'Evolution', 'Playtech', 'Microgaming', 'Pragmatic'];