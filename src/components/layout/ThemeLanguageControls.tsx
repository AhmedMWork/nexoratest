import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useI18n } from '@/i18n/I18nProvider';

interface ThemeLanguageControlsProps {
  compact?: boolean;
}

export default function ThemeLanguageControls({ compact = false }: ThemeLanguageControlsProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? t('theme.light') : t('theme.dark')}
        title={isDark ? t('theme.light') : t('theme.dark')}
        className="h-9 min-w-9 px-2 border border-[#202024] bg-[#0b0b0d]/80 text-[#b8b0a3] hover:text-[#c8a96a] hover:border-[#c8a96a]/50 transition-colors flex items-center justify-center gap-2 backdrop-blur-xl"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {!compact && <span className="hidden xl:inline text-[10px] uppercase tracking-wider">{isDark ? 'Light' : 'Dark'}</span>}
      </button>
      <button
        type="button"
        onClick={toggleLang}
        aria-label={lang === 'en' ? t('language.arabic') : t('language.english')}
        title={lang === 'en' ? t('language.arabic') : t('language.english')}
        className="h-9 min-w-9 px-2 border border-[#202024] bg-[#0b0b0d]/80 text-[#b8b0a3] hover:text-[#c8a96a] hover:border-[#c8a96a]/50 transition-colors flex items-center justify-center gap-2 backdrop-blur-xl"
      >
        <Languages className="w-4 h-4" />
        <span className="text-[10px] font-black tracking-wider">{lang === 'en' ? 'AR' : 'EN'}</span>
      </button>
    </div>
  );
}
