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
export const useGroup = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateGroup = async (name: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload: CreateGroupPayload = {
        name,
        user_id: userId,
      };
      const data = await createGroup(payload);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create group");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupCode: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload: JoinGroupPayload = {
        group_code: groupCode,
        user_id: userId,
      };
      await joinGroup(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to join group");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = () => {
    window.location.href = '/alarms';
  }

  return { handleCreateGroup, handleJoinGroup, error, loading, onSuccess };
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
