import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Job Tracker — Stay on top of every opportunity",
  description:
    "Track your job applications through every stage of the hiring process.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1e3a5f",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 16px",
            },
            success: { iconTheme: { primary: "#34d399", secondary: "#fff" } },
            error: { iconTheme: { primary: "#f87171", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
