using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;

namespace SistemaControleGastosResidenciais.Services.Interfaces {
    public interface IAccountService {
        AccountResponseDTO FindById(Guid id);
        AccountResponseDTO Create(CreateAccountRequestDTO accountDTO);
        void Delete(Guid id);
    }
}