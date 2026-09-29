import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Search,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Layers,
  Sparkles,
  Bookmark,
  Share2
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import paperData from '@/data/official-paper-data.json';

export function DocumentPresentation() {
  const [activeChapId, setActiveChapId] = useState<string>('all');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (secId: string) => {
    soundFx.playTap();
    setExpandedSections((prev) => ({
      ...prev,
      [secId]: prev[secId] === false ? true : false,
    }));
  };

  const expandAll = () => {
    soundFx.playTap();
    const allSecs: Record<string, boolean> = {};
    paperData.chapters.forEach((c) => {
      c.sections.forEach((s) => {
        allSecs[s.id] = true;
      });
    });
    setExpandedSections(allSecs);
  };

  const collapseAll = () => {
    soundFx.playTap();
    const allSecs: Record<string, boolean> = {};
    paperData.chapters.forEach((c) => {
      c.sections.forEach((s) => {
        allSecs[s.id] = false;
      });
    });
    setExpandedSections(allSecs);
  };

  const handleCopyCitation = () => {
    soundFx.playChime();
    const citation = `Nhóm 2 (2026), "Pháp luật về bảo vệ quyền lợi của nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam", Bài tập lớn học phần Luật Chứng khoán (Lớp 261LAW10A01), Khoa Luật - Học viện Ngân hàng.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredChapters = useMemo(() => {
    let chaps = paperData.chapters;
    if (activeChapId !== 'all') {
      chaps = chaps.filter((c) => c.id === activeChapId);
    }
    if (!searchQuery.trim()) return chaps;

    const q = searchQuery.toLowerCase();
    return chaps
      .map((c) => {
        const matchingSections = c.sections
          .map((s) => {
            const matchTitle = s.title.toLowerCase().includes(q);
            const matchingParas = s.paragraphs.filter((p) => p.toLowerCase().includes(q));
            const matchingSubs = (s.subsections || [])
              .map((sub) => {
                const matchSubTitle = sub.title.toLowerCase().includes(q);
                const matchSubParas = sub.paragraphs.filter((p) => p.toLowerCase().includes(q));
                if (matchSubTitle || matchSubParas.length > 0) {
                  return { ...sub, paragraphs: matchSubParas.length > 0 ? matchSubParas : sub.paragraphs };
                }
                return null;
              })
              .filter(Boolean) as typeof s.subsections;

            if (matchTitle || matchingParas.length > 0 || matchingSubs.length > 0) {
              return {
                ...s,
                paragraphs: matchingParas.length > 0 ? matchingParas : s.paragraphs,
                subsections: matchingSubs,
              };
            }
            return null;
          })
          .filter(Boolean) as typeof c.sections;

        const matchLead = c.leadParagraphs.filter((p) => p.toLowerCase().includes(q));
        if (matchingSections.length > 0 || matchLead.length > 0 || c.title.toLowerCase().includes(q)) {
          return {
            ...c,
            leadParagraphs: matchLead.length > 0 ? matchLead : c.leadParagraphs,
            sections: matchingSections,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof paperData.chapters;
  }, [activeChapId, searchQuery]);

  return (
    <div className="document-presentation-container py-12">
      {/* Institutional Header Banner */}
      <div className="bg-gradient-to-r from-[#2B170B] via-[#4A2610] to-[#2B170B] text-white p-6 sm:p-10 rounded-3xl shadow-xl mb-8 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              {paperData.institution}
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 border border-orange-500/30 text-xs font-bold">
              Lớp: {paperData.courseCode} · {paperData.group}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
              GVHD: {paperData.instructor}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-tight mt-2">
            {paperData.title}
          </h2>
          <p className="text-amber-200/80 text-sm sm:text-base mt-3 leading-relaxed">
            Văn bản hoàn chỉnh toàn văn ~30 trang chuẩn học thuật pháp lý Học viện Ngân hàng.
            Tích hợp đầy đủ 4 Chương, Phần Mở đầu, Kết luận và danh mục tra cứu 2.731 quyết định xử phạt thực chứng.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-amber-500/20">
            <button
              onClick={handleCopyCitation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-amber-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép trích dẫn chuẩn APA' : 'Sao chép trích dẫn học thuật'}
            </button>
            <div className="text-xs text-amber-300/80 italic">
              * Dẫn nguồn: Khoa Luật — Học viện Ngân hàng (2026)
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white border border-orange-200 rounded-2xl p-4 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Chapter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              soundFx.playTap();
              setActiveChapId('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeChapId === 'all'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-orange-50'
            }`}
          >
            Toàn Văn Bài Nghiên Cứu
          </button>
          {paperData.chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                soundFx.playTap();
                setActiveChapId(c.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChapId === c.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              {c.title.split('.')[0]}
            </button>
          ))}
        </div>

        {/* View Options & Search */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm từ khóa trong bài..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-orange-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 w-44 sm:w-56"
            />
          </div>

          {/* Font Size Toggle */}
          <button
            onClick={() => {
              soundFx.playTap();
              setFontSize(fontSize === 'normal' ? 'large' : 'normal');
            }}
            className="p-1.5 rounded-lg border border-orange-200 text-slate-700 hover:bg-orange-50 text-xs font-bold flex items-center gap-1"
            title="Điều chỉnh cỡ chữ"
          >
            {fontSize === 'normal' ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
            {fontSize === 'normal' ? 'Cỡ chữ +' : 'Cỡ chữ chuẩn'}
          </button>

          {/* Expand/Collapse All */}
          <button
            onClick={expandAll}
            className="text-[11px] font-semibold text-orange-700 hover:underline px-2 py-1"
          >
            Mở rộng hết
          </button>
          <button
            onClick={collapseAll}
            className="text-[11px] font-semibold text-slate-500 hover:underline px-2 py-1"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Abbreviations Guide Box */}
      <div className="bg-[#FFFDF9] border border-amber-200/70 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-orange-600" /> Danh Mục Thuật Ngữ Viết Tắt Học Thuật
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {paperData.abbreviations.map((ab, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-white border border-amber-100 shadow-2xs">
              <span className="font-bold text-orange-600 block">{ab.short}</span>
              <span className="text-slate-600 text-[11px]">{ab.full}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters Render Loop */}
      <div className="space-y-10">
        {filteredChapters.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className="bg-white border border-orange-200/90 rounded-3xl p-6 sm:p-10 shadow-sm"
          >
            {/* Chapter Header */}
            <div className="border-b-2 border-orange-100 pb-4 mb-6">
              <span className="text-xs uppercase font-serif tracking-widest text-orange-700 font-bold block mb-1">
                KHOA LUẬT — BÀI TẬP LỚN 261LAW10A01
              </span>
              <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#3B1E08] leading-tight">
                {chapter.title}
              </h3>
            </div>

            {/* Lead Paragraphs if any */}
            {chapter.leadParagraphs && chapter.leadParagraphs.length > 0 && (
              <div className="mb-6 space-y-3">
                {chapter.leadParagraphs.map((lead, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed text-slate-700 italic ${
                      fontSize === 'large' ? 'text-lg' : 'text-sm sm:text-base'
                    }`}
                  >
                    {lead}
                  </p>
                ))}
              </div>
            )}

            {/* Sections Accordion */}
            <div className="space-y-6">
              {chapter.sections.map((sec) => {
                const isExpanded = expandedSections[sec.id] !== false; // default true
                return (
                  <div
                    key={sec.id}
                    className="border border-orange-100 rounded-2xl overflow-hidden transition-all bg-[#FFFCF8]"
                  >
                    {/* Section Header Button */}
                    <button
                      onClick={() => toggleSection(sec.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-orange-50/60 to-transparent hover:bg-orange-50 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 shadow-xs" />
                        <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                          {sec.title}
                        </h4>
                      </div>
                      <div className="shrink-0 text-orange-700 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Section Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-white border-t border-orange-100/60 space-y-4">
                        {/* Direct Section Paragraphs */}
                        {sec.paragraphs.map((p, pIdx) => (
                          <p
                            key={pIdx}
                            className={`leading-relaxed text-slate-700 font-serif ${
                              fontSize === 'large' ? 'text-lg leading-loose' : 'text-sm sm:text-base'
                            }`}
                          >
                            {p}
                          </p>
                        ))}

                        {/* Subsections if any */}
                        {sec.subsections && sec.subsections.length > 0 && (
                          <div className="space-y-5 pt-3 border-t border-orange-50">
                            {sec.subsections.map((sub) => (
                              <div
                                key={sub.id}
                                className="p-4 sm:p-5 rounded-xl bg-[#FFFDF9] border border-orange-100/80"
                              >
                                <h5 className="font-serif font-bold text-amber-950 text-sm sm:text-base mb-3 flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-xs font-semibold">
                                    {sub.num}
                                  </span>
                                  {sub.title.replace(sub.num, '').replace(/^\.\s*/, '')}
                                </h5>
                                <div className="space-y-3">
                                  {sub.paragraphs.map((subP, subPIdx) => (
                                    <p
                                      key={subPIdx}
                                      className={`leading-relaxed text-slate-700 font-serif ${
                                        fontSize === 'large' ? 'text-lg leading-loose' : 'text-sm sm:text-base'
                                      }`}
                                    >
                                      {subP}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
