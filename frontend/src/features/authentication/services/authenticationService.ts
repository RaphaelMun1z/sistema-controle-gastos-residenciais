import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "../types/auth";
import type {
	AuthSessionResponseDTO,
	AuthUserResponseDTO,
	SignInRequestDTO,
	SignUpRequestDTO,
} from "../types/authDtos";
import {
	mapSessionResponseToSession,
	mapUserResponseToUser,
} from "../types/authDtos";

export const authenticationService = {
	async signIn(credentials: SignInCredentials): Promise<AuthSession> {
		const session = await httpClient.post<
			AuthSessionResponseDTO,
			SignInRequestDTO
		>(API_ENDPOINTS.auth.login, credentials);

		return mapSessionResponseToSession(session);
	},

	async signUp(data: SignUpData): Promise<void> {
		const request: SignUpRequestDTO = {
			name: data.name,
			birthDate: data.birthDate,
			email: data.email,
			password: data.password,
		};
		await httpClient.post<unknown, SignUpRequestDTO>(
			API_ENDPOINTS.auth.register,
			request,
		);
	},

	async getMe(): Promise<AuthUser> {
		const user = await httpClient.get<AuthUserResponseDTO>(API_ENDPOINTS.auth.me);

		return mapUserResponseToUser(user);
	},
};
