namespace SistemaControleGastosResidenciais.Mappings.Interfaces {
    public interface IMapper<O, D> {
        D ToResponse(O origin);

        List<D> ToResponseList(IEnumerable<O> originList);
    }
}