"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Wallet,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  CreditCard,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Loader2,
} from "lucide-react";
import {
  AdminUser,
  useUpdateAdminUserBalanceMutation,
  useDeleteAdminUserMutation,
  useMakeIsAdminMutation,
} from "@/app/redux/services/api";

interface AdminUserModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminUserModal({ user, onClose, onSuccess }: AdminUserModalProps) {
  const [balanceInput, setBalanceInput] = useState<string>(user ? user.balance.toString() : "0");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(Boolean(user?.isAdmin));
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [updateBalance, { isLoading: isUpdating }] = useUpdateAdminUserBalanceMutation();
  const [deleteUser, { isLoading: isDeletingLoading }] = useDeleteAdminUserMutation();
  const [makeAdminApi, { isLoading: isTogglingAdmin }] = useMakeIsAdminMutation();

  if (!user) return null;

  const handleToggleAdmin = async () => {
    setActionMessage(null);
    const targetStatus = !userIsAdmin;
    try {
      const res = await makeAdminApi({ id: user._id, isAdmin: targetStatus }).unwrap();
      setUserIsAdmin(targetStatus);
      setActionMessage({
        type: "success",
        text: targetStatus
          ? "تمت ترقية المستخدم إلى مسؤول (Admin) بنجاح."
          : "تم إلغاء صلاحيات الإدارة عن المستخدم بنجاح.",
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.data?.message || "فشل تغيير صلاحيات المسؤول.",
      });
    }
  };

  const handleSaveBalance = async () => {
    setActionMessage(null);
    const num = Number(balanceInput);
    if (isNaN(num) || num < 0) {
      setActionMessage({ type: "error", text: "يرجى إدخال رصيد صالح أكبر من أو يساوي صفر." });
      return;
    }

    try {
      await updateBalance({ id: user._id, balance: num }).unwrap();
      setActionMessage({ type: "success", text: "تم تحديث رصيد المستخدم بنجاح في قاعدة البيانات." });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.data?.message || "فشل تحديث الرصيد، يرجى المحاولة لاحقاً.",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user._id).unwrap();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.data?.message || "فشل حذف المستخدم.",
      });
    }
  };

  const adjustBalance = (delta: number) => {
    const current = Number(balanceInput) || 0;
    const next = Math.max(0, current + delta);
    setBalanceInput(next.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        dir="rtl"
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#0C1220] p-6 sm:p-8 shadow-2xl"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-purple-500/10 blur-[80px]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 text-purple-300">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        {actionMessage && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-2xl p-3 text-xs font-semibold ${
              actionMessage.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/15 border border-red-500/30 text-red-300"
            }`}
          >
            {actionMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Body Info */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Phone size={13} />
                رقم الهاتف
              </span>
              <span className="font-semibold text-white">
                {user.phone || "غير محدد"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar size={13} />
                تاريخ التسجيل
              </span>
              <span className="font-semibold text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : "غير متوفر"}
              </span>
            </div>
          </div>

          {/* Balance Adjustment Section */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Wallet size={15} />
                تعديل رصيد الحساب المباشر
              </span>
              <span className="text-xs text-slate-400 font-mono">
                الرصيد الحالي: ${Number(user.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                placeholder="أدخل الرصيد الجديد..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pr-4 pl-8 text-sm text-white font-mono focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustBalance(500)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
              >
                +500
              </button>
              <button
                type="button"
                onClick={() => adjustBalance(1000)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
              >
                +1,000
              </button>
              <button
                type="button"
                onClick={() => adjustBalance(5000)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10"
              >
                +5,000
              </button>
              <button
                type="button"
                onClick={() => setBalanceInput("0")}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:bg-white/10"
              >
                تصفير
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveBalance}
              disabled={isUpdating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50"
            >
              {isUpdating && <Loader2 size={14} className="animate-spin" />}
              حفظ الرصيد الجديد في قاعدة البيانات
            </button>
          </div>

          {/* Admin Role Toggle Section */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  userIsAdmin
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {userIsAdmin ? <ShieldCheck size={20} /> : <Shield size={20} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  صلاحية الإدارة العليا (Admin)
                </h4>
                <p className="text-[11px] text-slate-400">
                  {userIsAdmin
                    ? "المستخدم مسؤول حالياً ولديه حق دخول لوحة التحكم"
                    : "حساب عميل عادي لا يملك حق الوصول للوحة الإدارة"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleAdmin}
              disabled={isTogglingAdmin}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 ${
                userIsAdmin
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25"
              }`}
            >
              {isTogglingAdmin && <Loader2 size={13} className="animate-spin" />}
              {userIsAdmin ? "إلغاء صفة المسؤول" : "ترقية لمسؤول (Make Admin)"}
            </button>
          </div>

          {/* Delete Account Section */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] p-4">
            {!isDeleting ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-300">حذف الحساب نهائياً</h4>
                  <p className="text-[11px] text-slate-500">سيتم مسح بيانات المستخدم وبطاقاته</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition"
                >
                  حذف المستخدم
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <ShieldAlert size={16} />
                  <span>هل أنت متأكد من حذف هذا الحساب نهائياً؟</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  هذا الإجراء لا يمكن الرجوع عنه، وسيتم إزالة المستخدم من قاعدة بيانات البنك.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    disabled={isDeletingLoading}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-500 transition disabled:opacity-50"
                  >
                    {isDeletingLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    نعم، احذف الحساب الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleting(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
