import { Chore, ChoreAssignment } from "@/types/chore-types";
import { BASE_URL } from "@/types/url"
import api from "@/apis/api.config"

export interface CreateChorePayload {
  name: string;
  description: string;
  cadence: string 
}

export interface AssignChorePayload {
  userId: string;
  dueDate: string;
}

export const createChore = (payload: CreateChorePayload) => {
  return api.post<Chore>(`${BASE_URL}/chores`, payload);
}

export const assignChore = (choreId: string, payload: AssignChorePayload) => {
  return api.post<ChoreAssignment>(`${BASE_URL}/chores/${choreId}/assignments`, payload);
}

export const getChores = () => {
  return api.get<Chore[]>(`${BASE_URL}/chores`);
}

export const getAssignments = (choreId: string) => {
  return api.get<ChoreAssignment[]>(`${BASE_URL}/chores/${choreId}/assignments`);
}

export const deleteChore = (choreId: string) => {
  return api.delete<string>(`${BASE_URL}/chores/${choreId}`);
}

export const sendReminder = (choreId: string) => {
  return api.post<string>(`${BASE_URL}/chores/${choreId}/reminders`);
}