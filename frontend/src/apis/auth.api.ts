import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import api from "@/apis/api.config"

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const registerUser = (payload: RegisterPayload) => {
  return api.post<User>(`${BASE_URL}/auth/register`, payload);
}

export const loginUser = (payload: LoginPayload) => {
  return api.post<User>(`${BASE_URL}/auth/login`, payload);
}

export const getCurrentUser = () => {
  return api.get<User>(`${BASE_URL}/auth/user`);
}