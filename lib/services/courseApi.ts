import type { Course } from "@/types/course";

const baseUrl = "/api/courses";

export async function listCourses(): Promise<Course[]> {
  const response = await fetch(baseUrl, { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to load courses.");
  }
  const data = await response.json();
  return data.data as Course[];
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await fetch(`${baseUrl}/${courseId}`, { method: "GET" });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Course not found.");
    }
    const errorBody = await response.json().catch(() => ({}));
    const message =
      typeof errorBody.error === "string"
        ? errorBody.error
        : "Failed to load course.";
    throw new Error(message);
  }
  const data = await response.json();
  return data.data as Course;
}

export async function createCourse(course: Course): Promise<Course> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      typeof errorBody.error === "string"
        ? errorBody.error
        : "Failed to create course.";
    throw new Error(message);
  }

  const data = await response.json();
  return data.data as Course;
}

export async function updateCourse(
  courseId: string,
  course: Course
): Promise<Course> {
  const response = await fetch(`${baseUrl}/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      typeof errorBody.error === "string"
        ? errorBody.error
        : "Failed to update course.";
    throw new Error(message);
  }

  const data = await response.json();
  return data.data as Course;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const response = await fetch(`${baseUrl}/${courseId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      typeof errorBody.error === "string"
        ? errorBody.error
        : "Failed to delete course.";
    throw new Error(message);
  }
}
