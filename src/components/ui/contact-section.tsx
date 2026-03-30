import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ContactCardProps {
  title: string;
  value: string;
  iconUrl: string;
  href: string;
  delay?: number;
  className?: string;
  color: string;
}

const ContactCard = ({ title, value, iconUrl, href, delay = 0, className, color }: ContactCardProps) => {
  const { t } = useTranslation();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 overflow-hidden",
        className
      )}
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        color === "cyan" ? "bg-cyan-500" : color === "pink" ? "bg-pink-500" : "bg-blue-500"
      )} />

      {/* Icon Wrapper */}
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg bg-white/5",
        color === "cyan" ? "text-cyan-400" : 
        color === "pink" ? "text-pink-400" : 
        "text-blue-400"
      )}>
        <img src={iconUrl} alt={title} className="w-10 h-10 object-contain drop-shadow-md" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/40 text-sm font-medium mb-6">{value}</p>

      <div className={cn(
        "flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
        color === "cyan" ? "text-cyan-400/80 group-hover:text-cyan-400" : 
        color === "pink" ? "text-pink-400/80 group-hover:text-pink-400" : 
        "text-blue-400/80 group-hover:text-blue-400"
      )}>
        <span>{t('contact.action')}</span>
        <ExternalLink size={12} className="transition-transform group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
};

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const contacts = [
    {
      title: t('contact.whatsapp'),
      value: "+970 599 874 112",
      iconUrl: "https://img.icons8.com/3d-fluency/94/whatsapp-logo.png",
      href: "https://wa.me/970599874112",
      color: "cyan",
    },
    {
      title: t('contact.instagram'),
      value: "@mavrodesign1",
      iconUrl: "https://img.icons8.com/3d-fluency/94/instagram-new.png",
      href: "https://www.instagram.com/mavrodesign1/",
      color: "pink",
    },
    {
      title: t('contact.email'),
      value: "mavrodesign1@outlook.com",
      iconUrl: "https://img.icons8.com/color/48/microsoft-outlook-2025.png",
      href: "mailto:mavrodesign1@outlook.com",
      color: "blue",
    },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]" dir={isRtl ? "rtl" : "ltr"}>
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase"
          >
            {t('contact.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          >
            {t('contact.title')} <span className="text-cyan-400">{t('contact.highlight')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl text-white/50 font-medium"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {contacts.map((contact, index) => (
            <ContactCard
              key={index}
              {...contact}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs font-semibold uppercase tracking-widest"
        >
          <span>{t('contact.footer')}</span>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 hover:text-cyan-400 transition-colors">{t('contact.privacy')}</a>
            <a href="#" className="text-white/50 hover:text-cyan-400 transition-colors">{t('contact.terms')}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
