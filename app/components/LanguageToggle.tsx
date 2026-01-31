"use client";

import { useLanguageContext } from "./LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale, copy } = useLanguageContext();
  const lang = copy.language;

  // TEMPORARILY DISABLED - Uncomment to re-enable language switching
  return null;

  /* 
  return (
    <div className="language-toggle" role="group" aria-label={lang.label}>
      <button
        type="button"
        className={locale === "en" ? "active" : undefined}
        onClick={() => setLocale("en")}
      >
        {lang.en}
      </button>
      <button
        type="button"
        className={locale === "vi" ? "active" : undefined}
        onClick={() => setLocale("vi")}
      >
        {lang.vi}
      </button>
    </div>
  );
  */
}

