namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record AccountResponseDTO(
        Guid Id,
        Guid PersonId,
        string Email
    );
}
