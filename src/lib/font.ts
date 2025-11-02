import { Poppins, Playfair_Display } from "next/font/google";


export const poppins = Poppins({
  variable: "--font-theme-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const playfairDisplay = Playfair_Display({
  variable: "--font-theme-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});