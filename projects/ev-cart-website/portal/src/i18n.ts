import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import zh from './locales/zh/common.json'
import en from './locales/en/common.json'

const resources = {
  zh: { translation: zh },
  en: { translation: en },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'zh', // 默认语言
    debug: false,
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
    },
  })

export default i18n
