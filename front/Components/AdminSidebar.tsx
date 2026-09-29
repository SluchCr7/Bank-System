"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ArrowUpLeft,
  X,
  Database,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminTab = "overview" | "users" | "cards" | "transactions" | "system";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    users: number;
    cards: number;
    transactions: number;
  };
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  counts = { users: 0, cards: 0, transactions: 0 },
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "نظرة عامة والتحليلات",
      icon: LayoutDashboard,
      badge: null,
      description: "المؤشرات الحية وحركة الأموال",
    },
    {
      id: "users" as AdminTab,
      label: "إدارة المستخدمين",
      icon: Users,
      badge: counts.users > 0 ? counts.users.toString() : null,
      description: "الحسابات، الأرصدة، والتفاصيل",
    },
    {
      id: "cards" as AdminTab,
      label: "البطاقات البنكية",
      icon: CreditCard,
      badge: counts.cards > 0 ? counts.cards.toString() : null,
      description: "البطاقات المصدرة وأرصدتها",
    },
    {
      id: "transactions" as AdminTab,
      label: "سجل المعاملات",
      icon: ArrowLeftRight,
      badge: counts.transactions > 0 ? counts.transactions.toString() : null,
      description: "الإيداعات، السحوبات، والتحويلات",
    },
    {
      id: "system" as AdminTab,
      label: "أمان وصحة النظام",
      icon: ShieldCheck,
      badge: "آمن",
      description: "حالة السيرفر وقاعدة البيانات",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-white/[0.08] bg-[#060A14] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-6">
          <Link href="/Admin" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#070B14]">
                <ShieldCheck size={20} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">
                  PFB
                </span>
                <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-black text-purple-300">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                بوابة الإدارة المركزية
              </p>
            </div>
          </Link>

          {/* Close for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            أقسام الإدارة
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right transition duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-transparent text-white border border-purple-500/30 shadow-lg shadow-purple-900/10"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/30"
                        : "bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive
                        ? "bg-purple-500/30 text-purple-200 border border-purple-500/40"
                        : "bg-white/[0.07] text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            روابط سريعة
          </div>

          <Link
            href="/Pages/Dashboard"
            className="group flex items-center justify-between rounded-2xl px-4 py-3 text-right text-slate-400 hover:bg-white/[0.04] hover:text-cyan-300 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 group-hover:scale-105 transition">
                <ArrowUpLeft size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-300">
                  لوحة المستخدم المصرفي
                </div>
                <div className="text-[11px] text-slate-500">
                  معاينة الخدمات من منظور العميل
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer / System Status */}
        <div className="border-t border-white/[0.08] p-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Database size={13} className="text-emerald-400" />
                MongoDB Atlas
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">متصل</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Lock size={13} className="text-purple-400" />
                تشفير JWT 256-bit
              </span>
              <span className="text-[11px] text-purple-400 font-bold">نشط</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
              <span>PFB Banking v2.4</span>
              <span className="font-mono">Cluster-01</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
