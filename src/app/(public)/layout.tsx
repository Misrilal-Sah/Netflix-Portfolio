import { NetflixHeader } from "@/components/netflix/netflix-header";
import { NetflixFooter } from "@/components/netflix/netflix-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-bold"
      >
        Skip to main content
      </a>
      <NetflixHeader />
      <main id="main-content" className="min-h-screen pb-14 md:pb-0">
        {children}
      </main>
      <NetflixFooter />
    </>
  );
}
