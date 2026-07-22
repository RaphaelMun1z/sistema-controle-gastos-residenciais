using Microsoft.EntityFrameworkCore;
using SistemaControleGastosResidenciais.Data;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Repositories.Interfaces;

namespace SistemaControleGastosResidenciais.Repositories.Implementations {
    public class GenericRepository<T> : IRepository<T> where T : BaseEntity {
        private readonly AppDbContext _context; // Contexto do banco de dados
        private readonly DbSet<T> _dataSet; // Conjunto de dados do tipo T

        // Recebe o contexto do banco de dados por injeção de dependência
        public GenericRepository(AppDbContext context) {
            _context = context;
            _dataSet = _context.Set<T>(); // Obtém o conjunto de dados do tipo T a partir do contexto
        }

        // Busca todos os registros utilizando paginação
        public List<T> FindAll(int page, int pageSize) {
            return _dataSet
                .OrderBy(item => item.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Busca um registro pelo ID
        public T? FindById(Guid id) {
            return _dataSet.Find(id);
        }

        // Registra um novo item e persiste os dados no banco
        public T Create(T item) {
            _dataSet.Add(item);
            _context.SaveChanges();
            return item;
        }

        // Remove um registro pelo ID
        public void Delete(Guid id) {
            var item = _dataSet.Find(id);
            if (item != null) {
                _dataSet.Remove(item);
                _context.SaveChanges();
            }
        }

        // Verifica se existe um registro com o ID informado
        public bool Exists(Guid id) {
            return _dataSet.Any(e => e.Id == id);
        }

        // Retorna a quantidade total de registros
        public int Count() {
            return _dataSet.Count();
        }
    }
}