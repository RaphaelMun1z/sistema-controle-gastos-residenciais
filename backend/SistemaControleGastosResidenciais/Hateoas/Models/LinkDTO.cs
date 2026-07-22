namespace SistemaControleGastosResidenciais.Hateoas.Models {
    // Serve para representar um link HATEOAS com seu href e método HTTP
    public record LinkDTO(
        string Href,
        string Method
    );
}