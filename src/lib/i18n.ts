export type Lang = 'en' | 'tr' | 'pl';

export interface Translations {
  nav: { generate: string; pricing: string; about: string; blog: string; contact: string; login: string; register: string; dashboard: string; logout: string };
  hero: { heading1: string; heading2: string; heading3: string; sub: string; cta: string };
  qrTypes: { title: string; sub: string; generateNow: string; types: { title: string; desc: string }[] };
  why: { title: string; sub: string; features: { title: string; desc: string }[] };
  how: { title: string; sub: string; steps: { title: string; desc: string }[] };
  cta: { heading: string; sub: string; button: string };
  footer: { desc: string; links: string; followUs: string; contact: string; privacy: string; terms: string; copyright: string };
  generate: {
    home: string; viewHistory: string; logout: string; register: string;
    types: { url: string; restaurant: string; vcard: string; social: string; location: string; email: string; wifi: string };
    createTitle: string; websiteUrl: string; menuUrl: string; businessName: string; optional: string; address: string;
    generatedLink: string; locationFrameHint: string; wifiFrameHint: string; socialHint: string;
    fullName: string; phone: string; email: string; website: string; to: string; subject: string; body: string;
    networkName: string; securityType: string; noPassword: string; password: string; showPassword: string; hidePassword: string;
    generating: string; generateQR: string;
    customizeTitle: string; qrColor: string; bgColor: string;
    previewTitle: string; loadingPreview: string; failedLoad: string;
    downloading: string; downloadPng: string; createAnother: string;
    savePrompt: string; createFreeAccount: string; historyTitle: string; noHistory: string;
    dynamicTitle: string; dynamicDesc: string; dynamicHint: string;
    limitProTitle: string; limitFreeTitle: string; limitProDesc: string; limitFreeDesc: string;
    businessPlanLabel: string; businessPlanFeature: string; proPlanLabel: string; proPlanFeature: string;
    upgradeToBusiness: string; upgradeToProBtn: string; maybeLater: string;
    frames: { noFrame: string; scanMe: string; seeMenu: string; rateUs: string; scanWifi: string; getDirections: string };
    errors: { urlRequired: string; invalidUrl: string; socialRequired: string; addressRequired: string; nameRequired: string; invalidEmail: string; invalidWebsite: string; recipientRequired: string; ssidRequired: string; downloadFailed: string; saveFailed: string };
  };
  about: {
    ourStory: string; heading: string; sub: string;
    stats: { qrGenerated: string; happyUsers: string; uptime: string; qrTypes: string };
    mission: { title: string; p1: string; p2: string };
    values: { speed: { title: string; text: string }; security: { title: string; text: string }; accessibility: { title: string; text: string }; innovation: { title: string; text: string } };
    whyBuilt: { title: string; p1: string; p2: string; btn: string };
    cta: { title: string; sub: string; createBtn: string; pricingBtn: string };
  };
  contact: {
    title: string; emailLabel: string; phoneLabel: string; responseTime: string; responseTimeText: string;
    successTitle: string; successMsg: string; sendAnother: string;
    name: string; namePlaceholder: string; emailPlaceholder: string; message: string; messagePlaceholder: string;
    sending: string; send: string;
    errors: { nameRequired: string; emailRequired: string; invalidEmail: string; messageRequired: string; messageTooShort: string };
  };
  pricing: {
    title: string; sub: string; mostPopular: string; perMonth: string; getStarted: string; upgradeNow: string;
    redirecting: string; canceledPayment: string; networkError: string; somethingWrong: string;
    plans: {
      free: { name: string; features: string[] };
      pro: { name: string; features: string[] };
      business: { name: string; features: string[] };
    };
  };
  faq: { title: string; items: { question: string; answer: string }[] };
  auth: {
    login: string; register: string; checkEmail: string; email: string; password: string;
    rememberMe: string; forgotPassword: string; signIn: string; pleaseWait: string;
    fullName: string; confirmPassword: string; strength: string; agreeTerms: string; createAccount: string;
    tooManyAttempts: string;
    errors: { emailRequired: string; invalidEmail: string; passwordRequired: string; passwordTooShort: string; passwordsNoMatch: string; termsRequired: string; nameRequired: string; somethingWrong: string };
  };
  dashboard: {
    welcomeBack: string; freePlan: string; proPlan: string; businessPlan: string; upgradeToPro: string;
    limitProMsg: string; limitFreeMsg: string;
    stats: { qrCreated: string; totalScans: string; thisMonth: string; planLimit: string };
    createNew: string;
    analytics: { title: string; desc: string; btn: string };
    customDesign: { title: string; desc: string; businessDiscount: string; proDiscount: string; btn: string };
    history: { title: string; type: string; titleCol: string; created: string; scans: string; actions: string; noQr: string; createFirst: string; dynamic: string; editUrl: string; save: string; cancel: string; download: string; delete: string };
    vcard: { title: string; desc: string; btn: string };
    successBanner: string; signInRequired: string; loadError: string;
  };
}

export const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      generate: 'Generate', pricing: 'Pricing', about: 'About', blog: 'Blog', contact: 'Contact',
      login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout',
    },
    hero: {
      heading1: 'Generate Smart', heading2: 'QR Codes', heading3: 'Instantly',
      sub: 'Create professional QR codes for your business in seconds. Fast, secure, and incredibly easy to use.',
      cta: 'Create QR Now',
    },
    qrTypes: {
      title: 'Choose Your QR Type', sub: 'Select from our range of specialized QR codes', generateNow: 'Generate Now',
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
      title: 'Why QuickQR?', sub: 'Discover the benefits of using QuickQR for your QR code needs.',
      features: [
        { title: 'Fast', desc: 'Generate QR codes in seconds with our user-friendly interface.' },
        { title: 'Secure', desc: 'Your data is encrypted and protected.' },
        { title: 'Easy to Use', desc: 'Simple interface, powerful features.' },
        { title: 'Mobile Friendly', desc: 'Works perfectly on all devices.' },
      ],
    },
    how: {
      title: 'How it Works', sub: 'Get started in three simple steps',
      steps: [
        { title: 'Create an Account', desc: 'Sign up in seconds to get started' },
        { title: 'Choose QR Type', desc: 'Select from 6 different QR types' },
        { title: 'Generate Instantly', desc: 'Get your QR code immediately' },
      ],
    },
    cta: { heading: 'Need something custom?', sub: 'Let us create a tailored QR solution for your business', button: 'Apply for Custom QR' },
    footer: {
      desc: 'Simple and fast QR code generator for websites, menus, and digital cards.',
      links: 'Links', followUs: 'Follow Us', contact: 'Contact',
      privacy: 'Privacy Policy', terms: 'Terms of Service', copyright: 'All rights reserved.',
    },
    generate: {
      home: 'Home', viewHistory: 'View History', logout: 'Logout', register: 'Register',
      types: { url: 'URL / Website Link', restaurant: 'Restaurant Menu', vcard: 'vCard / Contact', social: 'Social Media', location: 'Google Maps', email: 'Email', wifi: 'Wi-Fi' },
      createTitle: 'Create QR Code',
      websiteUrl: 'Website URL', menuUrl: 'Menu URL', businessName: 'Business Name', optional: '(optional)',
      address: 'Address', generatedLink: 'Generated link:',
      locationFrameHint: 'Frame "Get Directions" is pre-selected for you.',
      wifiFrameHint: 'Frame "Scan for Wi-Fi" is pre-selected for you.',
      socialHint: 'Fill in one or more platforms. Leave the rest empty.',
      fullName: 'Full name', phone: 'Phone', email: 'Email', website: 'Website',
      to: 'To', subject: 'Subject', body: 'Body',
      networkName: 'Network name (SSID)', securityType: 'Security Type', noPassword: 'Open (no password)',
      password: 'Password', showPassword: 'Show password', hidePassword: 'Hide password',
      generating: 'Generating...', generateQR: 'Generate QR Code',
      customizeTitle: 'Customize Colors', qrColor: 'QR Color', bgColor: 'Background Color',
      previewTitle: 'Your QR Code', loadingPreview: 'Loading preview…', failedLoad: 'Failed to load QR. Check your connection.',
      downloading: 'Downloading…', downloadPng: 'Download PNG', createAnother: 'Create Another',
      savePrompt: 'Sign up to save your QR codes and view scan analytics',
      createFreeAccount: 'Create Free Account', historyTitle: 'QR Code History', noHistory: 'No history data yet.',
      dynamicTitle: 'Dynamic QR', dynamicDesc: 'Change the destination URL anytime without reprinting the QR code.',
      dynamicHint: 'Your QR will point to a redirect URL. You can update the destination from your Dashboard anytime.',
      limitProTitle: "You've reached your Pro limit", limitFreeTitle: "You've reached your free limit",
      limitProDesc: "You've used all 100 QR codes for this month. Upgrade to Business for unlimited QR codes.",
      limitFreeDesc: 'Upgrade to Pro for 100 QR codes/month and advanced analytics.',
      businessPlanLabel: 'Business Plan:', businessPlanFeature: 'Unlimited QR codes per month',
      proPlanLabel: 'Pro Plan:', proPlanFeature: '100 QR codes per month',
      upgradeToBusiness: 'Upgrade to Business', upgradeToProBtn: 'Upgrade to Pro', maybeLater: 'Maybe later',
      frames: { noFrame: 'No Frame', scanMe: 'Scan Me', seeMenu: 'See Menu', rateUs: 'Rate Us', scanWifi: 'Scan for Wi-Fi', getDirections: 'Get Directions' },
      errors: {
        urlRequired: 'URL is required', invalidUrl: 'Enter a valid URL starting with http:// or https://',
        socialRequired: 'Add at least one social media link', addressRequired: 'Address is required',
        nameRequired: 'Name is required', invalidEmail: 'Enter a valid email',
        invalidWebsite: 'Website must start with http:// or https://',
        recipientRequired: 'Recipient email is required', ssidRequired: 'Network name (SSID) is required',
        downloadFailed: 'Download failed. Please try again.',
        saveFailed: 'QR created, but saving failed. Please try again.',
      },
    },
    about: {
      ourStory: 'Our Story',
      heading: 'Making QR Codes Simple for Every Business',
      sub: 'QuickQR helps you turn links, contacts, and Wi-Fi details into scannable codes your customers can trust — without friction or clutter.',
      stats: { qrGenerated: 'QR Codes Generated', happyUsers: 'Happy Users', uptime: 'Uptime', qrTypes: 'QR Types' },
      mission: {
        title: 'Our Mission',
        p1: 'We believe QR codes should be effortless to create and delightful to scan. Our mission is to give every business — from cafés to enterprises — the tools to share information instantly and securely.',
        p2: 'We obsess over clarity, speed, and accessibility so your customers get a seamless experience on every device.',
      },
      values: {
        speed: { title: 'Speed', text: 'Generate codes in seconds with a focused, minimal workflow.' },
        security: { title: 'Security', text: 'We treat your data with care and keep the surface area small.' },
        accessibility: { title: 'Accessibility', text: 'Readable layouts and clear labels for every visitor.' },
        innovation: { title: 'Innovation', text: 'We ship useful QR types that match how businesses work today.' },
      },
      whyBuilt: {
        title: 'Why We Built This',
        p1: 'Too many QR tools feel cluttered or outdated. We built QuickQR to be fast, modern, and honest — so you can focus on your business, not on fighting the software.',
        p2: 'Whether you are sharing a menu, a location, or a contact card, QuickQR keeps the experience consistent and professional.',
        btn: 'Try It Free',
      },
      cta: {
        title: 'Ready to create your first QR code?',
        sub: 'Jump into the generator or explore plans when you need more power for your team.',
        createBtn: 'Create QR Free', pricingBtn: 'See Pricing',
      },
    },
    contact: {
      title: 'Get in Touch', emailLabel: 'Email', phoneLabel: 'Phone',
      responseTime: 'Response Time', responseTimeText: 'Usually within 24 hours',
      successTitle: 'Message Sent!', successMsg: "we'll get back to you soon.", sendAnother: 'Send another message',
      name: 'Name', namePlaceholder: 'Your full name', emailPlaceholder: 'you@example.com',
      message: 'Message', messagePlaceholder: 'Write your message here...',
      sending: 'Sending...', send: 'Send Message',
      errors: { nameRequired: 'Name is required', emailRequired: 'Email is required', invalidEmail: 'Enter a valid email address', messageRequired: 'Message is required', messageTooShort: 'Message must be at least 10 characters' },
    },
    pricing: {
      title: 'Simple, Transparent Pricing', sub: 'Choose a plan that works best for your business needs. No hidden fees.',
      mostPopular: 'Most Popular', perMonth: '/mo', getStarted: 'Get Started', upgradeNow: 'Upgrade Now',
      redirecting: 'Redirecting…', canceledPayment: 'Payment canceled. No charges were made.',
      networkError: 'Network error. Please try again.', somethingWrong: 'Something went wrong. Please try again.',
      plans: {
        free: { name: 'Free', features: ['5 QR codes / month', 'Basic QR types', 'Email support', 'History for 7 days'] },
        pro: { name: 'Pro', features: ['100 QR codes / month', 'All QR types unlocked', 'High resolution export', 'Branding options', 'Analytics (30 days)'] },
        business: { name: 'Business', features: ['Unlimited QR codes', 'Team collaboration', 'API access', 'Advanced analytics', 'Priority support'] },
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { question: 'Do I need to register to use QuickQR?', answer: 'Yes. You need to create a free account to generate and manage your QR codes securely.' },
        { question: 'Is the Free plan really free?', answer: 'Absolutely. You can generate up to 5 QR codes per month with no cost, no credit card required.' },
        { question: 'Can I upgrade or downgrade my plan anytime?', answer: 'Yes, you can change your subscription plan at any time from your account settings.' },
        { question: 'What types of QR codes can I generate?', answer: 'You can create menu, social, vCard, email, location, Wi-Fi, and many more QR types — depending on your plan.' },
        { question: 'Is there an API for developers?', answer: 'Yes! Our Business plan includes secure API access for QR code generation and management.' },
      ],
    },
    auth: {
      login: 'Login', register: 'Register', checkEmail: 'Check your email to confirm your account.',
      email: 'Email', password: 'Password', rememberMe: 'Remember me', forgotPassword: 'Forgot password?',
      signIn: 'Sign in', pleaseWait: 'Please wait', fullName: 'Full Name', confirmPassword: 'Confirm Password',
      strength: 'Strength:', agreeTerms: 'I agree to Terms & Privacy Policy', createAccount: 'Create account',
      tooManyAttempts: 'Too many attempts, wait {sec}s',
      errors: {
        emailRequired: 'Email is required', invalidEmail: 'Enter a valid email',
        passwordRequired: 'Password is required', passwordTooShort: 'Password must be at least 8 characters',
        passwordsNoMatch: 'Passwords do not match', termsRequired: 'You must agree to the Terms & Privacy Policy',
        nameRequired: 'Enter your full name (min 2 characters)', somethingWrong: 'Something went wrong. Please try again.',
      },
    },
    dashboard: {
      welcomeBack: 'Welcome back, {name}!', freePlan: 'Free Plan', proPlan: 'Pro Plan', businessPlan: 'Business Plan',
      upgradeToPro: 'Upgrade to Pro',
      limitProMsg: "You've used all 100 QR codes for this month. Upgrade to Business for unlimited QR codes.",
      limitFreeMsg: "You've reached your free limit. Upgrade to Pro for 100 QR codes/month.",
      stats: { qrCreated: 'QR Codes Created', totalScans: 'Total Scans', thisMonth: 'This Month', planLimit: 'Plan Limit' },
      createNew: 'Create New QR',
      analytics: { title: 'Analytics', desc: 'QR scan data — device, time and browser breakdown.', btn: 'View Analytics' },
      customDesign: { title: 'Custom QR Design', desc: 'Get a professionally designed QR code tailored to your brand.', businessDiscount: '30% off for Business members', proDiscount: '20% off for Pro members', btn: 'Request Custom Design' },
      history: { title: 'QR History', type: 'Type', titleCol: 'Title', created: 'Created', scans: 'Scans', actions: 'Actions', noQr: 'No QR codes yet', createFirst: 'Create your first QR', dynamic: 'Dynamic', editUrl: 'Edit URL', save: 'Save', cancel: 'Cancel', download: 'Download', delete: 'Delete' },
      vcard: { title: 'My vCard Profile', desc: 'Create a shareable digital business card with a scannable QR code.', btn: 'Edit vCard Profile' },
      successBanner: 'Payment successful! Your plan has been upgraded. It may take a few seconds to reflect below.',
      signInRequired: 'Please sign in to view your dashboard.',
      loadError: 'Could not load dashboard data. Please try again.',
    },
  },

  tr: {
    nav: {
      generate: 'Oluştur', pricing: 'Fiyatlar', about: 'Hakkında', blog: 'Blog', contact: 'İletişim',
      login: 'Giriş Yap', register: 'Kayıt Ol', dashboard: 'Panel', logout: 'Çıkış',
    },
    hero: {
      heading1: 'Akıllı', heading2: 'QR Kodları', heading3: 'Anında Oluşturun',
      sub: 'İşletmeniz için saniyeler içinde profesyonel QR kodları oluşturun. Hızlı, güvenli ve kullanımı inanılmaz derecede kolay.',
      cta: 'Hemen QR Oluştur',
    },
    qrTypes: {
      title: 'QR Türünüzü Seçin', sub: 'Özel QR kod türlerimizden birini seçin', generateNow: 'Hemen Oluştur',
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
      title: 'Neden QuickQR?', sub: "QR kod ihtiyaçlarınız için QuickQR'ın avantajlarını keşfedin.",
      features: [
        { title: 'Hızlı', desc: 'Kullanıcı dostu arayüzümüzle saniyeler içinde QR kod oluşturun.' },
        { title: 'Güvenli', desc: 'Verileriniz şifrelenmiş ve korumalıdır.' },
        { title: 'Kullanımı Kolay', desc: 'Basit arayüz, güçlü özellikler.' },
        { title: 'Mobil Uyumlu', desc: 'Tüm cihazlarda mükemmel çalışır.' },
      ],
    },
    how: {
      title: 'Nasıl Çalışır', sub: 'Üç basit adımda başlayın',
      steps: [
        { title: 'Hesap Oluşturun', desc: 'Başlamak için saniyeler içinde kayıt olun' },
        { title: 'QR Türünü Seçin', desc: '6 farklı QR türünden birini seçin' },
        { title: 'Anında Oluşturun', desc: 'QR kodunuzu hemen alın' },
      ],
    },
    cta: { heading: 'Özel bir şey mi istiyorsunuz?', sub: 'İşletmeniz için özelleştirilmiş bir QR çözümü oluşturalım', button: 'Özel QR İçin Başvurun' },
    footer: {
      desc: 'Web siteleri, menüler ve dijital kartlar için basit ve hızlı QR kod oluşturucu.',
      links: 'Bağlantılar', followUs: 'Bizi Takip Edin', contact: 'İletişim',
      privacy: 'Gizlilik Politikası', terms: 'Hizmet Şartları', copyright: 'Tüm hakları saklıdır.',
    },
    generate: {
      home: 'Ana Sayfa', viewHistory: 'Geçmişi Gör', logout: 'Çıkış', register: 'Kayıt Ol',
      types: { url: 'URL / Web Sitesi', restaurant: 'Restoran Menüsü', vcard: 'vCard / Kişi', social: 'Sosyal Medya', location: 'Google Haritalar', email: 'E-posta', wifi: 'Wi-Fi' },
      createTitle: 'QR Kodu Oluştur',
      websiteUrl: 'Web Sitesi URL', menuUrl: 'Menü URL', businessName: 'İşletme Adı', optional: '(opsiyonel)',
      address: 'Adres', generatedLink: 'Oluşturulan bağlantı:',
      locationFrameHint: '"Yol Tarifi Al" çerçevesi önceden seçildi.',
      wifiFrameHint: '"Wi-Fi için Tara" çerçevesi önceden seçildi.',
      socialHint: 'Bir veya daha fazla platform doldurun. Kalanları boş bırakın.',
      fullName: 'Ad Soyad', phone: 'Telefon', email: 'E-posta', website: 'Web Sitesi',
      to: 'Alıcı', subject: 'Konu', body: 'Mesaj',
      networkName: 'Ağ adı (SSID)', securityType: 'Güvenlik Türü', noPassword: 'Açık (şifresiz)',
      password: 'Şifre', showPassword: 'Şifreyi göster', hidePassword: 'Şifreyi gizle',
      generating: 'Oluşturuluyor...', generateQR: 'QR Kodu Oluştur',
      customizeTitle: 'Renkleri Özelleştir', qrColor: 'QR Rengi', bgColor: 'Arkaplan Rengi',
      previewTitle: 'QR Kodunuz', loadingPreview: 'Önizleme yükleniyor…', failedLoad: 'QR yüklenemedi. Bağlantınızı kontrol edin.',
      downloading: 'İndiriliyor…', downloadPng: 'PNG İndir', createAnother: 'Yeni Oluştur',
      savePrompt: 'QR kodlarınızı kaydetmek ve tarama analitiği görmek için kayıt olun',
      createFreeAccount: 'Ücretsiz Hesap Oluştur', historyTitle: 'QR Kod Geçmişi', noHistory: 'Henüz geçmiş verisi yok.',
      dynamicTitle: 'Dinamik QR', dynamicDesc: 'QR kodunu yeniden basmadan hedef URL\'yi istediğiniz zaman değiştirin.',
      dynamicHint: 'QR\'ınız bir yönlendirme URL\'sine bağlanacak. Hedefi Panonuzdan istediğiniz zaman güncelleyebilirsiniz.',
      limitProTitle: 'Pro limitinize ulaştınız', limitFreeTitle: 'Ücretsiz limitinize ulaştınız',
      limitProDesc: 'Bu ay için 100 QR kodunuzu kullandınız. Sınırsız QR kodu için Business\'a yükseltin.',
      limitFreeDesc: 'Aylık 100 QR ve gelişmiş analitik için Pro\'ya yükseltin.',
      businessPlanLabel: 'Business Planı:', businessPlanFeature: 'Aylık sınırsız QR kodu',
      proPlanLabel: 'Pro Planı:', proPlanFeature: 'Aylık 100 QR kodu',
      upgradeToBusiness: "Business'a Yükselt", upgradeToProBtn: "Pro'ya Yükselt", maybeLater: 'Belki daha sonra',
      frames: { noFrame: 'Çerçeve Yok', scanMe: 'Beni Tara', seeMenu: 'Menüye Bak', rateUs: 'Bize Puan Ver', scanWifi: 'Wi-Fi için Tara', getDirections: 'Bize Yol Tarifi Al' },
      errors: {
        urlRequired: 'URL gereklidir', invalidUrl: 'http:// veya https:// ile başlayan geçerli bir URL girin',
        socialRequired: 'En az bir sosyal medya bağlantısı ekleyin', addressRequired: 'Adres gereklidir',
        nameRequired: 'Ad gereklidir', invalidEmail: 'Geçerli bir e-posta girin',
        invalidWebsite: 'Web sitesi http:// veya https:// ile başlamalıdır',
        recipientRequired: 'Alıcı e-postası gereklidir', ssidRequired: 'Ağ adı (SSID) gereklidir',
        downloadFailed: 'İndirme başarısız. Lütfen tekrar deneyin.',
        saveFailed: 'QR oluşturuldu, ancak kaydetme başarısız oldu. Lütfen tekrar deneyin.',
      },
    },
    about: {
      ourStory: 'Hikayemiz',
      heading: 'Her İşletme İçin QR Kodları Kolaylaştırıyoruz',
      sub: "QuickQR, bağlantıları, kişileri ve Wi-Fi bilgilerini müşterilerinizin güvenebileceği taranabilir kodlara dönüştürmenize yardımcı olur — karmaşıklık olmadan.",
      stats: { qrGenerated: 'Oluşturulan QR Kodu', happyUsers: 'Mutlu Kullanıcı', uptime: 'Çalışma Süresi', qrTypes: 'QR Türü' },
      mission: {
        title: 'Misyonumuz',
        p1: 'QR kodlarının oluşturulmasının kolay ve taranmasının keyifli olması gerektiğine inanıyoruz. Misyonumuz, her işletmeye — kafelerden büyük şirketlere kadar — bilgiyi anında ve güvenli bir şekilde paylaşma araçlarını sunmaktır.',
        p2: 'Müşterilerinizin her cihazda kusursuz bir deneyim yaşaması için netlik, hız ve erişilebilirliğe odaklanıyoruz.',
      },
      values: {
        speed: { title: 'Hız', text: 'Odaklanmış, minimal bir iş akışıyla saniyeler içinde kodlar oluşturun.' },
        security: { title: 'Güvenlik', text: 'Verilerinize özenle yaklaşıyoruz ve riski minimumda tutuyoruz.' },
        accessibility: { title: 'Erişilebilirlik', text: 'Her ziyaretçi için okunabilir düzenler ve net etiketler.' },
        innovation: { title: 'Yenilik', text: "İşletmelerin bugün nasıl çalıştığına uygun faydalı QR türleri sunuyoruz." },
      },
      whyBuilt: {
        title: 'Neden Yaptık',
        p1: "Pek çok QR aracı karmaşık veya eski hissettiriyor. QuickQR'ı hızlı, modern ve dürüst olmak için yaptık — yazılımla uğraşmak yerine işinize odaklanabilesiniz diye.",
        p2: 'İster bir menü, ister bir konum, ister bir kartvizit paylaşıyor olun, QuickQR deneyimi tutarlı ve profesyonel tutar.',
        btn: 'Ücretsiz Deneyin',
      },
      cta: {
        title: 'İlk QR kodunuzu oluşturmaya hazır mısınız?',
        sub: 'Oluşturucuya girin veya ekibiniz için daha fazla güce ihtiyaç duyduğunuzda planları keşfedin.',
        createBtn: 'Ücretsiz QR Oluştur', pricingBtn: 'Fiyatları Gör',
      },
    },
    contact: {
      title: 'İletişime Geçin', emailLabel: 'E-posta', phoneLabel: 'Telefon',
      responseTime: 'Yanıt Süresi', responseTimeText: 'Genellikle 24 saat içinde',
      successTitle: 'Mesaj Gönderildi!', successMsg: 'en kısa sürede geri döneceğiz.', sendAnother: 'Başka mesaj gönder',
      name: 'Ad', namePlaceholder: 'Adınız soyadınız', emailPlaceholder: 'siz@ornek.com',
      message: 'Mesaj', messagePlaceholder: 'Mesajınızı buraya yazın...',
      sending: 'Gönderiliyor...', send: 'Mesaj Gönder',
      errors: { nameRequired: 'Ad gereklidir', emailRequired: 'E-posta gereklidir', invalidEmail: 'Geçerli bir e-posta adresi girin', messageRequired: 'Mesaj gereklidir', messageTooShort: 'Mesaj en az 10 karakter olmalıdır' },
    },
    pricing: {
      title: 'Basit, Şeffaf Fiyatlandırma', sub: 'İşletme ihtiyaçlarınıza en uygun planı seçin. Gizli ücret yok.',
      mostPopular: 'En Popüler', perMonth: '/ay', getStarted: 'Başla', upgradeNow: 'Şimdi Yükselt',
      redirecting: 'Yönlendiriliyor…', canceledPayment: 'Ödeme iptal edildi. Herhangi bir ücret alınmadı.',
      networkError: 'Ağ hatası. Lütfen tekrar deneyin.', somethingWrong: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
      plans: {
        free: { name: 'Ücretsiz', features: ['5 QR kodu / ay', 'Temel QR türleri', 'E-posta desteği', '7 günlük geçmiş'] },
        pro: { name: 'Pro', features: ['100 QR kodu / ay', 'Tüm QR türleri açık', 'Yüksek çözünürlüklü dışa aktarma', 'Marka seçenekleri', 'Analitik (30 gün)'] },
        business: { name: 'Business', features: ['Sınırsız QR kodu', 'Ekip işbirliği', 'API erişimi', 'Gelişmiş analitik', 'Öncelikli destek'] },
      },
    },
    faq: {
      title: 'Sık Sorulan Sorular',
      items: [
        { question: "QuickQR'ı kullanmak için kayıt olmam gerekiyor mu?", answer: 'Evet. QR kodlarınızı güvenli şekilde oluşturmak ve yönetmek için ücretsiz bir hesap oluşturmanız gerekiyor.' },
        { question: 'Ücretsiz plan gerçekten ücretsiz mi?', answer: 'Kesinlikle. Ayda 5 adede kadar QR kodu ücretsiz, kredi kartı gerekmeksizin oluşturabilirsiniz.' },
        { question: 'Planımı istediğim zaman yükseltebilir veya düşürebilir miyim?', answer: 'Evet, hesap ayarlarınızdan abonelik planınızı istediğiniz zaman değiştirebilirsiniz.' },
        { question: 'Hangi tür QR kodları oluşturabilirim?', answer: 'Planınıza bağlı olarak menü, sosyal, vCard, e-posta, konum, Wi-Fi ve çok daha fazla QR türü oluşturabilirsiniz.' },
        { question: 'Geliştiriciler için bir API var mı?', answer: 'Evet! Business planımız, QR kod oluşturma ve yönetimi için güvenli API erişimini içeriyor.' },
      ],
    },
    auth: {
      login: 'Giriş Yap', register: 'Kayıt Ol', checkEmail: 'Hesabınızı onaylamak için e-postanızı kontrol edin.',
      email: 'E-posta', password: 'Şifre', rememberMe: 'Beni hatırla', forgotPassword: 'Şifremi unuttum?',
      signIn: 'Giriş Yap', pleaseWait: 'Lütfen bekleyin', fullName: 'Ad Soyad', confirmPassword: 'Şifreyi Onayla',
      strength: 'Güç:', agreeTerms: 'Şartlar ve Gizlilik Politikasını kabul ediyorum', createAccount: 'Hesap oluştur',
      tooManyAttempts: 'Çok fazla deneme, {sec}s bekleyin',
      errors: {
        emailRequired: 'E-posta gereklidir', invalidEmail: 'Geçerli bir e-posta girin',
        passwordRequired: 'Şifre gereklidir', passwordTooShort: 'Şifre en az 8 karakter olmalıdır',
        passwordsNoMatch: 'Şifreler eşleşmiyor', termsRequired: 'Şartlar ve Gizlilik Politikasını kabul etmelisiniz',
        nameRequired: 'Adınızı ve soyadınızı girin (en az 2 karakter)', somethingWrong: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
      },
    },
    dashboard: {
      welcomeBack: 'Tekrar hoş geldiniz, {name}!', freePlan: 'Ücretsiz Plan', proPlan: 'Pro Plan', businessPlan: 'Business Plan',
      upgradeToPro: "Pro'ya Yükselt",
      limitProMsg: 'Bu ay için 100 QR kodunuzu kullandınız. Sınırsız QR kodu için Business\'a yükseltin.',
      limitFreeMsg: "Ücretsiz limitinize ulaştınız. Aylık 100 QR kodu için Pro'ya yükseltin.",
      stats: { qrCreated: 'Oluşturulan QR Kodu', totalScans: 'Toplam Tarama', thisMonth: 'Bu Ay', planLimit: 'Plan Limiti' },
      createNew: 'Yeni QR Oluştur',
      analytics: { title: 'Analitik', desc: 'QR tarama verileri — cihaz, saat ve tarayıcı dağılımı.', btn: 'Analitiği Görüntüle' },
      customDesign: { title: 'Özel QR Tasarımı', desc: 'Markanıza özel profesyonelce tasarlanmış bir QR kodu alın.', businessDiscount: 'Business üyeleri için %30 indirim', proDiscount: 'Pro üyeleri için %20 indirim', btn: 'Özel Tasarım İste' },
      history: { title: 'QR Geçmişi', type: 'Tür', titleCol: 'Başlık', created: 'Oluşturulma', scans: 'Tarama', actions: 'İşlemler', noQr: 'Henüz QR kodu yok', createFirst: 'İlk QR\'ınızı oluşturun', dynamic: 'Dinamik', editUrl: 'URL Düzenle', save: 'Kaydet', cancel: 'İptal', download: 'İndir', delete: 'Sil' },
      vcard: { title: 'vCard Profilim', desc: 'Taranabilir QR koduyla paylaşılabilir dijital kartvizit oluşturun.', btn: 'vCard Profilini Düzenle' },
      successBanner: 'Ödeme başarılı! Planınız yükseltildi. Aşağıya yansıması birkaç saniye alabilir.',
      signInRequired: 'Panoyu görüntülemek için lütfen giriş yapın.',
      loadError: 'Pano verileri yüklenemedi. Lütfen tekrar deneyin.',
    },
  },

  pl: {
    nav: {
      generate: 'Generuj', pricing: 'Cennik', about: 'O nas', blog: 'Blog', contact: 'Kontakt',
      login: 'Zaloguj', register: 'Zarejestruj', dashboard: 'Panel', logout: 'Wyloguj',
    },
    hero: {
      heading1: 'Generuj inteligentne', heading2: 'kody QR', heading3: 'błyskawicznie',
      sub: 'Twórz profesjonalne kody QR dla swojego biznesu w kilka sekund. Szybko, bezpiecznie i niezwykle łatwo.',
      cta: 'Utwórz kod QR',
    },
    qrTypes: {
      title: 'Wybierz typ kodu QR', sub: 'Wybierz spośród naszych specjalistycznych kodów QR', generateNow: 'Generuj teraz',
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
      title: 'Dlaczego QuickQR?', sub: 'Odkryj korzyści z używania QuickQR do tworzenia kodów QR.',
      features: [
        { title: 'Szybki', desc: 'Generuj kody QR w kilka sekund dzięki intuicyjnemu interfejsowi.' },
        { title: 'Bezpieczny', desc: 'Twoje dane są szyfrowane i chronione.' },
        { title: 'Łatwy w użyciu', desc: 'Prosty interfejs, zaawansowane funkcje.' },
        { title: 'Przyjazny mobilnie', desc: 'Działa doskonale na wszystkich urządzeniach.' },
      ],
    },
    how: {
      title: 'Jak to działa', sub: 'Zacznij w trzech prostych krokach',
      steps: [
        { title: 'Utwórz konto', desc: 'Zarejestruj się w kilka sekund' },
        { title: 'Wybierz typ QR', desc: 'Wybierz spośród 6 typów kodów QR' },
        { title: 'Generuj natychmiast', desc: 'Otrzymaj kod QR od razu' },
      ],
    },
    cta: { heading: 'Potrzebujesz czegoś niestandardowego?', sub: 'Stworzymy dla Ciebie spersonalizowane rozwiązanie QR', button: 'Zamów niestandardowy QR' },
    footer: {
      desc: 'Prosty i szybki generator kodów QR dla stron internetowych, menu i kart cyfrowych.',
      links: 'Linki', followUs: 'Obserwuj nas', contact: 'Kontakt',
      privacy: 'Polityka prywatności', terms: 'Warunki usługi', copyright: 'Wszelkie prawa zastrzeżone.',
    },
    generate: {
      home: 'Strona główna', viewHistory: 'Historia', logout: 'Wyloguj', register: 'Zarejestruj',
      types: { url: 'URL / Link do strony', restaurant: 'Menu restauracji', vcard: 'vCard / Wizytówka', social: 'Media społecznościowe', location: 'Google Maps', email: 'E-mail', wifi: 'Wi-Fi' },
      createTitle: 'Wygeneruj kod QR',
      websiteUrl: 'URL strony', menuUrl: 'URL menu', businessName: 'Nazwa firmy', optional: '(opcjonalne)',
      address: 'Adres', generatedLink: 'Wygenerowany link:',
      locationFrameHint: 'Ramka "Prowadź mnie" jest wstępnie wybrana.',
      wifiFrameHint: 'Ramka "Skanuj Wi-Fi" jest wstępnie wybrana.',
      socialHint: 'Wypełnij jedną lub więcej platform. Resztę zostaw pustą.',
      fullName: 'Imię i nazwisko', phone: 'Telefon', email: 'E-mail', website: 'Strona internetowa',
      to: 'Do', subject: 'Temat', body: 'Treść',
      networkName: 'Nazwa sieci (SSID)', securityType: 'Typ zabezpieczenia', noPassword: 'Otwarta (bez hasła)',
      password: 'Hasło', showPassword: 'Pokaż hasło', hidePassword: 'Ukryj hasło',
      generating: 'Generowanie...', generateQR: 'Generuj kod QR',
      customizeTitle: 'Dostosuj kolory', qrColor: 'Kolor QR', bgColor: 'Kolor tła',
      previewTitle: 'Twój kod QR', loadingPreview: 'Ładowanie podglądu…', failedLoad: 'Nie udało się załadować QR. Sprawdź połączenie.',
      downloading: 'Pobieranie…', downloadPng: 'Pobierz PNG', createAnother: 'Utwórz kolejny',
      savePrompt: 'Zarejestruj się, aby zapisywać kody QR i przeglądać statystyki skanowania',
      createFreeAccount: 'Utwórz darmowe konto', historyTitle: 'Historia kodów QR', noHistory: 'Brak danych historii.',
      dynamicTitle: 'Dynamiczny QR', dynamicDesc: 'Zmieniaj docelowy URL w dowolnym momencie bez ponownego drukowania kodu QR.',
      dynamicHint: 'Twój QR będzie wskazywał URL przekierowania. Możesz zaktualizować cel z Panelu w dowolnym momencie.',
      limitProTitle: 'Osiągnięto limit Pro', limitFreeTitle: 'Osiągnięto darmowy limit',
      limitProDesc: 'Wykorzystałeś wszystkie 100 kodów QR w tym miesiącu. Przejdź na Business dla nieograniczonej liczby kodów.',
      limitFreeDesc: 'Przejdź na Pro dla 100 kodów QR/miesiąc i zaawansowanych analityk.',
      businessPlanLabel: 'Plan Business:', businessPlanFeature: 'Nieograniczone kody QR miesięcznie',
      proPlanLabel: 'Plan Pro:', proPlanFeature: '100 kodów QR miesięcznie',
      upgradeToBusiness: 'Przejdź na Business', upgradeToProBtn: 'Przejdź na Pro', maybeLater: 'Może później',
      frames: { noFrame: 'Bez ramki', scanMe: 'Zeskanuj mnie', seeMenu: 'Zobacz menu', rateUs: 'Oceń nas', scanWifi: 'Skanuj Wi-Fi', getDirections: 'Prowadź mnie' },
      errors: {
        urlRequired: 'URL jest wymagany', invalidUrl: 'Podaj prawidłowy URL zaczynający się od http:// lub https://',
        socialRequired: 'Dodaj co najmniej jeden link do mediów społecznościowych', addressRequired: 'Adres jest wymagany',
        nameRequired: 'Imię jest wymagane', invalidEmail: 'Podaj prawidłowy adres e-mail',
        invalidWebsite: 'Strona musi zaczynać się od http:// lub https://',
        recipientRequired: 'Adres e-mail odbiorcy jest wymagany', ssidRequired: 'Nazwa sieci (SSID) jest wymagana',
        downloadFailed: 'Pobieranie nie powiodło się. Spróbuj ponownie.',
        saveFailed: 'QR utworzony, ale zapisywanie nie powiodło się. Spróbuj ponownie.',
      },
    },
    about: {
      ourStory: 'Nasza historia',
      heading: 'Upraszczamy kody QR dla każdej firmy',
      sub: 'QuickQR pomaga przekształcać linki, kontakty i dane Wi-Fi w kody do skanowania, którym Twoi klienci mogą zaufać — bez zbędnych komplikacji.',
      stats: { qrGenerated: 'Wygenerowanych kodów QR', happyUsers: 'Zadowolonych użytkowników', uptime: 'Dostępność', qrTypes: 'Typy QR' },
      mission: {
        title: 'Nasza misja',
        p1: 'Wierzymy, że kody QR powinny być łatwe do tworzenia i przyjemne do skanowania. Naszą misją jest danie każdej firmie — od kawiarni po korporacje — narzędzi do natychmiastowego i bezpiecznego udostępniania informacji.',
        p2: 'Skupiamy się na przejrzystości, szybkości i dostępności, aby Twoi klienci mieli płynne doświadczenie na każdym urządzeniu.',
      },
      values: {
        speed: { title: 'Szybkość', text: 'Generuj kody w kilka sekund dzięki skupionemu, minimalnemu procesowi.' },
        security: { title: 'Bezpieczeństwo', text: 'Traktujemy Twoje dane z troską i minimalizujemy ryzyko.' },
        accessibility: { title: 'Dostępność', text: 'Czytelne układy i wyraźne etykiety dla każdego odwiedzającego.' },
        innovation: { title: 'Innowacja', text: 'Dostarczamy użyteczne typy QR dopasowane do tego, jak działają dzisiejsze firmy.' },
      },
      whyBuilt: {
        title: 'Dlaczego to zbudowaliśmy',
        p1: 'Zbyt wiele narzędzi QR wydaje się skomplikowanych lub przestarzałych. Stworzyliśmy QuickQR, aby był szybki, nowoczesny i uczciwy — abyś mógł skupić się na swojej firmie, a nie walczyć z oprogramowaniem.',
        p2: 'Niezależnie od tego, czy udostępniasz menu, lokalizację czy wizytówkę, QuickQR zapewnia spójne i profesjonalne doświadczenie.',
        btn: 'Wypróbuj za darmo',
      },
      cta: {
        title: 'Gotowy stworzyć swój pierwszy kod QR?',
        sub: 'Przejdź do generatora lub poznaj plany, gdy potrzebujesz więcej możliwości dla swojego zespołu.',
        createBtn: 'Utwórz QR za darmo', pricingBtn: 'Zobacz cennik',
      },
    },
    contact: {
      title: 'Skontaktuj się', emailLabel: 'E-mail', phoneLabel: 'Telefon',
      responseTime: 'Czas odpowiedzi', responseTimeText: 'Zazwyczaj w ciągu 24 godzin',
      successTitle: 'Wiadomość wysłana!', successMsg: 'odezwiemy się wkrótce.', sendAnother: 'Wyślij kolejną wiadomość',
      name: 'Imię', namePlaceholder: 'Twoje imię i nazwisko', emailPlaceholder: 'ty@example.com',
      message: 'Wiadomość', messagePlaceholder: 'Napisz swoją wiadomość tutaj...',
      sending: 'Wysyłanie...', send: 'Wyślij wiadomość',
      errors: { nameRequired: 'Imię jest wymagane', emailRequired: 'E-mail jest wymagany', invalidEmail: 'Podaj prawidłowy adres e-mail', messageRequired: 'Wiadomość jest wymagana', messageTooShort: 'Wiadomość musi mieć co najmniej 10 znaków' },
    },
    pricing: {
      title: 'Proste, przejrzyste ceny', sub: 'Wybierz plan najlepiej dopasowany do potrzeb Twojej firmy. Bez ukrytych opłat.',
      mostPopular: 'Najpopularniejszy', perMonth: '/mies.', getStarted: 'Zacznij', upgradeNow: 'Ulepsz teraz',
      redirecting: 'Przekierowywanie…', canceledPayment: 'Płatność anulowana. Nie pobrano żadnych opłat.',
      networkError: 'Błąd sieci. Spróbuj ponownie.', somethingWrong: 'Coś poszło nie tak. Spróbuj ponownie.',
      plans: {
        free: { name: 'Darmowy', features: ['5 kodów QR / miesiąc', 'Podstawowe typy QR', 'Wsparcie e-mail', 'Historia przez 7 dni'] },
        pro: { name: 'Pro', features: ['100 kodów QR / miesiąc', 'Wszystkie typy QR odblokowane', 'Eksport w wysokiej rozdzielczości', 'Opcje brandingu', 'Analityki (30 dni)'] },
        business: { name: 'Business', features: ['Nieograniczone kody QR', 'Współpraca zespołu', 'Dostęp do API', 'Zaawansowane analityki', 'Priorytetowe wsparcie'] },
      },
    },
    faq: {
      title: 'Często zadawane pytania',
      items: [
        { question: 'Czy muszę się rejestrować, aby korzystać z QuickQR?', answer: 'Tak. Musisz utworzyć darmowe konto, aby bezpiecznie generować kody QR i zarządzać nimi.' },
        { question: 'Czy plan darmowy jest naprawdę bezpłatny?', answer: 'Absolutnie. Możesz generować do 5 kodów QR miesięcznie bez żadnych kosztów i bez karty kredytowej.' },
        { question: 'Czy mogę ulepszyć lub obniżyć plan w dowolnym momencie?', answer: 'Tak, możesz zmienić plan subskrypcji w dowolnym momencie z ustawień konta.' },
        { question: 'Jakie typy kodów QR mogę generować?', answer: 'Możesz tworzyć kody QR dla menu, mediów społecznościowych, vCard, e-mail, lokalizacji, Wi-Fi i wielu innych — w zależności od planu.' },
        { question: 'Czy jest API dla programistów?', answer: 'Tak! Nasz plan Business zawiera bezpieczny dostęp do API dla generowania i zarządzania kodami QR.' },
      ],
    },
    auth: {
      login: 'Zaloguj', register: 'Zarejestruj', checkEmail: 'Sprawdź e-mail, aby potwierdzić konto.',
      email: 'E-mail', password: 'Hasło', rememberMe: 'Zapamiętaj mnie', forgotPassword: 'Zapomniałem hasła?',
      signIn: 'Zaloguj się', pleaseWait: 'Proszę czekać', fullName: 'Imię i nazwisko', confirmPassword: 'Potwierdź hasło',
      strength: 'Siła:', agreeTerms: 'Zgadzam się z Regulaminem i Polityką prywatności', createAccount: 'Utwórz konto',
      tooManyAttempts: 'Zbyt wiele prób, poczekaj {sec}s',
      errors: {
        emailRequired: 'E-mail jest wymagany', invalidEmail: 'Podaj prawidłowy adres e-mail',
        passwordRequired: 'Hasło jest wymagane', passwordTooShort: 'Hasło musi mieć co najmniej 8 znaków',
        passwordsNoMatch: 'Hasła nie pasują do siebie', termsRequired: 'Musisz zaakceptować Regulamin i Politykę prywatności',
        nameRequired: 'Podaj imię i nazwisko (min. 2 znaki)', somethingWrong: 'Coś poszło nie tak. Spróbuj ponownie.',
      },
    },
    dashboard: {
      welcomeBack: 'Witaj ponownie, {name}!', freePlan: 'Plan darmowy', proPlan: 'Plan Pro', businessPlan: 'Plan Business',
      upgradeToPro: 'Przejdź na Pro',
      limitProMsg: 'Wykorzystałeś wszystkie 100 kodów QR w tym miesiącu. Przejdź na Business dla nieograniczonej liczby kodów.',
      limitFreeMsg: 'Osiągnięto darmowy limit. Przejdź na Pro dla 100 kodów QR/miesiąc.',
      stats: { qrCreated: 'Wygenerowane kody QR', totalScans: 'Łączne skany', thisMonth: 'W tym miesiącu', planLimit: 'Limit planu' },
      createNew: 'Utwórz nowy QR',
      analytics: { title: 'Analityki', desc: 'Dane skanowania QR — podział według urządzenia, czasu i przeglądarki.', btn: 'Wyświetl analityki' },
      customDesign: { title: 'Własny projekt QR', desc: 'Uzyskaj profesjonalnie zaprojektowany kod QR dostosowany do Twojej marki.', businessDiscount: '30% zniżki dla członków Business', proDiscount: '20% zniżki dla członków Pro', btn: 'Zamów własny projekt' },
      history: { title: 'Historia QR', type: 'Typ', titleCol: 'Tytuł', created: 'Utworzono', scans: 'Skany', actions: 'Akcje', noQr: 'Brak kodów QR', createFirst: 'Utwórz swój pierwszy kod QR', dynamic: 'Dynamiczny', editUrl: 'Edytuj URL', save: 'Zapisz', cancel: 'Anuluj', download: 'Pobierz', delete: 'Usuń' },
      vcard: { title: 'Mój profil vCard', desc: 'Utwórz udostępnialną cyfrową wizytówkę ze skanowalnym kodem QR.', btn: 'Edytuj profil vCard' },
      successBanner: 'Płatność zakończona sukcesem! Twój plan został ulepszony. Może to chwilę zająć, zanim zmiany będą widoczne poniżej.',
      signInRequired: 'Zaloguj się, aby wyświetlić swój panel.',
      loadError: 'Nie udało się załadować danych panelu. Spróbuj ponownie.',
    },
  },
};
