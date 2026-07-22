using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public class PersonOperationFilter : IOperationFilter {
        public void Apply(OpenApiOperation operation, OperationFilterContext context) {
            string? controllerName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["controller"];

            if (controllerName != "Person") {
                return;
            }

            string? actionName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["action"];

            switch (actionName) {
                case "GetAll":
                    operation.Summary = "Lista todas as pessoas";
                    operation.Description =
                        "Retorna uma lista paginada com as pessoas cadastradas no sistema. " +
                        "Permite filtrar os resultados pelo nome através do parâmetro de busca";

                    if (operation.Parameters != null) {
                        foreach (OpenApiParameter parameter in operation.Parameters) {
                            switch (parameter.Name) {
                                case "page":
                                    parameter.Description = "Número da página a ser consultada";
                                    break;

                                case "pageSize":
                                    parameter.Description = "Quantidade de registros por página, entre 1 e 100";
                                    break;

                                case "search":
                                    parameter.Description = "Texto utilizado para filtrar pessoas pelo nome";
                                    break;
                            }
                        }
                    }

                    break;

                case "GetById":
                    operation.Summary = "Busca uma pessoa pelo ID";
                    operation.Description =
                        "Retorna os dados da pessoa associada ao identificador informado";
                    break;

                case "Create":
                    operation.Summary = "Cria uma nova pessoa";
                    operation.Description =
                        "Cadastra uma nova pessoa no sistema utilizando nome e data de nascimento";
                    break;

                case "DeleteById":
                    operation.Summary = "Exclui uma pessoa";
                    operation.Description =
                        "Remove a pessoa associada ao identificador informado. " +
                        "As contas e transações vinculadas também são removidas conforme as regras de relacionamento";
                    break;
            }
        }
    }
}