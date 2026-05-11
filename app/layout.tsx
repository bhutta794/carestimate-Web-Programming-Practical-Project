import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "CarEstimate",
  description: "Car Price Estimator Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f9f9ff] m-0 p-0">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}