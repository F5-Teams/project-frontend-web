export interface PetImage {
  imageUrl: string;
  type: string; 
}

export interface Pet {
  id?: string; 
  name: string;
  age: number;
  species: "Dog" | "Cat" | "Other";
  breed: string;
  gender: string;
  height: number;
  weight: number;
  note?: string;
  images: PetImage[];
}
