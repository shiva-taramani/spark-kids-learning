import './globals.css';
import type { Metadata } from 'next';
import { Fredoka, Quicksand } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'] });
const quicksand = Quicksand({ subsets: ['latin'], weight: ['600', '700'] });

export const metadata: Metadata = {
  title: 'Dino Rescue Clinic - Adaptive Educational Game',
  description: 'An Apple-simple, minimalist visual math and phonics game for young kids.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} min-h-screen flex flex-col items-center p-5`}>
        {children}
      </body>
    </html>
  );
}
