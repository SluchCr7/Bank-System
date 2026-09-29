import { LucideIcon } from "lucide-react";

 export interface Transaction {
    id: number;
    title: string;
    subtitle: string;
    amount: string;
    type: "ايداع" | "سحب" | "تحويل" | "شراء";
    status: string;
} 
 
export interface QuickAction  {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: "cyan" | "blue" | "violet" | "emerald";
}

export interface messageState {
    type: "success" | "error";
    text: string;
}

export interface Notification  {
    id: number;
    title: string;
    subtitle: string;
    state: "مكتملة" | "غير مكتملة";
    date: string;
    time : string;
}