import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseForm = ({ addExpense, userId, groupId }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      amount,
      description,
      paid_by: userId, 
      group_id: groupId, 
      is_paid: false,
    };
    try {
      const response = await axios.post('/add_expense', newExpense);
      addExpense(response.data);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Expense</button>
    </form>
  );
};

const ExpenseTable = ({ groupId, userId }) => {
  const [expenses, setExpenses] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/calculate_expenses/${groupId}`);
        setExpenses(response.data.net_owes);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [groupId]);

  const handlePaid = async (payerId, recipientId) => {
    try {
      await axios.post('/api/expense_payment', {
        amount_paid: expenses[payerId][recipientId],
        recipient: recipientId,
        payer: payerId,
      });
      setExpenses((prevExpenses) => ({
        ...prevExpenses,
        [payerId]: {
          ...prevExpenses[payerId],
          [recipientId]: 0,
        },
      }));
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const filteredExpenses = Object.entries(expenses).filter(
    ([key, value]) => key.includes(userId)
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h3>Amounts You Owe</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if ((recipient === userId && amount <= 0) || (ower === userId && amount >= 0)) {
            return (
              <div key={key} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>You owe {recipient}: ${amount}</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handlePaid(ower, recipient)}
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
      <div className="col-md-6">
        <h3>Amounts Owed to You</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if ((recipient === userId && amount >= 0) || (ower === userId && amount <= 0)) {
            return (
              <div key={key} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{ower} owes you: ${-amount}</span>
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

const ExpenseSharingPage = ({ groupId, userId }) => {
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