import "./PersonRegisterPage.scss";

import { Alert, Button, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema, type PersonFormData } from "../../schemas/personSchema";
import { useCreatePerson } from "../../hooks/usePeople";
import { useState } from "react";
import {
	getApiErrorTitle,
	getValidationFieldErrors,
} from "../../../../shared/api/apiError";

const PersonRegisterHeaderData = {
	sector: "Pessoas",
	sectorPath: "/pessoas",
	currentPage: "Registrar",
	title: "Registrar Pessoa",
};

const PersonRegisterPage = () => {
	const navigate = useNavigate();
	const createPerson = useCreatePerson();
	const [submitError, setSubmitError] = useState("");
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<PersonFormData>({
		resolver: zodResolver(personSchema),
		defaultValues: {
			name: "",
			birthDate: "",
		},
	});

	const onSubmit = async (data: PersonFormData) => {
		try {
			setSubmitError("");
			await createPerson.mutateAsync(data);
			navigate(ROUTES.people, {
				state: { feedbackMessage: "Pessoa cadastrada com sucesso." },
			});
		} catch (error) {
			const fieldErrors = getValidationFieldErrors(error);
			Object.entries(fieldErrors).forEach(([field, message]) => {
				if (field === "name" || field === "birthDate") {
					setError(field, { message });
				}
			});
			setSubmitError(getApiErrorTitle(error, "peopleCreate"));
		}
	};

	return (
		<section className="person-register-page">
			<PageHeader data={PersonRegisterHeaderData} />

			<div className="person-register-page__form-container">
				<form className="person-form" onSubmit={handleSubmit(onSubmit)}>
					{submitError && <Alert severity="error">{submitError}</Alert>}

					<div className="person-form__grid">
						<TextField
							label="Nome"
							placeholder="Nome completo"
							fullWidth
							{...register("name")}
							error={Boolean(errors.name)}
							helperText={errors.name?.message}
						/>

						<TextField
							label="Data de nascimento"
							type="date"
							fullWidth
							{...register("birthDate")}
							error={Boolean(errors.birthDate)}
							helperText={errors.birthDate?.message}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					</div>

					<div className="person-form__actions">
						<Button
							component={Link}
							to={ROUTES.people}
							variant="outlined"
							startIcon={<CloseIcon />}
							sx={{
								color: "#6b7280",
								borderColor: "#d1d5db",
								boxShadow: "none",

								"&:hover": {
									borderColor: "#9ca3af",
									backgroundColor: "#f3f4f6",
									boxShadow: "none",
								},
							}}
						>
							Cancelar
						</Button>

						<Button
							type="submit"
							variant="contained"
							startIcon={<SaveIcon />}
							loading={isSubmitting}
							disabled={isSubmitting || createPerson.isPending}
							sx={{
								backgroundColor: "#2e7d32",
								boxShadow: "none",

								"&:hover": {
									backgroundColor: "#256b2a",
									boxShadow: "none",
								},
							}}
						>
							SALVAR
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default PersonRegisterPage;
