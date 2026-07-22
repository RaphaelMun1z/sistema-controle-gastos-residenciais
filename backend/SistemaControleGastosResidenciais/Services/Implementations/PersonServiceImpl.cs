using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Mappings.Implementations;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Services.Interfaces;

namespace SistemaControleGastosResidenciais.Services.Impl {
    public class PersonServiceImpl : IPersonService {
        private readonly IPersonRepository _personRepository;

        private readonly ILogger<PersonServiceImpl> _logger;

        private readonly PersonMapper _personMapper = new PersonMapper();

        // Recebe o repositório por injeção de dependência
        public PersonServiceImpl(
            IPersonRepository personRepository,
            ILogger<PersonServiceImpl> logger
        ) {
            _personRepository = personRepository;
            _logger = logger;
        }

        public PagedResponseDTO<PersonResponseDTO> FindAll(int page, int pageSize, string? search) {
            // Valida os parâmetros de paginação
            if (page < 1) {
                _logger.LogWarning("Tentativa de buscar pessoas com página inválida {Page}", page);
                throw new BadHttpRequestException("A página deve ser maior ou igual a 1");
            }

            if (pageSize < 1 || pageSize > 100) {
                _logger.LogWarning("Tentativa de buscar pessoas com tamanho de página inválido {PageSize}", pageSize);
                throw new BadHttpRequestException("A quantidade de registros por página deve estar entre 1 e 100");
            }

            // Busca somente os registros pertencentes à página solicitada
            List<Person> peopleList = _personRepository.FindAll(page, pageSize, search);

            // Busca a quantidade total de pessoas considerando o filtro informado
            int totalElements = _personRepository.Count(search);

            // Calcula a quantidade total de páginas
            int totalPages = (int)Math.Ceiling(totalElements / (double)pageSize);

            // Converte as entidades para DTO
            List<PersonResponseDTO> peopleResponse = _personMapper.ToResponseList(peopleList);

            return new PagedResponseDTO<PersonResponseDTO> {
                Content = peopleResponse,
                Page = page,
                PageSize = pageSize,
                TotalElements = totalElements,
                TotalPages = totalPages
            };
        }

        public PersonResponseDTO FindById(Guid id) {
            // Verifica se o ID não é nulo ou vazio
            if (id == Guid.Empty) {
                _logger.LogWarning("Tentativa de buscar pessoa com ID inválido");
                throw new BadHttpRequestException("Informe um ID válido!");
            }

            // Busca a pessoa pelo id
            Person? foundPerson = _personRepository.FindById(id);

            // Verifica se a pessoa existe
            if (foundPerson == null) {
                _logger.LogWarning("Pessoa não encontrada para o ID {PersonId}", id);
                throw new KeyNotFoundException("Pessoa não encontrada!");
            }

            // Retorna os dados da pessoa encontrada
            return _personMapper.ToResponse(foundPerson);
        }

        public PersonResponseDTO Create(CreatePersonRequestDTO personDTO) {
            // Cria uma nova instância de pessoa
            // As validações de nome e data de nascimento são realizadas pela própria entidade
            // O ID é gerado automaticamente dentro do construtor da entidade
            Person newPerson = _personMapper.ToResponse(personDTO);

            // Persiste a pessoa no banco de dados
            Person savedPerson = _personRepository.Create(newPerson);

            _logger.LogInformation("Pessoa criada com sucesso com ID {PersonId}", savedPerson.Id);

            // Converte a entidade persistida para DTO de resposta
            return _personMapper.ToResponse(savedPerson);
        }

        public void Delete(Guid id) {
            // Verifica se o ID não é nulo ou vazio
            if (id == Guid.Empty) {
                _logger.LogWarning("Tentativa de excluir pessoa com ID inválido");
                throw new BadHttpRequestException("Informe um ID válido!");
            }

            // Busca a pessoa pelo id
            Person? person = _personRepository.FindById(id);

            // Verifica se a pessoa existe
            if (person == null) {
                _logger.LogWarning("Tentativa de excluir pessoa inexistente {PersonId}", id);
                throw new KeyNotFoundException("Pessoa não encontrada!");
            }

            // Deleta a pessoa pelo ID
            _personRepository.Delete(id);

            _logger.LogInformation("Pessoa {PersonId} excluída com sucesso", id);
        }
    }
}