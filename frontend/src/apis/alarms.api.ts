import { Alarm } from "@/types/alarm-types";
import { BASE_URL } from "@/types/url";
import axios from "axios";

export interface CreateAlarmPayload {
  name: string;
  time: string;
  consecutiveDays?: number
}

export const createAlarm = (payload: CreateAlarmPayload) => {
  return axios.post<Alarm>(`${BASE_URL}/api/alarms`, payload)
}

export const getGroupAlarms = (groupId: string) => {
  return axios.get<Alarm[]>(`${BASE_URL}/api/alarms/group/${groupId}`)
}

export const getUserAlarms = () => {
  return axios.get<Alarm[]>(`${BASE_URL}/api/alarms`)
}

export const deleteAlarm = (alarmId: string) => {
  return axios.delete(`${BASE_URL}/api/alarms/${alarmId}`)
}