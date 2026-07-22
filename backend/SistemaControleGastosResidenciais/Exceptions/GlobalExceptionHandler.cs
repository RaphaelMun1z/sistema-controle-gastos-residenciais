using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SistemaControleGastosResidenciais.Exceptions {
    public class GlobalExceptionHandler : IExceptionHandler {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        ) {
            // Define o status HTTP de acordo com o tipo da exceção
            int statusCode = exception switch {
                KeyNotFoundException => StatusCodes.Status404NotFound,
                BadHttpRequestException => StatusCodes.Status400BadRequest,
                ArgumentException => StatusCodes.Status400BadRequest,
                InvalidOperationException => StatusCodes.Status409Conflict,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };

            // Cria a resposta padronizada do erro
            ProblemDetails problemDetails = new ProblemDetails {
                Status = statusCode,
                Title = GetTitle(statusCode),
                Detail = GetDetail(exception, statusCode),
                Instance = httpContext.Request.Path
            };

            httpContext.Response.StatusCode = statusCode;

            await httpContext.Response.WriteAsJsonAsync(
                problemDetails,
                cancellationToken
            );

            // Indica que a exceção foi tratada
            return true;
        }

        private static string GetTitle(int statusCode) {
            return statusCode switch {
                StatusCodes.Status400BadRequest => "Requisição inválida",
                StatusCodes.Status401Unauthorized => "Não autorizado",
                StatusCodes.Status403Forbidden => "Acesso negado",
                StatusCodes.Status404NotFound => "Recurso não encontrado",
                StatusCodes.Status409Conflict => "Conflito na operação",
                _ => "Erro interno do servidor"
            };
        }

        private static string GetDetail(
            Exception exception,
            int statusCode
        ) {
            // Evita expor detalhes internos em erros inesperados
            if (statusCode == StatusCodes.Status500InternalServerError) {
                return "Ocorreu um erro inesperado ao processar a solicitação";
            }

            // Remove informações técnicas adicionadas por ArgumentException
            if (exception is ArgumentException argumentException) {
                return CleanArgumentExceptionMessage(argumentException.Message);
            }

            return exception.Message;
        }

        private static string CleanArgumentExceptionMessage(string message) {
            int parameterIndex = message.IndexOf(
                " (Parameter ",
                StringComparison.Ordinal
            );

            if (parameterIndex >= 0) {
                return message[..parameterIndex];
            }

            return message;
        }
    }
}