// Quản lý Chế Độ Ấn Bản (Theme Edition Manager)
// 'navy' = Ấn Bản Sổ Tay Hoàng Gia: Xanh Navy Bvlgari & Mạ Vàng Kim Sa (Mặc định mới)
// 'orange' = Ấn Bản Đất Nung Hổ Phách: Venetian Terracotta & Imperial Amber

export type ThemeEdition = 'navy' | 'orange';

const THEME_STORAGE_KEY = 'bao_ve_nha_dau_tu_theme_edition';

export const themeManager = {
  getTheme(): ThemeEdition {
    if (typeof window === 'undefined') return 'navy';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeEdition;
      if (saved === 'navy' || saved === 'orange') return saved;
    } catch {
      // ignore
    }
    return 'navy'; // Mặc định là Ấn bản Sổ Tay Navy & Vàng Kim theo yêu cầu
  },

  setTheme(theme: ThemeEdition): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
      window.dispatchEvent(new CustomEvent('theme-edition-changed', { detail: { theme } }));
    } catch (err) {
      console.error('Error saving theme:', err);
    }
  },

  toggleTheme(): ThemeEdition {
    const current = this.getTheme();
    const next = current === 'navy' ? 'orange' : 'navy';
    this.setTheme(next);
    return next;
  },

  init(): ThemeEdition {
    const theme = this.getTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    return theme;
  }
};
