/** @typedef {'vi' | 'en'} Lang */

/**
 * Single source of truth for initial / fallback site content.
 * Admin edits persist to data/site-content.json via the API.
 */
export const DEFAULT_SITE_CONTENT = {
  brandName: "Bliss Hotel",
  brandLogo: "",
  footer: "Bliss Hotel - Luxury Stay Experience",

  menu: {
    items: [
      { id: "home", type: "route", href: "/", labelVi: "Trang Chu", labelEn: "Home" },
      { id: "about", type: "route", href: "/about-us", labelVi: "Ve Chung Toi", labelEn: "About Us" },
      {
        id: "rooms",
        type: "dropdown",
        href: "/room-detail",
        labelVi: "Phong",
        labelEn: "Rooms",
        children: [
          { id: "r1", href: "/room-detail", labelVi: "Phong Double", labelEn: "Double Room" },
          { id: "r2", href: "/room-detail", labelVi: "Phong Twin", labelEn: "Twin Room" },
          { id: "r3", href: "/room-detail", labelVi: "Phong Executive", labelEn: "Executive Suite" },
          { id: "r4", href: "/room-detail", labelVi: "Phong Presidential", labelEn: "Presidential Suite" },
        ],
      },
      { id: "gallery", type: "hash", href: "/#hinh-anh", labelVi: "Hinh Anh", labelEn: "Gallery" },
      { id: "promotions", type: "hash", href: "/#promotions", labelVi: "Khuyen Mai", labelEn: "Promotions" },
      { id: "contact", type: "hash", href: "/#lien-he", labelVi: "Lien He", labelEn: "Contact" },
      {
        id: "booking",
        type: "hash",
        href: "/#lien-he",
        labelVi: "Dat Ngay",
        labelEn: "Booking Now",
        navClass: "menu-booking",
      },
    ],
  },

  hero: {
    slideIntervalMs: 6600,
    slides: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
        alt: "Bliss Hotel facade",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2000&q=80",
        alt: "Lobby",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=2000&q=80",
        alt: "Resort pool",
      },
    ],
    eyebrow: { vi: "Luxury Retreat Collection", en: "Luxury Retreat Collection" },
    titleLine1: { vi: "A New Signature", en: "A New Signature" },
    titleLine2: { vi: "Of Timeless Luxury", en: "Of Timeless Luxury" },
    subtitle: {
      vi: "Bliss Hotel mang den ky nghi 5 sao voi kien truc tinh te, khong gian nghi duong an yen va dich vu ca nhan hoa cho tung khoanh khac cua ban.",
      en: "Bliss Hotel offers a five-star stay with refined architecture, serene spaces, and personalized service for every moment.",
    },
    primaryCta: { vi: "Dat phong ngay", en: "Book now", href: "/#lien-he" },
    secondaryCta: { vi: "Kham pha hang phong", en: "Explore rooms", href: "/#phong" },
  },

  intro: {
    sectionTitle: { vi: "Gioi Thieu Ve Bliss Hotel", en: "About Bliss Hotel" },
    paragraphs: [
      {
        vi: "Bliss Hotel la khach san luxury contemporary noi ket hop kien truc hien dai, chat lieu thu cong va dich vu chu dao. Moi khong gian duoc thiet ke de mang lai cam giac tinh te va rieng tu.",
        en: "Bliss Hotel is a contemporary luxury hotel blending modern architecture, artisan materials, and attentive service. Every space is designed to feel refined and private.",
      },
      {
        vi: "Tu dich vu butler ca nhan hoa, am thuc fine dining den wellness tri lieu chuyen sau, chung toi xay dung mot hanh trinh nghi duong tron ven cho doanh nhan, cap doi va gia dinh.",
        en: "From personalized butler service and fine dining to in-depth wellness, we craft a complete stay for business guests, couples, and families.",
      },
    ],
    sliderImages: [
      {
        src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
        alt: "Reception",
      },
      {
        src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
        alt: "Suite",
      },
      {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        alt: "Resort",
      },
    ],
  },

  aboutPage: {
    heroTitle: "Hanh Trinh Cua Bliss Hotel",
    heroSubtitle: "Tinh te, thanh lich va truong ton theo thoi gian.",
    sectionTitle: { vi: "Cau Chuyen Thuong Hieu", en: "Our Brand Story" },
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80",
    paragraphs: [
      {
        vi: "Bliss Hotel duoc xay dung voi triet ly \"ca nhan hoa trong tung chi tiet\". Chung toi ket hop luxury hospitality va gu tham my duong dai de tao mot trai nghiem luu tru khac biet.",
        en: "Bliss Hotel is built on a philosophy of personalization in every detail, blending luxury hospitality with contemporary aesthetics for a distinctive stay.",
      },
      {
        vi: "Tu check-in den dich vu concierge, moi diem cham deu duoc tinh chinh de mang lai cam giac thoai mai, yen tinh va dang cap cho moi du khach.",
        en: "From check-in to concierge, every touchpoint is refined to deliver comfort, calm, and a sense of prestige.",
      },
    ],
    galleryImages: [
      {
        src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
        alt: "Suite",
      },
      {
        src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        alt: "Restaurant",
      },
    ],
  },

  rooms: {
    sectionTitle: { vi: "Danh Sach Phong", en: "Room Collection" },
    sectionSubtitle: {
      vi: "Khong gian duoc cham chu den tung chat lieu, mang tinh than thanh lich va rieng tu tuyet doi.",
      en: "Spaces crafted down to every detail—elegant, private, and refined.",
    },
    /** Danh sách tiện ích phòng tùy chỉnh (để tái sử dụng khi chọn phòng khác) */
    roomAmenityLibrary: [],
    /** Bản dịch EN cho tiện ích tùy chỉnh, key = nhãn VI, value = EN */
    roomAmenityTranslationMap: {},
    items: [
      {
        name: "Deluxe City View",
        desc: "38m2, giuong king-size, bon tam marble va ban cong rieng huong thanh pho.",
        price: {
          vi: "Tu 3.200.000 VND/dem",
          en: "From 3,200,000 VND/night",
        },
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Executive Suite",
        desc: "58m2, phong khach rieng, mini bar cao cap va dich vu butler theo yeu cau.",
        price: {
          vi: "Tu 5.800.000 VND/dem",
          en: "From 5,800,000 VND/night",
        },
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Presidential Suite",
        desc: "110m2, khong gian tiep khach va phong an rieng, tam nhin skyline toan canh.",
        price: {
          vi: "Tu 12.500.000 VND/dem",
          en: "From 12,500,000 VND/night",
        },
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Twin Room",
        desc: "36m2, 2 giuong don, khu lam viec rieng va tam nhin thanh pho thoang mo.",
        price: {
          vi: "Tu 3.600.000 VND/dem",
          en: "From 3,600,000 VND/night",
        },
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      },
    ],
  },

  amenities: {
    sectionTitle: { vi: "Tien Ich Noi Bat", en: "Signature Amenities" },
    sectionSubtitle: {
      vi: "He sinh thai dich vu danh cho nghi duong, cong tac va trai nghiem am thuc thuong hang.",
      en: "A full ecosystem for leisure, work, and elevated dining.",
    },
    items: [
      {
        title: {
          vi: "Signature Spa",
          en: "Signature Spa",
        },
        desc: {
          vi: "Lieu trinh tri lieu chuyen sau voi khong gian rieng tu va doi ngu therapist chuan quoc te.",
          en: "Deep-treatment spa with private suites and internationally trained therapists.",
        },
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80",
        alt: "Spa",
      },
      {
        title: {
          vi: "Infinity Pool",
          en: "Infinity Pool",
        },
        desc: {
          vi: "Ho boi tang thuong ket hop pool bar, tam nhin mo va khong gian thu gian ca ngay.",
          en: "Rooftop infinity pool with pool bar, open views, and all-day relaxation.",
        },
        image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80",
        alt: "Pool",
      },
      {
        title: {
          vi: "Fine Dining",
          en: "Fine Dining",
        },
        desc: {
          vi: "Am thuc au - a duoc phuc vu trong khong gian sang trong va bo suu tap ruou vang chon loc.",
          en: "European–Asian fine dining served in an elegant space with a curated wine collection.",
        },
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80",
        alt: "Dining",
      },
      {
        title: {
          vi: "Business Lounge",
          en: "Business Lounge",
        },
        desc: {
          vi: "Phong hop rieng, wifi toc do cao va khu tiep khach cao cap cho doanh nhan.",
          en: "Private meeting rooms, high-speed Wi‑Fi, and premium lounge space for business guests.",
        },
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
        alt: "Business lounge",
      },
    ],
  },

  gallery: {
    sectionTitle: { vi: "Hinh Anh Khach San", en: "Hotel Gallery" },
    sectionSubtitle: {
      vi: "Noi that va canh quan duoc tuy chinh theo phong cach luxury resort hien dai.",
      en: "Interiors and grounds styled in a modern luxury resort spirit.",
    },
    images: [
      { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80", alt: "Lobby" },
      { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80", alt: "Restaurant" },
      { src: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80", alt: "Pool" },
      { src: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=1000&q=80", alt: "Lounge" },
      { src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1000&q=80", alt: "Room" },
      { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80", alt: "Interior" },
      { src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1000&q=80", alt: "Suite" },
      { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80", alt: "Reception" },
    ],
  },

  promotions: {
    sectionTitle: { vi: "Promotions", en: "Promotions" },
    sectionSubtitle: {
      vi: "Nhung goi uu dai danh cho khach dat phong truc tiep tai Bliss Hotel.",
      en: "Exclusive offers for guests who book directly with Bliss Hotel.",
    },
    items: [
      {
        title: "Weekend Escape",
        desc: "Uu dai 20% cho ky nghi cuoi tuan kem buffet sang cho 2 khach.",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
        alt: "Weekend offer",
      },
      {
        title: "Spa Package",
        desc: "Tang voucher spa 60 phut khi dat phong suite tu 2 dem tro len.",
        image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1000&q=80",
        alt: "Spa",
      },
      {
        title: "Family Offer",
        desc: "Mien phi giuong phu va uu dai bua toi cho gia dinh co tre em.",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80",
        alt: "Family",
      },
    ],
  },

  contact: {
    sectionTitle: { vi: "Lien he & Dat phong", en: "Contact & Reservations" },
    sectionSubtitle: {
      vi: "Gui thong tin, doi ngu reservation se lien he lai de tu van phong phu hop trong thoi gian som nhat.",
      en: "Reach out—our reservations team will respond with tailored room options as soon as possible.",
    },
    infoTitle: { vi: "Thong tin lien he", en: "Contact details" },
    lines: [
      { label: { vi: "Dia chi:", en: "Address:" }, value: "88 Nguyen Hue, Quan 1, TP. Ho Chi Minh" },
      { label: { vi: "Hotline:", en: "Hotline:" }, value: "0909 888 999" },
      { label: { vi: "Email:", en: "Email:" }, value: "reservation@blisshotel.vn" },
      { label: { vi: "Le tan:", en: "Reception:" }, value: "24/7" },
    ],
    socialTitle: { vi: "Theo Doi Chung Toi", en: "Follow us" },
    socialDescription: {
      vi: "Cap nhat uu dai va hinh anh moi nhat cua Bliss Hotel qua cac kenh mang xa hoi.",
      en: "Get the latest offers and imagery from Bliss Hotel on social media.",
    },
    socialLinks: [
      {
        id: "facebook",
        platform: "facebook",
        label: "Facebook",
        href: "https://facebook.com",
        ariaVi: "Facebook Bliss Hotel",
        ariaEn: "Bliss Hotel on Facebook",
      },
      {
        id: "instagram",
        platform: "instagram",
        label: "Instagram",
        href: "https://instagram.com",
        ariaVi: "Instagram Bliss Hotel",
        ariaEn: "Bliss Hotel on Instagram",
      },
    ],
  },
};
