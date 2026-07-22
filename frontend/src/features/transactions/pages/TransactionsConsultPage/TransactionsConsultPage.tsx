import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, {
	type TableColumn,
} from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import {
	Autocomplete,
	Avatar,
	Button,
	InputAdornment,
	Pagination,
	TextField,
} from "@mui/material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ClearIcon from "@mui/icons-material/Clear";

// React Router
import { Link, useSearchParams } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionType, type Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import { getApiErrorFeedback } from "../../../../shared/api/apiError";
import walletImage from "../../../../assets/images/wallet.png";
import { peopleQueryKey, usePeopleSearch } from "../../../people/hooks/usePeople";
import type { Person } from "../../../people/types/person";
import { formatCurrency } from "../../../summary/utils/currency";
import type { PagedResponse } from "../../../../shared/api/apiTypes";
import { formatDateOnly } from "../../../../shared/utils/dateOnly";

const columnHeader = (icon: ReactNode, label: string) => (
	<span className="table-column-header">
		{icon}
		{label}
	</span>
);

const cellWithIcon = (icon: ReactNode, value: ReactNode) => (
	<span className="table-cell-detail">
		{icon}
		<span>{value}</span>
	</span>
);

const getPersonInitial = (personName: string) =>
	personName.trim().charAt(0).toUpperCase();

const transactionTypeBadge = (transaction: Transaction) => {
	const isRevenue = transaction.type === TransactionType.Revenue;
	const Icon = isRevenue ? ArrowUpwardIcon : ArrowDownwardIcon;

	return (
		<span
			className={`transaction-type-badge ${
				isRevenue ? "is-revenue" : "is-expense"
			}`}
		>
			<Icon fontSize="small" />
			{transactionTypeLabels[transaction.type]}
		</span>
	);
};

// Cabeçalho da página
const TransactionsConsultHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Consultar",
	title: "Transações Registradas",
};

// Colunas da tabela de transações
const columns: TableColumn<Transaction>[] = [
	{
		key: "person",
		label: columnHeader(<PersonOutlinedIcon fontSize="small" />, "Pessoa"),
		render: (transaction) =>
			cellWithIcon(
				<PersonOutlinedIcon fontSize="small" />,
				transaction.personName || transaction.personId,
			),
	},
	{
		key: "description",
		label: columnHeader(
			<DescriptionOutlinedIcon fontSize="small" />,
			"Descrição",
		),
		render: (transaction) =>
			cellWithIcon(
				<DescriptionOutlinedIcon fontSize="small" />,
				transaction.description,
			),
	},
	{
		key: "transactionDate",
		label: columnHeader(<CalendarTodayOutlinedIcon fontSize="small" />, "Data"),
		render: (transaction) =>
			cellWithIcon(
				<CalendarTodayOutlinedIcon fontSize="small" />,
				formatDateOnly(transaction.transactionDate),
			),
	},
	{
		key: "type",
		label: columnHeader(<SwapVertIcon fontSize="small" />, "Tipo"),
		render: transactionTypeBadge,
	},
	{
		key: "amount",
		label: columnHeader(<PaymentsOutlinedIcon fontSize="small" />, "Valor"),
		align: "right",
		render: (transaction) =>
			cellWithIcon(
				<PaymentsOutlinedIcon fontSize="small" />,
				formatCurrency(transaction.amount),
			),
	},
];

const TransactionsConsultPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const requestedPage = Number(searchParams.get("page") ?? "1");
	const selectedPersonId = searchParams.get("personId") ?? "";
	const page =
		Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
	const pageSize = 10;
	const [personSearch, setPersonSearch] = useState("");
	const [debouncedPersonSearch, setDebouncedPersonSearch] = useState("");
	const queryClient = useQueryClient();
	const { data, error, isError, isLoading, isFetching, refetch } =
		useTransactions({ page, pageSize, personId: selectedPersonId });
	const {
		data: peopleData,
		isFetching: isPeopleFetching,
	} = usePeopleSearch({
		page: 1,
		pageSize: 10,
		search: debouncedPersonSearch,
	});
	const peopleOptions = peopleData?.content ?? [];
	const peopleById = useMemo(() => {
		const cachedPeoplePages = queryClient.getQueriesData<PagedResponse<Person>>(
			{
				queryKey: peopleQueryKey,
			},
		);

		return new Map(
			[
				...cachedPeoplePages.flatMap(([, page]) => page?.content ?? []),
				...peopleOptions,
			].map((person) => [person.id, person.name] as const),
		);
	}, [queryClient, peopleOptions]);
	const selectedPerson =
		peopleById.get(selectedPersonId) && selectedPersonId
			? {
					id: selectedPersonId,
					name: peopleById.get(selectedPersonId) ?? selectedPersonId,
					birthDate: "",
					age: 0,
				}
			: (peopleOptions.find((person) => person.id === selectedPersonId) ?? null);
	const transactions = data?.content ?? [];
	const errorFeedback = getApiErrorFeedback(error, "transactionsList");

	useEffect(() => {
		if (searchParams.get("page") && page !== requestedPage) {
			setSearchParams(
				selectedPersonId
					? { page: "1", personId: selectedPersonId }
					: { page: "1" },
				{ replace: true },
			);
		}
	}, [
		page,
		requestedPage,
		searchParams,
		selectedPersonId,
		setSearchParams,
	]);

	useEffect(() => {
		const timeout = globalThis.setTimeout(() => {
			setDebouncedPersonSearch(personSearch.trim());
		}, 350);

		return () => globalThis.clearTimeout(timeout);
	}, [personSearch]);

	const updateFilters = (personId: string, nextPage = 1) => {
		setSearchParams(
			personId ? { page: String(nextPage), personId } : { page: String(nextPage) },
		);
	};

	return (
		<section className="transactions-consult-page">
			<PageHeader data={TransactionsConsultHeaderData} />

			<div className="transactions-consult-page__toolbar">
				<Autocomplete<Person>
					className="transactions-consult-page__person-filter"
					options={peopleOptions}
					value={selectedPerson}
					inputValue={personSearch}
					loading={isPeopleFetching}
					loadingText="Buscando pessoas..."
					noOptionsText="Nenhuma pessoa encontrada"
					getOptionLabel={(person) => person.name}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					onInputChange={(_event, value) => setPersonSearch(value)}
					onChange={(_event, person) => updateFilters(person?.id ?? "")}
					renderOption={(props, person) => {
						const { key, className, ...optionProps } = props;

						return (
							<li
								key={key}
								{...optionProps}
								aria-label={person.name}
								className={`${className ?? ""} transactions-person-option`}
							>
								<Avatar className="transactions-person-option__avatar">
									{getPersonInitial(person.name)}
								</Avatar>
								<span>{person.name}</span>
							</li>
						);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Filtrar por pessoa"
							placeholder="Todas as pessoas"
							size="small"
							slotProps={{
								...params.slotProps,
								input: {
									...params.slotProps.input,
									startAdornment: (
										<>
											<InputAdornment position="start">
												<PersonOutlinedIcon fontSize="small" />
											</InputAdornment>
											{params.slotProps.input.startAdornment}
										</>
									),
								},
							}}
						/>
					)}
				/>

				{selectedPersonId && (
					<Button
						type="button"
						variant="text"
						startIcon={<ClearIcon />}
						onClick={() => {
							setPersonSearch("");
							updateFilters("");
						}}
					>
						Limpar filtro
					</Button>
				)}

				<Button
					component={Link}
					to={ROUTES.transactionRegister}
					variant="outlined"
					startIcon={<AddIcon />}
				>
					Registrar transação
				</Button>
			</div>

			<div
				className={`transactions-consult-page__table ${
					isFetching && transactions.length > 0 ? "is-fetching" : ""
				}`.trim()}
			>
				{isLoading && <TableSkeleton columns={columns.length} rows={6} />}

				{isError && (
					<ErrorState
						title={errorFeedback.title}
						description={errorFeedback.description}
						actionLabel={errorFeedback.actionLabel}
						onRetry={() => void refetch()}
					/>
				)}

				{!isLoading && !isError && transactions.length === 0 && (
					<EmptyState
						title="Nenhuma transação encontrada."
						description="Registre uma nova transação ou ajuste os filtros utilizados."
						image={walletImage}
						imageAlt="Carteira vazia"
					/>
				)}

				{!isLoading && !isError && transactions.length > 0 && (
					<>
						<span className="transactions-consult-page__total">
							{data?.totalElements ?? 0} transações registradas
							{isFetching ? " - atualizando..." : ""}
						</span>
						<Table
							columns={columns}
							rows={transactions}
							getRowId={(transaction) => transaction.id}
						/>
						{(data?.totalPages ?? 0) > 1 && (
							<Pagination
								className="transactions-consult-page__pagination"
								page={page}
								count={data?.totalPages ?? 1}
								onChange={(_event, nextPage) =>
									updateFilters(selectedPersonId, nextPage)
								}
								color="primary"
							/>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default TransactionsConsultPage;
