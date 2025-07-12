import { User } from "./user-types";

export interface Group {
  id: string,
  name: string,
  groupCode: string,
  users: User[]
}

export interface GroupResponse {
  group: {
    group_code: string;
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user: User;
};