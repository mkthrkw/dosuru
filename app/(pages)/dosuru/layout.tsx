import { Aside } from "@/app/_components/layouts/Aside";
import { Footer } from "@/app/_components/layouts/Footer";
import { Header } from "@/app/_components/layouts/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const drawerId = "layout-drawer";
  return (
    <div className="text-base-content">
      <div className="drawer lg:drawer-open">
        <input id={drawerId} type="checkbox" className="drawer-toggle" />
        {/* ===== Drawer content ===== */}
        <div className="drawer-content flex flex-col min-h-screen bg-base-100">
          <Header drawerId={drawerId} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        {/* ===== Drawer side ===== */}
        <div className="drawer-side z-10">
          <label htmlFor={drawerId} aria-label="close sidebar" className="drawer-overlay" />
          <Aside />
        </div>
      </div>
    </div>
  );
}