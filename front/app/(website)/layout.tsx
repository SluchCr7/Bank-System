import React from "react";
import Header from "@/Components/Header";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
