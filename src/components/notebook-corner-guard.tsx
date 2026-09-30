import React from 'react';

/**
 * MỸ THUẬT SỔ TAY HOÀNG GIA: GÓC BỌC KIM LOẠI MẠ VÀNG (ROYAL NOTEBOOK BRASS CORNER GUARDS)
 * Cảm hứng từ sổ da Bvlgari & gáy sổ hoàng gia Oxford / Smythson of Bond Street
 * Bảng màu:
 * - Vàng Kim Sa La Mã: #E5C158
 * - Vàng Cổ Điển Champagne: #D4AF37
 * - Vàng Kim Tuyến Shimmer: #FFF3D1
 * - Đồng Thau Khắc Chìm: #856417
 * - Cam đất viền: #C2410C
 */

// 1. Góc bọc sổ kim loại mạ vàng (Vintage Brass Notebook Corner Guard)
export function NotebookCornerGuard({
  className = '',
  size = 68,
  goldColor = '#E5C158',
  brassDark = '#856417',
  accentColor = '#C2410C',
  position = 'top-left',
}: {
  className?: string;
  size?: number;
  goldColor?: string;
  brassDark?: string;
  accentColor?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'none';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: getTransform() }}
      className={`pointer-events-none select-none transition-transform duration-300 drop-shadow-xs ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brassGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#856417" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFF3D1" />
          <stop offset="75%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#997A24" />
        </linearGradient>

        <linearGradient id="innerShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.82" />
          <stop offset="100%" stopColor="#F59E5B" stopOpacity="0.42" />
        </linearGradient>
      </defs>

      {/* Miếng ốp tam giác góc bọc sổ kim loại mạ vàng */}
      <path
        d="M3 3 H92 C88 20 80 34 68 46 C56 58 42 66 25 70 C16 73 8 82 3 92 Z"
        fill="url(#brassGoldGrad)"
        stroke="#59420D"
        strokeWidth="1.2"
      />

      {/* Lớp đệm viền cam đất sáng */}
      <path
        d="M7 7 H78 C72 20 64 30 54 40 C44 50 34 58 20 64 C14 66 9 72 7 78 Z"
        fill="url(#innerShieldGrad)"
        stroke="url(#brassGoldGrad)"
        strokeWidth="1"
      />

      {/* Đường chỉ dập nhiệt (Hot-stamped gold foil contour) */}
      <path
        d="M10 10 H68 C62 20 54 28 44 36 C36 44 26 52 14 58 C11 60 10 64 10 68"
        stroke="#FFF3D1"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="3 1.5"
      />

      {/* Hoa văn dập nổi chạm trổ kiểu Phục Hưng trong góc sổ */}
      <path
        d="M16 16 C22 22 26 34 22 42 C19 48 15 50 16 52 C17 53 24 50 30 42 C38 34 42 24 42 16 C42 13 38 12 34 13 C28 15 24 20 20 26"
        fill="url(#brassGoldGrad)"
        opacity="0.95"
      />

      {/* Nhánh lá cuộn vàng kim uốn lượn sang mép phải */}
      <path
        d="M20 20 C28 26 36 26 44 22 C48 20 52 16 56 16 C60 16 64 19 64 24"
        stroke="#FFF3D1"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Đinh tán / Ốc bọc sổ kim loại mạ vàng (Vintage Brass Screw Rivet) */}
      <g transform="translate(24, 24)">
        {/* Vành ngoài ốc kim loại */}
        <circle cx="0" cy="0" r="4.8" fill="url(#brassGoldGrad)" stroke="#59420D" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="3.4" fill="#E5C158" />
        {/* Rãnh vít dập chìm */}
        <line x1="-2.4" y1="0" x2="2.4" y2="0" stroke="#59420D" strokeWidth="0.8" strokeLinecap="round" />
        {/* Điểm sáng quang kim loại */}
        <circle cx="-1" cy="-1" r="1" fill="#FFFFFF" opacity="0.85" />
      </g>

      {/* Đinh tán phụ mép góc */}
      <circle cx="82" cy="10" r="2.2" fill="url(#brassGoldGrad)" stroke="#59420D" strokeWidth="0.6" />
      <circle cx="10" cy="82" r="2.2" fill="url(#brassGoldGrad)" stroke="#59420D" strokeWidth="0.6" />
    </svg>
  );
}

// 2. Bộ 4 góc bọc sổ tự động gắn vào thẻ card (.notebook-card-corners)
export function NotebookCardCorners({
  size = 60,
  mode = 'diagonal', // 'all-4' | 'diagonal' | 'top-pair'
  className = '',
}: {
  size?: number;
  mode?: 'all-4' | 'diagonal' | 'top-pair';
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none z-10 overflow-hidden ${className}`} aria-hidden="true">
      {/* Top Left */}
      <div className="absolute top-0 left-0">
        <NotebookCornerGuard size={size} position="top-left" />
      </div>

      {/* Top Right */}
      {(mode === 'all-4' || mode === 'top-pair') && (
        <div className="absolute top-0 right-0">
          <NotebookCornerGuard size={size} position="top-right" />
        </div>
      )}

      {/* Bottom Left */}
      {mode === 'all-4' && (
        <div className="absolute bottom-0 left-0">
          <NotebookCornerGuard size={size} position="bottom-left" />
        </div>
      )}

      {/* Bottom Right */}
      {(mode === 'all-4' || mode === 'diagonal') && (
        <div className="absolute bottom-0 right-0">
          <NotebookCornerGuard size={size} position="bottom-right" />
        </div>
      )}
    </div>
  );
}

// 3. Dải Ruy Băng Lụa Đánh Dấu Trang Sổ Tay Kèm Huân Chương Hoàng Gia (NotebookRibbonDivider)
export function NotebookRibbonDivider({
  className = '',
  title = '',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 select-none pointer-events-none ${className}`} aria-hidden="true">
      <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#E5C158] to-[#D4AF37]" />
      
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF7ED] via-[#FFE3C9] to-[#FFF7ED] border border-[#E8B68F] shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Huy hiệu ruy băng đánh dấu trang */}
          <path d="M5 3 H19 V19 L12 15 L5 19 V3 Z" fill="url(#brassGoldGrad)" stroke="#59420D" strokeWidth="0.8" />
          <path d="M8 5 H16 V15 L12 12.5 L8 15 V5 Z" fill="#C2410C" />
          <circle cx="12" cy="8.5" r="1.8" fill="#E5C158" />
        </svg>
        {title && (
          <span className="text-[11px] font-bold font-serif uppercase tracking-widest text-[#9A3412]">
            {title}
          </span>
        )}
      </div>

      <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#E5C158] to-[#D4AF37]" />
    </div>
  );
}

// 4. Đường khâu chỉ vàng gáy sổ (Bookbinding Stitch Accent)
export function NotebookBookbindingStitch({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`absolute left-0 top-0 bottom-0 w-2 pointer-events-none select-none overflow-hidden z-10 ${className}`}
      style={{
        borderRight: '1.5px dashed rgba(229, 193, 88, 0.45)',
        background: 'linear-gradient(90deg, rgba(194, 65, 12, 0.16) 0%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}
