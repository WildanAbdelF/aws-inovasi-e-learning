export type UserRole = "admin" | "user";

export type ApiUserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

export type UserCourseAccess = {
  id: string;
  courseId: string;
  title: string;
  price: number | null;
  pricePaid: number | null;
  accessType: "lifetime" | "subscription";
  status: "active" | "completed";
  expiresAt?: string | null;
  createdAt?: string;
};

export type UserCertificate = {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  userName: string;
  userEmail: string;
  completedAt: string;
};

export type AdminRecentActivity = {
  id: string;
  name: string;
  action: string;
  time: string;
  avatar: string;
};

export type AdminRevenueSeriesPoint = {
  date: string;
  label: string;
  totalRevenue: number;
  totalTransactions: number;
};

export type AdminDashboardMetrics = {
  totalRevenue: number;
  activeUsers: number;
  activeSubscriptions: number;
  totalEnrollments: number;
  recentActivity: AdminRecentActivity[];
  revenueSeries: AdminRevenueSeriesPoint[];
};
