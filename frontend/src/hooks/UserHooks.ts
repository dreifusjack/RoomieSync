import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:5000";

const extractErrorMessage = (error: unknown): string => 
  axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : "An unexpected error occurred";

export const fetchUserDetails = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token available");
  }
  try {
    const response = await axios.get(`${BASE_URL}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error("Failed to fetch user details");
    }
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error("Failed to fetch user by ID");
    }
  }
};

export const useUserById = (userId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUserName = async () => {
      try {
        const user = await fetchUserById(userId);
        setUserName(user.first_name + " " + user.last_name);
      } catch (err) {
        setError("Failed to fetch user name");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserName();
    }
  }, [userId]);

  return { userName, loading, error };
};

export const getAllUsersInGroup = async (groupId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/users`);
    return response.data.users;
  } catch (error) {
    throw error;
  }
}

export const useAllGroupUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllGroupUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await fetchUserDetails();
      const data = await getAllUsersInGroup(user.group_id);
      return data;
    } catch (err) {
      const message = extractErrorMessage(error);
      setError(message);
      throw message;
    } finally {
      setIsLoading(false);
    }
  }

  return { getAllGroupUsers, isLoading, error };
}