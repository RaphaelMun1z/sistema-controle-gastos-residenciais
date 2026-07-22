namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record RegisterResponseDTO(
        Guid AccountId,
        Guid PersonId,
        string Name,
        DateOnly BirthDate,
        int Age,
        string Email
    );
}