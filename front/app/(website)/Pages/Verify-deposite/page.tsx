"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLazyVerifyDepositQuery } from "@/app/redux/services/api";

type Status = "loading" | "success" | "error";

function VerifyDepositContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [triggerVerify] = useLazyVerifyDepositQuery();

  const successParam = searchParams.get("success");
  const amountParam = searchParams.get("amount") || "0";

  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (!successParam) {
        if (mounted) setStatus("error");
        return;
      }

      if (successParam === "true") {
        try {
          const res = await triggerVerify({
            success: "true",
            amount: amountParam,
          }).unwrap();

          if (mounted) {
            setStatus(res.success ? "success" : "error");
          }
        } catch {
          if (mounted) setStatus("error");
        }
      } else {
        try {
          await triggerVerify({
            success: "false",
            amount: amountParam,
          }).unwrap();
        } catch {}
        if (mounted) setStatus("error");
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [successParam, amountParam, triggerVerify]);

  const content = {
    loading: {
      title: "جاري تأكيد الإيداع في الخادم",
      description:
        "نقوم الآن بالتحقق من عملية الإيداع وتحديث رصيدك في قاعدة البيانات، يرجى الانتظار...",
    },
    success: {
      title: "تم الإيداع بنجاح!",
      description: `تمت إضافة المبلغ ($${Number(amountParam).toLocaleString()}) إلى حسابك بنجاح وتحديث رصيدك.`,
    },
    error: {
      title: "فشلت عملية الإيداع",
      description:
        "تعذر التحقق من عملية الإيداع أو تم إلغاؤها. لم يتم خصم أو إضافة أي مبالغ.",
    },
  };

  const current = content[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C1422] p-8 shadow-2xl">
        <div
          className={`absolute -top-24 -left-24 h-48 w-48 rounded-full blur-3xl ${
            status === "success"
              ? "bg-cyan-400/10"
              : status === "error"
              ? "bg-red-500/10"
              : "bg-blue-500/10"
          }`}
        />

        {/* Icon */}
        <div className="relative flex justify-center mb-7">
          <motion.div
            key={status}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex h-24 w-24 items-center justify-center rounded-full border ${
              status === "success"
                ? "border-cyan-400/20 bg-cyan-400/10"
                : status === "error"
                ? "border-red-400/20 bg-red-400/10"
                : "border-blue-400/20 bg-blue-400/10"
            }`}
          >
            {status === "loading" && (
              <Loader2 className="h-11 w-11 animate-spin text-blue-400" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-12 w-12 text-cyan-400" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-400" />
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative text-center">
          <h1 className="text-2xl font-bold text-white">{current.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {current.description}
          </p>
        </div>

        {/* Transaction Info */}
        {status !== "loading" && (
          <div className="relative mt-7 rounded-2xl border border-white/5 bg-[#070B14]/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Wallet className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">إيداع رصيد</p>
                  <p className="mt-1 text-xs text-slate-500">حساب PFB الرقمي</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold ${
                  status === "success" ? "text-cyan-400" : "text-red-400"
                }`}
              >
                {status === "success" ? "مكتملة ومحفوظة" : "ملغية"}
              </span>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-7">
          <button
            type="button"
            onClick={() => router.push("/Pages/Dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-sm font-bold text-[#061018] transition hover:opacity-95"
          >
            العودة إلى لوحة التحكم
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifyDepositPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070B14] flex items-center justify-center px-4 py-28"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-cyan-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        }
      >
        <VerifyDepositContent />
      </Suspense>
    </main>
  );
}