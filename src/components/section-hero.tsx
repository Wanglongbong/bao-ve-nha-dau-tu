import React, { ReactNode } from 'react';

interface SectionHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function SectionHero({ eyebrow, title, description, children }: SectionHeroProps) {
  return (
    <section className="section-hero" aria-label={title}>
      <div className="site-shell section-hero-inner">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children && <div className="section-hero-aside">{children}</div>}
      </div>
    </section>
  );
}
