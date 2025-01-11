import React, { useState } from "react";
import { useAssignChore } from "@/hooks/ChoreHooks";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

interface Chore {
  id: string;
  name: string;
}

interface AssignChoreFormProps {
  chore: Chore;
  users: User[];
  onChoreAssigned: () => void;
}

const AssignChoreForm: React.FC<AssignChoreFormProps> = ({
  chore,
  users,
  onChoreAssigned, // callback to update the chores
}) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  const { assignChoreWithPayload, isLoading } = useAssignChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignChoreWithPayload(selectedUser, chore.id, selectedDueDate);
      onChoreAssigned();
      // refresh selections
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning chore:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card  ">
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
                {user.first_name + " " + user.last_name}
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

        <button type="submit" disabled={!selectedUser || !selectedDueDate}>
          {isLoading ? "Assigning..." : "Assign Chore"}
        </button>
      </form>
    </div>
  );
};

export default AssignChoreForm;
