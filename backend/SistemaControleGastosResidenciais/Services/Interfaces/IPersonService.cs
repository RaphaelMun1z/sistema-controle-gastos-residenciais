using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;

namespace SistemaControleGastosResidenciais.Services.Interfaces {
    public interface IPersonService {
        PersonResponseDTO FindById(Guid id);
        PagedResponseDTO<PersonResponseDTO> FindAll(int page, int pageSize, string? search);
        PersonResponseDTO Create(CreatePersonRequestDTO personDTO);
        void Delete(Guid id);
    }
}