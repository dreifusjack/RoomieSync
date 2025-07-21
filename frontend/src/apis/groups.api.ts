import { Group } from "@/types/group-types"
import { BASE_URL } from "@/types/url"
import { User } from "@/types/user-types"
import axios from "axios"

export const createGroup = (groupName: string) => {
  return axios.post<Group>(`${BASE_URL}/api/groups`, { name: groupName })
}

export const joinGroup = (groupCode: string) => {
  return axios.post<Group>(`${BASE_URL}/api/groups/join`, { groupCode })
}

export const getAllGroups = () => {
  return axios.get<Group[]>(`${BASE_URL}/api/groups`)
}

export const getGroupUsers = (groupdId: string) => {
  return axios.get<User[]>(`${BASE_URL}/api/groups/${groupdId}/user`)
}

export const getGroupById = (groupdId: string) => {
  return axios.get<Group>(`${BASE_URL}/api/groups/${groupdId}`)
}