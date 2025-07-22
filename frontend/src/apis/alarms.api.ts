import { Alarm } from "@/types/alarm-types";
import { BASE_URL } from "@/types/url";
import api from "./api.config";

export interface CreateAlarmPayload {
  name: string;
  time: string;
  consecutiveDays?: number
}

export const createAlarm = (payload: CreateAlarmPayload) => {
  return api.post<Alarm>(`${BASE_URL}/api/alarms`, payload)
}

export const getGroupAlarms = (groupId: string) => {
  return api.get<Alarm[]>(`${BASE_URL}/api/alarms/group/${groupId}`)
}

export const getUserAlarms = () => {
  return api.get<Alarm[]>(`${BASE_URL}/api/alarms`)
}

export const deleteAlarm = (alarmId: string) => {
  return api.delete(`${BASE_URL}/api/alarms/${alarmId}`)
}