using SistemaControleGastosResidenciais.Data;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Repositories.Interfaces;

namespace SistemaControleGastosResidenciais.Repositories.Implementations {
    public class AccountRepository : GenericRepository<Account>, IAccountRepository {
        private readonly AppDbContext _context;

        // Recebe o contexto do banco de dados por injeção de dependência
        // Também repassa o contexto para o repositório genérico
        public AccountRepository(AppDbContext context) : base(context) {
            _context = context;
        }

        // Busca uma conta pelo e-mail
        public Account? FindByEmail(string email) {
            return _context.Accounts
                .FirstOrDefault(account => account.Email == email);
        }

        // Busca a conta pelo ID da pessoa associada a conta
        public Account? FindByPersonId(Guid personId) {
            return _context.Accounts
                .FirstOrDefault(account => account.PersonId == personId);
        }
    }
}
