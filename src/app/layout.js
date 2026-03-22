import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Poppins, Pacifico } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const metadata = {
  title: "Glow Up Tracker App",
  description: "Glow Up Tracker app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${poppins.variable}
          ${pacifico.variable}
          antialiased
          bg-[#f7efe7]
          dark:bg-black
          dark:text-white
        `}
      >
        {children}
      </body>
    </html>
  );
}