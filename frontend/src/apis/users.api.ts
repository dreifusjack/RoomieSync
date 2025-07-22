import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import api from "./api.config";

export const getAllUsers = () => {
  return api.get<User[]>(`${BASE_URL}/api/users`);
}

export const getUserById = (userId: string) => {
  return api.get<User>(`${BASE_URL}/api/users/${userId}`);
}