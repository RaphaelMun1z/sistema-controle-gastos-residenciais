using Microsoft.EntityFrameworkCore;
using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Data {
    // Responsável por organizar o acesso aos dados da aplicação
    public class AppDbContext : DbContext {
        // Recebe as configurações do banco definidas na aplicação e as encaminha para o DbContext base
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Define os conjuntos de entidades que serão gerenciados pelo Entity Framework
        public DbSet<Person> People { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        // Aplica automaticamente todas as configurações de mapeamento das entidades,
        // como chaves, relacionamentos, campos obrigatórios e regras de exclusão
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
