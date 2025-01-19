import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Feature.module.css";
import { useCreateExpense, useExpenses } from "@/hooks/ExpenseHooks";

/*
interface Expense {
  paid_by: string;
  group_id: string;
  amount: number;
  description: string;
  is_paid: boolean;
}

interface ExpenseSharingPageProps {
  userId: string;
  groupId: string;
}

const Expenses: React.FC<ExpenseSharingPageProps> = ({ userId, groupId }) => {
  const [expenses, setExpenses] = useState<{ [key: string]: { [key: string]: number } }>({});

  const addExpense = (expense: Expense) => {
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [expense.paid_by]: {
        ...prevExpenses[expense.paid_by],
        [expense.group_id]: expense.amount,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className="text-primary">Expense Sharing</h1>
        <ExpenseForm addExpense={addExpense} />
        <ExpenseTable/>
      </div>
    </div>
  );
}; */

const Expenses: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { createExpenseWithUser, isLoading, error } = useCreateExpense();
  const { expenses, userId, handlePaid } = useExpenses();

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
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
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Expenses</h1>
        <hr className={styles.horizontalLine} />
        <h2 className={styles.subheading}>Create New Expense</h2>
        <form className={styles.form} onSubmit={handleCreateExpense}>
          <div>
            <label className={styles.label}>
              Amount:
              <input
                className={styles.input}
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Description:
              <input
                className={styles.input}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <button className={styles.button} type="submit">
            {isLoading ? "Adding Expense..." : "Add Expense"}
          </button>
        </form>

        <h2 className={styles.subheading}>Expenses You Owe</h2>
        <div className={styles.alarmList}>
          {expenses.map(([key, amount]) => {
            const [ower, recipient] = key.split(",");
            if (ower === userId && amount > 0) {
              return (
                <div
                  key={key}
                  className="mb-3"
                  style={{
                    backgroundColor: "#e9ecef",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: "10px" }}
                  >
                    <span>
                      You owe {recipient}: ${amount}
                    </span>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handlePaid(ower, recipient, amount)}
                      style={{ marginLeft: "10px" }}
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

        <h2 className={styles.subheading}>Expenses Owed to You</h2>
        <div className={styles.alarmList}>
          {expenses.map(([key, amount]) => {
            const [ower, recipient] = key.split(",");
            if (recipient === userId && amount > 0) {
              return (
                <div
                  key={key}
                  className="mb-3"
                  style={{
                    backgroundColor: "#e9ecef",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: "10px" }}
                  >
                    <span>
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
    </div>
  );
};

export default Expenses;
