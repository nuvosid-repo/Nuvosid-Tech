import {
  LuAppWindow,
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpRight,
  LuBadgeCheck,
  LuBrainCircuit,
  LuCloud,
  LuCode,
  LuCompass,
  LuCpu,
  LuGauge,
  LuGlobe,
  LuLayers,
  LuMail,
  LuMapPin,
  LuMenu,
  LuMoon,
  LuPenTool,
  LuPhone,
  LuQuote,
  LuRocket,
  LuSearch,
  LuSend,
  LuShieldCheck,
  LuShoppingCart,
  LuSmartphone,
  LuSparkles,
  LuSun,
  LuTerminal,
  LuX,
  LuZap,
} from "react-icons/lu";
import { SiGreensock, SiMongodb, SiNextdotjs, SiNodedotjs, SiPython, SiReact, SiThreedotjs } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

// Central icon registry — data files reference icons by key.
const ICONS = {
  // UI
  "arrow-up-right": LuArrowUpRight,
  "arrow-right": LuArrowRight,
  "arrow-left": LuArrowLeft,
  "arrow-up": LuArrowUp,
  "arrow-down": LuArrowDown,
  menu: LuMenu,
  close: LuX,
  sun: LuSun,
  moon: LuMoon,
  quote: LuQuote,
  mail: LuMail,
  phone: LuPhone,
  pin: LuMapPin,
  send: LuSend,
  sparkles: LuSparkles,
  // Services
  globe: LuGlobe,
  app: LuAppWindow,
  mobile: LuSmartphone,
  pen: LuPenTool,
  code: LuCode,
  brain: LuBrainCircuit,
  cart: LuShoppingCart,
  cloud: LuCloud,
  // Stats / products / process
  shield: LuShieldCheck,
  layers: LuLayers,
  gauge: LuGauge,
  rocket: LuRocket,
  cpu: LuCpu,
  zap: LuZap,
  search: LuSearch,
  compass: LuCompass,
  terminal: LuTerminal,
  check: LuBadgeCheck,
  // Technology brands
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  python: SiPython,
  mongodb: SiMongodb,
  aws: FaAws,
  threejs: SiThreedotjs,
  gsap: SiGreensock,
  // Social
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  instagram: FaInstagram,
  github: FaGithub,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp aria-hidden="true" focusable="false" {...props} />;
}
