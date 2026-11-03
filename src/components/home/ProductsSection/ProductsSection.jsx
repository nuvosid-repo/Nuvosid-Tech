import { products } from "@/data/products";
import { cx } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/animations/FadeIn";
import Parallax from "@/components/animations/Parallax";
import SmartLink from "@/components/ui/SmartLink";
import Icon from "@/components/ui/Icon";
import { ProductMockup } from "@/components/ui/Mockups";
import "./ProductsSection.scss";

export default function ProductsSection() {
  return (
    <section id="products" className="products section" aria-labelledby="products-title">
      <div className="container">
        <div className="row g-4 align-items-end">
          <div className="col-lg-8">
            <SectionHeading
              id="products-title"
              eyebrow="Proprietary Platforms"
              size="md"
              segments={[{ text: "Innovation built" }, { text: "into products.", highlight: true }]}
            />
          </div>
          <div className="col-lg-4">
            <FadeIn as="p" className="lead-c">
              In-house platforms we are building to give our clients a head start — modular, secure and ready to
              extend.
            </FadeIn>
          </div>
        </div>

        <FadeIn className="products__grid" stagger={0.12}>
          {products.map((p, i) => (
            <article key={p.id} className={cx("products__card surface surface--hover", `is-${p.tone}`, i === 1 && "is-raised")}>
              <Parallax speed={i === 1 ? 0.25 : 0.12} className="products__visual">
                <ProductMockup variant={p.mockup} />
              </Parallax>

              <div className="products__head">
                <span className={cx("tag", p.tone === "lime" && "tag--lime")}>{p.badge}</span>
                <span className="products__icon">
                  <Icon name={p.icon} />
                </span>
              </div>
              <h3 className="products__name">{p.name}</h3>
              <p className="products__desc">{p.description}</p>

              <dl className="products__specs">
                {p.specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <SmartLink href="/products" className="link-arrow products__link" aria-label={`Explore product: ${p.name}`}>
                Explore Product <Icon name="arrow-right" />
              </SmartLink>
            </article>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
