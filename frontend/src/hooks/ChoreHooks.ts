import axios from "axios";
import { useState } from "react";
import { fetchUserDetails } from "./UserHooks";

const BASE_URL = "http://127.0.0.1:5000";

type Chore = {
  group_id: string;
  name: string;
  description: string;
  cadence: string;
}

interface AssignChorePayload {
  chore_id: string;
  due_date: string;
}

// api calls
export const getGroupChores = async (groupId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/chores/group/${groupId}`)
    return response.data;
  } catch (error) {
    console.log("Error getting groups chores:", error)
  }
}

export const remindUser = async (choreId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores/${choreId}/reminder`);
    return response.data;
  } catch (error) {
    console.error("Error sending reminder:", error);
  }
};

export const deleteChore = async (choreId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/chores/${choreId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting chore:", error);
  }
};

export const createChore = async (payload: Chore) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating chore:", error);
  }
}

export const assignChore = async (userId: string, payload: AssignChorePayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores/user/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error assigning chore:", error);
  }
}

// hooks 
export const useGetGroupChores =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAllGroupChores = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await fetchUserDetails();
      const data = await getGroupChores(user.group_id);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { getAllGroupChores, isLoading, error}
}

export const uesRemindUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remindUserWithId = async (choreId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await remindUser(choreId);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { remindUserWithId, isLoading, error}
}

export const useDeleteChore =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteChoreWithId = async (choreId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await deleteChore(choreId);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteChoreWithId, isLoading, error}
}

export const useCreateChore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createChoreWithPayload = async (name: string, description: string, cadence: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await fetchUserDetails();
      const payload: Chore = {
        group_id: user.group_id,
        name,
        description,
        cadence
      };
      const data = await createChore(payload);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { createChoreWithPayload, isLoading, error}

}

export const useAssignChore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignChoreWithPayload = async (userId: string, choreId: string, dueDate: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: AssignChorePayload = {
        chore_id: choreId,
        due_date: dueDate
      }
      const data = await assignChore(userId, payload);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { assignChoreWithPayload, isLoading, error}
}

export const getChoreAssignees = async (choreId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/chores/assignees/${choreId}`)
    return response.data;
  } catch (error) {
    console.error("Error getting chore assignees:", error)
  }
}

export const useGetChoreAssignees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getChoreAssigneesFromId = async (choreId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getChoreAssignees(choreId);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { getChoreAssigneesFromId, isLoading, error}
}
