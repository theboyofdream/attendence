import { create } from "zustand";

type AuthStore = {
  user: { email: string, password: string, loggedIn: boolean },
  login: (email: string, password: string) => void,
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: { email: '', password: '', loggedIn: false },
  login: (email: string, password: string) => set((state) => ({ user: { email, password, loggedIn: true } })),
  logout: () => set(() => ({ user: { email: '', password: '', loggedIn: false } }))
}))
