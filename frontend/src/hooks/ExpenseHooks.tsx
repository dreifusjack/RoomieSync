import axios from "axios";
import { useState } from "react";
import { fetchUserDetails } from "./UserHooks";

const BASE_URL = "http://127.0.0.1:5000";

type Expense = {
  amount: string;
  description: string;
  paid_by: string;
  group_id: string;
  is_paid: boolean;
};

export const createExpense = async (newExpense: Expense) => {
  const response = await axios.post(
    `${BASE_URL}/add_expense/user/${newExpense.paid_by}`,
    newExpense
  );
  return response.data;
};

export const useCreateExpense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createExpenseWithUser = async (amount: string, description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await fetchUserDetails();
      const newExpense: Expense = {
        amount: parseFloat(amount).toFixed(2),
        description,
        paid_by: user.id,
        group_id: user.group_id,
        is_paid: false,
      };
      const data = await createExpense(newExpense);
      return data;
    } catch (err) {
      throw new Error("Failed to create expense");
    } finally {
      setIsLoading(false);
    }
  };

  return { createExpenseWithUser, isLoading, error };
};
