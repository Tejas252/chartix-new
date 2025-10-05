import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
