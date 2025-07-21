import { registerUser, loginUser, getCurrentUser, RegisterPayload, LoginPayload } from "@/apis/auth.api"
import { User } from "@/types/user-types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, RegisterPayload>({
    mutationFn: async (userData: RegisterPayload) => {
      const { data } = await registerUser(userData);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'currentUser'], user);
    }
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      const { data } = await loginUser(credentials);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'currentUser'], user);
    }
  });
};

export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const { data } = await getCurrentUser();
      return data;
    },
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  });
};