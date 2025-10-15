import React, { useState, useEffect } from "react";

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

const fetchUserGroup = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/group/user/${userId}`);
  return await response.json();
};

const ExpenseTable: React.FC = () => {
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userData = await fetchUserDetails();
        setUserId(userData.id);
        setGroupId(userData.group_id);

        // Fetch expenses for the group
        const response = await fetch(
          `${BASE_URL}/calculate_expenses/${userData.group_id}`
        );
        const data = await response.json();
        setExpenses(data.net_owes);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      const response = await fetch(`${BASE_URL}/api/expense_payment`, {
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
        setExpenses((prevExpenses) => ({
          ...prevExpenses,
          [`${payerId},${recipientId}`]: 0,
        }));
      } else {
        console.error("Error marking as paid:", await response.text());
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  const filteredExpenses = Object.entries(expenses).filter(([key, value]) =>
    key.includes(userId)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
      <div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Amounts You Owe
        </h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(",");
          if (ower === userId && amount > 0) {
            return (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    You owe {recipient}: ${amount}
                  </span>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                    onClick={() => handlePaid(ower, recipient, amount)}
                  >
                    Paid {recipient}
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Amounts Owed to You
        </h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(",");
          if (recipient === userId && amount > 0) {
            return (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {ower} owes you: ${amount}
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ExpenseTable;
