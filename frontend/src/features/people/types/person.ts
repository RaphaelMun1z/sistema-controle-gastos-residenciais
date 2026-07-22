export interface Person {
	id: string;
	name: string;
	birthDate: string;
	age: number;
}

export interface CreatePersonInput {
	name: string;
	birthDate: string;
}
