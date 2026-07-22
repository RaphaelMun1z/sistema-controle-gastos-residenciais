import "./TransactionRegisterPage.scss";

import {
	Alert,
	Autocomplete,
	Avatar,
	Button,
	FormControl,
	FormHelperText,
	InputAdornment,
	Radio,
	RadioGroup,
	Skeleton,
	TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	transactionSchema,
	type TransactionFormData,
} from "../../schemas/transactionSchema";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { usePeopleSearch } from "../../../people/hooks/usePeople";
import {
	useEffect,
	useMemo,
	useState,
	type FocusEvent,
	type MouseEvent,
	type ReactNode,
} from "react";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
	getValidationFieldErrors,
} from "../../../../shared/api/apiError";
import {
	TransactionType,
	type TransactionType as TransactionTypeValue,
} from "../../types/transaction";
import { transactionTypeOptions } from "../../utils/transactionLabels";
import type { Person } from "../../../people/types/person";
import { getTodayDateOnly } from "../../../../shared/utils/dateOnly";

const TransactionsRegisterHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Registrar",
	title: "Registrar Transação",
};

const peoplePageSize = 10;

const getPersonInitial = (personName: string) =>
	personName.trim().charAt(0).toUpperCase();

const formatCurrencyInput = (value: number) =>
	value > 0
		? new Intl.NumberFormat("pt-BR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(value)
		: "";

const parseCurrencyInput = (value: string) => {
	const sanitizedValue = value.replace(/[^\d,.-]/g, "");
	const hasDecimalSeparator = /[,.]\d{1,2}$/.test(sanitizedValue);
	const normalizedValue = hasDecimalSeparator
		? sanitizedValue.replace(/\./g, "").replace(",", ".")
		: sanitizedValue.replace(/\D/g, "");
	const parsedValue = Number(normalizedValue);

	return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const showDatePicker = (input: HTMLInputElement | null) => {
	input?.showPicker?.();
};

const TransactionRegisterPage = () => {
	const navigate = useNavigate();
	const createTransaction = useCreateTransaction();
	const [personSearch, setPersonSearch] = useState("");
	const [debouncedPersonSearch, setDebouncedPersonSearch] = useState("");
	const [amountText, setAmountText] = useState("");
	const {
		data: peopleData,
		error: peopleError,
		isError: isPeopleError,
		isLoading: isPeopleLoading,
		isFetching: isPeopleFetching,
		refetch: refetchPeople,
	} = usePeopleSearch({
		page: 1,
		pageSize: peoplePageSize,
		search: debouncedPersonSearch,
	});
	const peopleErrorFeedback = getApiErrorFeedback(
		peopleError,
		"peopleOptionsLoad",
	);
	const [submitError, setSubmitError] = useState("");
	const {
		control,
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			personId: "",
			type: TransactionType.Expense,
			description: "",
			amount: 0,
			transactionDate: getTodayDateOnly(),
		},
	});
	const peopleOptions = useMemo(() => peopleData?.content ?? [], [peopleData]);
	const selectedPersonId = useWatch({ control, name: "personId" });
	const selectedType = useWatch({ control, name: "type" });
	const selectedPerson = useMemo(
		() => peopleOptions.find((person) => person.id === selectedPersonId) ?? null,
		[peopleOptions, selectedPersonId],
	);
	const isSelectedPersonUnderAge = Boolean(
		selectedPerson && selectedPerson.age < 18,
	);
	const isPeopleInitialLoading = isPeopleLoading && peopleOptions.length === 0;
	const isPeopleBlockingError = isPeopleError && peopleOptions.length === 0;
	const transactionTypeIcons: Record<TransactionTypeValue, ReactNode> = {
		[TransactionType.Expense]: <TrendingDownIcon />,
		[TransactionType.Revenue]: <TrendingUpIcon />,
	};

	useEffect(() => {
		const timeout = globalThis.setTimeout(() => {
			setDebouncedPersonSearch(personSearch.trim());
		}, 350);

		return () => globalThis.clearTimeout(timeout);
	}, [personSearch]);

	useEffect(() => {
		if (isSelectedPersonUnderAge && selectedType === TransactionType.Revenue) {
			setValue("type", TransactionType.Expense, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		}
	}, [isSelectedPersonUnderAge, selectedType, setValue]);

	const onSubmit = async (data: TransactionFormData) => {
		try {
			setSubmitError("");

			if (
				selectedPerson?.age !== undefined &&
				selectedPerson.age < 18 &&
				data.type === TransactionType.Revenue
			) {
				setSubmitError(
					"Pessoas menores de 18 anos podem registrar apenas despesas.",
				);
				return;
			}

			await createTransaction.mutateAsync(data);
			navigate(ROUTES.transactions);
		} catch (error) {
			const fieldErrors = getValidationFieldErrors(error);
			Object.entries(fieldErrors).forEach(([field, message]) => {
				if (
					field === "personId" ||
					field === "type" ||
					field === "description" ||
					field === "amount" ||
					field === "transactionDate"
				) {
					setError(field, { message });
				}
			});
			setSubmitError(getApiErrorTitle(error, "transactionsCreate"));
		}
	};

	return (
		<section className="transaction-register-page">
			<PageHeader data={TransactionsRegisterHeaderData} />

			<div className="transaction-register-page__form-container">
				{isPeopleBlockingError && (
					<ErrorState
						title={peopleErrorFeedback.title}
						description={peopleErrorFeedback.description}
						actionLabel={peopleErrorFeedback.actionLabel}
						onRetry={() => void refetchPeople()}
					/>
				)}

				{!isPeopleBlockingError && (
					<>
						{!isPeopleInitialLoading && peopleOptions.length === 0 && (
							<EmptyState
								title="Nenhuma pessoa encontrada."
								description="Cadastre uma pessoa ou ajuste a busca antes de registrar transações."
							/>
						)}

						<form
							className="transaction-form"
							onSubmit={handleSubmit(onSubmit)}
						>
							{submitError && <Alert severity="error">{submitError}</Alert>}
							{isPeopleError && peopleOptions.length > 0 && (
								<Alert severity="warning">
									Não foi possível carregar pessoas agora.
								</Alert>
							)}

							<div className="transaction-form__grid">
								{isPeopleInitialLoading ? (
									<Skeleton
										className="transaction-form__field transaction-form__field--person"
										animation="wave"
										variant="rounded"
										height={56}
										aria-label="Carregando pessoas"
									/>
								) : (
									<Controller
										name="personId"
										control={control}
										render={({ field, fieldState }) => (
											<Autocomplete<Person>
												className="person-autocomplete transaction-form__field transaction-form__field--person"
												options={peopleOptions}
												value={selectedPerson}
												inputValue={personSearch}
												loading={isPeopleFetching}
												loadingText="Buscando pessoas..."
												noOptionsText="Nenhuma pessoa encontrada"
												getOptionLabel={(person) => person.name}
												isOptionEqualToValue={(option, value) =>
													option.id === value.id
												}
												onInputChange={(_event, value) =>
													setPersonSearch(value)
												}
												onChange={(_event, person) => {
													setValue("personId", person?.id ?? "", {
														shouldDirty: true,
														shouldTouch: true,
														shouldValidate: true,
													});
												}}
												renderOption={(props, person) => {
													const { key, className, ...optionProps } = props;

													return (
														<li
															key={key}
															{...optionProps}
															aria-label={person.name}
															className={`${className ?? ""} person-autocomplete__option`}
														>
															<Avatar className="person-autocomplete__avatar">
																{getPersonInitial(person.name)}
															</Avatar>
															<span className="person-autocomplete__option-content">
																<strong>{person.name}</strong>
																<small>
																	{person.age} anos
																	{person.age < 18 ? " - menor de idade" : ""}
																</small>
															</span>
														</li>
													);
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														label="Pessoa"
														placeholder="Busque pelo nome da pessoa"
														inputRef={field.ref}
														onBlur={field.onBlur}
														error={Boolean(fieldState.error)}
														helperText={
															fieldState.error?.message ??
															"Digite para pesquisar e selecione uma pessoa"
														}
														slotProps={{
															...params.slotProps,
															input: {
																...params.slotProps.input,
																startAdornment: (
																	<>
																		<InputAdornment position="start">
																			{selectedPerson ? (
																				<Avatar className="person-autocomplete__input-avatar">
																					{getPersonInitial(selectedPerson.name)}
																				</Avatar>
																			) : (
																				<SearchIcon fontSize="small" />
																			)}
																		</InputAdornment>
																		{params.slotProps.input.startAdornment}
																	</>
																),
															},
															htmlInput: {
																...params.slotProps.htmlInput,
																onBlur: (event: FocusEvent<HTMLInputElement>) => {
																	params.slotProps.htmlInput.onBlur?.(event);
																	field.onBlur();
																},
															},
														}}
													/>
												)}
											/>
										)}
									/>
								)}

								<FormControl
									fullWidth
									error={Boolean(errors.type)}
									className="transaction-type-control transaction-form__field transaction-form__field--type"
								>
									<span className="transaction-type-control__label">Tipo</span>

									<Controller
										name="type"
										control={control}
										render={({ field }) => (
											<RadioGroup
												className="transaction-type-options"
												value={String(field.value)}
												onChange={(event) =>
													field.onChange(Number(event.target.value))
												}
											>
												{transactionTypeOptions.map((option) => {
													const isDisabled =
														option.value === TransactionType.Revenue &&
														isSelectedPersonUnderAge;

													return (
														<label
															key={option.value}
															className={`transaction-type-option ${
																field.value === option.value ? "is-selected" : ""
															} ${isDisabled ? "is-disabled" : ""}`.trim()}
														>
															<Radio
																value={String(option.value)}
																disabled={isDisabled}
																slotProps={{
																	input: { "aria-label": option.label },
																}}
															/>
															<span className="transaction-type-option__icon">
																{transactionTypeIcons[option.value]}
															</span>
															<span>{option.label}</span>
														</label>
													);
												})}
											</RadioGroup>
										)}
									/>
									<FormHelperText>
										{isSelectedPersonUnderAge
											? "Pessoas menores de 18 anos podem registrar apenas despesas."
											: errors.type?.message}
									</FormHelperText>
								</FormControl>

								<TextField
									label="Descrição"
									placeholder="Ex.: Conta de energia"
									fullWidth
									className="transaction-form__field transaction-form__field--description"
									{...register("description")}
									error={Boolean(errors.description)}
									helperText={errors.description?.message}
								/>

								<Controller
									name="amount"
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											label="Valor"
											placeholder="0,00"
											fullWidth
											className="transaction-form__field transaction-form__field--amount"
											value={amountText}
											onBlur={() => {
												field.onBlur();
												setAmountText(formatCurrencyInput(field.value));
											}}
											onChange={(event) => {
												const nextText = event.target.value;
												const nextValue = parseCurrencyInput(nextText);

												setAmountText(nextText);
												field.onChange(nextValue);
											}}
											error={Boolean(fieldState.error)}
											helperText={fieldState.error?.message}
											slotProps={{
												input: {
													startAdornment: (
														<InputAdornment position="start">R$</InputAdornment>
													),
												},
												htmlInput: {
													inputMode: "decimal",
												},
											}}
										/>
									)}
								/>

								<TextField
									label="Data da transação"
									type="date"
									fullWidth
									className="transaction-form__field transaction-form__field--date"
									{...register("transactionDate")}
									error={Boolean(errors.transactionDate)}
									helperText={errors.transactionDate?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<CalendarTodayOutlinedIcon fontSize="small" />
												</InputAdornment>
											),
										},
										htmlInput: {
											max: getTodayDateOnly(),
											onClick: (event: MouseEvent<HTMLInputElement>) =>
												showDatePicker(event.currentTarget),
											onFocus: (event: FocusEvent<HTMLInputElement>) =>
												showDatePicker(event.currentTarget),
										},
										inputLabel: {
											shrink: true,
										},
									}}
								/>
							</div>

							<div className="transaction-form__actions">
								<Button
									component={Link}
									to={ROUTES.transactions}
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
									disabled={
										isSubmitting ||
										createTransaction.isPending ||
										isPeopleBlockingError ||
										isPeopleInitialLoading
									}
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
					</>
				)}
			</div>
		</section>
	);
};

export default TransactionRegisterPage;
