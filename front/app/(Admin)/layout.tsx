import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFB Central Admin | لوحة الإدارة العليا",
  description: "لوحة التحكم والإدارة المصرفية العليا لبنك PFB الرقمي",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col">
      {children}
    </div>
  );
}
