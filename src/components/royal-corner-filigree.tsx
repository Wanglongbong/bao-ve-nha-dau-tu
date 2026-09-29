import React from 'react';

/**
 * Khung hoa văn góc 4 góc chuẩn phong cách chứng chỉ học thuật / pháp lý
 * Tông màu mạ đồng cam hoàng gia (Warm Royal Amber Bronze)
 */
export function RoyalCornerFiligree() {
  return (
    <div className="certificate-corner-container pointer-events-none" aria-hidden="true">
      <div className="certificate-corner-item top-left">
        <CornerSvg />
      </div>
      <div className="certificate-corner-item top-right">
        <CornerSvg />
      </div>
      <div className="certificate-corner-item bottom-left">
        <CornerSvg />
      </div>
      <div className="certificate-corner-item bottom-right">
        <CornerSvg />
      </div>
    </div>
  );
}

function CornerSvg() {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="cornerOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9A3412" />
          <stop offset="35%" stopColor="#EA580C" />
          <stop offset="70%" stopColor="#F97316" />
          <stop offset="90%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
      </defs>

      {/* Viền ngoài góc vuông đôi */}
      <path
        d="M 6 48 L 6 6 L 48 6"
        stroke="url(#cornerOrangeGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 12 38 L 12 12 L 38 12"
        stroke="#C2410C"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* Dây lá cuộn mềm mại góc học thuật */}
      <path
        d="M 14 14 C 28 8, 44 18, 62 10 C 78 4, 88 14, 104 11"
        stroke="url(#cornerOrangeGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 32 10 C 36 5, 46 6, 42 12 C 38 15, 34 14, 32 10 Z"
        fill="#FED7AA"
        stroke="#C2410C"
        strokeWidth="0.6"
      />
      <path
        d="M 54 8 C 58 3, 68 4, 64 10 C 60 13, 56 12, 54 8 Z"
        fill="#FED7AA"
        stroke="#C2410C"
        strokeWidth="0.6"
      />
      <path
        d="M 76 6 C 80 1, 90 2, 86 8 C 82 11, 78 10, 76 6 Z"
        fill="#FED7AA"
        stroke="#C2410C"
        strokeWidth="0.6"
      />

      {/* Nhánh đối xứng cạnh dọc */}
      <path
        d="M 14 14 C 8 28, 18 44, 10 62 C 4 78, 14 88, 11 104"
        stroke="url(#cornerOrangeGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 10 32 C 5 36, 6 46, 12 42 C 15 38, 14 34, 10 32 Z"
        fill="#FED7AA"
        stroke="#C2410C"
        strokeWidth="0.6"
      />
      <path
        d="M 8 54 C 3 58, 4 68, 10 64 C 13 60, 12 56, 8 54 Z"
        fill="#FED7AA"
        stroke="#C2410C"
        strokeWidth="0.6"
      />

      <circle cx="12" cy="12" r="3.2" fill="#EA580C" stroke="#9A3412" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="1.2" fill="#FFFBF7" />
    </svg>
  );
}

/**
 * Họa tiết dải phân cách hoàng gia (Dùng phân đoạn các phần trong trang)
 */
export function RoyalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`royal-divider-wrap ${className}`} aria-hidden="true">
      <div className="royal-divider-line" />
      <svg
        width="110"
        height="24"
        viewBox="0 0 110 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="royal-divider-crest"
      >
        <path
          d="M55 2L57.5 9.5H65L59 13.5L61.5 21L55 16.5L48.5 21L51 13.5L45 9.5H52.5L55 2Z"
          fill="#EA580C"
          stroke="#C2410C"
          strokeWidth="0.75"
        />
        <circle cx="55" cy="13" r="2" fill="#FFFBF7" />
        <path
          d="M44 12C38 6 30 7 24 12C18 17 10 16 2 12"
          stroke="#EA580C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="12" r="1.8" fill="#F97316" />
        <path
          d="M66 12C72 6 80 7 86 12C92 17 100 16 108 12"
          stroke="#EA580C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="86" cy="12" r="1.8" fill="#F97316" />
      </svg>
      <div className="royal-divider-line" />
    </div>
  );
}

