import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { themeInitScript } from "@/hooks/useTheme";
import { site } from "@/data/site";
import SmoothScroll from "@/components/common/SmoothScroll/SmoothScroll";
import Preloader from "@/components/common/Preloader/Preloader";
import ScrollProgress from "@/components/common/ScrollProgress/ScrollProgress";
import CustomCursor from "@/components/common/CustomCursor/CustomCursor";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import BackToTop from "@/components/common/BackToTop/BackToTop";
import "./globals.scss";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500", "600"] });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — We Build the Future of Digital Experiences`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "NUVOSID TECH",
    "web development",
    "web application development",
    "mobile app development",
    "UI/UX design",
    "AI automation",
    "cloud solutions",
    "Three.js",
    "Next.js",
  ],
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — We Build the Future of Digital Experiences`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — We Build the Future of Digital Experiences`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f0d" },
    { media: "(prefers-color-scheme: light)", color: "#f6f2e9" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SmoothScroll />
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <BackToTop />
        </AppProvider>
      </body>
    </html>
  );
}
