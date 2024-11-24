const ExpenseForm = ({addExpense, userId, groupId }) => {
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
      const response = await fetch.post('/add_expense', newExpense);
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
