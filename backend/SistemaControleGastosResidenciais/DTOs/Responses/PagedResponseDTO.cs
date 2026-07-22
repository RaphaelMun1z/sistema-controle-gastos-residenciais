namespace SistemaControleGastosResidenciais.DTOs.Responses {
    public class PagedResponseDTO<T> {
        public List<T> Content { get; set; } = new();

        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalElements { get; set; }

        public int TotalPages { get; set; }
    }
}
