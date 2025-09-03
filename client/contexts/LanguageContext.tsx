import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode =
  | "en" | "es" | "fr" | "de" | "it" | "pt" | "zh" | "ja" | "ko" | "hi" | "ar" | "ru";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("skytrack_language") as LanguageCode | null;
    return saved ?? "en";
  });

  useEffect(() => {
    localStorage.setItem("skytrack_language", language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => setLanguageState(lang);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
