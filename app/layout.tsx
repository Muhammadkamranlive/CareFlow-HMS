import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ProductBrandProvider } from "@/components/common/use-product-brand";
import { AppNavigation } from "@/components/navigation/app-navigation";
import { readProductBrandFile } from "@/lib/product/product-file";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mkt"
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await readProductBrandFile();
  const full = `${brand.productName} ${brand.productTagline}`.trim();
  return {
    title: {
      default: full,
      template: `%s | ${brand.productName}`
    },
    description:
      "CareFlow Hospital Management — patients, OPD/IPD, EMR, pharmacy marketplace, lab, radiology, billing, telemedicine, and HIPAA-style compliance in one clinical workspace.",
    applicationName: full,
    icons: {
      icon: "/icon.svg"
    },
    appleWebApp: {
      capable: true,
      title: full,
      statusBarStyle: "default"
    },
    formatDetection: {
      telephone: false
    }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1877f2"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brand = await readProductBrandFile();
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ProductBrandProvider initial={brand}>
          <AppNavigation>{children}</AppNavigation>
        </ProductBrandProvider>
      </body>
    </html>
  );
}
