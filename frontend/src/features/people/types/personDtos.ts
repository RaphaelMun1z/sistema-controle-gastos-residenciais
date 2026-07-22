import type { CreatePersonInput, Person } from "./person";

export interface PersonResponseDTO {
	id: string;
	name: string;
	birthDate: string;
	age: number;
}

export type CreatePersonRequestDTO = CreatePersonInput;

export const mapPersonResponseToPerson = (
	person: PersonResponseDTO,
): Person => ({
	id: person.id,
	name: person.name,
	birthDate: person.birthDate,
	age: person.age,
});
