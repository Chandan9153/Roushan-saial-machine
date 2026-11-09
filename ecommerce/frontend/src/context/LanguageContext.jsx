import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

// Hindi-first with an English toggle. Only short UI labels are translated;
// product names and descriptions come from the backend as stored.
export const STRINGS = {
  hi: { shop: 'दुकान', home: 'होम', about: 'हमारे बारे में', contact: 'संपर्क', login: 'लॉगिन', cart: 'कार्ट', search: 'खोजें…', callNow: 'अभी कॉल करें', whatsapp: 'WhatsApp करें' },
  en: { shop: 'Shop', home: 'Home', about: 'About Us', contact: 'Contact', login: 'Login', cart: 'Cart', search: 'Search…', callNow: 'Call Now', whatsapp: 'WhatsApp' },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('hi');
  const t = (key) => STRINGS[lang][key] || key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
