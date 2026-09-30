import React, { useState } from 'react';
import { TEAM_MEMBERS, PROJECT_METADATA, TeamMember } from '@/lib/research-data';
import { Users, Calendar, CheckCircle2, Award, ArrowRight, Camera, Sparkles, ExternalLink } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface TeamWorkspaceSectionProps {
  onOpenDetailModal: (memberSlug?: string) => void;
  onNavigateToTeamPage?: () => void;
}

export function TeamWorkspaceSection({ onOpenDetailModal, onNavigateToTeamPage }: TeamWorkspaceSectionProps) {
  const [avatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('chung_khoan_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleOpenDetail = (memberSlug?: string) => {
    soundFx.playTap();
    if (onNavigateToTeamPage) {
      onNavigateToTeamPage();
    } else {
      onOpenDetailModal(memberSlug);
    }
  };

  return (
    <section id="nhom" className="py-20 bg-[#FFFDFB] border-b border-orange-100">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <Users className="w-4 h-4 text-orange-600" />
              Hội Đồng Nghiên Cứu &amp; Nhân Sự Đề Tài
            </span>
            <h2 className="section-title">
              Ban Nghiên Cứu &amp; Đội Ngũ 8 Thành Viên
            </h2>
            <p className="section-subtitle">
              Sinh viên Khoa Luật – Học viện Ngân hàng. Cấu trúc phối hợp toàn diện giữa Thẩm định đề cương, Nghiên cứu chuyên sâu, Biên tập Word, Phát triển Web Portal số hóa, Thiết kế Slide trình chiếu và Thuyết trình phản biện trước Hội đồng.
            </p>
          </div>

          <button
            onClick={() => handleOpenDetail()}
            className="orange-button cursor-pointer shrink-0 self-start lg:self-end font-serif"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Khám Phá Trang Đội Ngũ (8 Thành Viên)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Meta Bar - Luxury Royal Amber & Pale Gold */}
        <div className="amber-card p-6 bg-gradient-to-r from-white via-orange-50/40 to-amber-50/30 border-orange-200 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800 mb-1">
                <span>{PROJECT_METADATA.institution}</span>
                <span>•</span>
                <span className="text-amber-700">Lớp LAW10A</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                {PROJECT_METADATA.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-orange-200 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-slate-400 block font-semibold">Quy mô nhân sự:</span>
              <strong className="text-orange-600 text-sm">{PROJECT_METADATA.teamSize}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Dung lượng Word:</span>
              <strong className="text-slate-800 text-sm">{PROJECT_METADATA.estimatedPages}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Tiến độ bàn giao:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành 100%
              </span>
            </div>
          </div>
        </div>

        {/* 8 Members Grid - 4 Columns on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, index) => {
            const avatarSrc = avatars[member.slug] || member.avatarUrl;
            const isLead = member.role.includes('Nhóm trưởng') || member.role.includes('Trưởng nhóm');
            const isTech = member.category === 'tech';
            const isPres = member.category === 'presentation';

            return (
              <article
                key={member.id}
                onClick={() => handleOpenDetail(member.slug)}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  isLead
                    ? 'border-orange-400 ring-1 ring-orange-300/60'
                    : isTech
                    ? 'border-amber-400/80 hover:border-orange-400'
                    : 'border-orange-200 hover:border-orange-400'
                }`}
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-56 w-full rounded-lg overflow-hidden bg-[#FAF5EE] border border-orange-200/80 mb-4">
                    <img
                      src={avatarSrc}
                      alt={member.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Fallback Avatar */}
                    <div
                      style={{ display: 'none' }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex flex-col items-center justify-center p-3 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xl font-serif font-bold text-white mb-1">
                        {member.name.split(' ').slice(-1)[0]?.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white">{member.name}</span>
                    </div>

                    {/* Member Number Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-orange-600/90 backdrop-blur-xs text-white font-mono text-[10px] font-bold shadow-xs">
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Category Label */}
                    <div className="absolute top-2.5 right-2.5">
                      {isLead ? (
                        <span className="px-2 py-0.5 rounded bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                          Trưởng nhóm
                        </span>
                      ) : isTech ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                          Kỹ Sư Web
                        </span>
                      ) : isPres ? (
                        <span className="px-2 py-0.5 rounded bg-orange-500 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                          Thuyết Trình
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {member.studentId}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-orange-800 line-clamp-1 mb-2.5">
                      {member.role}
                    </p>

                    {/* Evaluation Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gradient-to-r from-[#FAF1D7] to-[#FAF5E8] border border-[#C59B27]/60 text-[10px] font-bold text-[#8C6B18] shadow-2xs mb-3">
                      <Award className="w-3 h-3 text-[#C59B27]" />
                      <span>{member.evaluationNote}</span>
                    </div>

                    {/* Phân công tóm tắt */}
                    <div className="p-2.5 rounded-lg bg-[#FFF9F2] border border-orange-100 text-xs mb-3">
                      <span className="text-[10px] font-bold text-orange-950 block uppercase tracking-wider mb-1">
                        Nhiệm vụ chính:
                      </span>
                      <ul className="space-y-1">
                        {member.tasks.slice(0, 2).map((t, idx) => (
                          <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
                            <span className="text-orange-500 font-bold select-none leading-none mt-0.5">•</span>
                            <span className="line-clamp-2">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-500" /> Hạn: {member.deadline}
                  </span>
                  <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Banner CTA to Dedicated Team Page */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-orange-500/30">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Chuyên Trang Nhân Sự Đề Tài
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
              Xem Hồ Sơ Chi Tiết &amp; Phân Công Từng Thành Viên
            </h3>
            <p className="text-white/90 text-sm font-serif leading-relaxed">
              Trang riêng biệt được thiết kế theo quy chuẩn học thuật cao cấp với hệ thống tải ảnh hàng loạt, phân loại vai trò chuyên trách (Trưởng nhóm, Kỹ thuật Web Portal, Nghiên cứu Word, Slide &amp; Thuyết trình) và cơ chế đánh giá đóng góp A = 30%.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTeamPage ? onNavigateToTeamPage() : handleOpenDetail()}
            className="cursor-pointer shrink-0 px-6 py-3.5 rounded-xl bg-white text-orange-950 font-serif font-bold text-sm shadow-md hover:bg-amber-50 hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>Mở Trang Đội Ngũ Đầy Đủ</span>
            <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
