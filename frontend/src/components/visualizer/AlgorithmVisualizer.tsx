"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Search,
} from "lucide-react";
import { useLessonStore } from "@/store/useLessonStore";

export type AlgorithmType =
  | "bubble"
  | "selection"
  | "insertion"
  | "binary_search"
  | "linear_search";

interface Step {
  array: number[];
  comparing: number[];
  swapped: number[];
  sorted: number[];
  pointers?: { left?: number; mid?: number; right?: number };
  eliminated?: number[];
  description: string;
}

export function AlgorithmVisualizer() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("bubble");
  const [array, setArray] = useState<number[]>([35, 12, 68, 45, 90, 22, 54, 8, 77, 41]);
  const [searchTarget, setSearchTarget] = useState<number>(45);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(400);

  const theme = useLessonStore((s) => s.theme);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isSearchAlgo = algorithm === "binary_search" || algorithm === "linear_search";

  // Generate random array
  const generateNewArray = useCallback(() => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 11 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    // Pick a random target from the array or nearby
    if (Math.random() > 0.2) {
      setSearchTarget(newArr[Math.floor(Math.random() * newArr.length)]);
    } else {
      setSearchTarget(50);
    }
    setCurrentStepIndex(0);
  }, []);

  // Pre-calculate all animation steps for the chosen algorithm
  const generateSteps = useCallback(
    (arr: number[], algo: AlgorithmType, target: number): Step[] => {
      const list = [...arr];
      const generated: Step[] = [];

      if (algo === "bubble") {
        generated.push({
          array: [...list],
          comparing: [],
          swapped: [],
          sorted: [],
          description: "Mảng ban đầu chưa sắp xếp.",
        });

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
        generated.push({
          array: [...list],
          comparing: [],
          swapped: [],
          sorted: [],
          description: "Mảng ban đầu chưa sắp xếp.",
        });

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
        generated.push({
          array: [...list],
          comparing: [],
          swapped: [],
          sorted: [],
          description: "Mảng ban đầu chưa sắp xếp.",
        });

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
      } else if (algo === "linear_search") {
        generated.push({
          array: [...list],
          comparing: [],
          swapped: [],
          sorted: [],
          description: `Bắt đầu Linear Search: Tìm kiếm giá trị mục tiêu target = ${target} từ trái sang phải.`,
        });

        let foundIndex = -1;
        for (let i = 0; i < list.length; i++) {
          const isMatch = list[i] === target;
          generated.push({
            array: [...list],
            comparing: [i],
            swapped: [],
            sorted: isMatch ? [i] : [],
            eliminated: Array.from({ length: i }, (_, idx) => idx),
            description: `Kiểm tra vị trí [${i}] (giá trị: ${list[i]}): ${
              isMatch
                ? `CHÍNH XÁC! Trùng khớp với target = ${target} sau ${i + 1} bước!`
                : `Khác với target = ${target}, tiếp tục duyệt sang phải.`
            }`,
          });

          if (isMatch) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex === -1) {
          generated.push({
            array: [...list],
            comparing: [],
            swapped: [],
            sorted: [],
            eliminated: Array.from({ length: list.length }, (_, idx) => idx),
            description: `Kết luận: Đã duyệt hết ${list.length} phần tử nhưng không tìm thấy giá trị ${target} trong mảng.`,
          });
        }
      } else if (algo === "binary_search") {
        // Binary search requires sorted array
        const sortedList = [...list].sort((a, b) => a - b);
        generated.push({
          array: [...sortedList],
          comparing: [],
          swapped: [],
          sorted: [],
          description: `Quy tắc Binary Search: Mảng đã được sắp xếp tăng dần trước khi tìm kiếm target = ${target}.`,
        });

        let left = 0;
        let right = sortedList.length - 1;
        let found = false;
        const eliminatedList: number[] = [];

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const midVal = sortedList[mid];

          generated.push({
            array: [...sortedList],
            comparing: [mid],
            swapped: [],
            sorted: midVal === target ? [mid] : [],
            pointers: { left, mid, right },
            eliminated: [...eliminatedList],
            description: `Vùng tìm kiếm [${left}..${right}]. Tính mid = floor((${left} + ${right}) / 2) = [${mid}] (giá trị: ${midVal}). So sánh với target = ${target}.`,
          });

          if (midVal === target) {
            found = true;
            generated.push({
              array: [...sortedList],
              comparing: [],
              swapped: [],
              sorted: [mid],
              pointers: { left, mid, right },
              eliminated: [...eliminatedList],
              description: `TÌM THẤY! Target = ${target} nằm tại vị trí [${mid}] với độ phức tạp tối ưu O(log n)!`,
            });
            break;
          } else if (midVal < target) {
            // Target is in the right half, eliminate left half up to mid
            for (let k = left; k <= mid; k++) {
              if (!eliminatedList.includes(k)) eliminatedList.push(k);
            }
            left = mid + 1;
            generated.push({
              array: [...sortedList],
              comparing: [],
              swapped: [],
              sorted: [],
              pointers: { left, right },
              eliminated: [...eliminatedList],
              description: `Vì ${midVal} < ${target}, loại bỏ nửa bên trái [${left - 1} trở về trước]. Dời con trỏ left sang [${left}].`,
            });
          } else {
            // Target is in the left half, eliminate right half from mid
            for (let k = mid; k <= right; k++) {
              if (!eliminatedList.includes(k)) eliminatedList.push(k);
            }
            right = mid - 1;
            generated.push({
              array: [...sortedList],
              comparing: [],
              swapped: [],
              sorted: [],
              pointers: { left, right },
              eliminated: [...eliminatedList],
              description: `Vì ${midVal} > ${target}, loại bỏ nửa bên phải [${right + 1} trở về sau]. Dời con trỏ right sang [${right}].`,
            });
          }
        }

        if (!found) {
          generated.push({
            array: [...sortedList],
            comparing: [],
            swapped: [],
            sorted: [],
            eliminated: Array.from({ length: sortedList.length }, (_, idx) => idx),
            description: `Kết luận: left (${left}) > right (${right}), giá trị ${target} không tồn tại trong mảng.`,
          });
        }
      }

      return generated;
    },
    []
  );

  // Recalculate steps when array, algorithm, or search target changes
  useEffect(() => {
    const s = generateSteps(array, algorithm, searchTarget);
    setSteps(s);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [array, algorithm, searchTarget, generateSteps]);

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
      const barHeight = (val / maxVal) * (height - 90);
      const x = spacing + idx * (barWidth + spacing);
      const y = height - barHeight - 48;

      const isEliminated = step.eliminated?.includes(idx);

      // Color coding (high contrast on both light and dark)
      if (step.sorted.includes(idx)) {
        ctx.fillStyle = isDark ? "#10b981" : "#059669"; // Emerald: Sorted/Found
      } else if (step.swapped.includes(idx)) {
        ctx.fillStyle = isDark ? "#f43f5e" : "#e11d48"; // Rose: Swapped
      } else if (step.comparing.includes(idx)) {
        ctx.fillStyle = isDark ? "#f59e0b" : "#d97706"; // Amber: Comparing / Mid
      } else if (isEliminated) {
        ctx.fillStyle = isDark ? "#374151" : "#cbd5e1"; // Muted gray: Eliminated in search
      } else {
        ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7"; // Sky: Normal
      }

      // Draw rounded bar
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 6);
      ctx.fill();

      // Draw value text
      ctx.fillStyle = isEliminated
        ? isDark
          ? "#6b7280"
          : "#94a3b8"
        : isDark
        ? "#ffffff"
        : "#0f172a";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(val), x + barWidth / 2, y - 8);

      // Draw pointers labels (L, MID, R for binary search)
      if (step.pointers) {
        if (step.pointers.mid === idx) {
          ctx.fillStyle = isDark ? "#f59e0b" : "#b45309";
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.fillText("MID", x + barWidth / 2, y - 22);
        } else if (step.pointers.left === idx) {
          ctx.fillStyle = isDark ? "#a855f7" : "#7e22ce";
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.fillText("LEFT", x + barWidth / 2, y - 22);
        } else if (step.pointers.right === idx) {
          ctx.fillStyle = isDark ? "#ec4899" : "#be185d";
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.fillText("RIGHT", x + barWidth / 2, y - 22);
        }
      }

      // Draw index text below
      ctx.fillStyle = isDark ? "#9ca3af" : "#64748b";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(`[${idx}]`, x + barWidth / 2, height - 20);
    });
  }, [steps, currentStepIndex, theme]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-4 transition-colors">
      {/* Visualizer Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-brand-border/60 pb-3 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Thuật toán:
          </span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            className="rounded-md border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <optgroup label="Thuật toán Sắp xếp (Sorting)">
              <option value="bubble">Bubble Sort (Nổi bọt)</option>
              <option value="selection">Selection Sort (Chọn)</option>
              <option value="insertion">Insertion Sort (Chèn)</option>
            </optgroup>
            <optgroup label="Thuật toán Tìm kiếm (Searching)">
              <option value="binary_search">Binary Search (Nhị phân - O(log n))</option>
              <option value="linear_search">Linear Search (Tuyến tính - O(n))</option>
            </optgroup>
          </select>

          {/* Search Target Input if search algorithm */}
          {isSearchAlgo && (
            <div className="flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-2.5 py-1">
              <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] text-gray-500">Tìm số:</span>
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(Number(e.target.value) || 0)}
                className="w-14 bg-transparent text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
            </div>
          )}

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
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 dark:bg-sky-400" /> Vùng xét
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> So sánh / Mid
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {isSearchAlgo ? "Tìm thấy" : "Đã xếp"}
          </span>
          {isSearchAlgo && (
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-600" /> Đã loại
            </span>
          )}
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
