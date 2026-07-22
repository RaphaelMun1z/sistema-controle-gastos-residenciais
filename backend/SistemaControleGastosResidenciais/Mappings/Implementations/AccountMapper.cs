using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Mappings.Interfaces;

namespace SistemaControleGastosResidenciais.Mappings.Implementations {
    public class AccountMapper : IMapper<Account, AccountResponseDTO>, IMapper<CreateAccountRequestDTO, Account> {
        // Converte uma entidade Account para um DTO de resposta
        public AccountResponseDTO ToResponse(Account account) {
            return new AccountResponseDTO(
                account.Id,
                account.PersonId,
                account.Email
            );
        }

        // Converte um DTO de criação para uma entidade Account
        public Account ToResponse(CreateAccountRequestDTO accountDTO) {
            return new Account(
                accountDTO.PersonId,
                accountDTO.Email,
                accountDTO.Password
            );
        }

        // Converte uma lista de entidades Account para uma lista de DTOs de resposta
        public List<AccountResponseDTO> ToResponseList(IEnumerable<Account> accounts) {
            return accounts
                .Select(ToResponse)
                .ToList();
        }

        // Converte uma lista de DTOs de criação para uma lista de entidades Account
        public List<Account> ToResponseList(IEnumerable<CreateAccountRequestDTO> accountsDTO) {
            return accountsDTO
                .Select(ToResponse)
                .ToList();
        }
    }
}