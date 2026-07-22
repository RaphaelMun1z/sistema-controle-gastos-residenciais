export interface AuthUser {
	accountId: string;
	personId: string;
	name: string;
	email: string;
}

export interface SignInCredentials {
	email: string;
	password: string;
}

export interface SignUpData {
	name: string;
	birthDate: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthSession {
	accessToken: string;
	expiresAt: string;
}
