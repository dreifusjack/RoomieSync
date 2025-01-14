import { UserDetails } from "./user-types";

export interface Alarm {
  id: string;
  time: string;
  name: string;
  user_id: string;
};

export interface GroupAlarm {
  alarm_id: string;
  alarm_name: string;
  alarm_time: string;
  alarm_created_at: string;
  alarm_updated_at: string;
  user: UserDetails;
};

export interface GroupAlarmsResponse {
  alarms: GroupAlarm[];
};