"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
	getUser,
	saveUser,
	logout as logoutHelper,
	StoredUser,
} from "@/lib/localStorageHelper";
import {
	fetchCurrentUser,
	logoutWithApi,
	type ApiAuthUser,
} from "@/lib/services/authApi";

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

		const syncUserFromApi = async () => {
			try {
				const apiUser = await fetchCurrentUser();
				if (!apiUser) return;

				const normalized = mapApiUserToStoredUser(apiUser);
				saveUser(normalized);
				setUser(normalized);
			} catch {
				// Keep local session fallback when API check fails.
			}
		};

		void syncUserFromApi();
	}, []);

	const login = (u: StoredUser) => {
		saveUser(u);
		setUser(u);
	};

	const logout = () => {
		void logoutWithApi().catch(() => undefined);
		logoutHelper();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function mapApiUserToStoredUser(user: ApiAuthUser): StoredUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: "",
		role: user.role,
	};
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within <AuthProvider>");
	}
	return ctx;
}
