import { getAllGroupUsers, getUserById } from "@/apis/users.api"
import { User } from "@/types/user-types"
import { useQuery } from "@tanstack/react-query"

export const useAllGroupUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await getAllGroupUsers();
      return data;
    }
  });
};

export const useUserById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ['users', id],
    queryFn: async () => {
      const {data } = await getUserById(id);
      return data
    }
  })
}