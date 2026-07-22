// Utilizei um pré-fixo "api" nas endpoints da API, para indicar que se trata de uma API Rest
// Também utilizei a versão "v1" para indicar que é a primeira versão da API
// Isso permite que futuras versões da API sejam lançadas sem quebrar a compatibilidade com clientes existentes
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Assemblers;
using SistemaControleGastosResidenciais.Hateoas.Models;
using SistemaControleGastosResidenciais.Services.Interfaces;

namespace SistemaControleGastosResidenciais.Controllers {
    [ApiController]
    [Route("api/v1/accounts")]
    [Authorize]
    [Tags("Contas")]
    public class AccountController : ControllerBase {
        private readonly IAccountService _accountService;
        private readonly AccountHateoasAssembler _accountHateoasAssembler;

        private readonly ILogger<AccountController> _logger;

        // O construtor recebe uma instância do serviço de contas, que é injetada pelo mecanismo de injeção de dependência
        public AccountController(
            IAccountService accountService,
            AccountHateoasAssembler accountHateoasAssembler,
            ILogger<AccountController> logger
        ) {
            _accountService = accountService;
            _accountHateoasAssembler = accountHateoasAssembler;
            _logger = logger;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResourceDTO<AccountResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResourceDTO<AccountResponseDTO>> GetById(Guid id) {
            _logger.LogDebug("Buscando conta pelo ID {AccountId}", id);
            
            // Chama o método de busca presente no serviço, passando o ID da conta a ser buscada
            // Retorna a conta encontrada, com status 200, indicando que a operação foi bem sucedida
            AccountResponseDTO accountFound = _accountService.FindById(id);
            ResourceDTO<AccountResponseDTO> resource = _accountHateoasAssembler.ToResource(accountFound);

            return Ok(resource);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResourceDTO<AccountResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public ActionResult<ResourceDTO<AccountResponseDTO>> Create([FromBody] CreateAccountRequestDTO accountDTO) {
            _logger.LogInformation("Solicitada criação de nova conta");
            
            // Solicita ao serviço a criação da conta
            AccountResponseDTO createdAccount = _accountService.Create(accountDTO);

            ResourceDTO<AccountResponseDTO> resource = _accountHateoasAssembler.ToResource(createdAccount);

            _logger.LogInformation("Conta criada com sucesso com ID {AccountId}", createdAccount.Id);
            
            return CreatedAtAction(
                nameof(GetById),
                new { id = createdAccount.Id },
                resource
            );
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteById(Guid id) {
            _logger.LogInformation("Solicitada exclusão da conta {AccountId}", id);

            // Solicita ao serviço a exclusão da conta pelo ID
            _accountService.Delete(id);

            _logger.LogInformation("Conta {AccountId} excluída com sucesso", id);

            return NoContent();
        }
    }
}