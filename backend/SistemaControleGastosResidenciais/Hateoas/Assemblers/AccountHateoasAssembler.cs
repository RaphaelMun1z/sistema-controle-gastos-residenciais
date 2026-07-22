using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Models;

namespace SistemaControleGastosResidenciais.Hateoas.Assemblers {
    public class AccountHateoasAssembler {
        private readonly LinkGenerator _linkGenerator;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Inicializa as dependências necessárias para geração dos links HATEOAS
        public AccountHateoasAssembler(
            LinkGenerator linkGenerator,
            IHttpContextAccessor httpContextAccessor
        ) {
            _linkGenerator = linkGenerator;
            _httpContextAccessor = httpContextAccessor;
        }

        // Converte o DTO de conta em um recurso contendo links relacionados
        public ResourceDTO<AccountResponseDTO> ToResource(AccountResponseDTO accountDTO) {
            // Obtém o contexto HTTP atual necessário para geração das URLs
            HttpContext httpContext =
                _httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException(
                    "HttpContext não disponível"
                );

            // Cria o recurso HATEOAS com os dados da conta
            ResourceDTO<AccountResponseDTO> resource =
                new ResourceDTO<AccountResponseDTO>(accountDTO);

            // Gera a URL para consultar a própria conta
            string? selfUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetById",
                controller: "Account",
                values: new {
                    id = accountDTO.Id
                }
            );

            // Gera a URL para consultar a pessoa relacionada à conta
            string? personUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetById",
                controller: "Person",
                values: new {
                    id = accountDTO.PersonId
                }
            );

            // Adiciona os links de consulta e exclusão da conta
            if (selfUrl is not null) {
                resource
                    .AddLink("self", selfUrl, "GET")
                    .AddLink("delete", selfUrl, "DELETE");
            }

            // Adiciona o link para consulta da pessoa relacionada à conta
            if (personUrl is not null) {
                resource.AddLink(
                    "person",
                    personUrl,
                    "GET"
                );
            }

            return resource;
        }
    }
}