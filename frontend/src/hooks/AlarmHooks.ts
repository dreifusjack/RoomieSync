import { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserDetails } from "./UserHooks";

const BASE_URL = "http://127.0.0.1:5000";

type Alarm = {
  id: string;
  time: string;
  name: string;
  user_id: string;
};

type User = {
  id: string;
  group_id: string;
  name: string;
  email: string;
};

type UserDetails = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type GroupAlarm = {
  alarm_id: string;
  alarm_name: string;
  alarm_time: string;
  alarm_created_at: string;
  alarm_updated_at: string;
  user: UserDetails;
};

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

  return {
    user,
    userAlarms,
    groupAlarms,
    createAlarm,
  };
};
