import { useState, useEffect } from "react";

interface ExpenseData {
  net_owes: { [key: string]: number };
}

export const useCreateExpense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpenseWithUser = async (amount: string, description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:3000/add_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          // These will be set by the backend based on the authenticated user
          paid_by: "",
          group_id: "",
          is_paid: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create expense");
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createExpenseWithUser,
    isLoading,
    error,
  };
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<[string, number][]>([]);
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch("http://127.0.0.1:3000/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return await response.json();
  };

  const fetchExpenses = async (groupId: string) => {
    const response = await fetch(`http://127.0.0.1:3000/calculate_expenses/${groupId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return await response.json();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUserDetails();
        setUserId(userData.id);
        
        const expenseData: ExpenseData = await fetchExpenses(userData.group_id);
        const expenseEntries = Object.entries(expenseData.net_owes) as [string, number][];
        setExpenses(expenseEntries);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      }
    };

    loadData();
  }, []);

  const handlePaid = async (payerId: string, recipientId: string, amount: number) => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/expense_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount_paid: amount,
          recipient: recipientId,
          payer: payerId,
        }),
      });

      if (response.ok) {
        // Refresh expenses after payment
        const userData = await fetchUserDetails();
        const expenseData: ExpenseData = await fetchExpenses(userData.group_id);
        const expenseEntries = Object.entries(expenseData.net_owes) as [string, number][];
        setExpenses(expenseEntries);
      } else {
        throw new Error("Failed to mark as paid");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    }
  };

  return {
    expenses,
    userId,
    handlePaid,
    error,
  };
};
