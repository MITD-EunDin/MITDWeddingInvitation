import type { ThemeConfig } from '../types/wedding';

/**
 * Ghi các màu trong theme (wedding.ts) thành CSS variables trên :root.
 * Tailwind (tailwind.config.js) đọc màu qua var(--color-*), nên đổi theme
 * chỉ cần sửa object `theme` trong wedding.ts — KHÔNG cần build lại Tailwind.
 */
export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  const { colors, fonts } = theme;

  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-background-alt', colors.backgroundAlt);
  root.style.setProperty('--color-foreground', colors.foreground);
  root.style.setProperty('--color-foreground-muted', colors.foregroundMuted);
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-contrast', colors.primaryContrast);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-border', colors.border);

  root.style.setProperty('--font-display', fonts.display);
  root.style.setProperty('--font-body', fonts.body);
}
