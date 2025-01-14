import { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserDetails } from "./UserHooks";
import { User } from "@/types/user-types";
import { Alarm, GroupAlarm } from "@/types/alarm-types";

const BASE_URL = "http://127.0.0.1:5000";

type GroupAlarmsResponse = {
  alarms: GroupAlarm[];
};

export const useAlarms = () => {
  const [userAlarms, setUserAlarms] = useState<Alarm[]>([]);
  const [groupAlarms, setGroupAlarms] = useState<Alarm[]>([]);
  const [user, setUser] = useState<User>({} as User);

  const normalizeGroupAlarm = (groupAlarm: GroupAlarm): Alarm => {
    return {
      id: groupAlarm.alarm_id,
      name: groupAlarm.alarm_name,
      time: groupAlarm.alarm_time,
      user_id: groupAlarm.user.user_id,
    };
  };

  const fetchAlarms = async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData);

      const [userAlarmsResponse, groupAlarmsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/alarm/user/${userData.id}`),
        axios.get(`${BASE_URL}/alarm/groups/${userData.group_id}`),
      ]);

      setUserAlarms(userAlarmsResponse.data);

      const groupAlarmsData = groupAlarmsResponse.data as GroupAlarmsResponse;
      if (groupAlarmsData && Array.isArray(groupAlarmsData.alarms)) {
        const normalizedGroupAlarms =
          groupAlarmsData.alarms.map(normalizeGroupAlarm);
        setGroupAlarms(normalizedGroupAlarms);
      } else {
        setGroupAlarms([]);
      }
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const createAlarm = async (alarmName: string, alarmTime: string) => {
    try {
      const newAlarm = {
        time: alarmTime,
        name: alarmName,
      };

      const response = await axios.post(
        `${BASE_URL}/alarm/user/${user.id}`,
        newAlarm
      );

      if (response.data[0]) {
        setUserAlarms((currentUserAlarms) =>
          Array.isArray(currentUserAlarms)
            ? [...currentUserAlarms, response.data[0]]
            : [response.data[0]]
        );
        setGroupAlarms((currentGroupAlarms) =>
          Array.isArray(currentGroupAlarms)
            ? [...currentGroupAlarms, response.data[0]]
            : [response.data[0]]
        );
      }

      return response.data;
    } catch (error) {
      throw new Error("Failed to create alarm");
    }
  };

  const deleteAlarm = async (alarm_id: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/alarm/${alarm_id}/delete`
      );
      fetchAlarms();
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete alarm")
    }
  }

  return {
    user,
    userAlarms,
    groupAlarms,
    createAlarm,
    deleteAlarm
  };
};
