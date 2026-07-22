import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "../../../shared/config/env";
import { authenticationService } from "../services/authenticationService";
import type { AuthUser, SignInCredentials, SignUpData } from "../types/auth";
import { AuthContext, type AuthContextValue } from "../contexts/AuthContext";
import { authTokenStorage } from "../../../shared/api/authTokenStorage";
import { setUnauthorizedHandler } from "../../../shared/api/httpClient";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { ROUTES } from "../../../app/routes/paths";

interface AuthProviderProps {
	children: ReactNode;
}

interface AuthState {
	sessionExpiresAt: string | null;
	sessionMessage: string;
	user: AuthUser | null;
	userError: string;
	isUserLoading: boolean;
}

const authMeQueryKey = ["auth", "me"] as const;
const sessionMessageStorageKey = "residential-expenses.session-message";
const expiredSessionMessage =
	"Sua sessão expirou. Entre novamente para continuar.";

const bypassUser: AuthUser = {
	accountId: "bypass-account",
	personId: "bypass-person",
	name: "Usuário local",
	email: "local@reservae.test",
};

const getStoredActiveTokenState = () => {
	const storedToken = authTokenStorage.get();

	if (!storedToken) {
		return {
			token: null,
			wasExpired: false,
		};
	}

	if (authTokenStorage.isExpired(storedToken)) {
		authTokenStorage.clear();
		return {
			token: null,
			wasExpired: true,
		};
	}

	return {
		token: storedToken,
		wasExpired: false,
	};
};

const consumeStoredSessionMessage = () => {
	const message = sessionStorage.getItem(sessionMessageStorageKey) ?? "";
	sessionStorage.removeItem(sessionMessageStorageKey);

	return message;
};

const redirectToSignIn = () => {
	if (window.location.pathname !== ROUTES.signIn) {
		window.location.assign(ROUTES.signIn);
	}
};

const getInitialAuthState = (): AuthState => {
	const { token: storedToken, wasExpired } = getStoredActiveTokenState();
	const storedSessionMessage = consumeStoredSessionMessage();

	if (!storedToken) {
		return {
			sessionExpiresAt: null,
			sessionMessage:
				storedSessionMessage ||
				(wasExpired && !env.bypassAuth ? expiredSessionMessage : ""),
			user: env.bypassAuth ? bypassUser : null,
			userError: "",
			isUserLoading: false,
		};
	}

	return {
		sessionExpiresAt: storedToken.expiresAt,
		sessionMessage: "",
		user: null,
		userError: "",
		isUserLoading: true,
	};
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const queryClient = useQueryClient();
	const [authState, setAuthState] = useState(getInitialAuthState);

	const clearAuthCache = useCallback(() => {
		void queryClient.removeQueries({ queryKey: authMeQueryKey });
	}, [queryClient]);

	const loadUser = useCallback(async () => {
		if (!getStoredActiveTokenState().token) {
			return;
		}

		setAuthState((currentState) => ({
			...currentState,
			isUserLoading: true,
			userError: "",
		}));

		try {
			const user = await queryClient.fetchQuery({
				queryKey: authMeQueryKey,
				queryFn: authenticationService.getMe,
				staleTime: 5 * 60 * 1000,
			});

			setAuthState((currentState) => ({
				...currentState,
				user,
				userError: "",
				isUserLoading: false,
			}));
		} catch (error) {
			setAuthState((currentState) => ({
				...currentState,
				user: null,
				userError:
					getApiErrorMessage(error) ||
					"Não foi possível carregar os dados da conta.",
				isUserLoading: false,
			}));
		}
	}, [queryClient]);

	const signOut = useCallback(
		(message = "") => {
			authTokenStorage.clear();
			clearAuthCache();
			setAuthState({
				sessionExpiresAt: null,
				sessionMessage: message,
				user: env.bypassAuth ? bypassUser : null,
				userError: "",
				isUserLoading: false,
			});
		},
		[clearAuthCache],
	);

	const expireSession = useCallback(() => {
		sessionStorage.setItem(sessionMessageStorageKey, expiredSessionMessage);
		signOut(expiredSessionMessage);
		redirectToSignIn();
	}, [signOut]);

	useEffect(() => {
		setUnauthorizedHandler(() => {
			expireSession();
		});

		return () => {
			setUnauthorizedHandler(null);
		};
	}, [expireSession]);

	useEffect(() => {
		if (authState.sessionExpiresAt && !authState.user && !authState.userError) {
			void loadUser();
		}
	}, [authState.sessionExpiresAt, authState.user, authState.userError, loadUser]);

	const signIn = useCallback(
		async (credentials: SignInCredentials) => {
			const nextSession = await authenticationService.signIn(credentials);
			authTokenStorage.set(nextSession);
			clearAuthCache();
			setAuthState({
				sessionExpiresAt: nextSession.expiresAt,
				sessionMessage: "",
				user: null,
				userError: "",
				isUserLoading: true,
			});
			await loadUser();
		},
		[clearAuthCache, loadUser],
	);

	const signUp = useCallback(async (data: SignUpData) => {
		await authenticationService.signUp(data);
		setAuthState((currentState) => ({
			...currentState,
			sessionMessage: "Conta criada com sucesso. Entre para continuar.",
		}));
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			isLoading: authState.isUserLoading,
			isUserLoading: authState.isUserLoading,
			sessionExpiresAt: authState.sessionExpiresAt,
			sessionMessage: authState.sessionMessage,
			user: authState.user,
			userError: authState.userError,
			isAuthenticated:
				Boolean(authState.sessionExpiresAt && authState.user) ||
				(env.bypassAuth && !authState.sessionExpiresAt),
			signIn,
			signUp,
			signOut,
			reloadUser: loadUser,
		}),
		[authState, loadUser, signIn, signOut, signUp],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
