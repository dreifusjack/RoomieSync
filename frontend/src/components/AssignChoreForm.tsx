import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { Button } from "@mui/material";
import { User } from "@/types/user-types";
import { useAssignChore } from "@/hooks/chores.hooks";
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

  const assignChoreMutation = useAssignChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dueDateISO = new Date(selectedDueDate).toISOString();

    assignChoreMutation.mutate(
      {
        choreId: chore.id,
        payload: { userId: selectedUser, dueDate: dueDateISO },
      },
      {
        onSuccess: () => {
          onChoreAssigned();
          setSelectedUser("");
          setSelectedDueDate("");
        },
        onError: (error) => {
          console.error("Error assigning chore:", error);
        },
      }
    );
  };

  return (
    <div className={styles.modalContainer}>
      {assignChoreMutation.error && (
        <div className={styles.errorMessage}>
          {assignChoreMutation.error.message}
        </div>
      )}
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
                {user.firstName + " " + user.lastName}
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
          {assignChoreMutation.isPending ? "Assigning..." : "Assign Chore"}
        </Button>
      </form>
    </div>
  );
};

export default AssignChoreForm;
