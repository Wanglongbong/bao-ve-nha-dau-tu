import React, { useEffect, useState } from 'react';
import { Menu, Shield, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { useRouter, Link } from '@/router';
import { soundFx } from '@/lib/audio-effects';

interface SiteHeaderProps {
  onOpenAi: () => void;
  onOpenViewer?: () => void;
  activeSection?: string;
}

const navItems = [
  { href: '/ban-word', label: 'Bản Word' },
  { href: '/tin-tuc', label: 'Tin Tức' },
  { href: '/nen-tang-ai', label: 'Nền Tảng AI' },
  { href: '/dien-dan', label: 'Cộng Đồng' },
  { href: '/doi-ngu', label: 'Thành Viên' },
];

export function SiteHeader({ onOpenAi }: SiteHeaderProps) {
  const [soundActive, setSoundActive] = useState(() => soundFx.isEnabled());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useRouter();

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleToggleSound = () => setSoundActive(soundFx.toggle());
  const handleAiClick = () => { soundFx.playChime(); onOpenAi(); };

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand shrink-0" aria-label="Về trang chủ" onClick={() => soundFx.playTap()}>
          <div className="brand-mark"><Shield className="w-6 h-6 text-[#C2410C]" /></div>
          <span>
            <strong className="text-[#8C2B0A] font-serif font-black tracking-wide text-base">BẢO VỆ NHÀ ĐẦU TƯ</strong>
            <small className="text-[#A3350E] font-bold tracking-wider uppercase text-[10px]">KHOA LUẬT · HVNH</small>
          </span>
        </Link>

        <nav className="desktop-nav flex-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-center px-4" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && (pathname === '' || pathname === '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-serif text-[0.92rem] font-bold tracking-wide transition-all px-1.5 py-0.5 whitespace-nowrap ${
                  isActive ? 'text-[#8C2B0A] border-b-2 border-[#C2410C] font-extrabold' : 'text-[#3D2E24] hover:text-[#C2410C]'
                }`}
                onClick={() => soundFx.playTap()}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button onClick={handleToggleSound} className="header-icon-button" title={soundActive ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-label={soundActive ? 'Tắt âm thanh' : 'Bật âm thanh'}>
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={handleAiClick} className="orange-button header-ai-button"><Sparkles className="w-4 h-4" /><span>Hỏi AI</span></button>
          <button onClick={() => setMobileOpen((open) => !open)} className="mobile-menu-button" aria-label="Mở điều hướng" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && <nav className="mobile-nav" aria-label="Điều hướng di động">
        <div className="site-shell">{navItems.map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : ''}>{item.label}</Link>)}</div>
      </nav>}
    </header>
  );
}
