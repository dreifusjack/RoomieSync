import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import axios from "axios"

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
  return axios.post<User>(`${BASE_URL}/api/auth/register`, payload);
}

export const loginUser = (payload: LoginPayload) => {
  return axios.post<User>(`${BASE_URL}/api/auth/login`, payload);
}

export const getCurrentUser = () => {
  return axios.get<User>(`${BASE_URL}/api/auth/user`);
}