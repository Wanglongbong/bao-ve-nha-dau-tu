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
  | { task: 'article_qa'; input: string; context: { title: string; summary: string; legalReference: string } }
  | { task: 'contract_draft'; input: string; context: { documentType: string; fields: Record<string, string> } }
  | { task: 'contract_compare'; input: string; context: { versionA: string; versionB: string } }
  | { task: 'risk_audit'; input: string };

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
