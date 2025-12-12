export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface CourseModuleContent {
  id: string;
  title: string;
  type: "page" | "quiz";
  content: string;
  mediaUrl?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  items: CourseModuleContent[];
}

export interface Course {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description?: string;
  curriculum?: string[];
  modules?: CourseModule[];
}
