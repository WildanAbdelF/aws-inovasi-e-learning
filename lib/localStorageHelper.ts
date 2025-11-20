
export const LS_KEYS = {
	USER: "lms_user",
};

export type StoredUser = {
	name: string;
	email: string;
	password: string;
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


