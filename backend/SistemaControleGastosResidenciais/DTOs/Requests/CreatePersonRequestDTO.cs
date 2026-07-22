using System.ComponentModel.DataAnnotations;

namespace SistemaControleGastosResidenciais.DTOs.Requests {
    public record CreatePersonRequestDTO(
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(150, ErrorMessage = "O nome não pode ter mais de 150 caracteres.")]
        string Name,

        DateOnly BirthDate
    );
}
