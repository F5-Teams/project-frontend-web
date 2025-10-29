export interface PetImage {
  id: number;
  imageUrl: string;
  type: string | null;
}

export interface Pet {
  id: number;
  name: string;
  age: number;
  species: string;
  breed: string;
  gender: boolean;
  height: string | null;
  weight: string | null;
  note: string | null;
  userId: number;
  recordId: number | null;
  images: PetImage[];
}

export type GetPetsByUserResponse = Pet[];
