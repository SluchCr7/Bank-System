import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  role?: string;
  isAdmin?: boolean;
  createdAt?: string;
  Card?: any[];
  card?: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string; token?: string }>
    ) => {
      const token = action.payload.accessToken || action.payload.token || state.token;
      state.user = action.payload.user;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("token", token);
        if (action.payload.user)
          localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, updateUser, updateBalance, logout } = authSlice.actions;
export default authSlice.reducer;
