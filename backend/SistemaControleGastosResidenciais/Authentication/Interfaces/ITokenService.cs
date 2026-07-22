using SistemaControleGastosResidenciais.Authentication.Models;
using SistemaControleGastosResidenciais.Entities;

namespace SistemaControleGastosResidenciais.Authentication.Interfaces {
    public interface ITokenService {
        GeneratedToken GenerateAccessToken(Account account);
    }
}