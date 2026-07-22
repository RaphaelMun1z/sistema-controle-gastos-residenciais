using SistemaControleGastosResidenciais.Enums;

namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record TransactionResponseDTO(
        Guid Id,
        Guid PersonId,
        string PersonName,
        decimal Amount,
        TransactionTypeEnum Type,
        string Description,
        DateOnly TransactionDate,
        DateTime CreatedAt
    );
}
