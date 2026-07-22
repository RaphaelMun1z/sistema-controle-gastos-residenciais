import type {
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "./auth";

export type SignInRequestDTO = SignInCredentials;
export type SignUpRequestDTO = Omit<SignUpData, "confirmPassword">;

export interface AuthUserResponseDTO {
	accountId: string;
	personId: string;
	name: string;
	email: string;
}

export interface AuthSessionResponseDTO {
	accessToken: string;
	expiresAt: string;
}

export const mapUserResponseToUser = (
	user: AuthUserResponseDTO,
): AuthUser => ({
	accountId: user.accountId,
	personId: user.personId,
	name: user.name,
	email: user.email,
});

export const mapSessionResponseToSession = (
	session: AuthSessionResponseDTO,
): AuthSession => ({
	accessToken: session.accessToken,
	expiresAt: session.expiresAt,
});
