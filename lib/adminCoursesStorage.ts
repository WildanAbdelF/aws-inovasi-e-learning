import { isBrowser } from "./localStorageHelper";
import type { Course, CourseModule, CourseModuleContent } from "@/types/course";

const ADMIN_COURSES_KEY = "lms_admin_courses";

export interface AdminCourse extends Course {
  modules: CourseModule[];
}

export function getAdminCourses(): AdminCourse[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(ADMIN_COURSES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AdminCourse[];
  } catch {
    return [];
  }
}

export function saveAdminCourses(courses: AdminCourse[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ADMIN_COURSES_KEY, JSON.stringify(courses));
}

export function upsertAdminCourse(course: AdminCourse) {
  const current = getAdminCourses();
  const index = current.findIndex((c) => c.id === course.id);
  if (index >= 0) {
    current[index] = course;
  } else {
    current.push(course);
  }
  saveAdminCourses(current);
}

export function createEmptyAdminCourse(): AdminCourse {
  const id = `course_${Date.now()}`;
  const firstModuleId = `module_${Date.now()}`;
  const firstItemId = `item_${Date.now()}`;

  const firstModule: CourseModule = {
    id: firstModuleId,
    title: "Introduction",
    items: [
      {
        id: firstItemId,
        title: "What is this course?",
        type: "page",
        content: "",
      } as CourseModuleContent,
    ],
  };

  return {
    id,
    title: "",
    author: "",
    price: 0,
    image: "",
    description: "",
    modules: [firstModule],
  };
}
