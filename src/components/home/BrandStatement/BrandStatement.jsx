import RevealText from "@/components/animations/RevealText";
import FadeIn from "@/components/animations/FadeIn";
import Icon from "@/components/ui/Icon";
import "./BrandStatement.scss";

const STATEMENT = [
  { text: "We don't just build", break: true },
  { text: "software.", break: true },
  { text: "We build what's next.", highlight: true },
];

export default function BrandStatement() {
  return (
    <section className="brand-statement section" aria-labelledby="brand-statement-title">
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-8">
            <RevealText
              id="brand-statement-title"
              segments={STATEMENT}
              scrub
              stagger={0.12}
              className="display-lg brand-statement__title"
            />
          </div>
          <div className="col-lg-4">
            <FadeIn className="brand-statement__aside" delay={0.2}>
              <p className="lead-c">
                NUVOSID TECH works at the intersection of strategy, design and engineering — crafting intelligent
                digital platforms that help ambitious brands move faster, scale with confidence and delight their
                customers.
              </p>
              <p className="brand-statement__signature">
                <span className="brand-statement__icon">
                  <Icon name="sparkles" />
                </span>
                <span className="mono">Strategy · Design · Engineering</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
