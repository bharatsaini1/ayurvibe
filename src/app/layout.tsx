import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AyurVibe - Gen-Z Ayurvedic Nutrition & Cloud Practice Suite',
  description:
    'Gen-Z Cloud-Based Practice Management & Nutrient Analysis Software for Ayurvedic Dietitians, Tailored for Ayurveda-Focused Diet Plans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-800">
        {children}
      </body>
    </html>
  );
}

