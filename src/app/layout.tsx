import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const openRunde = localFont({
  src: [
    { path: "../../public/fonts/OpenRunde-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/OpenRunde-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/OpenRunde-SemiBold.woff2", weight: "600" },
    { path: "../../public/fonts/OpenRunde-Bold.woff2", weight: "700" },
  ],
  variable: "--font-open-runde",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Isabelle Reksopuro",
  description: "Personal website of Isabelle Reksopuro",
  openGraph: {
    title: "Isabelle Reksopuro",
    description: "Personal website of Isabelle Reksopuro",
    images: [{ url: "/headshot.jpeg", width: 400, height: 400 }],
  },
  twitter: {
    card: "summary",
    title: "Isabelle Reksopuro",
    images: ["/headshot.jpeg"],
  },
  icons: {
    icon: "/headshot.jpeg",
    apple: "/headshot.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openRunde.variable} ${geistMono.variable} antialiased`}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
