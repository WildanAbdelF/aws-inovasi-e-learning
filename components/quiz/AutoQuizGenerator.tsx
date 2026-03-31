"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/course";

interface AutoQuizGeneratorProps {
  moduleItems: Array<{ title: string; content: string; type: string }>;
  onQuizGenerated: (questions: QuizQuestion[]) => void;
  disabled?: boolean;
}

export function AutoQuizGenerator({
  moduleItems,
  onQuizGenerated,
  disabled = false,
}: AutoQuizGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    numberOfQuestions: 5,
    difficulty: "medium" as "easy" | "medium" | "hard",
    language: "id" as "id" | "en",
  });

  const pageItems = moduleItems.filter((item) => item.type === "page");
  const hasContent = pageItems.length > 0 && pageItems.some((item) => item.content?.trim());

  const handleGenerate = async () => {
    if (!hasContent) {
      setError("Tidak ada konten materi untuk generate quiz. Tambahkan konten terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleItems: pageItems,
          ...settings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal generate quiz");
      }

      const data = await response.json();
      onQuizGenerated(data.questions);
      setShowSettings(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        disabled={disabled || isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Auto Generate Quiz</span>
          </>
        )}
      </button>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border rounded-xl shadow-xl z-50 p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Pengaturan Quiz</h4>

          {/* Number of Questions */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Jumlah Pertanyaan
            </label>
            <select
              value={settings.numberOfQuestions}
              onChange={(e) =>
                setSettings({ ...settings, numberOfQuestions: parseInt(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[3, 5, 7, 10, 15].map((num) => (
                <option key={num} value={num}>
                  {num} pertanyaan
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Tingkat Kesulitan
            </label>
            <select
              value={settings.difficulty}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Mudah</option>
              <option value="medium">Sedang</option>
              <option value="hard">Sulit</option>
            </select>
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Bahasa
            </label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value as "id" | "en" })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Content Info */}
          {!hasContent && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              ⚠️ Tambahkan konten materi terlebih dahulu sebelum generate quiz.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="flex-1 px-3 py-2 text-sm text-neutral-600 border rounded-lg hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!hasContent || isLoading}
              className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoQuizGenerator;
