import {
  CreditCard,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { Notification, QuickAction, Transaction } from "./type";


export const navLinks: { name: string; href: string }[] = [
  { name: "الرئيسية", href: "/Pages/Dashboard" },
  { name: "المعاملات", href: "/Pages/Transactions" },
  { name: "التحويل", href: "/Pages/Transfer" },
  { name: "الملف الشخصي", href: "/Pages/Profile" },
  { name: "بطاقتي", href: "/Pages/Mycard" },
];


export const transactions : Transaction[] = [
  {
    id: 1,
    title: "إيداع في الحساب",
    subtitle: "اليوم، 10:45 ص",
    amount: "+ 2,500.00",
    type: "ايداع",
    status: "مكتملة",
  },
  {
    id: 2,
    title: "تحويل إلى البطاقة",
    subtitle: "أمس، 06:20 م",
    amount: "- 850.00",
    type: "تحويل",
    status: "مكتملة",
  },
  {
    id: 3,
    title: "عملية شراء إلكترونية",
    subtitle: "24 سبتمبر، 02:15 م",
    amount: "- 320.00",
    type: "شراء",
    status: "مكتملة",
  },
  {
    id: 4,
    title: "تحويل وارد",
    subtitle: "23 سبتمبر، 11:30 ص",
    amount: "+ 1,200.00",
    type: "تحويل",
    status: "مكتملة",
  },
];

export const quickActions : QuickAction[] = [
  {
    id: "deposit",
    title: "إيداع",
    description: "أضف أموالًا لحسابك",
    icon: ArrowDownToLine,
    color: "cyan",
  },
  {
    id: "withdraw",
    title: "سحب",
    description: "اسحب من رصيدك",
    icon: ArrowUpFromLine,
    color: "blue",
  },
  {
    id: "toCard",
    title: "شحن البطاقة",
    description: "حوّل إلى بطاقتك",
    icon: CreditCard,
    color: "violet",
  },
  {
    id: "toAccount",
    title: "تحويل للحساب",
    description: "أعد الأموال لحسابك",
    icon: ArrowLeftRight,
    color: "emerald",
  },
];

export const notifications : Notification[] = [
  {
    id: 1,
    title: "تم تغيير كلمة المرور",
    date: "24 سبتمبر، 02:15 م",
    time: "2 دقيقة",
    subtitle: "تم تغيير كلمة المرور الخاصة بك بنجاح. يرجى تسجيل الدخول مرة أخرى لتصلك البيانات الخاصة بك.",
    state : "مكتملة"
  },
  {
    id: 2,
    title: "تم تغيير كلمة المرور",
    date: "24 سبتمبر، 02:15 م",
    time: "2 دقيقة",
    subtitle: "تم تغيير كلمة المرور الخاصة بك بنجاح. يرجى تسجيل الدخول مرة أخرى لتصلك البيانات الخاصة بك.",
    state : "مكتملة"
  }
]