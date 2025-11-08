import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Chatrix - Transform Your Data Into Beautiful Charts",
    template: "%s | Chatrix"
  },
  description: "Simply drag and drop your CSV or Excel files to get started. Our platform handles the rest. Create stunning visualizations in seconds.",
  keywords: ["data visualization", "charts", "CSV", "Excel", "analytics", "dashboard", "data analysis", "AI charts"],
  authors: [
    { 
      name: "Tejas", 
      url: "https://github.com/Tejas252" 
    }
  ],
  creator: "Tejas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Chatrix - Transform Your Data Into Beautiful Charts",
    description: "Simply drag and drop your CSV or Excel files to get started. Our platform handles the rest. Create stunning visualizations in seconds.",
    siteName: "Chatrix",
    images: [
      {
        url: `${defaultUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "Chatrix - Transform Your Data Into Beautiful Charts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatrix - Transform Your Data Into Beautiful Charts",
    description: "Simply drag and drop your CSV or Excel files to get started. Our platform handles the rest. Create stunning visualizations in seconds.",
    images: [`${defaultUrl}/og.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${defaultUrl}/site.webmanifest`,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
