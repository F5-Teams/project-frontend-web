import { GetPetsByUserResponse } from "./types";
import { getPetsByUser } from "./api";
import { useQuery } from "@tanstack/react-query";

export const userPetsQueryKey = (userId: string | number) =>
  ["userPets", userId] as const;

export function useUserPets(userId?: string | number) {
  return useQuery<GetPetsByUserResponse>({
    queryKey: userPetsQueryKey(userId ?? "unknown"),
    queryFn: () => getPetsByUser(userId as string | number),
    enabled: userId !== undefined && userId !== null,
  });
}
