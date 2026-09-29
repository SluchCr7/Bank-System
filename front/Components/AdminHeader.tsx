"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  ArrowUpLeft,
  ShieldCheck,
  Server,
  LogOut,
  UserCheck,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout } from "@/app/redux/slices/authSlice";

interface AdminHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  onRefresh,
  isRefreshing = false,
  searchQuery = "",
  setSearchQuery,
  onToggleSidebar,
  title = "لوحة الإدارة المركزية",
  subtitle = "إدارة المستخدمين والبطاقات والعمليات المصرفية في الوقت الفعلي",
}: AdminHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/Pages/Auth");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070B14]/90 backdrop-blur-xl px-4 py-3.5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Title & Mobile Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
                aria-label="القائمة الجانبية"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {title}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  النظام متصل
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Quick Back for Mobile */}
          <Link
            href="/Pages/Dashboard"
            className="md:hidden flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300"
          >
            <span>التطبيق</span>
            <ArrowUpLeft size={14} />
          </Link>
        </div>

        {/* Controls, Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Box */}
          {setSearchQuery && (
            <div className="relative flex-1 md:w-64 lg:w-72">
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالمستخدم، البطاقة، البريد..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pr-9 pl-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition"
              />
            </div>
          )}

          {/* Refresh Data Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="تحديث البيانات"
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 transition disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={`${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
              />
            </button>
          )}

          {/* Return to Banking App */}
          <Link
            href="/Pages/Dashboard"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400/40 transition"
          >
            <span>الواجهة المصرفية</span>
            <ArrowUpLeft size={14} />
          </Link>

          {/* Admin User Badge / Profile */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-xs font-bold text-white max-w-[110px] truncate">
                {user?.name || "المسؤول"}
              </span>
              <span className="text-[10px] text-purple-400 font-semibold">
                مدير النظام الأعلى
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
