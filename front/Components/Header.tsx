"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  Headset,
  ArrowUpLeft,
  LogOut,
  Bell,
  User,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/app/Data/data";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout } from "@/app/redux/slices/authSlice";
import { useGetNotificationsQuery, useGetMeQuery } from "@/app/redux/services/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = profile?.name || authUser?.name || "المستخدم";
  const isAdmin = Boolean(profile?.isAdmin ?? authUser?.isAdmin);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/Pages/Auth");
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Main Navbar */}
        <nav className="relative flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#080F1C]/95 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-7">
          {/* Logo */}
          <Link href="/Pages/Dashboard" className="group flex shrink-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:rotate-6">
              <span className="text-lg font-black tracking-tighter text-[#080F1C]">
                PFB
              </span>
              <div className="absolute -bottom-3 -left-3 h-7 w-7 rounded-full bg-white/30 blur-md" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">
                PFB
                <span className="text-cyan-400">.</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-400">
                بنك المستقبل الرقمي
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1.5 lg:flex">
            {navLinks.map((link: { name: string; href: string }) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-cyan-400 text-[#080F1C] font-bold shadow-md shadow-cyan-400/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/Admin"
                className={`group relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  pathname.startsWith("/Admin")
                    ? "bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20"
                    : "text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-200"
                }`}
              >
                <LayoutDashboard size={15} />
                <span>لوحة التحكم</span>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                href="/Pages/Notifications"
                className={`group relative rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                  pathname === "/Pages/Notifications"
                    ? "bg-cyan-400 text-[#080F1C] font-bold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                title="الإشعارات"
              >
                <div className="relative flex items-center">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-[#080F1C]">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/Pages/Profile"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                >
                  <User size={16} className="text-cyan-400" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                  title="تسجيل الخروج"
                >
                  <LogOut size={16} />
                  خروج
                </button>
              </div>
            ) : (
              <Link
                href="/Pages/Auth"
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#080F1C] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
              >
                <ShieldCheck size={18} />
                دخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`grid transition-all duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-[24px] border border-white/10 bg-[#080F1C]/[0.98] p-4 shadow-2xl backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-sm font-bold text-white">
                    {isAuthenticated ? `أهلاً بك، ${displayName}` : "أهلاً بك في PFB"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    خدماتك المصرفية الرقمية المتطورة
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Headset size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link: { name: string; href: string }) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                      pathname === link.href
                        ? "bg-cyan-400 text-[#080F1C] font-bold"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                    <ArrowUpLeft size={16} className="opacity-50" />
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    href="/Admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                      pathname.startsWith("/Admin")
                        ? "bg-purple-500 text-white font-bold"
                        : "text-purple-300 hover:bg-purple-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard size={16} />
                      <span>لوحة التحكم (Admin)</span>
                    </div>
                    <ArrowUpLeft size={16} className="opacity-50" />
                  </Link>
                )}

                {isAuthenticated && (
                  <Link
                    href="/Pages/Notifications"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                      pathname === "/Pages/Notifications"
                        ? "bg-cyan-400 text-[#080F1C] font-bold"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <span>الإشعارات</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-[#080F1C]">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              <div className="mt-4 border-t border-white/[0.08] pt-4">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    <LogOut size={17} />
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link
                    href="/Pages/Auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#080F1C] shadow-lg transition hover:bg-cyan-300"
                  >
                    <ShieldCheck size={17} />
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;