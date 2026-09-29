"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wifi,
  LockKeyhole,
  Copy,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetMyCardQuery,
  useCreateCardMutation,
  useGetMeQuery,
} from "@/app/redux/services/api";
import { useAppSelector } from "@/app/redux/hooks";

export default function MyCardPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    data: card,
    isLoading: isCardLoading,
    refetch,
    isFetching,
  } = useGetMyCardQuery(undefined, { skip: !isAuthenticated });

  const { data: userProfile } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createCardApi, { isLoading: isCreatingCard }] =
    useCreateCardMutation();

  const [flipped, setFlipped] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const userName = userProfile?.name || "PFB MEMBER";

  const formatCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    const s = String(cardNumber).replace(/\D/g, "");
    return s.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCreateCard = async () => {
    try {
      await createCardApi().unwrap();
      setFlipped(false);
      setMsg("تم إنشاء بطاقتك الافتراضية بنجاح وحفظها في قاعدة البيانات.");
    } catch (err: any) {
      setMsg(
        err?.data?.message || err?.error || "فشل إنشاء البطاقة أو لديك بطاقة بالفعل."
      );
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      setMsg("تم تحديث بيانات البطاقة من الخادم بنجاح.");
    } catch {
      setMsg("تعذر تحديث بيانات البطاقة.");
    }
  };

  const copyCardNumber = async () => {
    if (!card) {
      setMsg("أنشئ البطاقة أولاً.");
      return;
    }

    try {
      await navigator.clipboard.writeText(formatCardNumber(card.cardNumber));
      setCopied(true);
      setMsg("تم نسخ رقم البطاقة بنجاح.");
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMsg("تعذر نسخ رقم البطاقة.");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#070B14] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-cyan-400">
              <CreditCard size={20} />
              <span className="text-sm font-semibold tracking-wide">
                PFB DIGITAL BANKING
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              بطاقتي الافتراضية
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              تحكم في بطاقتك الرقمية، واستعرض بياناتها الحية ورصيدها المتزامن مع
              الخادم بأمان.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
            >
              <RefreshCw
                size={17}
                className={isFetching ? "animate-spin text-cyan-400" : ""}
              />
              تحديث
            </button>

            {!card && (
              <button
                type="button"
                onClick={handleCreateCard}
                disabled={isCreatingCard}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#070B14] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {isCreatingCard ? (
                  <Loader2 size={18} className="animate-spin text-[#070B14]" />
                ) : (
                  <>
                    <Plus size={18} />
                    إنشاء بطاقة الآن
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
          {/* Card Section */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/[0.07] bg-[#0C1422] p-4 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">تفاصيل البطاقة</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    اضغط على البطاقة للتبديل بين الوجه الأمامي والخلفي
                  </p>
                </div>

                <span
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    card
                      ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
                      : "border-yellow-400/10 bg-yellow-400/10 text-yellow-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      card ? "bg-emerald-400" : "bg-yellow-400"
                    }`}
                  />
                  {card ? "نشطة ومربوطة" : "غير منشأة"}
                </span>
              </div>

              {/* 3D Card */}
              <div
                className="relative mx-auto w-full max-w-[470px]"
                style={{ perspective: "1200px" }}
              >
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onClick={() => setFlipped((prev) => !prev)}
                  style={{
                    transformStyle: "preserve-3d",
                    position: "relative",
                    aspectRatio: "1.586 / 1",
                  }}
                  className="w-full cursor-pointer select-none"
                >
                  {/* FRONT */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#101D3B] via-[#123B61] to-[#087F8C] p-5 shadow-2xl shadow-cyan-950/30 sm:rounded-3xl sm:p-7"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

                    {/* Card Top */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="text-xl font-black tracking-[0.15em] sm:text-2xl">
                          PFB
                        </div>
                        <div className="mt-1 text-[9px] font-medium tracking-[0.25em] text-cyan-100/60 sm:text-[10px]">
                          PREMIUM BANKING
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                        <Wifi size={17} className="rotate-90 text-cyan-200" />
                        <span className="text-[10px] font-semibold tracking-wider text-white/80">
                          VISA
                        </span>
                      </div>
                    </div>

                    {/* Chip */}
                    <div className="relative z-10 mt-5 flex items-center sm:mt-7">
                      <div className="relative h-8 w-11 overflow-hidden rounded-md border border-white/20 bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 sm:h-10 sm:w-14">
                        <div className="absolute left-1/3 top-0 h-full w-px bg-yellow-900/30" />
                        <div className="absolute left-2/3 top-0 h-full w-px bg-yellow-900/30" />
                        <div className="absolute left-0 top-1/2 h-px w-full bg-yellow-900/30" />
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="relative z-10 mt-5 sm:mt-6">
                      <div className="mb-2 text-[10px] font-medium text-cyan-100/60 sm:text-xs">
                        رقم البطاقة
                      </div>
                      <div
                        dir="ltr"
                        className="text-left font-mono text-base font-semibold tracking-[0.12em] text-white sm:text-xl sm:tracking-[0.17em]"
                      >
                        {isCardLoading ? (
                          <span className="text-xs text-slate-400">جاري التحميل...</span>
                        ) : card ? (
                          formatCardNumber(card.cardNumber)
                        ) : (
                          "•••• •••• •••• ••••"
                        )}
                      </div>
                    </div>

                    {/* Card Bottom */}
                    <div className="relative z-10 mt-5 flex items-end justify-between sm:mt-6">
                      <div className="min-w-0">
                        <div className="mb-1 text-[9px] text-cyan-100/60 sm:text-[10px]">
                          CARD HOLDER
                        </div>
                        <div className="max-w-[150px] truncate text-xs font-bold uppercase tracking-wider sm:max-w-[220px] sm:text-sm">
                          {userName}
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="mb-1 text-[9px] text-cyan-100/60 sm:text-[10px]">
                          EXPIRES
                        </div>
                        <div
                          dir="ltr"
                          className="text-sm font-semibold tracking-wider sm:text-base"
                        >
                          {card?.expiryDate || "--/--"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#172033] via-[#101827] to-[#070B14] p-5 shadow-2xl sm:rounded-3xl sm:p-7"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-widest">
                        PFB
                      </span>
                      <span className="text-[10px] font-semibold tracking-wider text-gray-500">
                        CARD SECURITY
                      </span>
                    </div>

                    <div className="absolute left-0 right-0 top-[23%] h-12 bg-black/90 sm:h-14" />

                    <div className="relative mt-[24%]">
                      <div className="mb-2 text-[10px] text-gray-400">
                        رمز التحقق CVV
                      </div>
                      <div className="flex h-11 items-center justify-between rounded-lg bg-white px-4 sm:h-12">
                        <span
                          dir="ltr"
                          className="font-mono text-sm font-bold tracking-[0.3em] text-gray-900"
                        >
                          {card?.cvv || "•••"}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">
                          CVV
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="mb-1 text-[9px] text-gray-500">
                          CARD HOLDER
                        </div>
                        <div className="text-xs font-bold uppercase text-gray-200">
                          {userName}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="mb-1 text-[9px] text-gray-500">
                          EXPIRY DATE
                        </div>
                        <div
                          dir="ltr"
                          className="text-sm font-semibold text-white"
                        >
                          {card?.expiryDate || "--/--"}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between border-t border-white/[0.07] pt-3 sm:left-7 sm:right-7">
                      <span className="text-[9px] text-gray-500">
                        PFB DIGITAL BANKING
                      </span>
                      <ShieldCheck size={18} className="text-cyan-400" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Flip Hint */}
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <RefreshCw size={13} />
                اضغط على البطاقة للتبديل بين الوجهين
              </div>

              {/* Card Actions */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyCardNumber}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                >
                  {copied ? (
                    <Check size={17} className="text-emerald-400" />
                  ) : (
                    <Copy size={17} />
                  )}
                  {copied ? "تم النسخ" : "نسخ رقم البطاقة"}
                </button>

                <button
                  type="button"
                  onClick={() => setFlipped((prev) => !prev)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                >
                  <RefreshCw size={17} />
                  قلب البطاقة
                </button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Balance */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-[#0C1C30] to-[#0C1422] p-6">
              <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.07] blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <CreditCard size={21} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300">
                      رصيد البطاقة
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      الرصيد الفعلي المتاح حالياً
                    </p>
                  </div>
                </div>
                <Sparkles size={19} className="text-cyan-400" />
              </div>

              <div className="relative mt-7">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {card
                      ? card.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </span>
                  <span className="text-sm font-semibold text-cyan-400">
                    USD
                  </span>
                </div>

                <p className="mt-3 text-xs leading-6 text-gray-500">
                  {card
                    ? "الرصيد متزامن ومحفوظ مباشرة في قاعدة البيانات."
                    : "قم بإنشاء بطاقتك الافتراضية للبدء في استخدامها."}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0C1422] p-6">
              <h3 className="mb-5 font-bold">حالة البطاقة</h3>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">حالة الإصدار</span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    card
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-yellow-400/10 text-yellow-400"
                  }`}
                >
                  {card ? "تم الإصدار في الخادم" : "لم يتم الإصدار"}
                </span>
              </div>

              <div className="my-4 h-px bg-white/[0.06]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">نوع البطاقة</span>
                <span className="text-sm font-semibold text-white">
                  Virtual Visa Debit
                </span>
              </div>

              <div className="my-4 h-px bg-white/[0.06]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">العملة</span>
                <span className="text-sm font-semibold text-white">USD $</span>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0C1422] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-bold">أمان بطاقتك</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    حماية البطاقة المصرفية
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LockKeyhole size={17} className="mt-0.5 shrink-0 text-cyan-400" />
                  <p className="text-xs leading-6 text-gray-400">
                    لا تشارك رقم البطاقة أو رمز CVV مع أي طرف غير موثوق.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center justify-center gap-3 rounded-2xl border border-cyan-400/20 bg-[#101D2D] px-5 py-4 text-center text-sm font-medium text-cyan-300 shadow-2xl shadow-black/30"
          >
            <ShieldCheck size={18} className="shrink-0" />
            <span className="flex-1">{msg}</span>
            <button
              type="button"
              onClick={() => setMsg("")}
              className="mr-auto text-gray-400 transition hover:text-white"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}