import { BASE_URL } from "@/types/url";
import { User } from "@/types/user-types"
import api from "@/apis/api.config"

export const getAllGroupUsers = () => {
  return api.get<User[]>(`${BASE_URL}/users`);
}

export const getUserById = (userId: string) => {
  return api.get<User>(`${BASE_URL}/users/${userId}`);
}