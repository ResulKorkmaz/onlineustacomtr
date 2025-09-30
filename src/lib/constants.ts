/**
 * Application Constants
 */

export const APP_NAME = "OnlineUsta";
export const APP_DESCRIPTION = "İhtiyacınız olan ustayı bulun, güvenle çalışın";

// Türkiye şehirleri (alfabetik)
export const CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Şanlıurfa",
  "Siirt",
  "Sinop",
  "Şırnak",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
] as const;

// Limitler
export const LIMITS = {
  MAX_DAILY_BIDS_PER_PROVIDER: 3,
  MAX_DAILY_JOBS_PER_CUSTOMER: 1,
  MIN_DAYS_BETWEEN_JOBS: 7,
  JOB_TITLE_MIN: 10,
  JOB_TITLE_MAX: 100,
  JOB_DESCRIPTION_MIN: 50,
  JOB_DESCRIPTION_MAX: 2000,
  BID_MESSAGE_MIN: 20,
  BID_MESSAGE_MAX: 500,
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  GALLERY_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_GALLERY_IMAGES: 10,
} as const;

// Roller
export const USER_ROLES = {
  CUSTOMER: "customer",
  PROVIDER: "provider",
} as const;

export const PROVIDER_KINDS = {
  INDIVIDUAL: "individual",
  COMPANY: "company",
} as const;

// Job statuses
export const JOB_STATUSES = {
  OPEN: "open",
  CLOSED: "closed",
  AWARDED: "awarded",
  CANCELLED: "cancelled",
} as const;

export const JOB_STATUS_LABELS: Record<string, string> = {
  open: "Açık",
  closed: "Kapalı",
  awarded: "Verildi",
  cancelled: "İptal",
};

// Bid statuses
export const BID_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const;

export const BID_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
  withdrawn: "Geri Çekildi",
};

// Renk paleti
export const COLORS = {
  primary: "#0EA5E9", // Sky-500
  secondary: "#0EA66C", // Custom green
  accent: "#F59E0B", // Amber-500
  background: "#F8FAFC", // Slate-50
  text: "#0F172A", // Slate-900
} as const;

// Navigation links
export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/jobs", label: "İlanlar" },
  { href: "/how-it-works", label: "Nasıl Çalışır?" },
  { href: "/about", label: "Hakkımızda" },
] as const;

// Social links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/onlineusta",
  facebook: "https://facebook.com/onlineusta",
  instagram: "https://instagram.com/onlineusta",
  linkedin: "https://linkedin.com/company/onlineusta",
} as const;
