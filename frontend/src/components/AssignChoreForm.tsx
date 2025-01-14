import React, { useState } from "react";
import { useAssignChore } from "@/hooks/ChoreHooks";
import styles from "../styles/Modal.module.css";
import { Button } from "@mui/material";
import { User } from "@/types/user-types";
import { Chore } from "@/types/chore-types";

interface AssignChoreFormProps {
  chore: Chore;
  users: User[];
  onChoreAssigned: () => void;
}

const AssignChoreForm: React.FC<AssignChoreFormProps> = ({
  chore,
  users,
  onChoreAssigned,
}) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  const { assignChoreWithPayload, isLoading } = useAssignChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignChoreWithPayload(selectedUser, chore.id, selectedDueDate);
      onChoreAssigned();
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning chore:", error);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.floatingLabelGroup}>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name + " " + user.last_name}
              </option>
            ))}
          </select>
          <label htmlFor="user" className={styles.floatingLabel}>
            User
          </label>
        </div>
        <div className={styles.floatingLabelGroup}>
          <input
            type="date"
            id="dueDate"
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
            required
            className={styles.floatingInput}
          />
          <label htmlFor="dueDate" className={styles.floatingLabel}>
            Due Date
          </label>
        </div>

        <Button type="submit">
          {isLoading ? "Assigning..." : "Assign Chore"}
        </Button>
      </form>
    </div>
  );
};

export default AssignChoreForm;
