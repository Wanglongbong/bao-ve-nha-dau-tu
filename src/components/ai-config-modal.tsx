import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  getCustomApiKey,
  saveCustomApiKey,
  callGeminiApi,
} from '@/lib/gemini-client';
import { soundFx } from '@/lib/audio-effects';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export function AiConfigModal({ isOpen, onClose, onKeySaved }: AiConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [pingMsg, setPingMsg] = useState('');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getCustomApiKey());
      setPingStatus('idle');
      setPingMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundFx.playTap();
    saveCustomApiKey(apiKey);
    onKeySaved?.();
    setPingMsg('Đã lưu cấu hình API Key vào trình duyệt của bạn!');
    setPingStatus('success');
  };

  const handleTestConnection = async () => {
    soundFx.playChime();
    setPingStatus('testing');
    setPingMsg('Đang gửi truy vấn thử nghiệm tới Google Gemini 2.5 Flash...');
    
    // Temporarily save to test
    saveCustomApiKey(apiKey);

    const res = await callGeminiApi(
      'Bạn là trợ lý pháp luật chứng khoán Việt Nam.',
      'Hãy chào nhà đầu tư và nêu 1 câu ngắn gọn về tính minh bạch của thị trường chứng khoán.',
      'gemini-2.5-flash'
    );

    if (res.ok) {
      setPingStatus('success');
      setLatency(res.latencyMs || 420);
      setPingMsg(`Kết nối Gemini 2.5 Flash thành công (${res.latencyMs}ms): "${res.content.slice(0, 120)}..."`);
    } else {
      setPingStatus('error');
      setPingMsg(
        res.error === 'NO_API_KEY'
          ? 'Chưa nhập API Key. Hệ thống sẽ tự động dùng Mẫu Phân Tích Pháp Lý Chuẩn chất lượng cao.'
          : `Lỗi kết nối: ${res.error}. Kiểm tra lại tính hợp lệ của Key.`
      );
    }
  };

  const handleClear = () => {
    soundFx.playTap();
    setApiKey('');
    saveCustomApiKey('');
    setPingStatus('idle');
    setPingMsg('Đã xóa API Key cá nhân. Chuyển về chế độ Mẫu Dự Phòng Chuẩn.');
    onKeySaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-serif">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FFF6EB] border-2 border-orange-300 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-[#2B1705]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 flex items-center justify-center transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2A1305]">
              Cấu Hình Google Gemini API
            </h3>
            <p className="text-xs text-orange-700 font-sans font-medium">
              Mô hình khuyến nghị: <code>gemini-2.5-flash</code> (Tối ưu hóa tốc độ & chi phí)
            </p>
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-orange-900 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-orange-600" /> Nhập Google Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 hover:text-orange-800 underline font-normal lowercase flex items-center gap-1"
              >
                Lấy key miễn phí <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 outline-none bg-white font-mono text-sm text-[#2A1305] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-slate-400 hover:text-orange-600 transition"
                title={showKey ? 'Ẩn key' : 'Hiện key'}
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              Key được lưu cục bộ trong trình duyệt (LocalStorage) của bạn và không gửi qua bất kỳ máy chủ trung gian nào.
            </p>
          </div>

          {/* Status Message */}
          {pingMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                pingStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : pingStatus === 'error'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              {pingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {pingStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0 mt-0.5" />}
              {pingStatus === 'error' && <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{pingMsg}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={pingStatus === 'testing'}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl border-2 border-orange-400 text-orange-800 font-bold text-xs uppercase tracking-wider hover:bg-orange-100 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-orange-600" />
            Kiểm tra kết nối
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Lưu Cấu Hình
          </button>

          {apiKey && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-800 underline font-sans py-1"
            >
              Xóa Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
