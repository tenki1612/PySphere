const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pysphere_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("pysphere_token", token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pysphere_token");
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `HTTP Error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Lessons
  getLessons: (stage?: number) => request(stage ? `/lessons?stage=${stage}` : "/lessons"),
  getLesson: (idOrDay: string) => request(`/lessons/${idOrDay}`),

  // Progress & State Persistence
  syncDraft: (lessonId: number, draftCode: string) =>
    request("/progress/sync-draft", {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, draft_code: draftCode }),
    }),

  getProgressSummary: () => request("/progress/summary"),

  // Submissions
  submitSolution: (data: {
    lesson_id: number;
    submitted_code: string;
    status: string;
    execution_time_ms: number;
    tests_passed: number;
    tests_total: number;
  }) =>
    request("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Auth
  register: (data: { email: string; username: string; password: string }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => request("/auth/me"),
};

