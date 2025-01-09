import axios from "axios";
import { useEffect, useState } from "react";
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

export const fetchGroupExpenses = async (groupId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/calculate_expenses/${groupId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch group expenses");
  }
};

export const markExpenseAsPaid = async (
  payerId: string,
  recipientId: string,
  amount: number
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/expense_payment`, {
      amount_paid: amount,
      recipient: recipientId,
      payer: payerId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to mark expense as paid");
  }
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

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserDetails();
        setUserId(userData.id);
        setGroupId(userData.group_id);

        const expenseData = await fetchGroupExpenses(userData.group_id);
        setExpenses(expenseData.net_owes);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch expense data");
      }
    };

    fetchData();
  }, []);

  const handlePaid = async (
    payerId: string,
    recipientId: string,
    amount: number
  ) => {
    try {
      await markExpenseAsPaid(payerId, recipientId, amount);
      setExpenses((prevExpenses) => ({
        ...prevExpenses,
        [`${payerId},${recipientId}`]: 0,
      }));
    } catch (error) {
      console.error("Error marking as paid:", error);
      setError("Failed to mark expense as paid");
    }
  };

  const filteredExpenses = Object.entries(expenses).filter(([key]) =>
    key.includes(userId)
  );

  return {
    expenses: filteredExpenses,
    userId,
    groupId,
    handlePaid,
  };
};
