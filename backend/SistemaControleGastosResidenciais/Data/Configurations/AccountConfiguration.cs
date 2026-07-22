using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Data.Configurations {
    // Define regras específicas da entidade Account que não são representadas diretamente pelas anotações
    public class AccountConfiguration : IEntityTypeConfiguration<Account> {
        public void Configure(EntityTypeBuilder<Account> builder) {
            // Garante que não existam duas contas com o mesmo e-mail
            builder.HasIndex(account => account.Email)
                .IsUnique();

            // Garante que uma pessoa tenha apenas uma conta
            builder.HasIndex(account => account.PersonId)
                .IsUnique();

            // Define a relação entre Account e Person
            // A conta pertence a uma pessoa e será excluída caso essa pessoa seja removida
            builder.HasOne(account => account.Person)
                .WithOne(person => person.Account)
                .HasForeignKey<Account>(account => account.PersonId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
