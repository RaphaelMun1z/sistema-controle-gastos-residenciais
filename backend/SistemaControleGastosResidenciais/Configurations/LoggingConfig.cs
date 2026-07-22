using Serilog;

namespace SistemaControleGastosResidenciais.Configurations {
    public static class LoggingConfig {
        // Adiciona a configuração do Serilog para logging
        public static void AddSerilogLogging(this WebApplicationBuilder builder) {
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.Debug()
                .CreateLogger();
            builder.Host.UseSerilog();
        }
    }
}