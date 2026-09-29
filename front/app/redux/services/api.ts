import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface TransactionItem {
  _id: string;
  user: string;
  amount: number;
  type: string;
  date: string;
  createdAt: string;
  receiver?: {
    _id: string;
    name: string;
    email: string;
  };
  description?: string;
}

export interface CardData {
  _id: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  balance: number;
  user: string;
}

export interface NotificationItem {
  _id: string;
  user: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  role?: string;
  isAdmin?: boolean;
  createdAt: string;
  Card?: CardData[];
  card?: CardData | null;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  role?: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCard {
  _id: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  balance: number;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminTransaction {
  _id: string;
  amount: number;
  type: string;
  date: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  receiver?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  description?: string;
  createdAt: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      let token = state?.auth?.token;

      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Card", "Transactions", "Notifications", "AdminUsers", "AdminCards", "AdminTransactions"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<
      { success: boolean; accessToken: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Card", "Transactions", "Notifications"],
    }),

    register: builder.mutation<
      { success: boolean; accessToken: string; user: any },
      { name: string; email: string; password: string; phone?: string; balance: number }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Card", "Transactions", "Notifications"],
    }),

    // User Profile
    getMe: builder.query<UserProfileResponse, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<
      { success: boolean; data: any; user: any },
      { name?: string; email?: string; phone?: string }
    >({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Card
    getMyCard: builder.query<CardData | null, void>({
      query: () => "/cards/my-card",
      providesTags: ["Card"],
    }),

    createCard: builder.mutation<CardData, void>({
      query: () => ({
        url: "/cards",
        method: "POST",
      }),
      invalidatesTags: ["Card", "User"],
    }),

    // Account Transactions
    getTransactions: builder.query<TransactionItem[], void>({
      query: () => "/transactions",
      providesTags: ["Transactions"],
    }),

    deposit: builder.mutation<{ success: boolean; balance: number; message: string }, { amount: number }>({
      query: (body) => ({
        url: "/transactions/deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Transactions", "Notifications"],
    }),

    withdraw: builder.mutation<{ success: boolean; balance: number; message: string }, { amount: number }>({
      query: (body) => ({
        url: "/transactions/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Transactions", "Notifications"],
    }),

    // Transfer
    transfer: builder.mutation<
      { success: boolean; message: string; senderBalance: number },
      { amount: number; email?: string; receiverEmail?: string; receiverId?: string }
    >({
      query: (body) => ({
        url: "/transfers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Transactions", "Notifications"],
    }),

    // Card Transactions
    transferToCard: builder.mutation<
      { success: boolean; userBalance: number; cardBalance: number; message: string },
      { amount: number; cardId?: string }
    >({
      query: ({ amount, cardId }) => ({
        url: cardId ? `/card-transactions/transfer-to-card/${cardId}` : "/card-transactions/transfer-to-card",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["User", "Card", "Transactions", "Notifications"],
    }),

    transferToAccount: builder.mutation<
      { success: boolean; userBalance: number; cardBalance: number; message: string },
      { amount: number; cardId?: string }
    >({
      query: ({ amount, cardId }) => ({
        url: cardId ? `/card-transactions/transfer-to-account/${cardId}` : "/card-transactions/transfer-to-account",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["User", "Card", "Transactions", "Notifications"],
    }),

    depositToCard: builder.mutation<
      { success: boolean; cardBalance: number; message: string },
      { amount: number; cardId?: string }
    >({
      query: ({ amount, cardId }) => ({
        url: cardId ? `/card-transactions/deposit/${cardId}` : "/card-transactions/deposit",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Card", "Transactions", "Notifications"],
    }),

    withdrawFromCard: builder.mutation<
      { success: boolean; cardBalance: number; message: string },
      { amount: number; cardId?: string }
    >({
      query: ({ amount, cardId }) => ({
        url: cardId ? `/card-transactions/withdraw/${cardId}` : "/card-transactions/withdraw",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Card", "Transactions", "Notifications"],
    }),

    // Notifications
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),

    markNotificationRead: builder.mutation<NotificationItem, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<{ id: string; message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Stripe Deposits
    createStripeDeposit: builder.mutation<{ success: boolean; url: string }, { amount: number }>({
      query: (body) => ({
        url: "/deposits/stripe",
        method: "POST",
        body,
      }),
    }),

    verifyDeposit: builder.query<{ success: boolean; balance?: number }, { success: string; amount: string }>({
      query: ({ success, amount }) => `/deposits/verify?success=${success}&amount=${amount}`,
      providesTags: ["User", "Transactions", "Notifications"],
    }),

    // Admin Endpoints
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => "/admin/users",
      providesTags: ["AdminUsers"],
    }),

    deleteAdminUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers", "AdminCards", "AdminTransactions"],
    }),

    updateAdminUserBalance: builder.mutation<
      { message: string; balance: number },
      { id: string; balance: number }
    >({
      query: ({ id, balance }) => ({
        url: `/admin/users/${id}/balance`,
        method: "PUT",
        body: { balance },
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    getAdminCards: builder.query<AdminCard[], void>({
      query: () => "/admin/cards",
      providesTags: ["AdminCards"],
    }),

    getAdminTransactions: builder.query<AdminTransaction[], void>({
      query: () => "/admin/transactions",
      providesTags: ["AdminTransactions"],
    }),

    makeIsAdmin: builder.mutation<
      { success: boolean; message: string; isAdmin: boolean },
      { id: string; isAdmin?: boolean }
    >({
      query: ({ id, isAdmin = true }) => ({
        url: `/admin/users/${id}/admin`,
        method: "PUT",
        body: { isAdmin },
      }),
      invalidatesTags: ["AdminUsers", "User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetMyCardQuery,
  useCreateCardMutation,
  useGetTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useTransferMutation,
  useTransferToCardMutation,
  useTransferToAccountMutation,
  useDepositToCardMutation,
  useWithdrawFromCardMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
  useCreateStripeDepositMutation,
  useLazyVerifyDepositQuery,
  useGetAdminUsersQuery,
  useDeleteAdminUserMutation,
  useUpdateAdminUserBalanceMutation,
  useGetAdminCardsQuery,
  useGetAdminTransactionsQuery,
  useMakeIsAdminMutation,
} = apiSlice;

