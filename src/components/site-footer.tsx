import React, { useState } from 'react';
import { Shield, BookOpen, Scale, Award, Heart, QrCode as QrIcon, Maximize2, ExternalLink } from 'lucide-react';
import { QrCodeImage, QrCodeModal } from '@/components/qr-code-modal';
import { soundFx } from '@/lib/audio-effects';
import { BotanicalWatermark } from '@/components/botanical-filigree';

export function SiteFooter() {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleOpenQr = () => {
    soundFx.playChime();
    setIsQrModalOpen(true);
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-[#FAF7F2] via-[#F5EEE6] to-[#EFE5DA] text-[#1C130E] pt-16 pb-12 border-t border-[#D4AF37]/50 relative overflow-hidden font-serif shadow-inner">
        {/* Decorative botanical watermark and artistic diffusion glow */}
        <BotanicalWatermark opacity={0.03} />
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #C2410C 0%, transparent 70%)' }}
        />

        <div className="site-shell relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#EBD7C7]">
            {/* Col 1: Identity & Research Metadata (5 cols) */}
            <div className="md:col-span-5 pr-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C2B0A] to-[#C2410C] text-white flex items-center justify-center shadow-md shadow-[#8C2B0A]/20">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1C130E] tracking-wide text-artistic-halo">
                    BẢO VỆ NHÀ ĐẦU TƯ CÁ NHÂN
                  </h3>
                  <p className="text-xs text-[#8C2B0A] font-bold uppercase tracking-wider">
                    Học viện Ngân hàng • Khoa Luật • Lớp 261LAW10A01
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#3D2E24] leading-relaxed mb-4 font-serif">
                Cổng thông tin và nền tảng số hóa đề tài nghiên cứu pháp luật chứng khoán: 
                Bảo vệ quyền lợi hợp pháp của nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam trước các hành vi thao túng giá, gian lận công bố thông tin và lừa đảo phát hành.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C2B0A] bg-[#FFFDF9] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2 w-fit font-bold shadow-xs">
                <Award className="w-4 h-4 text-[#C2410C]" />
                <span>Nhóm 2 · GVHD: TS. Nguyễn Phương Thảo · Năm 2026</span>
              </div>
            </div>

            {/* Col 2: Legal Foundation (3 cols) */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#8C2B0A] mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C2410C]" /> Căn Cứ Pháp Lý Trọng Tâm
              </h4>
              <ul className="space-y-2 text-xs text-[#3D2E24] font-serif">
                <li className="hover:text-[#C2410C] transition">• Luật Chứng khoán 2019 (sửa đổi 2024)</li>
                <li className="hover:text-[#C2410C] transition">• Nghị định 245/2025/NĐ-CP (Quản trị CTĐC)</li>
                <li className="hover:text-[#C2410C] transition">• Nghị định 155/2020/NĐ-CP &amp; 156/2020/NĐ-CP</li>
                <li className="hover:text-[#C2410C] transition">• Thông tư 68/2024/TT-BTC (Non-prefunding)</li>
                <li className="hover:text-[#C2410C] transition">• Bộ luật Hình sự 2015 (Điều 209, 211)</li>
                <li className="hover:text-[#C2410C] transition">• Nghị quyết 57-NQ/TW (Giám sát AI)</li>
              </ul>
            </div>

            {/* Col 3: Research Team (2 cols) */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#8C2B0A] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C2410C]" /> Ban Nghiên Cứu
              </h4>
              <ul className="space-y-1.5 text-xs text-[#3D2E24] font-serif">
                <li><strong className="text-[#1C130E]">1. Lê Đức Minh:</strong> Trưởng nhóm</li>
                <li><strong className="text-[#1C130E]">2. Vũ Anh Quân:</strong> Word &amp; Web</li>
                <li><strong className="text-[#1C130E]">3. Hoàng Thu Hiền:</strong> Chương 2</li>
                <li><strong className="text-[#1C130E]">4. Ngô Quang Trường:</strong> Chương 2</li>
                <li><strong className="text-[#1C130E]">5. Bùi Minh Khuê:</strong> Chương 3</li>
                <li><strong className="text-[#1C130E]">6. Tạ Thị Thu Hoài:</strong> Kết luận</li>
                <li><strong className="text-[#1C130E]">7. Đinh Thị Minh Hoà:</strong> Slides &amp; Báo cáo</li>
                <li><strong className="text-[#1C130E]">8. Trần Sỹ Long:</strong> Slides &amp; Báo cáo</li>
              </ul>
            </div>

            {/* Col 4: Interactive QR Code in Venetian Terracotta Luxury Card */}
            <div className="md:col-span-2 flex flex-col items-center text-center bg-gradient-to-br from-[#5E1A04] via-[#8C2B0A] to-[#A3350E] p-4 rounded-3xl border border-[#D4AF37]/60 shadow-xl shadow-[#5E1A04]/25 text-white">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F5E6D8] mb-2.5 flex items-center gap-1.5">
                <QrIcon className="w-4 h-4 text-[#D4AF37]" /> Quét Mã QR Website
              </h4>
              
              <div 
                onClick={handleOpenQr}
                className="relative group cursor-pointer p-2 bg-[#FFFDF9] rounded-2xl border border-[#D4AF37]/80 hover:border-[#D4AF37] shadow-md transition-all hover:scale-105"
                title="Bấm để phóng to mã QR"
              >
                <QrCodeImage size={105} />
                <div className="absolute inset-0 bg-[#8C2B0A]/15 group-hover:bg-[#8C2B0A]/25 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 rounded-lg bg-[#5E1A04] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-bold shadow-sm flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Phóng to
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-[#FAF7F2] font-bold mt-2 leading-tight">
                Mở trên điện thoại di động
              </span>
              <span className="text-[10px] text-[#D4AF37]/90 italic mt-0.5">
                (Click vào mã QR để phóng to)
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Dedicated Venetian Espresso Bronze Bottom Bar */}
      <div className="bg-gradient-to-r from-[#1C130E] via-[#2B1D15] to-[#3D2E24] text-[#FAF7F2] py-4.5 border-t border-[#D4AF37]/40 relative z-20 shadow-2xl">
        <div className="site-shell flex flex-col sm:flex-row items-center justify-between text-xs font-serif gap-2.5">
          <p className="m-0 font-medium tracking-wide text-[#FAF7F2]/90">
            © 2026 Nhóm Nghiên Cứu 2 — Lớp học phần <span className="font-bold text-[#D4AF37]">261LAW10A01</span>, Khoa Luật, Học viện Ngân hàng.
          </p>
          <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Hệ thống Pháp lý: Minh bạch • Công bằng • Bảo vệ Nhà đầu tư</span>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Large View */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </>
  );
}
