import axios from "axios";
import { useState } from "react";
import { fetchUserDetails } from "./UserHooks";

const BASE_URL = "http://127.0.0.1:5000";

/**
 * create chore 
 * get all chores 
 * reminder user 
 * delete a chore 
 * assign a chore 
 */
type Chore = {
  group_id: string;
  name: string;
  description: string;
  cadence: string;
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

export const assignChore = async (userId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores/user/${userId}`)
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

  const assignChoreWithId = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await assignChore(userId);
      return data;
    } catch (err) {
      setError(err as Error)
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  return { assignChoreWithId, isLoading, error}
}
