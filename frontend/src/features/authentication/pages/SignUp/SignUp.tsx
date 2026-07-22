import "../../../../shared/components/layout/AuthTemplate/AuthTemplate.scss";

// Componentes do Material UI
import { Alert, Button, TextField } from "@mui/material";

// Ícones
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";

// React Router
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	signUpSchema,
	type SignUpFormData,
} from "../../schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
	getApiErrorTitle,
	getValidationFieldErrors,
} from "../../../../shared/api/apiError";

const SignUp = () => {
	const navigate = useNavigate();
	const { signUp } = useAuth();
	const [submitError, setSubmitError] = useState("");
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			birthDate: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: SignUpFormData) => {
		try {
			setSubmitError("");
			await signUp(data);
			navigate(ROUTES.signIn);
		} catch (error) {
			const fieldErrors = getValidationFieldErrors(error);
			Object.entries(fieldErrors).forEach(([field, message]) => {
				if (
					field === "name" ||
					field === "birthDate" ||
					field === "email" ||
					field === "password"
				) {
					setError(field, { message });
				}
			});
			setSubmitError(getApiErrorTitle(error, "signUp"));
		}
	};

	return (
		<div className="form-container">
			<header className="form-header">
				<h1>Crie sua conta</h1>
			</header>

			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				{submitError && <Alert severity="error">{submitError}</Alert>}

				<div className="input-container">
					<label htmlFor="name">Nome</label>

					<TextField
						id="name"
						{...register("name")}
						fullWidth
						size="small"
						placeholder="Digite seu nome"
						error={Boolean(errors.name)}
						helperText={errors.name?.message}
						slotProps={{
							input: {
								startAdornment: (
									<PersonIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<div className="input-container">
					<label htmlFor="birthDate">Data de nascimento</label>

					<TextField
						id="birthDate"
						type="date"
						{...register("birthDate")}
						fullWidth
						size="small"
						error={Boolean(errors.birthDate)}
						helperText={errors.birthDate?.message}
						slotProps={{
							inputLabel: {
								shrink: true,
							},
							input: {
								startAdornment: (
									<CakeOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<div className="input-container">
					<label htmlFor="email">E-mail</label>

					<TextField
						id="email"
						type="email"
						{...register("email")}
						fullWidth
						size="small"
						placeholder="Digite seu e-mail"
						error={Boolean(errors.email)}
						helperText={errors.email?.message}
						slotProps={{
							input: {
								startAdornment: (
									<EmailOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<div className="input-container">
					<label htmlFor="password">Senha</label>

					<TextField
						id="password"
						type="password"
						{...register("password")}
						fullWidth
						size="small"
						placeholder="Crie uma senha"
						error={Boolean(errors.password)}
						helperText={errors.password?.message}
						slotProps={{
							input: {
								startAdornment: (
									<LockOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>

					<span className="input-helper">
						A senha deve possuir pelo menos 8 caracteres.
					</span>
				</div>

				<div className="input-container">
					<label htmlFor="confirm-password">Confirmar senha</label>

					<TextField
						id="confirm-password"
						type="password"
						{...register("confirmPassword")}
						fullWidth
						size="small"
						placeholder="Confirme sua senha"
						error={Boolean(errors.confirmPassword)}
						helperText={errors.confirmPassword?.message}
						slotProps={{
							input: {
								startAdornment: (
									<LockOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<Button
					type="submit"
					variant="contained"
					fullWidth
					className="submit-button"
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					Criar conta
				</Button>
			</form>

			<p className="auth-redirect">
				Já possui uma conta? <Link to={ROUTES.signIn}>Entrar</Link>
			</p>
		</div>
	);
};

export default SignUp;
