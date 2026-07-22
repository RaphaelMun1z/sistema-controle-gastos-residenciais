namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record FinancialSummaryResponseDTO(
         decimal TotalRevenue,
         decimal TotalExpense,
         decimal Balance,
         PagedResponseDTO<PersonFinancialSummaryResponseDTO> People
     );
}