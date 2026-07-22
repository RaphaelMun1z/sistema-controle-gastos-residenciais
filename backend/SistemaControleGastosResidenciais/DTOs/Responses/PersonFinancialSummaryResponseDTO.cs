namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record PersonFinancialSummaryResponseDTO(
        Guid PersonId,
        string Name,
        decimal TotalRevenue,
        decimal TotalExpense,
        decimal Balance
    );
}