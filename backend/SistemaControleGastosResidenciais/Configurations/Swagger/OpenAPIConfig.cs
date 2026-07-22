using Microsoft.OpenApi;

namespace SistemaControleGastosResidenciais.Configurations.Swagger {
    public static class OpenAPIConfig {
        public static OpenApiInfo CreateOpenApiInfo() {
            return new OpenApiInfo {
                Title = "Sistema de Controle de Gastos Residenciais",
                Version = "v1",
                Description = "API para gerenciamento de gastos residenciais",
                Contact = new OpenApiContact {
                    Name = "Raphael Muniz Varela",
                    Email = "raphaelmunizvarela@gmail.com",
                    Url = new Uri("https://github.com/RaphaelMun1z")
                },
                License = new OpenApiLicense {
                    Name = "MIT",
                    Url = new Uri("https://opensource.org/licenses/MIT")
                }
            };
        }
    }
}