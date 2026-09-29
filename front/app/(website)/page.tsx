"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import IntroPage from "@/Components/IntroPage";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.replace("/Pages/Dashboard");
    }
  }, [isAuthenticated, router]);

  // If already authenticated and mounted, show a brief loading state while redirecting to dashboard
  if (mounted && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-slate-400 text-sm font-medium">جاري نقلك إلى لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // When not signed in: show the professional, realistic intro page
  return <IntroPage />;
}
