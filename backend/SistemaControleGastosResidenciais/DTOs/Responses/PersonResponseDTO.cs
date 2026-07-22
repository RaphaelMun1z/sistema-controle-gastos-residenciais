namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record PersonResponseDTO(
        Guid Id,
        string Name,
        DateOnly BirthDate,
        int Age
    );
}
