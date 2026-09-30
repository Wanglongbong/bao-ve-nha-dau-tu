import React, { useState } from 'react';
import {
  Sparkles,
  FileSignature,
  GitCompare,
  ShieldAlert,
  MessageSquare,
  Copy,
  Check,
  Download,
  Send,
  RefreshCw,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  CONTRACT_PRESETS,
  CONTRACT_DIFF_SAMPLE,
  RISK_REVIEW_SAMPLE,
} from '@/lib/gemini-client';
import { callAiTask, cleanAiText, streamAiTask, type ContractDifference, type RiskAuditResult } from '@/lib/ai-client';
import { soundFx } from '@/lib/audio-effects';
import { AiRichText } from '@/components/ai-rich-text';

type PlatformTab = 'generator' | 'compare' | 'audit' | 'chat';

export function AiPlatformPage() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('generator');

  // Generator State
  const [selectedPreset, setSelectedPreset] = useState<string>('margin');
  const [formData, setFormData] = useState<Record<string, string>>({
    ...CONTRACT_PRESETS.margin.defaultFields,
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>(() =>
    `MẪU THAM KHẢO NGOẠI TUYẾN — bấm “Tạo văn bản” để dùng Gemini 3.8\n\n${CONTRACT_PRESETS.margin.generate(CONTRACT_PRESETS.margin.defaultFields)}`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Compare State
  const [v1Text, setV1Text] = useState(CONTRACT_DIFF_SAMPLE.v1Content);
  const [v2Text, setV2Text] = useState(CONTRACT_DIFF_SAMPLE.v2Content);
  const [compareAnalysis, setCompareAnalysis] = useState<string | null>(null);
  const [compareDifferences, setCompareDifferences] = useState<ContractDifference[]>(CONTRACT_DIFF_SAMPLE.differences);
  const [isComparing, setIsComparing] = useState(false);

  // Audit State
  const [auditInput, setAuditInput] = useState(RISK_REVIEW_SAMPLE.sampleClause);
  const [auditResult, setAuditResult] = useState<typeof RISK_REVIEW_SAMPLE.auditResult | null>(
    RISK_REVIEW_SAMPLE.auditResult
  );
  const [isAuditing, setIsAuditing] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: 'Xin chào Quý Nhà đầu tư! Tôi là Trợ lý AI Pháp lý Chứng khoán được huấn luyện trên nền tảng Luật Chứng khoán 2019 (sửa đổi 2024), Nghị định 245/2025/NĐ-CP và các án lệ thao túng giá tại Việt Nam. Tôi có thể giúp gì cho bạn hôm nay?',
      time: 'Vừa xong',
    },
  ]);
  const [isChatting, setIsChatting] = useState(false);

  const sampleQuestions = [
    'Làm thế nào để đòi bồi thường thiệt hại khi cổ phiếu bị thao túng giá?',
    'Công ty chứng khoán tự ý bán giải chấp cổ phiếu mà không báo trước có vi phạm luật không?',
    'Điều kiện khởi kiện tập thể trong tranh chấp chứng khoán tại Việt Nam hiện nay ra sao?',
    'Quy định pháp lý mới nhất về giao dịch không ký quỹ (Non-prefunding) theo Thông tư 68/2024?',
  ];

  // Handle preset change
  const handleSelectPreset = (key: string) => {
    soundFx.playTap();
    setSelectedPreset(key);
    const preset = CONTRACT_PRESETS[key];
    if (preset) {
      setFormData(preset.defaultFields);
      setGeneratedDoc(`MẪU THAM KHẢO NGOẠI TUYẾN — bấm “Tạo văn bản” để dùng Gemini 3.8\n\n${preset.generate(preset.defaultFields)}`);
    }
  };

  const handleGenerateDoc = async () => {
    soundFx.playChime();
    setIsGenerating(true);
    const preset = CONTRACT_PRESETS[selectedPreset];

    const prompt = `Soạn thảo hoàn chỉnh văn bản pháp lý "${preset.title}" với các thông số sau:\n${JSON.stringify(
      formData,
      null,
      2
    )}\nVăn bản phải tuân thủ nghiêm ngặt Luật Chứng khoán Việt Nam 2024, Nghị định 245/2025/NĐ-CP, bảo vệ quyền lợi hợp pháp của Nhà đầu tư cá nhân và bảo đảm đầy đủ căn cứ pháp lý.`;

    setGeneratedDoc('');
    const res = await streamAiTask({
      task: 'contract_draft',
      input: prompt,
      context: { documentType: preset.title, fields: formData },
    }, setGeneratedDoc);

    if (res.ok && res.content) {
      setGeneratedDoc(res.content);
    } else {
      setGeneratedDoc(`MẪU NGOẠI TUYẾN — Gemini 3.8 chưa kết nối\n\n${preset.generate(formData)}`);
    }
    setIsGenerating(false);
  };

  const handleCompareContracts = async () => {
    if (!v1Text.trim() || !v2Text.trim()) return;
    setIsComparing(true);
    setCompareAnalysis(null);
    const res = await callAiTask<{ summary: string; differences: ContractDifference[] }>({
      task: 'contract_compare',
      input: 'So sánh hai phiên bản và chỉ ra các thay đổi ảnh hưởng trực tiếp đến nhà đầu tư cá nhân.',
      context: { versionA: v1Text, versionB: v2Text },
    });
    if (res.ok && res.structured) {
      setCompareAnalysis(res.structured.summary);
      setCompareDifferences(res.structured.differences);
    } else {
      setCompareAnalysis(`Gemini 3.8 chưa kết nối: ${res.error?.message || 'Không nhận được kết quả.'}`);
      setCompareDifferences(CONTRACT_DIFF_SAMPLE.differences);
    }
    setIsComparing(false);
  };

  const handleCopyDoc = () => {
    soundFx.playTap();
    navigator.clipboard.writeText(generatedDoc);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const handleDownloadDoc = () => {
    soundFx.playTap();
    const element = document.createElement('a');
    const file = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedPreset}-chung-khoan-2026.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRunAudit = async () => {
    soundFx.playChime();
    setIsAuditing(true);

    const prompt = `Rà soát bẫy pháp lý và chấm điểm bảo vệ nhà đầu tư cho điều khoản hợp đồng chứng khoán sau:\n"${auditInput}"\nĐối chiếu với Luật Chứng khoán 2024, Nghị định 245/2025/NĐ-CP và Bộ luật Dân sự 2015. Nêu rõ các lỗi vi phạm và khuyến nghị sửa đổi.`;

    const res = await callAiTask<RiskAuditResult>({ task: 'risk_audit', input: prompt });

    if (res.ok && res.structured) {
      setAuditResult(res.structured);
    } else {
      setAuditResult({
        ...RISK_REVIEW_SAMPLE.auditResult,
        level: 'MẪU NGOẠI TUYẾN — GEMINI 3.8 CHƯA KẾT NỐI',
        summary: `${res.error?.message || 'Không thể kết nối dịch vụ AI.'} ${RISK_REVIEW_SAMPLE.auditResult.summary}`,
      });
    }
    setIsAuditing(false);
  };

  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || chatInput;
    if (!textToSend.trim() || isChatting) return;

    soundFx.playTap();
    const newMsg = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, newMsg, { role: 'assistant', text: '', time: assistantTime }]);
    if (!questionText) setChatInput('');
    setIsChatting(true);

    const res = await streamAiTask({
      task: 'chat',
      input: textToSend,
      conversation: chatMessages.slice(-8).map((message) => ({ role: message.role, text: message.text })),
    }, (text) => {
      setChatMessages((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text } : message));
    });
    const sourceText = res.sources?.length
      ? `\n\nNguồn tham khảo:\n${res.sources.map((source) => `• ${source.title}: ${source.url}`).join('\n')}`
      : '';

    const finalText = res.ok && res.content
      ? cleanAiText(`${res.content}${sourceText}`)
      : `Gemini 3.8 chưa kết nối: ${res.error?.message || 'Vui lòng thử lại.'}`;
    setChatMessages((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text: finalText } : message));
    setIsChatting(false);
    soundFx.playChime();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B1705] font-serif pt-6 pb-20">
      {/* Top Banner */}
      <div className="site-shell mb-8">
        <div className="bg-gradient-to-r from-[#FFF5EB] via-[#FFE8CC] to-[#FFDCA8] border-2 border-orange-300 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div 
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
            style={{ background: '#FF7A00' }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-200/80 px-3.5 py-1.5 rounded-full w-fit mb-3">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Nền Tảng AI Pháp Lý Chứng Khoán Thông Minh</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241003] mb-3 tracking-tight">
                Cổng AI Pháp Lý Bảo Vệ Nhà Đầu Tư
              </h1>
              <p className="text-base sm:text-lg text-[#5A2C0D] max-w-3xl leading-relaxed">
                Tích hợp <strong>Google Gemini 3.8 Flash</strong> qua máy chủ bảo mật để soạn thảo, so sánh điều khoản, phát hiện rủi ro và hỏi đáp có nguồn tham khảo.
              </p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/90 border border-orange-300 text-orange-900 text-xs font-bold shadow-sm shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-2" />
              API key được bảo vệ phía máy chủ
            </div>
          </div>

          {/* 4 Feature Tabs Navigation */}
          <div className="mt-8 pt-6 border-t border-orange-200/80 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveTab('generator');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeTab === 'generator'
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                  : 'bg-white/80 border-orange-200 hover:bg-white text-orange-950'
              }`}
            >
              <FileSignature className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-sm leading-tight">1. Tạo Hợp Đồng &amp; Đơn</strong>
                <span className={`text-[11px] ${activeTab === 'generator' ? 'text-orange-100' : 'text-orange-700'}`}>
                  Margin, Tư vấn, Tố cáo
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                soundFx.playTap();
                setActiveTab('compare');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeTab === 'compare'
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                  : 'bg-white/80 border-orange-200 hover:bg-white text-orange-950'
              }`}
            >
              <GitCompare className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-sm leading-tight">2. So Sánh Hợp Đồng</strong>
                <span className={`text-[11px] ${activeTab === 'compare' ? 'text-orange-100' : 'text-orange-700'}`}>
                  Đối chiếu bẫy điều khoản
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                soundFx.playTap();
                setActiveTab('audit');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeTab === 'audit'
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                  : 'bg-white/80 border-orange-200 hover:bg-white text-orange-950'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-sm leading-tight">3. Rà Soát Bẫy Rủi Ro</strong>
                <span className={`text-[11px] ${activeTab === 'audit' ? 'text-orange-100' : 'text-orange-700'}`}>
                  Soi vi phạm NĐ 245
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                soundFx.playTap();
                setActiveTab('chat');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeTab === 'chat'
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                  : 'bg-white/80 border-orange-200 hover:bg-white text-orange-950'
              }`}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-sm leading-tight">4. Hỏi Đáp Trợ Lý 24/7</strong>
                <span className={`text-[11px] ${activeTab === 'chat' ? 'text-orange-100' : 'text-orange-700'}`}>
                  Tư vấn pháp lý tức thì
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="site-shell">
        {/* TAB 1: GENERATOR */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Configuration Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2A1305] mb-2 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-orange-600" />
                Chọn Loại Văn Bản Chứng Khoán
              </h2>
              <p className="text-xs text-[#6B3A17] mb-5">
                Văn bản được biên soạn chuẩn theo Luật Chứng khoán 2024, bảo đảm quyền lợi tối đa cho nhà đầu tư cá nhân.
              </p>

              {/* Preset Buttons */}
              <div className="space-y-2 mb-6">
                {Object.entries(CONTRACT_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between ${
                      selectedPreset === key
                        ? 'bg-orange-50 border-orange-500 text-orange-900 shadow-sm'
                        : 'bg-[#FFFDFB] border-slate-200 hover:border-orange-300 text-slate-700'
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-orange-600 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Dynamic Fields */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-orange-800 mb-3">
                Thông Số Tham Chiếu
              </h3>
              <div className="space-y-3 mb-6">
                {Object.entries(formData).map(([k, val]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold text-[#5A2C0D] mb-1 capitalize">
                      {k === 'ctck' && 'Tên Công ty Chứng khoán:'}
                      {k === 'investor' && 'Họ tên Nhà đầu tư:'}
                      {k === 'cmnd' && 'Số CCCD:'}
                      {k === 'address' && 'Địa chỉ liên lạc:'}
                      {k === 'ratio' && 'Tỷ lệ ký quỹ ban đầu:'}
                      {k === 'rate' && 'Lãi suất vay Margin:'}
                      {k === 'callMargin' && 'Ngưỡng Call Margin:'}
                      {k === 'forceSell' && 'Ngưỡng Force Sell:'}
                      {k === 'toAgency' && 'Cơ quan tiếp nhận đơn:'}
                      {k === 'investorName' && 'Họ tên người làm đơn:'}
                      {k === 'stockCode' && 'Mã cổ phiếu vi phạm:'}
                      {k === 'victimLoss' && 'Số tiền thiệt hại ước tính:'}
                      {k === 'targetEntity' && 'Đối tượng bị tố cáo:'}
                      {k === 'evidenceDesc' && 'Tóm tắt hành vi thao túng:'}
                      {k === 'advisor' && 'Đơn vị tư vấn đầu tư:'}
                      {k === 'client' && 'Khách hàng:'}
                      {k === 'fee' && 'Mức phí dịch vụ:'}
                      {k === 'scope' && 'Phạm vi tư vấn:'}
                      {k === 'corp' && 'Doanh nghiệp niêm yết:'}
                      {k === 'partner' && 'Bên tiếp nhận thông tin:'}
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [k]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-orange-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none text-xs text-[#2A1305] bg-[#FFFDF9]"
                    />
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateDoc}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Đang Soạn Thảo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Văn Bản Chuẩn Ngay</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Document Preview (7 cols) */}
            <div className="lg:col-span-7 bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col h-[750px]">
              <div className="flex items-center justify-between pb-4 border-b border-orange-200 mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-base text-[#2A1305]">
                    Văn Bản Toàn Văn
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyDoc}
                    className="px-3 py-1.5 rounded-xl border border-orange-300 hover:bg-orange-50 text-orange-800 text-xs font-bold flex items-center gap-1.5 transition"
                    title="Sao chép toàn bộ"
                  >
                    {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDoc ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={handleDownloadDoc}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    title="Tải về máy"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải TXT</span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#FFFDF9] rounded-2xl border border-orange-100 font-serif text-sm leading-relaxed text-[#2B1705] whitespace-pre-wrap selection:bg-orange-200 shadow-inner">
                <AiRichText text={generatedDoc} streaming={isGenerating} />
              </div>

              <div className="pt-4 text-xs text-orange-800 flex items-center justify-between border-t border-orange-100 mt-4">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Tuân thủ Luật Chứng khoán 2024 &amp; Nghị định 245/2025/NĐ-CP
                </span>
                <span className="text-slate-400">
                  {generatedDoc.split(/\s+/).length} từ
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPARE */}
        {activeTab === 'compare' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Contract v1 */}
              <div className="bg-rose-50/60 border-2 border-rose-300 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-rose-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{CONTRACT_DIFF_SAMPLE.v1Name}</span>
                </div>
                <textarea
                  value={v1Text}
                  onChange={(e) => setV1Text(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-2xl border border-rose-200 bg-white text-xs leading-relaxed text-[#2A1305] font-serif focus:ring-1 focus:ring-rose-300 outline-none"
                />
              </div>

              {/* Right Contract v2 */}
              <div className="bg-emerald-50/60 border-2 border-emerald-300 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{CONTRACT_DIFF_SAMPLE.v2Name}</span>
                </div>
                <textarea
                  value={v2Text}
                  onChange={(e) => setV2Text(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-2xl border border-emerald-200 bg-white text-xs leading-relaxed text-[#2A1305] font-serif focus:ring-1 focus:ring-emerald-300 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCompareContracts}
              disabled={isComparing}
              className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isComparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
              {isComparing ? 'Gemini 3.8 đang đối chiếu…' : 'So sánh hai phiên bản bằng AI'}
            </button>

            {compareAnalysis && (
              <p className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-sm leading-relaxed text-[#5A2C0D]">
                {compareAnalysis}
              </p>
            )}

            {/* Differences Table */}
            <div className="bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#2A1305] mb-4 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-orange-600" />
                Kết Quả So Sánh &amp; Nhận Diện Bẫy Pháp Lý Của AI
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-orange-100 text-orange-950 border-b border-orange-300">
                      <th className="p-3.5 font-bold">Tiêu Chí Đối Chiếu</th>
                      <th className="p-3.5 font-bold">Mức Độ Rủi Ro Cho NĐT</th>
                      <th className="p-3.5 font-bold">Khuyến Nghị Bảo Vệ Quyền Lợi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {compareDifferences.map((diff, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/50 transition">
                        <td className="p-3.5 font-bold text-[#2A1305]">{diff.title}</td>
                        <td className="p-3.5 text-rose-700 font-semibold">{diff.risk}</td>
                        <td className="p-3.5 text-[#5A2C0D] leading-relaxed">{diff.advice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT */}
        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Side (5 cols) */}
            <div className="lg:col-span-5 bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2A1305] mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-600" />
                Soi Bẫy Hợp Đồng Chứng Khoán
              </h2>
              <p className="text-xs text-[#6B3A17] mb-4">
                Dán bất kỳ điều khoản trong hợp đồng mở tài khoản, hợp đồng vay Margin hoặc cam kết của môi giới để AI rà soát vi phạm.
              </p>

              <textarea
                value={auditInput}
                onChange={(e) => setAuditInput(e.target.value)}
                rows={10}
                className="w-full p-4 rounded-2xl border border-orange-200 bg-[#FFFDF9] text-xs leading-relaxed text-[#2A1305] font-serif focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none mb-4 shadow-inner"
                placeholder="Dán điều khoản cần rà soát vào đây..."
              />

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Rà Soát Với Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt Đầu Rà Soát Pháp Lý</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Side (7 cols) */}
            {auditResult && (
              <div className="lg:col-span-7 bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-orange-200 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                      {auditResult.level}
                    </span>
                    <h3 className="text-xl font-bold text-[#2A1305] mt-2">
                      Đánh Giá Độ An Toàn Cho Nhà Đầu Tư
                    </h3>
                  </div>

                  <div className="text-center p-3 rounded-2xl bg-orange-50 border border-orange-200">
                    <span className="block text-2xl font-extrabold text-orange-600">
                      {auditResult.score}/100
                    </span>
                    <span className="text-[10px] text-orange-900 font-bold uppercase">
                      Điểm Bảo Vệ
                    </span>
                  </div>
                </div>

                <div className="space-y-5 text-sm">
                  <div>
                    <h4 className="font-bold text-[#2A1305] mb-1.5 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-orange-600" /> Tóm Lược Nhận Định
                    </h4>
                    <p className="text-[#5A2C0D] leading-relaxed bg-orange-50/50 p-3.5 rounded-xl border border-orange-100">
                      {auditResult.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Các Căn Cứ Vi Phạm Pháp Luật
                    </h4>
                    <div className="space-y-2.5">
                      {auditResult.violations.map((v, i) => (
                        <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs leading-relaxed">
                          <strong className="block text-rose-900 mb-1">{v.law}</strong>
                          <span className="text-[#4A2508]">{v.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Khuyến Nghị Hành Động
                    </h4>
                    <p className="text-xs leading-relaxed text-[#2B4B27]">
                      {auditResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CHAT */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col h-[700px]">
            {/* Top Bar of Chat */}
            <div className="flex items-center justify-between pb-4 border-b border-orange-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2A1305]">
                    Trợ Lý AI Luật Chứng Khoán 24/7
                  </h3>
                  <p className="text-xs text-emerald-700 font-sans font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sẵn sàng tra cứu (Google Gemini 3.8 Flash)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setChatMessages([chatMessages[0]]);
                }}
                className="text-xs text-orange-700 hover:text-orange-900 font-sans underline"
              >
                Xóa đoạn chat
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(q)}
                  className="px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-serif transition text-left"
                >
                  💡 {q}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#FFFDF9] rounded-2xl border border-orange-100 shadow-inner">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-white border border-orange-200 text-[#2B1705] rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant'
                      ? <AiRichText text={msg.text} streaming={isChatting && i === chatMessages.length - 1} />
                      : <p className="whitespace-pre-wrap">{msg.text}</p>}
                    <span
                      className={`block text-[10px] mt-1.5 text-right ${
                        msg.role === 'user' ? 'text-orange-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isChatting && (
                <div className="flex items-center gap-2 text-xs text-orange-700 p-2 italic">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Gemini AI đang tra cứu cơ sở dữ liệu Luật Chứng khoán...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-4 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Đặt câu hỏi pháp lý chứng khoán (Ví dụ: Thao túng FLC xử lý bồi thường thế nào?)..."
                className="flex-1 px-4 py-3 rounded-2xl border border-orange-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none text-xs sm:text-sm bg-white text-[#2A1305]"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || isChatting}
                className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 transition shadow-md"
                title="Gửi câu hỏi"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
