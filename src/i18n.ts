import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        services: "خدماتنا",
        contact: "اتصل بنا",
        start: "ابدأ الآن"
      },
      hero: {
        visualIdentity: "هوية بصرية",
        smartNfc: "تقنية NFC الذكية",
        digitalSolutions: "حلول رقمية",
        innovative: "حلول رقمية مبتكرة",
        titleMain: "تصميم يجمع بين الإبداع البصري",
        titleHighlight: "والذكاء التقني",
        description: "نحن في Mavro Design نحول الأفكار إلى هويات بصرية ملموسة وتجارب رقمية ذكية تضعك في الصدارة.",
        buttons: {
          start: "ابدأ مشروعك",
          work: "شاهد أعمالنا"
        },
        trust: {
          branding: "هوية بصرية احترافية",
          nfc: "حلول NFC ذكية",
          digital: "تجربة رقمية متكاملة"
        }
      },
      services: {
        badge: "ماذا نقدم؟",
        title: "خدماتنا",
        highlight: "المتكاملة",
        subtitle: "نجمع بين الإبداع الفني والحلول التقنية المتطورة لنقدم لك تجربة بصرية ورقمية لا تضاهى.",
        items: {
          branding: {
            title: "الهوية البصرية",
            description: "نبتكر شعارات وهويات بصرية متكاملة تعكس روح علامتك التجارية وتترك انطباعاً لا ينسى."
          },
          nfc: {
            title: "تقنية NFC الذكية",
            description: "نطور بطاقات أعمال وأنظمة ربط ذكية تتيح لك مشاركة بياناتك بلمسة واحدة عبر الجوال."
          },
          motion: {
            title: "الموشن جرافيك",
            description: "نصنع فيديوهات تحريك احترافية تحول أفكارك المعقدة إلى قصص بصرية جذابة."
          },
          uiux: {
            title: "واجهات الـ UI/UX",
            description: "نصمم واجهات مستخدم عصرية للمواقع والتطبيقات تضمن تجربة استخدام سلسة وممتعة."
          },
          social: {
            title: "إدارة منصات التواصل",
            description: "ندير حضورك الرقمي ونبتكر محتوى إبداعياً يعزز التفاعل ويبني قاعدة جماهيرية قوية."
          },
          photography: {
            title: "التصوير الفوتوغرافي",
            description: "نقدم خدمات تصوير احترافية للمنتجات والمشاريع تبرز أدق التفاصيل وتظهر جودة عملك."
          }
        }
      },
      contact: {
        badge: "دعنا نتحدث",
        title: "اتصل",
        highlight: "بنا",
        subtitle: "نحن هنا لتحويل رؤيتك إلى حقيقة بصرية ذكية. تواصل معنا عبر أي من القنوات التالية.",
        whatsapp: "واتساب",
        instagram: "انستقرام",
        email: "البريد الإلكتروني",
        action: "تواصل الآن",
        footer: "جميع الحقوق محفوظة © 2026 MAVRO DESIGN.",
        privacy: "سياسة الخصوصية",
        terms: "الشروط والأحكام"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        contact: "Contact Us",
        start: "Start Now"
      },
      hero: {
        visualIdentity: "Visual Identity",
        smartNfc: "Smart NFC Tech",
        digitalSolutions: "Digital Solutions",
        innovative: "Innovative",
        titleMain: "Design combining visual creativity",
        titleHighlight: "and technical intelligence",
        description: "At Mavro Design, we transform ideas into tangible visual identities and smart digital experiences that put you ahead.",
        buttons: {
          start: "Start Project",
          work: "View Work"
        },
        trust: {
          branding: "Professional Branding",
          nfc: "Smart NFC Solutions",
          digital: "Integrated Digital Exp"
        }
      },
      services: {
        badge: "What we offer?",
        title: "Our",
        highlight: "Integrated Services",
        subtitle: "We combine artistic creativity with cutting-edge technical solutions to provide an incomparable visual and digital experience.",
        items: {
          branding: {
            title: "Visual Identity",
            description: "We create integrated logos and visual identities that reflect your brand spirit and leave an unforgettable impression."
          },
          nfc: {
            title: "Smart NFC Tech",
            description: "We develop smart business cards and linking systems that allow you to share your data with one touch via mobile."
          },
          motion: {
            title: "Motion Graphics",
            description: "We produce professional animation videos that turn your complex ideas into engaging visual stories."
          },
          uiux: {
            title: "UI/UX Design",
            description: "We design modern user interfaces for websites and apps that ensure a smooth and enjoyable user experience."
          },
          social: {
            title: "Social Media Management",
            description: "We manage your digital presence and create creative content that enhances engagement and builds a strong fan base."
          },
          photography: {
            title: "Photography",
            description: "We provide professional photography services for products and projects that highlight the finest details."
          }
        }
      },
      contact: {
        badge: "Let's Talk",
        title: "Contact",
        highlight: "Us",
        subtitle: "We are here to turn your vision into a smart visual reality. Contact us via any of the following channels.",
        whatsapp: "WhatsApp",
        instagram: "Instagram",
        email: "Email",
        action: "Connect Now",
        footer: "ALL RIGHTS RESERVED © 2026 MAVRO DESIGN.",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
