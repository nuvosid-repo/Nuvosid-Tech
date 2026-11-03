// -------------------------------------------------------------
// Global site configuration.
// ⚠️ PLACEHOLDER contact/social values — replace with official
// NUVOSID TECH details before launch.
// -------------------------------------------------------------
export const site = {
  name: "NUVOSID TECH",
  shortName: "Nuvosid",
  tagline: "THINK SUCCESS. THINK GROWTH. THINK NUVOSID.",
  description:
    "NUVOSID TECH transforms ambitious ideas into powerful digital experiences through innovative technology, creative thinking and intelligent solutions.",
  url: "https://www.nuvosidtech.com", // placeholder
  contact: {
    email: "hello@nuvosidtech.com", // placeholder
    phone: "+00 000 000 0000", // placeholder
    location: "Office address — to be confirmed", // placeholder
  },
  social: [
    { label: "LinkedIn", icon: "linkedin", href: "#" },
    { label: "X (Twitter)", icon: "x", href: "#" },
    { label: "Instagram", icon: "instagram", href: "#" },
    { label: "GitHub", icon: "github", href: "#" },
  ],
};

// Main navigation — homepage sections use anchors; inner pages are
// placeholder routes until they are approved for development.
export const navLinks = [
  { label: "Home", href: "/#top", section: "top" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Services", href: "/#services", section: "services" },
  { label: "Products", href: "/#products", section: "products" },
  { label: "Our Work", href: "/#work", section: "work" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact", section: "contact" },
];

export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/#top" },
      { label: "About", href: "/#about" },
      { label: "Our Work", href: "/#work" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Website Development", href: "/#services" },
      { label: "Web Applications", href: "/#services" },
      { label: "AI & Automation", href: "/#services" },
      { label: "Cloud Solutions", href: "/#services" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Nuvosid Intelligence Core", href: "/#products" },
      { label: "Veloce Real-Time Mesh", href: "/#products" },
      { label: "Krypton Shield", href: "/#products" },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
