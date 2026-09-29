"use client";

import React, { useState } from "react";
import { CircleDollarSign, ArrowLeft, Loader2, Landmark } from "lucide-react";
import { useCreateStripeDepositMutation } from "@/app/redux/services/api";

const DepositPage = () => {
  const [amount, setAmount] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [createStripeDepositApi, { isLoading }] =
    useCreateStripeDepositMutation();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const val = Number(amount);
    if (!val || val <= 0) {
      setErrorMsg("يرجى إدخال مبلغ صحيح أكبر من صفر.");
      return;
    }

    try {
      const res = await createStripeDepositApi({ amount: val }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || err?.error || "فشل الاتصال ببوابة الدفع Stripe."
      );
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#070B14] px-4 py-28 text-white sm:px-6"
    >
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0C1424] p-8 shadow-2xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

          <div className="relative text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Landmark size={26} />
            </div>

            <h1 className="text-2xl font-black">إيداع رصيد جديد</h1>
            <p className="mt-2 text-sm text-slate-400">
              أضف أموالاً إلى حسابك المصرفي بأمان عبر Stripe.
            </p>

            <form onSubmit={handleDeposit} className="mt-8 space-y-5 text-right">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  المبلغ بالدولار (USD)
                </label>
                <div className="flex items-center rounded-xl border border-white/10 bg-[#070B14] px-4 focus-within:border-cyan-400/50">
                  <CircleDollarSign size={20} className="text-cyan-400" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMsg("");
                    }}
                    className="w-full bg-transparent px-3 py-3.5 text-base font-bold text-white outline-none"
                    dir="ltr"
                    required
                  />
                  <span className="text-xs font-bold text-cyan-400">USD</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-[#07111F] transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>متابعة الدفع عبر Stripe</span>
                    <ArrowLeft size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DepositPage;