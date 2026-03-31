import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/course";

interface QuizGeneratorOptions {
  numberOfQuestions?: number;
  difficulty?: "easy" | "medium" | "hard";
  language?: "id" | "en";
}

interface UseQuizGeneratorReturn {
  generateQuiz: (
    content: string,
    title?: string,
    options?: QuizGeneratorOptions
  ) => Promise<QuizQuestion[]>;
  generateQuizFromModule: (
    moduleItems: Array<{ title: string; content: string; type: string }>,
    options?: QuizGeneratorOptions
  ) => Promise<QuizQuestion[]>;
  isLoading: boolean;
  error: string | null;
  generatedQuestions: QuizQuestion[];
}

export function useQuizGenerator(): UseQuizGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);

  const generateQuiz = useCallback(
    async (
      content: string,
      title?: string,
      options?: QuizGeneratorOptions
    ): Promise<QuizQuestion[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            title,
            ...options,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate quiz");
        }

        const data = await response.json();
        setGeneratedQuestions(data.questions);
        return data.questions;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const generateQuizFromModule = useCallback(
    async (
      moduleItems: Array<{ title: string; content: string; type: string }>,
      options?: QuizGeneratorOptions
    ): Promise<QuizQuestion[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleItems,
            ...options,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate quiz");
        }

        const data = await response.json();
        setGeneratedQuestions(data.questions);
        return data.questions;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    generateQuiz,
    generateQuizFromModule,
    isLoading,
    error,
    generatedQuestions,
  };
}
