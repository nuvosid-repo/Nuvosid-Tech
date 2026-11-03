import Button from "@/components/ui/Button";
import "./PlaceholderPage.scss";

/** Clearly-labelled placeholder for inner pages not yet in scope. */
export default function PlaceholderPage({ title, eyebrow }) {
  return (
    <section className="placeholder-page">
      <div className="container">
        <p className="eyebrow eyebrow--pill">{eyebrow}</p>
        <h1 className="display-lg mt-4">{title}</h1>
        <p className="lead-c mt-4">
          This page is planned and will be designed and developed in the next phase, after the homepage is approved.
        </p>
        <div className="d-flex flex-wrap gap-3 mt-5">
          <Button href="/" icon="arrow-left" magnetic={false}>
            Back to Home
          </Button>
          <Button href="/#contact" variant="ghost" magnetic={false}>
            Let&apos;s Talk
          </Button>
        </div>
      </div>
    </section>
  );
}
