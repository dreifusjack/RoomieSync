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
  assignChoreFunc: () => void;
}

const AssignChoreForm: React.FC<AssignChoreFormProps> = ({
  chores,
  users,
  assignChoreFunc, // callback to update the chores
}) => {
  const [selectedChore, setSelectedChore] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/chores/assign-chore", {
        choreId: selectedChore,
        userId: selectedUser,
      });
      assignChoreFunc();
      // refresh selections
      setSelectedChore("");
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning chore:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assign-chore-form">
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

      <button type="submit" disabled={!selectedChore || !selectedUser}>
        Assign Chore
      </button>
    </form>
  );
};

export default AssignChoreForm;
