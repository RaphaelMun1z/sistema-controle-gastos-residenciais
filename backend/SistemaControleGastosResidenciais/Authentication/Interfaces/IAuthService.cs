using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;

namespace SistemaControleGastosResidenciais.Services.Interfaces {
    public interface IAuthService {
        LoginResponseDTO Login(LoginRequestDTO loginDTO);
        RegisterResponseDTO Register(RegisterRequestDTO registerDTO);
        AuthUserResponseDTO FindAuthenticatedUser(Guid accountId);
    }
}