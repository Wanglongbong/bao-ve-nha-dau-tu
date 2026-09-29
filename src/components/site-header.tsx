import React, { useState } from 'react';
import { useRouter, Link } from '@/router';
import { Shield, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface SiteHeaderProps {
  onOpenAi: () => void;
  onOpenViewer?: () => void;
  activeSection?: string;
}

export function SiteHeader({ onOpenAi, onOpenViewer, activeSection = '' }: SiteHeaderProps) {
  const [soundActive, setSoundActive] = useState<boolean>(() => soundFx.isEnabled());
  const { pathname, navigate } = useRouter();

  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundActive(nextState);
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
          <div className="brand-mark">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <span>
            <strong>BẢO VỆ NHÀ ĐẦU TƯ</strong>
            <small>LỚP 261LAW10A01 • NHÓM 2 • KHOA LUẬT HVNH</small>
          </span>
        </Link>

        {/* Desktop Navigation (5 Items Exactly) */}
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <Link 
            href="/ban-word"
            className={`hover:text-[#C2410C] transition-colors font-serif font-bold ${pathname === '/ban-word' ? 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8' : 'text-[#3D2E24]'}`}
            onClick={() => soundFx.playTap()}
          >
            BẢN WORD
          </Link>
          <Link 
            href="/doi-ngu"
            className={`hover:text-[#C2410C] transition-colors font-serif font-bold ${pathname === '/doi-ngu' ? 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8' : 'text-[#3D2E24]'}`}
            onClick={() => soundFx.playTap()}
          >
            THÀNH VIÊN
          </Link>
          <Link 
            href="/dien-dan"
            className={`hover:text-[#C2410C] transition-colors font-serif font-bold ${pathname === '/dien-dan' ? 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8' : 'text-[#3D2E24]'}`}
            onClick={() => soundFx.playTap()}
          >
            DIỄN ĐÀN CỘNG ĐỒNG
          </Link>
          <Link 
            href="/nen-tang-ai"
            className={`hover:text-[#C2410C] transition-colors font-serif font-bold ${pathname === '/nen-tang-ai' ? 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8' : 'text-[#3D2E24]'}`}
            onClick={() => soundFx.playTap()}
          >
            NỀN TẢNG AI
          </Link>
          <Link 
            href="/tin-tuc"
            className={`hover:text-[#C2410C] transition-colors font-serif font-bold ${pathname === '/tin-tuc' ? 'text-[#8C2B0A] font-extrabold underline decoration-[#D4AF37] decoration-2 underline-offset-8' : 'text-[#3D2E24]'}`}
            onClick={() => soundFx.playTap()}
          >
            TIN TỨC
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              soundActive
                ? 'bg-[#FFF7ED] border-[#F2E4D4] text-[#C2410C] hover:bg-[#FEEBD7]'
                : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'
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
