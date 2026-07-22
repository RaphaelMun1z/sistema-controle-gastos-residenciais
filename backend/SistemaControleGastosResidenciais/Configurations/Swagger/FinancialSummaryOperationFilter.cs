using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public class FinancialSummaryOperationFilter : IOperationFilter {
        public void Apply(
            OpenApiOperation operation,
            OperationFilterContext context
        ) {
            string? controllerName = context.ApiDescription.ActionDescriptor.RouteValues["controller"];

            if (controllerName != "FinancialSummary") {
                return;
            }

            string? actionName = context.ApiDescription.ActionDescriptor.RouteValues["action"];

            if (actionName == "GetFinancialSummary") {
                operation.Summary = "Consulta o resumo financeiro";

                operation.Description =
                    "Retorna os totais de receitas, despesas e saldo geral, " +
                    "além do resumo financeiro individual de cada pessoa";
            }
        }
    }
}