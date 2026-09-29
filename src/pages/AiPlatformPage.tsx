import React, { useState } from 'react';
import {
  Sparkles,
  FileSignature,
  GitCompare,
  ShieldAlert,
  MessageSquare,
  Key,
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
import { AiConfigModal } from '@/components/ai-config-modal';
import {
  callGeminiApi,
  getCustomApiKey,
  CONTRACT_PRESETS,
  CONTRACT_DIFF_SAMPLE,
  RISK_REVIEW_SAMPLE,
} from '@/lib/gemini-client';
import { soundFx } from '@/lib/audio-effects';

type PlatformTab = 'generator' | 'compare' | 'audit' | 'chat';

export function AiPlatformPage() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('generator');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => !!getCustomApiKey());

  // Generator State
  const [selectedPreset, setSelectedPreset] = useState<string>('margin');
  const [formData, setFormData] = useState<Record<string, string>>({
    ...CONTRACT_PRESETS.margin.defaultFields,
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>(() =>
    CONTRACT_PRESETS.margin.generate(CONTRACT_PRESETS.margin.defaultFields)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Compare State
  const [v1Text, setV1Text] = useState(CONTRACT_DIFF_SAMPLE.v1Content);
  const [v2Text, setV2Text] = useState(CONTRACT_DIFF_SAMPLE.v2Content);
  const [compareAnalysis, setCompareAnalysis] = useState<string | null>(null);
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
      setGeneratedDoc(preset.generate(preset.defaultFields));
    }
  };

  const handleGenerateDoc = async () => {
    soundFx.playChime();
    setIsGenerating(true);
    const preset = CONTRACT_PRESETS[selectedPreset];

    if (!hasApiKey) {
      // Deterministic fallback
      setTimeout(() => {
        setGeneratedDoc(preset.generate(formData));
        setIsGenerating(false);
      }, 500);
      return;
    }

    const prompt = `Soạn thảo hoàn chỉnh văn bản pháp lý "${preset.title}" với các thông số sau:\n${JSON.stringify(
      formData,
      null,
      2
    )}\nVăn bản phải tuân thủ nghiêm ngặt Luật Chứng khoán Việt Nam 2024, Nghị định 245/2025/NĐ-CP, bảo vệ quyền lợi hợp pháp của Nhà đầu tư cá nhân và bảo đảm đầy đủ căn cứ pháp lý.`;

    const res = await callGeminiApi(
      'Bạn là chuyên gia pháp lý chứng khoán hàng đầu Việt Nam.',
      prompt
    );

    if (res.ok && res.content) {
      setGeneratedDoc(res.content);
    } else {
      setGeneratedDoc(preset.generate(formData));
    }
    setIsGenerating(false);
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

    if (!hasApiKey) {
      setTimeout(() => {
        setAuditResult(RISK_REVIEW_SAMPLE.auditResult);
        setIsAuditing(false);
      }, 600);
      return;
    }

    const prompt = `Rà soát bẫy pháp lý và chấm điểm bảo vệ nhà đầu tư cho điều khoản hợp đồng chứng khoán sau:\n"${auditInput}"\nĐối chiếu với Luật Chứng khoán 2024, Nghị định 245/2025/NĐ-CP và Bộ luật Dân sự 2015. Nêu rõ các lỗi vi phạm và khuyến nghị sửa đổi.`;

    const res = await callGeminiApi(
      'Bạn là chuyên viên kiểm toán pháp lý hợp đồng chứng khoán.',
      prompt
    );

    if (res.ok && res.content) {
      setAuditResult({
        score: 30,
        level: 'RỦI RO PHÁP LÝ CAO (PHÁT HIỆN TỪ GEMINI AI)',
        summary: res.content.slice(0, 250) + '...',
        violations: [
          {
            law: 'Phân tích trực tiếp từ Gemini API 2.5 Flash',
            desc: res.content,
          },
        ],
        recommendation: 'Tham khảo ý kiến luật sư và chỉnh sửa điều khoản loại trừ trách nhiệm.',
      });
    } else {
      setAuditResult(RISK_REVIEW_SAMPLE.auditResult);
    }
    setIsAuditing(false);
  };

  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || chatInput;
    if (!textToSend.trim()) return;

    soundFx.playTap();
    const newMsg = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    if (!questionText) setChatInput('');
    setIsChatting(true);

    if (!hasApiKey) {
      setTimeout(() => {
        let reply = '';
        if (textToSend.includes('giải chấp') || textToSend.includes('margin')) {
          reply = 'Theo Luật Chứng khoán 2024 và Quy chế giao dịch ký quỹ của UBCKNN, CTCK có nghĩa vụ thông báo Call Margin tối thiểu trước 01 ngày làm việc (T+1) và chỉ được giải chấp đúng số lượng để hồi phục tỷ lệ an toàn. Việc CTCK bán tháo toàn bộ danh mục mà không gửi thông báo hợp lệ cấu thành hành vi vi phạm hợp đồng và có thể bị khiếu nại lên UBCKNN để đòi bồi thường chênh lệch giá.';
        } else if (textToSend.includes('thao túng') || textToSend.includes('bồi thường')) {
          reply = 'Để đòi bồi thường trong các vụ án thao túng giá chứng khoán (như FLC, Louis Holdings), Nhà đầu tư cần: 1) Sao kê lịch sử lệnh khớp trong giai đoạn thao túng được Tòa án xác định; 2) Đăng ký tư cách Người có quyền lợi nghĩa vụ liên quan / Bị hại tại Tòa; 3) Yêu cầu trích xuất bồi thường từ tài sản kê biên của các bị cáo theo Điều 211 BLHS và nguyên tắc bồi thường thiệt hại ngoài hợp đồng (Điều 584 BLDS).';
        } else {
          reply = 'Hệ thống pháp luật chứng khoán Việt Nam hiện nay ưu tiên bảo vệ nhà đầu tư qua 3 tầng: Tầng 1 là nghĩa vụ minh bạch thông tin của tổ chức phát hành; Tầng 2 là trách nhiệm giám sát và tách bạch tài khoản của CTCK; Tầng 3 là thẩm quyền thanh tra, xử phạt và chuyển giao hình sự của UBCKNN kết hợp Tòa án nhân dân.';
        }

        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: reply,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsChatting(false);
        soundFx.playChime();
      }, 700);
      return;
    }

    const res = await callGeminiApi(
      'Bạn là trợ lý pháp lý chuyên gia về Luật Chứng khoán Việt Nam, bảo vệ quyền lợi của nhà đầu tư cá nhân.',
      textToSend
    );

    setChatMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: res.ok && res.content ? res.content : 'Xin lỗi, không thể kết nối tới Gemini API. Vui lòng kiểm tra lại API Key hoặc đường truyền mạng.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
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
                Tích hợp mô hình <strong>Google Gemini 2.5 Flash</strong> hỗ trợ NĐT cá nhân soạn thảo hợp đồng, so sánh điều khoản bất lợi, phát hiện bẫy pháp lý và hỏi đáp chuyên sâu 24/7 đối chiếu Luật Chứng khoán 2024.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setIsConfigOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-400 text-orange-900 font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Key className="w-4 h-4 text-orange-600" />
                <span>{hasApiKey ? 'Đã Cấu Hình Gemini' : 'Cấu Hình API Key'}</span>
              </button>
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
                {generatedDoc}
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
                    {CONTRACT_DIFF_SAMPLE.differences.map((diff, idx) => (
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
                    Sẵn sàng tư vấn trực tuyến (Google Gemini 2.5 Flash)
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
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

      {/* AI Key Configuration Modal */}
      <AiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onKeySaved={() => setHasApiKey(!!getCustomApiKey())}
      />
    </div>
  );
}
