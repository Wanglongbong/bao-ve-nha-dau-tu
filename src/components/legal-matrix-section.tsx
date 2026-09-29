import React, { useState } from 'react';
import { LEGAL_FRAMEWORK, LegalDocument } from '@/lib/research-data';
import { Scale, Search, ShieldCheck, FileText, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

export function LegalMatrixSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(LEGAL_FRAMEWORK[0]);

  const handleFilter = (type: string) => {
    soundFx.playTap();
    setFilterType(type);
  };

  const handleSelectDoc = (doc: LegalDocument) => {
    soundFx.playTap();
    setSelectedDoc(doc);
  };

  const filteredDocs = LEGAL_FRAMEWORK.filter((doc) => {
    const matchType = filterType === 'all' || doc.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      doc.code.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.highlight.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <section id="phap-ly" className="py-20 bg-[#FFFDFB] border-b border-orange-100">
      <div className="site-shell">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="eyebrow">
            <Scale className="w-4 h-4 text-orange-600" />
            Cơ Sở Pháp Lý Nền Tảng
          </span>
          <h2 className="section-title">
            Khung Pháp Lý Bảo Vệ Nhà Đầu Tư Cá Nhân
          </h2>
          <p className="section-subtitle">
            Hệ thống quy phạm pháp luật từ Luật Chứng khoán 2019, Luật sửa đổi 2024 đến các Nghị định, Thông tư chuyên ngành giai đoạn 2020 – 2026 xác lập tấm khiên bảo vệ nhà đầu tư nhỏ lẻ.
          </p>
        </div>

        {/* 3 Core Legal Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="amber-card p-6 border-l-4 border-l-orange-500">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">1. Tôn Trọng Quyền Sở Hữu &amp; Tự Do Đầu Tư</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bảo đảm quyền tự do giao dịch, biểu quyết, sở hữu tài sản chứng khoán hợp pháp của nhà đầu tư. Nhà nước không can thiệp trái pháp luật vào quan hệ dân sự, kinh tế giữa các chủ thể trên thị trường.
            </p>
          </div>

          <div className="amber-card p-6 border-l-4 border-l-orange-600">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">2. Công Bằng, Công Khai &amp; Minh Bạch</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Xóa bỏ bất cân xứng thông tin. Mọi thông tin trọng yếu về tình hình tài chính, quản trị công ty đại chúng phải được công bố kịp thời, chuẩn xác và bình đẳng cho mọi cá nhân tiếp cận (kể cả song ngữ).
            </p>
          </div>

          <div className="amber-card p-6 border-l-4 border-l-orange-700">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">3. Bảo Vệ Quyền &amp; Lợi Ích Hợp Pháp</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nhà đầu tư cá nhân là bên yếu thế (về thông tin, vốn, công cụ pháp lý). Pháp luật bắt buộc phải thiết lập cơ chế giám sát nghiêm ngặt, xử phạt răn đe và cơ chế giải quyết bồi thường khi quyền lợi bị xâm hại.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-orange-200 text-slate-700 hover:border-orange-400'
              }`}
            >
              Tất cả văn bản ({LEGAL_FRAMEWORK.length})
            </button>
            <button
              onClick={() => handleFilter('Luật')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'Luật'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-orange-200 text-slate-700 hover:border-orange-400'
              }`}
            >
              Luật
            </button>
            <button
              onClick={() => handleFilter('Nghị định')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'Nghị định'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-orange-200 text-slate-700 hover:border-orange-400'
              }`}
            >
              Nghị định
            </button>
            <button
              onClick={() => handleFilter('Thông tư')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'Thông tư'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-orange-200 text-slate-700 hover:border-orange-400'
              }`}
            >
              Thông tư
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm văn bản, số hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Legal Grid & Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of documents */}
          <div className="lg:col-span-7 space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSelectDoc(doc)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc?.id === doc.id
                    ? 'bg-orange-50/70 border-orange-500 shadow-md ring-1 ring-orange-400/50'
                    : 'bg-white border-orange-100 hover:border-orange-300 hover:bg-orange-50/30'
                }`}
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-orange-100 text-orange-800">
                      {doc.type}
                    </span>
                    <strong className="text-sm font-mono text-slate-900">{doc.code}</strong>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{doc.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hiệu lực: <span className="font-medium text-slate-700">{doc.effectiveDate}</span> • Cơ quan: {doc.signer}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    selectedDoc?.id === doc.id ? 'text-orange-600 translate-x-1' : 'text-slate-300'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Document detail preview box */}
          {selectedDoc && (
            <div className="lg:col-span-5 amber-card p-6 sticky top-28 bg-gradient-to-b from-white to-orange-50/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
                <FileText className="w-4 h-4" />
                <span>Chi Tiết Văn Bản Quy Phạm</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug mb-1">
                {selectedDoc.title}
              </h3>
              <p className="text-sm font-mono text-orange-600 font-semibold mb-4">
                {selectedDoc.code}
              </p>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="bg-white p-3 rounded-lg border border-orange-200/80">
                  <span className="font-bold text-slate-900 block mb-1">Điểm Nhấn Trọng Tâm:</span>
                  <p className="leading-relaxed text-slate-700">{selectedDoc.highlight}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-orange-200/80">
                  <span className="font-bold text-slate-900 block mb-1">Ý Nghĩa Đối Với Nhà Đầu Tư Cá Nhân:</span>
                  <p className="leading-relaxed text-slate-700">{selectedDoc.relevance}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/60 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Ngày ban hành:</span>
                    <strong className="text-slate-800">{selectedDoc.issueDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngày có hiệu lực:</span>
                    <strong className="text-slate-800">{selectedDoc.effectiveDate}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special comparison: NĐT Cá nhân vs NĐT Chuyên nghiệp */}
        <div className="mt-14 amber-card p-6 md:p-8 bg-white border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Bất Cập Trong Quy Định Phân Biệt: Nhà Đầu Tư Cá Nhân &amp; Nhà Đầu Tư Chuyên Nghiệp
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Luật Chứng khoán 2019 và Nghị định 155/2020 quy định tiêu chí để cá nhân trở thành "Nhà đầu tư chứng khoán chuyên nghiệp" (nắm giữ danh mục niêm yết tối thiểu 2 tỷ đồng hoặc có thu nhập chịu thuế từ 1 tỷ đồng/năm). Tuy nhiên, trên thực tế xuất hiện nhiều kẽ hở:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
              <h4 className="font-bold text-orange-900 text-sm mb-2">Thủ đoạn "Lách" danh xưng chuyên nghiệp</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Nhiều tổ chức phân phối trái phiếu bắt tay với các bên dịch vụ cho NĐT cá nhân vay tiền qua đêm để hợp thức hóa danh mục 2 tỷ đồng, cấp xác nhận "chuyên nghiệp" giả tạo để mua trái phiếu doanh nghiệp rủi ro cao (như tại đại án Tân Hoàng Minh).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
              <h4 className="font-bold text-orange-900 text-sm mb-2">Hậu quả trực tiếp đối với nhà đầu tư</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Khi gắn mác "chuyên nghiệp", NĐT cá nhân bị tước bỏ cơ chế bảo hộ chặt chẽ dành cho NĐT đại chúng thông thường và phải tự chịu mọi rủi ro tài chính khi đơn vị phát hành vỡ trận dòng tiền.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
