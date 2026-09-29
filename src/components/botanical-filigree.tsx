import React from 'react';

/**
 * MỸ THUẬT HOÀNG GIA: HOA VĂN HOA LÁ CỎ CÂY (ROYAL BOTANICAL BAROQUE SUITE)
 * Màu sắc chuẩn:
 * - Cam đất Venice (Deep Terracotta): #8C2B0A
 * - Vàng kim Champagne (Antique Gold): #D4AF37
 * - Hổ phách hoàng gia (Royal Amber): #C2410C
 */

// 1. Hoa văn góc lá cuộn Acanthus hoàng gia nổi bật (Kích thước lớn 64-96px, nét sắc sảo)
export function BotanicalCornerFiligree({
  className = '',
  size = 72,
  color = '#8C2B0A',
  goldColor = '#D4AF37',
  position = 'top-left',
}: {
  className?: string;
  size?: number;
  color?: string;
  goldColor?: string;
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
      className={`pointer-events-none select-none transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="royalLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8C2B0A" />
          <stop offset="50%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#D9531E" />
        </linearGradient>
        <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>

      {/* Viền ngoài góc vuông đôi mạ vàng & cam đất */}
      <path
        d="M4 96 V22 C4 12 12 4 22 4 H96"
        stroke="url(#royalGoldGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12 88 V26 C12 18 18 12 26 12 H88"
        stroke="url(#royalLeafGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Vòm xoắn lá Acanthus chính (Main Acanthus Leaf Swirl) */}
      <path
        d="M16 16 C26 26 30 46 26 62 C22 74 14 82 16 84 C19 86 32 80 46 68 C60 56 70 38 70 22 C70 16 64 14 58 16 C48 19 40 30 34 42 C32 46 28 44 28 38 C28 24 38 16 48 14 C36 12 24 12 16 16 Z"
        fill="url(#royalLeafGrad)"
        opacity="0.92"
      />

      {/* Gân lá Acanthus phụ màu vàng kim uốn lượn */}
      <path
        d="M26 26 C36 36 46 38 58 32 C64 29 70 22 76 22 C82 22 86 26 86 32 C86 42 76 52 64 60 C50 70 38 78 32 90"
        stroke="url(#royalGoldGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nhánh lá thứ cấp (Secondary Botanical Foliage) */}
      <path
        d="M42 30 C50 24 60 26 62 34 C60 38 50 38 42 30 Z"
        fill="url(#royalGoldGrad)"
        opacity="0.95"
      />
      <path
        d="M30 44 C24 52 26 62 34 64 C38 62 38 52 30 44 Z"
        fill="url(#royalGoldGrad)"
        opacity="0.95"
      />

      {/* Nhánh nụ hoa và quả sồi hoàng gia (Floral Buds) */}
      <circle cx="18" cy="18" r="3.5" fill="url(#royalGoldGrad)" stroke="#8C2B0A" strokeWidth="0.8" />
      <circle cx="88" cy="12" r="3" fill="url(#royalGoldGrad)" stroke="#8C2B0A" strokeWidth="0.8" />
      <circle cx="12" cy="88" r="3" fill="url(#royalGoldGrad)" stroke="#8C2B0A" strokeWidth="0.8" />
      <circle cx="48" cy="14" r="2" fill="url(#royalGoldGrad)" />
      <circle cx="14" cy="48" r="2" fill="url(#royalGoldGrad)" />

      {/* Cánh hoa nhỏ bung nở góc trong */}
      <path
        d="M62 42 C66 38 72 40 74 44 C74 48 68 50 64 48 Z"
        fill="url(#royalGoldGrad)"
        opacity="0.9"
      />
      <path
        d="M42 62 C38 66 40 72 44 74 C48 74 50 68 48 64 Z"
        fill="url(#royalGoldGrad)"
        opacity="0.9"
      />
    </svg>
  );
}

// 2. Bộ 4 góc hoa văn lá cuộn tự động bao quanh thẻ card
export function BotanicalCardCorners({
  size = 64,
  mode = 'diagonal', // 'all-4' | 'diagonal' | 'top-pair'
  color = '#8C2B0A',
  goldColor = '#D4AF37',
  className = '',
}: {
  size?: number;
  mode?: 'all-4' | 'diagonal' | 'top-pair';
  color?: string;
  goldColor?: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none z-10 overflow-hidden ${className}`} aria-hidden="true">
      {/* Top Left */}
      <div className="absolute top-0 left-0">
        <BotanicalCornerFiligree size={size} color={color} goldColor={goldColor} position="top-left" />
      </div>

      {/* Top Right */}
      {(mode === 'all-4' || mode === 'top-pair') && (
        <div className="absolute top-0 right-0">
          <BotanicalCornerFiligree size={size} color={color} goldColor={goldColor} position="top-right" />
        </div>
      )}

      {/* Bottom Left */}
      {mode === 'all-4' && (
        <div className="absolute bottom-0 left-0">
          <BotanicalCornerFiligree size={size} color={color} goldColor={goldColor} position="bottom-left" />
        </div>
      )}

      {/* Bottom Right */}
      {(mode === 'all-4' || mode === 'diagonal') && (
        <div className="absolute bottom-0 right-0">
          <BotanicalCornerFiligree size={size} color={color} goldColor={goldColor} position="bottom-right" />
        </div>
      )}
    </div>
  );
}

// 3. Vương miện hoa lá Acanthus đặt trang trọng phía trên/dưới tiêu đề (BotanicalHeaderCrest)
export function BotanicalHeaderCrest({
  className = '',
  goldColor = '#D4AF37',
  terracottaColor = '#8C2B0A',
}: {
  className?: string;
  goldColor?: string;
  terracottaColor?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-3 select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg
        width="340"
        height="36"
        viewBox="0 0 340 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8C2B0A" stopOpacity="0" />
            <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="65%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8C2B0A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dải dây leo vươn sang trái */}
        <path
          d="M15 18 C55 18 80 26 120 22 C140 20 155 18 160 18"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Lá nguyệt quế trái */}
        <path d="M55 20 C64 12 76 15 78 22 C74 24 64 24 55 20 Z" fill={terracottaColor} opacity="0.85" />
        <path d="M98 22 C106 14 116 16 118 24 C114 26 106 25 98 22 Z" fill={goldColor} opacity="0.95" />
        <path d="M135 20 C140 14 148 15 150 21 C147 23 141 22 135 20 Z" fill={terracottaColor} opacity="0.85" />

        {/* Nụ quả sồi trái */}
        <circle cx="40" cy="18" r="2.8" fill={goldColor} />
        <circle cx="85" cy="22" r="2.2" fill={terracottaColor} />

        {/* HOA THỊ HOÀNG GIA TRUNG TÂM (Central Royal Rosette) */}
        <g transform="translate(170, 18)">
          {/* Cánh hoa thị 8 hướng */}
          <circle cx="0" cy="0" r="8" fill="#FFFDF9" stroke={terracottaColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5.5" fill={goldColor} />
          <circle cx="0" cy="0" r="2.5" fill={terracottaColor} />
          {/* Hào quang lá nở 4 hướng */}
          <path d="M0 -12 C-2 -9 2 -9 0 -12 Z" fill={goldColor} />
          <path d="M0 12 C-2 9 2 9 0 12 Z" fill={goldColor} />
          <path d="M-12 0 C-9 -2 -9 2 -12 0 Z" fill={goldColor} />
          <path d="M12 0 C9 -2 9 2 12 0 Z" fill={goldColor} />
          <circle cx="-16" cy="0" r="2" fill={goldColor} />
          <circle cx="16" cy="0" r="2" fill={goldColor} />
        </g>

        {/* Dải dây leo vươn sang phải (đối xứng hoàn hảo) */}
        <path
          d="M325 18 C285 18 260 26 220 22 C200 20 185 18 180 18"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Lá nguyệt quế phải */}
        <path d="M285 20 C276 12 264 15 262 22 C266 24 276 24 285 20 Z" fill={terracottaColor} opacity="0.85" />
        <path d="M242 22 C234 14 224 16 222 24 C226 26 234 25 242 22 Z" fill={goldColor} opacity="0.95" />
        <path d="M205 20 C200 14 192 15 190 21 C193 23 199 22 205 20 Z" fill={terracottaColor} opacity="0.85" />

        {/* Nụ quả sồi phải */}
        <circle cx="300" cy="18" r="2.8" fill={goldColor} />
        <circle cx="255" cy="22" r="2.2" fill={terracottaColor} />

        {/* Đường gạch mạ vàng chuyển sắc */}
        <path d="M5 32 H335" stroke="url(#crestGold)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// 4. Dải phân cách hoa lá cỏ cây (BotanicalVineDivider)
export function BotanicalVineDivider({
  className = '',
  goldColor = '#D4AF37',
  terracottaColor = '#8C2B0A',
}: {
  className?: string;
  goldColor?: string;
  terracottaColor?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-4 select-none pointer-events-none ${className}`}>
      <svg
        width="280"
        height="30"
        viewBox="0 0 280 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full drop-shadow-xs"
      >
        {/* Nhánh trái */}
        <path
          d="M8 15 C50 15 75 23 105 19 C122 17 132 15 136 15"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M48 16 C56 10 65 12 67 17 C65 19 56 19 48 16 Z" fill={terracottaColor} opacity="0.85" />
        <path d="M86 20 C92 24 100 22 102 18 C100 16 92 17 86 20 Z" fill={goldColor} opacity="0.95" />

        {/* Hoa thị trung tâm */}
        <circle cx="140" cy="15" r="5.5" fill={goldColor} />
        <circle cx="140" cy="15" r="3" fill={terracottaColor} />
        <circle cx="129" cy="15" r="2.2" fill={goldColor} />
        <circle cx="151" cy="15" r="2.2" fill={goldColor} />

        {/* Nhánh phải đối xứng */}
        <path
          d="M272 15 C230 15 205 23 175 19 C158 17 148 15 144 15"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M232 16 C224 10 215 12 213 17 C215 19 224 19 232 16 Z" fill={terracottaColor} opacity="0.85" />
        <path d="M194 20 C188 24 180 22 178 18 C180 16 188 17 194 20 Z" fill={goldColor} opacity="0.95" />
      </svg>
    </div>
  );
}

// 5. Cành lá nguyệt quế trang trí huy hiệu & thẻ nhỏ (BotanicalLeafSprig)
export function BotanicalLeafSprig({
  className = '',
  size = 24,
  color = '#8C2B0A',
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 20 C10 18 16 12 20 4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M6 18 C4 13 8 10 11 14 C9 17 7 18 6 18 Z" fill="#D4AF37" opacity="0.9" />
      <path d="M12 14 C11 9 16 7 18 11 C16 13 13 14 12 14 Z" fill={color} opacity="0.85" />
      <path d="M17 9 C17 5 21 4 22 7 C20 9 18 9 17 9 Z" fill="#D4AF37" opacity="0.9" />
    </svg>
  );
}

// 6. Hình mờ thực vật hoàng gia nền trang (BotanicalWatermark)
export function BotanicalWatermark({
  className = '',
  opacity = 0.08,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#8C2B0A" strokeWidth="1.6" strokeLinecap="round">
          {/* Dải xoắn lá Acanthus uốn lượn liên hoàn */}
          <path d="M-80 160 C120 70 200 240 340 160 C480 80 580 290 720 180 C860 80 920 250 1080 160" />
          <path d="M-80 380 C140 290 220 450 380 370 C520 290 620 500 780 390 C920 290 980 460 1100 370" />
          <path d="M-80 600 C110 510 240 670 400 590 C560 510 660 710 820 600 C960 500 1020 680 1150 590" />

          {/* Vòng nguyệt quế và hoa thị hoàng gia mạ vàng chìm */}
          <circle cx="340" cy="160" r="18" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx="720" cy="180" r="18" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx="380" cy="370" r="18" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx="780" cy="390" r="18" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx="400" cy="590" r="18" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx="820" cy="600" r="18" stroke="#D4AF37" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
}
