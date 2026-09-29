"use client";

import React, { useState, useEffect } from "react";
import {
  UserRound,
  Pencil,
  Save,
  X,
  Mail,
  Phone,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  ChevronLeft,
  CheckCircle2,
  BadgeCheck,
  Clock,
  User,
  Loader2,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetMeQuery, useUpdateProfileMutation } from "@/app/redux/services/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateUser } from "@/app/redux/slices/authSlice";

export default function ProfilePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data: userProfile, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateProfileApi, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile]);

  const initials = (formData.name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage("");
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      });
    }
    setEditMode(false);
    setMessage("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessageType("error");
      setMessage("الاسم مطلوب.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessageType("error");
      setMessage("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    try {
      const res = await updateProfileApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }).unwrap();

      if (res.user || res.data) {
        dispatch(updateUser(res.user || res.data));
      }

      setEditMode(false);
      setMessageType("success");
      setMessage("تم حفظ التعديلات وتحديثها في قاعدة البيانات بنجاح.");
    } catch (err: any) {
      setMessageType("error");
      setMessage(
        err?.data?.message || err?.error || "فشل حفظ التعديلات في الخادم."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-[#080F1B] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-default disabled:opacity-80";

  const labelClass = "mb-2.5 block text-sm font-medium text-gray-400";

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#070B14] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-cyan-400">
              <UserRound size={19} />
              <span className="text-xs font-bold tracking-[0.15em]">
                PFB DIGITAL BANKING
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              الملف الشخصي
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              إدارة معلوماتك الشخصية وإعدادات حسابك المصرفي مباشرة من قاعدة البيانات.
            </p>
          </div>

          {!editMode && (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-[#070B14] transition hover:bg-cyan-300"
            >
              <Pencil size={17} />
              تعديل الملف الشخصي
            </button>
          )}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left / Profile Card */}
          <div className="space-y-6 lg:col-span-4">
            {/* User Identity Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0C1422]">
              {/* Banner */}
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#10364B] via-[#0C2944] to-[#10152D]">
                <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-cyan-100/80">
                  <ShieldCheck size={13} />
                  PFB MEMBER
                </div>

                <div className="absolute bottom-5 left-6 text-4xl font-black tracking-widest text-white/[0.04]">
                  PFB
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-14 mb-4 flex items-end justify-between">
                  <div className="group relative h-28 w-28 shrink-0 rounded-3xl border-4 border-[#0C1422] bg-gradient-to-br from-cyan-300 to-blue-600 p-0.5 shadow-xl shadow-black/30">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#101D2D] text-3xl font-black text-cyan-300">
                      {initials}
                    </div>

                    <div className="absolute -bottom-1 -left-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-[#0C1422] bg-cyan-400 text-[#070B14]">
                      <CheckCircle2 size={15} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold">
                  {isLoading ? "جاري التحميل..." : userProfile?.name}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {userProfile?.email}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    <BadgeCheck size={14} />
                    عضو موثق
                  </span>

                  <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/10 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-semibold text-cyan-400">
                    <ShieldCheck size={14} />
                    حساب متصل
                  </span>
                </div>

                <div className="my-6 h-px bg-white/[0.06]" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-400">
                      <Mail size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                      <p className="mt-1 truncate text-sm font-medium text-gray-200">
                        {userProfile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-400">
                      <Phone size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">رقم الهاتف</p>
                      <p dir="ltr" className="mt-1 text-right text-sm font-medium text-gray-200">
                        {userProfile?.phone || "لم يحدد بعد"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-400">
                      <Wallet size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">الرصيد المتاح</p>
                      <p className="mt-1 text-sm font-bold text-cyan-400">
                        ${userProfile?.balance?.toLocaleString() || "0"} USD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-[#0D1C2C] to-[#0C1422] p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <LockKeyhole size={21} />
                </div>
                <div>
                  <h3 className="font-bold">أمان حسابك</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    حافظ على بياناتك الشخصية
                  </p>
                </div>
              </div>

              <p className="text-xs leading-7 text-gray-400">
                بياناتك مشفرة ومحمية ببروتوكولات التوثيق المصرفي. التعديلات تحفظ
                فوريًا على خادم البنك.
              </p>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <ShieldCheck size={17} className="text-emerald-400" />
                  حماية الحساب JWT
                </div>
                <span className="text-xs font-bold text-emerald-400">مفعلة</span>
              </div>
            </div>
          </div>

          {/* Right / Profile Form */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0C1422]">
              {/* Form Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                    <UserRound size={23} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">المعلومات الشخصية</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      بياناتك المسجلة في قاعدة بيانات PFB
                    </p>
                  </div>
                </div>

                {!editMode && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-400"
                  >
                    <Pencil size={15} />
                    تعديل البيانات
                  </button>
                )}

                {editMode && (
                  <span className="flex items-center gap-2 self-start rounded-full bg-yellow-400/10 px-3 py-1.5 text-xs font-semibold text-yellow-400">
                    <Pencil size={13} />
                    وضع التعديل
                  </span>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSave}>
                <div className="space-y-6 p-6 sm:p-8">
                  <div>
                    <div className="mb-6 flex items-center gap-2">
                      <User size={17} className="text-cyan-400" />
                      <h3 className="text-sm font-bold">البيانات الأساسية</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          الاسم بالكامل
                        </label>
                        <div className="relative">
                          <UserRound
                            size={17}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder="الاسم بالكامل"
                            className={`${inputClass} pr-11`}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <Mail
                            size={17}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder="example@email.com"
                            dir="ltr"
                            className={`${inputClass} pl-4 pr-11 text-left`}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className={labelClass}>
                          رقم الهاتف
                        </label>
                        <div className="relative">
                          <Phone
                            size={17}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder="+20 100 000 0000"
                            dir="ltr"
                            className={`${inputClass} pl-4 pr-11 text-left`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-start"
                    >
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.07]"
                      >
                        <X size={17} />
                        إلغاء
                      </button>

                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-bold text-[#070B14] transition hover:bg-cyan-300 disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <Loader2 className="animate-spin text-[#070B14]" size={18} />
                        ) : (
                          <>
                            <Save size={17} />
                            حفظ التغييرات في الخادم
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </form>
            </div>

            {/* Account Information */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.07] bg-[#0C1422] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <CreditCard size={21} />
                  </div>
                  <ChevronLeft size={18} className="text-gray-600" />
                </div>
                <h3 className="mt-5 text-base font-bold">الحساب المصرفي</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  رقم الحساب التعريفي: {userProfile?._id || "..."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={15} />
                  الحساب متصل ومحدث
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.07] bg-[#0C1422] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                    <Clock size={21} />
                  </div>
                  <ChevronLeft size={18} className="text-gray-600" />
                </div>
                <h3 className="mt-5 text-base font-bold">تاريخ الانضمام</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "حديثاً"}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <ShieldCheck size={15} />
                  حساب معتمد
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-md items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl ${
              messageType === "success"
                ? "border-emerald-400/20 bg-[#101D2D] text-emerald-400"
                : "border-red-400/20 bg-[#1C1218] text-red-400"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={20} className="shrink-0" />
            ) : (
              <X size={20} className="shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="إغلاق الرسالة"
              className="text-gray-400 transition hover:text-white"
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}