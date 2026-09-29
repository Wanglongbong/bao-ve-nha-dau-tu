import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, QrCode as QrIcon, Smartphone, X, Shield, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface QrProps {
  url?: string;
  size?: number;
  className?: string;
}

export function QrCodeImage({ url, size = 110, className = '' }: QrProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://bao-ve-nha-dau-tu.vercel.app');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: size * 2.2,
      margin: 1.5,
      color: {
        dark: '#7C2D12', // Deep Royal Terracotta / Burnt Orange
        light: '#FFFDF9', // Pale Ivory Parchment
      },
      errorCorrectionLevel: 'M',
    })
      .then((generatedUrl) => {
        if (isMounted) setDataUrl(generatedUrl);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [targetUrl, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-[#FFFDF9] border-2 border-orange-300 rounded-2xl animate-pulse text-xs text-orange-600 ${className}`}
      >
        <QrIcon className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`p-2 bg-gradient-to-b from-[#FFFDF9] to-[#FFF7ED] rounded-2xl border-2 border-amber-300 shadow-md inline-block group hover:border-amber-500 transition-all ${className}`}>
      <img
        src={dataUrl}
        alt="Mã QR Website Bảo Vệ Nhà Đầu Tư"
        width={size}
        height={size}
        className="block rounded-xl"
        loading="lazy"
      />
    </div>
  );
}

export function QrCodeModal({
  isOpen,
  onClose,
  url,
}: {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [largeDataUrl, setLargeDataUrl] = useState<string>('');
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://bao-ve-nha-dau-tu.vercel.app');

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(currentUrl, {
      width: 520,
      margin: 2,
      color: {
        dark: '#7C2D12', // Deep Royal Terracotta / Burnt Orange
        light: '#FFFDF9', // Pale Ivory Parchment
      },
      errorCorrectionLevel: 'H',
    })
      .then((generated) => {
        setLargeDataUrl(generated);
      })
      .catch((err) => {
        console.error('Error creating modal QR:', err);
      });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentUrl, onClose]);

  const handleCopyLink = () => {
    soundFx.playChime();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    soundFx.playTap();
    if (!largeDataUrl) return;
    const a = document.createElement('a');
    a.href = largeDataUrl;
    a.download = 'QR-Bao-Ve-Nha-Dau-Tu-261LAW10A01.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-serif"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EF] to-[#FEEED8] rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-2xl text-center text-[#2A1305] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-orange-950 hover:bg-orange-100 rounded-full transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon Badge */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#7C2D12] to-[#B4380C] text-white flex items-center justify-center shadow-md">
          <Shield className="w-6 h-6 text-amber-200" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] bg-orange-100/90 border border-orange-300 px-3 py-1 rounded-full inline-block mb-2">
          Khoa Luật • HVNH • Lớp 261LAW10A01
        </span>

        <h3 className="text-xl font-extrabold text-[#1F0C02] mb-1">
          Mã QR Truy Cập Website
        </h3>
        <p className="text-xs text-[#5C2E0A] mb-5 leading-relaxed">
          Quét bằng camera điện thoại hoặc Zalo để mở đề tài nghiên cứu trên thiết bị di động
        </p>

        {/* Big Styled QR Code */}
        <div className="p-4 bg-[#FFFDF9] rounded-2xl border-2 border-amber-400 shadow-lg inline-block mb-5 relative group">
          {largeDataUrl ? (
            <img
              src={largeDataUrl}
              alt="Mã QR Phóng To Màu Cam Hổ Phách"
              width={220}
              height={220}
              className="block rounded-xl mx-auto shadow-inner"
            />
          ) : (
            <div className="w-[220px] h-[220px] flex items-center justify-center">
              <QrIcon className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          )}
          <div className="mt-2 text-[10px] font-bold text-[#8C2B0A] tracking-wider uppercase flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>https://bao-ve-nha-dau-tu.vercel.app</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-500 text-[#7C2D12] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-orange-600" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7C2D12] to-[#B4380C] hover:from-[#6B2006] hover:to-[#9A3412] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span>Tải ảnh QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default QrCodeModal;
