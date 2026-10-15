import { create } from "zustand";

interface UserState {
  id?: number;
  username?: string;
  email?: string;
  xp: number;
  streak_count: number;
}

interface LessonStore {
  user: UserState | null;
  activeDay: number;
  draftCode: string;
  activeTab: "code" | "visualizer";
  setUser: (user: UserState | null) => void;
  updateXpAndStreak: (xpEarned: number, streak: number) => void;
  setActiveDay: (day: number) => void;
  setDraftCode: (code: string) => void;
  setActiveTab: (tab: "code" | "visualizer") => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  user: {
    xp: 0,
    streak_count: 0,
  },
  activeDay: 1,
  draftCode: "",
  activeTab: "code",
  setUser: (user) => set({ user }),
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
}));

