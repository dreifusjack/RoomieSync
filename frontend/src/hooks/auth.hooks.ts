import { registerUser, loginUser, getCurrentUser, RegisterPayload, LoginPayload } from "@/apis/auth.api"
import { User } from "@/types/user-types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";

export interface AuthResponse {
  user?: User;
  accessToken?: string;
  access_token?: string;
  token?: string;
  authToken?: string;
  refreshToken?: string;
  refresh_token?: string;
  refreshAuthToken?: string;
  [key: string]: any; 
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User | null, Error, RegisterPayload>({
    mutationFn: async (userData: RegisterPayload) => {
      const response = await registerUser(userData);
      const user = handleAuthSuccess(response.data);
      return user;
    },
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(['auth', 'currentUser'], user);
        handlePostAuthNavigation(user);
      }
    }
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User | null, Error, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await loginUser(credentials);
      const user = handleAuthSuccess(response.data);
      return user;
    },
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(['auth', 'currentUser'], user);
        handlePostAuthNavigation(user);
      }
    }
  });
};


export const useCurrentUser = () => {
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    setHasToken(hasValidToken());
  }, []);

  return useQuery<User, Error>({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const { data } = await getCurrentUser();
      return data;
    },
    retry: false, 
    staleTime: 5 * 60 * 1000,
    enabled: hasToken,
  });
};

const handlePostAuthNavigation = (user: User) => {
  setTimeout(() => {
    if (user.groupId) {
      window.location.href = "/alarms"
    } else {
      window.location.href = "/landing"
    }
  }, 100)
}

const handleAuthSuccess = (data: AuthResponse): User | null => {
 const tokenFields = ['accessToken', 'access_token', 'token', 'authToken'];
  const refreshFields = ['refreshToken', 'refresh_token', 'refreshAuthToken'];
  
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  
  for (const field of tokenFields) {
    if (data[field]) {
      accessToken = data[field];
      break;
    }
  }
  
  for (const field of refreshFields) {
    if (data[field]) {
      refreshToken = data[field];
      break;
    }
  }
  
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    console.error('No access token found in response!');
    return null;
  }
  
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    console.warn('No refresh token found in response');
  }
  
  setTimeout(() => {
    localStorage.getItem('accessToken');
    localStorage.getItem('refreshToken');
  }, 100);
  
  const userData = data.user;
  if (userData && typeof userData === 'object' && 'id' in userData) {
    return userData as User;
    console.log("exit 1")
  }

  if ('id' in data && 'email' in data) {
    const { user: _, accessToken: _a, access_token: _at, refreshToken: _r, refresh_token: _rt, ...userProps } = data;
    return userProps as User;
    console.log("exit 2")
  }
  
  console.log("exit 3")
  return null;
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const hasValidToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};
