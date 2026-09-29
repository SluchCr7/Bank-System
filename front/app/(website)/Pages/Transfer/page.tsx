"use client";

import React, { useState } from "react";
import {
  Send,
  ArrowLeft,
  Mail,
  CircleDollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useTransferMutation, useGetMeQuery } from "@/app/redux/services/api";
import { useAppSelector } from "@/app/redux/hooks";

export default function TransferPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: userProfile } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [transferApi, { isLoading }] = useTransferMutation();

  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const availableBalance = userProfile?.balance ?? 0;

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    const transferAmount = Number(amount);
    if (!transferAmount || transferAmount <= 0) {
      setStatusMessage({
        type: "error",
        text: "يرجى إدخال مبلغ صحيح أكبر من صفر.",
      });
      return;
    }

    if (transferAmount > availableBalance) {
      setStatusMessage({
        type: "error",
        text: "رصيد الحساب غير كافٍ لإتمام عملية التحويل.",
      });
      return;
    }

    if (email.trim().toLowerCase() === userProfile?.email?.toLowerCase()) {
      setStatusMessage({
        type: "error",
        text: "لا يمكنك التحويل إلى بريدك الإلكتروني الشخصي.",
      });
      return;
    }

    try {
      const res = await transferApi({
        email: email.trim().toLowerCase(),
        amount: transferAmount,
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: res.message || "تم تحويل المبلغ بنجاح!",
      });
      setEmail("");
      setAmount("");
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          err?.data?.message ||
          err?.error ||
          "فشل إتمام التحويل، يرجى التأكد من البريد الإلكتروني للمستلم.",
      });
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#070B14] px-4 py-28 text-white sm:px-6"
    >
      <div className="w-full max-w-xl">
        {/* Transfer Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0C1424] p-6 shadow-2xl shadow-black/20 sm:rounded-[32px] sm:p-10">
          {/* Background Glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

          <div className="relative">
            {/* Header */}
            <div className="mb-8 text-center sm:mb-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/5">
                <Send size={28} strokeWidth={1.7} />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                تحويل الأموال الفوري
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-400">
                قم بإرسال الأموال بسرعة وأمان إلى أي حساب مصرفي مسجل في PFB عبر
                البريد الإلكتروني.
              </p>

              {/* Available balance chip */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                <Wallet size={15} className="text-cyan-400" />
                <span>رصيدك المتاح:</span>
                <span className="font-bold text-cyan-400">
                  ${availableBalance.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleTransfer}>
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-300"
                >
                  البريد الإلكتروني للمستلم
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#070B14] px-4 transition duration-300 focus-within:border-cyan-400/50 focus-within:ring-4 focus-within:ring-cyan-400/[0.05]">
                  <Mail size={20} className="shrink-0 text-slate-500" />

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatusMessage(null);
                    }}
                    placeholder="receiver@example.com"
                    dir="ltr"
                    className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-slate-300"
                >
                  المبلغ المراد تحويله
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#070B14] px-4 transition duration-300 focus-within:border-cyan-400/50 focus-within:ring-4 focus-within:ring-cyan-400/[0.05]">
                  <CircleDollarSign
                    size={21}
                    className="shrink-0 text-cyan-400"
                  />

                  <input
                    id="amount"
                    type="number"
                    required
                    min="0.01"
                    max={availableBalance || 1000000}
                    step="0.01"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setStatusMessage(null);
                    }}
                    placeholder="0.00"
                    dir="ltr"
                    className="h-14 w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-slate-600"
                  />

                  <span className="text-sm font-bold text-cyan-400">USD</span>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  role="alert"
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${
                    statusMessage.type === "error"
                      ? "border-red-400/20 bg-red-400/[0.06] text-red-300"
                      : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                  }`}
                >
                  {statusMessage.type === "error" ? (
                    <AlertCircle className="mt-0.5 shrink-0" size={19} />
                  ) : (
                    <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-cyan-400 to-blue-500 text-sm font-extrabold text-[#07111F] shadow-lg shadow-cyan-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-[#07111F]" size={20} />
                ) : (
                  <>
                    <span>إرسال الأموال الآن</span>
                    <ArrowLeft
                      size={19}
                      className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-white/[0.07] pt-6 text-center">
              <p className="text-xs font-medium text-slate-500">
                تحويل مصرفي مشفر وآمن
                <span className="mx-2 text-cyan-400">•</span>
                PFB Digital Transfer
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}