
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    default: {
        id: 'default',
        name: 'Default',
        emoji: '🛍️',
        label: 'BizUplift',
        dotColor: '#E85D04',
        description: 'Warm Saffron',
    },
    holi: {
        id: 'holi',
        name: 'Holi',
        emoji: '🎨',
        label: 'Holi — Festival of Colors',
        dotColor: 'linear-gradient(135deg, #FF006E, #FFD60A, #06D6A0)',
        description: 'Vibrant & Joyful',
    },
    diwali: {
        id: 'diwali',
        name: 'Diwali',
        emoji: '🪔',
        label: 'Diwali — Festival of Lights',
        dotColor: '#FFD700',
        description: 'Warm & Glowing',
    },
    navratri: {
        id: 'navratri',
        name: 'Navratri',
        emoji: '🌺',
        label: 'Navratri — Festival of Dance',
        dotColor: 'linear-gradient(135deg, #DC267F, #7C3AED)',
        description: 'Royal & Rhythmic',
    },
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('bizuplift-theme') || 'default';
    });

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('bizuplift-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, []);

    // Apply theme on mount
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
