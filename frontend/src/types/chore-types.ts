export interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoreAssignee {
  user_id: string;
  due_date: string;
}

export interface ChoreAPI {
  group_id: string;
  name: string;
  description: string;
  cadence: string;
};
