namespace SistemaControleGastosResidenciais.Repositories.Projections {
    public record PersonFinancialSummaryProjection(
       Guid PersonId,
       string Name,
       decimal TotalRevenue,
       decimal TotalExpense
   );
}