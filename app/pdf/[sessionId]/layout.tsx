import { Providers } from "@/app/providers";

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="">{children}</div>
    </Providers>
  );
}
