import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export default function PageShell({ eyebrow, title, description, children }: Props) {
  return (
    <section className="bg-white px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-strong">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>
        {children}
      </div>
    </section>
  );
}
