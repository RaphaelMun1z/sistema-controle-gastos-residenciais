namespace SistemaControleGastosResidenciais.DTOs.Requests {
    public record RegisterRequestDTO(
        string Name,
        DateOnly BirthDate,
        string Email,
        string Password
    );
}