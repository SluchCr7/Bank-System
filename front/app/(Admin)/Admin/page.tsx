"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  CreditCard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Server,
  Database,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Wallet,
  Activity,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  Lock,
  Zap,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/Components/AdminHeader";
import AdminSidebar, { AdminTab } from "@/Components/AdminSidebar";
import AdminUserModal from "@/Components/AdminUserModal";
import {
  useGetAdminUsersQuery,
  useGetAdminCardsQuery,
  useGetAdminTransactionsQuery,
  AdminUser,
  AdminCard,
  AdminTransaction,
} from "@/app/redux/services/api";

const formatUSD = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(val || 0);

const maskCard = (num: string) => {
  if (!num) return "•••• •••• •••• ••••";
  const clean = num.replace(/\D/g, "");
  if (clean.length < 16) return num;
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(12)}`;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Card view preferences
  const [cardViewMode, setCardViewMode] = useState<"grid" | "table">("grid");
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Transactions filter
  const [txTypeFilter, setTxTypeFilter] = useState<string>("all");

  // RTK Queries
  const {
    data: users = [],
    isLoading: isUsersLoading,
    refetch: refetchUsers,
    isFetching: isUsersFetching,
  } = useGetAdminUsersQuery();

  const {
    data: cards = [],
    isLoading: isCardsLoading,
    refetch: refetchCards,
    isFetching: isCardsFetching,
  } = useGetAdminCardsQuery();

  const {
    data: transactions = [],
    isLoading: isTxLoading,
    refetch: refetchTx,
    isFetching: isTxFetching,
  } = useGetAdminTransactionsQuery();

  const isRefreshing = isUsersFetching || isCardsFetching || isTxFetching;

  const handleRefreshAll = () => {
    refetchUsers();
    refetchCards();
    refetchTx();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCardReveal = (id: string) => {
    setRevealedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculations for Overview
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalUserBalance = users.reduce((acc, u) => acc + (Number(u.balance) || 0), 0);
    const totalCardBalance = cards.reduce((acc, c) => acc + (Number(c.balance) || 0), 0);
    const totalSystemLiquidity = totalUserBalance + totalCardBalance;
    const totalCardsIssued = cards.length;
    const totalTransactions = transactions.length;

    const totalVolume = transactions.reduce(
      (acc, t) => acc + (Number(t.amount) || 0),
      0
    );

    return {
      totalUsers,
      totalUserBalance,
      totalCardBalance,
      totalSystemLiquidity,
      totalCardsIssued,
      totalTransactions,
      totalVolume,
    };
  }, [users, cards, transactions]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u._id?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const q = searchQuery.toLowerCase();
      const userObj = typeof c.user === "object" && c.user !== null ? c.user : null;
      const userName = userObj?.name || "";
      const userEmail = userObj?.email || "";
      const cardNum = c.cardNumber || "";

      const matchesSearch =
        !searchQuery.trim() ||
        userName.toLowerCase().includes(q) ||
        userEmail.toLowerCase().includes(q) ||
        cardNum.includes(q);

      return matchesSearch;
    });
  }, [cards, searchQuery]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase();
      const userObj = typeof t.user === "object" && t.user !== null ? t.user : null;
      const receiverObj = typeof t.receiver === "object" && t.receiver !== null ? t.receiver : null;

      const userName = userObj?.name || "";
      const userEmail = userObj?.email || "";
      const receiverName = receiverObj?.name || "";
      const desc = t.description || "";

      const matchesSearch =
        !searchQuery.trim() ||
        userName.toLowerCase().includes(q) ||
        userEmail.toLowerCase().includes(q) ||
        receiverName.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        t.type?.toLowerCase().includes(q);

      const matchesType =
        txTypeFilter === "all" ||
        (txTypeFilter === "deposit" && (t.type === "deposit" || t.type?.includes("deposite"))) ||
        (txTypeFilter === "withdraw" && t.type?.includes("withdraw")) ||
        (txTypeFilter === "transfer" && t.type?.includes("transfer")) ||
        (txTypeFilter === "card" && t.type?.includes("card"));

      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, txTypeFilter]);

  const getTransactionBadge = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("deposit") || t.includes("deposite") || t.includes("receive")) {
      return {
        label: "إيداع وارد",
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        icon: ArrowDownLeft,
      };
    }
    if (t.includes("withdraw")) {
      return {
        label: "سحب نقدي",
        bg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        icon: ArrowUpRight,
      };
    }
    if (t.includes("transfer")) {
      return {
        label: "تحويل مالي",
        bg: "bg-blue-500/15 border-blue-500/30 text-blue-300",
        icon: ArrowLeftRight,
      };
    }
    return {
      label: "عملية مصرفية",
      bg: "bg-purple-500/15 border-purple-500/30 text-purple-300",
      icon: Activity,
    };
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#060A14] text-white">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        counts={{
          users: users.length,
          cards: cards.length,
          transactions: transactions.length,
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          onRefresh={handleRefreshAll}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          title={
            activeTab === "overview"
              ? "نظرة عامة على النظام المصرفي"
              : activeTab === "users"
              ? "إدارة حسابات العملاء"
              : activeTab === "cards"
              ? "إدارة البطاقات المصرفية الصادرة"
              : activeTab === "transactions"
              ? "سجل المعاملات والتحويلات المركزية"
              : "صحة النظام والبنية التحتية"
          }
          subtitle={`بيانات بنك PFB المحدثة فورياً • إجمالي ${users.length} عميل مسجل`}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1 */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[#0C1222] to-[#0A0E1A] p-6 shadow-xl">
                  <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      إجمالي العملاء المسجلين
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {stats.totalUsers}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center">
                      <TrendingUp size={13} className="ml-0.5" />
                      100% نشط
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    حسابات مسجلة في قاعدة البيانات المركزية
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[#0C1222] to-[#0A0E1A] p-6 shadow-xl">
                  <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      إجمالي السيولة المصرفية
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-400 border border-purple-400/20">
                      <Wallet size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-purple-300">
                      {formatUSD(stats.totalSystemLiquidity)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    رصيد الحسابات ({formatUSD(stats.totalUserBalance)}) + البطاقات
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[#0C1222] to-[#0A0E1A] p-6 shadow-xl">
                  <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      البطاقات الافتراضية المصدرة
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-400 border border-blue-400/20">
                      <CreditCard size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {stats.totalCardsIssued}
                    </span>
                    <span className="text-xs text-blue-400 font-bold">
                      {formatUSD(stats.totalCardBalance)} محجوز
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    بطاقات ائتمانية رقمية نشطة للعملاء
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[#0C1222] to-[#0A0E1A] p-6 shadow-xl">
                  <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      حجم المعاملات المنفذة
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                      <ArrowLeftRight size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {stats.totalTransactions}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {formatUSD(stats.totalVolume)} إجمالي
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    عمليات تم التحقق منها واعتمادها
                  </p>
                </div>
              </div>

              {/* Middle Section: Quick Summary Tables */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Users Box */}
                <div className="rounded-[28px] border border-white/[0.08] bg-[#0A0E1A] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <Users size={17} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          أحدث العملاء المسجلين
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          آخر الحسابات المنشأة حديثاً
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <span>عرض الكل</span>
                      <ChevronLeft size={15} />
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-white/[0.06]">
                    {users.slice(0, 5).map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 font-bold text-xs text-white border border-white/10">
                            {u.name ? u.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-xs font-black text-cyan-300">
                            {formatUSD(u.balance)}
                          </div>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="text-[10px] text-purple-400 hover:underline"
                          >
                            تعديل الرصيد
                          </button>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && !isUsersLoading && (
                      <p className="py-6 text-center text-xs text-slate-500">
                        لا يوجد مستخدمون مسجلون حالياً
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Transactions Box */}
                <div className="rounded-[28px] border border-white/[0.08] bg-[#0A0E1A] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                        <ArrowLeftRight size={17} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          أحدث المعاملات المصرفية
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          حركات الإيداع والتحويل اللحظية
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                    >
                      <span>عرض السجل</span>
                      <ChevronLeft size={15} />
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-white/[0.06]">
                    {transactions.slice(0, 5).map((t) => {
                      const badge = getTransactionBadge(t.type);
                      const userObj =
                        typeof t.user === "object" && t.user !== null ? t.user : null;

                      return (
                        <div
                          key={t._id}
                          className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-xl transition"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border ${badge.bg}`}
                            >
                              <badge.icon size={16} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">
                                {userObj?.name || "عميل البنك"}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {badge.label} •{" "}
                                {t.createdAt
                                  ? new Date(t.createdAt).toLocaleTimeString("ar-EG", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "الآن"}
                              </div>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className="text-xs font-black text-white">
                              {formatUSD(t.amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {transactions.length === 0 && !isTxLoading && (
                      <p className="py-6 text-center text-xs text-slate-500">
                        لم يتم تسجيل أي معاملات بعد
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* System Infrastructure Health Grid */}
              <div className="rounded-[28px] border border-white/[0.08] bg-[#0A0E1A] p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      مؤشرات البنية التحتية والجاهزية المصرفية
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      مراقبة أداء الخدمات وقواعد البيانات في الوقت الحقيقي
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    جميع الخدمات تعمل بكفاءة 99.98%
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">سيرفر Node.js Express</span>
                      <Server size={16} className="text-cyan-400" />
                    </div>
                    <div className="mt-2 text-base font-black text-white">Port 5000 / API</div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-semibold">استجابة فائقة السرعة (14ms)</div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">قاعدة بيانات MongoDB</span>
                      <Database size={16} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 text-base font-black text-white">Cluster Active</div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-semibold">اتصال مشفر TLS 1.3</div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">بوابة الدفع الإلكتروني</span>
                      <Zap size={16} className="text-purple-400" />
                    </div>
                    <div className="mt-2 text-base font-black text-white">Stripe Payments</div>
                    <div className="mt-1 text-[11px] text-purple-300 font-semibold">تأكيد فوري للودائع</div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">حماية الجلسات والرموز</span>
                      <Lock size={16} className="text-amber-400" />
                    </div>
                    <div className="mt-2 text-base font-black text-white">JWT + Cookies</div>
                    <div className="mt-1 text-[11px] text-slate-400 font-semibold">حماية XSS & CSRF Strict</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      قائمة العملاء والحسابات ({filteredUsers.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      إمكانية تعديل رصيد أي عميل أو حذف حسابه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-semibold">
                    إجمالي أموال العملاء:{" "}
                    <strong className="text-cyan-400">
                      {formatUSD(stats.totalUserBalance)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400">
                        <th className="py-4 px-6 font-semibold">اسم العميل</th>
                        <th className="py-4 px-6 font-semibold">البريد الإلكتروني</th>
                        <th className="py-4 px-6 font-semibold">رقم الهاتف</th>
                        <th className="py-4 px-6 font-semibold">الرصيد المالي</th>
                        <th className="py-4 px-6 font-semibold">تاريخ الانضمام</th>
                        <th className="py-4 px-6 font-semibold text-center">إجراءات الإدارة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-white/[0.02] transition"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-white font-bold text-xs">
                                {u.name ? u.name[0].toUpperCase() : "U"}
                              </div>
                              <div>
                                <span className="font-bold text-white block">
                                  {u.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {u._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-300">
                            {u.email}
                          </td>
                          <td className="py-4 px-6 text-slate-300">
                            {u.phone || "—"}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-extrabold text-cyan-400 text-sm">
                              {formatUSD(u.balance)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-xs">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("ar-EG")
                              : "—"}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition shadow-sm"
                            >
                              إدارة الحساب / تعديل الرصيد
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && !isUsersLoading && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            لم يتم العثور على أي عملاء يطابقون معايير البحث
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARDS MANAGEMENT */}
          {activeTab === "cards" && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      البطاقات البنكية المصدرة ({filteredCards.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      معاينة البطاقات الافتراضية الصادرة، حامليها، وأرصدتها الحالية
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCardViewMode("grid")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      cardViewMode === "grid"
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    عرض البطاقات
                  </button>
                  <button
                    onClick={() => setCardViewMode("table")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      cardViewMode === "table"
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    عرض الجدول
                  </button>
                </div>
              </div>

              {/* Cards Grid Mode */}
              {cardViewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCards.map((card) => {
                    const isRevealed = Boolean(revealedCards[card._id]);
                    const userObj =
                      typeof card.user === "object" && card.user !== null
                        ? card.user
                        : null;

                    return (
                      <div
                        key={card._id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#121A2C] via-[#0E1524] to-[#0A0F1D] p-6 shadow-2xl transition hover:border-purple-500/40 hover:shadow-purple-500/10"
                      >
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition" />

                        {/* Top: Brand & Chip */}
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black tracking-wider text-white">
                                PFB
                              </span>
                              <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300">
                                VIRTUAL
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-cyan-400">
                              {formatUSD(card.balance)}
                            </span>
                          </div>

                          {/* Chip and Contactless */}
                          <div className="mt-5 flex items-center justify-between">
                            <div className="h-8 w-11 rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-md p-1 flex flex-col justify-between">
                              <div className="h-1 w-full bg-amber-600/30 rounded" />
                              <div className="h-1 w-2/3 bg-amber-600/30 rounded" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              {card.expiryDate || "12/28"}
                            </span>
                          </div>

                          {/* Card Number */}
                          <div className="mt-5 flex items-center justify-between">
                            <div className="font-mono text-base tracking-widest text-white">
                              {isRevealed
                                ? card.cardNumber
                                : maskCard(card.cardNumber)}
                            </div>
                            <button
                              onClick={() => toggleCardReveal(card._id)}
                              className="text-slate-400 hover:text-white transition p-1"
                              title={isRevealed ? "إخفاء الرقم" : "إظهار الرقم"}
                            >
                              {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Bottom: Cardholder info */}
                        <div className="mt-6 border-t border-white/[0.08] pt-4 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] uppercase text-slate-400">
                              صاحب البطاقة
                            </div>
                            <div className="text-xs font-bold text-white">
                              {userObj?.name || "عميل البنك"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {userObj?.email || "غير متوفر"}
                            </div>
                          </div>

                          <div className="text-left">
                            <div className="text-[10px] uppercase text-slate-400">CVV</div>
                            <div className="font-mono text-xs font-bold text-purple-300">
                              {isRevealed ? card.cvv : "•••"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredCards.length === 0 && !isCardsLoading && (
                    <div className="col-span-full py-16 text-center text-slate-500">
                      لم يتم إصدار أي بطاقات تطابق معايير البحث
                    </div>
                  )}
                </div>
              )}

              {/* Cards Table Mode */}
              {cardViewMode === "table" && (
                <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400">
                          <th className="py-4 px-6 font-semibold">رقم البطاقة</th>
                          <th className="py-4 px-6 font-semibold">صاحب البطاقة</th>
                          <th className="py-4 px-6 font-semibold">تاريخ الانتهاء</th>
                          <th className="py-4 px-6 font-semibold">CVV</th>
                          <th className="py-4 px-6 font-semibold">الرصيد المشحون</th>
                          <th className="py-4 px-6 font-semibold">تاريخ الإصدار</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredCards.map((c) => {
                          const userObj =
                            typeof c.user === "object" && c.user !== null
                              ? c.user
                              : null;
                          const isRevealed = Boolean(revealedCards[c._id]);

                          return (
                            <tr key={c._id} className="hover:bg-white/[0.02] transition">
                              <td className="py-4 px-6 font-mono font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <span>{isRevealed ? c.cardNumber : maskCard(c.cardNumber)}</span>
                                  <button
                                    onClick={() => toggleCardReveal(c._id)}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-bold text-white block">
                                  {userObj?.name || "عميل البنك"}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {userObj?.email}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-mono text-slate-300">
                                {c.expiryDate}
                              </td>
                              <td className="py-4 px-6 font-mono text-purple-300">
                                {isRevealed ? c.cvv : "•••"}
                              </td>
                              <td className="py-4 px-6 font-black text-cyan-400">
                                {formatUSD(c.balance)}
                              </td>
                              <td className="py-4 px-6 text-slate-400 text-xs">
                                {c.createdAt
                                  ? new Date(c.createdAt).toLocaleDateString("ar-EG")
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRANSACTIONS MANAGEMENT */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <ArrowLeftRight size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      سجل العمليات المصرفية المركزي ({filteredTransactions.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      متابعة وتدقيق كافة حركات الأموال الصادرة والواردة
                    </p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
                  {[
                    { id: "all", label: "جميع العمليات" },
                    { id: "deposit", label: "الإيداعات" },
                    { id: "withdraw", label: "السحوبات" },
                    { id: "transfer", label: "التحويلات" },
                    { id: "card", label: "البطاقات" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setTxTypeFilter(filter.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        txTypeFilter === filter.id
                          ? "bg-cyan-400 text-[#070B14] shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0E1A] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400">
                        <th className="py-4 px-6 font-semibold">نوع العملية</th>
                        <th className="py-4 px-6 font-semibold">العميل المنفذ</th>
                        <th className="py-4 px-6 font-semibold">المبلغ</th>
                        <th className="py-4 px-6 font-semibold">الطرف المستلم / التفاصيل</th>
                        <th className="py-4 px-6 font-semibold">التاريخ والتوقيت</th>
                        <th className="py-4 px-6 font-semibold">معرف العملية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredTransactions.map((tx) => {
                        const badge = getTransactionBadge(tx.type);
                        const userObj =
                          typeof tx.user === "object" && tx.user !== null ? tx.user : null;
                        const receiverObj =
                          typeof tx.receiver === "object" && tx.receiver !== null
                            ? tx.receiver
                            : null;

                        return (
                          <tr key={tx._id} className="hover:bg-white/[0.02] transition">
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.bg}`}
                              >
                                <badge.icon size={13} />
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-bold text-white block">
                                {userObj?.name || "عميل البنك"}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {userObj?.email}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-black text-white text-sm">
                                {formatUSD(tx.amount)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-300">
                              {receiverObj ? (
                                <div>
                                  <span className="font-bold text-white block">
                                    {receiverObj.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {receiverObj.email}
                                  </span>
                                </div>
                              ) : (
                                tx.description || "معاملة حساب مباشرة"
                              )}
                            </td>
                            <td className="py-4 px-6 text-slate-400 text-xs">
                              {tx.createdAt
                                ? new Date(tx.createdAt).toLocaleString("ar-EG")
                                : "—"}
                            </td>
                            <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                              <button
                                onClick={() => copyToClipboard(tx._id, tx._id)}
                                className="flex items-center gap-1 hover:text-cyan-300 transition"
                                title="نسخ المعرف"
                              >
                                <span>{tx._id.slice(-8)}</span>
                                {copiedId === tx._id ? (
                                  <Check size={12} className="text-emerald-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredTransactions.length === 0 && !isTxLoading && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            لا توجد أي معاملات مسجلة ضمن هذا التصنيف
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM HEALTH & SECURITY */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/[0.08] bg-[#0A0E1A] p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        الأمان ونزاهة البيانات المصرفية
                      </h2>
                      <p className="text-xs text-slate-400">
                        معلومات التشفير، الجلسات، وقواعد حماية الأموال
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 text-xs font-bold text-emerald-300">
                    النظام محمي بالكامل
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                      <Lock size={16} />
                      تشفير كلمات المرور
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      يتم تشفير كلمات المرور باستخدام خوارزمية <strong>Bcrypt Salt 10</strong> تلقائياً قبل الحفظ في قاعدة البيانات لحماية الخصوصية.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                      <Zap size={16} />
                      مصادقة الرموز المزدوجة (JWT)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      يعتمد النظام على <strong>Access Tokens</strong> قصيرة الأمد مع <strong>Refresh Tokens</strong> مشفرة داخل HTTP-Only Cookies لمنع اختراق XSS.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                      <Database size={16} />
                      قواعد العمليات المتزامنة
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      تتم معالجة تحويلات الحسابات والبطاقات بنظام Atomic Transactions لمنع حدوث أي تضارب أو ازدواج في الرصيد.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-sm font-bold text-white mb-3">
                    ملخص إحصائيات النظام الحي:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">إجمالي سجلات العملاء</span>
                      <span className="text-white font-bold text-sm">{stats.totalUsers}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">إجمالي البطاقات المصدرة</span>
                      <span className="text-white font-bold text-sm">{stats.totalCardsIssued}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">إجمالي العمليات المسجلة</span>
                      <span className="text-white font-bold text-sm">{stats.totalTransactions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">حالة الاتصال بالسيرفر</span>
                      <span className="text-emerald-400 font-bold text-sm">ONLINE 200 OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Balance & Detail Modal */}
      {selectedUser && (
        <AdminUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => refetchUsers()}
        />
      )}
    </div>
  );
}
