import { Group } from "@/types/group-types"
import { BASE_URL } from "@/types/url"
import { User } from "@/types/user-types"
import api from "@/apis/api.config"

export const createGroup = (groupName: string) => {
  return api.post<Group>(`${BASE_URL}/groups`, { name: groupName })
}

export const joinGroup = (groupCode: string) => {
  return api.post<Group>(`${BASE_URL}/groups/join`, { groupCode })
}

export const getAllGroups = () => {
  return api.get<Group[]>(`${BASE_URL}/groups`)
}

export const getGroupUsers = (groupdId: string) => {
  return api.get<User[]>(`${BASE_URL}/groups/${groupdId}/user`)
}

export const getGroupById = (groupdId: string) => {
  return api.get<Group>(`${BASE_URL}/groups/${groupdId}`)
}