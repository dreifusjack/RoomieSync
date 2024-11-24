import React, { useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
}

interface Chore {
  id: string;
  name: string;
}

interface AssignChoreFormProps {
  chores: Chore[];
  users: User[];
  onChoreAssigned: () => void;
}

const AssignChoreForm: React.FC<AssignChoreFormProps> = ({
  chores,
  users,
  onChoreAssigned, // callback to update the chores
}) => {
  const [selectedChore, setSelectedChore] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/chores/user/${selectedUser}`, {
        chore_id: selectedChore,
        due_date: selectedDueDate,
      });
      onChoreAssigned();
      // refresh selections
      setSelectedChore("");
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning chore:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card  ">
        <div>
          <label>Select Chore</label>
          <select
            id="chore"
            value={selectedChore}
            onChange={(e) => setSelectedChore(e.target.value)}
            required
          >
            <option value="">-- Select Chore --</option>
            {chores.map((chore) => (
              <option key={chore.id} value={chore.id}>
                {chore.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="user">Select User</label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!selectedChore || !selectedUser || !selectedDueDate}
        >
          Assign Chore
        </button>
      </form>
    </div>
  );
};

export default AssignChoreForm;
