import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-[73px]">{children}</main>
      <Footer />
    </div>
  );
}
