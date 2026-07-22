using Microsoft.AspNetCore.Identity;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Mappings.Implementations;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Services.Interfaces;

namespace SistemaControleGastosResidenciais.Services.Implementations {
    public class AccountServiceImpl : IAccountService {
        private readonly IAccountRepository _accountRepository;
        private readonly IRepository<Person> _personRepository;
        private readonly IPasswordHasher<Account> _passwordHasher;

        private readonly ILogger<AccountServiceImpl> _logger;

        private readonly AccountMapper _accountMapper = new AccountMapper();

        // Recebe os repositórios por injeção de dependência
        public AccountServiceImpl(
            IAccountRepository accountRepository,
            IRepository<Person> personRepository,
            IPasswordHasher<Account> passwordHasher,
            ILogger<AccountServiceImpl> logger
        ) {
            _accountRepository = accountRepository;
            _personRepository = personRepository;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public AccountResponseDTO FindById(Guid id) {
            // Valida o ID informado
            if (id == Guid.Empty) {
                _logger.LogWarning("Tentativa de buscar conta com ID inválido");
                throw new BadHttpRequestException("Informe um ID válido");
            }

            // Busca a conta pelo ID
            Account? foundAccount = _accountRepository.FindById(id);

            // Se a conta não for encontrada, lança uma exceção
            if (foundAccount == null) {
                _logger.LogWarning("Conta não encontrada para o ID {AccountId}", id);
                throw new KeyNotFoundException("Conta não encontrada");
            }

            // Converte a entidade encontrada para DTO de resposta
            return _accountMapper.ToResponse(foundAccount);
        }

        public AccountResponseDTO Create(CreateAccountRequestDTO accountDTO) {
            // Verifica se a pessoa informada existe
            Person? person = _personRepository.FindById(accountDTO.PersonId);

            // Se a pessoa não for encontrada, lança uma exceção
            if (person == null) {
                _logger.LogWarning("Tentativa de criar conta para pessoa inexistente {PersonId}", accountDTO.PersonId);
                throw new KeyNotFoundException("Pessoa não encontrada");
            }

            // Verifica se a pessoa já possui uma conta cadastrada
            Account? accountByPerson = _accountRepository.FindByPersonId(accountDTO.PersonId);

            // Se a pessoa já tiver uma conta, lança uma exceção
            if (accountByPerson != null) {
                _logger.LogWarning("Pessoa {PersonId} já possui uma conta cadastrada", accountDTO.PersonId);
                throw new InvalidOperationException("Esta pessoa já possui uma conta");
            }

            // Verifica se o e-mail informado já está cadastrado
            Account? accountByEmail = _accountRepository.FindByEmail(accountDTO.Email);

            // Se o e-mail já estiver cadastrado, lança uma exceção
            if (accountByEmail != null) {
                _logger.LogWarning("Tentativa de cadastrar conta com e-mail já existente");
                throw new InvalidOperationException("Já existe uma conta cadastrada com este e-mail");
            }

            // Cria uma nova conta
            // Converte o DTO de criação para uma entidade Account
            Account newAccount = _accountMapper.ToResponse(accountDTO);

            // Gera o hash da senha usando o PasswordHasher
            string passwordHash = _passwordHasher.HashPassword(
                newAccount,
                accountDTO.Password
            );

            newAccount.SetPassword(passwordHash);

            // Persiste a conta no banco de dados
            Account savedAccount = _accountRepository.Create(newAccount);

            _logger.LogInformation("Conta criada com sucesso com ID {AccountId} para a pessoa {PersonId}", savedAccount.Id, savedAccount.PersonId);

            // Converte a entidade persistida para DTO de resposta
            return _accountMapper.ToResponse(savedAccount);
        }

        public void Delete(Guid id) {
            // Valida o ID informado
            if (id == Guid.Empty) {
                _logger.LogWarning("Tentativa de excluir conta com ID inválido");
                throw new BadHttpRequestException("Informe um ID válido");
            }

            // Busca a conta pelo id
            Account? account = _accountRepository.FindById(id);

            // Se a conta não for encontrada, lança uma exceção
            if (account == null) {
                _logger.LogWarning("Tentativa de excluir conta inexistente {AccountId}", id);
                throw new KeyNotFoundException("Conta não encontrada");
            }

            // Remove a conta pelo ID
            _accountRepository.Delete(id);

            _logger.LogInformation("Conta {AccountId} excluída com sucesso", id);
        }
    }
}