"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCopy } from "@/lib/content";
import type { Locale, SiteCopy } from "@/lib/content";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: SiteCopy;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("ncskit-lang") as Locale | null;
    if (stored === "en" || stored === "vi") {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ncskit-lang", locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      copy: getCopy(locale),
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return ctx;
}

export const useCopy = () => useLanguageContext().copy;

