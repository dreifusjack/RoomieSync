import React, { useState, useEffect } from 'react';

interface ExpenseProps {
  addExpense: (expense: any) => void;
}

const BASE_URL = 'http://127.0.0.1:3000';

const fetchUserDetails = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${BASE_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }

  return await response.json();
};

const ExpenseForm: React.FC<ExpenseProps> = ({ addExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userData = await fetchUserDetails();
        setUserId(userData.id);
        setGroupId(userData.group_id);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      <div className="form-group" style={{ marginBottom: '15px' }}>
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
      <div className="form-group" style={{ marginBottom: '15px' }}>
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
      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#007bff', borderColor: '#007bff', marginTop: '15px' }}>Add Expense</button>
    </form>
  );
};

export default ExpenseForm;