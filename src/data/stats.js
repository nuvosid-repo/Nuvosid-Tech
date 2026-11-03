// Company metrics shown in the Hero and About sections.
// ⚠️ These are capability targets / factual counts, NOT client results.
// Replace with verified company figures when available.
export const heroStats = [
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime\nTarget", tone: "text" },
  { value: 1, prefix: "<", suffix: "s", label: "Load-Time\nGoal", tone: "accent" },
  { value: 8, suffix: "+", label: "Core\nDisciplines", tone: "lime" },
];

export const aboutStats = [
  {
    eyebrow: "Reliability",
    icon: "shield",
    value: 99.9,
    decimals: 1,
    suffix: "%",
    title: "Uptime-First Architecture",
    text: "Resilient, monitored infrastructure designed for always-on digital products.",
    meter: 0.98,
    tone: "accent",
  },
  {
    eyebrow: "Capabilities",
    icon: "layers",
    value: 8,
    suffix: "",
    title: "Core Service Disciplines",
    text: "From websites and mobile apps to AI automation and cloud engineering.",
    meter: 0.86,
    tone: "accent",
  },
  {
    eyebrow: "Performance",
    icon: "gauge",
    value: 100,
    suffix: "",
    prefix: "",
    affix: "/100",
    title: "Lighthouse Target",
    text: "Performance budgets and Core Web Vitals baked into every build.",
    meter: 0.94,
    tone: "lime",
  },
  {
    eyebrow: "Delivery",
    icon: "rocket",
    value: 6,
    suffix: "",
    title: "Phase Delivery Process",
    text: "A transparent path from discovery to launch — and beyond.",
    meter: 0.72,
    tone: "accent",
  },
];
