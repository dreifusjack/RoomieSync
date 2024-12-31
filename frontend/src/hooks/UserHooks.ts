import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:5000";

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
