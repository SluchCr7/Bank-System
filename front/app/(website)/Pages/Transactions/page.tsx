"use client";

import React from "react";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowLeftRight,
  CreditCard,
  Clock,
  ReceiptText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useGetTransactionsQuery } from "@/app/redux/services/api";
import { useAppSelector } from "@/app/redux/hooks";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const Page = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: transactions = [], isLoading } = useGetTransactionsQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const getTransactionInfo = (type: string, amount: number) => {
    const isIncome =
      type === "deposit" ||
      type === "deposit-card" ||
      type === "deposite-card" ||
      type === "receive";

    let label = "عملية مصرفية";
    let Icon = CreditCard;
    let colorClass = "bg-violet-400/10 text-violet-400 border-violet-400/10";

    if (type.includes("deposit")) {
      label = "إيداع في الحساب";
      Icon = ArrowDownLeft;
      colorClass = "bg-emerald-400/10 text-emerald-400 border-emerald-400/10";
    } else if (type.includes("withdraw")) {
      label = "سحب من الرصيد";
      Icon = ArrowUpLeft;
      colorClass = "bg-orange-400/10 text-orange-400 border-orange-400/10";
    } else if (type === "transfer-to-card") {
      label = "شحن البطاقة البنكية";
      Icon = CreditCard;
      colorClass = "bg-cyan-400/10 text-cyan-400 border-cyan-400/10";
    } else if (type === "transfer-to-account") {
      label = "تحويل إلى الحساب";
      Icon = ArrowLeftRight;
      colorClass = "bg-blue-400/10 text-blue-400 border-blue-400/10";
    } else if (type === "transfer") {
      label = "تحويل مالي صادر";
      Icon = ArrowLeftRight;
      colorClass = "bg-blue-400/10 text-blue-400 border-blue-400/10";
    }

    return { label, Icon, colorClass, isIncome };
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070B14] px-4 pb-12 pt-28 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0C1424] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <ReceiptText size={24} />
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">سجل المعاملات</h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
                تابع جميع معاملاتك المالية وحركات الرصيد المسجلة في حسابك مباشرة
                من الخادم.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 sm:self-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <Clock size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">إجمالي المعاملات</p>
                <p className="mt-1 text-xl font-black text-white">
                  {transactions.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions List */}
        <section className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0C1422]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-6 sm:px-8">
            <div>
              <h2 className="text-lg font-extrabold">جميع العمليات</h2>
              <p className="mt-2 text-xs text-slate-500">
                تفاصيل الحركات المالية المباشرة
              </p>
            </div>

            <span className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] px-4 py-2 text-xs font-semibold text-cyan-300">
              {transactions.length} معاملة مسجلة
            </span>
          </div>

          {/* List Header - Desktop */}
          <div className="hidden grid-cols-12 gap-4 bg-white/[0.02] px-8 py-4 text-xs font-semibold text-slate-500 md:grid">
            <div className="col-span-5">تفاصيل المعاملة</div>
            <div className="col-span-2">النوع</div>
            <div className="col-span-2">الحالة</div>
            <div className="col-span-3 text-left">المبلغ</div>
          </div>

          {/* Transactions */}
          <div className="divide-y divide-white/[0.05]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="mb-3 animate-spin text-cyan-400" size={32} />
                <p className="text-sm">جاري تحميل سجل المعاملات...</p>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                const { label, Icon, colorClass, isIncome } = getTransactionInfo(
                  tx.type,
                  tx.amount
                );

                const formattedDate = new Date(
                  tx.createdAt || tx.date
                ).toLocaleString("ar-EG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={tx._id}
                    className="group px-5 py-5 transition duration-300 hover:bg-white/[0.025] sm:px-8 sm:py-6"
                  >
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 md:gap-4">
                      {/* Transaction Info */}
                      <div className="flex min-w-0 items-center gap-4 md:col-span-5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition duration-300 group-hover:scale-105 ${colorClass}`}
                        >
                          <Icon size={22} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-white sm:text-base">
                            {tx.description || label}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Details */}
                      <div className="flex items-center justify-between gap-3 md:hidden">
                        <span className="text-xs text-slate-400">{label}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 size={13} />
                          مكتملة
                        </span>
                      </div>

                      {/* Transaction Type */}
                      <div className="hidden md:col-span-2 md:block">
                        <span className="inline-flex rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300">
                          {label}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="hidden md:col-span-2 md:block">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          مكتملة
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 md:col-span-3 md:justify-end md:border-0 md:pt-0">
                        <span className="text-xs text-slate-500 md:hidden">
                          المبلغ
                        </span>

                        <div className="text-left">
                          <p
                            dir="ltr"
                            className={`text-base font-black tracking-tight sm:text-lg ${
                              isIncome ? "text-emerald-400" : "text-white"
                            }`}
                          >
                            {isIncome ? "+" : "-"} ${money(tx.amount)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            USD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-400">
                  <ReceiptText size={30} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">
                  لا توجد معاملات حتى الآن
                </h3>
                <p className="mt-3 text-sm text-slate-500">
                  ستظهر معاملاتك المصرفية هنا بمجرد تنفيذ أول عملية من لوحة
                  التحكم.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 py-3 text-center text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          يتم جلب جميع المعاملات من قاعدة البيانات بصورة ديناميكية ومباشرة.
        </div>
      </div>
    </main>
  );
};

export default Page;