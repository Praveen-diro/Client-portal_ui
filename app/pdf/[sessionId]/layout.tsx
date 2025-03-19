import { Providers } from "@/app/providers";

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">{children}</div>
    </Providers>
  );
}
