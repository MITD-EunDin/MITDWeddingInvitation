/**
 * Toàn bộ shape dữ liệu của một thiệp cưới.
 * Mọi component UI chỉ được đọc từ object `wedding` (src/data/wedding.ts),
 * KHÔNG được hard-code text/ảnh trực tiếp trong component.
 */

export interface PersonInfo {
  fullName: string;
  displayName: string; // tên hiển thị ngắn, vd "Minh Anh"
  description: string;
  photo: string; // đường dẫn ảnh, vd "/assets/images/groom.jpg"
  familyInfo?: {
    fatherName?: string;
    motherName?: string;
  };
}

export interface WeddingDateTime {
  /** ISO string, vd "2026-12-20T10:00:00+07:00" */
  isoDateTime: string;
  displayDate: string; // vd "Chủ Nhật, 20 Tháng 12, 2026"
  displayTime: string; // vd "10:00 Sáng"
}

export interface VenueInfo {
  name: string;
  address: string;
  image: string;
  googleMapsUrl: string;
  session: 'Lễ Vu Quy' | 'Lễ Thành Hôn' | string;
}

export interface StoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  thumbnail?: string;
  alt: string;
  width: number;
  height: number;
  /** Cho masonry: cho phép 1 vài ảnh chiếm 2 cột/2 hàng trên desktop */
  featured?: boolean;
}

export interface MediaConfig {
  heroBackgroundType: 'image' | 'video';
  heroImage: string;
  heroVideo?: string;
  heroVideoPoster?: string;
  music?: {
    src: string; // mp3/m4a
    title: string;
    autoStartOnOpen: boolean;
  };
}

export interface InvitationConfig {
  title: string; // "Trân Trọng Kính Mời"
  message: string;
  sessions: VenueInfo[]; // 1 hoặc nhiều lễ (Vu Quy, Thành Hôn...)
}

export interface RsvpConfig {
  enabled: boolean;
  apiEndpoint?: string; // để trống -> dùng mock service
  deadline?: string; // ISO date
}

export interface RsvpPayload {
  name: string;
  attendance: boolean;
  guests: number;
  message: string;
}

export interface WishItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface WishesConfig {
  enabled: boolean;
  apiEndpoint?: string;
  mockData: WishItem[];
}

export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImage?: string; // nếu có sẵn ảnh QR, ưu tiên dùng ảnh này
}

export interface GiftConfig {
  enabled: boolean;
  note?: string;
  groomAccount?: BankAccount;
  brideAccount?: BankAccount;
}

export interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    backgroundAlt: string;
    foreground: string;
    foregroundMuted: string;
    primary: string; // accent chính, vd champagne/gold
    primaryContrast: string;
    secondary: string;
    border: string;
  };
  fonts: {
    display: string; // font tiêu đề, script/serif
    body: string;
  };
}

export interface WeddingData {
  couple: {
    groom: PersonInfo;
    bride: PersonInfo;
  };
  wedding: {
    dateTime: WeddingDateTime;
    saveTheDateText: string;
    tagline: string; // vd "We're getting married"
  };
  venue: VenueInfo;
  story: StoryItem[];
  gallery: GalleryImage[];
  media: MediaConfig;
  invitation: InvitationConfig;
  rsvp: RsvpConfig;
  wishes: WishesConfig;
  gift: GiftConfig;
  theme: ThemeConfig;
  seo: {
    siteTitle: string;
    description: string;
    ogImage: string;
  };
}
