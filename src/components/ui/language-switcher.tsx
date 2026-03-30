import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className={cn("relative flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md", className)}>
      {/* Active Indicator */}
      <motion.div
        className="absolute w-10 h-7 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        initial={false}
        animate={{
          x: currentLang === 'ar' ? 0 : 36,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => i18n.changeLanguage('ar')}
        className={cn(
          "relative z-10 w-10 h-7 text-[10px] font-bold transition-colors duration-300",
          currentLang === 'ar' ? "text-white" : "text-white/40 hover:text-white/70"
        )}
      >
        AR
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={cn(
          "relative z-10 w-10 h-7 text-[10px] font-bold transition-colors duration-300",
          currentLang === 'en' ? "text-white" : "text-white/40 hover:text-white/70"
        )}
      >
        EN
      </button>
    </div>
  );
};
