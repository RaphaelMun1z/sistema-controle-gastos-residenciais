using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Repositories.Interfaces {
    public interface IAccountRepository : IRepository<Account> {
        Account? FindByEmail(string email);
        Account? FindByPersonId(Guid personId);
    }
}