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

// Pagination limits
export const PAGINATION = {
  HOME_JOBS_LIMIT: 9,
  JOBS_PER_PAGE: 20,
  BIDS_PER_PAGE: 10,
  NOTIFICATIONS_PER_PAGE: 20,
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

// Hizmet Kategorileri
export const SERVICE_CATEGORIES = [
  { id: "elektrik", name: "Elektrikçi", icon: "⚡" },
  { id: "tesisat", name: "Tesisatçı", icon: "🔧" },
  { id: "boyaci", name: "Boyacı", icon: "🎨" },
  { id: "marangoz", name: "Marangoz", icon: "🪚" },
  { id: "klima", name: "Klima Teknik Servisi", icon: "❄️" },
  { id: "asansor", name: "Asansör Teknik Servisi", icon: "🛗" },
  { id: "temizlik", name: "Temizlik", icon: "🧹" },
  { id: "nakliyat", name: "Nakliyat", icon: "🚚" },
  { id: "bahce", name: "Bahçe Bakımı", icon: "🌱" },
  { id: "cam", name: "Cam Balkon", icon: "🪟" },
  { id: "demir", name: "Demirci", icon: "⚒️" },
  { id: "dogalgaz", name: "Doğalgaz Teknik Servisi", icon: "🔥" },
  { id: "fayans", name: "Fayans Ustası", icon: "🧱" },
  { id: "mobilya", name: "Mobilya Montaj", icon: "🪑" },
  { id: "perde", name: "Perde Montaj", icon: "🪟" },
  { id: "beyaz-esya", name: "Beyaz Eşya Servisi", icon: "🔌" },
  { id: "bilgisayar", name: "Bilgisayar Teknik Servisi", icon: "💻" },
  { id: "uydu", name: "Uydu Sistemleri", icon: "📡" },
  { id: "anahtar", name: "Anahtarcı", icon: "🔑" },
  { id: "cam-filmi", name: "Cam Filmi", icon: "🎬" },
] as const;

// İl-İlçe verileri (örnek olarak bazı iller)
export const DISTRICTS: Record<string, string[]> = {
  "İstanbul": [
    "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
    "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece",
    "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa",
    "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik",
    "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli",
    "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"
  ],
  "Ankara": [
    "Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk",
    "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan",
    "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar",
    "Sincan", "Şereflikoçhisar", "Yenimahalle"
  ],
  "İzmir": [
    "Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca",
    "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun",
    "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere",
    "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"
  ],
  "Antalya": [
    "Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa",
    "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca",
    "Manavgat", "Muratpaşa", "Serik"
  ],
  "Bursa": [
    "Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles",
    "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi",
    "Yenişehir", "Yıldırım"
  ],
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
  "Adıyaman": ["Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Samsat", "Sincik", "Tut"],
};
