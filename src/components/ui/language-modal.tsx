import { motion, AnimatePresence } from "framer-motion";

import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  onSelect: (lang: 'ar' | 'en') => void;
}

export const LanguageModal = ({ isOpen, onSelect }: LanguageModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <Globe className="w-10 h-10 text-cyan-400" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Mavro Design
              </h2>
              <p className="text-white/40 text-sm font-medium mb-10 uppercase tracking-[0.2em]">
                Creative Visual Agency
              </p>

              <div className="w-full space-y-4">
                {/* Arabic Option */}
                <button
                  onClick={() => onSelect('ar')}
                  className="group w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 text-right"
                  dir="rtl"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xl font-bold text-white">العربية</span>
                    <span className="text-xs text-white/40">تصفح الموقع باللغة العربية</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white text-cyan-400 transition-all duration-300">
                    <ArrowLeft size={18} />
                  </div>
                </button>

                {/* English Option */}
                <button
                  onClick={() => onSelect('en')}
                  className="group w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left"
                  dir="ltr"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xl font-bold text-white">English</span>
                    <span className="text-xs text-white/40">Browse site in English</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white text-cyan-400 transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 w-full">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
                  Select your preferred language to continue
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
