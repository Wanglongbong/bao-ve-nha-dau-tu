import React from 'react';

/**
 * Common SVG Definitions: Unified luminous gradients for all section filigrees
 */
export function FiligreeDefs() {
  return (
    <svg width="0" height="0" className="absolute hidden" aria-hidden="true">
      <defs>
        {/* Luminous Imperial Orange Gradient */}
        <linearGradient id="luminousOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="25%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#FFA940" />
          <stop offset="75%" stopColor="#FF851B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Luminous Radiant Amber-Gold Gradient */}
        <linearGradient id="amberSunburstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#FDE68A" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Fade Line Gradient Left */}
        <linearGradient id="fadeLineLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0" />
          <stop offset="70%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.9" />
        </linearGradient>

        {/* Fade Line Gradient Right */}
        <linearGradient id="fadeLineRight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * 1. HOA VĂN MỤC LỤC SÁU TRỤ CỘT: THỨC CỘT HY LẠP & DÂY NGUYỆT QUẾ (PillarsFiligree)
 */
export function PillarsFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Cột trụ Corinthian trung tâm cách điệu */}
        <path d="M71 6 H79 M72 6 V22 M78 6 V22 M70 22 H80 M69 24 H81 M71 4 H79" stroke="#FF7A00" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="75" cy="14" r="1.8" fill="#F59E0B" />
        
        {/* Vòm cuốn xoắn ốc Ionic 2 bên đỉnh cột */}
        <path d="M71 8 C68 5, 65 6, 65 9 C65 11, 68 11, 69 9" stroke="#FF922B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M79 8 C82 5, 85 6, 85 9 C85 11, 82 11, 81 9" stroke="#FF922B" strokeWidth="1.2" strokeLinecap="round" />

        {/* Dây lá nguyệt quế vươn sang trái */}
        <path d="M63 14 C56 10, 48 16, 40 14 C34 12, 28 15, 20 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M52 11 C55 8, 59 10, 56 14 C54 13, 53 12, 52 11 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <path d="M38 11 C41 8, 45 10, 42 14 C40 13, 39 12, 38 11 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="20" cy="14" r="1.8" fill="#F59E0B" />

        {/* Dây lá nguyệt quế vươn sang phải đối xứng */}
        <path d="M87 14 C94 10, 102 16, 110 14 C116 12, 122 15, 130 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M98 11 C95 8, 91 10, 94 14 C96 13, 97 12, 98 11 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <path d="M112 11 C109 8, 105 10, 108 14 C110 13, 111 12, 112 11 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="130" cy="14" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 2. HOA VĂN MỤC LỤC MA TRẬN & ĐẠI ÁN: CÁN CÂN CÔNG LÝ & KHIÊN HỘ VỆ (VaultFiligree)
 */
export function VaultFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Khiên công lý trung tâm */}
        <path d="M75 5 L81 8 V15 C81 19, 78 22, 75 24 C72 22, 69 19, 69 15 V8 L75 5 Z" fill="#FFF4E6" stroke="#FF7A00" strokeWidth="1.3" />
        <path d="M75 9 V19 M72 13 H78" stroke="#D9480F" strokeWidth="1.2" strokeLinecap="round" />

        {/* Cán cân công lý cân bằng 2 bên */}
        <path d="M69 11 H55 M81 11 H95" stroke="#FF922B" strokeWidth="1.2" strokeLinecap="round" />
        {/* Đĩa cân trái */}
        <path d="M55 11 L52 18 H58 L55 11 Z" stroke="#FF7A00" strokeWidth="1" fill="#FFE8CC" />
        <path d="M50 18 C50 20, 60 20, 60 18" stroke="#D9480F" strokeWidth="1" />

        {/* Đĩa cân phải */}
        <path d="M95 11 L92 18 H98 L95 11 Z" stroke="#FF7A00" strokeWidth="1" fill="#FFE8CC" />
        <path d="M90 18 C90 20, 100 20, 100 18" stroke="#D9480F" strokeWidth="1" />

        {/* Nét lượn bảo vệ 2 đầu */}
        <path d="M48 16 C38 12, 30 16, 18 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="18" cy="14" r="1.8" fill="#F59E0B" />
        <path d="M102 16 C112 12, 120 16, 132 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="132" cy="14" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 3. HOA VĂN MỤC LỤC AI PHÁP LÝ: MẠCH GUILLOCHE & SAO TRÍ TUỆ (AiSuiteFiligree)
 */
export function AiSuiteFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Ngôi sao 8 cánh trí tuệ nhân tạo */}
        <g transform="translate(75, 14)">
          <path d="M 0 -9 L 2.5 -3 L 8.5 -3 L 4 1 L 6 7 L 0 3.5 L -6 7 L -4 1 L -8.5 -3 L -2.5 -3 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="2.2" fill="#FF7A00" />
        </g>

        {/* Nút mạch viễn thông & đường sóng Guilloche */}
        <path d="M64 14 H52 M52 14 L46 8 H34" stroke="#FF922B" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="46" cy="8" r="1.8" fill="#FF7A00" />
        <circle cx="34" cy="8" r="1.8" fill="#F59E0B" />
        <path d="M52 14 L46 20 H20" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="46" cy="20" r="1.8" fill="#FF7A00" />
        <circle cx="20" cy="20" r="1.8" fill="#F59E0B" />

        <path d="M86 14 H98 M98 14 L104 8 H116" stroke="#FF922B" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="104" cy="8" r="1.8" fill="#FF7A00" />
        <circle cx="116" cy="8" r="1.8" fill="#F59E0B" />
        <path d="M98 14 L104 20 H130" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="104" cy="20" r="1.8" fill="#FF7A00" />
        <circle cx="130" cy="20" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 4. HOA VĂN MỤC LỤC HỌC THUẬT: CUỐN SÁCH LUẬT & DÂY DẪN TRI THỨC (AcademicFiligree)
 */
export function AcademicFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Cuốn sách mở học thuật trung tâm */}
        <path d="M75 9 C72 7, 67 7, 64 9 V21 C67 19, 72 19, 75 21 C78 19, 83 19, 86 21 V9 C83 7, 78 7, 75 9 Z" fill="#FFF4E6" stroke="#FF7A00" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M75 9 V21" stroke="#D9480F" strokeWidth="1.2" />

        {/* Cành bút lông & nhánh tri thức vươn sang trái */}
        <path d="M62 15 C54 11, 44 18, 34 14 C28 12, 22 15, 16 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M50 12 C52 9, 56 11, 54 15 C52 14, 51 13, 50 12 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="16" cy="14" r="1.8" fill="#F59E0B" />

        {/* Cành bút lông & nhánh tri thức vươn sang phải */}
        <path d="M88 15 C96 11, 106 18, 116 14 C122 12, 128 15, 134 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M100 12 C98 9, 94 11, 96 15 C98 14, 99 13, 100 12 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="134" cy="14" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 5. HOA VĂN MỤC LỤC NGUYÊN TẮC: DẤU TRIỆN & LA BÀN ĐẠO ĐỨC (PrinciplesFiligree)
 */
export function PrinciplesFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Dấu triện la bàn hình thoi kép trung tâm */}
        <path d="M75 4 L84 14 L75 24 L66 14 Z" fill="#FFF4E6" stroke="#FF7A00" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M75 7 L81 14 L75 21 L69 14 Z" stroke="#FF922B" strokeWidth="0.8" />
        <circle cx="75" cy="14" r="2.2" fill="#D9480F" />

        {/* 4 Nét chỉ hướng kim la bàn */}
        <path d="M75 4 V7 M75 21 V24 M66 14 H69 M81 14 H84" stroke="#D9480F" strokeWidth="1.2" strokeLinecap="round" />

        {/* Dây thắt vương giả 2 bên */}
        <path d="M64 14 C56 8, 48 20, 38 14 C30 9, 22 17, 14 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="38" cy="14" r="1.8" fill="#FF7A00" />
        <circle cx="14" cy="14" r="1.8" fill="#F59E0B" />

        <path d="M86 14 C94 8, 102 20, 112 14 C120 9, 128 17, 136 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="112" cy="14" r="1.8" fill="#FF7A00" />
        <circle cx="136" cy="14" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 6. HOA VĂN MỤC LỤC ĐỘI NGŨ: HUÂN CHƯƠNG & VÒNG NGUYỆT QUẾ TINH ANH (TeamFiligree)
 */
export function TeamFiligree({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
      <svg width="150" height="28" viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Huân chương ngôi sao danh dự trung tâm */}
        <circle cx="75" cy="14" r="9" fill="#FFF4E6" stroke="#FF7A00" strokeWidth="1.3" />
        <path d="M75 8 L76.8 12 L81.2 12.4 L77.8 15.2 L78.9 19.5 L75 17.2 L71.1 19.5 L72.2 15.2 L68.8 12.4 L73.2 12 Z" fill="#F59E0B" stroke="#D9480F" strokeWidth="0.8" />
        
        {/* Dải nơ huân chương 2 bên */}
        <path d="M65 14 C58 9, 52 19, 44 14 C36 10, 28 17, 18 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M50 11 C52 8, 56 10, 53 14 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="18" cy="14" r="1.8" fill="#F59E0B" />

        <path d="M85 14 C92 9, 98 19, 106 14 C114 10, 122 17, 132 14" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M100 11 C98 8, 94 10, 97 14 Z" fill="#FFE8CC" stroke="#FF7A00" strokeWidth="0.8" />
        <circle cx="132" cy="14" r="1.8" fill="#F59E0B" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] sm:max-w-[200px] bg-gradient-to-l from-transparent via-[#FF8A00]/40 to-[#FF6B00]" />
    </div>
  );
}

/**
 * 7. KHUNG HOA VĂN MỤC LỤC TOÀN VĂN ĐỀ CƯƠNG 25 TRANG (ViewerBorderFlourish)
 * Dùng làm nẹp góc hoa văn sang trọng bao quanh thanh chọn chương
 */
export function ViewerBorderFlourish() {
  return (
    <div className="flex items-center justify-between w-full px-2 py-1 select-none pointer-events-none" aria-hidden="true">
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22 V6 C2 3.8, 3.8 2, 6 2 H22" stroke="#FF7A00" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M6 18 V8 C6 6.9, 6.9 6, 8 6 H18" stroke="#FFA940" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="6" cy="6" r="2" fill="#F59E0B" />
        <path d="M10 2 C14 5, 18 3, 22 2" stroke="#FF8A00" strokeWidth="1" strokeLinecap="round" />
      </svg>

      <div className="h-[1px] flex-1 mx-3 bg-gradient-to-r from-[#FF7A00]/30 via-[#F59E0B]/50 to-[#FF7A00]/30" />

      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34 22 V6 C34 3.8, 32.2 2, 30 2 H14" stroke="#FF7A00" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M30 18 V8 C30 6.9, 29.1 6, 28 6 H18" stroke="#FFA940" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="30" cy="6" r="2" fill="#F59E0B" />
        <path d="M26 2 C22 5, 18 3, 14 2" stroke="#FF8A00" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}
