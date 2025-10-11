'use client';
import { createContext, useState, useContext } from 'react';
import vi from '../locales/vi.json';
import en from '../locales/en.json';

type TextsType = typeof vi;
type LanguageContextType = {
    lang: 'vi' | 'en';
    setLang: React.Dispatch<React.SetStateAction<'vi' | 'en'>>;
    texts: TextsType;
};

const defaultValue: LanguageContextType = {
    lang: 'vi',
    setLang: () => {}, // placeholder
    texts: vi,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<'vi' | 'en'>('vi');

    const texts = lang === 'vi' ? vi : en;

    return (
        <LanguageContext.Provider value={{ lang, setLang, texts }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
