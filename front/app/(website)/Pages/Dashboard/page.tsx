"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  TrendingUp,
  Clock,
  ChevronLeft,
  Landmark,
  CircleDollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowUpLeft,
  ArrowDownLeft,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { quickActions } from "@/app/Data/data";
import { messageState, QuickAction } from "@/app/Data/type";
import {
  useGetMeQuery,
  useGetMyCardQuery,
  useGetTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useTransferToCardMutation,
  useTransferToAccountMutation,
} from "@/app/redux/services/api";
import { useAppSelector } from "@/app/redux/hooks";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, router]);

  const { data: userProfile, isLoading: isUserLoading } = useGetMeQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const { data: cardData, isLoading: isCardLoading } = useGetMyCardQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const { data: transactions = [], isLoading: isTransLoading } =
    useGetTransactionsQuery(undefined, { skip: !isAuthenticated });

  const [depositApi, { isLoading: isDepositing }] = useDepositMutation();
  const [withdrawApi, { isLoading: isWithdrawing }] = useWithdrawMutation();
  const [transferToCardApi, { isLoading: isTransferringToCard }] =
    useTransferToCardMutation();
  const [transferToAccountApi, { isLoading: isTransferringToAccount }] =
    useTransferToAccountMutation();

  const [amount, setAmount] = useState<string>("");
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState<messageState | null>(null);

  const balance = userProfile?.balance ?? 0;
  const cardBalance = cardData?.balance ?? 0;
  const userName = userProfile?.name || "المستخدم";

  const isActionLoading =
    isDepositing ||
    isWithdrawing ||
    isTransferringToCard ||
    isTransferringToAccount;

  const handleAction = async (action: string) => {
    setMessage(null);
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setMessage({
        type: "error",
        text: "من فضلك أدخل مبلغًا صحيحًا أكبر من صفر.",
      });
      return;
    }

    if ((action === "withdraw" || action === "toCard") && value > balance) {
      setMessage({
        type: "error",
        text: "رصيد الحساب غير كافٍ لإتمام هذه العملية.",
      });
      return;
    }

    if (action === "toAccount" && value > cardBalance) {
      setMessage({
        type: "error",
        text: "رصيد البطاقة غير كافٍ لإتمام هذه العملية.",
      });
      return;
    }

    if ((action === "toCard" || action === "toAccount") && !cardData) {
      setMessage({
        type: "error",
        text: "لم يتم العثور على بطاقة بنكية. يرجى إنشاء بطاقة أولاً من صفحة بطاقتي.",
      });
      return;
    }

    try {
      if (action === "deposit") {
        await depositApi({ amount: value }).unwrap();
        setMessage({
          type: "success",
          text: `تم إيداع $${value.toLocaleString()} بنجاح في حسابك.`,
        });
      } else if (action === "withdraw") {
        await withdrawApi({ amount: value }).unwrap();
        setMessage({
          type: "success",
          text: `تم سحب $${value.toLocaleString()} بنجاح من حسابك.`,
        });
      } else if (action === "toCard") {
        await transferToCardApi({
          amount: value,
          cardId: cardData?._id,
        }).unwrap();
        setMessage({
          type: "success",
          text: `تم شحن البطاقة بمبلغ $${value.toLocaleString()} بنجاح.`,
        });
      } else if (action === "toAccount") {
        await transferToAccountApi({
          amount: value,
          cardId: cardData?._id,
        }).unwrap();
        setMessage({
          type: "success",
          text: `تم تحويل $${value.toLocaleString()} من البطاقة إلى الحساب بنجاح.`,
        });
      }

      setAmount("");
      setActiveAction(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.data?.message || err?.error || "فشل تنفيذ العملية، يرجى المحاولة لاحقاً.",
      });
    }
  };

  const openAction = (action: string) => {
    setMessage(null);
    setActiveAction(action);
    setAmount("");
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070B14] px-4 pb-12 pt-28 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0C1424] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-cyan-500/[0.12] blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-blue-600/[0.10] blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-medium text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                حسابك البنكي نشط ومتصل بالخادم
              </div>

              <div>
                <h1 className="text-3xl font-black leading-relaxed tracking-tight sm:text-4xl lg:text-5xl">
                  مرحبًا،{" "}
                  <span className="bg-gradient-to-l from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    {isUserLoading ? "..." : userName}
                  </span>
                  <span className="mr-2 inline-block">👋</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  أدر أموالك، تابع معاملاتك، وتحكم في حسابك البنكي بكل سهولة
                  وأمان مع بيانات محدثة لحظياً.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 sm:text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-cyan-400" />
                  حساب مصرفي موثق
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  لوحة التحكم المتزامنة
                </span>
              </div>
            </div>

            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center md:h-40 md:w-40">
              <div className="absolute inset-0 rounded-full border border-cyan-400/10" />
              <div className="absolute inset-3 rounded-full border border-cyan-400/20" />
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/10 blur-sm" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 shadow-2xl shadow-cyan-500/10 sm:h-24 sm:w-24">
                <Wallet size={40} strokeWidth={1.4} className="text-cyan-300" />
              </div>
              <div className="absolute right-1 top-5 h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              <div className="absolute bottom-4 left-1 h-2 w-2 rounded-full bg-blue-400" />
            </div>
          </div>
        </section>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Main Account Balance */}
          <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0D1525] p-6 transition duration-300 hover:border-cyan-400/30 sm:p-8">
            <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/[0.07] blur-[70px] transition group-hover:bg-cyan-400/[0.12]" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-300">
                  <Landmark size={23} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-300">
                    رصيد الحساب
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">الحساب الرئيسي</p>
                </div>
              </div>

              <button
                onClick={() => setShowBalance(!showBalance)}
                aria-label={showBalance ? "إخفاء الرصيد" : "إظهار الرصيد"}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="relative mt-8">
              <p className="text-xs text-slate-500">إجمالي الرصيد المتاح</p>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {showBalance ? (
                    isUserLoading ? (
                      <Loader2 className="inline animate-spin text-cyan-400" />
                    ) : (
                      money(balance)
                    )
                  ) : (
                    "••••••"
                  )}
                </span>
                <span className="text-sm font-semibold text-cyan-300">
                  USD $
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 rounded-lg bg-emerald-400/10 px-2.5 py-1.5 font-semibold text-emerald-400">
                  <TrendingUp size={14} />
                  مباشر من الخادم
                </span>
                رصيدك الفعلي في قاعدة البيانات
              </div>
            </div>
          </div>

          {/* Card Balance */}
          <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#10233C] via-[#101B31] to-[#0D1424] p-6 transition duration-300 hover:border-blue-400/30 sm:p-8">
            <div className="absolute -left-16 -top-24 h-60 w-60 rounded-full bg-blue-500/[0.12] blur-[80px]" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                  <CreditCard size={23} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-300">
                    رصيد البطاقة
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {cardData
                      ? `•••• ${cardData.cardNumber.slice(-4)}`
                      : "لا توجد بطاقة حالياً"}
                  </p>
                </div>
              </div>

              {cardData ? (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
                  نشطة
                </span>
              ) : (
                <Link
                  href="/Pages/Mycard"
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-400/20"
                >
                  + إنشاء بطاقة
                </Link>
              )}
            </div>

            <div className="relative mt-8">
              <p className="text-xs text-slate-500">الرصيد المتاح للإنفاق</p>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {showBalance ? (
                    isCardLoading ? (
                      <Loader2 className="inline animate-spin text-blue-400" />
                    ) : (
                      money(cardBalance)
                    )
                  ) : (
                    "••••••"
                  )}
                </span>
                <span className="text-sm font-semibold text-blue-300">
                  USD $
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {cardData ? "PFB Virtual Visa Card" : "قم بإنشاء بطاقتك الافتراضية"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Actions */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                الخدمات المالية الفورية
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                اختر العملية التي تريد تنفيذها ليتم حفظها مباشرة في قاعدة البيانات.
              </p>
            </div>

            <span className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              4 خدمات متصلة
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action: QuickAction) => {
              const Icon = action.icon;
              const colorStyles: Record<string, string> = {
                cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/10 group-hover:bg-cyan-400/20",
                blue: "bg-blue-400/10 text-blue-300 border-blue-400/10 group-hover:bg-blue-400/20",
                violet: "bg-violet-400/10 text-violet-300 border-violet-400/10 group-hover:bg-violet-400/20",
                emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/10 group-hover:bg-emerald-400/20",
              };

              return (
                <button
                  key={action.id}
                  onClick={() => openAction(action.id)}
                  className="group relative flex min-h-[170px] flex-col items-start overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0C1422] p-5 text-right transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-[#111D30] sm:p-6"
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition duration-300 ${colorStyles[action.color] || colorStyles.cyan}`}
                    >
                      <Icon size={23} />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] text-slate-500 transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                      <ChevronLeft size={18} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Amount & Transaction Form */}
        {activeAction && (
          <section
            id="transaction-form"
            className="scroll-mt-28 overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#0C1424] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-cyan-400">
                  إجراء مالي فوري
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-white">
                  {quickActions.find((a: QuickAction) => a.id === activeAction)?.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setActiveAction(null);
                  setMessage(null);
                }}
                className="rounded-xl border border-white/10 p-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="إغلاق"
              >
                <Plus className="rotate-45" size={20} />
              </button>
            </div>

            <form
              className="mt-7 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleAction(activeAction);
              }}
            >
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-slate-300"
              >
                المبلغ المراد تنفيذه (USD)
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-[#070B14] px-4 transition focus-within:border-cyan-400/50 focus-within:ring-4 focus-within:ring-cyan-400/[0.06]">
                <CircleDollarSign size={22} className="shrink-0 text-cyan-400" />
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMessage(null);
                  }}
                  placeholder="0.00"
                  className="w-full bg-transparent px-4 py-5 text-lg font-bold text-white outline-none placeholder:text-slate-600"
                />
                <span className="text-sm font-bold text-cyan-400">USD</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[50, 100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {message && (
                <div
                  role="alert"
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${
                    message.type === "error"
                      ? "border-red-400/20 bg-red-400/[0.06] text-red-300"
                      : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                  }`}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="mt-0.5 shrink-0" size={19} />
                  ) : (
                    <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                  )}
                  {message.text}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-cyan-400 to-blue-500 px-6 py-4 text-sm font-extrabold text-[#07111F] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? (
                    <Loader2 className="animate-spin text-[#07111F]" size={20} />
                  ) : (
                    <>
                      تأكيد العملية
                      <ArrowUpLeft size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setAmount("");
                    setMessage(null);
                  }}
                  className="rounded-2xl border border-white/10 px-8 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Live Recent Transactions */}
        <section className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0C1422]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                آخر المعاملات المسجلة
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                حركات الأموال المباشرة المسجلة في حسابك.
              </p>
            </div>

            <Link
              href="/Pages/Transactions"
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300"
            >
              عرض الكل ({transactions.length})
              <ChevronLeft size={16} />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {isTransLoading ? (
              <div className="p-8 text-center text-sm text-slate-400">
                <Loader2 className="mx-auto mb-2 animate-spin text-cyan-400" />
                جاري تحميل المعاملات...
              </div>
            ) : transactions.slice(0, 4).map((tx) => {
              const isDeposit =
                tx.type === "deposit" || tx.type === "deposit-card";
              const isTransfer = tx.type.includes("transfer");

              return (
                <div
                  key={tx._id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.02] sm:px-8"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isDeposit
                          ? "bg-emerald-400/10 text-emerald-400"
                          : isTransfer
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-violet-400/10 text-violet-400"
                      }`}
                    >
                      {isDeposit ? (
                        <ArrowDownLeft size={22} />
                      ) : isTransfer ? (
                        <ArrowLeftRight size={22} />
                      ) : (
                        <CreditCard size={22} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white">
                        {tx.description ||
                          (isDeposit
                            ? "إيداع مالي"
                            : isTransfer
                            ? "تحويل مالي"
                            : "عملية مصرفية")}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(tx.createdAt || tx.date).toLocaleString("ar-EG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <p
                      dir="ltr"
                      className={`text-sm font-extrabold ${
                        isDeposit ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {isDeposit ? "+" : "-"} ${money(tx.amount)}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 size={12} />
                      مكتملة
                    </span>
                  </div>
                </div>
              );
            })}

            {!isTransLoading && transactions.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                لا توجد معاملات مسجلة بعد. يمكنك إجراء أول عملية إيداع أعلاه.
              </div>
            )}
          </div>
        </section>

        {/* Security Footer */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-5 text-center sm:flex-row">
          <ShieldCheck size={20} className="text-cyan-400" />
          <p className="text-xs leading-6 text-slate-400">
            PFB Banking — جميع المعاملات مشفرة وتتم مزامنتها بصورة ديناميكية
            بين الواجهة والخادم.
          </p>
        </div>
      </div>
    </main>
  );
}