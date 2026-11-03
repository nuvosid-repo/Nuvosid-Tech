import { notFound } from "next/navigation";
import PlaceholderPage from "@/components/common/PlaceholderPage/PlaceholderPage";

// Inner pages are intentionally NOT built yet (homepage-only phase).
// These routes exist so every link resolves to a clearly-labelled placeholder.
const PAGES = {
  careers: { title: "Careers", eyebrow: "Join the team" },
  services: { title: "Services", eyebrow: "What we do" },
  products: { title: "Products", eyebrow: "What we build" },
  "our-work": { title: "Our Work", eyebrow: "Case studies" },
  "privacy-policy": { title: "Privacy Policy", eyebrow: "Legal" },
  "terms-and-conditions": { title: "Terms & Conditions", eyebrow: "Legal" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  return page ? { title: page.title, robots: { index: false } } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <PlaceholderPage title={page.title} eyebrow={page.eyebrow} />;
}
