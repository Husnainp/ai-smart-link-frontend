
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import StyledComponentsRegistry from "../components/StyledComponentsRegistry";
import { Toaster } from "react-hot-toast"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Link Website",
  description: "A curated directory of useful websites with AI-generated descriptions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <ReduxProvider>{children}</ReduxProvider>
        </StyledComponentsRegistry>
          <Toaster />
      </body>
    </html>
  );
}
