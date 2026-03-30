import { motion } from "framer-motion";
import { 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  iconUrl: string;
  delay?: number;
  className?: string;
}

const ServiceCard = ({ title, description, iconUrl, delay = 0, className }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={cn(
        "group relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon Wrapper */}
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]">
        <img src={iconUrl} alt={title} className="w-10 h-10 object-contain drop-shadow-md" />
      </div>

      <div className="relative z-10 space-y-3">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Background Pattern */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export const ServicesSection = () => {
  const services = [
    {
      title: "الهوية البصرية",
      description: "نبتكر شعارات وهويات بصرية متكاملة تعكس روح علامتك التجارية وتترك انطباعاً لا ينسى لدى عملائك.",
      iconUrl: "https://img.icons8.com/3d-fluency/94/create-icon.png",
    },
    {
      title: "تقنية NFC الذكية",
      description: "نطور بطاقات أعمال وأنظمة ربط ذكية تتيح لك مشاركة بياناتك ومعلوماتك بلمسة واحدة عبر الجوال.",
      iconUrl: "https://img.icons8.com/color/48/nfc-sign.png",
    },
    {
      title: "الموشن جرافيك",
      description: "نصنع فيديوهات تحريك احترافية تحول أفكارك المعقدة إلى قصص بصرية جذابة وسهلة الفهم.",
      iconUrl: "https://img.icons8.com/3d-fluency/94/visual-effects.png",
    },
    {
      title: "واجهات الـ UI/UX",
      description: "نصمم واجهات مستخدم عصرية للمواقع والتطبيقات تضمن تجربة استخدام سلسة وممتعة.",
      iconUrl: "https://img.icons8.com/fluency/48/web-design--v1.png",
    },
    {
      title: "إدارة منصات التواصل",
      description: "ندير حضورك الرقمي ونبتكر محتوى إبداعياً يعزز التفاعل ويبني قاعدة جماهيرية قوية لعلامتك.",
      iconUrl: "https://img.icons8.com/3d-fluency/94/commercial.png",
    },
    {
      title: "التصوير الفوتوغرافي",
      description: "نقدم خدمات تصوير احترافية للمنتجات والمشاريع تبرز أدق التفاصيل وتظهر جودة عملك.",
      iconUrl: "https://img.icons8.com/3d-fluency/94/camera.png",
    },
  ];

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase"
          >
            ماذا نقدم؟
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            <span className="text-white">خدماتنا</span>{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">المتكاملة</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-white/50 text-sm sm:text-base font-medium leading-relaxed"
          >
            نجمع بين الإبداع الفني والحلول التقنية المتطورة لنقدم لك تجربة بصرية وقمية لا تضاهى، تضع علامتك التجارية في الصدارة.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              iconUrl={service.iconUrl}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
