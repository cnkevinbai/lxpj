/**
 * 语言选择器组件
 */

import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">语言设置</h3>
      <p className="text-sm text-slate-400">选择您的首选语言</p>

      <div className="grid grid-cols-2 gap-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              relative p-4 rounded-xl border transition-all duration-200
              ${i18n.language === lang.code
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 hover:border-cyan-500/50'
              }
            `}
            style={{ background: i18n.language === lang.code ? undefined : '#0F172A' }}
          >
            {/* 选中指示器 */}
            {i18n.language === lang.code && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyan-400" />
            )}

            {/* 国旗 */}
            <div className="text-3xl mb-2">{lang.flag}</div>

            {/* 名称 */}
            <div className="text-white font-medium">{lang.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;