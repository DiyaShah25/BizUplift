
import { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const themeList = Object.values(THEMES);
    const current = THEMES[theme] || THEMES.default;

    return (
        <div className="theme-switcher" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {/* Panel */}
            <div
                className="theme-panel"
                style={{
                    position: 'absolute',
                    bottom: '68px',
                    right: '0',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    minWidth: '220px',
                    transformOrigin: 'bottom right',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: open ? 1 : 0,
                    transform: open ? 'scale(1)' : 'scale(0.8)',
                    pointerEvents: open ? 'auto' : 'none',
                }}
            >
                <p style={{ padding: '8px 14px 4px', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Festival Theme
                </p>
                {themeList.map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setOpen(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            border: 'none',
                            background: theme === t.id ? 'rgba(232,93,4,0.08)' : 'transparent',
                            width: '100%',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: theme === t.id ? 700 : 500,
                            color: theme === t.id ? 'rgb(var(--color-primary))' : '#374151',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { if (theme !== t.id) e.currentTarget.style.background = '#F9FAFB'; }}
                        onMouseLeave={e => { if (theme !== t.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                        {/* Color dot */}
                        <span
                            style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: t.dotColor,
                                flexShrink: 0,
                                boxShadow: theme === t.id ? `0 0 0 3px rgba(232,93,4,0.2)` : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                            }}
                        >
                            {t.emoji}
                        </span>
                        <span style={{ flex: 1 }}>
                            <span style={{ display: 'block' }}>{t.name}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: '#9CA3AF', fontWeight: 400 }}>{t.description}</span>
                        </span>
                        {theme === t.id && (
                            <span style={{ color: 'rgb(var(--color-primary))', fontSize: '16px' }}>✓</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Trigger Button */}
            <button
                onClick={() => setOpen(o => !o)}
                title="Change Festival Theme"
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--btn-gradient)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    transform: open ? 'scale(1.1) rotate(15deg)' : 'scale(1)',
                }}
                aria-label="Festival Theme Switcher"
            >
                {open ? '✕' : current.emoji}
            </button>
        </div>
    );
};

export default ThemeSwitcher;
