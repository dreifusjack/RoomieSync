import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import axios from "axios"

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface RegisterRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const registerUser = (payload: RegisterRequestPayload) => {
  return axios.post<User>(`${BASE_URL}/api/auth/register`, payload);
}

export const loginUser = (payload: LoginRequestPayload) => {
  return axios.post<User>(`${BASE_URL}/api/auth/login`, payload);
}

export const getCurrentUser = () => {
  return axios.get<User>(`${BASE_URL}/api/auth/user`);
}