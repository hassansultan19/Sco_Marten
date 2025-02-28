// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      about: "About Us",
      models: "Models",
      profile: "Profile",
      logout: "Logout",
      signIn: "Sign in",
      registration: "Registration",
      bookAppointment: "Book an appointment",
    },
  },
  da: {
    translation: {
      home: "Hjem",
      about: "Om os",
      models: "Annoncer",
      profile: "Profil",
      logout: "Log ud",
      signIn: "Log ind",
      registration: "Tilmelding",
      bookAppointment: "Book en aftale",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
