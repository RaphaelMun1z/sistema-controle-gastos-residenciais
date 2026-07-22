using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaControleGastosResidenciais.Entities {
    public abstract class BaseEntity {
        [Key]
        [Column("Id", TypeName = "uniqueidentifier")]
        public Guid Id { get; private set; }
        // Obs.: Utilizei 'private' em alguns atributos para garantir que eles só possam ser modificados dentro da própria classe, mantendo a integridade dos dados.

        protected BaseEntity() {
        }

        protected BaseEntity(Guid id) {
            Id = id;
        }
    }
}
