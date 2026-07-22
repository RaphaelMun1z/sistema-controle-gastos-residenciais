using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Assemblers;
using SistemaControleGastosResidenciais.Hateoas.Models;
using SistemaControleGastosResidenciais.Services.Interfaces;

// Utilizei um pré-fixo "api" nas endpoints da API, para indicar que se trata de uma API Rest
// Também utilizei a versão "v1" para indicar que é a primeira versão da API.
// Isso permite que futuras versões da API sejam lançadas sem quebrar a compatibilidade com clientes existentes.
namespace SistemaControleGastosResidenciais.Controllers {
    [ApiController]
    [Route("api/v1/people")]
    [Authorize]
    [Tags("Pessoas")]
    public class PersonController : ControllerBase {
        private readonly IPersonService _personService;
        private readonly PersonHateoasAssembler _personHateoasAssembler;

        private readonly ILogger<PersonController> _logger;

        // O construtor recebe uma instância do serviço de pessoas, que é injetada pelo mecanismo de injeção de dependência
        public PersonController(
            IPersonService personService,
            PersonHateoasAssembler personHateoasAssembler,
            ILogger<PersonController> logger
        ) {
            _personService = personService;
            _personHateoasAssembler = personHateoasAssembler;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PagedResponseDTO<PersonResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PagedResponseDTO<PersonResponseDTO>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null
        ) {
            _logger.LogDebug("Buscando pessoas com paginação: página {Page}, tamanho {PageSize}", page, pageSize);

            // Chama o método de busca presente no serviço, passando os parâmetros de paginação
            PagedResponseDTO<PersonResponseDTO> people = _personService.FindAll(page, pageSize, search);
            return Ok(people);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResourceDTO<PersonResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ResourceDTO<PersonResponseDTO>> GetById(Guid id) {
            _logger.LogDebug("Buscando pessoa pelo ID {PersonId}", id);

            // Chama o método de busca presente no serviço, passando o ID da pessoa a ser buscada
            // Retorna a pessoa encontrada, com status 200, indicando que a operação foi bem sucedida
            PersonResponseDTO personFound = _personService.FindById(id);
            ResourceDTO<PersonResponseDTO> resource = _personHateoasAssembler.ToResource(personFound);

            return Ok(resource);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResourceDTO<PersonResponseDTO>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ResourceDTO<PersonResponseDTO>> Create([FromBody] CreatePersonRequestDTO personDTO) {
            _logger.LogInformation("Solicitada criação de nova pessoa");

            // Solicita ao serviço a criação da pessoa
            PersonResponseDTO createdPerson = _personService.Create(personDTO);
            ResourceDTO<PersonResponseDTO> resource = _personHateoasAssembler.ToResource(createdPerson);

            _logger.LogInformation("Pessoa criada com sucesso com ID {PersonId}", createdPerson.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdPerson.Id },
                resource
            );
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteById(Guid id) {
            _logger.LogInformation("Solicitada exclusão da pessoa {PersonId}", id);

            // Solicita ao serviço a exclusão da pessoa pelo ID
            _personService.Delete(id);

            _logger.LogInformation("Pessoa {PersonId} excluída com sucesso", id);

            return NoContent();
        }
    }
}