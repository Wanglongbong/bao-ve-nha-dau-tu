import { getAccessToken } from '@/lib/supabase';

export type AiTask =
  | 'chat'
  | 'article_qa'
  | 'contract_draft'
  | 'contract_compare'
  | 'risk_audit';

export interface AiSource {
  title: string;
  url: string;
}

export interface ContractDifference {
  title: string;
  risk: string;
  advice: string;
}

export interface RiskAuditResult {
  score: number;
  level: string;
  summary: string;
  violations: Array<{ law: string; desc: string }>;
  recommendation: string;
}

export interface AiResponse<T = unknown> {
  ok: boolean;
  requestId: string;
  model: string;
  content?: string;
  structured?: T;
  sources?: AiSource[];
  latencyMs?: number;
  error?: { code: string; message: string };
}

export type AiPayload =
  | { task: 'chat'; input: string; conversation?: Array<{ role: 'user' | 'assistant'; text: string }> }
  | { task: 'article_qa'; input: string; context: { title: string; summary: string; legalReference: string; sourceUrl?: string } }
  | { task: 'contract_draft'; input: string; context: { documentType: string; fields: Record<string, string> } }
  | { task: 'contract_compare'; input: string; context: { versionA: string; versionB: string } }
  | { task: 'risk_audit'; input: string };

export type StreamableAiPayload = Extract<AiPayload, { task: 'chat' | 'article_qa' | 'contract_draft' }>;

export function cleanAiText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trimStart();
}

export async function callAiTask<T = unknown>(payload: AiPayload): Promise<AiResponse<T>> {
  let token: string;
  try {
    token = await getAccessToken();
  } catch (error) {
    return {
      ok: false,
      requestId: crypto.randomUUID(),
      model: 'gemini-3.8-flash',
      error: {
        code: 'SUPABASE_NOT_CONFIGURED',
        message: error instanceof Error ? error.message : 'Chưa cấu hình Supabase.',
      },
    };
  }

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json() as Partial<AiResponse<T>>;
    if (typeof data.ok !== 'boolean' || typeof data.requestId !== 'string' || typeof data.model !== 'string') {
      throw new Error('Phản hồi AI không đúng định dạng.');
    }
    if (typeof data.content === 'string') data.content = cleanAiText(data.content);
    return data as AiResponse<T>;
  } catch (error) {
    return {
      ok: false,
      requestId: crypto.randomUUID(),
      model: 'gemini-3.8-flash',
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Không thể kết nối tới dịch vụ AI.',
      },
    };
  }
}

export async function streamAiTask(
  payload: StreamableAiPayload,
  onText: (text: string) => void
): Promise<AiResponse> {
  let token: string;
  try {
    token = await getAccessToken();
  } catch (error) {
    return {
      ok: false,
      requestId: crypto.randomUUID(),
      model: 'gemini-3.8-flash',
      error: { code: 'SUPABASE_NOT_CONFIGURED', message: error instanceof Error ? error.message : 'Chưa cấu hình Supabase.' },
    };
  }

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/x-ndjson',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/x-ndjson') || !response.body) {
      const data = await response.json() as AiResponse;
      if (data.content) {
        data.content = cleanAiText(data.content);
        onText(data.content);
      }
      return data;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let rawText = '';
    let requestId: string = crypto.randomUUID();
    let model = 'gemini-3.8-flash';
    let sources: AiSource[] = [];
    let latencyMs: number | undefined;
    let streamError: AiResponse['error'];

    const processLine = (line: string) => {
      if (!line.trim()) return;
      const event = JSON.parse(line) as {
        type: 'start' | 'delta' | 'done' | 'error';
        text?: string;
        requestId?: string;
        model?: string;
        sources?: AiSource[];
        latencyMs?: number;
        code?: string;
        message?: string;
      };
      if (event.requestId) requestId = event.requestId;
      if (event.model) model = event.model;
      if (event.type === 'delta' && event.text) {
        rawText += event.text;
        onText(cleanAiText(rawText));
      }
      if (event.type === 'done') {
        sources = event.sources || [];
        latencyMs = event.latencyMs;
      }
      if (event.type === 'error') {
        streamError = { code: event.code || 'MODEL_ERROR', message: event.message || 'Gemini đang tạm thời không phản hồi.' };
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      lines.forEach(processLine);
      if (done) break;
    }
    if (buffer.trim()) processLine(buffer);

    const content = cleanAiText(rawText);
    return streamError
      ? { ok: false, requestId, model, content, sources, latencyMs, error: streamError }
      : { ok: true, requestId, model, content, sources, latencyMs };
  } catch (error) {
    return {
      ok: false,
      requestId: crypto.randomUUID(),
      model: 'gemini-3.8-flash',
      error: { code: 'NETWORK_ERROR', message: error instanceof Error ? error.message : 'Không thể kết nối tới dịch vụ AI.' },
    };
  }
}
