
export const LS_KEYS = {
	USER: "lms_user", // Current logged in user (session)
	REGISTERED_USERS: "lms_registered_users", // All registered users (persistent)
	PURCHASES: "lms_purchases",
	SUBSCRIPTIONS: "lms_course_subscriptions",
	CERTIFICATES: "lms_certificates", // User certificates
};

export type StoredUser = {
	name: string;
	email: string;
	password: string;
	role: "admin" | "user";
	subscriptionStatus?: "active" | "inactive" | "pending";
	lifetimeCourses?: { id: string; title: string }[];
};

export function isBrowser() {
	return typeof window !== "undefined";
}

// === REGISTERED USERS (Persistent - not cleared on logout) ===

export function getRegisteredUsers(): StoredUser[] {
	if (!isBrowser()) return [];
	const raw = window.localStorage.getItem(LS_KEYS.REGISTERED_USERS);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as StoredUser[];
	} catch {
		return [];
	}
}

export function registerUser(user: StoredUser): boolean {
	if (!isBrowser()) return false;
	const users = getRegisteredUsers();
	// Check if email already exists
	const exists = users.some((u) => u.email === user.email);
	if (exists) return false;
	const updated = [...users, user];
	window.localStorage.setItem(LS_KEYS.REGISTERED_USERS, JSON.stringify(updated));
	return true;
}

export function findRegisteredUser(email: string): StoredUser | null {
	const users = getRegisteredUsers();
	return users.find((u) => u.email === email) || null;
}

export function updateRegisteredUser(email: string, updatedData: Partial<StoredUser>): boolean {
	if (!isBrowser()) return false;
	const users = getRegisteredUsers();
	const index = users.findIndex((u) => u.email === email);
	if (index === -1) return false;
	users[index] = { ...users[index], ...updatedData };
	window.localStorage.setItem(LS_KEYS.REGISTERED_USERS, JSON.stringify(users));
	return true;
}

// === LIFETIME COURSE ACCESS MANAGEMENT ===

export function addLifetimeCourseToUser(userEmail: string, course: { id: string; title: string }): boolean {
	if (!isBrowser()) return false;
	const users = getRegisteredUsers();
	const index = users.findIndex((u) => u.email === userEmail);
	if (index === -1) return false;
	
	const user = users[index];
	const currentCourses = user.lifetimeCourses || [];
	
	// Check if course already exists
	if (currentCourses.some((c) => c.id === course.id)) return false;
	
	users[index] = {
		...user,
		lifetimeCourses: [...currentCourses, course],
	};
	window.localStorage.setItem(LS_KEYS.REGISTERED_USERS, JSON.stringify(users));
	return true;
}

export function removeLifetimeCourseFromUser(userEmail: string, courseId: string): boolean {
	if (!isBrowser()) return false;
	const users = getRegisteredUsers();
	const index = users.findIndex((u) => u.email === userEmail);
	if (index === -1) return false;
	
	const user = users[index];
	const currentCourses = user.lifetimeCourses || [];
	
	users[index] = {
		...user,
		lifetimeCourses: currentCourses.filter((c) => c.id !== courseId),
	};
	window.localStorage.setItem(LS_KEYS.REGISTERED_USERS, JSON.stringify(users));
	return true;
}

export function getUserLifetimeCourses(userEmail: string): { id: string; title: string }[] {
	const user = findRegisteredUser(userEmail);
	return user?.lifetimeCourses || [];
}

export function hasLifetimeAccess(userEmail: string, courseId: string): boolean {
	const courses = getUserLifetimeCourses(userEmail);
	return courses.some((c) => c.id === courseId);
}

// === CURRENT SESSION (Cleared on logout) ===

export function saveUser(user: StoredUser) {
	if (!isBrowser()) return;
	window.localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
	if (!isBrowser()) return null;
	const raw = window.localStorage.getItem(LS_KEYS.USER);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as StoredUser;
	} catch {
		return null;
	}
}

export function clearUser() {
	if (!isBrowser()) return;
	window.localStorage.removeItem(LS_KEYS.USER);
}

export function isLoggedIn() {
	return !!getUser();
}

export type PurchasedCourse = {
	id: string;
	title: string;
	price: number;
};

export function getPurchases(): PurchasedCourse[] {
	if (!isBrowser()) return [];
	const raw = window.localStorage.getItem(LS_KEYS.PURCHASES);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as PurchasedCourse[];
	} catch {
		return [];
	}
}

export function addPurchase(course: PurchasedCourse) {
	if (!isBrowser()) return;
	const current = getPurchases();
	const exists = current.some((c) => c.id === course.id);
	if (exists) return;
	const updated = [...current, course];
	window.localStorage.setItem(LS_KEYS.PURCHASES, JSON.stringify(updated));
}

export function clearPurchases() {
	if (!isBrowser()) return;
	window.localStorage.removeItem(LS_KEYS.PURCHASES);
}

const SUBSCRIPTION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

export type CourseSubscription = {
	courseId: string;
	title: string;
	startedAt: string; // ISO string
	expiresAt: string; // ISO string
};

function readSubscriptions(): CourseSubscription[] {
	if (!isBrowser()) return [];
	const raw = window.localStorage.getItem(LS_KEYS.SUBSCRIPTIONS);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as CourseSubscription[];
	} catch {
		return [];
	}
}

function persistSubscriptions(subs: CourseSubscription[]) {
	if (!isBrowser()) return;
	window.localStorage.setItem(LS_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
}

function filterActiveSubscriptions(subs: CourseSubscription[]) {
	const now = Date.now();
	return subs.filter((sub) => new Date(sub.expiresAt).getTime() > now);
}

export function getSubscriptions() {
	const stored = readSubscriptions();
	const active = filterActiveSubscriptions(stored);
	if (active.length !== stored.length) {
		persistSubscriptions(active);
	}
	return active;
}

export function getSubscriptionByCourseId(courseId: string) {
	return getSubscriptions().find((sub) => sub.courseId === courseId) ?? null;
}

export function addMonthlySubscription(course: { id: string | number; title: string }) {
	if (!isBrowser()) return null;
	const sanitized = filterActiveSubscriptions(readSubscriptions());
	const startedAt = new Date();
	const expiresAt = new Date(startedAt.getTime() + SUBSCRIPTION_DURATION_MS);
	const subscription: CourseSubscription = {
		courseId: String(course.id),
		title: course.title,
		startedAt: startedAt.toISOString(),
		expiresAt: expiresAt.toISOString(),
	};
	const updated = [...sanitized.filter((sub) => sub.courseId !== subscription.courseId), subscription];
	persistSubscriptions(updated);
	return subscription;
}

export function clearSubscriptions() {
	if (!isBrowser()) return;
	window.localStorage.removeItem(LS_KEYS.SUBSCRIPTIONS);
}

// Clear course progress for a specific user
export function clearUserProgress(userEmail: string) {
	if (!isBrowser()) return;
	const progressKey = `lms_course_progress_${userEmail}`;
	window.localStorage.removeItem(progressKey);
}

// Clear all session data for logout
export function logout() {
	if (!isBrowser()) return;
	const user = getUser();
	if (user) {
		// Clear user's course progress
		clearUserProgress(user.email);
	}
	// Clear session data
	clearUser();
	clearPurchases();
	clearSubscriptions();
}

// === CERTIFICATES ===

export type Certificate = {
	id: string;
	courseId: string;
	courseTitle: string;
	userName: string;
	userEmail: string;
	instructorName: string;
	completedAt: string; // ISO string
};

function getCertificateKey(userEmail: string) {
	return `${LS_KEYS.CERTIFICATES}_${userEmail}`;
}

export function getCertificates(userEmail: string): Certificate[] {
	if (!isBrowser()) return [];
	const key = getCertificateKey(userEmail);
	const raw = window.localStorage.getItem(key);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as Certificate[];
	} catch {
		return [];
	}
}

export function addCertificate(cert: Omit<Certificate, "id" | "completedAt">): Certificate | null {
	if (!isBrowser()) return null;
	const existing = getCertificates(cert.userEmail);
	// Check if certificate already exists for this course
	const alreadyExists = existing.some((c) => c.courseId === cert.courseId);
	if (alreadyExists) {
		return existing.find((c) => c.courseId === cert.courseId) || null;
	}
	const newCert: Certificate = {
		...cert,
		id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		completedAt: new Date().toISOString(),
	};
	const updated = [...existing, newCert];
	window.localStorage.setItem(getCertificateKey(cert.userEmail), JSON.stringify(updated));
	return newCert;
}

export function getCertificateByCourseId(userEmail: string, courseId: string): Certificate | null {
	const certs = getCertificates(userEmail);
	return certs.find((c) => c.courseId === courseId) || null;
}

export function clearCertificates(userEmail: string) {
	if (!isBrowser()) return;
	window.localStorage.removeItem(getCertificateKey(userEmail));
}