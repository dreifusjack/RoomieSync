import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { Button } from "@mui/material";
import { useCreateChore } from "@/hooks/chores.hooks";

interface CreateChoreFormProps {
  onChoreCreated: () => void;
}

const CreateChoreForm: React.FC<CreateChoreFormProps> = ({
  onChoreCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cadence, setCadence] = useState("");
  const createChoreMutation = useCreateChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createChoreMutation.mutate(
      {
        name,
        description,
        cadence,
      },
      {
        onSuccess: () => {
          onChoreCreated();
          setName("");
          setDescription("");
          setCadence("");
        },
        onError: (error) => {
          console.error("Error creating chore:", error);
        },
      }
    );
  };

  return (
    <div className={styles.modalContainer}>
      {createChoreMutation.error && (
        <div className={styles.errorMessage}>
          {createChoreMutation.error.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.floatingLabelGroup}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.floatingInput}
          />
          <label htmlFor="name" className={styles.floatingLabel}>
            Chore Name
          </label>
        </div>

        <div className={styles.floatingLabelGroup}>
          <textarea
            id="description"
            className={styles.floatingInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="description" className={styles.floatingLabel}>
            Description
          </label>
        </div>

        <div className={styles.floatingLabelGroup}>
          <input
            id="cadence"
            type="text"
            className={styles.floatingInput}
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
            required
          />
          <label htmlFor="cadence" className={styles.floatingLabel}>
            Cadence
          </label>
        </div>

        <Button type="submit">Create Chore</Button>
      </form>
    </div>
  );
};

export default CreateChoreForm;
