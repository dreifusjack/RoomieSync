import { Chore, ChoreAssignment } from "@/types/chore-types";
import { BASE_URL } from "@/types/url"
import axios from "axios"

export interface CreateChoreRequestPayload {
  name: string;
  description: string;
  // Add other properties needed for creation
}

export interface AssignChoreRequestPayload {
  userId: string;
  dueDate: string;
  // Add other properties needed for assignment
}

// API functions
export const createChore = (groupId: string, payload: CreateChoreRequestPayload) => {
  return axios.post<Chore>(`${BASE_URL}/api/groups/${groupId}/chores`, payload);
}

export const assignChore = (choreId: string, payload: AssignChoreRequestPayload) => {
  return axios.post<ChoreAssignment>(`${BASE_URL}/api/chores/${choreId}/assignments`, payload);
}

export const getChores = (groupId: string) => {
  return axios.get<Chore[]>(`${BASE_URL}/api/groups/${groupId}/chores`);
}

export const getAssignments = (choreId: string) => {
  return axios.get<ChoreAssignment[]>(`${BASE_URL}/api/chores/${choreId}/assignments`);
}

export const deleteChore = (choreId: string) => {
  return axios.delete<string>(`${BASE_URL}/api/chores/${choreId}`);
}

export const sendReminder = (choreId: string) => {
  return axios.post<string>(`${BASE_URL}/api/chores/${choreId}/reminders`);
}