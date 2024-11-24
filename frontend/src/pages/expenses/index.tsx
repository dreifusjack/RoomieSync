import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseForm from '@/components/ExpenseSharing/ExpenseForm';
import ExpenseTable from '@/components/ExpenseSharing/ExpenseTable';

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

const ExpenseSharingPage: React.FC<ExpenseSharingPageProps> = ({ userId, groupId }) => {
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
    <div className="container mt-5">
      <h1 className="text-primary">Expense Sharing</h1>
      <ExpenseForm addExpense={addExpense} userId={userId} groupId={groupId} />
      <ExpenseTable groupId={groupId} userId={userId} />
    </div>
  );
};

export default ExpenseSharingPage;