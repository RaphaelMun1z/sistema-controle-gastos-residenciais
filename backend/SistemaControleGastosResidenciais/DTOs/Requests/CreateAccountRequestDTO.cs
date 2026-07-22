using System.ComponentModel.DataAnnotations;

namespace SistemaControleGastosResidenciais.DTOs.Requests {
    public record CreateAccountRequestDTO(
        Guid PersonId,

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Informe um e-mail válido.")]
        [MaxLength(150, ErrorMessage = "O e-mail não pode ter mais de 150 caracteres.")]
        string Email,

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MaxLength(255, ErrorMessage = "A senha não pode ter mais de 255 caracteres.")]
        string Password
    );
}
