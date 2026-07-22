using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Repositories.Projections;

namespace SistemaControleGastosResidenciais.Repositories.Interfaces {
    public interface IFinancialSummaryRepository {
        List<PersonFinancialSummaryProjection> FindFinancialSummaryByPerson(
            int page,
            int pageSize,
            DateOnly? startDate,
            DateOnly? endDate
        );

        int CountPeople();

        decimal CalculateTotalRevenue(
            DateOnly? startDate,
            DateOnly? endDate
        );

        decimal CalculateTotalExpense(
            DateOnly? startDate,
            DateOnly? endDate
        );
    }
}