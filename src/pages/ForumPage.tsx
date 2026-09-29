import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  User,
  ShieldCheck,
  Tag,
  Filter,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface ForumComment {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
}

interface ForumTopic {
  id: string;
  category: 'dai-an' | 'gop-y-luat' | 'kinh-nghiem' | 'hoc-thuat';
  categoryLabel: string;
  badgeClass: string;
  title: string;
  author: string;
  authorRole: string;
  time: string;
  content: string;
  likes: number;
  comments: ForumComment[];
}

const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 'topic-1',
    category: 'gop-y-luat',
    categoryLabel: 'Góp Ý Hoàn Thiện Luật',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
    title: 'Đề xuất luật hóa cơ chế Khởi kiện tập thể (Class Action) trong Luật Chứng khoán sửa đổi',
    author: 'TS. Nguyễn Phương Thảo',
    authorRole: 'Giảng viên hướng dẫn',
    time: '27/09/2026 • 15:40',
    content:
      'Hiện nay nhà đầu tư cá nhân bị thiệt hại do hành vi thao túng giá rất khó tự mình khởi kiện dân sự vì chi phí luật sư quá cao so với giá trị thiệt hại đơn lẻ. Cần khẩn trương thiết lập cơ chế đại diện khởi kiện tập thể thông qua Hiệp hội các nhà đầu tư tài chính (VAFI) hoặc Quỹ bảo vệ nhà đầu tư.',
    likes: 42,
    comments: [
      {
        id: 'c1',
        author: 'Vũ Anh Quân',
        role: 'Nhóm 2 (Word & Web)',
        text: 'Em hoàn toàn đồng ý với Cô ạ. Trong Chương 3 của đề tài nhóm em cũng đã phân tích kinh nghiệm của SEC Hoa Kỳ về Rule 23 Class Action để kiến nghị áp dụng tại Việt Nam.',
        time: '27/09/2026 • 16:15',
      },
      {
        id: 'c2',
        author: 'Lê Đức Minh',
        role: 'Trưởng nhóm',
        text: 'Nếu có cơ chế này thì hàng chục nghìn cổ đông FLC sẽ có đại diện đứng ra đòi lại quyền lợi một cách đồng bộ và tiết kiệm án phí rất nhiều.',
        time: '27/09/2026 • 17:02',
      },
    ],
  },
  {
    id: 'topic-2',
    category: 'dai-an',
    categoryLabel: 'Đại Án & Án Lệ',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    title: 'Xác định thiệt hại thực tế của nhà đầu tư trong vụ án thao túng giá cổ phiếu: Cần công thức rõ ràng!',
    author: 'Hoàng Thu Hiền',
    authorRole: 'Nhóm 2 (Chương 2)',
    time: '26/09/2026 • 09:20',
    content:
      'Khó khăn lớn nhất trong các phiên tòa hình sự về Điều 211 BLHS là việc bóc tách: phần lỗ nào do thị trường chung giảm điểm, phần lỗ nào trực tiếp do lệnh mua ảo của đối tượng thao túng gây ra. Nhóm đề tài đã đề xuất phương pháp Event Study của tài chính hành vi để giám định tư pháp.',
    likes: 29,
    comments: [
      {
        id: 'c3',
        author: 'Ngô Quang Trường',
        role: 'Nhóm 2 (Chương 2)',
        text: 'Nghị định 245/2025 vừa ban hành đã bổ sung thêm hướng dẫn về tính toán giá trị giao dịch không công bố thông tin, đây là một điểm tựa rất tốt cho Tòa án.',
        time: '26/09/2026 • 11:30',
      },
    ],
  },
  {
    id: 'topic-3',
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh Nghiệm NĐT',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'Cảnh giác với các điều khoản ủy quyền đặt lệnh toàn quyền trong Hợp đồng mở tài khoản',
    author: 'Bùi Minh Khuê',
    authorRole: 'Nhóm 2 (Chương 3)',
    time: '25/09/2026 • 14:05',
    content:
      'Nhiều môi giới đề nghị NĐT ký giấy ủy quyền đặt lệnh hoặc đưa mật khẩu tài khoản kèm OTP để "đánh hộ". Đây là hành vi vi phạm nghiêm trọng Điều 89 Luật Chứng khoán và khi tài khoản bị cháy, CTCK sẽ phủi bỏ trách nhiệm vì coi đó là thỏa thuận dân sự cá nhân.',
    likes: 35,
    comments: [
      {
        id: 'c4',
        author: 'Đinh Thị Minh Hoà',
        role: 'Nhóm 2 (Slides & Thuyết trình)',
        text: 'NĐT cá nhân cần nhớ nguyên tắc sống còn: Tuyệt đối không bao giờ chia sẻ mật khẩu giao dịch và mã Smart OTP cho bất kỳ ai, kể cả nhân viên môi giới!',
        time: '25/09/2026 • 14:50',
      },
    ],
  },
  {
    id: 'topic-4',
    category: 'hoc-thuat',
    categoryLabel: 'Hỏi Đáp Đề Tài 261LAW10A01',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    title: 'Hỏi về tài liệu tham khảo: Số liệu thanh tra xử phạt của UBCKNN giai đoạn 2021 - 2026',
    author: 'Trần Sỹ Long',
    authorRole: 'Nhóm 2 (Báo cáo)',
    time: '24/09/2026 • 10:15',
    content:
      'Để hoàn thiện Báo cáo thuyết trình, các bạn có thể tra cứu toàn bộ 2.731 văn bản xử phạt hành chính trên Cổng thông tin UBCKNN hoặc trong Bản Word toàn văn phần Phụ lục thống kê của nhóm trên website nhé!',
    likes: 18,
    comments: [],
  },
];

const STORAGE_FORUM_KEY = 'ck_forum_topics_2026';

export function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_FORUM_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_TOPICS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);

  // New Topic Modal State
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'dai-an' | 'gop-y-luat' | 'kinh-nghiem' | 'hoc-thuat'>('gop-y-luat');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Nhà đầu tư cá nhân');
  const [newContent, setNewContent] = useState('');

  // Comment Input State
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_FORUM_KEY, JSON.stringify(topics));
    }
  }, [topics]);

  const categories = [
    { id: 'all', label: 'Tất Cả Thảo Luận' },
    { id: 'gop-y-luat', label: 'Góp Ý Luật & Cơ Chế' },
    { id: 'dai-an', label: 'Đại Án & Bồi Thường' },
    { id: 'kinh-nghiem', label: 'Cảnh Báo & Kinh Nghiệm' },
    { id: 'hoc-thuat', label: 'Hỏi Đáp Đề Tài 261LAW10A01' },
  ];

  const handleLike = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playTap();
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, likes: t.likes + 1 } : t))
    );
    if (activeTopic?.id === topicId) {
      setActiveTopic((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) return;

    soundFx.playChime();
    const catMap = {
      'gop-y-luat': { label: 'Góp Ý Hoàn Thiện Luật', cls: 'bg-orange-100 text-orange-900 border-orange-300' },
      'dai-an': { label: 'Đại Án & Án Lệ', cls: 'bg-rose-100 text-rose-900 border-rose-300' },
      'kinh-nghiem': { label: 'Kinh Nghiệm NĐT', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
      'hoc-thuat': { label: 'Hỏi Đáp Đề Tài 261LAW10A01', cls: 'bg-blue-100 text-blue-900 border-blue-300' },
    };

    const newTopicItem: ForumTopic = {
      id: `topic-${Date.now()}`,
      category: newCategory,
      categoryLabel: catMap[newCategory].label,
      badgeClass: catMap[newCategory].cls,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      authorRole: newRole.trim() || 'Thành viên diễn đàn',
      time: 'Vừa xong',
      content: newContent.trim(),
      likes: 1,
      comments: [],
    };

    setTopics([newTopicItem, ...topics]);
    setIsNewTopicOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyText.trim() || !replyAuthor.trim()) return;

    soundFx.playTap();
    const newComment: ForumComment = {
      id: `c-${Date.now()}`,
      author: replyAuthor.trim(),
      role: 'Độc giả / NĐT cá nhân',
      text: replyText.trim(),
      time: 'Vừa xong',
    };

    const updated = {
      ...activeTopic,
      comments: [...activeTopic.comments, newComment],
    };

    setActiveTopic(updated);
    setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
  };

  const filteredTopics = topics.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B1705] font-serif pt-6 pb-20">
      {/* Top Academic Ribbon */}
      <div className="site-shell mb-8">
        <div className="bg-gradient-to-r from-[#FFF5EB] via-[#FFE8CC] to-[#FFDCB0] border-2 border-orange-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-200/80 px-3.5 py-1.5 rounded-full w-fit mb-2">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>Diễn Đàn Học Thuật &amp; Phản Biện Pháp Lý</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241003]">
              Diễn Đàn Cộng Đồng Nhà Đầu Tư
            </h1>
            <p className="text-sm sm:text-base text-[#5A2C0D] mt-1 max-w-2xl leading-relaxed">
              Không gian thảo luận, phản biện án lệ, đóng góp ý kiến sửa đổi Luật Chứng khoán và chia sẻ kinh nghiệm tự bảo vệ quyền lợi hợp pháp.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playTap();
              setIsNewTopicOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Thảo Luận Mới</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="site-shell">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playTap();
                  setSelectedCategory(c.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  selectedCategory === c.id
                    ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                    : 'bg-white border-orange-200 text-orange-950 hover:bg-orange-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-orange-700 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chủ đề, tác giả..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-orange-300 focus:border-orange-500 outline-none text-xs sm:text-sm bg-white text-[#2A1305]"
            />
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                soundFx.playTap();
                setActiveTopic(topic);
              }}
              className="bg-white border-2 border-orange-200 hover:border-orange-500 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${topic.badgeClass}`}>
                    {topic.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {topic.time}
                  </span>
                </div>

                <div className="text-xs text-orange-900 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <strong>{topic.author}</strong>
                  <span className="text-slate-400">({topic.authorRole})</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#241003] group-hover:text-orange-700 transition leading-snug mb-2">
                {topic.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#5A2C0D] leading-relaxed line-clamp-2 mb-4">
                {topic.content}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-orange-100 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => handleLike(topic.id, e)}
                    className="flex items-center gap-1.5 text-orange-800 hover:text-orange-600 font-bold transition"
                  >
                    <ThumbsUp className="w-4 h-4 text-orange-600" />
                    <span>{topic.likes} Thích</span>
                  </button>

                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    <span>{topic.comments.length} Bình luận</span>
                  </span>
                </div>

                <span className="text-orange-600 font-bold group-hover:underline">
                  Xem chi tiết &amp; Bình luận →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Topic Modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-serif">
          <div 
            className="w-full max-w-3xl bg-white border-2 border-orange-300 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col text-[#2B1705]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTopic(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 flex items-center justify-center transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-bold border ${activeTopic.badgeClass}`}>
                {activeTopic.categoryLabel}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{activeTopic.time}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#241003] leading-snug mb-2 pr-8">
              {activeTopic.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-orange-900 font-bold mb-4 pb-3 border-b border-orange-200">
              <User className="w-4 h-4 text-orange-600" />
              <span>{activeTopic.author}</span>
              <span className="text-slate-400">({activeTopic.authorRole})</span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="text-sm leading-relaxed text-[#2B1705] bg-orange-50/40 p-4 rounded-2xl border border-orange-100">
                {activeTopic.content}
              </div>

              {/* Likes counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(activeTopic.id, e)}
                  className="px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs flex items-center gap-2 transition"
                >
                  <ThumbsUp className="w-4 h-4 text-orange-600" />
                  <span>{activeTopic.likes} Lượt thích</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t border-orange-200">
                <h4 className="font-bold text-sm text-[#2A1305] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-orange-600" />
                  Bình Luận ({activeTopic.comments.length})
                </h4>

                <div className="space-y-3">
                  {activeTopic.comments.map((cm) => (
                    <div key={cm.id} className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-orange-900">{cm.author} <span className="text-slate-500 font-normal">({cm.role})</span></strong>
                        <span className="text-[10px] text-slate-400">{cm.time}</span>
                      </div>
                      <p className="text-[#3A1E07] leading-relaxed">{cm.text}</p>
                    </div>
                  ))}

                  {activeTopic.comments.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên đóng góp ý kiến!</p>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAddComment} className="pt-3 border-t border-orange-100 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      placeholder="Họ tên của bạn..."
                      required
                      className="w-1/3 px-3 py-2 rounded-xl border border-orange-200 text-xs bg-white focus:border-orange-500 outline-none"
                    />
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Ý kiến bình luận của bạn..."
                      required
                      className="flex-1 px-3 py-2 rounded-xl border border-orange-200 text-xs bg-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Topic Modal */}
      {isNewTopicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-serif">
          <div 
            className="w-full max-w-xl bg-white border-2 border-orange-300 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-[#2B1705]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNewTopicOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 flex items-center justify-center transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-[#241003] mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-orange-600" />
              Tạo Thảo Luận Mới
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#5A2C0D] mb-1">Tiêu Đề Thảo Luận</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Đề xuất giải pháp bảo vệ quyền lợi cổ đông khi tái cấu trúc..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 focus:border-orange-500 outline-none text-xs text-[#2A1305]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A2C0D] mb-1">Chủ Đề</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white outline-none"
                  >
                    <option value="gop-y-luat">Góp Ý Hoàn Thiện Luật</option>
                    <option value="dai-an">Đại Án &amp; Bồi Thường</option>
                    <option value="kinh-nghiem">Kinh Nghiệm NĐT</option>
                    <option value="hoc-thuat">Hỏi Đáp Đề Tài BTL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5A2C0D] mb-1">Họ Tên Của Bạn</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-orange-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A2C0D] mb-1">Nội Dung Thảo Luận Chi Tiết</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  placeholder="Trình bày quan điểm, câu hỏi hoặc kiến nghị pháp lý của bạn..."
                  required
                  className="w-full p-3 rounded-xl border border-orange-200 outline-none focus:border-orange-500 font-serif leading-relaxed text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md transition"
              >
                Đăng Bài Lên Diễn Đàn
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
