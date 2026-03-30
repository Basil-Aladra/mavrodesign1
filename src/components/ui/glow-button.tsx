import React, { forwardRef, useState } from 'react';
import { Sparkles, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  label?: string;
  onClick?(): void;
  className?: string;
  type?: "button" | "submit" | "reset";
  href?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
}

export const GlowButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ComponentProps>(
  ({ label = "Generate", onClick, className, type = "button", href, icon: Icon = Sparkles, variant = "primary" }, ref) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick?.();
    };

    const content = (
      <span className="flex items-center justify-center gap-1.5 relative z-10 transition-transform active:scale-95 duration-200">
        {label}
        <Icon size={16} className="ml-0.5 transition-transform duration-300 group-hover:translate-x-[-4px]" />
      </span>
    );

    const commonProps = {
      className: cn(
        variant === "primary" ? "glow-btn" : "font-bold border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 rounded-full px-6 py-2.5",
        className
      ),
      onClick: handleClick,
      "data-state": isClicked ? "clicked" : undefined,
    };

    if (href) {
      return (
        <a 
          ref={ref as React.Ref<HTMLAnchorElement>} 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          {...commonProps}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        aria-label={label}
        {...commonProps}
      >
        {content}
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
