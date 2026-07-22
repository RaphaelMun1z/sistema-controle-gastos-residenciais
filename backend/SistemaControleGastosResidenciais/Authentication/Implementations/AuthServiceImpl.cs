using Microsoft.AspNetCore.Identity;
using SistemaControleGastosResidenciais.Authentication.Interfaces;
using SistemaControleGastosResidenciais.Authentication.Models;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using SistemaControleGastosResidenciais.Data;

namespace SistemaControleGastosResidenciais.Authentication.Implementations {
    public class AuthServiceImpl : IAuthService {
        private readonly IAccountRepository _accountRepository;
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher<Account> _passwordHasher;
        private readonly IPersonService _personService;
        private readonly IAccountService _accountService;
        private readonly AppDbContext _context;

        private readonly ILogger<AuthServiceImpl> _logger;

        // Recebe as dependências necessárias para autenticação
        public AuthServiceImpl(
            IAccountRepository accountRepository,
            ITokenService tokenService,
            IPasswordHasher<Account> passwordHasher,
            IAccountService accountService,
            IPersonService personService,
            AppDbContext context,
            ILogger<AuthServiceImpl> logger
        ) {
            _accountRepository = accountRepository;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
            _personService = personService;
            _accountService = accountService;
            _context = context;
            _logger = logger;
        }

        // Registra uma nova pessoa e sua respectiva conta
        public RegisterResponseDTO Register(RegisterRequestDTO registerDTO) {
            // Verifica se já existe uma conta com o e-mail informado
            Account? accountByEmail = _accountRepository.FindByEmail(registerDTO.Email);

            if (accountByEmail != null) {
                _logger.LogWarning("Tentativa de cadastro com e-mail já existente");

                throw new InvalidOperationException("Já existe uma conta cadastrada com este e-mail");
            }

            using IDbContextTransaction transaction = _context.Database.BeginTransaction();

            try {
                // Cria a pessoa
                CreatePersonRequestDTO personDTO =
                    new CreatePersonRequestDTO(
                        registerDTO.Name,
                        registerDTO.BirthDate
                    );

                PersonResponseDTO createdPerson = _personService.Create(personDTO);

                // Cria a conta vinculada à pessoa
                CreateAccountRequestDTO accountDTO =
                    new CreateAccountRequestDTO(
                        createdPerson.Id,
                        registerDTO.Email,
                        registerDTO.Password
                    );

                AccountResponseDTO createdAccount = _accountService.Create(accountDTO);

                // Confirma a criação da pessoa e da conta
                transaction.Commit();

                _logger.LogInformation(
                    "Cadastro realizado com sucesso para a conta {AccountId} e pessoa {PersonId}",
                    createdAccount.Id,
                    createdPerson.Id
                );

                return new RegisterResponseDTO(
                    createdAccount.Id,
                    createdPerson.Id,
                    createdPerson.Name,
                    createdPerson.BirthDate,
                    createdPerson.Age,
                    createdAccount.Email
                );
            } catch {
                // Desfaz todas as alterações caso alguma operação falhe
                transaction.Rollback();
                throw;
            }
        }

        // Autentica uma conta utilizando e-mail e senha
        public LoginResponseDTO Login(LoginRequestDTO loginDTO) {
            // Busca a conta pelo e-mail informado
            Account? account = _accountRepository.FindByEmail(loginDTO.Email);

            // Retorna o mesmo erro para e-mail inexistente ou senha inválida
            if (account == null) {
                _logger.LogWarning("Tentativa de autenticação com credenciais inválidas");
                throw new UnauthorizedAccessException("E-mail ou senha inválidos");
            }

            // Verifica se a senha informada corresponde ao hash armazenado
            PasswordVerificationResult passwordResult =
                _passwordHasher.VerifyHashedPassword(
                    account,
                    account.Password,
                    loginDTO.Password
                );

            if (passwordResult == PasswordVerificationResult.Failed) {
                _logger.LogWarning("Tentativa de autenticação com credenciais inválidas");
                throw new UnauthorizedAccessException("E-mail ou senha inválidos");
            }

            // Gera o token de acesso para a conta autenticada
            GeneratedToken generatedToken = _tokenService.GenerateAccessToken(account);

            _logger.LogInformation("Conta {AccountId} autenticada com sucesso", account.Id);

            return new LoginResponseDTO(
                generatedToken.Token,
                generatedToken.ExpiresAt
            );
        }

        // Retorna informações do usuário autenticado com base no ID da conta
        public AuthUserResponseDTO FindAuthenticatedUser(Guid accountId) {
            if (accountId == Guid.Empty) {
                _logger.LogWarning("Tentativa de buscar usuário autenticado com ID de conta inválido");
                throw new UnauthorizedAccessException("Usuário não autenticado");
            }

            Account? account = _accountRepository.FindById(accountId);

            if (account == null) {
                _logger.LogWarning("Conta autenticada não encontrada para o ID {AccountId}", accountId);
                throw new UnauthorizedAccessException("Usuário não autenticado");
            }

            PersonResponseDTO person = _personService.FindById(account.PersonId);

            return new AuthUserResponseDTO(
                account.Id,
                account.PersonId,
                person.Name,
                account.Email
            );
        }
    }
}