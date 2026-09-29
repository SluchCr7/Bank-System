"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Globe,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  Smartphone,
  Eye,
  EyeOff,
  RefreshCw,
  Building2,
  Check,
  X,
  HelpCircle,
  FileCheck2,
  Cpu,
  Layers,
  Award,
} from "lucide-react";

// Currency rates against USD
const exchangeRates: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: "$", name: "دولار أمريكي (USD)" },
  EUR: { rate: 0.92, symbol: "€", name: "يورو أوروبي (EUR)" },
  SAR: { rate: 3.75, symbol: "ر.س", name: "ريال سعودي (SAR)" },
  AED: { rate: 3.67, symbol: "د.إ", name: "درهم إماراتي (AED)" },
  GBP: { rate: 0.79, symbol: "£", name: "جنيه إسترليني (GBP)" },
  EGP: { rate: 48.5, symbol: "ج.م", name: "جنيه مصري (EGP)" },
};

export default function IntroPage() {
  // Virtual Card Interactive States
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Live Currency Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("SAR");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Currency calculation
  const amountInUSD = calcAmount / (exchangeRates[fromCurrency]?.rate || 1);
  const convertedAmount = amountInUSD * (exchangeRates[toCurrency]?.rate || 1);
  const traditionalBankFee = (calcAmount * 0.038).toFixed(2);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div dir="rtl" className="relative min-h-screen bg-[#070B14] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Background Lighting Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-700/10 via-purple-600/5 to-transparent blur-[130px]" />
        <div className="absolute bottom-10 right-10 h-[550px] w-[550px] rounded-full bg-cyan-600/[0.08] blur-[150px]" />
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ========================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================= */}
        <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              
              {/* Left Column (Text & Value Proposition) */}
              <div className="space-y-8 text-center lg:col-span-7 lg:text-right">
                
                {/* Official Compliance & Innovation Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40 backdrop-blur-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  </span>
                  <span>الجيل القادم من المصرفية الرقمية الذكية 2026</span>
                  <span className="hidden sm:inline-block text-cyan-500">•</span>
                  <span className="hidden sm:inline-block text-slate-400">تشفير بنكي AES-256</span>
                </div>

                {/* Hero Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.18]">
                    المستقبل المالي بين يديك..{" "}
                    <span className="bg-gradient-to-l from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                      بأمان وسرعة فائقة
                    </span>
                  </h1>
                  <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 lg:mx-0 font-normal">
                    افتح حسابك المصرفي الرقمي في أقل من دقيقتين. تحكم كامل في مدخراتك، إصدار فوري لبطاقات فيزا وماستركارد الافتراضية، وتحويلات مالية لحظية بدون رسوم خفية أو تعقيدات ورقية.
                  </p>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/Pages/Auth?mode=register"
                    className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-base font-bold text-[#060B15] shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/40"
                  >
                    <span>فتح حساب مصرفي فوري</span>
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <div className="absolute -inset-0.5 rounded-2xl bg-white/20 opacity-0 blur transition group-hover:opacity-100" />
                  </Link>

                  <Link
                    href="/Pages/Auth?mode=login"
                    className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/[0.08]"
                  >
                    <Lock size={17} className="text-cyan-400" />
                    <span>تسجيل الدخول للحساب</span>
                  </Link>
                </div>

                {/* Sub-CTA Trust Guarantees */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>فتح الحساب مجاني بالكامل 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>رقم IBAN دولي فوري</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>معتمد وخاضع لأعلى المعايير المالية</span>
                  </div>
                </div>

              </div>

              {/* Right Column (Ultra-Realistic 3D Virtual Card & Live Holographic Feeds) */}
              <div className="relative lg:col-span-5 flex flex-col items-center justify-center">
                
                {/* Visual Glow Backdrop */}
                <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-purple-600/20 blur-2xl" />

                {/* Card Container */}
                <div className="relative w-full max-w-md">
                  
                  {/* Floating Micro-Widget 1: Live Incoming Payment */}
                  <div className="absolute -top-7 -right-3 sm:-right-6 z-20 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-[#0A1224]/90 p-3 shadow-xl backdrop-blur-xl animate-bounce [animation-duration:4s]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ArrowDownLeft size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">تحويل وارد فوري</span>
                        <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          فوري
                        </span>
                      </div>
                      <p dir="ltr" className="text-sm font-black text-emerald-400">+$4,250.00 USD</p>
                    </div>
                  </div>

                  {/* Floating Micro-Widget 2: Live AI Shield */}
                  <div className="absolute -bottom-8 -left-3 sm:-left-6 z-20 flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-[#0A1224]/90 p-3 shadow-xl backdrop-blur-xl">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">درع الأمان المصرفي PFB</p>
                      <p className="text-[11px] text-cyan-400 font-medium">مراقبة احتيال فورية بالذكاء الاصطناعي 24/7</p>
                    </div>
                  </div>

                  {/* THE TITANIUM VIRTUAL CARD */}
                  <div
                    className={`relative w-full overflow-hidden rounded-[28px] border transition-all duration-500 ${
                      isCardFrozen
                        ? "border-blue-400/40 bg-gradient-to-br from-[#0c1829] via-[#10223b] to-[#070e1c] shadow-blue-500/10"
                        : "border-cyan-400/40 bg-gradient-to-br from-[#0b1324] via-[#12203d] to-[#060a14] shadow-cyan-500/20"
                    } p-6 sm:p-7 shadow-2xl`}
                  >
                    {/* Metallic Grain & Sheen Overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-80" />
                    
                    {/* Frozen State Overlay */}
                    {isCardFrozen && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#071329]/80 backdrop-blur-sm transition-all duration-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/40 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/30">
                          <Lock size={26} />
                        </div>
                        <p className="mt-3 text-sm font-bold text-white">البطاقة مجمدة ومؤمنة</p>
                        <p className="text-xs text-blue-200/80">المعاملات موقوفة مؤقتاً بأمان</p>
                      </div>
                    )}

                    {/* Card Top: Bank Brand & Contactless Icon */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-xs text-[#080F1C] shadow-md shadow-cyan-500/30">
                          PFB
                        </div>
                        <div>
                          <p className="text-sm font-extrabold tracking-tight text-white">PFB DIGITAL</p>
                          <p className="text-[9px] font-medium tracking-wider text-cyan-400">TITANIUM WORLD ELITE</p>
                        </div>
                      </div>

                      {/* Contactless Wave Icon */}
                      <div className="flex items-center gap-1 opacity-70">
                        <span className="text-[10px] font-semibold text-slate-300">NFC</span>
                        <Zap size={16} className="text-cyan-400" />
                      </div>
                    </div>

                    {/* EMV Smart Chip */}
                    <div className="relative z-10 mt-6 flex items-center justify-between">
                      <div className="relative h-9 w-12 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner flex items-center justify-center overflow-hidden border border-amber-300/40">
                        <div className="absolute inset-x-0 h-[1px] bg-amber-900/30 top-3" />
                        <div className="absolute inset-x-0 h-[1px] bg-amber-900/30 bottom-3" />
                        <div className="absolute inset-y-0 w-[1px] bg-amber-900/30 left-4" />
                        <div className="absolute inset-y-0 w-[1px] bg-amber-900/30 right-4" />
                        <div className="h-4 w-4 rounded-full border border-amber-900/40" />
                      </div>

                      {/* Live Balance Peek */}
                      <div className="text-left">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">الرصيد المتاح</span>
                        <p dir="ltr" className="text-xl font-extrabold tracking-tight text-white">
                          $128,450.00
                        </p>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="relative z-10 mt-7 flex items-center justify-between">
                      <p dir="ltr" className="font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-slate-100">
                        {showCardNumber ? "5412 8920 3481 8842" : "5412 •••• •••• 8842"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        title={showCardNumber ? "إخفاء الرقم" : "إظهار الرقم"}
                      >
                        {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Card Bottom: Holder, Expiry, Logo */}
                    <div className="relative z-10 mt-6 flex items-end justify-between border-t border-white/[0.08] pt-4">
                      <div>
                        <span className="block text-[9px] font-medium uppercase tracking-widest text-slate-400">حامل البطاقة</span>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">SAUD AL-MUTAIRI</p>
                      </div>

                      <div>
                        <span className="block text-[9px] font-medium uppercase tracking-widest text-slate-400">ينتهي في</span>
                        <p dir="ltr" className="text-xs font-bold text-white">09/30</p>
                      </div>

                      {/* Mastercard World Elite Holographic Circles */}
                      <div className="flex -space-x-3 rtl:space-x-reverse items-center">
                        <div className="h-7 w-7 rounded-full bg-red-500/90 shadow-sm" />
                        <div className="h-7 w-7 rounded-full bg-amber-400/90 mix-blend-screen shadow-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Card Control Bar Below the Card */}
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs backdrop-blur-md">
                    <span className="text-slate-300">
                      جرّب الحماية الآن: {isCardFrozen ? "البطاقة مجمدة" : "البطاقة نشطة"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCardFrozen(!isCardFrozen)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
                        isCardFrozen
                          ? "bg-blue-500 text-white hover:bg-blue-400"
                          : "bg-white/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200"
                      }`}
                    >
                      {isCardFrozen ? (
                        <>
                          <RefreshCw size={13} />
                          <span>إلغاء التجميد</span>
                        </>
                      ) : (
                        <>
                          <Lock size={13} />
                          <span>تجميد فوري للبطاقة</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* STATS & CREDIBILITY BAR */}
        {/* ========================================================= */}
        <section className="relative border-y border-white/[0.08] bg-[#0A101D]/70 py-10 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              
              <div className="text-center lg:text-right">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  <span className="text-cyan-400">+</span>2.8M
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">عميل نشط يثقون في PFB</p>
              </div>

              <div className="text-center lg:text-right">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  <span className="text-cyan-400">$</span>18.4B+
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">حجم المعاملات الرقمية سنوياً</p>
              </div>

              <div className="text-center lg:text-right">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  0<span className="text-cyan-400">%</span>
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">عمولات خفية ورسوم صيانة</p>
              </div>

              <div className="text-center lg:text-right">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  99.99<span className="text-cyan-400">%</span>
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">وقت تشغيل واستقرار الخوادم</p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE CURRENCY & INSTANT TRANSFER CALCULATOR */}
        {/* ========================================================= */}
        <section id="calculator" className="relative py-20 lg:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Info */}
              <div className="lg:col-span-5 space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300">
                  <Globe size={14} />
                  <span>أسعار صرف فورية بين البنوك الدولية</span>
                </div>
                <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
                  حاسبة التحويل والصرف اللحظية بدون عمولات
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  على عكس المصارف التقليدية التي تقتطع 3% إلى 5% كرسوم مخفية على أسعار الصرف، يمنحك بنك PFB سعر الصرف الحقيقي المباشر بدون أي هامش ربحي أو رسوم إضافية.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                      <Zap size={15} />
                    </div>
                    <span>تحويلات لحظية خلال أقل من ثانية واحدة</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      <CheckCircle2 size={15} />
                    </div>
                    <span>شفافية كاملة: المبلغ الظاهر هو المبلغ الواصل بالضبط</span>
                  </div>
                </div>
              </div>

              {/* Right Calculator Card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0C1527] to-[#070D18] p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
                  
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                    <div>
                      <h3 className="text-lg font-bold text-white">محاكي التحويل والصرف الفوري</h3>
                      <p className="text-xs text-slate-400 mt-0.5">أسعار محدثة مباشرة من أسواق النقد الدولية</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                      مباشر
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Send Amount Input */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition focus-within:border-cyan-400/50">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>أنت ترسل</span>
                        <span>الرصيد المتاح: غير محدود</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <input
                          type="number"
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value) || 0))}
                          className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-white outline-none"
                        />
                        <select
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                          className="rounded-xl border border-white/10 bg-[#0F1D36] px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer"
                        >
                          {Object.keys(exchangeRates).map((curr) => (
                            <option key={curr} value={curr} className="bg-[#0B1527] text-white">
                              {curr} ({exchangeRates[curr].symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Exchange Rate Badge */}
                    <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>
                          سعر الصرف: 1 {fromCurrency} = {(
                            (exchangeRates[toCurrency]?.rate || 1) /
                            (exchangeRates[fromCurrency]?.rate || 1)
                          ).toFixed(4)} {toCurrency}
                        </span>
                      </div>
                      <div className="text-emerald-400 font-semibold">عمولة PFB: $0.00 (مجاني)</div>
                    </div>

                    {/* Receive Amount Input */}
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/[0.15] p-4">
                      <div className="flex items-center justify-between text-xs text-cyan-300 mb-2">
                        <span>المستلم يحصل على</span>
                        <span>مضمون 100% بدون اقتطاع</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl sm:text-3xl font-black text-cyan-300">
                          {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                        <select
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                          className="rounded-xl border border-cyan-400/30 bg-[#0F1D36] px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer"
                        >
                          {Object.keys(exchangeRates).map((curr) => (
                            <option key={curr} value={curr} className="bg-[#0B1527] text-white">
                              {curr} ({exchangeRates[curr].symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Real Savings Comparison */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-300">التوفير التقديري مقارنة بالبنوك العادية:</span>
                      <span className="font-extrabold text-emerald-400">وفرت قرابة ${traditionalBankFee} USD</span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/Pages/Auth?mode=register"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-4 text-center text-sm font-bold text-[#080F1C] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
                    >
                      <span>افتح حسابك وابدأ التحويل الآن</span>
                      <ArrowLeft size={16} />
                    </Link>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CORE SERVICES & PILLARS */}
        {/* ========================================================= */}
        <section id="features" className="relative py-20 lg:py-28 bg-[#060A14]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles size={14} />
                <span>منظومة متكاملة لجميع احتياجاتك المالية</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                كل ما تحتاجه لإدارة ثروتك في مكان واحد
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                صممنا بنك PFB من الصفر ليوفر لك تجربة مصرفية سلسة تتفوق على أي بنك تقليدي، مع أدوات رقمية تمكّنك من التحكم التام.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition-transform group-hover:scale-110">
                  <CreditCard size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">بطاقات فيزا وماستركارد الذكية</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  إصدار فوري لبطاقات افتراضية للتسوق الآمن عبر الإنترنت وبطاقات بلاستيكية ومعدنية، مع تحكم لحظي في حدود الإنفاق وتجميد البطاقة فورياً.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-blue-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-110">
                  <Zap size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">تحويلات فورية بدون رسوم</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  أرسل واستقبل الأموال بين الحسابات المصرفية المحلية والدولية في ثوانٍ معدودة وبدون أي رسوم خفية أو تأخير يمتد لأيام.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-emerald-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                  <Building2 size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">حساب مصرفي فوري مع IBAN</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  احصل على رقم حساب بنكي دولي (IBAN) خاص بك مباشرة فور التسجيل لاستقبال الرواتب، المدفوعات العالمية، والتحويلات التجارية.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-purple-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-110">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">أمان بمستوى البنوك المركزية</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  تشفير بيانات متطور بنظام AES-256، ومصادقة بيومترية متعددة المستويات، ومراقبة مدعومة بالذكاء الاصطناعي لمنع أي محاولات احتيال.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-amber-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 transition-transform group-hover:scale-110">
                  <TrendingUp size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">تحليلات وتتبع مالي ذكي</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  لوحة تحكم تفاعلية ترصد مصاريفك تلقائياً وتصنفها، مما يمنحك رؤية فورية وواضحة لنمو ثروتك والتخطيط لمدخراتك المستقبلية.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A1122] p-8 transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition-transform group-hover:scale-110">
                  <Smartphone size={28} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">إشعارات مصرفية فورية 24/7</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  تنبيهات فورية لكل عملية إيداع، سحب، أو تحويل في نفس اللحظة عبر التطبيق والرسائل لتبقى على اطلاع كامل بكل حركة في حسابك.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SIDE-BY-SIDE COMPARISON: PFB vs TRADITIONAL BANKS */}
        {/* ========================================================= */}
        <section id="comparison" className="relative py-20 lg:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                لماذا يترك الملايين البنوك التقليدية لصالح PFB؟
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                مقارنة واضحة وشفافة تبين الفارق الحقيقي في السرعة، التكلفة، وتجربة الاستخدام اليومية.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-[#090F1E]/80 backdrop-blur-2xl shadow-2xl">
              <table className="w-full text-right border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="py-5 px-6 text-sm font-bold text-slate-300">الميزة المصرفية</th>
                    <th className="py-5 px-6 text-base font-extrabold text-cyan-400 bg-cyan-950/20">
                      بنك PFB الرقمي
                    </th>
                    <th className="py-5 px-6 text-sm font-semibold text-slate-400">البنوك التقليدية القديمة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 font-medium text-white">مدة فتح الحساب</td>
                    <td className="py-4.5 px-6 font-bold text-cyan-300 bg-cyan-950/10">أقل من دقيقتين أونلاين بالكامل</td>
                    <td className="py-4.5 px-6 text-slate-400">3 إلى 7 أيام عمل وزيارة فرع</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 font-medium text-white">رسوم المعاملات والتحويل</td>
                    <td className="py-4.5 px-6 font-bold text-cyan-300 bg-cyan-950/10">0% مجانية وشفافة بدون شروط</td>
                    <td className="py-4.5 px-6 text-slate-400">رسوم تحويل مرتفعة وعمولات خفية</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 font-medium text-white">إصدار وإدارة البطاقات</td>
                    <td className="py-4.5 px-6 font-bold text-cyan-300 bg-cyan-950/10">بطاقة افتراضية فورية + تجميد بلمسة</td>
                    <td className="py-4.5 px-6 text-slate-400">انتظار أسبوعين + اتصال لخدمة العملاء</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 font-medium text-white">الأمان ومكافحة الاحتيال</td>
                    <td className="py-4.5 px-6 font-bold text-cyan-300 bg-cyan-950/10">رصد ذكاء اصطناعي وتشفير 256-bit لحظي</td>
                    <td className="py-4.5 px-6 text-slate-400">أنظمة قديمة واستجابة بطيئة</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 font-medium text-white">التوفر والدعم المصرفي</td>
                    <td className="py-4.5 px-6 font-bold text-cyan-300 bg-cyan-950/10">متاح 24/7 دون أي انقطاع</td>
                    <td className="py-4.5 px-6 text-slate-400">مقيد بساعات العمل وأيام العطل الرسمية</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW TO START IN 3 SIMPLE STEPS */}
        {/* ========================================================= */}
        <section className="relative py-20 lg:py-28 bg-[#080E1C]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                ابدأ رحلتك المصرفية في 3 خطوات بسيطة
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                لا أوراق، لا انتظار في طوابير الفروع، ولا تعقيدات بيروقراطية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="relative rounded-3xl border border-white/10 bg-[#0B1324] p-8 text-center sm:text-right">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-[#080F1C] text-xl font-black mb-6 mx-auto sm:mx-0 shadow-lg shadow-cyan-400/20">
                  1
                </span>
                <h3 className="text-xl font-bold text-white">أنشئ حسابك الرقمي</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  أدخل بياناتك الأساسية، الاسم والبريد الإلكتروني وكلمة المرور. يتم تفعيل حسابك فورياً بدون أي تأخير.
                </p>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-[#0B1324] p-8 text-center sm:text-right">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white text-xl font-black mb-6 mx-auto sm:mx-0 shadow-lg shadow-blue-500/20">
                  2
                </span>
                <h3 className="text-xl font-bold text-white">أصدر بطاقتك واشحن رصيدك</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  احصل على بطاقتك الرقمية الأولى فوراً، وقم بإيداع أموالك أو شحن رصيد حسابك بكل سهولة وأمان.
                </p>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-[#0B1324] p-8 text-center sm:text-right">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-black mb-6 mx-auto sm:mx-0 shadow-lg shadow-emerald-500/20">
                  3
                </span>
                <h3 className="text-xl font-bold text-white">تمتع بالحرية المالية الكاملة</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  أرسل التحويلات، ادفع مشترياتك عالمياً، وتابع تقارير أرباحك ومدخراتك من لوحة تحكمك المتطورة.
                </p>
              </div>

            </div>

            <div className="mt-12 text-center">
              <Link
                href="/Pages/Auth?mode=register"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-8 py-3.5 text-base font-bold text-[#080F1C] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowLeft size={16} />
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* INSTITUTIONAL SECURITY & REGULATORY ASSURANCE */}
        {/* ========================================================= */}
        <section id="security" className="relative py-20 lg:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="rounded-[36px] border border-cyan-400/20 bg-gradient-to-br from-[#0B152A] via-[#08101E] to-[#050A14] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
              
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
                    <ShieldCheck size={16} />
                    <span>حصنك المالي الرقمي الأكثر أماناً</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    أموالك وبياناتك المصرفية محمية بأعلى درجات التشفير الدولي
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    نطبق نفس بروتوكولات الحماية العسكرية المعتمدة في كبرى البنوك المركزية العالمية. أموالك مودعة في حسابات معزولة ومحمية بالكامل، مع تدقيق أمني مستمر 24 ساعة يومياً.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                      <Lock size={18} className="text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200">تشفير 256-bit AES متقدم</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                      <Cpu size={18} className="text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200">رصد احتيال بالذكاء الاصطناعي</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                      <FileCheck2 size={18} className="text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200">مطابقة معايير PCI-DSS المستوى 1</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                      <Award size={18} className="text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200">حماية ودائع العملاء بنسبة 100%</span>
                    </div>
                  </div>

                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-tr from-cyan-950/40 to-blue-950/30 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="absolute inset-4 rounded-full border border-cyan-400/30 animate-spin [animation-duration:20s]" />
                    <div className="absolute inset-8 rounded-full border border-blue-400/20" />
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-400/20 text-cyan-400 shadow-xl shadow-cyan-400/20">
                      <ShieldCheck size={50} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TESTIMONIALS */}
        {/* ========================================================= */}
        <section className="relative py-20 bg-[#070B14]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                يثق بنا رواد الأعمال والشركات والمستثمرون
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                أكثر من 50,000 مراجعة معتمدة بتقييم إجمالي 4.9 من 5 نجوم.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A1224] p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    &quot;بنك PFB غيّر تماماً طريقة إدارة مدفوعاتنا التجارية. التحويلات الفورية والبطاقات الافتراضية وفرت علينا آلاف الدولارات أسبوعياً من العمولات البنكية القديمة.&quot;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#080F1C]">
                    م
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">د. مروان الشمري</h4>
                    <p className="text-xs text-slate-400">مؤسس شركة تقنية سحابية</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-400/30 bg-[#0B152A] p-7 flex flex-col justify-between shadow-xl shadow-cyan-500/5">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    &quot;التحكم الفوري في البطاقات من الهاتف وتجميدها بلمسة واحدة يمنحني راحة بال مطلقة عند التسوق الدولي والسفر. الواجهة فائقة الجمال والسهولة.&quot;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                    س
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">سارة المهندس</h4>
                    <p className="text-xs text-slate-400">مستثمرة ومصممة واجهات</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-[#0A1224] p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    &quot;سرعة فتح الحساب كانت مذهلة، في دقيقتين كان لدي رقم آيبان وبطاقة جاهزة للاستخدام بدون أي أوراق أو مراجعة فرع. هذا هو مستقبل المصارف الحقيقي.&quot;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-bold text-white">
                    ك
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">كريم عبد العزيز</h4>
                    <p className="text-xs text-slate-400">مدير مالي وإداري</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE FAQ ACCORDION */}
        {/* ========================================================= */}
        <section id="faq" className="relative py-20 lg:py-28 bg-[#060A14]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                <HelpCircle size={14} />
                <span>إجابات واضحة لجميع تساؤلاتك</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                الأسئلة الأكثر شيوعاً
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "كيف يمكنني فتح حساب في بنك المستقبل الرقمي PFB؟",
                  a: "فتح الحساب يستغرق أقل من دقيقتين رقمياً بالكامل. كل ما عليك هو النقر على زر 'فتح حساب جديد'، وإدخال اسمك وبريدك الإلكتروني ورقم هاتفك، وسيتم إنشاء حسابك وتفعيله فوراً مع تزويدك برقم حساب وبطاقتك الأولى.",
                },
                {
                  q: "هل أموالي ومعلوماتي المصرفية آمنة في PFB؟",
                  a: "نعم بنسبة 100%. نستخدم تشفير AES-256 العسكري لحماية جميع البيانات والاتصالات، ونحتفظ بأموال العملاء في حسابات ائتمانية معزولة ومحمية، بالإضافة إلى مراقبة الذكاء الاصطناعي ضد أي نشاط مشبوه على مدار الساعة.",
                },
                {
                  q: "هل توجد أي رسوم شهرية أو عمولات خفية؟",
                  a: "لا توجد أي رسوم فتح حساب أو رسوم صيانة دورية، والتحويلات المالية داخل المنظومة مجانية بالكامل بدون أي عمولات خفية.",
                },
                {
                  q: "كيف يمكنني إيداع الأموال وسحبها من حسابي؟",
                  a: "يمكنك الإيداع والسحب فورياً بنقرة زر من خلال لوحة التحكم الخاصة بك، كما يمكنك التحويل بين رصيد حسابك الجاري ورصيد بطاقتك البنكية بلحظة وبكل سهولة.",
                },
                {
                  q: "هل يمكنني استخدام البطاقة للتسوق الدولي والتجارة الإلكترونية؟",
                  a: "نعم، بطاقات PFB الافتراضية والبلاتينية مقبولة في أكثر من 180 دولة حول العالم وتدعم جميع منصات التسوق العالمية مثل Amazon و AliExpress والدفع عبر أنظمة Apple Pay و Google Pay.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0A1224] transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-right font-bold text-white hover:text-cyan-300 transition"
                  >
                    <span className="text-base sm:text-lg">{item.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
                      {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {openFaq === idx && (
                    <div className="border-t border-white/[0.06] p-5 pt-3 text-sm leading-relaxed text-slate-300">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* PRE-FOOTER CTA SECTION */}
        {/* ========================================================= */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="relative rounded-[36px] overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-cyan-950/60 via-[#0B152A] to-blue-950/60 p-10 sm:p-14 lg:p-18 text-center shadow-2xl backdrop-blur-2xl">
              
              <div className="pointer-events-none absolute -top-24 right-1/3 h-64 w-64 rounded-full bg-cyan-400/20 blur-[100px]" />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="inline-block rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                  انضم إلى جيل المصرفية الجديد اليوم
                </span>

                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  مستعد لتجربة مصرفية استثنائية لم تعهدها من قبل؟
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  افتح حسابك في بنك PFB الرقمي الآن مجاناً وبدون أي شروط أو أوراق، وابدأ في الاستمتاع بحرية مالية مطلقة.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link
                    href="/Pages/Auth?mode=register"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-8 py-4 text-base font-bold text-[#080F1C] shadow-xl shadow-cyan-400/25 transition hover:bg-cyan-300 hover:scale-[1.02]"
                  >
                    <span>فتح حساب مصرفي فوري</span>
                    <ArrowLeft size={18} />
                  </Link>
                  <Link
                    href="/Pages/Auth?mode=login"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    <Lock size={17} className="text-cyan-400" />
                    <span>تسجيل الدخول</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INSTITUTIONAL FOOTER */}
        {/* ========================================================= */}
        <footer className="border-t border-white/[0.08] bg-[#050811] pt-16 pb-12 text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
              
              {/* Brand Description */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-sm text-[#080F1C]">
                    PFB
                  </div>
                  <div>
                    <span className="text-xl font-black text-white">PFB<span className="text-cyan-400">.</span></span>
                    <p className="text-[10px] text-slate-400">بنك المستقبل الرقمي</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
                  المؤسسة المصرفية الرقمية الرائدة في تقديم الخدمات المالية الحديثة، الحسابات الفورية، وإصدار البطاقات المشفرة بأعلى معايير الأمان الدولية.
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                  <ShieldCheck size={16} className="text-cyan-400" />
                  <span>معتمد ومطابق لأعلى لوائح الأمان المالي PCI-DSS</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4">المنتجات المصرفية</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li><a href="#features" className="hover:text-cyan-400 transition">الحسابات الجارية</a></li>
                  <li><a href="#features" className="hover:text-cyan-400 transition">بطاقات فيزا الافتراضية</a></li>
                  <li><a href="#calculator" className="hover:text-cyan-400 transition">التحويلات الدولية</a></li>
                  <li><a href="#features" className="hover:text-cyan-400 transition">إدارة المدخرات</a></li>
                </ul>
              </div>

              {/* Security & Support */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4">الأمان والدعم</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li><a href="#security" className="hover:text-cyan-400 transition">مركز الأمان والتشفير</a></li>
                  <li><a href="#faq" className="hover:text-cyan-400 transition">الأسئلة الشائعة</a></li>
                  <li><a href="#hero" className="hover:text-cyan-400 transition">مراقبة الاحتيال</a></li>
                  <li><Link href="/Pages/Auth" className="hover:text-cyan-400 transition">بوابة العملاء</Link></li>
                </ul>
              </div>

              {/* Legal & Compliance */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4">الامتثال القانوني</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li><span className="hover:text-slate-300 transition cursor-pointer">سياسة الخصوصية</span></li>
                  <li><span className="hover:text-slate-300 transition cursor-pointer">شروط وأحكام الخدمة</span></li>
                  <li><span className="hover:text-slate-300 transition cursor-pointer">مكافحة غسيل الأموال (AML)</span></li>
                  <li><span className="hover:text-slate-300 transition cursor-pointer">الإفصاح المالي وحماية الودائع</span></li>
                </ul>
              </div>

            </div>

            {/* Bottom Copyright & Disclaimer */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                © 2026 بنك المستقبل الرقمي PFB (Digital Banking). جميع الحقوق محفوظة.
              </p>
              <p className="text-center md:text-left">
                الخدمات المصرفية الرقمية تخضع لأعلى معايير التشفير والرقابة المصرفية المعتمدة عالمياً.
              </p>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
