namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public record LoginResponseDTO(
       string AccessToken,
       DateTime ExpiresAt
   );
}