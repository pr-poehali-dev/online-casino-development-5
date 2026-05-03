import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const footerLinks = {
  'Игры': [
    { label: 'Слоты', path: '/games' },
    { label: 'Рулетка', path: '/games' },
    { label: 'Покер', path: '/games' },
    { label: 'Блэкджек', path: '/games' },
    { label: 'Live Casino', path: '/games' },
  ],
  'Игрокам': [
    { label: 'Бонусы', path: '/bonuses' },
    { label: 'Турниры', path: '/tournaments' },
    { label: 'Программа лояльности', path: '/bonuses' },
    { label: 'VIP клуб', path: '/bonuses' },
  ],
  'Компания': [
    { label: 'О нас', path: '/about' },
    { label: 'Лицензия', path: '/about' },
    { label: 'Политика конфиденциальности', path: '/about' },
    { label: 'Условия использования', path: '/about' },
  ],
  'Поддержка': [
    { label: 'Служба поддержки', path: '/support' },
    { label: 'FAQ', path: '/support' },
    { label: 'Ответственная игра', path: '/support' },
    { label: 'Способы оплаты', path: '/about' },
  ],
};

const paymentMethods = ['💳', '🏦', '₿', '⚡', '💰'];

export default function Footer() {
  return (
    <footer className="bg-[#020408] border-t border-[rgba(0,245,255,0.1)] mt-20">
      <div className="neon-divider" />

      <div className="container mx-auto px-4 py-12">
        {/* Logo & Desc */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-[#00f5ff] flex items-center justify-center"
                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                <span className="font-cyber text-[#00f5ff] text-sm font-black">NX</span>
              </div>
              <div>
                <div className="font-cyber text-base font-black tracking-widest neon-text-cyan">NEXUS</div>
                <div className="font-cyber text-xs text-[#a855f7] tracking-[0.3em]">CASINO</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Премиальное онлайн казино нового поколения. Играй ответственно.
            </p>
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={14} className="text-[#00ff9f]" />
              <span className="text-[#00ff9f] font-mono-cyber text-xs">ЛИЦЕНЗИЯ #MGA/CRP/148</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-cyber text-xs text-[#00f5ff] tracking-widest uppercase mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-500 hover:text-[#00f5ff] text-sm transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="w-1 h-1 bg-[#00f5ff]/0 group-hover:bg-[#00f5ff] rounded-full transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="neon-divider mb-6" />

        {/* Payment & Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs font-cyber tracking-widest">ПЛАТЕЖИ:</span>
            {paymentMethods.map((method, i) => (
              <div key={i} className="w-10 h-7 bg-[#0a0f1a] border border-[rgba(0,245,255,0.1)] rounded flex items-center justify-center text-sm">
                {method}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {['Github', 'Twitter', 'Instagram', 'MessageSquare'].map((icon) => (
              <button key={icon} className="w-8 h-8 border border-[rgba(0,245,255,0.15)] flex items-center justify-center text-gray-500 hover:text-[#00f5ff] hover:border-[#00f5ff] transition-all duration-200">
                <Icon name={icon as 'Github'} size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.03)] flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs font-mono-cyber">
            © 2024 NEXUS CASINO. ALL RIGHTS RESERVED. 18+
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-[rgba(255,214,0,0.3)] px-3 py-1">
              <span className="text-[#ffd600] font-cyber text-xs font-bold">18+</span>
            </div>
            <div className="flex items-center gap-2 border border-[rgba(0,255,159,0.3)] px-3 py-1">
              <Icon name="Shield" size={10} className="text-[#00ff9f]" />
              <span className="text-[#00ff9f] font-cyber text-xs">БЕЗОПАСНО</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
