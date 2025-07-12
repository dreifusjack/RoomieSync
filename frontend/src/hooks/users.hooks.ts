import { getAllUsers, getUserById } from "@/apis/users.api"
import { User } from "@/types/user-types"
import { useQuery } from "@tanstack/react-query"

export const useAllUsers = () => {
  return useQuery<User, Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await getAllUsers();
      return data;
    }
  });
};

export const useUserById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const {data } = await getUserById(id);
      return data
    }
  })
}