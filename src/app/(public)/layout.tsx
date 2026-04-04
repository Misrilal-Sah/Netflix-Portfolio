import { NetflixHeader } from "@/components/netflix/netflix-header";
import { NetflixFooter } from "@/components/netflix/netflix-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NetflixHeader />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <NetflixFooter />
    </>
  );
}
