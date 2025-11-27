
export const LS_KEYS = {
	USER: "lms_user",
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



