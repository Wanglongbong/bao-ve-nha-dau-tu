import React from 'react';
import { CORE_PAIN_POINTS, STRATEGIC_PROPOSALS } from '@/lib/research-data';
import { AlertCircle, ShieldAlert, Scale, UserX, Network, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export function PainPointsSection() {
  return (
    <section id="kien-nghi" className="py-20 bg-[#FFFBF7] border-b border-orange-100">
      <div className="site-shell">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="eyebrow">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Bất Cập &amp; Giải Pháp Đột Phá
          </span>
          <h2 className="section-title">
            Những Khoảng Trống Thể Chế &amp; 5 Kiến Nghị Hoàn Thiện
          </h2>
          <p className="section-subtitle">
            Nhận diện 4 nhóm tồn tại căn bản trong thực tiễn bảo vệ quyền lợi nhà đầu tư cá nhân và lộ trình 5 giải pháp trọng tâm nhằm lành mạnh hóa thị trường chứng khoán Việt Nam.
          </p>
        </div>

        {/* 4 Pillars of Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {CORE_PAIN_POINTS.map((pillar, idx) => (
            <div key={idx} className="amber-card p-6 md:p-8 bg-white border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">{pillar.title}</h3>
                  <span className="text-xs text-orange-700 font-semibold">{pillar.subtitle}</span>
                </div>
              </div>

              <ul className="space-y-3 mt-4">
                {pillar.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Strategic Proposals Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 inline-block mb-3">
            Đề Xuất Nhóm Nghiên Cứu
          </span>
          <h3 className="font-serif font-bold text-2xl md:text-3xl text-slate-900">
            5 Đột Phá Nâng Cao Hiệu Quả Bảo Vệ Nhà Đầu Tư Cá Nhân
          </h3>
        </div>

        {/* 5 Proposals Timeline Cards */}
        <div className="space-y-4">
          {STRATEGIC_PROPOSALS.map((prop, idx) => (
            <div
              key={idx}
              className="amber-card p-6 bg-white border-orange-200 hover:border-orange-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-serif font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  {prop.order}
                </span>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h4 className="font-serif font-bold text-lg text-slate-900">{prop.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold bg-orange-100 text-orange-800">
                      {prop.badge}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {prop.description}
                  </p>
                </div>
              </div>

              <div className="md:w-72 flex-shrink-0 p-3 rounded-lg bg-orange-50/60 border border-orange-200/80 text-xs">
                <span className="font-bold text-orange-900 block mb-0.5">Tác động kỳ vọng:</span>
                <p className="text-slate-700 leading-normal">{prop.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
