namespace SistemaControleGastosResidenciais.Configurations {
    public static class CorsConfig {
        private const string CorsPolicyName = "DefaultCorsPolicy";

        public static IServiceCollection AddCorsConfiguration(
            this IServiceCollection services,
            IConfiguration configuration
        ) {
            string[] allowedOrigins =
                configuration
                    .GetSection("Cors:AllowedOrigins")
                    .Get<string[]>()
                ?? Array.Empty<string>();

            services.AddCors(options => {
                options.AddPolicy(CorsPolicyName, policy => {
                    policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            return services;
        }

        public static IApplicationBuilder UseCorsConfiguration(this IApplicationBuilder app) {
            app.UseCors(CorsPolicyName);
            return app;
        }
    }
}