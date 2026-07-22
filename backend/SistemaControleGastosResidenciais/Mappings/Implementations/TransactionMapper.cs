using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Mappings.Interfaces;

namespace SistemaControleGastosResidenciais.Mappings.Implementations {
    public class TransactionMapper : IMapper<Transaction, TransactionResponseDTO>, IMapper<CreateTransactionRequestDTO, Transaction> {
        // Converte uma entidade Transaction para um DTO de resposta
        public TransactionResponseDTO ToResponse(Transaction transaction) {
            return ToResponse(transaction, null);
        }

        public TransactionResponseDTO ToResponse(Transaction transaction, string? personName) {
            return new TransactionResponseDTO(
                transaction.Id,
                transaction.PersonId,
                personName ?? transaction.Person?.Name ?? string.Empty,
                transaction.Amount,
                transaction.Type,
                transaction.Description,
                transaction.TransactionDate,
                transaction.CreatedAt
            );
        }

        // Converte um DTO de criação para uma entidade Transaction
        public Transaction ToResponse(CreateTransactionRequestDTO transactionDTO) {
            return new Transaction(
                transactionDTO.PersonId,
                transactionDTO.Amount,
                transactionDTO.Type,
                transactionDTO.Description,
                transactionDTO.TransactionDate
            );
        }

        // Converte uma lista de entidades Transaction para uma lista de DTOs de resposta
        public List<TransactionResponseDTO> ToResponseList(IEnumerable<Transaction> transactions) {
            return transactions
                .Select(ToResponse)
                .ToList();
        }

        // Converte uma lista de DTOs de criação para uma lista de entidades Transaction
        public List<Transaction> ToResponseList(IEnumerable<CreateTransactionRequestDTO> transactionsDTO) {
            return transactionsDTO
                .Select(ToResponse)
                .ToList();
        }
    }
}
