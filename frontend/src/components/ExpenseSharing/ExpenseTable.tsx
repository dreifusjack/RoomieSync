import React, { useState, useEffect } from 'react';

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

const fetchUserGroup = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/group/user/${userId}`);
  return await response.json();
};

const ExpenseTable: React.FC = () => {
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userData = await fetchUserDetails();
        setUserId(userData.id);

        // Fetch group ID for the user
        const groupData = await fetchUserGroup(userData.id);
        setGroupId(groupData.groupId);

        // Fetch expenses for the group
        const response = await fetch(`${BASE_URL}/calculate_expenses/${groupData.groupId}`);
        const data = await response.json();
        setExpenses(data.net_owes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePaid = async (payerId: string, recipientId: string, amount: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/expense_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        console.error('Error marking as paid:', await response.text());
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const filteredExpenses = Object.entries(expenses).filter(
    ([key, value]) => key.includes(userId)
  );

  return (
    <div className="row" style={{ backgroundColor: '#f0f4f8', color: '#333' }}>
      <div className="col-md-6">
        <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Amounts You Owe</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if (ower === userId && amount > 0) {
            return (
              <div key={key} className="mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '10px' }}>
                  <span>You owe {recipient}: ${amount}</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handlePaid(ower, recipient, amount)}
                    style={{ marginLeft: '10px' }}
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
        <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Amounts Owed to You</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if (recipient === userId && amount > 0) {
            return (
              <div key={key} className="mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '10px' }}>
                  <span>{ower} owes you: ${amount}</span>
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