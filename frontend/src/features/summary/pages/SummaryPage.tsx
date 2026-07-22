import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import "./SummaryPage.scss";

import PageHeader from "../../../shared/components/PageHeader/PageHeader";
import { ROUTES } from "../../../app/routes/paths";
import SummaryFilters from "../components/SummaryFilters";
import PersonSummaryCard from "../components/PersonSummaryCard";
import OverviewPanel from "../components/OverviewPanel";
import { useSummary } from "../hooks/useSummary";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";
import ErrorState from "../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../shared/components/DataState/EmptyState";
import { getApiErrorFeedback } from "../../../shared/api/apiError";
import SummarySkeleton from "../components/SummarySkeleton";
import walletImage from "../../../assets/images/wallet.png";

const SummaryHeaderData = {
	sector: "Resumo",
	sectorPath: ROUTES.summary,
	currentPage: "Consultar",
	title: "Resumo Financeiro",
};

const initialFilters: SummaryFiltersValue = {
	page: 1,
	pageSize: 10,
	startDate: "",
	endDate: "",
};

const getDateFilterError = (filters: SummaryFiltersValue) =>
	filters.startDate && filters.endDate && filters.startDate > filters.endDate
		? "A data inicial não pode ser posterior à data final."
		: "";

const SummaryPage = () => {
	const [filters, setFilters] = useState(initialFilters);
	const filterError = getDateFilterError(filters);
	const {
		data: summary,
		error,
		refetch,
		isLoading,
		isFetching,
		isError,
	} = useSummary(filters, !filterError);
	const errorFeedback = getApiErrorFeedback(error, "summaryLoad");
	const people = summary?.people.content ?? [];
	const shouldShowInitialSkeleton = isLoading && !summary;

	useEffect(() => {
		if (filterError) {
			return;
		}
	}, [filterError]);

	return (
		<section className="summary-page">
			<PageHeader data={SummaryHeaderData} />

			{shouldShowInitialSkeleton ? (
				<SummarySkeleton />
			) : (
				<>
					<SummaryFilters
						filters={filters}
						error={filterError}
						onChange={setFilters}
						onClear={() => setFilters(initialFilters)}
					/>

					{isFetching && people.length > 0 && (
						<span className="summary-page__fetching" role="status">
							Atualizando dados...
						</span>
					)}

					<div className="summary-layout">
						<div className="scroll-container">
							<div className="summary-container">
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
										title="Nenhum dado financeiro encontrado para o período selecionado."
										description="Ajuste o período ou registre novas transações para visualizar o resumo."
										image={walletImage}
										imageAlt="Carteira vazia"
									/>
								)}

								{!isError &&
									people.map((person) => (
										<PersonSummaryCard key={person.personId} person={person} />
									))}

								{!isError && (summary?.people.totalPages ?? 0) > 1 && (
									<Pagination
										className="summary-page__pagination"
										page={filters.page}
										count={summary?.people.totalPages ?? 1}
										onChange={(_event, page) =>
											setFilters((current) => ({ ...current, page }))
										}
										color="primary"
									/>
								)}
							</div>
						</div>

						<aside className="summary-aside">
							<OverviewPanel
								totalRevenue={summary?.totalRevenue ?? 0}
								totalExpense={summary?.totalExpense ?? 0}
								balance={summary?.balance ?? 0}
							/>
						</aside>
					</div>
				</>
			)}
		</section>
	);
};

export default SummaryPage;
