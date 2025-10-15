import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useCreateExpense, useExpenses } from "@/hooks/ExpenseHooks";

const Expenses: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { createExpenseWithUser, isLoading, error } = useCreateExpense();
  const { expenses, userId, handlePaid } = useExpenses();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-28 p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpenseWithUser(amount, description);
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-28 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          {/* Create New Expense Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Expense
            </h2>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="What was this expense for?"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding Expense..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Expenses You Owe */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Expenses You Owe
            </h2>
            <div className="space-y-3">
              {expenses.map(([key, amount]) => {
                const [ower, recipient] = key.split(",");
                if (ower === userId && amount > 0) {
                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">
                        You owe{" "}
                        <span className="font-semibold">{recipient}</span>:{" "}
                        <span className="font-semibold text-red-600">
                          ${amount}
                        </span>
                      </span>
                      <button
                        onClick={() => handlePaid(ower, recipient, amount)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  );
                }
                return null;
              })}
              {expenses.filter(([key, amount]) => {
                const [ower] = key.split(",");
                return ower === userId && amount > 0;
              }).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No outstanding expenses
                </p>
              )}
            </div>
          </div>

          {/* Expenses Owed to You */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Expenses Owed to You
            </h2>
            <div className="space-y-3">
              {expenses.map(([key, amount]) => {
                const [ower, recipient] = key.split(",");
                if (recipient === userId && amount > 0) {
                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 bg-green-50 rounded-lg"
                    >
                      <span className="text-gray-700">
                        <span className="font-semibold">{ower}</span> owes you:{" "}
                        <span className="font-semibold text-green-600">
                          ${amount}
                        </span>
                      </span>
                    </div>
                  );
                }
                return null;
              })}
              {expenses.filter(([key, amount]) => {
                const [, recipient] = key.split(",");
                return recipient === userId && amount > 0;
              }).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No one owes you money
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
