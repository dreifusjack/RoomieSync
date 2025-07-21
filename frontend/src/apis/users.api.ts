import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import axios from "axios"

export const getAllUsers = () => {
  return axios.get<User[]>(`${BASE_URL}/api/users`);
}

export const getUserById = (userId: string) => {
  return axios.get<User>(`${BASE_URL}/api/users/${userId}`);
}