import type { Course } from "@/types/course";

const baseUrl = "/api/courses";
const imageUploadUrl = "/api/uploads/image";

export type CourseImageUploadTarget = "course-thumbnail" | "course-material";

export interface UploadCourseImageParams {
  file: File;
  target: CourseImageUploadTarget;
  courseId?: string;
  moduleId?: string;
  itemId?: string;
  oldUrl?: string | null;
}

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

export async function uploadCourseImage(
  params: UploadCourseImageParams
): Promise<string> {
  const formData = new FormData();
  formData.set("file", params.file);
  formData.set("target", params.target);

  if (params.courseId) {
    formData.set("courseId", params.courseId);
  }
  if (params.moduleId) {
    formData.set("moduleId", params.moduleId);
  }
  if (params.itemId) {
    formData.set("itemId", params.itemId);
  }
  if (typeof params.oldUrl === "string" && params.oldUrl.trim()) {
    formData.set("oldUrl", params.oldUrl.trim());
  }

  const response = await fetch(imageUploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      typeof errorBody.error === "string"
        ? errorBody.error
        : "Failed to upload image.";
    throw new Error(message);
  }

  const body = (await response.json()) as {
    data?: {
      url?: string;
    };
  };

  const url = body.data?.url;
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Upload succeeded but image URL is missing.");
  }

  return url;
}
