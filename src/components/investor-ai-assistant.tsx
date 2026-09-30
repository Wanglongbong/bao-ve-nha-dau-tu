import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import { callAiTask } from '@/lib/ai-client';

interface InvestorAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const FAQ_PROMPTS = [
  'NĐT cá nhân có được bồi thường khi cổ phiếu bị thao túng giá không?',
  'Dấu hiệu nhận biết các hội nhóm "phím hàng", lừa đảo trên mạng xã hội?',
  'Quy trình nộp đơn tố cáo, khiếu nại lên UBCKNN khi quyền lợi bị xâm hại?',
  'Tại sao cần áp dụng cơ chế Khởi kiện tập thể (Class Action) tại Việt Nam?',
];

const PREDEFINED_ANSWERS: Record<string, string> = {
  'NĐT cá nhân có được bồi thường khi cổ phiếu bị thao túng giá không?': `Theo quy định tại Điều 12 Luật Chứng khoán 2019 và Bộ luật Dân sự 2015, người thực hiện hành vi thao túng thị trường phải bồi thường thiệt hại cho nhà đầu tư bị thiệt hại. 

Tuy nhiên, trên thực tế, việc đòi bồi thường rất gian nan vì:
1. Thiếu cơ chế tính toán cụ thể mức độ thiệt hại trực tiếp do hành vi thao túng gây ra so với biến động tự nhiên của thị trường.
2. Tòa án xử lý hình sự thường chỉ tịch thu số tiền thu lợi bất chính sung công quỹ Nhà nước, trong khi NĐT cá nhân muốn đòi bồi thường phải làm đơn khởi kiện dân sự độc lập với chi phí án phí và thủ tục tố tụng phức tạp.
3. Đây là lý do nhóm nghiên cứu kiến nghị cấp thiết phải thành lập "Quỹ Bảo vệ Nhà Đầu Tư" và cơ chế "Khởi kiện tập thể (Class Action)".`,

  'Dấu hiệu nhận biết các hội nhóm "phím hàng", lừa đảo trên mạng xã hội?': `Các đối tượng thao túng và tư vấn trái phép thường dùng các thủ đoạn sau:
1. Tạo các nhóm kín (Zalo, Telegram) với tên gọi "VIP", "Nội bộ", cam kết lợi nhuận 20% - 50%/tháng mà không có bất kỳ rủi ro nào.
2. Sử dụng tài khoản mồi (chim mồi) liên tục khoe lãi, hình ảnh chuyển tiền ảo để kích thích lòng tham (FOMO).
3. Kêu gọi mua vào các mã cổ phiếu thanh khoản thấp (penny), sau khi NĐT nạp tiền đẩy giá lên cao thì nhóm đối tượng xả ồ ạt khiến cổ phiếu "mất thanh khoản" (trắng bên mua).
4. Giả mạo văn bản của UBCKNN, mượn danh CTCK uy tín hoặc sử dụng AI để mạo danh chuyên gia nổi tiếng.`,

  'Quy trình nộp đơn tố cáo, khiếu nại lên UBCKNN khi quyền lợi bị xâm hại?': `Quy trình nộp đơn theo quy định của Luật Khiếu nại và Luật Tố cáo:
Bước 1: Soạn thảo đơn khiếu nại/tố cáo ghi rõ thông tin người gửi, đối tượng bị khiếu nại (Doanh nghiệp niêm yết, CTCK, Cá nhân lừa đảo).
Bước 2: Tập hợp đầy đủ chứng cứ: Sao kê tài khoản giao dịch, hợp đồng mở tài khoản, sao lưu tin nhắn/email trao đổi, tài liệu công bố thông tin sai lệch.
Bước 3: Gửi đến Bộ phận Tiếp nhận và Trả kết quả của Ủy ban Chứng khoán Nhà nước (164 Trần Quang Khải, Hoàn Kiếm, Hà Nội hoặc qua Cổng Dịch vụ công UBCKNN).
Bước 4: UBCKNN sẽ phân loại thụ lý trong vòng 10 ngày làm việc. Nếu vụ việc có dấu hiệu hình sự, UBCKNN sẽ chuyển hồ sơ sang Cục A05 / C03 Bộ Công an.`,

  'Tại sao cần áp dụng cơ chế Khởi kiện tập thể (Class Action) tại Việt Nam?': `Khởi kiện tập thể (Class Action) là cơ chế mang tính bước ngoặt:
1. Khắc phục thế yếu: NĐT cá nhân thường chỉ thiệt hại vài chục đến vài trăm triệu đồng, không bõ công thuê luật sư và nộp án phí để theo đuổi vụ kiện kéo dài 2-3 năm.
2. Gom lực lượng: Một hoặc một vài đại diện có thể khởi kiện thay mặt cho hàng nghìn NĐT cùng chung hoàn cảnh bị lừa dối, san sẻ chi phí pháp lý.
3. Răn đe cực lớn: Bản án bồi thường tập thể hàng trăm tỷ đồng sẽ là đòn trừng phạt đủ nặng khiến các ban lãnh đạo doanh nghiệp gian dối không dám vi phạm.`,
};

export function InvestorAiAssistant({ isOpen, onClose }: InvestorAiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Pháp lý Bảo Vệ Nhà Đầu Tư (Học viện Ngân hàng). Tôi có thể giúp bạn giải đáp về quy định Luật Chứng khoán 2019 (sửa đổi 2024), quyền cổ đông cá nhân, dấu hiệu nhận biết thao túng giá hoặc quy trình khiếu nại. Bạn muốn tìm hiểu vấn đề gì?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      soundFx.playPop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q || isLoading) return;

    soundFx.playTap();
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    setIsLoading(true);
    const result = await callAiTask({
      task: 'chat',
      input: q,
      conversation: messages.slice(-8).map((message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        text: message.text,
      })),
    });

    const sourceText = result.sources?.length
      ? `\n\nNguồn tham khảo:\n${result.sources.map((source) => `• ${source.title}: ${source.url}`).join('\n')}`
      : '';
    const reply = result.ok && result.content
      ? `${result.content}${sourceText}`
      : PREDEFINED_ANSWERS[q]
        ? `MẪU NGOẠI TUYẾN — Gemini 3.8 chưa kết nối:\n\n${PREDEFINED_ANSWERS[q]}`
        : `Không thể kết nối Gemini 3.8 lúc này: ${result.error?.message || 'Lỗi không xác định'}. Nội dung AI chỉ mang tính tham khảo nghiên cứu và không thay thế tư vấn của luật sư.`;

    soundFx.playTap();
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: reply }]);
    setIsLoading(false);
  };

  const handleClose = () => {
    soundFx.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#704A32]/20 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl border border-orange-300 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">Trợ Lý AI Pháp Lý Nhà Đầu Tư</h3>
              <p className="text-[0.7rem] text-orange-100 uppercase tracking-wider font-semibold">
                Tư Vấn Quyền &amp; Nhận Diện Rủi Ro Chứng Khoán
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FFFDFB]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs md:text-sm max-w-[85%] whitespace-pre-line leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none'
                    : 'bg-white border border-orange-200 text-slate-800 shadow-sm rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-orange-200 text-orange-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-orange-700">
              <Loader2 className="w-4 h-4 animate-spin" /> Gemini 3.8 đang kiểm tra nguồn và soạn câu trả lời…
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-orange-50/60 border-t border-orange-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[0.7rem] font-bold text-orange-800 uppercase flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Gợi ý:
          </span>
          {FAQ_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[0.72rem] bg-white border border-orange-200 hover:border-orange-400 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-orange-50 transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-orange-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Hỏi về Luật Chứng khoán, quyền NĐT, đại án FLC, khiếu nại..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-xs md:text-sm bg-orange-50/30 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
