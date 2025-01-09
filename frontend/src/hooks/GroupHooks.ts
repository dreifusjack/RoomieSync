import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://127.0.0.1:5000";

type CreateGroupPayload = {
  name: string;
  user_id: string;
};

type JoinGroupPayload = {
  group_code: string;
  user_id: string;
};

// api calls
const createGroup = async (payload: CreateGroupPayload) => {
  const response = await axios.post(`${BASE_URL}/group`, payload);
  return response.data;
};

const joinGroup = async (payload: JoinGroupPayload) => {
  const response = await axios.post(`${BASE_URL}/group/join`, payload);
  return response.data;
};

const getGroup = async (group_id: string) => {
  const response = await axios.get(`${BASE_URL}/group/${group_id}`);
  return response.data;
};

// hooks
export const useCreateGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const userCreateGroup = async (name: string, userId: string) => {
    setIsLoading(true);
    try {
      const payload: CreateGroupPayload = {
        name,
        user_id: userId,
      };
      const data = await createGroup(payload);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { userCreateGroup, error, isLoading };
};

export const useJoinGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const userJoinGroup = async (groupCode: string, userId: string) => {
    setIsLoading(true);
    try {
      const payload: JoinGroupPayload = {
        group_code: groupCode,
        user_id: userId,
      };
      const data = await joinGroup(payload);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { userJoinGroup, error, isLoading };
};

export const useGetGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getGroupById = async (groupId: string) => {
    setIsLoading(true);
    try {
      const data = await getGroup(groupId);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getGroupById, error, isLoading };
};
