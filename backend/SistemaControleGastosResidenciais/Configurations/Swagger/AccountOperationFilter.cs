using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public class AccountOperationFilter : IOperationFilter {
        public void Apply(OpenApiOperation operation, OperationFilterContext context) {
            string? controllerName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["controller"];

            if (controllerName != "Account") {
                return;
            }

            string? actionName =
                context.ApiDescription.ActionDescriptor
                    .RouteValues["action"];

            switch (actionName) {
                case "GetById":
                    operation.Summary = "Busca uma conta pelo ID";
                    operation.Description =
                        "Retorna os dados da conta associada ao identificador informado";
                    break;

                case "Create":
                    operation.Summary = "Cria uma nova conta";
                    operation.Description =
                        "Cria uma conta vinculada a uma pessoa existente. " +
                        "O e-mail deve ser único e cada pessoa pode possuir apenas uma conta";
                    break;

                case "DeleteById":
                    operation.Summary = "Exclui uma conta";
                    operation.Description =
                        "Remove a conta associada ao identificador informado";
                    break;
            }
        }
    }
}