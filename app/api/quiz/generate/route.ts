import { NextRequest, NextResponse } from "next/server";
import { generateQuizFromMaterial, generateQuizForModule } from "@/lib/services/quizGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      content, 
      title, 
      moduleItems,
      numberOfQuestions = 5, 
      difficulty = "medium",
      language = "id"
    } = body;

    // Validate input
    if (!content && !moduleItems) {
      return NextResponse.json(
        { error: "Either 'content' or 'moduleItems' is required" },
        { status: 400 }
      );
    }

    const config = { numberOfQuestions, difficulty, language };

    let questions;
    
    if (moduleItems && Array.isArray(moduleItems)) {
      // Generate quiz from multiple module items
      questions = await generateQuizForModule(moduleItems, config);
    } else {
      // Generate quiz from single content
      questions = await generateQuizFromMaterial(content, title || "Quiz", config);
    }

    return NextResponse.json({ 
      success: true, 
      questions,
      count: questions.length 
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate quiz", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
