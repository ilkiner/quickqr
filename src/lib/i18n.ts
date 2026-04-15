export type Lang = 'en' | 'tr' | 'pl';

export interface Translations {
  nav: { generate: string; pricing: string; about: string; blog: string; contact: string; login: string; register: string; dashboard: string; logout: string };
  hero: { heading1: string; heading2: string; heading3: string; sub: string; cta: string };
  qrTypes: { title: string; sub: string; generateNow: string; types: { title: string; desc: string }[] };
  why: { title: string; sub: string; features: { title: string; desc: string }[] };
  how: { title: string; sub: string; steps: { title: string; desc: string }[] };
  cta: { heading: string; sub: string; button: string };
  footer: { desc: string; links: string; followUs: string; contact: string; privacy: string; terms: string; copyright: string };
}

export const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      generate: 'Generate',
      pricing: 'Pricing',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    hero: {
      heading1: 'Generate Smart',
      heading2: 'QR Codes',
      heading3: 'Instantly',
      sub: 'Create professional QR codes for your business in seconds. Fast, secure, and incredibly easy to use.',
      cta: 'Create QR Now',
    },
    qrTypes: {
      title: 'Choose Your QR Type',
      sub: 'Select from our range of specialized QR codes',
      generateNow: 'Generate Now',
      types: [
        { title: 'URL / Website Link', desc: 'Link any website or page' },
        { title: 'Restaurant Menu QR', desc: 'Link a digital menu' },
        { title: 'vCard / Contact QR', desc: 'Share contact details' },
        { title: 'Social Media QR', desc: 'Link social profiles' },
        { title: 'Google Maps QR', desc: 'Share location' },
        { title: 'Email QR', desc: 'Quick email compose' },
        { title: 'Wi-Fi QR', desc: 'Instant Wi-Fi login' },
      ],
    },
    why: {
      title: 'Why QuickQR?',
      sub: 'Discover the benefits of using QuickQR for your QR code needs.',
      features: [
        { title: 'Fast', desc: 'Generate QR codes in seconds with our user-friendly interface.' },
        { title: 'Secure', desc: 'Your data is encrypted and protected.' },
        { title: 'Easy to Use', desc: 'Simple interface, powerful features.' },
        { title: 'Mobile Friendly', desc: 'Works perfectly on all devices.' },
      ],
    },
    how: {
      title: 'How it Works',
      sub: 'Get started in three simple steps',
      steps: [
        { title: 'Create an Account', desc: 'Sign up in seconds to get started' },
        { title: 'Choose QR Type', desc: 'Select from 6 different QR types' },
        { title: 'Generate Instantly', desc: 'Get your QR code immediately' },
      ],
    },
    cta: {
      heading: 'Need something custom?',
      sub: 'Let us create a tailored QR solution for your business',
      button: 'Apply for Custom QR',
    },
    footer: {
      desc: 'Simple and fast QR code generator for websites, menus, and digital cards.',
      links: 'Links',
      followUs: 'Follow Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: 'All rights reserved.',
    },
  },

  tr: {
    nav: {
      generate: 'Oluştur',
      pricing: 'Fiyatlar',
      about: 'Hakkında',
      blog: 'Blog',
      contact: 'İletişim',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      dashboard: 'Panel',
      logout: 'Çıkış',
    },
    hero: {
      heading1: 'Akıllı',
      heading2: 'QR Kodları',
      heading3: 'Anında Oluşturun',
      sub: 'İşletmeniz için saniyeler içinde profesyonel QR kodları oluşturun. Hızlı, güvenli ve kullanımı inanılmaz derecede kolay.',
      cta: 'Hemen QR Oluştur',
    },
    qrTypes: {
      title: 'QR Türünüzü Seçin',
      sub: 'Özel QR kod türlerimizden birini seçin',
      generateNow: 'Hemen Oluştur',
      types: [
        { title: 'URL / Web Sitesi', desc: 'Herhangi bir web sitesini bağlayın' },
        { title: 'Restoran Menüsü QR', desc: 'Dijital menünüzü bağlayın' },
        { title: 'vCard / Kişi QR', desc: 'İletişim bilgilerini paylaşın' },
        { title: 'Sosyal Medya QR', desc: 'Sosyal profilleri bağlayın' },
        { title: 'Google Haritalar QR', desc: 'Konumu paylaşın' },
        { title: 'E-posta QR', desc: 'Hızlı e-posta oluşturun' },
        { title: 'Wi-Fi QR', desc: 'Anında Wi-Fi girişi' },
      ],
    },
    why: {
      title: 'Neden QuickQR?',
      sub: 'QR kod ihtiyaçlarınız için QuickQR\'ın avantajlarını keşfedin.',
      features: [
        { title: 'Hızlı', desc: 'Kullanıcı dostu arayüzümüzle saniyeler içinde QR kod oluşturun.' },
        { title: 'Güvenli', desc: 'Verileriniz şifrelenmiş ve korumalıdır.' },
        { title: 'Kullanımı Kolay', desc: 'Basit arayüz, güçlü özellikler.' },
        { title: 'Mobil Uyumlu', desc: 'Tüm cihazlarda mükemmel çalışır.' },
      ],
    },
    how: {
      title: 'Nasıl Çalışır',
      sub: 'Üç basit adımda başlayın',
      steps: [
        { title: 'Hesap Oluşturun', desc: 'Başlamak için saniyeler içinde kayıt olun' },
        { title: 'QR Türünü Seçin', desc: '6 farklı QR türünden birini seçin' },
        { title: 'Anında Oluşturun', desc: 'QR kodunuzu hemen alın' },
      ],
    },
    cta: {
      heading: 'Özel bir şey mi istiyorsunuz?',
      sub: 'İşletmeniz için özelleştirilmiş bir QR çözümü oluşturalım',
      button: 'Özel QR İçin Başvurun',
    },
    footer: {
      desc: 'Web siteleri, menüler ve dijital kartlar için basit ve hızlı QR kod oluşturucu.',
      links: 'Bağlantılar',
      followUs: 'Bizi Takip Edin',
      contact: 'İletişim',
      privacy: 'Gizlilik Politikası',
      terms: 'Hizmet Şartları',
      copyright: 'Tüm hakları saklıdır.',
    },
  },

  pl: {
    nav: {
      generate: 'Generuj',
      pricing: 'Cennik',
      about: 'O nas',
      blog: 'Blog',
      contact: 'Kontakt',
      login: 'Zaloguj',
      register: 'Zarejestruj',
      dashboard: 'Panel',
      logout: 'Wyloguj',
    },
    hero: {
      heading1: 'Generuj inteligentne',
      heading2: 'kody QR',
      heading3: 'błyskawicznie',
      sub: 'Twórz profesjonalne kody QR dla swojego biznesu w kilka sekund. Szybko, bezpiecznie i niezwykle łatwo.',
      cta: 'Utwórz kod QR',
    },
    qrTypes: {
      title: 'Wybierz typ kodu QR',
      sub: 'Wybierz spośród naszych specjalistycznych kodów QR',
      generateNow: 'Generuj teraz',
      types: [
        { title: 'URL / Link do strony', desc: 'Połącz dowolną stronę internetową' },
        { title: 'Menu restauracji QR', desc: 'Połącz cyfrowe menu' },
        { title: 'vCard / Wizytówka QR', desc: 'Udostępnij dane kontaktowe' },
        { title: 'QR mediów społecznościowych', desc: 'Połącz profile społecznościowe' },
        { title: 'QR Google Maps', desc: 'Udostępnij lokalizację' },
        { title: 'QR e-mail', desc: 'Szybkie tworzenie e-maila' },
        { title: 'QR Wi-Fi', desc: 'Natychmiastowe logowanie do Wi-Fi' },
      ],
    },
    why: {
      title: 'Dlaczego QuickQR?',
      sub: 'Odkryj korzyści z używania QuickQR do tworzenia kodów QR.',
      features: [
        { title: 'Szybki', desc: 'Generuj kody QR w kilka sekund dzięki intuicyjnemu interfejsowi.' },
        { title: 'Bezpieczny', desc: 'Twoje dane są szyfrowane i chronione.' },
        { title: 'Łatwy w użyciu', desc: 'Prosty interfejs, zaawansowane funkcje.' },
        { title: 'Przyjazny mobilnie', desc: 'Działa doskonale na wszystkich urządzeniach.' },
      ],
    },
    how: {
      title: 'Jak to działa',
      sub: 'Zacznij w trzech prostych krokach',
      steps: [
        { title: 'Utwórz konto', desc: 'Zarejestruj się w kilka sekund' },
        { title: 'Wybierz typ QR', desc: 'Wybierz spośród 6 typów kodów QR' },
        { title: 'Generuj natychmiast', desc: 'Otrzymaj kod QR od razu' },
      ],
    },
    cta: {
      heading: 'Potrzebujesz czegoś niestandardowego?',
      sub: 'Stworzymy dla Ciebie spersonalizowane rozwiązanie QR',
      button: 'Zamów niestandardowy QR',
    },
    footer: {
      desc: 'Prosty i szybki generator kodów QR dla stron internetowych, menu i kart cyfrowych.',
      links: 'Linki',
      followUs: 'Obserwuj nas',
      contact: 'Kontakt',
      privacy: 'Polityka prywatności',
      terms: 'Warunki usługi',
      copyright: 'Wszelkie prawa zastrzeżone.',
    },
  },
};
