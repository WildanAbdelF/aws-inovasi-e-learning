"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
	getUser,
	saveUser,
	logout as logoutHelper,
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
		logoutHelper();
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
