"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
	getUser,
	saveUser,
	clearUser,
	StoredUser,
} from "@/lib/localStorageHelper";

type AuthContextValue = {
	user: StoredUser | null;
	login: (user: StoredUser) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<StoredUser | null>(null);

	useEffect(() => {
		const existing = getUser();
		if (existing) setUser(existing);
	}, []);

	const login = (u: StoredUser) => {
		saveUser(u);
		setUser(u);
	};

	const logout = () => {
		clearUser();
		// juga hapus semua kursus yang sudah dibeli ketika user logout
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("lms_purchases");
		}
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within <AuthProvider>");
	}
	return ctx;
}
