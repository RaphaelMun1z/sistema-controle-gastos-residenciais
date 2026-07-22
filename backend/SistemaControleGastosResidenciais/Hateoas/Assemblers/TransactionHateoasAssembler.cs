using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Hateoas.Models;

namespace SistemaControleGastosResidenciais.Hateoas.Assemblers {
    public class TransactionHateoasAssembler {
        private readonly LinkGenerator _linkGenerator;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Inicializa as dependências necessárias para geração dos links HATEOAS
        public TransactionHateoasAssembler(
            LinkGenerator linkGenerator,
            IHttpContextAccessor httpContextAccessor
        ) {
            _linkGenerator = linkGenerator;
            _httpContextAccessor = httpContextAccessor;
        }

        // Converte o DTO de transação em um recurso contendo links relacionados
        public ResourceDTO<TransactionResponseDTO> ToResource(TransactionResponseDTO transactionDTO) {
            // Obtém o contexto HTTP atual necessário para geração das URLs
            HttpContext httpContext =
                _httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException(
                    "HttpContext não disponível"
                );

            // Cria o recurso HATEOAS com os dados da transação
            ResourceDTO<TransactionResponseDTO> resource =
                new ResourceDTO<TransactionResponseDTO>(transactionDTO);

            // Gera a URL para consultar a própria transação
            string? selfUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetById",
                controller: "Transaction",
                values: new {
                    id = transactionDTO.Id
                }
            );

            // Gera a URL para consultar a pessoa relacionada à transação
            string? personUrl = _linkGenerator.GetUriByAction(
                httpContext,
                action: "GetById",
                controller: "Person",
                values: new {
                    id = transactionDTO.PersonId
                }
            );

            // Adiciona o link para consulta da própria transação
            if (selfUrl is not null) {
                resource.AddLink(
                    "self",
                    selfUrl,
                    "GET"
                );
            }

            // Adiciona o link para consulta da pessoa relacionada à transação
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