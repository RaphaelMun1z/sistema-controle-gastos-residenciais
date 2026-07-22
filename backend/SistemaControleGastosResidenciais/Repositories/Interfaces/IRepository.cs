using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Repositories.Interfaces {
    public interface IRepository<T> where T : BaseEntity {
        List<T> FindAll(int page, int pageSize);
        T? FindById(Guid id);
        T Create(T item);
        void Delete(Guid id);
        bool Exists(Guid id);
        int Count();
    }
}
