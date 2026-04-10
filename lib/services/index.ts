/**
 * Services Layer
 * ==============
 * Folder ini akan berisi service layer untuk integrasi dengan Supabase.
 * Saat ini masih kosong karena demo menggunakan localStorage.
 * 
 * Planned Services:
 * - auth.service.ts     : Supabase Auth integration
 * - course.service.ts   : Course CRUD operations
 * - user.service.ts     : User management
 * - progress.service.ts : Learning progress tracking
 * - certificate.service.ts : Certificate generation & storage
 */

// Quiz Generator Service
export {
  generateQuizFromMaterial,
  generateQuizForModule,
} from "./quizGenerator";

export {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "./courseApi";

export {
  getMyProfile,
  updateMyProfile,
  listUsersForAdmin,
  updateUserAsAdmin,
  requestPasswordReset,
  listMyCourseAccesses,
  createMyCourseAccess,
  listMyCertificates,
  issueMyCertificate,
} from "./userApi";
