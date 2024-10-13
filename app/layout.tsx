import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from 'react';
import Script from 'next/script';
import Footer from './components/Footer'
import { GoogleAnalytics } from "@next/third-parties/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ER Diagram Generator",
  description: "Generate ER diagrams from MySQL CREATE TABLE statements. Easy-to-use tool for database designers and developers.",
  keywords: "ER diagram, entity relationship, database design, MySQL, SQL parser",
  authors: [{name: "codeugar"}],
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: "ER Diagram Generator",
    description: "Create Entity Relationship Diagrams from MySQL statements",
    type: "website",
    url: "https://sql-er-generator.com",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="schema-org" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ER Diagram Generator",
            "description": "Generate ER diagrams from MySQL CREATE TABLE statements. Easy-to-use tool for database designers and developers.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          })}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="GT-PZX7NZQC"/>
    </html>
  );
}
