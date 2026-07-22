using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Repositories.Interfaces {
    public interface ITransactionRepository : IRepository<Transaction> {
        new List<Transaction> FindAll(int page, int pageSize);
        new Transaction? FindById(Guid id);
        List<Transaction> FindByPersonId(Guid personId, int page, int pageSize);
        int CountByPersonId(Guid personId);
    }
}
