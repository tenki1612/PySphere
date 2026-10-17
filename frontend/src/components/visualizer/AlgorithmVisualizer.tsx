"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useLessonStore } from "@/store/useLessonStore";

interface Step {
  array: number[];
  comparing: number[];
  swapped: number[];
  sorted: number[];
  description: string;
}

export function AlgorithmVisualizer() {
  const [algorithm, setAlgorithm] = useState<"bubble" | "selection" | "insertion">("bubble");
  const [array, setArray] = useState<number[]>([35, 12, 68, 45, 90, 22, 54, 8, 77, 41]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(400);

  const theme = useLessonStore((s) => s.theme);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array
  const generateNewArray = useCallback(() => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    setCurrentStepIndex(0);
  }, []);

  // Pre-calculate all animation steps for the chosen algorithm
  const generateSteps = useCallback((arr: number[], algo: string): Step[] => {
    const list = [...arr];
    const generated: Step[] = [
      {
        array: [...list],
        comparing: [],
        swapped: [],
        sorted: [],
        description: "Mảng ban đầu chưa sắp xếp.",
      },
    ];

    if (algo === "bubble") {
      const n = list.length;
      const sortedIdxs: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          generated.push({
            array: [...list],
            comparing: [j, j + 1],
            swapped: [],
            sorted: [...sortedIdxs],
            description: `So sánh cặp phần tử tại vị trí [${j}] (${list[j]}) và [${j + 1}] (${list[j + 1]}).`,
          });

          if (list[j] > list[j + 1]) {
            const temp = list[j];
            list[j] = list[j + 1];
            list[j + 1] = temp;

            generated.push({
              array: [...list],
              comparing: [],
              swapped: [j, j + 1],
              sorted: [...sortedIdxs],
              description: `Hoán đổi ${list[j + 1]} và ${list[j]} vì ${list[j + 1]} > ${list[j]}.`,
            });
          }
        }
        sortedIdxs.push(n - i - 1);
      }
      sortedIdxs.push(0);
      generated.push({
        array: [...list],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        description: "Hoàn tất! Toàn bộ mảng đã được sắp xếp tăng dần.",
      });
    } else if (algo === "selection") {
      const n = list.length;
      const sortedIdxs: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          generated.push({
            array: [...list],
            comparing: [minIdx, j],
            swapped: [],
            sorted: [...sortedIdxs],
            description: `Tìm giá trị nhỏ nhất: so sánh min hiện tại [${minIdx}] (${list[minIdx]}) với [${j}] (${list[j]}).`,
          });
          if (list[j] < list[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const temp = list[i];
          list[i] = list[minIdx];
          list[minIdx] = temp;
          generated.push({
            array: [...list],
            comparing: [],
            swapped: [i, minIdx],
            sorted: [...sortedIdxs],
            description: `Đưa giá trị nhỏ nhất (${list[i]}) về đúng vị trí đầu đoạn chưa xếp [${i}].`,
          });
        }
        sortedIdxs.push(i);
      }
      generated.push({
        array: [...list],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        description: "Hoàn tất Selection Sort! Mảng đã được sắp xếp thành công.",
      });
    } else if (algo === "insertion") {
      const n = list.length;
      for (let i = 1; i < n; i++) {
        const key = list[i];
        let j = i - 1;
        generated.push({
          array: [...list],
          comparing: [i],
          swapped: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          description: `Chọn phần tử key = ${key} tại vị trí [${i}] để chèn vào đoạn đã sắp xếp [0..${i - 1}].`,
        });

        while (j >= 0 && list[j] > key) {
          generated.push({
            array: [...list],
            comparing: [j, j + 1],
            swapped: [],
            sorted: Array.from({ length: i }, (_, k) => k),
            description: `So sánh ${list[j]} > ${key}: dịch chuyển ${list[j]} sang phải vị trí [${j + 1}].`,
          });

          list[j + 1] = list[j];
          generated.push({
            array: [...list],
            comparing: [],
            swapped: [j + 1],
            sorted: Array.from({ length: i }, (_, k) => k),
            description: `Đã dịch chuyển ${list[j + 1]} sang [${j + 1}].`,
          });
          j--;
        }
        list[j + 1] = key;
        generated.push({
          array: [...list],
          comparing: [],
          swapped: [j + 1],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Chèn ${key} vào vị trí thích hợp [${j + 1}].`,
        });
      }
      generated.push({
        array: [...list],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        description: "Hoàn tất Insertion Sort! Toàn bộ mảng đã được sắp xếp tăng dần.",
      });
    }

    return generated;
  }, []);

  // Recalculate steps when array or algorithm changes
  useEffect(() => {
    const s = generateSteps(array, algorithm);
    setSteps(s);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [array, algorithm, generateSteps]);

  // Handle Play/Pause timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  // Draw on HTML5 Canvas (dynamic theme styling)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    const step = steps[currentStepIndex] || steps[0];
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = isDark ? "#111827" : "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    const count = step.array.length;
    const spacing = 12;
    const barWidth = (width - spacing * (count + 1)) / count;
    const maxVal = Math.max(...step.array, 100);

    step.array.forEach((val, idx) => {
      const barHeight = (val / maxVal) * (height - 80);
      const x = spacing + idx * (barWidth + spacing);
      const y = height - barHeight - 40;

      // Color coding (high contrast on both light and dark)
      if (step.sorted.includes(idx)) {
        ctx.fillStyle = isDark ? "#10b981" : "#059669"; // Emerald: Sorted
      } else if (step.swapped.includes(idx)) {
        ctx.fillStyle = isDark ? "#f43f5e" : "#e11d48"; // Rose: Swapped
      } else if (step.comparing.includes(idx)) {
        ctx.fillStyle = isDark ? "#f59e0b" : "#d97706"; // Amber: Comparing
      } else {
        ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7"; // Sky: Normal
      }

      // Draw rounded bar
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 6);
      ctx.fill();

      // Draw value text
      ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(val), x + barWidth / 2, y - 8);

      // Draw index text below
      ctx.fillStyle = isDark ? "#9ca3af" : "#64748b";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(`[${idx}]`, x + barWidth / 2, height - 15);
    });
  }, [steps, currentStepIndex, theme]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-4 transition-colors">
      {/* Visualizer Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-brand-border/60 pb-3 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Thuật toán:
          </span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="rounded-md border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <option value="bubble">Bubble Sort (Sắp xếp nổi bọt)</option>
            <option value="selection">Selection Sort (Sắp xếp chọn)</option>
            <option value="insertion">Insertion Sort (Sắp xếp chèn)</option>
          </select>

          <button
            onClick={generateNewArray}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition"
            title="Tạo mảng ngẫu nhiên mới"
          >
            <Shuffle className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            Đổi mảng
          </button>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 dark:bg-sky-400" /> Bình thường
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Đang so sánh
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Hoán đổi
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Đã xếp
          </span>
        </div>
      </div>

      {/* HTML5 Canvas Rendering Area */}
      <div className="relative my-3 flex-1 overflow-hidden rounded-md border border-gray-200 dark:border-brand-border/40 bg-slate-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <canvas
          ref={canvasRef}
          width={700}
          height={280}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Step Description Box */}
      <div className="rounded-md bg-slate-100 dark:bg-brand-dark/80 border border-gray-200 dark:border-brand-border/40 p-2.5 text-xs text-slate-800 dark:text-gray-200 transition-colors">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Bước {currentStepIndex + 1}/{steps.length || 1}:{" "}
        </span>
        {currentStep?.description || "Sẵn sàng mô phỏng thuật toán."}
      </div>

      {/* Playback Controls & Speed Slider */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-border/40 hover:text-gray-900 dark:hover:text-white transition"
            title="Quay về đầu"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentStepIndex === 0}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-border/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition"
            title="Lùi một bước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Tạm dừng
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Tự động chạy
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
            }}
            disabled={currentStepIndex >= steps.length - 1}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-border/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition"
            title="Tiến một bước"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Tốc độ:</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={1100 - speedMs}
            onChange={(e) => setSpeedMs(1100 - Number(e.target.value))}
            className="h-1.5 w-24 cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
