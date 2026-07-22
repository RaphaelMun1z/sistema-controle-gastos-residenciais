using Microsoft.EntityFrameworkCore;
using SistemaControleGastosResidenciais.Data;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Repositories.Interfaces;

namespace SistemaControleGastosResidenciais.Repositories.Implementations {
    public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository {
        private readonly AppDbContext _context;

        // Recebe o contexto do banco de dados por injeção de dependência
        // Também repassa o contexto para o repositório genérico
        public TransactionRepository(AppDbContext context) : base(context) {
            _context = context;
        }

        public new List<Transaction> FindAll(int page, int pageSize) {
            return _context.Transactions
                .Include(transaction => transaction.Person)
                .OrderBy(transaction => transaction.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        public new Transaction? FindById(Guid id) {
            return _context.Transactions
                .Include(transaction => transaction.Person)
                .FirstOrDefault(transaction => transaction.Id == id);
        }

        // Busca as transações associadas a uma pessoa utilizando paginação
        public List<Transaction> FindByPersonId(
            Guid personId,
            int page,
            int pageSize
        ) {
            return _context.Transactions
                .Include(transaction => transaction.Person)
                .Where(transaction => transaction.PersonId == personId)
                .OrderByDescending(transaction => transaction.TransactionDate)
                .ThenBy(transaction => transaction.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Retorna a quantidade total de transações associadas a uma pessoa
        public int CountByPersonId(Guid personId) {
            return _context.Transactions
                .Count(transaction => transaction.PersonId == personId);
        }
    }
}
