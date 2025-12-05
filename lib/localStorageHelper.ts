
export const LS_KEYS = {
	USER: "lms_user", // Current logged in user (session)
	REGISTERED_USERS: "lms_registered_users", // All registered users (persistent)
	PURCHASES: "lms_purchases",
};

export type StoredUser = {
	name: string;
	email: string;
	password: string;
	role: "admin" | "user";
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



