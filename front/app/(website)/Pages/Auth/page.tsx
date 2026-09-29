"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  Landmark,
  Phone,
  CircleDollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation, useRegisterMutation } from "@/app/redux/services/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setCredentials } from "@/app/redux/slices/authSlice";

type Mode = "login" | "register";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");
  const [mode, setMode] = useState<Mode>(queryMode === "register" ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/Pages/Dashboard");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    const q = searchParams.get("mode");
    if (q === "register" || q === "login") {
      setMode(q);
    }
  }, [searchParams]);

  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    initialBalance: "1000",
  });

  const isLogin = mode === "login";

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await loginApi({
        email: loginData.email.trim(),
        password: loginData.password,
      }).unwrap();

      if (res.accessToken && res.user) {
        dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
        router.push("/Pages/Dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "فشل تسجيل الدخول، يرجى التأكد من البيانات.";
      setErrorMsg(msg);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMsg("يجب أن تكون كلمة المرور 6 أحرف على الأقل.");
      return;
    }

    try {
      const res = await registerApi({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim(),
        password: registerData.password,
        balance: Number(registerData.initialBalance) || 1000,
      }).unwrap();

      if (res.accessToken && res.user) {
        dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
        router.push("/Pages/Dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "فشل إنشاء الحساب، قد يكون البريد الإلكتروني مسجلاً مسبقاً.";
      setErrorMsg(msg);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#050912] text-white pt-24"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.07] blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 h-[550px] w-[550px] rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-purple-600/[0.04] blur-[100px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1500px] items-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#080F1B]/90 shadow-2xl shadow-black/40 backdrop-blur-xl lg:min-h-[760px] lg:grid-cols-2">
          {/* =====================================================
              LEFT BRANDING SIDE
          ====================================================== */}
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0C1828] via-[#0A1725] to-[#07101C] lg:flex">
            {/* Decorative circles */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-cyan-400/[0.08]" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-cyan-400/[0.06]" />
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border border-blue-500/[0.06]" />

            <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
              {/* Logo */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-[#06101B] shadow-lg shadow-cyan-400/10">
                    <Landmark size={24} strokeWidth={2.5} />
                  </div>

                  <div>
                    <div className="text-2xl font-black tracking-[0.12em]">
                      PFB
                    </div>
                    <div className="text-[9px] font-semibold tracking-[0.3em] text-cyan-400/60">
                      PREMIUM FINANCE BANK
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Content */}
              <div className="relative">
                <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-2">
                  <Sparkles size={14} className="text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-200/80">
                    مستقبل الخدمات المصرفية الرقمية
                  </span>
                </div>

                <h1 className="max-w-xl text-5xl font-black leading-[1.15] tracking-tight xl:text-6xl">
                  أموالك.
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    تحت سيطرتك.
                  </span>
                </h1>

                <p className="mt-7 max-w-lg text-sm leading-8 text-gray-400 xl:text-base">
                  تجربة مصرفية رقمية متكاملة مصممة لتمنحك تحكمًا فوريًا في أموالك،
                  بطاقاتك الافتراضية، وتحويلاتك اللحظية — متصلة مباشرة بالخادم.
                </p>

                {/* Feature list */}
                <div className="mt-10 space-y-4">
                  <Feature
                    icon={<ShieldCheck size={18} />}
                    title="حماية متقدمة بتشفير JWT"
                    description="جلسات آمنة وبيانات مشفرة تحمي جميع معاملاتك المالية."
                  />
                  <Feature
                    icon={<WalletCards size={18} />}
                    title="إدارة الحساب والبطاقات"
                    description="شحن البطاقات، سحب الأموال، والتحويل الفوري بين الحسابات."
                  />
                  <Feature
                    icon={<LockKeyhole size={18} />}
                    title="تحديثات ديناميكية وفورية"
                    description="بياناتك تنعكس فورًا عبر واجهة RTK Query الذكية."
                  />
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
                <span className="text-xs text-gray-600">
                  © 2026 PFB Digital Banking
                </span>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                  الخادم متصل
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT AUTH SIDE
          ====================================================== */}
          <section className="relative flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
            <div className="w-full max-w-[460px]">
              {/* Top Badge */}
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-400">
                  {isLogin ? <LockKeyhole size={22} /> : <UserRound size={22} />}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {isLogin ? "مرحبًا بعودتك" : "أنشئ حسابك المصرفي"}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      {isLogin
                        ? "سجل الدخول للوصول إلى حسابك وإدارة أموالك."
                        : "ابدأ تجربتك المصرفية الرقمية المتطورة مع PFB."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  <AlertCircle size={18} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Switch */}
              <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className={`relative rounded-xl py-3 text-sm font-semibold transition ${
                    isLogin
                      ? "bg-cyan-400 text-[#080F1C] font-bold shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">تسجيل الدخول</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg("");
                  }}
                  className={`relative rounded-xl py-3 text-sm font-semibold transition ${
                    !isLogin
                      ? "bg-cyan-400 text-[#080F1C] font-bold shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">إنشاء حساب</span>
                </button>
              </div>

              {/* LOGIN FORM */}
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <InputField
                      label="البريد الإلكتروني"
                      type="email"
                      placeholder="name@example.com"
                      icon={<Mail size={18} />}
                      value={loginData.email}
                      onChange={(value) =>
                        setLoginData((prev) => ({ ...prev, email: value }))
                      }
                    />

                    <PasswordField
                      label="كلمة المرور"
                      placeholder="أدخل كلمة المرور"
                      value={loginData.password}
                      show={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                      onChange={(value) =>
                        setLoginData((prev) => ({ ...prev, password: value }))
                      }
                    />

                    <AuthButton
                      text={isLoginLoading ? "جاري الدخول..." : "تسجيل الدخول"}
                      loading={isLoginLoading}
                    />

                    <Divider />

                    <SwitchMessage
                      text="ليس لديك حساب؟"
                      action="إنشاء حساب جديد"
                      onClick={switchMode}
                    />
                  </motion.form>
                ) : (
                  /* REGISTER FORM */
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <InputField
                      label="الاسم بالكامل"
                      type="text"
                      placeholder="محمد أحمد"
                      icon={<UserRound size={18} />}
                      value={registerData.name}
                      onChange={(value) =>
                        setRegisterData((prev) => ({ ...prev, name: value }))
                      }
                    />

                    <InputField
                      label="البريد الإلكتروني"
                      type="email"
                      placeholder="name@example.com"
                      icon={<Mail size={18} />}
                      value={registerData.email}
                      onChange={(value) =>
                        setRegisterData((prev) => ({ ...prev, email: value }))
                      }
                    />

                    <InputField
                      label="رقم الهاتف"
                      type="tel"
                      placeholder="+20 100 123 4567"
                      icon={<Phone size={18} />}
                      value={registerData.phone}
                      onChange={(value) =>
                        setRegisterData((prev) => ({ ...prev, phone: value }))
                      }
                    />

                    <InputField
                      label="الرصيد الافتتاحي (USD)"
                      type="number"
                      placeholder="1000"
                      icon={<CircleDollarSign size={18} />}
                      value={registerData.initialBalance}
                      onChange={(value) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          initialBalance: value,
                        }))
                      }
                    />

                    <PasswordField
                      label="كلمة المرور"
                      placeholder="6 أحرف على الأقل"
                      value={registerData.password}
                      show={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                      onChange={(value) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          password: value,
                        }))
                      }
                    />

                    <PasswordField
                      label="تأكيد كلمة المرور"
                      placeholder="أعد كتابة كلمة المرور"
                      value={registerData.confirmPassword}
                      show={showConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      onChange={(value) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          confirmPassword: value,
                        }))
                      }
                    />

                    <AuthButton
                      text={isRegisterLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
                      loading={isRegisterLoading}
                    />

                    <SwitchMessage
                      text="لديك حساب بالفعل؟"
                      action="تسجيل الدخول"
                      onClick={switchMode}
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Security Footer */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck size={14} className="text-emerald-400" />
                بياناتك مشفرة ومحمية ببروتوكولات الأمان المصرفية
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-cyan-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-200">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function InputField({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-400">
        {label}
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition group-focus-within:text-cyan-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          dir={type === "email" || type === "number" || type === "tel" ? "ltr" : "rtl"}
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-cyan-400/[0.02] focus:ring-2 focus:ring-cyan-400/[0.08]"
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  show,
  onToggle,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-400">
        {label}
      </label>
      <div className="group relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition group-focus-within:text-cyan-400"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          dir="ltr"
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-cyan-400/[0.02] focus:ring-2 focus:ring-cyan-400/[0.08]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function AuthButton({
  text,
  loading = false,
}: {
  text: string;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-[#06101B] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 hover:shadow-cyan-400/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="animate-spin text-[#06101B]" size={18} />
      ) : (
        <>
          <span className="relative z-10">{text}</span>
          <ArrowLeft
            size={17}
            className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1"
          />
        </>
      )}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="h-px flex-1 bg-white/[0.06]" />
      <span className="text-[10px] font-medium text-gray-600">أو</span>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

function SwitchMessage({
  text,
  action,
  onClick,
}: {
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
      <span>{text}</span>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 font-bold text-cyan-400 transition hover:text-cyan-300"
      >
        {action}
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

export default function AuthPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050912]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        </div>
      }
    >
      <AuthContent />
    </React.Suspense>
  );
}