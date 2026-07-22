import "./PeopleConsultPage.scss";

import DeleteIcon from "@mui/icons-material/Delete";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, Pagination, Snackbar, TextField } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
} from "../../../../shared/api/apiError";
import { useDeletePerson, usePeople } from "../../hooks/usePeople";
import type { Person } from "../../types/person";
import { formatDateOnly } from "../../../../shared/utils/dateOnly";

interface PeopleConsultLocationState {
	feedbackMessage?: string;
}

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

const columns: TableColumn<Person>[] = [
	{
		key: "name",
		label: columnHeader(<PersonOutlinedIcon fontSize="small" />, "Nome"),
		render: (person) =>
			cellWithIcon(<PersonOutlinedIcon fontSize="small" />, person.name),
	},
	{
		key: "birthDate",
		label: columnHeader(<CakeOutlinedIcon fontSize="small" />, "Nascimento"),
		render: (person) =>
			cellWithIcon(
				<CakeOutlinedIcon fontSize="small" />,
				formatDateOnly(person.birthDate),
			),
	},
	{
		key: "age",
		label: columnHeader(<BadgeOutlinedIcon fontSize="small" />, "Idade"),
		align: "right",
		render: (person) => `${person.age} anos`,
	},
];

const PeopleConsultHeaderData = {
	sector: "Pessoas",
	sectorPath: "/pessoas",
	currentPage: "Consultar",
	title: "Pessoas Registradas",
};

const buildPeopleSearchParams = (
	page: number,
	search: string,
): Record<string, string> =>
	search ? { page: String(page), search } : { page: String(page) };

const PeopleConsultPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const requestedPage = Number(searchParams.get("page") ?? "1");
	const search = searchParams.get("search") ?? "";
	const page =
		Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
	const pageSize = 10;
	const [searchText, setSearchText] = useState(search);
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const { data, error, isError, isLoading, isFetching, refetch } = usePeople({
		page,
		pageSize,
		search: debouncedSearch,
	});
	const people = data?.content ?? [];
	const errorFeedback = getApiErrorFeedback(error, "peopleList");
	const deletePerson = useDeletePerson();
	const routeFeedback = (location.state as PeopleConsultLocationState | null)
		?.feedbackMessage;
	const [feedbackMessage, setFeedbackMessage] = useState(routeFeedback ?? "");
	const [feedbackError, setFeedbackError] = useState("");

	useEffect(() => {
		if (routeFeedback) {
			navigate(location.pathname, { replace: true, state: null });
		}
	}, [location.pathname, navigate, routeFeedback]);

	useEffect(() => {
		if (searchParams.get("page") && page !== requestedPage) {
			setSearchParams(
				buildPeopleSearchParams(1, debouncedSearch),
				{ replace: true },
			);
		}
	}, [debouncedSearch, page, requestedPage, searchParams, setSearchParams]);

	useEffect(() => {
		const timeout = globalThis.setTimeout(() => {
			setDebouncedSearch(searchText.trim());
		}, 350);

		return () => globalThis.clearTimeout(timeout);
	}, [searchText]);

	useEffect(() => {
		if (debouncedSearch !== search) {
			setSearchParams(buildPeopleSearchParams(1, debouncedSearch), {
				replace: true,
			});
		}
	}, [debouncedSearch, search, setSearchParams]);

	const actions: TableAction<Person>[] = [
		{
			label: "Excluir",
			icon: <DeleteIcon />,
			color: "error",
			onClick: (person) => {
				const shouldRemove = window.confirm(
					`Deseja excluir ${person.name}? As transações dessa pessoa também serão removidas.`,
				);

				if (shouldRemove) {
					deletePerson.mutate(person.id, {
						onSuccess: () => setFeedbackMessage("Pessoa excluída com sucesso."),
						onError: (error) =>
							setFeedbackError(getApiErrorTitle(error, "peopleDelete")),
					});
				}
			},
		},
	];

	return (
		<section className="people-consult-page">
			<PageHeader data={PeopleConsultHeaderData} />

			<div className="people-consult-page__create">
				<TextField
					label="Buscar pessoa"
					size="small"
					value={searchText}
					onChange={(event) => setSearchText(event.target.value)}
				/>

				<Button
					component={Link}
					variant="outlined"
					to={ROUTES.personRegister}
					startIcon={<PersonAdd />}
				>
					Registrar pessoa
				</Button>
			</div>

			<div
				className={`people-consult-page__table ${
					isFetching && people.length > 0 ? "is-fetching" : ""
				}`.trim()}
			>
				{isLoading && <TableSkeleton columns={columns.length} />}

				{isError && (
					<ErrorState
						title={errorFeedback.title}
						description={errorFeedback.description}
						actionLabel={errorFeedback.actionLabel}
						onRetry={() => void refetch()}
					/>
				)}

				{!isLoading && !isError && people.length === 0 && (
					<EmptyState
						title="Nenhuma pessoa cadastrada ainda."
						description="Cadastre uma pessoa para começar a registrar e acompanhar suas transações."
					/>
				)}

				{!isLoading && !isError && people.length > 0 && (
					<>
						<span className="people-consult-page__total">
							{data?.totalElements ?? 0} pessoas cadastradas
							{isFetching ? " - atualizando..." : ""}
						</span>
						<Table
							columns={columns}
							rows={people}
							getRowId={(person) => person.id}
							actions={actions}
						/>
						{(data?.totalPages ?? 0) > 1 && (
							<Pagination
								className="people-consult-page__pagination"
								page={page}
								count={data?.totalPages ?? 1}
								onChange={(_event, nextPage) =>
									setSearchParams(
										buildPeopleSearchParams(nextPage, debouncedSearch),
									)
								}
								color="primary"
							/>
						)}
					</>
				)}
			</div>

			{feedbackError && (
				<Alert severity="error" onClose={() => setFeedbackError("")}>
					{feedbackError}
				</Alert>
			)}

			<Snackbar
				open={Boolean(feedbackMessage)}
				autoHideDuration={3000}
				onClose={() => setFeedbackMessage("")}
				message={feedbackMessage}
			/>
		</section>
	);
};

export default PeopleConsultPage;
