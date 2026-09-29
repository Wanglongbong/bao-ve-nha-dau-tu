import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '@/router';
import { Shield, Sparkles, Volume2, VolumeX, BookMarked, Palette } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import { themeManager, ThemeEdition } from '@/lib/theme-manager';

interface SiteHeaderProps {
  onOpenAi: () => void;
  onOpenViewer?: () => void;
  activeSection?: string;
}

export function SiteHeader({ onOpenAi, onOpenViewer, activeSection = '' }: SiteHeaderProps) {
  const [soundActive, setSoundActive] = useState<boolean>(() => soundFx.isEnabled());
  const [theme, setTheme] = useState<ThemeEdition>(() => themeManager.getTheme());
  const { pathname, navigate } = useRouter();

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeEdition }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener('theme-edition-changed', handleThemeChange);
    return () => window.removeEventListener('theme-edition-changed', handleThemeChange);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundActive(nextState);
  };

  const handleToggleTheme = () => {
    soundFx.playChime();
    const next = themeManager.toggleTheme();
    setTheme(next);
  };

  const handleAiClick = () => {
    soundFx.playChime();
    onOpenAi();
  };

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        {/* Logo / Brand */}
        <Link 
          href="/"
          className="brand text-left cursor-pointer focus:outline-none"
          aria-label="Về đầu trang"
          onClick={() => soundFx.playTap()}
        >
          <div className={`brand-mark transition-all ${theme === 'navy' ? '!bg-gradient-to-br !from-[#070E1B] !to-[#0E2145] !border-[#E5C158]' : ''}`}>
            <Shield className={`w-6 h-6 ${theme === 'navy' ? 'text-[#E5C158]' : 'text-orange-600'}`} />
          </div>
          <span>
            <strong className="text-letter-halo">BẢO VỆ NHÀ ĐẦU TƯ</strong>
            <small>LỚP 261LAW10A01 • NHÓM 2 • KHOA LUẬT HVNH</small>
          </span>
        </Link>

        {/* Desktop Navigation (5 Items Exactly) */}
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <Link 
            href="/ban-word"
            className={`transition-colors font-serif font-bold ${
              pathname === '/ban-word' 
                ? (theme === 'navy' ? 'text-[#E5C158] font-extrabold underline decoration-[#E5C158] decoration-2 underline-offset-8' : 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8')
                : (theme === 'navy' ? 'text-[#D3DEF0] hover:text-[#E5C158]' : 'text-[#3D2E24] hover:text-[#C2410C]')
            }`}
            onClick={() => soundFx.playTap()}
          >
            BẢN WORD
          </Link>
          <Link 
            href="/doi-ngu"
            className={`transition-colors font-serif font-bold ${
              pathname === '/doi-ngu' 
                ? (theme === 'navy' ? 'text-[#E5C158] font-extrabold underline decoration-[#E5C158] decoration-2 underline-offset-8' : 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8')
                : (theme === 'navy' ? 'text-[#D3DEF0] hover:text-[#E5C158]' : 'text-[#3D2E24] hover:text-[#C2410C]')
            }`}
            onClick={() => soundFx.playTap()}
          >
            THÀNH VIÊN
          </Link>
          <Link 
            href="/dien-dan"
            className={`transition-colors font-serif font-bold ${
              pathname === '/dien-dan' 
                ? (theme === 'navy' ? 'text-[#E5C158] font-extrabold underline decoration-[#E5C158] decoration-2 underline-offset-8' : 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8')
                : (theme === 'navy' ? 'text-[#D3DEF0] hover:text-[#E5C158]' : 'text-[#3D2E24] hover:text-[#C2410C]')
            }`}
            onClick={() => soundFx.playTap()}
          >
            DIỄN ĐÀN CỘNG ĐỒNG
          </Link>
          <Link 
            href="/nen-tang-ai"
            className={`transition-colors font-serif font-bold ${
              pathname === '/nen-tang-ai' 
                ? (theme === 'navy' ? 'text-[#E5C158] font-extrabold underline decoration-[#E5C158] decoration-2 underline-offset-8' : 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8')
                : (theme === 'navy' ? 'text-[#D3DEF0] hover:text-[#E5C158]' : 'text-[#3D2E24] hover:text-[#C2410C]')
            }`}
            onClick={() => soundFx.playTap()}
          >
            NỀN TẢNG AI
          </Link>
          <Link 
            href="/tin-tuc"
            className={`transition-colors font-serif font-bold ${
              pathname === '/tin-tuc' 
                ? (theme === 'navy' ? 'text-[#E5C158] font-extrabold underline decoration-[#E5C158] decoration-2 underline-offset-8' : 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8')
                : (theme === 'navy' ? 'text-[#D3DEF0] hover:text-[#E5C158]' : 'text-[#3D2E24] hover:text-[#C2410C]')
            }`}
            onClick={() => soundFx.playTap()}
          >
            TIN TỨC
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Edition Switcher Button */}
          <button
            onClick={handleToggleTheme}
            className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-serif font-bold cursor-pointer shadow-xs ${
              theme === 'navy'
                ? 'bg-[#0E2145] border-[#E5C158] text-[#FFF3D1] hover:bg-[#162E5B] shadow-md shadow-[#070E1B]/35'
                : 'bg-[#FFF7ED] border-[#C2410C]/40 text-[#8C2B0A] hover:bg-[#FEEBD7]'
            }`}
            title={theme === 'navy' ? 'Đang bật Ấn Bản Sổ Tay Navy & Vàng Kim. Bấm để chuyển sang Ấn Bản Đất Nung Cam' : 'Đang bật Ấn Bản Đất Nung Cam. Bấm để chuyển sang Sổ Tay Navy & Vàng Kim'}
          >
            {theme === 'navy' ? (
              <>
                <BookMarked className="w-3.5 h-3.5 text-[#E5C158]" />
                <span className="hidden sm:inline">Sổ Tay Navy</span>
              </>
            ) : (
              <>
                <Palette className="w-3.5 h-3.5 text-[#C2410C]" />
                <span className="hidden sm:inline">Đất Nung Cam</span>
              </>
            )}
          </button>

          {/* Audio Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              soundActive
                ? (theme === 'navy' ? 'bg-[#0E2145] border-[#E5C158]/60 text-[#E5C158] hover:bg-[#162E5B]' : 'bg-[#FFF7ED] border-[#F2E4D4] text-[#C2410C] hover:bg-[#FEEBD7]')
                : (theme === 'navy' ? 'bg-[#0A1428] border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600')
            }`}
            title={soundActive ? 'Tắt âm thanh click' : 'Bật âm thanh click chuột'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button 
            onClick={handleAiClick}
            className="orange-button text-sm"
            title="Mở Trợ lý AI Pháp lý Nhà Đầu Tư"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trợ Lý Pháp Lý AI</span>
          </button>
        </div>
      </div>
    </header>
    );
  }
