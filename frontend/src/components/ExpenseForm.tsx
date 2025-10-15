import React, { useState, useEffect } from "react";

interface ExpenseProps {
  addExpense: (expense: any) => void;
}

const BASE_URL = "http://127.0.0.1:3000";

const fetchUserDetails = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await fetch(`${BASE_URL}/auth/user`, {
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

const ExpenseForm: React.FC<ExpenseProps> = ({ addExpense }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userData = await fetchUserDetails();
        setUserId(userData.id);
        setGroupId(userData.group_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      amount,
      description,
      paid_by: userId,
      group_id: groupId,
      is_paid: false,
    };
    try {
      const response = await fetch(`${BASE_URL}/add_expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
      const data = await response.json();
      addExpense(data);
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
