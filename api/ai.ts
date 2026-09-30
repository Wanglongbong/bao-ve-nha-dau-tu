import { GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { retrieveKnowledge, type KnowledgeSource } from './_lib/knowledge.js';

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const MODEL = 'gemini-3.8-flash';
const MAX_INPUT = 12_000;

const conversationSchema = z
  .array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().min(1).max(4_000) }))
  .max(10)
  .optional();

const requestSchema = z.discriminatedUnion('task', [
  z.object({ task: z.literal('chat'), input: z.string().min(2).max(MAX_INPUT), conversation: conversationSchema }),
  z.object({
    task: z.literal('article_qa'),
    input: z.string().min(2).max(4_000),
    context: z.object({
      title: z.string().min(2).max(500),
      summary: z.string().min(2).max(4_000),
      legalReference: z.string().max(1_000),
    }),
  }),
  z.object({
    task: z.literal('contract_draft'),
    input: z.string().min(2).max(4_000),
    context: z.object({
      documentType: z.string().min(2).max(300),
      fields: z.record(z.string(), z.string().max(1_000)),
    }),
  }),
  z.object({
    task: z.literal('contract_compare'),
    input: z.string().max(1_000),
    context: z.object({ versionA: z.string().min(10).max(MAX_INPUT), versionB: z.string().min(10).max(MAX_INPUT) }),
  }),
  z.object({ task: z.literal('risk_audit'), input: z.string().min(10).max(MAX_INPUT) }),
]);

const comparisonSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    differences: {
      type: 'array',
      minItems: 1,
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          risk: { type: 'string' },
          advice: { type: 'string' },
        },
        required: ['title', 'risk', 'advice'],
      },
    },
  },
  required: ['summary', 'differences'],
};

const auditSchema = {
  type: 'object',
  properties: {
    score: { type: 'integer', minimum: 0, maximum: 100 },
    level: { type: 'string' },
    summary: { type: 'string' },
    violations: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        properties: { law: { type: 'string' }, desc: { type: 'string' } },
        required: ['law', 'desc'],
      },
    },
    recommendation: { type: 'string' },
  },
  required: ['score', 'level', 'summary', 'violations', 'recommendation'],
};

function getBearerToken(request: ApiRequest): string {
  const raw = request.headers.authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.startsWith('Bearer ') ? value.slice(7) : '';
}

function getPrompt(payload: z.infer<typeof requestSchema>, knowledgeContext = '', recentNews = ''): {
  systemInstruction: string;
  contents: string;
  config: GenerateContentConfig;
  structured: boolean;
} {
  const shared = `Bạn là trợ lý thông minh của dự án Bảo Vệ Nhà Đầu Tư. Bạn có thể trả lời cả câu hỏi phổ thông ngoài chuyên môn pháp luật chứng khoán.
Trả lời bằng tiếng Việt rõ ràng, tự nhiên và hữu ích. Không bịa điều luật, số liệu, án lệ, thành viên hoặc cơ quan có thẩm quyền.
Phân biệt rõ dữ kiện, nhận định và khuyến nghị. Khi không đủ căn cứ, hãy nói cần kiểm chứng.
Chỉ thêm lưu ý “mang tính tham khảo, không thay thế tư vấn chuyên môn” khi câu hỏi liên quan pháp luật, tài chính hoặc quyết định đầu tư.
Khi dùng tài liệu nội bộ dưới đây, hãy nói rõ đó là nội dung trong bài nghiên cứu hoặc dữ liệu nhóm, không giả vờ đó là văn bản pháp luật gốc.

KHO TRI THỨC NỘI BỘ ĐƯỢC TRUY XUẤT:
${knowledgeContext || 'Không có đoạn nội bộ phù hợp trực tiếp.'}
${recentNews ? `\nTIN CAFEF GẦN NHẤT TRONG KHO DỮ LIỆU:\n${recentNews}` : ''}`;

  if (payload.task === 'chat') {
    const history = (payload.conversation || [])
      .map((message) => `${message.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${message.text}`)
      .join('\n');
    return {
      systemInstruction: shared,
      contents: `${history ? `Lịch sử gần nhất:\n${history}\n\n` : ''}Câu hỏi mới: ${payload.input}`,
      config: {
        temperature: 0.25,
        maxOutputTokens: 2_500,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [{ googleSearch: {} }],
      },
      structured: false,
    };
  }

  if (payload.task === 'article_qa') {
    return {
      systemInstruction: `${shared}\nƯu tiên nguồn chính thức của Chính phủ, Bộ Tài chính, UBCKNN, VSDC và cơ quan tư pháp.`,
      contents: `Bài viết:\n- Tiêu đề: ${payload.context.title}\n- Tóm tắt: ${payload.context.summary}\n- Căn cứ được bài viết nêu: ${payload.context.legalReference}\n\nCâu hỏi: ${payload.input}`,
      config: {
        temperature: 0.2,
        maxOutputTokens: 2_500,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [{ googleSearch: {} }],
      },
      structured: false,
    };
  }

  if (payload.task === 'contract_draft') {
    return {
      systemInstruction: `${shared}\nBạn soạn thảo văn bản mẫu có cấu trúc đầy đủ, dùng chỗ trống hoặc ghi chú cho dữ liệu chưa được cung cấp.`,
      contents: `Loại văn bản: ${payload.context.documentType}\nDữ liệu: ${JSON.stringify(payload.context.fields, null, 2)}\nYêu cầu: ${payload.input}`,
      config: {
        temperature: 0.2,
        maxOutputTokens: 6_000,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      },
      structured: false,
    };
  }

  if (payload.task === 'contract_compare') {
    return {
      systemInstruction: `${shared}\nBạn so sánh hai phiên bản hợp đồng, tập trung quyền, nghĩa vụ, miễn trừ trách nhiệm và rủi ro cho nhà đầu tư.`,
      contents: `PHIÊN BẢN A:\n${payload.context.versionA}\n\nPHIÊN BẢN B:\n${payload.context.versionB}\n\n${payload.input}`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 3_500,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
        responseMimeType: 'application/json',
        responseJsonSchema: comparisonSchema,
      },
      structured: true,
    };
  }

  return {
    systemInstruction: `${shared}\nBạn rà soát điều khoản hợp đồng theo hướng bảo vệ nhà đầu tư và chỉ viện dẫn quy định khi có độ tin cậy cao.`,
    contents: `Điều khoản cần rà soát:\n${payload.input}`,
    config: {
      temperature: 0.1,
      maxOutputTokens: 3_500,
      thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      responseMimeType: 'application/json',
      responseJsonSchema: auditSchema,
    },
    structured: true,
  };
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, requestId, model: MODEL, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ hỗ trợ POST.' } });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!geminiKey || !supabaseUrl || !serviceRoleKey) {
    return response.status(503).json({ ok: false, requestId, model: MODEL, error: { code: 'CONFIG_MISSING', message: 'Dịch vụ AI chưa được cấu hình đầy đủ.' } });
  }

  const token = getBearerToken(request);
  if (!token) {
    return response.status(401).json({ ok: false, requestId, model: MODEL, error: { code: 'UNAUTHORIZED', message: 'Thiếu phiên người dùng hợp lệ.' } });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return response.status(401).json({ ok: false, requestId, model: MODEL, error: { code: 'UNAUTHORIZED', message: 'Phiên người dùng đã hết hạn hoặc không hợp lệ.' } });
  }

  let rawBody = request.body;
  try {
    if (typeof rawBody === 'string') rawBody = JSON.parse(rawBody);
  } catch {
    return response.status(400).json({ ok: false, requestId, model: MODEL, error: { code: 'VALIDATION_ERROR', message: 'JSON không hợp lệ.' } });
  }
  const parsed = requestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return response.status(400).json({ ok: false, requestId, model: MODEL, error: { code: 'VALIDATION_ERROR', message: 'Nội dung yêu cầu không hợp lệ hoặc quá dài.' } });
  }

  const { data: allowed, error: quotaError } = await supabase.rpc('consume_ai_quota', { p_user_id: authData.user.id });
  if (quotaError || allowed !== true) {
    return response.status(429).json({ ok: false, requestId, model: MODEL, error: { code: 'RATE_LIMITED', message: 'Bạn đã dùng hết lượt AI tạm thời. Vui lòng thử lại sau.' } });
  }

  try {
    const query = parsed.data.task === 'chat' ? parsed.data.input : `${parsed.data.task} ${parsed.data.input}`;
    const knowledge = retrieveKnowledge(query);
    let recentNews = '';
    if (parsed.data.task === 'chat' && /(hôm nay|mới nhất|cafef|thị trường|chứng khoán)/i.test(parsed.data.input)) {
      const { data: news } = await supabase.from('news_articles').select('title,summary,source_url,published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(8);
      recentNews = (news || []).map((item) => `- ${item.title} (${item.published_at})\n  ${item.summary}\n  ${item.source_url}`).join('\n');
    }
    const prompt = getPrompt(parsed.data, knowledge.context, recentNews);
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt.contents,
      config: { ...prompt.config, systemInstruction: prompt.systemInstruction },
    });

    const text = result.text?.trim() || '';
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk) => chunk.web)
      .filter((web): web is NonNullable<typeof web> => Boolean(web?.uri))
      .map((web) => ({ title: web.title || 'Nguồn tham khảo', url: web.uri! }))
      .filter((source, index, list) => list.findIndex((item) => item.url === source.url) === index)
      .slice(0, 6);
    const sources: KnowledgeSource[] = [...knowledge.sources, ...webSources]
      .filter((source, index, list) => list.findIndex((item) => item.url === source.url) === index)
      .slice(0, 10);

    return response.status(200).json({
      ok: true,
      requestId,
      model: MODEL,
      ...(prompt.structured ? { structured: JSON.parse(text) } : { content: text }),
      sources,
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error(`[${requestId}] Gemini request failed`, error);
    return response.status(502).json({ ok: false, requestId, model: MODEL, error: { code: 'MODEL_ERROR', message: 'Gemini đang tạm thời không phản hồi. Vui lòng thử lại.' } });
  }
}
