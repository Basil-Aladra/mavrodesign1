import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Instagram, Sparkles, Palette, Cpu, Globe, MessageCircle } from "lucide-react";
import { GlowButton } from "./glow-button";
import { ServicesSection } from "./services-section";
import { ContactSection } from "./contact-section";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./language-switcher";
import { LanguageModal } from "./language-modal";


type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${center.includes("x")
          ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
          : ""
        }
            ${center.includes("y")
          ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
          : ""
        }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material: any = ref.current.material;
    material.uniforms.u_time.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};
    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value) };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) => new THREE.Vector3().fromArray(v)),
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value) };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0 };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
    });
  }, [size.width, size.height, source, uniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-block overflow-hidden h-5 text-sm mx-6">
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:translate-y-[-100%]">
        <span className="text-gray-400 py-1 flex items-center justify-center">{children}</span>
        <span className="text-white py-1 flex items-center justify-center">{children}</span>
      </div>
    </a>
  );
};

function MiniNavbar() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (shapeTimeoutRef.current) window.clearTimeout(shapeTimeoutRef.current);
    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = window.setTimeout(() => setHeaderShapeClass('rounded-full'), 300);
    }
    return () => { if (shapeTimeoutRef.current) window.clearTimeout(shapeTimeoutRef.current); };
  }, [isOpen]);

  const navLinksData = [
    { label: t('nav.home'), href: '#' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header dir={dir} className={`fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center px-4 sm:px-6 py-2.5 backdrop-blur-xl ${headerShapeClass} border border-white/10 bg-black/40 w-[92%] sm:w-auto transition-all duration-500 ease-in-out shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>
      <div className="flex items-center justify-between w-full gap-x-4 sm:gap-x-12">
        <div className="flex items-center">
          <span className="text-white font-bold tracking-tight text-lg">Mavro Design</span>
        </div>

        <nav className="hidden md:flex items-center gap-x-10 text-sm font-medium">
          {navLinksData.map((link, i) => <AnimatedNavLink key={i} href={link.href}>{link.label}</AnimatedNavLink>)}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
        </div>

        <button className="md:hidden flex items-center justify-center w-8 h-8 text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <div className="space-y-1.5">
            <motion.span animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
            <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-white rounded-full" />
            <motion.span animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-white rounded-full" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden w-full overflow-hidden"
          >
            <nav className="flex flex-col items-center space-y-5 py-6 text-lg font-medium">
              {navLinksData.map((link, i) => (
                <motion.a
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="py-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const FloatingBadge = ({ text, icon: Icon, imageUrl, className, delay = 0, yOffset = 15 }: { text: string, icon?: any, imageUrl?: string, className: string, delay?: number, yOffset?: number }) => {
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -yOffset, 0] }}
    transition={{
      opacity: { duration: 1, delay },
      y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay }
    }}
    className={cn(
      "absolute flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10 origin-center scale-[0.8] sm:scale-90 lg:scale-100",
      className
    )}
  >
    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex flex-shrink-0 items-center justify-center overflow-hidden drop-shadow-lg">
      {imageUrl ? (
        <img src={imageUrl} alt={text} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
      ) : (
        Icon && <Icon size={14} className="text-cyan-400" />
      )}
    </div>
    <span className="text-[11px] sm:text-sm font-semibold text-white/90 whitespace-nowrap">{text}</span>
  </motion.div>
  );
};

const VisualElement = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-[350px] lg:h-[500px] flex items-center justify-center pointer-events-none">
      {/* Background Animated Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]"
      />

      {/* The "NFC Card" Mockup */}
      <motion.div
        initial={{ rotateY: 20, rotateX: 10, y: 20, opacity: 0 }}
        animate={{
          rotateY: [20, 30, 20],
          rotateX: [10, 5, 10],
          y: [0, -15, 0],
          opacity: 1
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          opacity: { duration: 1 }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-48 h-72 sm:w-56 sm:h-80 lg:w-64 lg:h-[24rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col p-6 items-center justify-between"
      >
        <div className="w-full flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Cpu size={20} className="text-cyan-400" />
          </div>
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">NFC TECHNOLOGY</div>
        </div>

        <div className="relative w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-4 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-black/20 flex items-center justify-center text-white font-bold text-xl">M</div>
          </div>
          <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
          <div className="h-2 w-16 bg-white/10 rounded-full" />
        </div>

        <div className="w-full space-y-3">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-cyan-400" />
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="h-1.5 w-12 bg-white/20 rounded-full" />
              <div className="h-1.5 w-8 bg-white/10 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
              <Globe size={14} className="text-white/40" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Badges */}
      <FloatingBadge
        text={t('hero.trust.nfc')}
        imageUrl="https://img.icons8.com/color/48/nfc-n.png"
        className="top-0 right-0 sm:top-10 sm:-right-4 lg:top-8 lg:right-4"
        delay={0.5}
      />

      <FloatingBadge
        text={t('hero.visualIdentity')}
        imageUrl="https://img.icons8.com/3d-fluency/94/color-palette.png"
        className="bottom-6 left-0 sm:bottom-16 sm:-left-4 lg:bottom-12 lg:left-4"
        delay={1.5}
        yOffset={-15}
      />

      {/* New Tool Badges */}
      <FloatingBadge
        text={t('hero.trust.branding')}
        imageUrl="https://img.icons8.com/color-glass/48/adobe-photoshop.png"
        className="top-12 left-0 sm:top-24 sm:-left-16 lg:top-28 lg:left-8"
        delay={0.8}
        yOffset={10}
      />

      <FloatingBadge
        text={t('services.items.branding.title')}
        imageUrl="https://img.icons8.com/color-glass/48/adobe-illustrator.png"
        className="bottom-0 right-0 sm:bottom-12 sm:-right-12 lg:bottom-8 lg:right-8"
        delay={1.2}
        yOffset={-12}
      />

      <FloatingBadge
        text={t('services.items.motion.title')}
        imageUrl="https://img.icons8.com/fluency/48/adobe-after-effects.png"
        className="-top-8 left-4 sm:top-4 sm:left-24 lg:-top-12 lg:left-32"
        delay={2}
        yOffset={18}
      />

      <FloatingBadge
        text={t('services.items.photography.title')}
        imageUrl="https://img.icons8.com/fluency/48/adobe-premiere-pro.png"
        className="bottom-12 right-0 sm:bottom-auto sm:top-1/2 sm:-right-24 lg:top-1/2 lg:right-4"
        delay={1.8}
        yOffset={-10}
      />

      <FloatingBadge
        text={t('services.items.uiux.title')}
        imageUrl="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-figma-a-better-way-to-design-and-gather-feedback-all-in-one-place-logo-color-tal-revivo.png"
        className="top-[45%] left-2 sm:top-[70%] sm:-left-24 lg:top-[65%] lg:left-4"
        delay={0.3}
        yOffset={15}
      />
    </div>
  );
};

const TrustPoint = ({ icon: Icon, text }: { icon: any, text: string }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
      <Icon size={14} className="text-cyan-400" />
      <span className="text-[11px] sm:text-xs text-white/70 whitespace-nowrap">{text}</span>
    </div>
  );
};

export const LandingPage = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const hasSelected = localStorage.getItem('mavro_language_selected');
    if (!hasSelected) {
      setShowLanguageModal(true);
    }
  }, []);

  const handleLanguageSelect = (lang: 'ar' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('mavro_language_selected', 'true');
    setShowLanguageModal(false);
  };

  return (
    <div className={cn("flex w-full flex-col min-h-[100svh] bg-[#020617] relative overflow-x-hidden", className)} dir={dir}>
      <LanguageModal 
        isOpen={showLanguageModal} 
        onSelect={handleLanguageSelect} 
      />
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 800px at -10% 20%, rgba(6,182,212,0.15), transparent), 
                              radial-gradient(circle 600px at 110% 80%, rgba(34,211,238,0.15), transparent)`,
          }}
        />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <CanvasRevealEffect animationSpeed={2} containerClassName="bg-transparent" colors={[[34, 211, 238]]} dotSize={3} reverse={false} />
        </div>
      </div>

      <MiniNavbar />

      <main className="relative z-10 flex flex-1 items-start md:items-center justify-center min-h-[100svh] pt-32 sm:pt-48 md:pt-32 lg:pt-20 pb-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start md:items-center w-full">

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "flex flex-col items-center space-y-8 sm:space-y-10 md:mt-0",
              dir === 'rtl' ? "md:items-start text-center md:text-right" : "md:items-start text-center md:text-left"
            )}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold"
              >
                <Sparkles size={14} />
                <span>{t('hero.innovative')}</span>
              </motion.div>

              <h1 className="text-[2.5rem] leading-[1.2] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] font-bold sm:leading-[1.4] lg:leading-[1.2]">
                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {t('hero.titleMain')}
                </span>
                <br />
                <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg md:text-xl text-white/70 font-medium leading-[1.8] sm:leading-loose px-4 sm:px-0 lg:leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center gap-4 pt-2">
              <GlowButton
                label={t('hero.buttons.start')}
                className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-bold group"
                icon={MessageCircle}
                href="https://wa.me/970599874112"
              />
              <GlowButton
                label={t('hero.buttons.work')}
                variant="secondary"
                className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-bold group"
                icon={Instagram}
                href="https://www.instagram.com/mavrodesign1/"
              />
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 w-full px-4 sm:px-0">
              <TrustPoint icon={Palette} text={t('hero.trust.branding')} />
              <TrustPoint icon={Cpu} text={t('hero.trust.nfc')} />
              <TrustPoint icon={Globe} text={t('hero.trust.digital')} />
            </div>

          </motion.div>

          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="relative z-0 mt-4 md:mt-0"
          >
            <VisualElement />
          </motion.div>
        </div>
      </main>

      <ServicesSection />

      <ContactSection />

      {/* Floating Bottom Element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 hidden lg:block">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};
