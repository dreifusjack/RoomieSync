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
  groupId: string;
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

export const assignChore = async (userId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores/user/${userId}`)
    return response.data;
  } catch (error) {
    console.error("Error assigning chore:", error);
  }
}

export const createChore = async (payload: Chore) => {
  try {
    const response = await axios.post(`${BASE_URL}/chores}`,
    payload)
    return response.data;
  } catch (error) {
    console.error("Error creating chore:", error);
  }
}

// hooks 
export const useGetGroupChores =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAllGroupChores = async (groupId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getGroupChores(groupId);
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
  const [error, setError] = useState(null);

  const remindUserWithId = async (choreId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await remindUser(choreId);
      return data;
    } catch (err) {
      throw new Error("Failed to delete expense");
    } finally {
      setIsLoading(false)
    }
  }

  return { remindUserWithId, isLoading, error}
}

export const useDeleteChore =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteChoreWithId = async (choreId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await deleteChore(choreId);
      return data;
    } catch (err) {
      throw new Error("Failed to delete expense");
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteChoreWithId, isLoading, error}
}

