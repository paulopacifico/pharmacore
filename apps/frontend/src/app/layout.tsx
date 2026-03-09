import { Sora, Manrope } from "next/font/google";
import { Toaster } from "@pharmacore/shared-web";
import "./globals.css";
import Providers from "./providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`h-full ${sora.variable} ${manrope.variable}`}
    >
      <body className="antialiased h-full font-body">
        <Toaster richColors />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
