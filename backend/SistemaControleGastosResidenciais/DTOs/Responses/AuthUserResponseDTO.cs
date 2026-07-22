namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record AuthUserResponseDTO(
        Guid AccountId,
        Guid PersonId,
        string Name,
        string Email
    );
}