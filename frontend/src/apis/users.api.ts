import { User } from "@/types/user-types"
import axios from "axios"
import { env } from "process"

const URL = process.env.BASE_URL || "fail";

export const getAllUsers = () => {
  return axios.get<User>(`${URL}/api/users`);
}

export const getUserById = (id: string) => {
  return axios.get<User>(`${URL}/api/users/${id}`);
}