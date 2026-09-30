import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, CheckCircle2, Clock, Flag, Loader2, MessageCircle, MessageSquare,
  Plus, Search, Send, ThumbsUp, Trash2, User, Wifi, WifiOff, X,
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import { ensureAnonymousSession, isSupabaseConfigured, supabase } from '@/lib/supabase';

type Category = 'dai-an' | 'gop-y-luat' | 'kinh-nghiem' | 'hoc-thuat';

interface ForumComment {
  id: string; topicId: string; authorId: string | null; author: string;
  role: string; text: string; createdAt: string;
}

interface ForumTopic {
  id: string; authorId: string | null; category: Category; title: string;
  author: string; authorRole: string; content: string; createdAt: string;
  likes: number; likedByMe: boolean; comments: ForumComment[]; seeded?: boolean;
}

const categoryMeta: Record<Category, { label: string; cls: string }> = {
  'gop-y-luat': { label: 'Góp Ý Hoàn Thiện Luật', cls: 'bg-orange-100 text-orange-900 border-orange-300' },
  'dai-an': { label: 'Đại Án & Án Lệ', cls: 'bg-rose-100 text-rose-900 border-rose-300' },
  'kinh-nghiem': { label: 'Kinh Nghiệm NĐT', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
  'hoc-thuat': { label: 'Hỏi Đáp Đề Tài', cls: 'bg-sky-100 text-sky-900 border-sky-300' },
};

const previewTopics: ForumTopic[] = [
  {
    id: 'preview-1', authorId: null, category: 'gop-y-luat',
    title: 'Đề xuất luật hóa cơ chế Khởi kiện tập thể trong Luật Chứng khoán sửa đổi',
    author: 'TS. Nguyễn Phương Thảo', authorRole: 'Giảng viên hướng dẫn',
    content: 'Nhà đầu tư cá nhân bị thiệt hại do hành vi thao túng giá rất khó tự mình khởi kiện vì chi phí theo đuổi vụ việc cao. Cần nghiên cứu cơ chế đại diện khởi kiện tập thể và quỹ bảo vệ nhà đầu tư.',
    createdAt: '2026-09-27T15:40:00+07:00', likes: 42, likedByMe: false, comments: [], seeded: true,
  },
  {
    id: 'preview-2', authorId: null, category: 'kinh-nghiem',
    title: 'Cảnh giác với điều khoản ủy quyền đặt lệnh toàn quyền trong hợp đồng mở tài khoản',
    author: 'Bùi Minh Khuê', authorRole: 'Nhóm 2 · Chương 3',
    content: 'Nhà đầu tư không nên giao mật khẩu hoặc OTP cho môi giới để giao dịch hộ. Khi có tranh chấp, việc chứng minh lỗi và yêu cầu bồi thường có thể rất khó khăn.',
    createdAt: '2026-09-25T14:05:00+07:00', likes: 35, likedByMe: false, comments: [], seeded: true,
  },
];

function formatTime(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value));
}

function validateCommunityText(value: string): string | null {
  const normalized = value.toLocaleLowerCase('vi');
  const blockedTerms = ['địt mẹ', 'đụ má', 'con đĩ', 'lồn', 'cặc'];
  if (blockedTerms.some((term) => normalized.includes(term))) return 'Nội dung có ngôn từ không phù hợp với diễn đàn học thuật.';
  if (/\b0\d{9}\b/.test(value) || /\b\d{12}\b/.test(value)) return 'Không đăng số điện thoại, số CCCD hoặc dữ liệu nhận dạng cá nhân.';
  if ((value.match(/https?:\/\//gi) || []).length > 2) return 'Mỗi nội dung chỉ được chứa tối đa hai liên kết tham khảo.';
  return null;
}

export function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>(previewTopics);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('gop-y-luat');
  const [newAuthor, setNewAuthor] = useState(() => localStorage.getItem('bvndt_display_name') || '');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(() => localStorage.getItem('bvndt_display_name') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) || null;

  const loadTopics = useCallback(async () => {
    if (!supabase) { setTopics(previewTopics); setIsLoading(false); return; }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id || null;
    setCurrentUserId(userId);
    const [{ data: topicRows, error: topicError }, { data: commentRows }, { data: likeRows }] = await Promise.all([
      supabase.from('topics').select('*').eq('status', 'published').order('created_at', { ascending: false }),
      supabase.from('comments').select('*').eq('status', 'published').order('created_at', { ascending: true }),
      supabase.from('topic_likes').select('topic_id,user_id'),
    ]);
    if (topicError) { setError(`Không tải được cộng đồng: ${topicError.message}`); setIsLoading(false); return; }
    const comments = (commentRows || []) as Array<Record<string, unknown>>;
    const likes = (likeRows || []) as Array<Record<string, unknown>>;
    const mapped = ((topicRows || []) as Array<Record<string, unknown>>).map((row): ForumTopic => {
      const topicId = String(row.id);
      const topicLikes = likes.filter((like) => like.topic_id === topicId);
      return {
        id: topicId, authorId: row.author_id ? String(row.author_id) : null,
        category: row.category as Category, title: String(row.title), author: String(row.author_name),
        authorRole: String(row.author_role), content: String(row.content), createdAt: String(row.created_at),
        likes: topicLikes.length, likedByMe: Boolean(userId && topicLikes.some((like) => like.user_id === userId)),
        comments: comments.filter((comment) => comment.topic_id === topicId).map((comment) => ({
          id: String(comment.id), topicId, authorId: comment.author_id ? String(comment.author_id) : null,
          author: String(comment.author_name), role: String(comment.author_role),
          text: String(comment.body), createdAt: String(comment.created_at),
        })),
        seeded: Boolean(row.is_seeded),
      };
    });
    setTopics(mapped); setError(null); setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTopics();
    if (!supabase) return;
    const channel = supabase.channel('community-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, loadTopics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, loadTopics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topic_likes' }, loadTopics)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadTopics]);

  const saveProfile = async (displayName: string) => {
    if (!supabase) throw new Error('Supabase chưa được cấu hình.');
    const session = await ensureAnonymousSession();
    const cleanName = displayName.trim();
    const { error: profileError } = await supabase.from('community_profiles').upsert({
      user_id: session.user.id, display_name: cleanName, updated_at: new Date().toISOString(),
    });
    if (profileError) throw profileError;
    localStorage.setItem('bvndt_display_name', cleanName); setCurrentUserId(session.user.id);
    return session.user.id;
  };

  const handleLike = async (topic: ForumTopic, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!supabase) { setNotice('Đây là chế độ xem trước. Hãy cấu hình Supabase để tương tác.'); return; }
    soundFx.playTap();
    try {
      const session = await ensureAnonymousSession();
      setTopics((current) => current.map((item) => item.id === topic.id
        ? { ...item, likedByMe: !item.likedByMe, likes: item.likes + (item.likedByMe ? -1 : 1) } : item));
      const query = supabase.from('topic_likes');
      const { error: likeError } = topic.likedByMe
        ? await query.delete().eq('topic_id', topic.id).eq('user_id', session.user.id)
        : await query.insert({ topic_id: topic.id, user_id: session.user.id });
      if (likeError) throw likeError;
    } catch (likeError) {
      setError(likeError instanceof Error ? likeError.message : 'Không thể cập nhật lượt thích.'); await loadTopics();
    }
  };

  const handleCreateTopic = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newTitle.trim().length < 10 || newContent.trim().length < 20 || newAuthor.trim().length < 2) return;
    const validationError = validateCommunityText(`${newTitle} ${newContent}`);
    if (validationError) { setError(validationError); return; }
    setIsSubmitting(true);
    try {
      const userId = await saveProfile(newAuthor);
      const { error: insertError } = await supabase!.from('topics').insert({
        author_id: userId, author_name: newAuthor.trim(), author_role: 'Nhà đầu tư cá nhân',
        category: newCategory, title: newTitle.trim(), content: newContent.trim(),
      });
      if (insertError) throw insertError;
      soundFx.playChime(); setIsNewTopicOpen(false); setNewTitle(''); setNewContent('');
      setNotice('Thảo luận đã được đăng và đồng bộ với cộng đồng.'); await loadTopics();
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Không thể đăng thảo luận.'); }
    finally { setIsSubmitting(false); }
  };

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeTopic || replyText.trim().length < 2 || replyAuthor.trim().length < 2) return;
    const validationError = validateCommunityText(replyText);
    if (validationError) { setError(validationError); return; }
    setIsSubmitting(true);
    try {
      const userId = await saveProfile(replyAuthor);
      const { error: insertError } = await supabase!.from('comments').insert({
        topic_id: activeTopic.id, author_id: userId, author_name: replyAuthor.trim(),
        author_role: 'Nhà đầu tư cá nhân', body: replyText.trim(),
      });
      if (insertError) throw insertError;
      setReplyText(''); await loadTopics();
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Không thể gửi bình luận.'); }
    finally { setIsSubmitting(false); }
  };

  const handleSoftDelete = async (table: 'topics' | 'comments', id: string) => {
    if (!supabase || !window.confirm('Ẩn nội dung này khỏi cộng đồng?')) return;
    const { error: deleteError } = await supabase.from(table).update({ status: 'deleted', updated_at: new Date().toISOString() }).eq('id', id);
    if (deleteError) setError(deleteError.message);
    else { if (table === 'topics') setActiveTopicId(null); await loadTopics(); }
  };

  const handleReport = async (targetType: 'topic' | 'comment', targetId: string) => {
    if (!supabase) return;
    const reason = window.prompt('Mô tả ngắn lý do cần kiểm tra nội dung này:');
    if (!reason || reason.trim().length < 5) return;
    try {
      const session = await ensureAnonymousSession();
      const { error: reportError } = await supabase.from('reports').insert({
        reporter_id: session.user.id, target_type: targetType, target_id: targetId, reason: reason.trim().slice(0, 500),
      });
      if (reportError) throw reportError; setNotice('Đã gửi báo cáo để nhóm nghiên cứu kiểm tra.');
    } catch (reportError) { setError(reportError instanceof Error ? reportError.message : 'Không thể gửi báo cáo.'); }
  };

  const filteredTopics = useMemo(() => topics.filter((topic) => {
    const query = searchQuery.trim().toLocaleLowerCase('vi');
    return (selectedCategory === 'all' || topic.category === selectedCategory)
      && (!query || `${topic.title} ${topic.content} ${topic.author}`.toLocaleLowerCase('vi').includes(query));
  }), [topics, selectedCategory, searchQuery]);
  const categories = [{ id: 'all', label: 'Tất cả' }, ...Object.entries(categoryMeta).map(([id, meta]) => ({ id, label: meta.label }))];

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#2D211B] pt-8 pb-20">
      <div className="site-shell">
        <section className="community-hero">
          <div><div className="community-eyebrow"><MessageSquare className="w-4 h-4" /> Cộng đồng học thuật có kết nối thật</div>
            <h1>Diễn Đàn Bảo Vệ Nhà Đầu Tư</h1>
            <p>Thảo luận án lệ, góp ý chính sách và chia sẻ cách tự bảo vệ quyền lợi trên một không gian minh bạch, cập nhật theo thời gian thực.</p>
          </div>
          <button onClick={() => setIsNewTopicOpen(true)} className="orange-button"><Plus className="w-4 h-4" /> Tạo thảo luận</button>
        </section>

        <div className={`connection-banner ${isSupabaseConfigured ? 'is-live' : 'is-preview'}`}>
          {isSupabaseConfigured ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isSupabaseConfigured ? 'Supabase Realtime đang hoạt động' : 'Chế độ xem trước — thêm biến môi trường Supabase để đăng bài, bình luận và đồng bộ nhiều thiết bị.'}
        </div>
        {error && <div className="community-alert is-error"><AlertCircle className="w-4 h-4" /> {error}<button onClick={() => setError(null)}><X className="w-4 h-4" /></button></div>}
        {notice && <div className="community-alert is-success"><CheckCircle2 className="w-4 h-4" /> {notice}<button onClick={() => setNotice(null)}><X className="w-4 h-4" /></button></div>}

        <div className="community-toolbar">
          <div className="community-filters">{categories.map((category) => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={selectedCategory === category.id ? 'active' : ''}>{category.label}</button>)}</div>
          <label className="community-search"><Search className="w-4 h-4" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm chủ đề hoặc tác giả…" /></label>
        </div>

        {isLoading ? <div className="community-loading"><Loader2 className="w-6 h-6 animate-spin" /> Đang tải thảo luận…</div> : (
          <div className="community-list">
            {filteredTopics.map((topic) => {
              const meta = categoryMeta[topic.category];
              return <article key={topic.id} onClick={() => setActiveTopicId(topic.id)} className="community-topic-card">
                <div className="community-topic-meta"><span className={meta.cls}>{meta.label}</span><span><Clock className="w-3.5 h-3.5" /> {formatTime(topic.createdAt)}</span></div>
                <h2>{topic.title}</h2><p>{topic.content}</p>
                <footer><span><User className="w-4 h-4" /><strong>{topic.author}</strong> · {topic.authorRole}</span>
                  <span className="community-actions"><button onClick={(event) => handleLike(topic, event)} className={topic.likedByMe ? 'liked' : ''}><ThumbsUp className="w-4 h-4" /> {topic.likes}</button><span><MessageCircle className="w-4 h-4" /> {topic.comments.length}</span></span>
                </footer>
              </article>;
            })}
            {!filteredTopics.length && <div className="community-empty">Chưa có thảo luận phù hợp với bộ lọc.</div>}
          </div>
        )}
      </div>

      {activeTopic && <div className="community-modal-backdrop" onClick={() => setActiveTopicId(null)}>
        <section className="community-modal" onClick={(event) => event.stopPropagation()}>
          <button className="community-modal-close" onClick={() => setActiveTopicId(null)} aria-label="Đóng"><X className="w-5 h-5" /></button>
          <span className={`community-modal-category ${categoryMeta[activeTopic.category].cls}`}>{categoryMeta[activeTopic.category].label}</span>
          <h2>{activeTopic.title}</h2>
          <div className="community-author"><User className="w-4 h-4" /> <strong>{activeTopic.author}</strong> · {activeTopic.authorRole} · {formatTime(activeTopic.createdAt)}</div>
          <p className="community-topic-body">{activeTopic.content}</p>
          <div className="community-detail-actions">
            <button onClick={(event) => handleLike(activeTopic, event)} className={activeTopic.likedByMe ? 'liked' : ''}><ThumbsUp className="w-4 h-4" /> {activeTopic.likes} lượt thích</button>
            <button onClick={() => handleReport('topic', activeTopic.id)}><Flag className="w-4 h-4" /> Báo cáo</button>
            {currentUserId === activeTopic.authorId && !activeTopic.seeded && <button onClick={() => handleSoftDelete('topics', activeTopic.id)}><Trash2 className="w-4 h-4" /> Xóa bài</button>}
          </div>
          <div className="community-comments"><h3><MessageCircle className="w-4 h-4" /> Bình luận ({activeTopic.comments.length})</h3>
            {activeTopic.comments.map((comment) => <div key={comment.id} className="community-comment">
              <div><strong>{comment.author}</strong><span>{comment.role} · {formatTime(comment.createdAt)}</span></div><p>{comment.text}</p>
              <div className="community-comment-actions"><button onClick={() => handleReport('comment', comment.id)}><Flag className="w-3.5 h-3.5" /> Báo cáo</button>{currentUserId === comment.authorId && <button onClick={() => handleSoftDelete('comments', comment.id)}><Trash2 className="w-3.5 h-3.5" /> Xóa</button>}</div>
            </div>)}
            {!activeTopic.comments.length && <p className="community-empty">Chưa có bình luận. Hãy mở đầu cuộc trao đổi.</p>}
            <form onSubmit={handleAddComment} className="community-reply-form"><input value={replyAuthor} onChange={(event) => setReplyAuthor(event.target.value)} minLength={2} maxLength={40} placeholder="Tên hiển thị" required /><input value={replyText} onChange={(event) => setReplyText(event.target.value)} minLength={2} maxLength={1500} placeholder="Viết bình luận có căn cứ…" required /><button type="submit" disabled={isSubmitting || !isSupabaseConfigured}><Send className="w-4 h-4" /> Gửi</button></form>
          </div>
        </section>
      </div>}

      {isNewTopicOpen && <div className="community-modal-backdrop" onClick={() => setIsNewTopicOpen(false)}>
        <section className="community-modal community-compose" onClick={(event) => event.stopPropagation()}>
          <button className="community-modal-close" onClick={() => setIsNewTopicOpen(false)} aria-label="Đóng"><X className="w-5 h-5" /></button>
          <h2>Tạo thảo luận mới</h2><p>Tên hiển thị được công khai; hệ thống không yêu cầu email. Không đăng CCCD, số tài khoản hoặc dữ liệu riêng tư.</p>
          <form onSubmit={handleCreateTopic}>
            <label>Tên hiển thị<input value={newAuthor} onChange={(event) => setNewAuthor(event.target.value)} minLength={2} maxLength={40} required /></label>
            <label>Chủ đề<select value={newCategory} onChange={(event) => setNewCategory(event.target.value as Category)}>{Object.entries(categoryMeta).map(([id, meta]) => <option key={id} value={id}>{meta.label}</option>)}</select></label>
            <label>Tiêu đề<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} minLength={10} maxLength={180} required /></label>
            <label>Nội dung<textarea value={newContent} onChange={(event) => setNewContent(event.target.value)} minLength={20} maxLength={5000} rows={7} required /></label>
            <button type="submit" disabled={isSubmitting || !isSupabaseConfigured} className="orange-button">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Đăng thảo luận</button>
          </form>
        </section>
      </div>}
    </div>
  );
}
