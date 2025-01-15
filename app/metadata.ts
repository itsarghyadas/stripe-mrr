import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "Stripe",
    "MRR",
    "Stripe MRR",
    "Stripe MRR Calculator",
    "Freelancer",
    "Income",
    "Monthly Recurring Revenue",
    "Money",
    "UI/UX",
    "Developer",
  ],
  authors: [
    {
      name: "Arghya",
      url: "https://www.itsarghyadas.dev",
    },
  ],
  creator: "itsarghyadas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@itsarghyadas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
