import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Printer,
  ChevronRight,
  ArrowUp,
  Bookmark,
  Award,
  Layers,
  Sparkles,
  Shield,
  FileCheck2,
  Share2,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import paperData from '@/data/official-paper-data.json';

export function WordDocumentPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for TOC active item and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sectionElements = document.querySelectorAll<HTMLElement>('[data-toc-id]');
      let currentId = 'sec-1';

      sectionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 60) {
          currentId = el.getAttribute('data-toc-id') || currentId;
        }
      });

      setActiveSectionId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyCitation = () => {
    soundFx.playChime();
    const citation = `Nhóm 2 (2026), "Pháp luật về bảo vệ quyền lợi của nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam", Bài tập lớn học phần Luật Chứng khoán (Lớp 261LAW10A01), Khoa Luật - Học viện Ngân hàng.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    soundFx.playTap();
    window.print();
  };

  const scrollToElement = (id: string) => {
    soundFx.playTap();
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSectionId(id);
    }
  };

  // Filter paper based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return paperData.chapters;

    const q = searchQuery.toLowerCase();
    return paperData.chapters
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

        if (matchingSections.length > 0 || c.title.toLowerCase().includes(q)) {
          return { ...c, sections: matchingSections };
        }
        return null;
      })
      .filter(Boolean) as typeof paperData.chapters;
  }, [searchQuery]);

  const fontSizeClass = {
    normal: 'text-[1.05rem] leading-[1.85]',
    large: 'text-[1.18rem] leading-[1.95]',
    xlarge: 'text-[1.3rem] leading-[2.1]',
  }[fontSize];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E140C] font-serif pb-24">
      {/* 1. HERO BANNER: PAPER INFO & ACTIONS */}
      <section className="bg-gradient-to-b from-[#FFF7ED] via-[#FAF7F2] to-[#FFFDF9] border-b border-[#F2E4D4] pt-10 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#8C2B0A] text-white shadow-sm font-sans">
              BẢN TOÀN VĂN WORD
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#8C2B0A] border border-[#F2E4D4] font-sans">
              Khoa Luật · Học viện Ngân hàng
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7]/90 text-[#92400E] border border-[#FDE68A] font-sans">
              Lớp 261LAW10A01 · Nhóm 2
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-sans">
              GVHD: TS. Nguyễn Phương Thảo
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-[#1C130E] tracking-tight leading-tight max-w-5xl">
            {paperData.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#3D2E24] max-w-4xl leading-relaxed italic">
            Công trình nghiên cứu khoa học pháp lý hoàn chỉnh ~30 trang chuẩn mực (20.388 từ · 451 đoạn văn), 
            tích hợp hệ thống phân tích án điểm (FLC, Tân Hoàng Minh, Louis Holdings) và 5 nhóm kiến nghị giải pháp lập pháp.
          </p>

          {/* Quick Action Toolbar */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Download Word File */}
            <a
              href="/documents/261LAW10A01_Nhom_2.docx"
              download="261LAW10A01_Nhom_2.docx"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] border border-[#D4AF37]/35 text-white font-serif font-bold text-sm sm:text-base shadow-lg shadow-orange-950/15 hover:brightness-105 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              onClick={() => soundFx.playChime()}
              title="Tải về file Microsoft Word chuẩn (.docx)"
            >
              <Download className="w-5 h-5 text-amber-200" />
              <span>Tải Về Bản Word (.DOCX · 283 KB)</span>
            </a>

            {/* Read Online Button */}
            <button
              onClick={() => scrollToElement('sec-1')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-[#F2E4D4] text-[#8C2B0A] font-serif font-bold text-sm sm:text-base hover:bg-[#FFF7ED] transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#C2410C]" />
              <span>Đọc Trực Tuyến Ngay</span>
            </button>

            {/* Copy Citation Button */}
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#F2E4D4] text-[#3D2E24] font-serif text-sm hover:bg-[#FFF7ED] transition-all shadow-sm cursor-pointer"
              title="Sao chép trích dẫn học thuật"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
              <span>{copied ? 'Đã sao chép trích dẫn!' : 'Trích Dẫn APA'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#F2E4D4] text-[#3D2E24] font-serif text-sm hover:bg-[#FFF7ED] transition-all shadow-sm cursor-pointer"
              title="In ấn hoặc lưu thành PDF"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>In / Lưu PDF</span>
            </button>
          </div>

          {/* Reader Preferences Bar: Search & Font Size */}
          <div className="mt-8 p-4 rounded-2xl bg-white border border-[#F2E4D4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#C2410C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm từ khóa trong bài (ví dụ: FLC, Điều 145, Class Action)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F2] border border-[#F2E4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] font-serif placeholder:font-sans placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-sans"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Font Size & Mobile TOC Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Mobile TOC Button */}
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F2E4D4] bg-[#FFF7ED] text-[#8C2B0A] text-xs font-serif font-bold"
              >
                <Menu className="w-4 h-4" />
                <span>Mục Lục ({paperData.chapters.length} Chương)</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-sans uppercase tracking-wider font-semibold">
                  Cỡ chữ:
                </span>
                <div className="flex items-center border border-[#F2E4D4] rounded-lg overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => {
                      soundFx.playTap();
                      setFontSize('normal');
                    }}
                    className={`px-3 py-1 text-xs font-serif font-bold transition-all ${
                      fontSize === 'normal' ? 'bg-[#8C2B0A] text-white' : 'text-[#3D2E24] hover:bg-[#F2E4D4]'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playTap();
                      setFontSize('large');
                    }}
                    className={`px-3 py-1 text-sm font-serif font-bold transition-all ${
                      fontSize === 'large' ? 'bg-[#8C2B0A] text-white' : 'text-[#3D2E24] hover:bg-[#F2E4D4]'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playTap();
                      setFontSize('xlarge');
                    }}
                    className={`px-3 py-1 text-base font-serif font-bold transition-all ${
                      fontSize === 'xlarge' ? 'bg-[#8C2B0A] text-white' : 'text-[#3D2E24] hover:bg-[#F2E4D4]'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN TWO-COLUMN BODY: LEFT TOC + RIGHT PAPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR: TABLE OF CONTENTS ================= */}
          <aside
            className={`lg:w-80 xl:w-96 shrink-0 transition-all ${
              mobileTocOpen
                ? 'fixed inset-0 z-50 bg-black/60 p-4 flex justify-end'
                : 'hidden lg:block sticky top-24'
            }`}
          >
            <div
              className={`bg-[#FFFDF9] border border-[#EBD7C7] rounded-2xl shadow-xl shadow-[#2B1D15]/5 p-5 overflow-y-auto max-h-[calc(100vh-7.5rem)] ${
                mobileTocOpen ? 'w-full max-w-md h-full' : 'w-full'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F2E4D4] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#C2410C]" />
                  <h3 className="font-serif font-black text-lg text-[#1C130E]">Mục Lục Báo Cáo</h3>
                </div>
                {mobileTocOpen && (
                  <button
                    onClick={() => setMobileTocOpen(false)}
                    className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#5A4638]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Fast Jump Shortcuts */}
              <div className="space-y-1 mb-4 pb-3 border-b border-[#F2E4D4] text-xs font-sans">
                <button
                  onClick={() => scrollToElement('muc-abbreviations')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF0E6] text-[#3D2E24] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#1C130E]">📑 Danh Mục Chữ Viết Tắt</span>
                  <span className="text-[10px] text-[#C2410C] font-bold">11 thuật ngữ</span>
                </button>
                <button
                  onClick={() => scrollToElement('muc-bibliography')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF0E6] text-[#3D2E24] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#1C130E]">📚 Tài Liệu Tham Khảo</span>
                  <span className="text-[10px] text-[#C2410C] font-bold">42 văn bản</span>
                </button>
              </div>

              {/* Chapter Hierarchy List */}
              <nav className="space-y-4" aria-label="Mục lục chi tiết">
                {paperData.chapters.map((chap, cIdx) => (
                  <div key={chap.id} className="space-y-1">
                    {/* Chapter Title Button */}
                    <button
                      onClick={() => scrollToElement(chap.id)}
                      className={`w-full text-left p-2.5 rounded-xl font-serif text-sm transition-all flex items-start gap-2 cursor-pointer ${
                        activeSectionId === chap.id
                          ? 'bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white font-bold shadow-md shadow-[#C2410C]/25'
                          : 'hover:bg-[#FAF0E6] text-[#1C130E] font-bold'
                      }`}
                    >
                      <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span className="leading-snug">{chap.title}</span>
                    </button>

                    {/* Section Links */}
                    <div className="pl-4 space-y-1 border-l-2 border-[#EBD7C7] ml-3">
                      {chap.sections.map((sec) => {
                        const isActive = activeSectionId === sec.id;
                        return (
                          <div key={sec.id} className="space-y-0.5">
                            <button
                              onClick={() => scrollToElement(sec.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? 'bg-[#FAF0E6] text-[#8C2B0A] font-bold border-l-2 border-[#C2410C]'
                                  : 'text-[#5A4638] hover:text-[#8C2B0A] hover:bg-[#FAF0E6]/60'
                              }`}
                            >
                              <span className="truncate pr-2">{sec.title}</span>
                              <span className="shrink-0 text-[10px] font-sans text-[#C2410C] font-semibold">
                                {sec.num}
                              </span>
                            </button>

                            {/* Subsection Sub-links */}
                            {sec.subsections && sec.subsections.length > 0 && (
                              <div className="pl-3 space-y-0.5 border-l border-[#F2E4D4] ml-2">
                                {sec.subsections.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => scrollToElement(sub.id)}
                                    className={`w-full text-left px-2 py-1 rounded text-[11px] font-serif transition-colors truncate block cursor-pointer ${
                                      activeSectionId === sub.id
                                        ? 'text-[#8C2B0A] font-bold bg-[#FAF0E6]'
                                        : 'text-[#7A6658] hover:text-[#8C2B0A]'
                                    }`}
                                    title={sub.title}
                                  >
                                    {sub.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Sidebar Footer Link */}
              <div className="mt-6 pt-4 border-t border-[#F2E4D4] text-center">
                <a
                  href="/documents/261LAW10A01_Nhom_2.docx"
                  download="261LAW10A01_Nhom_2.docx"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8C2B0A] hover:text-[#C2410C] font-serif font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file Word (.DOCX) về máy</span>
                </a>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT AREA: AUTHENTIC ACADEMIC PAPER VIEWER ================= */}
          <main className="flex-1 w-full min-w-0">
            <article className="bg-[#FFFDF9] border border-[#EBD7C7] rounded-3xl shadow-xl shadow-[#2B1D15]/5 p-6 sm:p-12 md:p-16 max-w-4xl mx-auto">
              
              {/* Paper Formal Header */}
              <div className="text-center border-b-2 border-double border-[#D4AF37]/50 pb-10 mb-12">
                <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#5A4638] font-sans mb-1">
                  NGÂN HÀNG NHÀ NƯỚC VIỆT NAM — HỌC VIỆN NGÂN HÀNG
                </div>
                <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-[#8C2B0A] font-sans mb-6">
                  KHOA LUẬT — CHƯƠNG TRÌNH ĐÀO TẠO CỬ NHÂN LUẬT KINH TẾ
                </div>

                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C2410C] to-transparent mx-auto mb-6" />

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#1C130E] uppercase leading-snug tracking-tight">
                  BÀI TẬP LỚN HỌC PHẦN LUẬT CHỨNG KHOÁN
                </h1>

                <div className="mt-4 text-lg sm:text-xl font-bold text-[#8C2B0A] italic font-serif">
                  Đề tài: “Pháp luật về bảo vệ quyền lợi của nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam”
                </div>

                {/* Academic Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#F2E4D4] text-left text-xs sm:text-sm font-serif max-w-2xl mx-auto bg-[#FAF7F2] p-4 rounded-xl border border-[#EBD7C7]">
                  <div>
                    <span className="text-[#7A6658] font-sans text-xs uppercase block">Lớp học phần:</span>
                    <strong className="text-[#1C130E] font-bold">261LAW10A01</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6658] font-sans text-xs uppercase block">Nhóm thực hiện:</span>
                    <strong className="text-[#1C130E] font-bold">Nhóm 2 (08 thành viên)</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6658] font-sans text-xs uppercase block">Giảng viên hướng dẫn:</span>
                    <strong className="text-[#1C130E] font-bold">TS. Nguyễn Phương Thảo</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6658] font-sans text-xs uppercase block">Năm hoàn thành:</span>
                    <strong className="text-[#1C130E] font-bold">Hà Nội — 2026</strong>
                  </div>
                </div>
              </div>

              {/* Abbreviations Section */}
              <section id="muc-abbreviations" data-toc-id="muc-abbreviations" className="mb-14 scroll-mt-28">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F2E4D4]">
                  <FileText className="w-5 h-5 text-[#C2410C]" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C130E] font-serif uppercase tracking-wide">
                    DANH MỤC CÁC CHỮ VIẾT TẮT
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {paperData.abbreviations.map((abbr) => (
                    <div
                      key={abbr.short}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EBD7C7]"
                    >
                      <span className="w-20 font-bold text-[#8C2B0A] font-sans">{abbr.short}</span>
                      <span className="text-[#3D2E24]">{abbr.full}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Chapter Content Stream */}
              {filteredChapters.map((chap, cIdx) => (
                <section
                  key={chap.id}
                  id={chap.id}
                  data-toc-id={chap.id}
                  className="mb-16 scroll-mt-28 border-t border-[#F2E4D4] pt-10 first:border-t-0 first:pt-0"
                >
                  {/* Chapter Header */}
                  <div className="mb-8">
                    <span className="text-xs font-bold font-sans uppercase tracking-widest text-[#8C2B0A] bg-[#FAF0E6] border border-[#EBD7C7] px-3 py-1 rounded-full inline-block mb-2">
                      Mục {cIdx + 1}
                    </span>
                    <h2 className="text-xl sm:text-3xl font-serif font-black text-[#1C130E] leading-tight uppercase border-b-2 border-[#EBD7C7] pb-3">
                      {chap.title}
                    </h2>
                  </div>

                  {/* Chapter Lead Paragraphs */}
                  {chap.leadParagraphs && chap.leadParagraphs.length > 0 && (
                    <div className="space-y-4 mb-8 text-[#2B1D15]">
                      {chap.leadParagraphs.map((leadP, lpIdx) => (
                        <p key={lpIdx} className={`${fontSizeClass} text-justify indent-8 font-serif leading-relaxed`}>
                          {leadP}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Sections */}
                  <div className="space-y-12">
                    {chap.sections.map((sec) => (
                      <div
                        key={sec.id}
                        id={sec.id}
                        data-toc-id={sec.id}
                        className="scroll-mt-28 space-y-4"
                      >
                        {/* Section Title */}
                        <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#1C130E] leading-snug pt-2">
                          {sec.title}
                        </h3>

                        {/* Section Paragraphs */}
                        <div className="space-y-4 text-[#2B1D15]">
                          {sec.paragraphs.map((p, pIdx) => (
                            <p
                              key={pIdx}
                              className={`${fontSizeClass} text-justify indent-8 leading-relaxed font-serif text-[#2B1D15]`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>

                        {/* Subsections */}
                        {sec.subsections && sec.subsections.length > 0 && (
                          <div className="space-y-8 pl-0 sm:pl-4 mt-6 border-l-0 sm:border-l-2 sm:border-[#EBD7C7]">
                            {sec.subsections.map((sub) => (
                              <div
                                key={sub.id}
                                id={sub.id}
                                data-toc-id={sub.id}
                                className="scroll-mt-28 space-y-3"
                              >
                                <h4 className="text-base sm:text-lg font-serif font-bold text-[#8C2B0A]">
                                  {sub.title}
                                </h4>
                                <div className="space-y-4 text-[#2B1D15]">
                                  {sub.paragraphs.map((subP, spIdx) => (
                                    <p
                                      key={spIdx}
                                      className={`${fontSizeClass} text-justify indent-8 leading-relaxed font-serif text-[#2B1D15]`}
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
                    ))}
                  </div>
                </section>
              ))}

              {/* Bibliography / Tài Liệu Tham Khảo */}
              <section id="muc-bibliography" data-toc-id="muc-bibliography" className="mt-16 pt-10 border-t-2 border-[#EBD7C7] scroll-mt-28">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-[#F2E4D4]">
                  <Award className="w-5 h-5 text-[#C2410C]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1C130E] font-serif uppercase tracking-wide">
                    DANH MỤC TÀI LIỆU THAM KHẢO
                  </h2>
                </div>
                <p className="text-xs text-[#7A6658] font-sans italic mb-6">
                  Được trích dẫn chuẩn hóa theo thể thức khoa học pháp lý và quy chuẩn APA/TCVN.
                </p>

                {/* References List */}
                <ol className="space-y-3 text-xs sm:text-sm text-[#3D2E24] leading-relaxed font-serif list-decimal pl-5">
                  {paperData.chapters[paperData.chapters.length - 1]?.sections[0]?.paragraphs?.map((ref, rIdx) => (
                    <li key={rIdx} className="pl-1">
                      {ref}
                    </li>
                  ))}
                </ol>
              </section>

              {/* End of Document Seal */}
              <div className="mt-16 pt-10 border-t border-[#F2E4D4] text-center text-xs text-[#7A6658] font-serif">
                <div className="w-12 h-12 rounded-full bg-[#FAF0E6] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 text-[#C2410C]">
                  <Shield className="w-6 h-6" />
                </div>
                <p className="font-bold text-[#1C130E] uppercase tracking-wider">
                  BÀI TẬP LỚN HỌC PHẦN LUẬT CHỨNG KHOÁN — 261LAW10A01 — NHÓM 2
                </p>
                <p className="mt-1 text-[#5A4638]">
                  Khoa Luật · Học viện Ngân hàng · Giảng viên hướng dẫn: TS. Nguyễn Phương Thảo
                </p>
                <p className="mt-3 text-[11px] text-[#8C2B0A]/70 font-sans">
                  Hệ thống số hóa đề tài trực tuyến: https://bao-ve-nha-dau-tu.vercel.app
                </p>
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white shadow-xl shadow-[#8C2B0A]/30 hover:opacity-90 transition-all cursor-pointer"
          title="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
