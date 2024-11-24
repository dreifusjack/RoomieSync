import React, { useState } from 'react';
import ExpenseForm from '@/components/ExpenseSharing/ExpenseForm';
import ExpenseTable from '@/components/ExpenseSharing/ExpenseTable';
import Sidebar from '@/components/Sidebar';
import styles from '@/styles/Explore.module.css';

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
};

export default Expenses;
