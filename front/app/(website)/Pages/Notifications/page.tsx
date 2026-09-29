"use client";

import React from "react";
import {
  Bell,
  ShieldCheck,
  ChevronLeft,
  Clock,
  CheckCircle2,
  BellRing,
  Loader2,
  Trash2,
  Check,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "@/app/redux/services/api";
import { useAppSelector } from "@/app/redux/hooks";

const NotificationsPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const [markReadApi] = useMarkNotificationReadMutation();
  const [deleteNotificationApi] = useDeleteNotificationMutation();

  const handleMarkRead = async (id: string) => {
    try {
      await markReadApi(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotificationApi(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#070B14] px-4 pb-12 pt-28 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0C1424] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 sm:h-16 sm:w-16">
              <Bell size={28} strokeWidth={1.7} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                الإشعارات المباشرة
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                جميع التنبيهات والعمليات المصرفية الخاصة بحسابك لحظة بلحظة.
              </p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0C1422]">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-6 sm:px-8">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                جميع الإشعارات
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                لديك {notifications.length} إشعار
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-400">
              <BellRing size={20} />
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-white/[0.05]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="mb-3 animate-spin text-cyan-400" size={32} />
                <p className="text-sm">جاري تحميل الإشعارات...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const formattedDate = new Date(
                  notification.createdAt
                ).toLocaleString("ar-EG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      !notification.read && handleMarkRead(notification._id)
                    }
                    className={`group p-5 transition duration-300 sm:p-7 ${
                      notification.read
                        ? "hover:bg-white/[0.02]"
                        : "bg-cyan-500/[0.03] hover:bg-cyan-500/[0.06] cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Icon */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-300 transition duration-300 group-hover:bg-cyan-400/[0.12] sm:h-14 sm:w-14">
                        <ShieldCheck size={24} strokeWidth={1.7} />
                        {!notification.read && (
                          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0C1422] bg-cyan-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Title & State */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-sm font-bold leading-6 text-white sm:text-base">
                            {notification.title}
                          </h3>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                                notification.read
                                  ? "border-white/10 bg-white/5 text-slate-400"
                                  : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              {notification.read ? "مقروء" : "جديد"}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(notification._id, e)}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                              title="حذف الإشعار"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="mt-2.5 text-sm leading-7 text-slate-300">
                          {notification.message}
                        </p>

                        {/* Date & Time */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500">
                          <span className="flex items-center gap-2">
                            <Clock size={15} className="text-cyan-400/70" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      {/* Mark read button if unread */}
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(notification._id)}
                          className="hidden shrink-0 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-[#080F1C] sm:flex sm:items-center sm:gap-1"
                        >
                          <Check size={14} />
                          تحديد كمقروء
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-400">
                  <Bell size={30} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  لا توجد إشعارات حتى الآن
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  ستظهر هنا جميع التنبيهات والعمليات المصرفية الجديدة المنفذة
                  على حسابك.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-slate-500">
          <ShieldCheck size={16} className="text-cyan-400" />
          إشعاراتك المصرفية متصلة ومحدثة بصورة ديناميكية.
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;