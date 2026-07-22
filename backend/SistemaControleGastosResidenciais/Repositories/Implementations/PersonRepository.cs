using SistemaControleGastosResidenciais.Data;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Repositories.Interfaces;

namespace SistemaControleGastosResidenciais.Repositories.Implementations {
    public class PersonRepository : GenericRepository<Person>, IPersonRepository {
        private readonly AppDbContext _context;

        // Recebe o contexto do banco de dados por injeção de dependência
        // Também repassa o contexto para o repositório genérico
        public PersonRepository(AppDbContext context) : base(context) {
            _context = context;
        }

        // Busca pessoas utilizando paginação e filtro opcional por nome
        public List<Person> FindAll(int page, int pageSize, string? search) {
            IQueryable<Person> query = _context.People;

            if (!string.IsNullOrWhiteSpace(search)) {
                string normalizedSearch = search.Trim();

                query = query.Where(person => person.Name.Contains(normalizedSearch));
            }

            return query
                .OrderBy(person => person.Name)
                .ThenBy(person => person.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Retorna a quantidade total de pessoas considerando o filtro informado
        public int Count(string? search) {
            IQueryable<Person> query = _context.People;

            if (!string.IsNullOrWhiteSpace(search)) {
                string normalizedSearch = search.Trim();

                query = query.Where(person => person.Name.Contains(normalizedSearch));
            }

            return query.Count();
        }
    }
}