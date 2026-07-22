using Scalar.AspNetCore;

namespace SistemaControleGastosResidenciais.Configurations.Scalar {
    public static class ScalarConfig {
        private const string AppName = "Sistema de Controle de Gastos Residenciais";

        public static WebApplication UseScalarSpecification(this WebApplication app) {
            app.MapScalarApiReference("/scalar", options => {
                options
                    .WithTitle(AppName)
                    .WithOpenApiRoutePattern("/swagger/v1/swagger.json");
            });
            return app;
        }
    }
}
