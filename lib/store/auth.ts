import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAdmin: false,

      setAuth: (token, user) =>
        set({ token, user, isAdmin: user.role === "admin" }),

      setUser: (user) => set({ user, isAdmin: user.role === "admin" }),

      logout: () => set({ token: null, user: null, isAdmin: false }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "nusafone-auth",
    }
  )
);
