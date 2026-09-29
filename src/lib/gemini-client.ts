// Client-side Google Gemini API integration for Securities Law & Investor Protection
// Adheres to gemini-api-dev standards: uses gemini-flash-latest / gemini-2.5-flash

export interface GeminiResponse {
  ok: boolean;
  content: string;
  modelUsed: string;
  error?: string;
  latencyMs?: number;
}

export const GEMINI_STORAGE_KEY = 'ck_custom_gemini_key';

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GEMINI_STORAGE_KEY) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
}

export function saveCustomApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key || key.trim() === '') {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

const DEFAULT_MODEL = 'gemini-2.5-flash';

export async function callGeminiApi(
  systemInstruction: string,
  userPrompt: string,
  model = DEFAULT_MODEL
): Promise<GeminiResponse> {
  const apiKey = getCustomApiKey();
  const startTime = Date.now();

  if (!apiKey || apiKey.length < 8) {
    return {
      ok: false,
      content: '',
      modelUsed: model,
      error: 'NO_API_KEY',
      latencyMs: Date.now() - startTime,
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n[YÊU CẦU NGƯỜI DÙNG]:\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500,
        topP: 0.95,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const latency = Date.now() - startTime;

    if (!res.ok) {
      const errMsg = data.error?.message || `Lỗi API (${res.status})`;
      return {
        ok: false,
        content: '',
        modelUsed: model,
        error: errMsg,
        latencyMs: latency,
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
      ok: true,
      content: reply,
      modelUsed: model,
      latencyMs: latency,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi kết nối mạng';
    return {
      ok: false,
      content: '',
      modelUsed: model,
      error: message,
      latencyMs: Date.now() - startTime,
    };
  }
}

// -------------------------------------------------------------
// HIGH-FIDELITY SECURITIES LEGAL FALLBACK TEMPLATES
// -------------------------------------------------------------

export const CONTRACT_PRESETS: Record<string, { title: string; defaultFields: Record<string, string>; generate: (params: Record<string, string>) => string }> = {
  margin: {
    title: 'Hợp đồng mở tài khoản giao dịch ký quỹ (Margin)',
    defaultFields: {
      ctck: 'Công ty Cổ phần Chứng khoán SSI',
      investor: 'Nguyễn Văn An',
      cmnd: '001095012345',
      address: 'Hoàn Kiếm, Hà Nội',
      ratio: '50%',
      rate: '10.5%/năm',
      callMargin: '35%',
      forceSell: '30%',
    },
    generate: (p) => `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------

HỢP ĐỒNG MỞ TÀI KHOẢN GIAO DỊCH KÝ QUỸ CHỨNG KHOÁN (MARGIN)
Số: 261/2026/HĐ-MARGIN/LAW

- Căn cứ Bộ luật Dân sự số 91/2015/QH13;
- Căn cứ Luật Chứng khoán số 54/2019/QH14 được sửa đổi, bổ sung năm 2024;
- Căn cứ Quyết định số 1205/QĐ-UBCK của Ủy ban Chứng khoán Nhà nước về Quy chế hướng dẫn giao dịch ký quỹ chứng khoán;
- Căn cứ Thông tư 68/2024/TT-BTC quy định về giao dịch và bù trừ thanh toán chứng khoán;
- Căn cứ năng lực và nhu cầu thực tế của hai Bên.

Hôm nay, ngày 28 tháng 09 năm 2026, tại Trụ sở, các Bên thống nhất ký kết:

BÊN CHO VAY KÝ QUỸ (BÊN A):
- Đơn vị: ${p.ctck || 'Công ty Cổ phần Chứng khoán SSI'}
- Giấy phép hoạt động kinh doanh chứng khoán số: 19/GPHĐKD do UBCKNN cấp.
- Đại diện: Tổng Giám đốc
- Địa chỉ: Số 1C Ngô Quyền, Hoàn Kiếm, Hà Nội.

BÊN VAY KÝ QUỸ (BÊN B - NHÀ ĐẦU TƯ):
- Họ và tên: ${p.investor || 'Nguyễn Văn An'}
- Số CCCD: ${p.cmnd || '001095012345'}
- Địa chỉ liên lạc: ${p.address || 'Quận Ba Đình, Hà Nội'}
- Số tài khoản chứng khoán: 021C-888999

ĐIỀU 1. PHẠM VI DỊCH VỤ VÀ TỶ LỆ KÝ QUỸ
1.1. Bên A cung cấp hạn mức tín dụng giao dịch ký quỹ để Bên B mua các mã chứng khoán nằm trong Danh mục chứng khoán được phép giao dịch ký quỹ do UBCKNN công bố.
1.2. Tỷ lệ ký quỹ ban đầu tối thiểu: ${p.ratio || '50%'}.
1.3. Lãi suất cho vay Margin: ${p.rate || '10.5%/năm'}, tính trên số ngày thực tế sử dụng vốn (365 ngày/năm).

ĐIỀU 2. QUY TRÌNH BẢO VỆ NHÀ ĐẦU TƯ KHI XỬ LÝ KÝ QUỸ (CALL MARGIN)
2.1. Tỷ lệ ký quỹ duy trì (Maintenance Ratio): ${p.callMargin || '35%'}. Khi tỷ lệ thực tế của tài khoản giảm xuống dưới mức này, Bên A có nghĩa vụ phát lệnh Thông báo nộp bổ sung tài sản (Call Margin) qua cả 3 kênh: Email, Tin nhắn SMS và Thông báo ứng dụng.
2.2. Thời hạn bổ sung tài sản: Bên B có tối thiểu 01 ngày làm việc (T+1) kể từ thời điểm nhận thông báo để nộp bổ sung tiền hoặc chứng khoán giải chấp.
2.3. Tỷ lệ giải chấp bắt buộc (Force Sell): ${p.forceSell || '30%'}. Bên A CHỈ ĐƯỢC PHÉP bán giải chấp tối thiểu đủ để đưa tỷ lệ tài khoản về lại mức an toàn, NGHIÊM CẤM hành vi bán tháo toàn bộ danh mục tài sản của Bên B khi chưa thông báo hợp lệ.

ĐIỀU 3. NGHĨA VỤ MINH BẠCH VÀ BẢO TOÀN TÀI SẢN
3.1. Bên A cam kết tách bạch hoàn toàn tiền gửi giao dịch chứng khoán của Bên B tại Ngân hàng thương mại giám sát theo đúng Điều 56 Luật Chứng khoán.
3.2. Mọi thiệt hại phát sinh do lỗi nghẽn lệnh hệ thống, thao túng nội bộ của nhân viên Bên A phải được bồi hoàn 100% cho Bên B căn cứ theo biên bản giám định của Sở Giao dịch Chứng khoán Việt Nam (VNX).

Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.

            ĐẠI DIỆN BÊN A                                   ĐẠI DIỆN BÊN B
             (Ký, đóng dấu)                                   (Ký, ghi rõ họ tên)`,
  },

  complaint: {
    title: 'Đơn tố cáo & Khiếu nại hành vi thao túng thị trường chứng khoán',
    defaultFields: {
      toAgency: 'Ủy ban Chứng khoán Nhà nước (UBCKNN)',
      investorName: 'Nguyễn Văn An',
      stockCode: 'FLC / GAB / ART',
      victimLoss: '850.000.000 VNĐ',
      targetEntity: 'Nhóm đối tượng thao túng giá thuộc hệ sinh thái',
      evidenceDesc: 'Lệnh mua bán chéo tạo cung cầu ảo trong phiên ATC từ tháng 1 đến tháng 4/2022',
    },
    generate: (p) => `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------

ĐƠN TỐ CÁO HÀNH VI THAO TÚNG THỊ TRƯỜNG CHỨNG KHOÁN
VÀ YÊU CẦU BỒI THƯỜNG THIỆT HẠI CHO NHÀ ĐẦU TƯ CÁ NHÂN

Kính gửi:
- ${p.toAgency || 'Ủy ban Chứng khoán Nhà nước (UBCKNN)'};
- Thanh tra Bộ Tài chính;
- Cơ quan Cảnh sát điều tra Bộ Công an (C03).

Người làm đơn:
- Họ và tên: ${p.investorName || 'Nguyễn Văn An'}
- CCCD số: 001095012345 cấp ngày 10/05/2021 tại Cục CSQLHC về TTXH.
- Địa chỉ thường trú: Phường Điện Biên, Quận Ba Đình, Thành phố Hà Nội.
- Số điện thoại liên hệ: 0912.345.678
- Là nhà đầu tư cá nhân mở tài khoản số: 021C-888999 tại Công ty Chứng khoán.

TÔI LÀM ĐƠN NÀY ĐỂ TỐ CÁO HÀNH VI VI PHẠM PHÁP LUẬT CỦA:
- Đối tượng bị tố cáo: ${p.targetEntity || 'Nhóm tài khoản thao túng giá cổ phiếu'}
- Mã chứng khoán liên quan: ${p.stockCode || 'FLC / ROS / ART'}

NỘI DUNG SỰ VIỆC VÀ CĂN CỨ VI PHẠM:
1. Căn cứ Điều 12, Khoản 3 Luật Chứng khoán 2019 nghiêm cấm hành vi: "Sử dụng một hoặc nhiều tài khoản giao dịch của mình hoặc của người khác để thực hiện việc mua, bán chứng khoán nhằm tạo ra cung, cầu giả tạo; giao dịch chứng khoán bằng hình thức thao túng giá".
2. Căn cứ Điều 211 Bộ luật Hình sự năm 2015 (sửa đổi, bổ sung 2017) về Tội thao túng thị trường chứng khoán.
3. Diễn biến vi phạm thực tế:
${p.evidenceDesc || 'Trong giai đoạn vừa qua, nhóm đối tượng liên tục đặt các lệnh mua bán chéo hàng chục triệu cổ phiếu trong phiên ATO/ATC rồi bất ngờ hủy lệnh trước giờ đóng cửa, tạo thanh khoản ảo đẩy giá cổ phiếu lên kịch trần, sau đó bán tháo lượng lớn cổ phiếu không công bố thông tin, khiến cổ phiếu mất thanh khoản liên tiếp 15 phiên.'}

THIỆT HẠI THỰC TẾ CỦA NHÀ ĐẦU TƯ:
- Tổng giá trị vốn đã giải ngân mua cổ phiếu: 1.250.000.000 VNĐ.
- Tổng giá trị còn lại sau khi bán tháo / bị đình chỉ giao dịch: 400.000.000 VNĐ.
- Thiệt hại trực tiếp do hành vi thao túng gây ra: ${p.victimLoss || '850.000.000 VNĐ'}.

YÊU CẦU GIẢI QUYẾT:
1. Kính đề nghị UBCKNN tiến hành thanh tra, phong tỏa tài khoản của nhóm đối tượng vi phạm theo Điều 130 Luật Chứng khoán 2024.
2. Chuyển hồ sơ sang Cơ quan điều tra để khởi tố vụ án hình sự.
3. Buộc các đối tượng thao túng phải bồi thường toàn bộ thiệt hại cho tôi và các nhà đầu tư cá nhân bị hại căn cứ nguyên tắc bồi thường thiệt hại ngoài hợp đồng (Bộ luật Dân sự 2015) và Quỹ bảo vệ nhà đầu tư.

Tôi cam đoan các thông tin và tài liệu đính kèm (sao kê lệnh giao dịch, chứng từ chuyển tiền) là hoàn toàn trung thực.

                                             Hà Nội, ngày 28 tháng 09 năm 2026
                                                     NGƯỜI LÀM ĐƠN
                                                  (Ký và ghi rõ họ tên)`,
  },

  advisory: {
    title: 'Hợp đồng tư vấn đầu tư chứng khoán độc lập',
    defaultFields: {
      advisor: 'Công ty Cổ phần Quản lý Quỹ & Tư vấn Đầu tư Trí Việt',
      client: 'Trần Văn Bình',
      fee: '1.5% giá trị danh mục/năm + 15% lợi nhuận vượt chuẩn',
      scope: 'Cổ phiếu niêm yết rổ VN30 và Trái phiếu doanh nghiệp AAA',
    },
    generate: (p) => `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------

HỢP ĐỒNG DỊCH VỤ TƯ VẤN ĐẦU TƯ CHỨNG KHOÁN
Số: 89/2026/HĐ-TVĐT/CK

- Căn cứ Bộ luật Dân sự 2015;
- Căn cứ Luật Chứng khoán 2019 (sửa đổi 2024);
- Căn cứ Điều 89 Luật Chứng khoán về Hành vi bị cấm đối với công ty chứng khoán và người hành nghề;

ĐIỀU KHOẢN TRỌNG TÂM BẢO VỆ KHÁCH HÀNG:
1. Phạm vi: ${p.scope || 'Tư vấn phân bổ tài sản danh mục cổ phiếu VN30 và trái phiếu niêm yết'}.
2. Phí dịch vụ: ${p.fee || '1.5%/năm'}.
3. CAM KẾT KHÔNG BAO LỖ (Tuân thủ Điều 89): Bên A không đưa ra cam kết bảo đảm thu nhập cố định hoặc chia sẻ rủi ro ngoài khuôn khổ pháp luật.
4. NGHĨA VỤ TIẾT LỘ XUNG ĐỘT LỢI ÍCH: Chuyên viên tư vấn của Bên A không được mua bán đối ứng cổ phiếu đang khuyến nghị cho Bên B trong vòng 72 giờ.`,
  },

  nda: {
    title: 'Thỏa thuận bảo mật thông tin nội bộ (Insider Trading NDA)',
    defaultFields: {
      corp: 'Công ty Cổ phần Tập đoàn Hòa Phát (HPG)',
      partner: 'Công ty TNHH Kiểm toán & Thẩm định giá Á Châu',
      scope: 'Báo cáo tài chính hợp nhất kiểm toán và Kế hoạch M&A năm 2026',
    },
    generate: (p) => `THỎA THUẬN BẢO MẬT THÔNG TIN NỘI BỘ VÀ CAM KẾT CHỐNG GIAO DỊCH NỘI BỘ
(INSIDER TRADING COMPLIANCE AGREEMENT)

- Căn cứ Điều 12 và Điều 128 Luật Chứng khoán 2019;
- Căn cứ Nghị định 156/2020/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực chứng khoán;

BÊN TIẾT LỘ: ${p.corp || 'Công ty Cổ phần Tập đoàn Hòa Phát'}
BÊN TIẾP NHẬN: ${p.partner || 'Đối tác Thẩm định / Tư vấn'}

CAM KẾT CỐT LÕI:
1. Thông tin thuộc diện bảo mật: ${p.scope || 'Toàn bộ số liệu doanh thu, lợi nhuận chưa công bố ra thị trường'}.
2. Nghiêm cấm giao dịch: Trong suốt thời gian nắm giữ thông tin nội bộ và 03 ngày làm việc sau khi thông tin được công bố chính thức, Bên Tiếp nhận và người liên quan tuyệt đối không được mua bán cổ phiếu của Bên Tiết lộ.
3. Chế tài vi phạm: Bồi thường toàn bộ thiệt hại và chịu chế tài phạt tiền đến 3 tỷ đồng hoặc truy cứu trách nhiệm hình sự theo Điều 209 Bộ luật Hình sự.`,
  },
};

export const CONTRACT_DIFF_SAMPLE = {
  v1Name: 'Hợp đồng CTCK truyền thống (Bất lợi cho NĐT)',
  v1Content: `Điều 4. Xử lý tài khoản khi tỷ lệ chạm mức giải chấp
4.1. Khi tỷ lệ ký quỹ xuống dưới 35%, Bên A có quyền bán bất kỳ chứng khoán nào trong tài khoản của Bên B mà không cần thông báo trước cho Bên B.
4.2. Bên A hoàn toàn được miễn trừ mọi trách nhiệm về các thiệt hại phát sinh do việc giá bán không tối ưu hoặc thời điểm bán diễn ra ở vùng giá sàn.
4.3. Tiền gửi ký quỹ của Bên B được chuyển vào tài khoản tổng của Bên A tại ngân hàng và Bên A có toàn quyền sử dụng số dư này để điều tiết thanh khoản nội bộ.`,

  v2Name: 'Hợp đồng chuẩn bảo vệ NĐT (Theo Luật CK 2024 & NĐ 245)',
  v2Content: `Điều 4. Quy trình bảo vệ NĐT và cảnh báo ký quỹ
4.1. Khi tỷ lệ ký quỹ xuống dưới 35%, Bên A BẮT BUỘC phải phát cảnh báo bằng văn bản điện tử (SMS, Email, Push Notif) và dành cho Bên B tối thiểu 01 ngày làm việc (T+1) để nộp bổ sung tài sản trước khi kích hoạt lệnh bán.
4.2. Bên A chỉ được bán số lượng chứng khoán tối thiểu vừa đủ để đưa tài khoản về ngưỡng an toàn. Mọi hành vi bán tháo toàn bộ danh mục khi chưa đến ngưỡng cưỡng chế đều buộc Bên A bồi thường thiệt hại.
4.3. Tiền gửi của Bên B được quản lý tách bạch 100% tại Ngân hàng lưu ký độc lập theo Điều 56 Luật Chứng khoán, Bên A tuyệt đối không được sử dụng vào mục đích khác.`,

  differences: [
    {
      title: 'Thông báo trước khi giải chấp',
      risk: 'Rất cao (Bản 1 tự ý bán không báo trước)',
      advice: 'Cần tuân thủ thời hạn T+1 và thông báo đa kênh để NĐT có cơ hội bổ sung vốn.',
    },
    {
      title: 'Phạm vi bán giải chấp',
      risk: 'Nghiêm trọng (Bản 1 cho phép bán bừa bãi)',
      advice: 'Chỉ được bán số lượng tối thiểu để khôi phục tỷ lệ an toàn.',
    },
    {
      title: 'Tách bạch tiền gửi nhà đầu tư',
      risk: 'Rủi ro chiếm dụng vốn (Bản 1 dùng tài khoản tổng)',
      advice: 'Bắt buộc quản lý tại ngân hàng giám sát độc lập, cấm chiếm dụng vốn của NĐT cá nhân.',
    },
  ],
};

export const RISK_REVIEW_SAMPLE = {
  sampleClause: `Điều 9. Giới hạn trách nhiệm của Công ty Chứng khoán:
Trong mọi trường hợp nghẽn mạng internet, lỗi đường truyền từ Sở giao dịch, sự cố hệ thống khớp lệnh tự động hoặc bảng điện tử hiển thị sai giá khớp, Công ty Chứng khoán được loại trừ hoàn toàn khỏi mọi nghĩa vụ bồi thường thiệt hại cho Khách hàng. Khách hàng tự chịu mọi rủi ro tài chính phát sinh từ việc không khớp được lệnh mua bán.`,

  auditResult: {
    score: 25, // Thang điểm bảo vệ NĐT: 25/100 (Rất nguy hiểm)
    level: 'RỦI RO CAO - BẪY PHÁP LÝ CHÈN ÉP NHÀ ĐẦU TƯ',
    summary: 'Điều khoản miễn trừ trách nhiệm vô điều kiện vi phạm nghiêm trọng Điều 89 Luật Chứng khoán và Điều 405 Bộ luật Dân sự về hợp đồng theo mẫu chèn ép người tiêu dùng.',
    violations: [
      {
        law: 'Điều 405 Khoản 3 Bộ luật Dân sự 2015',
        desc: 'Trường hợp hợp đồng theo mẫu có điều khoản miễn trách nhiệm của bên đưa ra hợp đồng hoặc tăng trách nhiệm của bên kia thì điều khoản này vô hiệu.',
      },
      {
        law: 'Điều 89 Khoản 1 Điểm b Luật Chứng khoán 2019',
        desc: 'Công ty chứng khoán có nghĩa vụ bảo đảm hệ thống công nghệ thông tin vận hành liên tục, bảo mật và an toàn cho khách hàng.',
      },
      {
        law: 'Nghị định 245/2025/NĐ-CP',
        desc: 'Quy định nghĩa vụ bồi hoàn thiệt hại khi sự cố kỹ thuật kéo dài trên 15 phút trong phiên khớp lệnh liên tục mà không có phương án dự phòng.',
      },
    ],
    recommendation: 'Yêu cầu sửa đổi: Công ty chứng khoán chỉ được miễn trừ trong trường hợp bất khả kháng theo luật định (thiên tai, chiến tranh). Lỗi máy chủ nội bộ hoặc thiếu hạ tầng chịu tải bắt buộc phải có biên bản kiểm toán độc lập và cơ chế đền bù trượt giá cho NĐT.',
  },
};

// -------------------------------------------------------------
// NEWS ARTICLE AI Q&A ASSISTANT (Gemini 2.5 Flash + Fallback)
// -------------------------------------------------------------

export function generateNewsArticleFallbackAnswer(
  articleTitle: string,
  legalRef: string,
  userQuestion: string
): string {
  const q = userQuestion.toLowerCase();

  if (q.includes('bồi thường') || q.includes('thiệt hại') || q.includes('tiền') || q.includes('đòi')) {
    return `⚖️ **PHÂN TÍCH PHÁP LÝ VỀ ĐÒI BỒI THƯỜNG THIỆT HẠI**:

1. **Cơ chế xác lập tư cách bị hại**:
   - Căn cứ **Điều 62 Bộ luật Tố tụng Hình sự 2015** và **Điều 584 Bộ luật Dân sự 2015**, nhà đầu tư cá nhân có giao dịch khớp lệnh chịu thiệt hại trực tiếp từ hành vi thao túng/gian lận cần nộp Đơn yêu cầu bồi thường kèm theo:
     + Sao kê tài khoản giao dịch có xác nhận của CTCK (ghi nhận thời điểm, mã cổ phiếu, khối lượng, giá mua/bán).
     + Hợp đồng mở tài khoản và chứng từ chuyển tiền nộp vào tài khoản.

2. **Cơ sở khấu trừ tài sản thi hành án**:
   - Theo tiền lệ các đại án chứng khoán (như FLC, Tân Hoàng Minh), số tiền thu lợi bất chính và tài sản kê biên của các bị cáo sẽ được ưu tiên bồi thường cho nhà đầu tư trước khi nộp ngân sách nhà nước.

3. **Khuyến nghị hành động của Nhóm Nghiên Cứu 2**:
   - Theo dõi thông báo chính thức từ Cơ quan Cảnh sát điều tra hoặc Tòa án thụ lý vụ án.
   - Không chuyển tiền cho các dịch vụ "hỗ trợ đòi tiền nhanh" trên mạng xã hội vì nguy cơ lừa đảo thứ cấp (Secondary Fraud).`;
  }

  if (q.includes('biểu quyết') || q.includes('đại hội') || q.includes('cổ đông') || q.includes('245')) {
    return `🏛️ **QUYỀN LỢI CỦA CỔ ĐÔNG NHỎ LẺ THEO NGHỊ ĐỊNH 245/2025/NĐ-CP**:

1. **Hệ thống biểu quyết điện tử (E-voting)**:
   - Cổ đông cá nhân không cần có mặt trực tiếp tại trụ sở doanh nghiệp mà có thể biểu quyết thông qua cổng thông tin VSDC hoặc ứng dụng bảo mật của CTCK.
   - Doanh nghiệp đại chúng quy mô lớn bắt buộc phải áp dụng E-voting đối với các kỳ ĐHĐCĐ thường niên và bất thường.

2. **Quyền tiếp cận thông tin và kiến nghị**:
   - Giảm tỷ lệ sở hữu tối thiểu để yêu cầu cung cấp danh sách cổ đông và triệu tập cuộc họp HĐQT từ 5% xuống còn 1% (giúp liên kết các NĐT nhỏ lẻ).
   - Mọi giao dịch với người có liên quan từ 10% giá trị tài sản trở lên phải được thành viên độc lập HĐQT thẩm định bằng văn bản.`;
  }

  if (q.includes('lừa đảo') || q.includes('nhóm') || q.includes('vip') || q.includes('room') || q.includes('zalo')) {
    return `🚨 **CẢNH BÁO AN TOÀN VÀ XỬ LÝ KHI GẶP BẪY "HỘI NHÓM VIP"**:

1. **Dấu hiệu vi phạm pháp luật**:
   - Hành vi cam kết lợi nhuận cố định (20% - 30%/tháng) hoặc "bao lỗ" là hoàn toàn bất hợp pháp, vi phạm nghiêm trọng **Khoản 3 Điều 12 Luật Chứng khoán 2019**.
   - Hầu hết các app nộp tiền không thuộc 74 Công ty Chứng khoán thành viên do UBCKNN cấp phép đều là sàn giả mạo (Fake Brokerage).

2. **Các bước xử lý khẩn cấp**:
   - Dừng ngay mọi lệnh chuyển tiền, không nộp thêm "phí xác minh" hay "thuế thu nhập".
   - Chụp lại toàn bộ lịch sử tin nhắn, số tài khoản thụ hưởng, link tải app.
   - Gửi đơn tố giác tội phạm đến Cục An ninh mạng và phòng chống tội phạm công nghệ cao (A05 - Bộ Công an) và UBCKNN.`;
  }

  // General comprehensive fallback
  return `📜 **KẾT QUẢ PHÂN TÍCH PHÁP LÝ TỪ TRỢ LÝ AI (NHÓM 2 - 261LAW10A01)**:

Về vấn đề: *"${userQuestion}"* liên quan đến bài viết: *"${articleTitle}"*:

1. **Căn cứ pháp lý cốt lõi**:
   - Viện dẫn: **${legalRef}**.
   - Các nguyên tắc bảo vệ quyền bình đẳng, minh bạch thông tin và quyền được bồi thường của Nhà đầu tư cá nhân theo Chương I & Chương IX Luật Chứng khoán 2019 (sửa đổi 2024).

2. **Đánh giá pháp lý chuyên sâu**:
   - Pháp luật chứng khoán Việt Nam đang chuyển dịch mạnh mẽ từ cơ chế "hậu kiểm xử phạt hành chính đơn thuần" sang cơ chế "bảo vệ thực chất quyền lợi tài sản cho NĐT".
   - Mọi hành vi tạo cung cầu giả, che giấu giao dịch của lãnh đạo doanh nghiệp hoặc cung cấp thông tin sai lệch đều bị xử lý nghiêm khắc (phạt tiền đến 3 tỷ đồng đối với tổ chức hoặc phạt tù đến 7 năm theo Điều 211 BLHS).

3. **Khuyến nghị phòng ngừa rủi ro cho bạn**:
   - Luôn kiểm tra tính pháp lý của tổ chức phát hành và chỉ mở tài khoản tại các CTCK được UBCKNN cấp phép.
   - Lưu trữ văn bản xác nhận số dư và hợp đồng mẫu để sẵn sàng bảo vệ quyền lợi hợp pháp khi có tranh chấp.`;
}

export async function askAboutNewsArticle(
  articleTitle: string,
  articleSummary: string,
  legalRef: string,
  userQuestion: string
): Promise<string> {
  const systemPrompt = `Bạn là Trợ lý AI Pháp lý Chứng khoán cao cấp của Nhóm Nghiên cứu 2, Lớp học phần 261LAW10A01, Khoa Luật - Học viện Ngân hàng.
Nhiệm vụ của bạn là giải đáp thắc mắc của người dùng dựa trên bài viết tin tức pháp luật chứng khoán được cung cấp.
Hãy phân tích sắc bén, rõ ràng, viện dẫn chính xác Luật Chứng khoán 2019 (sửa đổi 2024), Nghị định 245/2025/NĐ-CP, Bộ luật Dân sự 2015 hoặc Bộ luật Hình sự 2015.
Luôn đưa ra lời khuyên thực tế để bảo vệ quyền và lợi ích hợp pháp của Nhà đầu tư cá nhân. Trình bày có gạch đầu dòng rõ ràng, phông thái khoa học pháp lý Times New Roman.`;

  const userPrompt = `[BÀI VIẾT TIN TỨC]:
- Tiêu đề: ${articleTitle}
- Tóm tắt: ${articleSummary}
- Căn cứ pháp lý: ${legalRef}

[CÂU HỎI NGƯỜI DÙNG]:
${userQuestion}`;

  try {
    const res = await callGeminiApi(systemPrompt, userPrompt);
    if (res.ok && res.content && res.content.trim().length > 20) {
      return res.content;
    }
  } catch (e) {
    console.warn('Gemini API call failed, falling back to local legal reasoning engine', e);
  }

  return generateNewsArticleFallbackAnswer(articleTitle, legalRef, userQuestion);
}

