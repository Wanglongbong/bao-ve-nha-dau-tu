import React, { useState } from 'react';
import { SURVEILLANCE_SYSTEM } from '@/lib/research-data';
import { Eye, Shield, Activity, Landmark, ArrowRight, Cpu, AlertCircle, Database } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

export function SupervisionTierSection() {
  const [activeTier, setActiveTier] = useState<number>(1);
  const currentTier = SURVEILLANCE_SYSTEM.find((t) => t.tier === activeTier) || SURVEILLANCE_SYSTEM[0];

  const handleSelectTier = (tierNum: number) => {
    soundFx.playTap();
    setActiveTier(tierNum);
  };

  return (
    <section id="giam-sat" className="py-20 bg-[#FFFBF7] border-b border-orange-100">
      <div className="site-shell">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="eyebrow">
            <Eye className="w-4 h-4 text-orange-600" />
            Cơ Chế Giám Sát Thị Trường
          </span>
          <h2 className="section-title">
            Hệ Thống Giám Sát 3 Cấp &amp; Ứng Dụng Công Nghệ
          </h2>
          <p className="section-subtitle">
            Cấu trúc 3 tuyến phòng thủ bảo vệ tính liêm chính của thị trường vốn Việt Nam và lộ trình ứng dụng trí tuệ nhân tạo (AI), dữ liệu lớn (Big Data) theo Nghị quyết 57-NQ/TW.
          </p>
        </div>

        {/* 3 Tier Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SURVEILLANCE_SYSTEM.map((tier) => (
            <button
              key={tier.tier}
              onClick={() => handleSelectTier(tier.tier)}
              className={`p-6 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                activeTier === tier.tier
                  ? 'bg-white border-orange-500 shadow-xl ring-2 ring-orange-400/40 -translate-y-1'
                  : 'bg-orange-50/50 border-orange-200/70 hover:bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeTier === tier.tier
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-200 text-orange-800'
                  }`}
                >
                  {tier.tier}
                </span>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  Cấp {tier.tier}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">{tier.name}</h3>
              <p className="text-xs text-orange-700 font-semibold mb-2">{tier.organization}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{tier.role}</p>

              {activeTier === tier.tier && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
              )}
            </button>
          ))}
        </div>

        {/* Interactive Detailed Tier View */}
        <div className="amber-card p-6 md:p-8 bg-white border-orange-300">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-2/3 space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 inline-block mb-2">
                  Cấp {currentTier.tier}: Tuyến {currentTier.name}
                </span>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mb-2">
                  {currentTier.organization}
                </h3>
                <p className="text-slate-600 text-sm font-medium">
                  {currentTier.role}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Quy Trình &amp; Cơ Chế Tác Nghiệp Cốt Lõi:
                </h4>
                <div className="space-y-3">
                  {currentTier.mechanisms.map((mech, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/40 border border-orange-100">
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{mech}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar with Challenges & Technology */}
            <div className="lg:w-1/3 w-full space-y-4">
              <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Điểm Nghẽn Thực Tiễn</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {currentTier.challenges}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/60 border border-orange-300">
                <div className="flex items-center gap-2 text-orange-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <Cpu className="w-4 h-4 text-orange-600" />
                  <span>Đổi Mới Công Nghệ (NQ 57)</span>
                </div>
                <p className="text-xs text-orange-950 leading-relaxed">
                  {currentTier.innovations}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>Mục Tiêu Liên Thông 2026</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[0.78rem]">
                  Tích hợp đồng bộ CSDL Quốc gia về dân cư với tài khoản chứng khoán, loại bỏ hoàn toàn các tài khoản "ma" mượn danh để thao túng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
