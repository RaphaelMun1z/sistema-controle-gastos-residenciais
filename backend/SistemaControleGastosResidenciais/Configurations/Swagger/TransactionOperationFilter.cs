using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public class TransactionOperationFilter : IOperationFilter {
        public void Apply(OpenApiOperation operation, OperationFilterContext context) {
            string? controllerName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["controller"];

            if (controllerName != "Transaction") {
                return;
            }

            string? actionName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["action"];

            switch (actionName) {
                case "GetAll":
                    operation.Summary = "Lista todas as transações";
                    operation.Description =
                        "Retorna uma lista paginada com todas as transações cadastradas no sistema";
                    break;

                case "GetById":
                    operation.Summary = "Busca uma transação pelo ID";
                    operation.Description =
                        "Retorna os dados da transação associada ao identificador informado";
                    break;

                case "GetByPersonId":
                    operation.Summary = "Lista as transações de uma pessoa";
                    operation.Description =
                        "Retorna uma lista paginada com as transações associadas à pessoa informada, ordenadas da mais recente para a mais antiga";
                    break;

                case "Create":
                    operation.Summary = "Cria uma nova transação";
                    operation.Description =
                        "Registra uma nova despesa ou receita para uma pessoa existente. " +
                        "Pessoas menores de 18 anos podem registrar apenas despesas";
                    break;
            }
        }
    }
}