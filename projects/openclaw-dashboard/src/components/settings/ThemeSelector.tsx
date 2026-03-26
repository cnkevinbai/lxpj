/**
 * 主题选择器组件
 * 
 * 支持深色、浅色、跟随系统三种模式
 */

import { useTheme } from '../../providers/ThemeProvider';

const themes = [
  { id: 'dark', name: '深色模式', icon: '🌙', description: '适合夜间使用' },
  { id: 'light', name: '浅色模式', icon: '☀️', description: '适合日间使用' },
  { id: 'system', name: '跟随系统', icon: '💻', description: '自动跟随系统设置' },
] as const;

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">主题设置</h3>
      <p className="text-sm text-slate-400">选择您喜欢的显示模式</p>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`
              relative p-4 rounded-xl border transition-all duration-200
              ${theme === t.id
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 hover:border-cyan-500/50'
              }
            `}
            style={{ background: theme === t.id ? undefined : '#0F172A' }}
          >
            {/* 选中指示器 */}
            {theme === t.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyan-400" />
            )}

            {/* 图标 */}
            <div className="text-3xl mb-2">{t.icon}</div>

            {/* 名称 */}
            <div className="text-white font-medium">{t.name}</div>

            {/* 描述 */}
            <div className="text-xs text-slate-400 mt-1">{t.description}</div>
          </button>
        ))}
      </div>

      {/* 当前生效的主题 */}
      {theme === 'system' && (
        <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
          <span>当前系统主题：</span>
          <span className="text-cyan-400">
            {resolvedTheme === 'dark' ? '深色模式 🌙' : '浅色模式 ☀️'}
          </span>
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;