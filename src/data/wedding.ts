import type { WeddingData } from '../types/wedding';

/**
 * ĐÂY LÀ FILE DUY NHẤT BẠN CẦN SỬA để tạo một thiệp cưới mới.
 * Thay text, đường dẫn ảnh/nhạc/video tại đây.
 * Ảnh/nhạc/video thật đặt trong: public/assets/images, public/assets/audio, public/assets/video
 * rồi trỏ đường dẫn dạng "/assets/images/ten-file.jpg".
 */
export const wedding: WeddingData = {
  couple: {
    groom: {
      fullName: 'Nguyễn Văn A',
      displayName: 'Văn A',
      description: 'Con trai của ông Nguyễn Văn B và bà Trần Thị C',
      photo: '/assets/images/groom.jpg',
      familyInfo: {
        fatherName: 'Nguyễn Văn B',
        motherName: 'Trần Thị C',
      },
    },
    bride: {
      fullName: 'Trần Thị D',
      displayName: 'Thị D',
      description: 'Con gái của ông Trần Văn E và bà Lê Thị F',
      photo: '/assets/images/bride.jpg',
      familyInfo: {
        fatherName: 'Trần Văn E',
        motherName: 'Lê Thị F',
      },
    },
  },

  wedding: {
    dateTime: {
      isoDateTime: '2026-12-20T10:00:00+07:00',
      displayDate: 'Chủ Nhật, 20 Tháng 12, 2026',
      displayTime: '10:00 Sáng',
    },
    saveTheDateText: 'Save The Date',
    tagline: "We're getting married",
  },

  venue: {
    name: 'Trung Tâm Hội Nghị Tiệc Cưới Riverside',
    address: '123 Đường Hoa, Quận 1, TP. Hồ Chí Minh',
    image: '/assets/images/venue.jpg',
    googleMapsUrl: 'https://maps.google.com/?q=Riverside+Palace+HCMC',
    session: 'Lễ Thành Hôn',
  },

  story: [
    {
      id: 'story-1',
      date: 'Tháng 3, 2020',
      title: 'Lần đầu gặp gỡ',
      description:
        'Chúng tôi gặp nhau lần đầu trong một buổi cà phê cuối tuần, và không ngờ đó lại là khởi đầu của một câu chuyện dài.',
      image: '/assets/images/story-1.jpg',
    },
    {
      id: 'story-2',
      date: 'Tháng 11, 2021',
      title: 'Ngày hẹn hò đầu tiên',
      description:
        'Buổi tối hôm ấy dưới ánh đèn thành phố, chúng tôi biết rằng mình đã tìm thấy một nửa còn lại.',
      image: '/assets/images/story-2.jpg',
    },
    {
      id: 'story-3',
      date: 'Tháng 6, 2025',
      title: 'Lời cầu hôn',
      description:
        'Một lời cầu hôn bất ngờ giữa hoàng hôn, và một cái gật đầu đầy hạnh phúc.',
      image: '/assets/images/story-3.jpg',
    },
  ],

  gallery: Array.from({ length: 8 }).map((_, i) => ({
    id: `gallery-${i + 1}`,
    src: `/assets/images/gallery-${i + 1}.jpg`,
    thumbnail: `/assets/images/gallery-${i + 1}.jpg`,
    alt: `Ảnh cưới ${i + 1}`,
    width: 1200,
    height: i % 3 === 0 ? 1500 : 900,
    featured: i === 0 || i === 5,
  })),

  media: {
    heroBackgroundType: 'image',
    heroImage: '/assets/images/hero.jpg',
    heroVideo: '/assets/video/hero.mp4',
    heroVideoPoster: '/assets/images/hero.jpg',
    music: {
      // Có thể để 1 file duy nhất (string) hoặc mảng nhiều định dạng cùng bài
      // để trình duyệt tự chọn/fallback, vd:
      // src: ['/assets/audio/wedding-song.m4a', '/assets/audio/wedding-song.mp3'],
      // QUAN TRỌNG: tên file dưới đây phải khớp CHÍNH XÁC (kể cả hoa/thường)
      // với file bạn đặt trong public/assets/audio/
      src: '/assets/audio/wedding-song.mp3',
      title: 'A Thousand Years',
      autoStartOnOpen: true,
    },
  },

  invitation: {
    title: 'Trân Trọng Kính Mời',
    message:
      'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi trong ngày trọng đại này.',
    sessions: [
      {
        name: 'Trung Tâm Hội Nghị Tiệc Cưới Riverside',
        address: '123 Đường Hoa, Quận 1, TP. Hồ Chí Minh',
        image: '/assets/images/venue.jpg',
        googleMapsUrl: 'https://maps.google.com/?q=Riverside+Palace+HCMC',
        session: 'Lễ Thành Hôn',
      },
    ],
  },

  rsvp: {
    enabled: true,
    apiEndpoint: undefined, // để trống => dùng mock service, xem src/services/rsvpService.ts
    deadline: '2026-12-10T23:59:59+07:00',
  },

  wishes: {
    enabled: true,
    apiEndpoint: undefined,
    mockData: [
      {
        id: 'wish-1',
        name: 'Bạn Bè Thân Thiết',
        message: 'Chúc hai bạn trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau!',
        createdAt: '2026-09-01T10:00:00+07:00',
      },
      {
        id: 'wish-2',
        name: 'Gia Đình',
        message: 'Chúc con cháu hạnh phúc bên nhau, sớm có tin vui!',
        createdAt: '2026-09-05T14:30:00+07:00',
      },
    ],
  },

  gift: {
    enabled: true,
    note: 'Sự hiện diện của bạn là món quà quý giá nhất. Nếu bạn muốn gửi lời chúc mừng bằng một món quà nhỏ, gia đình xin trân trọng đón nhận.',
    groomAccount: {
      bankName: 'Vietcombank',
      accountName: 'NGUYEN VAN A',
      accountNumber: '0123456789',
      qrImage: '/assets/images/qr-groom.png',
    },
    brideAccount: {
      bankName: 'Techcombank',
      accountName: 'TRAN THI D',
      accountNumber: '9876543210',
      qrImage: '/assets/images/qr-bride.png',
    },
  },

  theme: {
    name: 'Ivory & Champagne',
    colors: {
      background: '#FBF8F3',
      backgroundAlt: '#F3EDE2',
      foreground: '#3A2E27',
      foregroundMuted: '#7A6D63',
      primary: '#B99364', // champagne/gold
      primaryContrast: '#FFFFFF',
      secondary: '#C9A66B',
      border: '#E6DCC8',
    },
    fonts: {
      display: "'Cormorant Garamond', 'Playfair Display', serif",
      body: "'Jost', 'Inter', sans-serif",
    },
  },

  seo: {
    siteTitle: 'Văn A & Thị D | Wedding Invitation',
    description: 'Thiệp mời đám cưới Văn A & Thị D — 20.12.2026',
    ogImage: '/assets/images/hero.jpg',
  },
};
