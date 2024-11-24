import React, { useState, useEffect } from 'react';

interface ExpenseProps {
  addExpense: (expense: any) => void;
  userId: string;
  groupId: string;
}

const ExpenseForm: React.FC<ExpenseProps> = ({ addExpense, userId, groupId }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

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
      const response = await fetch('/add_expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
      const data = await response.json();
      addExpense(data);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
      <div className="form-group">
        <label style={{ color: '#007bff' }}>Amount</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ borderColor: '#007bff' }}
        />
      </div>
      <div className="form-group">
        <label style={{ color: '#007bff' }}>Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ borderColor: '#007bff' }}
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>Add Expense</button>
    </form>
  );
};

export default ExpenseForm;