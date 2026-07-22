using Microsoft.Data.SqlClient;

namespace SistemaControleGastosResidenciais.Configurations {
    public static class DatabaseInitializer {
        public static void EnsureDatabaseExists(IConfiguration configuration) {
            string connectionString =
                configuration.GetConnectionString("MSSQLServerSQLConnectionString")
                ?? throw new InvalidOperationException("String de conexão não encontrada");

            SqlConnectionStringBuilder connectionBuilder = new SqlConnectionStringBuilder(connectionString);

            string databaseName = connectionBuilder.InitialCatalog;

            if (string.IsNullOrWhiteSpace(databaseName)) {
                throw new InvalidOperationException("Nome do banco de dados não configurado");
            }

            connectionBuilder.InitialCatalog = "master";

            using SqlConnection connection = new SqlConnection(connectionBuilder.ConnectionString);

            connection.Open();

            using SqlCommand command = connection.CreateCommand();

            command.CommandText =
                """
                IF DB_ID(@databaseName) IS NULL
                BEGIN
                    DECLARE @sql NVARCHAR(MAX) =
                        N'CREATE DATABASE ' + QUOTENAME(@databaseName);

                    EXEC sp_executesql @sql;
                END
                """;

            command.Parameters.AddWithValue("@databaseName", databaseName);

            command.ExecuteNonQuery();
        }
    }
}