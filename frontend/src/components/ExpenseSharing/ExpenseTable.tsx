import React, { useState, useEffect } from 'react';

interface ExpVisualProps {
  groupId: string;
  userId: string;
}

const ExpenseTable: React.FC<ExpVisualProps> = ({ groupId, userId }) => {
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`/calculate_expenses/${groupId}`);
        const data = await response.json();
        setExpenses(data.net_owes);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [groupId]);

  const handlePaid = async (payerId: string, recipientId: string, amount: number) => {
    try {
      const response = await fetch('/api/expense_payment', {
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
        <h3 style={{ color: '#007bff' }}>Amounts You Owe</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if (ower === userId && amount > 0) {
            return (
              <div key={key} className="mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>You owe {recipient}: ${amount}</span>
                  <button
                    className="btn btn-success btn-sm"
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
      <div className="col-md-6">
        <h3 style={{ color: '#007bff' }}>Amounts Owed to You</h3>
        {filteredExpenses.map(([key, amount]) => {
          const [ower, recipient] = key.split(',');
          if (recipient === userId && amount > 0) {
            return (
              <div key={key} className="mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                <div className="d-flex justify-content-between align-items-center">
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