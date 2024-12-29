import axios from "axios";

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
