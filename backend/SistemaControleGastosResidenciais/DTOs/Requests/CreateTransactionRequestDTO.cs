using SistemaControleGastosResidenciais.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaControleGastosResidenciais.DTOs.Requests {
    public record CreateTransactionRequestDTO(
        Guid PersonId,

        [Range(
            typeof(decimal),
            "0.01",
            "79228162514264337593543950335",
            ErrorMessage = "O valor da transação deve ser maior que zero."
        )]
        decimal Amount,

        TransactionTypeEnum Type,

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(255, ErrorMessage = "A descrição não pode ter mais de 255 caracteres.")]
        string Description,

        DateOnly TransactionDate
    );
}