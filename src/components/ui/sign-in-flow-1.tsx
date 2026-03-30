import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Instagram, Mail, Sparkles } from "lucide-react";
import { GlowButton } from "./glow-button";


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

interface SignInPageProps {
  className?: string;
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
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
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
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-block overflow-hidden h-5 flex items-center text-sm">
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-300">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </a>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (shapeTimeoutRef.current) window.clearTimeout(shapeTimeoutRef.current);
    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = window.setTimeout(() => setHeaderShapeClass('rounded-full'), 300);
    }
    return () => { if (shapeTimeoutRef.current) window.clearTimeout(shapeTimeoutRef.current); };
  }, [isOpen]);

  const navLinksData = [
    { label: 'Manifesto', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Discover', href: '#' },
  ];

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center pl-6 pr-6 py-3 backdrop-blur-sm ${headerShapeClass} border border-[#333] bg-[#1f1f1f57] w-[calc(100%-2rem)] sm:w-auto transition-[border-radius] duration-300 ease-in-out`}>
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
          <span className="ml-2 text-white font-bold hidden sm:block">Mavro Design</span>
        </div>
        <nav className="hidden sm:flex items-center space-x-6 text-sm">
          {navLinksData.map((link, i) => <AnimatedNavLink key={i} href={link.href}>{link.label}</AnimatedNavLink>)}
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          <a href="#" className="px-5 py-2 text-xs h-9" >
            LogIn
          </a>
          <a href="#" className="px-5 py-2 text-xs h-9 bg-white text-black" >
            Signup
          </a>
        </div>
        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>
      <div className={`sm:hidden flex flex-col items-center w-full transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link, i) => <a key={i} href={link.href} className="text-gray-300 hover:text-white transition-colors">{link.label}</a>)}
        </nav>
      </div>
    </header>
  );
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => codeInputRefs.current[0]?.focus(), 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) codeInputRefs.current[index + 1]?.focus();
      if (index === 5 && value) {
        if (newCode.every(digit => digit.length === 1)) {
          setReverseCanvasVisible(true);
          setTimeout(() => setInitialCanvasVisible(false), 50);
          setTimeout(() => setStep("success"), 2000);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) codeInputRefs.current[index - 1]?.focus();
  };

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-[#020617] relative", className)}>
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(6,182,212,0.4), transparent)`,
          }}
        />
        {initialCanvasVisible && (
          <div className="absolute inset-0 opacity-40">
            <CanvasRevealEffect animationSpeed={3} containerClassName="bg-transparent" colors={[[255, 255, 255], [255, 255, 255]]} dotSize={6} reverse={false} />
          </div>
        )}
        {reverseCanvasVisible && (
          <div className="absolute inset-0 opacity-40">
            <CanvasRevealEffect animationSpeed={4} containerClassName="bg-transparent" colors={[[255, 255, 255], [255, 255, 255]]} dotSize={6} reverse={true} />
          </div>
        )}
      </div>
      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar />
        <div className="flex flex-1 flex-col justify-center items-center">
          <div className="w-full mt-24 max-w-sm px-6">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                  <motion.h1
                    className="text-5xl font-extrabold tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-white bg-[length:200%_auto] animate-shimmer inline-block drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                      Mavro Design
                    </span>
                  </motion.h1>
                  <motion.p
                    className="text-lg text-white/60 font-medium leading-relaxed   mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    dir="rtl"
                  >
                    ماڤرو ديزاين منصة إبداعية تقدم حلولاً بصرية متكاملة تجمع بين التصميم الجرافيكي والتقنيات الحديثة، لنساعد العلامات التجارية على بناء حضور احترافي، عصري، وسهل الوصول.
                  </motion.p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <GlowButton
                      label="Instagram"
                      href="https://www.instagram.com/mavrodesign1/"
                      icon={Instagram}
                      className="w-full sm:w-auto px-8"
                    />
                    <GlowButton
                      label="Email"
                      href="mailto:mavrodesign1@outlook.com"
                      icon={Mail}
                      className="w-full sm:w-auto px-8"
                    />
                  </div>
                </motion.div>
              ) : step === "code" ? (
                <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 text-center">
                  <h1 className="text-3xl font-bold text-white">Verification Code</h1>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, i) => (
                      <input key={i} ref={el => codeInputRefs.current[i] = el} type="text" maxLength={1} value={digit} onChange={e => handleCodeChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} className="w-10 h-12 text-center text-xl bg-white/5 text-white border border-white/10 rounded-md focus:outline-none focus:border-white/30" />
                    ))}
                  </div>
                  <button onClick={() => setStep("email")} className="text-white/50 hover:text-white transition-colors transition-all active:scale-95 duration-200">Back</button>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
                  <h1 className="text-4xl font-bold text-white">You're in!</h1>
                  <GlowButton label="Continue to Dashboard" className="w-full" onClick={() => window.location.reload()} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
