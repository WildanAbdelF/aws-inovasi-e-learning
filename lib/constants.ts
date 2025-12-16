/**
 * Application Constants
 * =====================
 * Centralized configuration dan constants
 */

// App Info
export const APP_NAME = "AWS Inovasi E-Learning";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Platform pembelajaran modern untuk meningkatkan keahlian Anda.";

// Routes
export const ROUTES = {
  // Public
  HOME: "/",
  KATALOG: "/katalog",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  
  // Protected - User
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  LEARN: (courseId: string, moduleId: string, itemId: string) => 
    `/learn/${courseId}/${moduleId}/${itemId}`,
  
  // Protected - Admin
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_COURSES: "/admin",
  ADMIN_COURSE_NEW: "/admin/courses/new",
  ADMIN_COURSE_EDIT: (id: string) => `/admin/courses/${id}`,
  ADMIN_USERS: "/admin/users",
} as const;

// User Roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// Course Access Types
export const ACCESS_TYPES = {
  LIFETIME: "lifetime",
  SUBSCRIPTION: "subscription",
} as const;

// LocalStorage Keys
export const LS_KEYS = {
  USER: "lms_user",
  REGISTERED_USERS: "lms_registered_users",
  PURCHASES: "lms_purchases",
  SUBSCRIPTIONS: "lms_course_subscriptions",
  CERTIFICATES: "lms_certificates",
  ADMIN_COURSES: "lms_admin_courses",
  getProgressKey: (email: string) => `lms_course_progress_${email}`,
} as const;

// UI Constants
export const UI = {
  // Breakpoints (matching TailwindCSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },
  
  // Animation durations (ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Colors (matching design system)
  COLORS: {
    PRIMARY: "#dc2626",
    PRIMARY_HOVER: "#b91c1c",
  },
} as const;

// Date formats
export const DATE_FORMATS = {
  FULL: "dd MMMM yyyy",
  SHORT: "dd/MM/yyyy",
  WITH_TIME: "dd MMMM yyyy, HH:mm",
} as const;
