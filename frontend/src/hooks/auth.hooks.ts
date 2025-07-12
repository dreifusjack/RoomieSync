import { registerUser, loginUser, getCurrentUser, RegisterRequestPayload, LoginRequestPayload } from "@/apis/auth.api"
import { User } from "@/types/user-types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, RegisterRequestPayload>({
    mutationFn: async (userData: RegisterRequestPayload) => {
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
  
  return useMutation<User, Error, LoginRequestPayload>({
    mutationFn: async (credentials: LoginRequestPayload) => {
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