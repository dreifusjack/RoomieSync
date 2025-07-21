import { User, UserDetails } from "./user-types";

export interface Alarm {
  id: string;
  userId: string;
  name: string;
  time: string;
  consecutiveDays?: number;
  expirationDate?: string;
  user?: User;
}
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