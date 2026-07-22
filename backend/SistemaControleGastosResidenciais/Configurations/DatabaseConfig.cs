using Microsoft.EntityFrameworkCore;
using SistemaControleGastosResidenciais.Data;

namespace SistemaControleGastosResidenciais.Configurations {
    public static class DatabaseConfig {
        public static IServiceCollection AddDatabaseConfiguration(
            this IServiceCollection services,
            IConfiguration configuration
        ) {
            // Consulta a string de conexão do arquivo appsettings.json
            var connectionString = configuration["ConnectionStrings:MSSQLServerSQLConnectionString"];
            if(string.IsNullOrEmpty(connectionString)) {
                throw new ArgumentNullException("Connection string 'MSSQLServerSQLConnectionString' not found.");
            }

            // Configura o contexto do banco de dados usando o SQL Server
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString)
            );
            return services;
        }
    }
}