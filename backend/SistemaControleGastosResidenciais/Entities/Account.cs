using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaControleGastosResidenciais.Entities {
    [Table("tb_accounts", Schema = "dbo")]
    public class Account : BaseEntity {
        private string _email = string.Empty;
        private string _password = string.Empty;

        [Column("PersonId", TypeName = "uniqueidentifier")]
        [Required]
        public Guid PersonId { get; private set; }

        [Column("Email", TypeName = "nvarchar(150)")]
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [MaxLength(150, ErrorMessage = "O e-mail não pode ter mais de 150 caracteres.")]
        [EmailAddress(ErrorMessage = "Informe um e-mail válido.")]
        public string Email {
            get => _email;

            // Valida o e-mail antes de atribuí-lo à propriedade
            private set {
                _email = ValidateEmail(value);
            }
        }

        [Column("Password", TypeName = "nvarchar(255)")]
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MaxLength(255, ErrorMessage = "A senha não pode ter mais de 255 caracteres.")]
        public string Password {
            get => _password;

            // Valida a senha antes de atribuí-la à propriedade
            private set {
                _password = ValidatePassword(value);
            }
        }

        public Person Person { get; private set; } = null!;

        protected Account() {
        }

        public Account(
            Guid personId,
            string email,
            string password
        ) : base(Guid.NewGuid()) {
            if (personId == Guid.Empty) {
                throw new ArgumentException("Informe um identificador de pessoa válido", nameof(personId));
            }

            PersonId = personId;
            Email = email;
            Password = password;
        }

        public void SetPassword(string password) {
            Password = password;
        }

        private static string ValidateEmail(string email) {
            // Verifica se o e-mail é nulo, vazio ou contém apenas espaços em branco
            if (string.IsNullOrWhiteSpace(email)) {
                throw new ArgumentException("Informe um e-mail válido", nameof(email));
            }

            // Remove espaços em branco no início e no final e normaliza o e-mail
            string normalizedEmail = email.Trim().ToLowerInvariant();

            // Verifica se o e-mail excede 150 caracteres
            if (normalizedEmail.Length > 150) {
                throw new ArgumentException("O e-mail não pode ter mais de 150 caracteres", nameof(email));
            }

            // Verifica se o e-mail possui um formato válido
            if (!new EmailAddressAttribute().IsValid(normalizedEmail)) {
                throw new ArgumentException("Informe um e-mail válido", nameof(email));
            }

            return normalizedEmail;
        }

        private static string ValidatePassword(string password) {
            // Verifica se a senha é nula, vazia ou contém apenas espaços em branco
            if (string.IsNullOrWhiteSpace(password)) {
                throw new ArgumentException("Informe uma senha válida", nameof(password));
            }

            // Verifica se a senha excede 255 caracteres
            if (password.Length > 255) {
                throw new ArgumentException("A senha não pode ter mais de 255 caracteres", nameof(password));
            }

            return password;
        }
    }
}
