using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Repositories.Projections;
using SistemaControleGastosResidenciais.Services.Interfaces;

namespace SistemaControleGastosResidenciais.Services.Implementations {
    public class FinancialSummaryServiceImpl : IFinancialSummaryService {
        private readonly IFinancialSummaryRepository _financialSummaryRepository;

        private readonly ILogger<FinancialSummaryServiceImpl> _logger;

        public FinancialSummaryServiceImpl(
            IFinancialSummaryRepository financialSummaryRepository,
            ILogger<FinancialSummaryServiceImpl> logger
        ) {
            _financialSummaryRepository = financialSummaryRepository;
            _logger = logger;
        }

        public FinancialSummaryResponseDTO FindFinancialSummary(
            int page,
            int pageSize,
            DateOnly? startDate,
            DateOnly? endDate
        ) {
            if (page < 1) {
                throw new ArgumentException("A página deve ser maior ou igual a 1");
            }

            if (pageSize < 1) {
                throw new ArgumentException("O tamanho da página deve ser maior ou igual a 1");
            }

            if (
                startDate.HasValue &&
                endDate.HasValue &&
                startDate.Value > endDate.Value
            ) {
                throw new ArgumentException("A data inicial não pode ser posterior à data final");
            }

            _logger.LogDebug(
                "Buscando resumo financeiro da página {Page} com tamanho {PageSize}, de {StartDate} até {EndDate}",
                page,
                pageSize,
                startDate,
                endDate
            );

            List<PersonFinancialSummaryProjection> summaries =
                _financialSummaryRepository.FindFinancialSummaryByPerson(
                    page,
                    pageSize,
                    startDate,
                    endDate
                );

            int totalElements = _financialSummaryRepository.CountPeople();

            int totalPages = (int)Math.Ceiling(totalElements / (double)pageSize);

            List<PersonFinancialSummaryResponseDTO> people =
                summaries
                    .Select(summary =>
                        new PersonFinancialSummaryResponseDTO(
                            summary.PersonId,
                            summary.Name,
                            summary.TotalRevenue,
                            summary.TotalExpense,
                            summary.TotalRevenue - summary.TotalExpense
                        )
                    ).ToList();

            decimal totalRevenue =
                _financialSummaryRepository.CalculateTotalRevenue(
                    startDate,
                    endDate
                );

            decimal totalExpense =
                _financialSummaryRepository.CalculateTotalExpense(
                    startDate,
                    endDate
                );

            decimal balance = totalRevenue - totalExpense;

            PagedResponseDTO<PersonFinancialSummaryResponseDTO> pagedPeople =
                new() {
                    Content = people,
                    Page = page,
                    PageSize = pageSize,
                    TotalElements = totalElements,
                    TotalPages = totalPages
                };

            return new FinancialSummaryResponseDTO(
                totalRevenue,
                totalExpense,
                balance,
                pagedPeople
            );
        }
    }
}