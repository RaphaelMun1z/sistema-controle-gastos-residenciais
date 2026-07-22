using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Repositories.Interfaces {
    public interface IPersonRepository : IRepository<Person> {
        List<Person> FindAll(int page, int pageSize, string? search);
        int Count(string? search);
    }
}