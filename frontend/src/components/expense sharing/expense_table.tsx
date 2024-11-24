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