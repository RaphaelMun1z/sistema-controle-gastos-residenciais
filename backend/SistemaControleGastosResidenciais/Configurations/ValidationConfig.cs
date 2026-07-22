using Microsoft.AspNetCore.Mvc;

namespace SistemaControleGastosResidenciais.Configurations {
    public static class ValidationConfig {
        public static IServiceCollection AddValidationConfiguration(
            this IServiceCollection services
        ) {
            services.Configure<ApiBehaviorOptions>(options => {
                options.InvalidModelStateResponseFactory = context => {
                    ValidationProblemDetails problemDetails =
                        new ValidationProblemDetails(context.ModelState) {
                            Status = StatusCodes.Status400BadRequest,
                            Title = "Erro de validação",
                            Detail = "Um ou mais campos possuem valores inválidos",
                            Instance = context.HttpContext.Request.Path
                        };

                    return new BadRequestObjectResult(problemDetails);
                };
            });

            return services;
        }
    }
}
