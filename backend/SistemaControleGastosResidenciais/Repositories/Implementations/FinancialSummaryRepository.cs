using SistemaControleGastosResidenciais.Data;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Enums;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Repositories.Projections;

namespace SistemaControleGastosResidenciais.Repositories.Implementations {
    public class FinancialSummaryRepository : IFinancialSummaryRepository {
        private readonly AppDbContext _context;

        public FinancialSummaryRepository(AppDbContext context) {
            _context = context;
        }

        // Retorna o resumo financeiro por pessoa de forma paginada
        public List<PersonFinancialSummaryProjection> FindFinancialSummaryByPerson(
            int page,
            int pageSize,
            DateOnly? startDate,
            DateOnly? endDate
        ) {
            return _context.People
                .OrderBy(person => person.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(person =>
                    new PersonFinancialSummaryProjection(
                        person.Id,
                        person.Name,

                        person.Transactions
                            .Where(transaction => transaction.Type == TransactionTypeEnum.Revenue &&
                                (!startDate.HasValue || transaction.TransactionDate >= startDate.Value) &&
                                (!endDate.HasValue || transaction.TransactionDate <= endDate.Value)
                            ).Sum(transaction => (decimal?)transaction.Amount) ?? 0,

                        person.Transactions
                            .Where(transaction =>
                                transaction.Type == TransactionTypeEnum.Expense &&
                                (!startDate.HasValue || transaction.TransactionDate >= startDate.Value) &&
                                (!endDate.HasValue || transaction.TransactionDate <= endDate.Value)
                            ).Sum(transaction => (decimal?)transaction.Amount) ?? 0
                    )
                )
                .ToList();
        }

        // Retorna a quantidade total de pessoas
        public int CountPeople() {
            return _context.People.Count();
        }

        // Calcula o total geral de receitas no período informado
        public decimal CalculateTotalRevenue(
            DateOnly? startDate,
            DateOnly? endDate
        ) {
            IQueryable<Transaction> query =
                _context.Transactions
                    .Where(transaction =>
                        transaction.Type == TransactionTypeEnum.Revenue
                    );

            if (startDate.HasValue) {
                query = query.Where(transaction =>
                    transaction.TransactionDate >= startDate.Value
                );
            }

            if (endDate.HasValue) {
                query = query.Where(transaction =>
                    transaction.TransactionDate <= endDate.Value
                );
            }

            return query
                .Sum(transaction => (decimal?)transaction.Amount)
                ?? 0;
        }

        // Calcula o total geral de despesas no período informado
        public decimal CalculateTotalExpense(
            DateOnly? startDate,
            DateOnly? endDate
        ) {
            IQueryable<Transaction> query =
                _context.Transactions
                    .Where(transaction =>
                        transaction.Type == TransactionTypeEnum.Expense
                    );

            if (startDate.HasValue) {
                query = query.Where(transaction =>
                    transaction.TransactionDate >= startDate.Value
                );
            }

            if (endDate.HasValue) {
                query = query.Where(transaction =>
                    transaction.TransactionDate <= endDate.Value
                );
            }

            return query
                .Sum(transaction => (decimal?)transaction.Amount)
                ?? 0;
        }
    }
}