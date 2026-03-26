import type { ReactNode } from "react";

export type Locale = "en" | "fr";

type WeddingCopy = {
  coupleNames: string;
  heroKicker: string;
  heroDate: string;
  announcement: ReactNode;
  scheduleTitle: string;
  dateLabel: string;
  ceremonyTitle: string;
  ceremonyTime: string;
  ceremonyVenue: string;
  receptionTitle: string;
  receptionTime: string;
  receptionVenue: string;
  scheduleThemeTitle: string;
  scheduleThemeBody: string;
  openMap: string;
  heroPhotoAlts: string[];
  closingMessage: ReactNode;
  maxPeoplePerInvitation: string;
  nextToSchedule: string;
  nextToRsvp: string;
  backToWelcome: string;
  backToSchedule: string;
};

const weddingCopy: Record<Locale, WeddingCopy> = {
  en: {
    coupleNames: "Georges & Christella",
    heroKicker: "We are getting married",
    heroDate: "August 15, 2026",
    announcement: (
      <>
        With grateful hearts, the families of <strong>Samuel Simon Boum</strong> and{" "}
        <strong>Rosa Marie Ngo Um</strong>, together with <strong>Anastase Nzobonimpa</strong> and{" "}
        <strong>Joze Tuyisenge</strong>, request the honor of your presence at the wedding celebration of their
        children, <strong>Georges Anthony Boum</strong> and <strong>Christella Emerusenge</strong>, on the{" "}
        <br />
        <strong>15th of August, 2026</strong>.
      </>
    ),
    scheduleTitle: "WEDDING DAY SCHEDULE",
    dateLabel: "Saturday, August 15, 2026",
    ceremonyTitle: "Wedding Ceremony",
    ceremonyTime: "1:00 PM - 2:30 PM",
    ceremonyVenue: "Church La Visitation-de-la-Bienheureuse-Vierge-Marie",
    receptionTitle: "Reception",
    receptionTime: "Starting 5:00 PM",
    receptionVenue: "Centre des congrès et banquets Renaissance",
    scheduleThemeTitle: "Theme",
    scheduleThemeBody:
      "No theme is required for the celebration. We look forward to seeing you at your best.",
    openMap: "Open in Google Maps",
    heroPhotoAlts: [
      "Georges and Christella smiling together",
      "Georges and Christella portrait",
      "Georges and Christella candid moment",
    ],
    closingMessage: (
      <>
        We will be delighted to celebrate this moment with you. Please confirm your attendance below before{" "}
        <strong>July 1, 2026</strong>.
      </>
    ),
    maxPeoplePerInvitation:
      "Please note that there is a maximum number of people per invitation code and that children under the age of 16 are not allowed to attend the reception.",
    nextToSchedule: "View Schedule",
    nextToRsvp: "Continue to RSVP",
    backToWelcome: "Back to Welcome",
    backToSchedule: "Back to Schedule",
  },
  fr: {
    coupleNames: "Georges & Christella",
    // heroKicker: "Nous nous marions",
    heroKicker: "Tunafunga ndoa",
    heroDate: "15 août 2026",
    // announcement: (
    //   <>
    //     C&apos;est avec une immense joie que les familles de <strong>Samuel Simon Boum</strong> et{" "}
    //     <strong>Rosa Marie Ngo Um Epse Boum</strong>, ainsi qu&apos;<strong>Anastase Nzobonimpa</strong> et{" "}
    //     <strong>Joze Tuyisenge</strong>, ont l&apos;honneur de vous convier au mariage de leurs enfants,{" "}
    //     <strong>Georges Anthony Boum</strong> et <strong>Christella Emerusenge</strong>, qui sera célébré le <br />
    //     <strong>15 août 2026</strong>.
    //   </>
    // ),
    announcement: (
      <>
        Ni furaha tele kwamba familia za <strong>Samuel Simon Boum</strong> na <strong>Rosa Marie Ngo Um Epse Boum</strong>, 
        pamoja na <strong>Anastase Nzobonimpa</strong> na <strong>Joze Tuyisenge</strong>, zimepata heshima ya kukualika kwenye ndoa ya watoto wao, {" "}  
        <strong>Georges Anthony Boum</strong> na <strong>Christella Emerusenge</strong>, ambayo itaadhimishwa <br />
        <strong>Agosti 15, 2026</strong>.
      </>
    ),
    scheduleTitle: "PROGRAMME DE LA JOURNÉE",
    dateLabel: "Samedi 15 août 2026",
    ceremonyTitle: "Cérémonie de mariage",
    ceremonyTime: "13 h 00 - 14 h 30",
    ceremonyVenue: "Église La Visitation-de-la-Bienheureuse-Vierge-Marie",
    receptionTitle: "Réception",
    receptionTime: "À partir de 17 h 00",
    receptionVenue: "Centre des congrès et banquets Renaissance",
    scheduleThemeTitle: "Thème",
    scheduleThemeBody:
      "Aucun thème n'est imposé pour l'événement. Nous avons hâte de vous voir en beauté.",
    openMap: "Ouvrir dans Google Maps",
    heroPhotoAlts: [
      "Georges et Christella souriants ensemble",
      "Portrait de Georges et Christella",
      "Moment spontané de Georges et Christella",
    ],
    closingMessage: (
      <>
        Nous serons ravis de célébrer ce moment avec vous. Merci de confirmer votre présence ci-dessous avant le{" "}
        <strong>1er juillet 2026</strong>.
      </>
    ),
    maxPeoplePerInvitation:
      "Prenez note qu'un nombre maximum de personnes est prévu par code d'invitation et que les enfants de moins de 16 ans ne sont pas autorisés à participer à la réception.",
    nextToSchedule: "Voir le programme",
    nextToRsvp: "Continuer vers le RSVP",
    backToWelcome: "Retour à l'accueil",
    backToSchedule: "Retour au programme",
  },
};

export function getLocale(lang: string | null): Locale {
  return lang === "en" ? "en" : "fr";
}

export function getWeddingCopy(locale: Locale): WeddingCopy {
  return weddingCopy[locale];
}
