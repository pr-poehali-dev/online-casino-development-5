import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const navItems = [
  { label: 'Главная', path: '/', icon: 'Home' },
  { label: 'Игры', path: '/games', icon: 'Gamepad2' },
  { label: 'Турниры', path: '/tournaments', icon: 'Trophy' },
  { label: 'Бонусы', path: '/bonuses', icon: 'Gift' },
  { label: 'О нас', path: '/about', icon: 'Info' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-[#020408]/90 backdrop-blur-xl border-b border-[rgba(0,245,255,0.1)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-40" />

      <div className="relative container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 border border-[#00f5ff] relative flex items-center justify-center"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
            <div className="absolute inset-0 bg-[#00f5ff]/10 group-hover:bg-[#00f5ff]/20 transition-colors" />
            <span className="font-cyber text-[#00f5ff] text-sm font-black">NX</span>
          </div>
          <div>
            <span className="font-cyber text-lg font-black tracking-widest neon-text-cyan">NEXUS</span>
            <span className="font-cyber text-xs text-[#a855f7] tracking-[0.3em] block -mt-1">CASINO</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 font-cyber text-xs tracking-widest uppercase transition-all duration-200
                ${location.pathname === item.path
                  ? 'text-[#00f5ff] border-b border-[#00f5ff]'
                  : 'text-gray-400 hover:text-[#00f5ff]'}`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/profile" className="cyber-btn-secondary px-4 py-2 text-xs rounded-sm">
            Войти
          </Link>
          <Link to="/profile" className="cyber-btn-primary px-4 py-2 text-xs rounded-sm">
            Регистрация
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#00f5ff] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? 'X' : 'Menu'} size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#020408]/98 border-b border-[rgba(0,245,255,0.1)] backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 font-cyber text-xs tracking-widest uppercase border-b border-[rgba(0,245,255,0.05)]
                ${location.pathname === item.path ? 'text-[#00f5ff]' : 'text-gray-400'}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
          <div className="flex gap-3 p-4">
            <Link to="/profile" onClick={() => setMobileOpen(false)} className="cyber-btn-secondary px-4 py-2 text-xs rounded-sm flex-1 text-center">Войти</Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)} className="cyber-btn-primary px-4 py-2 text-xs rounded-sm flex-1 text-center">Регистрация</Link>
          </div>
        </div>
      )}
    </nav>
  );
}