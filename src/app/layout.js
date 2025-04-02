import { Inter, Raleway } from "next/font/google";
import Script from "next/script";
import "~/assets/css/bootstrap.min.css";
import "~/assets/css/app.css";
import "~/assets/css/main.css";
import "~/assets/css/react-adjustment.css";
import { Analytics } from "@vercel/analytics/react";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata = {
  title: "DTwin | AI-Powered Preventive Healthcare",
  description:
    "DTwin is an AI-driven digital twin for preventive healthcare, helping users predict, prevent, and manage chronic diseases with personalized health insights.",
  keywords: [
    "AI healthcare",
    "digital twin",
    "preventive healthcare",
    "disease prediction",
    "health tracking",
    "fitness AI",
    "wearable device integration",
  ],
  author: "EvenBetter",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/favicon.ico?v=4"],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: "https://dtwin.evenbetter.in",
    title: "DTwin | AI-Powered Preventive Healthcare",
    description:
      "Predict, prevent, and manage chronic diseases with AI-driven health analytics and personalized recommendations.",
    images: [
      {
        url: "https://dtwin.evenbetter.in/images/di-twin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "DTwin Health Tracking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://dtwin.evenbetter.in",
    title: "DTwin | AI-Powered Preventive Healthcare",
    description:
      "AI-powered health tracking, disease prediction, and personalized fitness insights.",
    image: "https://dtwin.evenbetter.in/images/di-twin-preview.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="Kf5YIWNGE1jVL_tqXnu6ph6_ZaH2JKhDsuGJrexH0Yw"
        />

        {/* Google Analytics - gtag.js */}
        <Script
          strategy="beforeInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y6HG4SG2CH"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y6HG4SG2CH');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${raleway.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
