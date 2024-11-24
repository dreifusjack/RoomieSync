import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseSharingPage: React.FC = ({ groupId, userId }) => {
  const [expenses, setExpenses] = useState({});

  const addExpense = (expense) => {
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