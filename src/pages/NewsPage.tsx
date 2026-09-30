import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, Archive, ArrowUpRight, CalendarDays, Check, Clock3, Copy,
  FileSearch, Flame, Landmark, Loader2, Newspaper, RefreshCw, Scale, Search, Send,
  ShieldAlert, Sparkles, TrendingUp, X,
} from 'lucide-react';
import { askAboutNewsArticle } from '@/lib/gemini-client';
import { getAccessToken, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { soundFx } from '@/lib/audio-effects';
import { BotanicalHeaderCrest, BotanicalVineDivider, BotanicalWatermark } from '@/components/botanical-filigree';

type NewsCategory = 'chinh-sach' | 'xu-phat' | 'canh-bao' | 'thi-truong';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  source_name: string;
  source_url: string;
  published_at: string;
  legal_references: string[];
  investor_takeaway: string;
  image_url: string | null;
  sync_date: string;
  isFallback?: boolean;
}

interface SyncRun {
  finished_at: string | null;
  accepted_count: number;
  status: 'success' | 'failed';
}

const CATEGORY_META: Record<NewsCategory, { label: string; icon: React.ReactNode }> = {
  'chinh-sach': { label: 'Chính sách', icon: <Landmark size={15} /> },
  'xu-phat': { label: 'Xử phạt', icon: <Scale size={15} /> },
  'canh-bao': { label: 'Cảnh báo', icon: <ShieldAlert size={15} /> },
  'thi-truong': { label: 'Thị trường', icon: <TrendingUp size={15} /> },
};

const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 'preview-shareholder-rights',
    title: 'Tăng cường cơ chế bảo vệ cổ đông thiểu số trong công ty đại chúng',
    summary: 'Bản minh họa cách chuyên trang trình bày thay đổi chính sách, quyền biểu quyết và cơ chế giám sát giao dịch với người có liên quan.',
    category: 'chinh-sach', source_name: 'Bản biên tập minh họa', source_url: '',
    published_at: '2026-09-29T08:30:00+07:00', legal_references: ['Luật Chứng khoán 2019'],
    investor_takeaway: 'Theo dõi thông báo họp đại hội đồng cổ đông và lưu giữ tài liệu biểu quyết để bảo vệ quyền lợi của mình.',
    image_url: '/editorial/shareholder-rights.webp', sync_date: '2026-09-29', isFallback: true,
  },
  {
    id: 'preview-market-infrastructure',
    title: 'Hạ tầng thanh toán mới và những lưu ý đối với nhà đầu tư cá nhân',
    summary: 'Bản minh họa về thay đổi quy trình thanh toán, quản trị rủi ro và yêu cầu minh bạch trong hoạt động giao dịch chứng khoán.',
    category: 'thi-truong', source_name: 'Bản biên tập minh họa', source_url: '',
    published_at: '2026-09-28T14:15:00+07:00', legal_references: ['Thông tư 68/2024/TT-BTC'],
    investor_takeaway: 'Không nên suy diễn thay đổi kỹ thuật thành tín hiệu mua bán; hãy kiểm tra phạm vi áp dụng của từng quy định.',
    image_url: '/editorial/market-infrastructure.webp', sync_date: '2026-09-28', isFallback: true,
  },
  {
    id: 'preview-legal-remedies',
    title: 'Lưu giữ chứng cứ khi yêu cầu bồi thường thiệt hại trên thị trường chứng khoán',
    summary: 'Bản minh họa về vai trò của sao kê giao dịch, hợp đồng và thông báo công bố thông tin khi nhà đầu tư tham gia tố tụng.',
    category: 'xu-phat', source_name: 'Bản biên tập minh họa', source_url: '',
    published_at: '2026-09-27T10:00:00+07:00', legal_references: ['Bộ luật Dân sự 2015'],
    investor_takeaway: 'Lưu bản gốc chứng từ giao dịch và gửi yêu cầu đến đúng cơ quan có thẩm quyền trong thời hạn pháp luật quy định.',
    image_url: '/editorial/legal-remedies.webp', sync_date: '2026-09-27', isFallback: true,
  },
  {
    id: 'preview-fraud-warning',
    title: 'Nhận diện lời mời đầu tư cam kết lợi nhuận qua hội nhóm trực tuyến',
    summary: 'Bản minh họa các dấu hiệu thường gặp của ứng dụng giả mạo, môi giới không được cấp phép và yêu cầu chuyển thêm phí để rút tiền.',
    category: 'canh-bao', source_name: 'Bản biên tập minh họa', source_url: '',
    published_at: '2026-09-26T16:45:00+07:00', legal_references: ['Luật Chứng khoán 2019'],
    investor_takeaway: 'Không chia sẻ OTP, không chuyển tiền vào tài khoản cá nhân và luôn kiểm tra giấy phép của tổ chức cung cấp dịch vụ.',
    image_url: '/editorial/fraud-warning.webp', sync_date: '2026-09-26', isFallback: true,
  },
];

function formatDate(value: string, includeTime = true): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

function NewsCard({ article, onOpen, onAsk }: { article: NewsArticle; onOpen: () => void; onAsk: () => void }) {
  const meta = CATEGORY_META[article.category];
  return (
    <article className="news-card">
      <button type="button" className="news-card-image" onClick={onOpen} aria-label={`Mở bài ${article.title}`}>
        <img src={article.image_url || '/editorial/shareholder-rights.webp'} alt="" loading="lazy" />
        <span className={`news-category is-${article.category}`}>{meta.icon}{meta.label}</span>
      </button>
      <div className="news-card-body">
        <div className="news-card-meta"><span>{article.source_name}</span><span>•</span><time>{formatDate(article.published_at, false)}</time></div>
        <button type="button" className="news-card-title" onClick={onOpen}>{article.title}</button>
        <p>{article.summary}</p>
        <div className="news-card-actions">
          <button type="button" className="news-secondary-button" onClick={onAsk}><Sparkles size={15} /> Hỏi AI</button>
          {article.source_url
            ? <a className="news-primary-button" href={article.source_url} target="_blank" rel="noreferrer">Đọc nguồn <ArrowUpRight size={15} /></a>
            : <button type="button" className="news-primary-button" onClick={onOpen}>Xem tóm tắt</button>}
        </div>
      </div>
    </article>
  );
}

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(FALLBACK_ARTICLES);
  const [syncRun, setSyncRun] = useState<SyncRun | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | NewsCategory>('all');
  const [archiveDate, setArchiveDate] = useState('latest');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [aiArticle, setAiArticle] = useState<NewsArticle | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async () => {
    if (!supabase) {
      setArticles(FALLBACK_ARTICLES);
      setNotice('Đang hiển thị dữ liệu minh họa vì Supabase chưa được cấu hình trên bản local.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const [articlesResult, syncResult] = await Promise.all([
      supabase.from('news_articles').select('id,title,summary,category,source_name,source_url,published_at,legal_references,investor_takeaway,image_url,sync_date').eq('status', 'published').order('published_at', { ascending: false }).limit(120),
      supabase.from('news_sync_runs').select('finished_at,accepted_count,status').eq('status', 'success').order('finished_at', { ascending: false }).limit(1).maybeSingle(),
    ]);
    if (articlesResult.error) {
      setArticles(FALLBACK_ARTICLES);
      setNotice('Chưa tải được kho tin. Hệ thống đang dùng dữ liệu minh họa và sẽ không tạo tin giả.');
    } else if ((articlesResult.data || []).length === 0) {
      setArticles(FALLBACK_ARTICLES);
      setNotice('Chưa có tin nào đạt tiêu chí kiểm chứng. Dưới đây là dữ liệu minh họa giao diện.');
    } else {
      setArticles((articlesResult.data || []) as NewsArticle[]);
      setNotice('');
    }
    if (!syncResult.error && syncResult.data) setSyncRun(syncResult.data as SyncRun);
    setLoading(false);
  }, []);

  useEffect(() => { void loadNews(); }, [loadNews]);

  const refreshFromCafeF = async () => {
    if (refreshing) return;
    soundFx.playChime();
    setRefreshing(true);
    setNotice('Đang lấy các bài mới nhất trong ngày từ chuyên mục Chứng khoán CafeF…');
    try {
      const token = await getAccessToken();
      const response = await fetch('/api/news-refresh', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json() as { ok?: boolean; cached?: boolean; accepted?: number; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Không thể cập nhật CafeF.');
      await loadNews();
      setNotice(result.cached ? 'Kho tin vừa được cập nhật trong 10 phút gần đây.' : `Đã cập nhật ${result.accepted || 0} bài CafeF mới trong ngày.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'CafeF tạm thời chưa phản hồi; kho tin gần nhất vẫn được giữ nguyên.');
    } finally {
      setRefreshing(false);
    }
  };

  const dates = useMemo(() => Array.from(new Set(articles.map((item) => item.sync_date))).sort().reverse(), [articles]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return articles.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category;
      const dateMatch = archiveDate === 'latest' || item.sync_date === archiveDate;
      const queryMatch = !normalized || `${item.title} ${item.summary} ${item.source_name}`.toLocaleLowerCase('vi').includes(normalized);
      return categoryMatch && dateMatch && queryMatch;
    });
  }, [articles, category, archiveDate, query]);

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  const openAi = (article: NewsArticle) => {
    soundFx.playChime();
    setAiArticle(article);
    setAiQuestion('Tin này ảnh hưởng thế nào đến nhà đầu tư cá nhân?');
    setAiAnswer('');
  };

  const askAi = async () => {
    if (!aiArticle || !aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    try {
      setAiAnswer(await askAboutNewsArticle(aiArticle.title, aiArticle.summary, aiArticle.legal_references.join('; '), aiQuestion.trim()));
    } catch {
      setAiAnswer('Chưa thể kết nối Gemini 3.8. Vui lòng kiểm tra cấu hình dịch vụ và thử lại.');
    } finally {
      setAiLoading(false);
    }
  };

  const copyAnswer = async () => {
    if (!aiAnswer) return;
    await navigator.clipboard.writeText(aiAnswer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_800);
  };

  return (
    <main className="news-page">
      <div className="site-shell news-live-ticker">
        <div className="news-live-ticker-inner">
          <span className="news-live-badge"><Flame size={14} /> Tin nóng 24/7</span>
          <span className="news-live-copy">TIN CHỨNG KHOÁN CAFEF MỚI NHẤT TRONG NGÀY · ĐƯỢC LƯU THEO NGUỒN VÀ THỜI GIAN ĐĂNG</span>
          <button type="button" onClick={() => void refreshFromCafeF()} disabled={refreshing}><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />{refreshing ? 'Đang cập nhật…' : 'Làm mới tin'}</button>
        </div>
      </div>
      <section className="news-hero site-shell">
        <BotanicalWatermark opacity={0.035} />
        <div className="news-sync-bar">
          <span className="news-sync-dot" />
          <span>{syncRun?.status === 'success' ? `Đã đồng bộ ${syncRun.accepted_count} tin đạt chuẩn` : 'Chuyên trang tin pháp lý đã kiểm chứng'}</span>
          <span className="news-sync-time"><Clock3 size={14} /> {syncRun?.finished_at ? formatDate(syncRun.finished_at) : 'Cập nhật mỗi buổi sáng'}</span>
        </div>
        <div className="news-heading-grid">
          <div>
            <span className="eyebrow"><Newspaper size={16} /> Tin pháp luật chứng khoán</span>
            <h1>Cẩm Nang &amp; Tin Tức Pháp Luật Chứng Khoán</h1>
            <BotanicalHeaderCrest className="news-botanical-crest" />
            <p>Cập nhật tin thị trường trong ngày từ CafeF, kèm nguồn bài gốc và công cụ AI hỗ trợ nhà đầu tư đọc hiểu thông tin.</p>
          </div>
          <div className="news-trust-card"><FileSearch size={24} /><div><strong>Nguồn được ưu tiên</strong><span>UBCKNN · Bộ Tài chính · Chính phủ · VSDC/VNX</span></div></div>
        </div>
        <div className="news-toolbar">
          <label className="news-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo nội dung hoặc nguồn…" /></label>
          <div className="news-filter-row" role="group" aria-label="Lọc danh mục">
            <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>Tất cả</button>
            {(Object.keys(CATEGORY_META) as NewsCategory[]).map((key) => <button key={key} className={category === key ? 'active' : ''} onClick={() => setCategory(key)}>{CATEGORY_META[key].label}</button>)}
          </div>
          <label className="news-archive-select"><Archive size={17} /><select value={archiveDate} onChange={(event) => setArchiveDate(event.target.value)}><option value="latest">Tin mới nhất</option>{dates.map((date) => <option value={date} key={date}>{formatDate(`${date}T00:00:00+07:00`, false)}</option>)}</select></label>
          <button className="news-refresh" onClick={() => void refreshFromCafeF()} disabled={loading || refreshing} title="Lấy tin mới trực tiếp từ CafeF"><RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} /><span>Làm mới</span></button>
        </div>
        {notice && <div className="news-notice"><AlertCircle size={17} /><span>{notice}</span></div>}
        <BotanicalVineDivider className="news-vine-divider" />
      </section>

      <section className="site-shell news-results" aria-busy={loading}>
        {loading ? <div className="news-empty"><Loader2 className="animate-spin" /><strong>Đang tải kho tin đã kiểm chứng…</strong></div> : featured ? (
          <>
            <article className="news-featured">
              <button type="button" className="news-featured-image" onClick={() => setActiveArticle(featured)} aria-label={`Mở bài ${featured.title}`}>
                <img src={featured.image_url || '/editorial/shareholder-rights.webp'} alt="" />
                <span className={`news-category is-${featured.category}`}>{CATEGORY_META[featured.category].icon}{CATEGORY_META[featured.category].label}</span>
              </button>
              <div className="news-featured-content">
                <span className="news-kicker">Tin nổi bật</span>
                <div className="news-card-meta"><span>{featured.source_name}</span><span>•</span><time>{formatDate(featured.published_at)}</time></div>
                <button type="button" className="news-featured-title" onClick={() => setActiveArticle(featured)}>{featured.title}</button>
                <p>{featured.summary}</p>
                <div className="news-takeaway"><Scale size={18} /><span><strong>Điểm nhà đầu tư cần lưu ý:</strong> {featured.investor_takeaway}</span></div>
                <div className="news-card-actions">
                  <button className="news-secondary-button" onClick={() => openAi(featured)}><Sparkles size={16} /> Hỏi Gemini 3.8</button>
                  {featured.source_url ? <a className="news-primary-button" href={featured.source_url} target="_blank" rel="noreferrer">Đọc bài gốc <ArrowUpRight size={16} /></a> : <button className="news-primary-button" onClick={() => setActiveArticle(featured)}>Xem tóm tắt</button>}
                </div>
              </div>
            </article>
            <div className="news-section-heading"><div><span>Kho tin mới nhất</span><h2>{archiveDate === 'latest' ? 'Những cập nhật đáng chú ý' : `Tin ngày ${formatDate(`${archiveDate}T00:00:00+07:00`, false)}`}</h2></div><strong>{filtered.length} bài</strong></div>
            <div className="news-grid">{remaining.map((article) => <NewsCard key={article.id} article={article} onOpen={() => setActiveArticle(article)} onAsk={() => openAi(article)} />)}</div>
          </>
        ) : <div className="news-empty"><CalendarDays /><strong>Không có tin phù hợp</strong><span>Thử đổi từ khóa, danh mục hoặc ngày lưu trữ.</span></div>}
      </section>

      {activeArticle && (
        <div className="light-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActiveArticle(null)}>
          <article className="news-modal" role="dialog" aria-modal="true" aria-label={activeArticle.title}>
            <button className="light-modal-close" onClick={() => setActiveArticle(null)} aria-label="Đóng"><X size={20} /></button>
            <span className={`news-category is-${activeArticle.category}`}>{CATEGORY_META[activeArticle.category].icon}{CATEGORY_META[activeArticle.category].label}</span>
            <h2>{activeArticle.title}</h2>
            <div className="news-card-meta"><span>{activeArticle.source_name}</span><span>•</span><time>{formatDate(activeArticle.published_at)}</time></div>
            <img className="news-modal-image" src={activeArticle.image_url || '/editorial/shareholder-rights.webp'} alt="" />
            <p className="news-modal-summary">{activeArticle.summary}</p>
            <div className="news-takeaway"><Scale size={18} /><span><strong>Điểm nhà đầu tư cần lưu ý:</strong> {activeArticle.investor_takeaway}</span></div>
            {activeArticle.legal_references.length > 0 && <div className="news-legal-list"><strong>Căn cứ được nguồn đề cập</strong>{activeArticle.legal_references.map((reference) => <span key={reference}>{reference}</span>)}</div>}
            <p className="news-ai-disclaimer">Nội dung trên là bản tóm tắt phục vụ nghiên cứu, không thay thế bài gốc hoặc tư vấn pháp lý.</p>
            <div className="news-card-actions"><button className="news-secondary-button" onClick={() => { setActiveArticle(null); openAi(activeArticle); }}><Sparkles size={16} /> Hỏi AI về bài này</button>{activeArticle.source_url && <a className="news-primary-button" href={activeArticle.source_url} target="_blank" rel="noreferrer">Đọc bài gốc <ArrowUpRight size={16} /></a>}</div>
          </article>
        </div>
      )}

      {aiArticle && (
        <div className="light-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAiArticle(null)}>
          <section className="news-modal news-ai-modal" role="dialog" aria-modal="true" aria-label="Hỏi AI về bài báo">
            <button className="light-modal-close" onClick={() => setAiArticle(null)} aria-label="Đóng"><X size={20} /></button>
            <span className="eyebrow"><Sparkles size={16} /> Gemini 3.8 · Phân tích theo nguồn</span>
            <h2>Hỏi về bài viết</h2><p className="news-ai-article">{aiArticle.title}</p>
            <div className="news-ai-form"><textarea value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} rows={3} placeholder="Nhập câu hỏi…" /><button onClick={() => void askAi()} disabled={aiLoading || !aiQuestion.trim()}>{aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Gửi câu hỏi</button></div>
            {aiAnswer && <div className="news-ai-answer"><div className="news-ai-answer-head"><strong>Phân tích tham khảo</strong><button onClick={() => void copyAnswer()}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Đã chép' : 'Sao chép'}</button></div><p>{aiAnswer}</p></div>}
            <p className="news-ai-disclaimer">AI có thể mắc lỗi. Luôn đối chiếu bài gốc và văn bản pháp luật trước khi hành động.</p>
          </section>
        </div>
      )}
    </main>
  );
}
