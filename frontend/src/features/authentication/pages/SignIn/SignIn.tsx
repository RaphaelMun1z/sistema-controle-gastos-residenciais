import "../../../../shared/components/layout/AuthTemplate/AuthTemplate.scss";

// Componentes do Material UI
import { Alert, Button, TextField } from "@mui/material";

// Ícones
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// React Router
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	signInSchema,
	type SignInFormData,
} from "../../schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { getApiErrorTitle } from "../../../../shared/api/apiError";

const SignIn = () => {
	const navigate = useNavigate();
	const { signIn, sessionMessage } = useAuth();
	const [submitError, setSubmitError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignInFormData) => {
		try {
			setSubmitError("");
			await signIn(data);
			navigate(ROUTES.people);
		} catch (error) {
			setSubmitError(getApiErrorTitle(error, "signIn"));
		}
	};

	return (
		<div className="form-container">
			<header className="form-header">
				<h1>Acesse sua conta</h1>
			</header>

			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				{sessionMessage && <Alert severity="info">{sessionMessage}</Alert>}
				{submitError && <Alert severity="error">{submitError}</Alert>}

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
						placeholder="Digite sua senha"
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
				</div>

				<div className="forgot-password">
					<Link to={ROUTES.signIn}>Esqueceu sua senha?</Link>
				</div>

				<Button
					type="submit"
					variant="contained"
					fullWidth
					className="submit-button"
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					Entrar
				</Button>
			</form>

			<p className="auth-redirect">
				Ainda não possui uma conta?{" "}
				<Link to={ROUTES.signUp}>Criar conta</Link>
			</p>
		</div>
	);
};

export default SignIn;
