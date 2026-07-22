namespace SistemaControleGastosResidenciais.Hateoas.Models {
    // Serve para encapsular os dados de um recurso e seus links HATEOAS
    public class ResourceDTO<T> {
        public T Data { get; set; }

        public Dictionary<string, LinkDTO> Links { get; set; }

        public ResourceDTO(T data) {
            Data = data;
            Links = new Dictionary<string, LinkDTO>();
        }

        public ResourceDTO<T> AddLink(
            string relation,
            string href,
            string method
        ) {
            Links[relation] = new LinkDTO(href, method);
            return this;
        }
    }
}
