import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { SocketProvider } from '../../contexts/SocketContext';
import GlobalNotifications from '../../components/GlobalNotifications';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketPredictor - AI-Powered Stock & Crypto Predictions",
  description: "Predict market trends with AI-powered precision. Advanced machine learning for stock and cryptocurrency market forecasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased transition-colors duration-300`}
      >
        <SocketProvider>
          <ThemeProvider>
            <AuthProvider>
              <GlobalNotifications />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
