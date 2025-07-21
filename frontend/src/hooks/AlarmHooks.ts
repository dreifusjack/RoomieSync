import { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserDetails } from "./UserHooks";
import { User } from "@/types/user-types";
import { Alarm, GroupAlarm, GroupAlarmsResponse } from "@/types/alarm-types";

const BASE_URL = "http://127.0.0.1:5000";

const extractErrorMessage = (error: unknown): string =>
  axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : "An unexpected error occurred";

export const useAlarms = () => {
  const [error, setError] = useState<string | null>(null);

  const normalizeGroupAlarm = (groupAlarm: GroupAlarm): Alarm => {
    return {
      id: groupAlarm.alarm_id,
      name: groupAlarm.alarm_name,
      time: groupAlarm.alarm_time,
      userId: groupAlarm.user.user_id,
    };
  };

  const fetchAlarms = async () => {
    try {
      const user = await fetchUserDetails();
      const [userAlarmsResponse, groupAlarmsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/alarm/user/${user.id}`),
        axios.get(`${BASE_URL}/alarm/groups/${user.group_id}`),
      ]);

      const userAlarms = userAlarmsResponse.data;
      const groupAlarmsData = groupAlarmsResponse.data as GroupAlarmsResponse;
      const groupAlarms = Array.isArray(groupAlarmsData.alarms)
        ? groupAlarmsData.alarms.map(normalizeGroupAlarm)
        : [];

      return { userAlarms, groupAlarms };
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      throw message;
    }
  };

  const createAlarm = async (alarmName: string, alarmTime: string) => {
    try {
      const newAlarm = {
        time: alarmTime,
        name: alarmName,
      };
      const user = await fetchUserDetails();

      const response = await axios.post(
        `${BASE_URL}/alarm/user/${user.id}`,
        newAlarm
      );
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      throw message;
    }
  };

  const deleteAlarm = async (alarm_id: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/alarm/${alarm_id}/delete`
      );
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      throw message;
    }
  };

  return {
    fetchAlarms,
    createAlarm,
    deleteAlarm,
    error,
  };
};
