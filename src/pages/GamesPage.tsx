import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import GameCard from '@/components/games/GameCard';
import { games, categories, providers } from '@/data/games';

export default function GamesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProvider, setActiveProvider] = useState('Все');
  const [sortBy, setSortBy] = useState<'rating' | 'players' | 'rtp'>('players');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...games];
    if (activeCategory !== 'all') result = result.filter(g => g.category === activeCategory);
    if (activeProvider !== 'Все') result = result.filter(g => g.provider === activeProvider);
    if (search) result = result.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    return result;
  }, [activeCategory, activeProvider, sortBy, search]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative py-16 border-b border-[rgba(0,245,255,0.08)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] to-[#050810]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-40" />
        <div className="relative container mx-auto px-4">
          <div className="font-cyber text-xs text-[#00f5ff] tracking-widest mb-2">// КАТАЛОГ ИГР</div>
          <h1 className="font-cyber text-4xl font-black text-white mb-2">
            Все <span className="neon-text-cyan">Игры</span>
          </h1>
          <p className="text-gray-500">2,400+ игр от лучших провайдеров мира</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск игры..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-4 py-3 text-sm rounded-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={activeProvider}
              onChange={e => setActiveProvider(e.target.value)}
              className="cyber-input px-3 py-2 text-sm rounded-sm appearance-none cursor-pointer"
            >
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="flex border border-[rgba(0,245,255,0.2)] rounded-sm overflow-hidden">
              {[
                { key: 'players', label: 'Популярные' },
                { key: 'rating', label: 'Рейтинг' },
                { key: 'rtp', label: 'RTP' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key as typeof sortBy)}
                  className={`px-3 py-2 font-cyber text-xs transition-all duration-200
                    ${sortBy === s.key ? 'bg-[#00f5ff] text-[#050810]' : 'text-gray-400 hover:text-[#00f5ff]'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-cyber text-xs tracking-wider transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-[#00f5ff] text-[#050810]'
                  : 'border border-[rgba(0,245,255,0.2)] text-gray-400 hover:text-[#00f5ff] hover:border-[#00f5ff]'}`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono-cyber text-gray-500 text-xs">
            НАЙДЕНО: <span className="text-[#00f5ff]">{filtered.length}</span> ИГР
          </span>
          <div className="flex-1 h-px bg-[rgba(0,245,255,0.05)]" />
        </div>

        {/* Games Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-cyber text-xl text-gray-400 mb-2">Ничего не найдено</h3>
            <p className="text-gray-600 text-sm">Попробуй изменить фильтры или поисковый запрос</p>
          </div>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="text-center mt-10">
            <button className="cyber-btn-secondary px-8 py-3 text-sm rounded-sm inline-flex items-center gap-2">
              <Icon name="Plus" size={14} />
              ЗАГРУЗИТЬ ЕЩЁ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
