import { create } from "zustand";

export interface UserState {
  id?: number;
  username?: string;
  email?: string;
  xp: number;
  streak_count: number;
  is_superuser?: boolean;
  role?: string;
}

interface LessonStore {
  user: UserState | null;
  activeDay: number;
  draftCode: string;
  activeTab: "code" | "visualizer";
  theme: "dark" | "light";
  setUser: (user: UserState | null) => void;
  logout: () => void;
  updateXpAndStreak: (xpEarned: number, streak: number) => void;
  setActiveDay: (day: number) => void;
  setDraftCode: (code: string) => void;
  setActiveTab: (tab: "code" | "visualizer") => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  user: null,
  activeDay: 1,
  draftCode: "",
  activeTab: "code",
  theme: "dark",
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pysphere_token");
    }
    set({ user: null });
  },
  updateXpAndStreak: (xpEarned, streak) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            xp: state.user.xp + xpEarned,
            streak_count: streak,
          }
        : null,
    })),
  setActiveDay: (activeDay) => set({ activeDay }),
  setDraftCode: (draftCode) => set({ draftCode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setTheme: (theme) => set({ theme }),
}));
