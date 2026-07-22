using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public class AuthOperationFilter : IOperationFilter {
        public void Apply(OpenApiOperation operation, OperationFilterContext context) {
            string? actionName = context.MethodInfo.Name;

            if (actionName == "Register") {
                operation.Summary = "Cadastrar usuário";
                operation.Description = "Cria uma nova pessoa e sua respectiva conta no sistema.";
            }

            if (actionName == "Login") {
                operation.Summary = "Autenticar usuário";
                operation.Description = "Autentica uma conta utilizando e-mail e senha e retorna um token JWT.";
            }

            if (actionName == "Me") {
                operation.Summary = "Consultar usuário autenticado";
                operation.Description = "Retorna os dados da conta e da pessoa associadas ao usuário autenticado, utilizando o token JWT informado na requisição.";
            }
        }
    }
}