import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import axios from "axios"

export const getAllUsers = () => {
  return axios.get<User>(`${BASE_URL}/api/users`);
}

export const getUserById = (id: string) => {
  return axios.get<User>(`${BASE_URL}/api/users/${id}`);
}