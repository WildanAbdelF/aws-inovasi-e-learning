/**
 * Lib Index
 * =========
 * Barrel exports untuk semua utilities di lib folder
 */

// Utils
export { cn } from "./utils";

// Constants
export * from "./constants";

// Storage Helpers (exclude LS_KEYS to avoid conflict with constants)
export type { StoredUser, PurchasedCourse, CourseSubscription, Certificate } from "./localStorageHelper";
export {
  isBrowser,
  getRegisteredUsers,
  registerUser,
  findRegisteredUser,
  updateRegisteredUser,
  addLifetimeCourseToUser,
  removeLifetimeCourseFromUser,
  getUserLifetimeCourses,
  hasLifetimeAccess,
  saveUser,
  getUser,
  clearUser,
  isLoggedIn,
  getPurchases,
  addPurchase,
  clearPurchases,
  getSubscriptions,
  getSubscriptionByCourseId,
  addMonthlySubscription,
  clearSubscriptions,
  clearUserProgress,
  logout,
  getCertificates,
  addCertificate,
  getCertificateByCourseId,
  clearCertificates,
} from "./localStorageHelper";
export * from "./adminCoursesStorage";

// Data
export { dummyCourses } from "./data";

// Hooks
export { useInView } from "./hooks";

