using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;

namespace SistemaControleGastosResidenciais.Services.Interfaces {
    public interface ITransactionService {
        TransactionResponseDTO FindById(Guid id);
        PagedResponseDTO<TransactionResponseDTO> FindAll(
            int page,
            int pageSize
        );
        PagedResponseDTO<TransactionResponseDTO> FindByPersonId(
            Guid personId,
            int page,
            int pageSize
        );
        TransactionResponseDTO Create(CreateTransactionRequestDTO transactionDTO);
    }
}
