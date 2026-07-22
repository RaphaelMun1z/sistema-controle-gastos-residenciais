using SistemaControleGastosResidenciais.DTOs.Responses;

namespace SistemaControleGastosResidenciais.Services.Interfaces {
    public interface IFinancialSummaryService {
        FinancialSummaryResponseDTO FindFinancialSummary(
            int page,
            int pageSize,
            DateOnly? startDate,
            DateOnly? endDate
        );
    }
}