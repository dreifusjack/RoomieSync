import axios from "axios";
import { useState } from "react";
import { fetchUserDetails } from "./UserHooks";

const BASE_URL = "http://127.0.0.1:5000";

const loginUser = async (email: string, password: string) => {
  const response = await axios.post(
    `${BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

const signupUser = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  const response = await axios.post(
    `${BASE_URL}/auth/signup`,
    { email, password, first_name, last_name },
    { withCredentials: true }
  );
  return response.data;
};

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      onLoginSuccess(data.access_token, data.refresh_token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signupUser(email, password, firstName, lastName);
      onLoginSuccess(data.access_token, data.refresh_token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onLoginSuccess = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

     // Delay for tokens to be set
     await new Promise(resolve => setTimeout(resolve, 100));

     await checkUserGroupAndRedirect();
  };

  const checkUserGroupAndRedirect = async () => {
    try {
      const userData = await fetchUserDetails();
      if (userData.group_id) {
        window.location.href = "/alarms";
      } else {
        window.location.href = "/landing";
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      window.location.href = "/landing";
    }
  };

  return { handleLogin, handleSignUp, error, loading, isSignup, setIsSignup };
};
