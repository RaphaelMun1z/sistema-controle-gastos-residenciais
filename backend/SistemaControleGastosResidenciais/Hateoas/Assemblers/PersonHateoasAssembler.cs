using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Models;

namespace SistemaControleGastosResidenciais.Hateoas.Assemblers {
    public class PersonHateoasAssembler {
        private readonly LinkGenerator _linkGenerator;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Inicializa as dependências necessárias para geração dos links HATEOAS
        public PersonHateoasAssembler(
            LinkGenerator linkGenerator,
            IHttpContextAccessor httpContextAccessor
        ) {
            _linkGenerator = linkGenerator;
            _httpContextAccessor = httpContextAccessor;
        }

        // Converte o DTO de pessoa em um recurso contendo links relacionados
        public ResourceDTO<PersonResponseDTO> ToResource(PersonResponseDTO personDTO) {
            // Obtém o contexto HTTP atual necessário para geração das URLs
            HttpContext httpContext =
                _httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException(
                    "HttpContext não disponível"
                );

            // Cria o recurso HATEOAS com os dados da pessoa
            ResourceDTO<PersonResponseDTO> resource =
                new ResourceDTO<PersonResponseDTO>(personDTO);

            // Gera a URL para consultar a própria pessoa
            string? selfUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetById",
                controller: "Person",
                values: new {
                    id = personDTO.Id
                }
            );

            // Gera a URL para consultar as transações relacionadas à pessoa
            string? transactionsUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetByPersonId",
                controller: "Transaction",
                values: new {
                    personId = personDTO.Id,
                    page = 1,
                    pageSize = 10
                }
            );

            // Adiciona os links de consulta e exclusão da pessoa
            if (selfUrl is not null) {
                resource
                    .AddLink("self", selfUrl, "GET")
                    .AddLink("delete", selfUrl, "DELETE");
            }

            // Adiciona o link para consulta das transações da pessoa
            if (transactionsUrl is not null) {
                resource.AddLink(
                    "transactions",
                    transactionsUrl,
                    "GET"
                );
            }

            return resource;
        }
    }
}