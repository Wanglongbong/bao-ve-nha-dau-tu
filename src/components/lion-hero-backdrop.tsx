import React from 'react';

/**
 * LionHeroBackdrop:
 * HÌNH TƯỢNG SƯ TỬ HOÀNG GIA BAN ĐẦU (The Original Heraldic Guardian Lion)
 * - Huy hiệu hoàng gia với vương miện, vòng nguyệt quế và nét viền cam (#F97316 / #EA580C)
 * - Ruột màu cam nhạt bán trong suốt tinh tế
 * - Hiệu ứng mix-blend-mode multiply giúp nền trắng tàng hình hoàn toàn trên nền kem sáng
 * - Vị trí căn phải thanh lịch, không đè lấn lên chữ, kết hợp vầng hào quang hổ phách
 */
export function LionHeroBackdrop() {
  return (
    <div className="lion-grand-backdrop" aria-hidden="true">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Huy hiệu Sư tử hoàng gia nguyên bản: Vương miện, vòng nguyệt quế, nét viền cam, ruột cam nhạt & dải ruy băng chữ */}
        <img
          src="/guardian-lion-crest.jpg"
          alt="Huy hiệu Sư tử bảo hộ hoàng gia nguyên bản với vương miện, vòng nguyệt quế, nét viền cam và dải chữ bên dưới"
          className="lion-grand-backdrop-img"
          loading="eager"
        />
      </div>
    </div>
  );
}
