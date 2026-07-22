using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Data.Configurations {
    // Define regras específicas da entidade Transaction que não são representadas diretamente pelas anotações
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction> {
        public void Configure(EntityTypeBuilder<Transaction> builder) {
            // Define a precisão utilizada para valores monetários
            builder.Property(transaction => transaction.Amount)
                .HasPrecision(18, 2);

            // Cria um índice para melhorar as consultas de transações associadas a uma pessoa
            builder.HasIndex(transaction => transaction.PersonId);

            // Define a relação entre Transaction e Person
            // Cada transação pertence a uma pessoa e será excluída caso essa pessoa seja removida
            builder.HasOne(transaction => transaction.Person)
                .WithMany(person => person.Transactions)
                .HasForeignKey(transaction => transaction.PersonId)
                .OnDelete(DeleteBehavior.Cascade);

            // Garante que o valor da transação seja maior que zero
            builder.ToTable(table =>
                table.HasCheckConstraint(
                    "CK_Transactions_Amount",
                    "[Amount] > 0"
                )
            );

            // Garante que somente tipos válidos de transação sejam armazenados
            // 0 representa despesa
            // 1 representa receita
            builder.ToTable(table =>
                table.HasCheckConstraint(
                    "CK_Transactions_Type",
                    "[Type] IN (0, 1)"
                )
            );
        }
    }
}
