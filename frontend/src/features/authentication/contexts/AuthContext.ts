import { createContext } from "react";
import type {
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "../types/auth";

export interface AuthContextValue {
	isLoading: boolean;
	isUserLoading: boolean;
	sessionExpiresAt: string | null;
	sessionMessage: string;
	user: AuthUser | null;
	userError: string;
	isAuthenticated: boolean;
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signUp: (data: SignUpData) => Promise<void>;
	signOut: (message?: string) => void;
	reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
