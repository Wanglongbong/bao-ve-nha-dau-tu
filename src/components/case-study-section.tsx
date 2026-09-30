import React, { useState } from 'react';
import { CASE_STUDIES, CaseStudy } from '@/lib/research-data';
import { ShieldAlert, AlertTriangle, FileWarning, Search, ExternalLink, ArrowUpRight } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

export function CaseStudySection() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(CASE_STUDIES[0]);
  const [filterViolation, setFilterViolation] = useState<string>('all');

  const handleFilter = (cat: string) => {
    soundFx.playTap();
    setFilterViolation(cat);
  };

  const handleSelectCase = (cs: CaseStudy) => {
    soundFx.playTap();
    setSelectedCase(cs);
  };

  const filteredCases = CASE_STUDIES.filter((c) => {
    return filterViolation === 'all' || c.violationType === filterViolation;
  });

  return (
    <section id="an-diem" className="py-20 bg-[#FFFDFB] border-b border-orange-100">
      <div className="site-shell">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="eyebrow">
            <ShieldAlert className="w-4 h-4 text-orange-600" />
            Thực Tiễn Áp Dụng &amp; Án Điểm
          </span>
          <h2 className="section-title">
            Hồ Sơ Các Đại Án Vi Phạm &amp; Bài Học Pháp Lý
          </h2>
          <p className="section-subtitle">
            Giai đoạn 2020 – 2025, UBCKNN đã ban hành hơn 2.731 quyết định xử phạt vi phạm hành chính và chuyển hàng loạt vụ án nghiêm trọng sang cơ quan điều tra hình sự (FLC, Tân Hoàng Minh, Louis Holdings, ASA...).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {['all', 'Thao túng giá', 'Lừa đảo phát hành trái phiếu', 'Vi phạm Công bố thông tin'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                filterViolation === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-orange-200 text-slate-700 hover:border-orange-400'
              }`}
            >
              {cat === 'all' ? `Tất cả vụ việc (${CASE_STUDIES.length})` : cat}
            </button>
          ))}
        </div>

        {/* Case grid & active case inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of cases */}
          <div className="lg:col-span-6 space-y-4">
            {filteredCases.map((cs) => (
              <div
                key={cs.id}
                onClick={() => handleSelectCase(cs)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedCase.id === cs.id
                    ? 'bg-orange-50/80 border-orange-500 shadow-lg ring-1 ring-orange-400/50'
                    : 'bg-white border-orange-100 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold bg-orange-100 text-orange-800">
                    {cs.violationType}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{cs.period}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 mb-2 leading-snug">
                  {cs.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cs.entities.map((ent, idx) => (
                    <span key={idx} className="text-[0.7rem] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {ent}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong className="text-slate-800">Thiệt hại NĐT:</strong> {cs.investorDamage}
                </p>
              </div>
            ))}
          </div>

          {/* Detailed case deep dive */}
          <div className="lg:col-span-6 amber-card p-6 md:p-8 bg-white border-orange-300 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                {selectedCase.status}
              </span>
              <span className="text-xs font-mono text-orange-700 font-semibold">
                Thời kỳ vi phạm: {selectedCase.period}
              </span>
            </div>

            <h3 className="font-serif font-bold text-xl text-slate-900 mb-4 leading-snug">
              {selectedCase.title}
            </h3>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                <span className="font-bold text-orange-900 block mb-1 text-xs uppercase tracking-wider">
                  Hình Thức Chế Tài Đã Áp Dụng:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedCase.penalty}</p>
              </div>

              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200">
                <span className="font-bold text-red-900 block mb-1 text-xs uppercase tracking-wider">
                  Mức Độ Tổn Thương Của Nhà Đầu Tư Cá Nhân:
                </span>
                <p className="text-red-950 leading-relaxed">{selectedCase.investorDamage}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-orange-200 shadow-sm">
                <span className="font-bold text-slate-900 block mb-1 text-xs uppercase tracking-wider">
                  Bài Học Hoàn Thiện Thể Chế Pháp Lý:
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedCase.legalLesson}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Callout: Chế tài hành chính vs Thiệt hại thực tế */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-amber-50 text-[#49382E] border border-orange-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-orange-700 font-bold">Nghịch Lý Chế Tài Hiện Hành</span>
              <h3 className="font-serif text-xl md:text-2xl font-bold mt-1 mb-2">
                Mức Phạt Hành Chính Quá Thấp So Với Lợi Ích Trục Lợi
              </h3>
              <p className="text-[#665247] text-xs md:text-sm max-w-2xl leading-relaxed">
                Nhiều doanh nghiệp sẵn sàng chịu phạt 92,5 triệu đồng hoặc vài trăm triệu đồng để chậm công bố tài chính hay phát hành trái phiếu không phép, vì lợi ích thu về lên tới hàng chục tỷ đồng. Đây chính là lỗ hổng thúc đẩy đề xuất nâng trần xử phạt và cấm tham gia thị trường có thời hạn.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white border border-orange-200 p-4 rounded-xl text-center min-w-[200px] shadow-xs">
              <span className="text-3xl font-bold text-orange-700 font-serif">2.731+</span>
              <span className="block text-[0.7rem] text-[#725E51] mt-1 uppercase font-semibold">Quyết định xử phạt (2020-2025)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
