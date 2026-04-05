import type { ReactNode } from "react";
import { ContentCarousel } from "@/components/netflix/content-carousel";

interface ContentRowProps {
  title: string;
  children: ReactNode;
  isEmpty?: boolean;
}

export function ContentRow({ title, children, isEmpty }: ContentRowProps) {
  return (
    <section className="py-sm">
      <h2 className="text-[20px] sm:text-[24px] font-bold tracking-[0.05em] text-text mb-md px-[4vw]">
        {title}
      </h2>
      {isEmpty ? (
        <div className="px-[4vw] py-xl text-center">
          <p className="text-[length:var(--font-size-heading)] font-bold text-text">
            Nothing here yet
          </p>
          <p className="mt-sm text-[length:var(--font-size-body)] text-text-muted">
            Content is being added. Check back soon.
          </p>
        </div>
      ) : (
        <div className="px-[4vw]">
          <ContentCarousel>{children}</ContentCarousel>
        </div>
      )}
    </section>
  );
}
