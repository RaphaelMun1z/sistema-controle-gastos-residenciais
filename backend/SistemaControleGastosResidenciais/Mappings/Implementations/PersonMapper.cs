using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Mappings.Interfaces;

namespace SistemaControleGastosResidenciais.Mappings.Implementations {
    public class PersonMapper : IMapper<Person, PersonResponseDTO>, IMapper<CreatePersonRequestDTO, Person> {
        // Converte uma entidade Person para um DTO de resposta
        public PersonResponseDTO ToResponse(Person person) {
            return new PersonResponseDTO(
                person.Id,
                person.Name,
                person.BirthDate,
                person.Age
            );
        }

        // Converte um DTO de criação para uma entidade Person
        public Person ToResponse(CreatePersonRequestDTO personDTO) {
            return new Person(
                personDTO.Name,
                personDTO.BirthDate
            );
        }

        // Converte uma lista de entidades Person para uma lista de DTOs de resposta
        public List<PersonResponseDTO> ToResponseList(IEnumerable<Person> people) {
            return people
                .Select(ToResponse)
                .ToList();
        }

        // Converte uma lista de DTOs de criação para uma lista de entidades Person
        public List<Person> ToResponseList(IEnumerable<CreatePersonRequestDTO> peopleDTO) {
            return peopleDTO
                .Select(ToResponse)
                .ToList();
        }
    }
}