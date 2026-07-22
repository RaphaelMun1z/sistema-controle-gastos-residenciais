using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Assemblers;
using SistemaControleGastosResidenciais.Hateoas.Models;
using SistemaControleGastosResidenciais.Services.Interfaces;

// Utilizei um pré-fixo "api" nas endpoints da API, para indicar que se trata de uma API Rest
// Também utilizei a versão "v1" para indicar que é a primeira versão da API
// Isso permite que futuras versões da API sejam lançadas sem quebrar a compatibilidade com clientes existentes
namespace SistemaControleGastosResidenciais.Controllers {
    [ApiController]
    [Route("api/v1/transactions")]
    [Authorize]
    [Tags("Transações")]
    public class TransactionController : ControllerBase {
        private readonly ITransactionService _transactionService;
        private readonly TransactionHateoasAssembler _transactionHateoasAssembler;

        private readonly ILogger<TransactionController> _logger;

        // O construtor recebe uma instância do serviço de transações, que é injetada pelo mecanismo de injeção de dependência
        public TransactionController(
            ITransactionService transactionService,
            TransactionHateoasAssembler transactionHateoasAssembler,
            ILogger<TransactionController> logger) {
            _transactionService = transactionService;
            _transactionHateoasAssembler = transactionHateoasAssembler;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PagedResponseDTO<TransactionResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PagedResponseDTO<TransactionResponseDTO>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        ) {
            _logger.LogDebug("Buscando transações com paginação: página {Page}, tamanho {PageSize}", page, pageSize);

            // Chama o método de busca presente no serviço, passando os parâmetros de paginação
            PagedResponseDTO<TransactionResponseDTO> transactions = _transactionService.FindAll(page, pageSize);

            return Ok(transactions);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResourceDTO<TransactionResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResourceDTO<TransactionResponseDTO>> GetById(Guid id) {
            _logger.LogDebug("Buscando transação pelo ID {TransactionId}", id);

            // Chama o método de busca presente no serviço, passando o ID da transação a ser buscada
            // Retorna a transação encontrada, com status 200, indicando que a operação foi bem sucedida
            TransactionResponseDTO transactionFound = _transactionService.FindById(id);
            ResourceDTO<TransactionResponseDTO> resource = _transactionHateoasAssembler.ToResource(transactionFound);

            return Ok(resource);
        }

        [HttpGet("person/{personId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PagedResponseDTO<TransactionResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<PagedResponseDTO<TransactionResponseDTO>> GetByPersonId(
            Guid personId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        ) {
            _logger.LogDebug("Buscando transações da pessoa {PersonId}: página {Page}, tamanho {PageSize}", personId, page, pageSize);

            // Chama o método de busca presente no serviço, passando o ID da pessoa e os parâmetros de paginação
            PagedResponseDTO<TransactionResponseDTO> transactions =
                _transactionService.FindByPersonId(
                    personId,
                    page,
                    pageSize
                );

            return Ok(transactions);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResourceDTO<TransactionResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public ActionResult<ResourceDTO<TransactionResponseDTO>> Create([FromBody] CreateTransactionRequestDTO transactionDTO) {
            _logger.LogInformation("Solicitada criação de nova transação para a pessoa {PersonId}", transactionDTO.PersonId);

            // Solicita ao serviço a criação da transação
            TransactionResponseDTO createdTransaction = _transactionService.Create(transactionDTO);
            ResourceDTO<TransactionResponseDTO> resource = _transactionHateoasAssembler.ToResource(createdTransaction);

            _logger.LogInformation("Transação criada com sucesso com ID {TransactionId}", createdTransaction.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdTransaction.Id },
                resource
            );
        }
    }
}